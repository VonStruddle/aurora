from fastapi import APIRouter, HTTPException

from app.hubspot_client import (
    HubSpotError,
    batch_associate_default,
    is_hubspot_configured,
    upsert_by_property,
)
from app.schemas import HubSpotSyncRequest, HubSpotSyncResult
from app.supabase_client import get_client

router = APIRouter(prefix="/api/hubspot", tags=["hubspot"])

ACCOUNTS_TABLE = "hackathon_target_accounts"
CONTACTS_TABLE = "hackathon_target_contacts"


def _company_properties(acc: dict) -> dict:
    """Map a target account onto standard HubSpot company properties."""
    props: dict = {
        "name": acc.get("company_name") or acc.get("brand") or acc.get("domain"),
        "domain": acc.get("domain"),
    }
    emp = acc.get("estimated_employee_count")
    if emp:
        props["numberofemployees"] = int(emp)
    # Fold the curated context into the standard `description` field so it's
    # visible without provisioning custom properties.
    bits = []
    if acc.get("tier"):
        bits.append(f"Tier: {acc['tier']}")
    if acc.get("som_category"):
        bits.append(f"SOM: {acc['som_category']}")
    if acc.get("gmv_musd") is not None:
        bits.append(f"GMV: ${acc['gmv_musd']}M")
    if acc.get("sig"):
        bits.append(f"Signals: {acc['sig']}")
    if bits:
        props["description"] = " · ".join(bits)
    return {k: v for k, v in props.items() if v is not None}


def _contact_properties(c: dict) -> dict:
    """Map a target contact onto standard HubSpot contact properties."""
    props = {
        "email": c.get("email"),
        "firstname": c.get("first_name"),
        "lastname": c.get("last_name"),
        "jobtitle": c.get("job_title"),
        "city": c.get("city"),
        "state": c.get("state"),
        "country": c.get("country"),
    }
    return {k: v for k, v in props.items() if v}


@router.post("/sync", response_model=HubSpotSyncResult)
def sync_to_hubspot(payload: HubSpotSyncRequest | None = None):
    """Re-read target accounts + contacts from Supabase and push them to HubSpot:
    upsert companies (by domain), upsert contacts (by email), then associate each
    contact with its parent company. This is the "validate" action's backend."""
    if not is_hubspot_configured():
        raise HTTPException(status_code=503, detail="HubSpot is not configured.")

    domains = payload.domains if payload else None

    sb = get_client()
    acc_query = sb.table(ACCOUNTS_TABLE).select("*")
    if domains:
        acc_query = acc_query.in_("domain", domains)
    accounts = acc_query.execute().data or []
    if not accounts:
        raise HTTPException(status_code=404, detail="No target accounts to sync.")

    account_domains = [a["domain"] for a in accounts]
    contacts = (
        sb.table(CONTACTS_TABLE)
        .select("*")
        .in_("parent_domain", account_domains)
        .execute()
        .data
        or []
    )

    try:
        # 1) Companies — create-or-update by domain.
        domain_to_company_id = upsert_by_property(
            "companies", "domain", [_company_properties(a) for a in accounts]
        )

        # 2) Contacts — create-or-update by email (needed to key + associate).
        emailed = [c for c in contacts if c.get("email")]
        skipped = len(contacts) - len(emailed)
        email_to_contact_id = upsert_by_property(
            "contacts", "email", [_contact_properties(c) for c in emailed]
        )

        # 3) Associate each contact with its parent company.
        pairs: list[tuple[str, str]] = []
        for c in emailed:
            contact_id = email_to_contact_id.get(c["email"].lower())
            company_id = domain_to_company_id.get(
                (c.get("parent_domain") or "").lower()
            )
            if contact_id and company_id:
                pairs.append((contact_id, company_id))
        associations = batch_associate_default("contacts", "companies", pairs)
    except HubSpotError as exc:
        raise HTTPException(status_code=502, detail=f"HubSpot sync failed: {exc}")

    return HubSpotSyncResult(
        companies_synced=len(domain_to_company_id),
        contacts_synced=len(email_to_contact_id),
        contacts_skipped_no_email=skipped,
        associations_created=associations,
    )
