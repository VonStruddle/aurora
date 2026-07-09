from fastapi import APIRouter, HTTPException

from app.beacon import build_beacon_accounts, classify_persona
from app.config import get_settings
from app.gamma import generate_deck
from app.landing import build_landing_row
from app.schemas import (
    BeaconAccounts,
    BeaconGammaRequest,
    BeaconGammaResult,
    BeaconLandingRequest,
    BeaconLandingResult,
)
from app.supabase_client import get_client

router = APIRouter(prefix="/api/beacon", tags=["beacon"])

_ACCOUNT_GAMMA_COLS = (
    "domain,seed_brand,company_name,industry_cleaned,marketing_annual_gmv,"
    "rob_tam__shopify_gmv,rob_tam__category,estimated_employee_count,"
    "in_market_buckets,gamma_deck_url"
)
_ACCOUNT_LANDING_COLS = (
    "domain,seed_brand,company_name,industry_cleaned,marketing_annual_gmv,"
    "rob_tam__shopify_gmv,estimated_employee_count,in_market_buckets,logo,landing_id"
)


def _champion(client, settings, domain: str) -> dict:
    contacts = (
        client.table(settings.target_contacts_table)
        .select("full_name,first_name,job_title,job_function,department,persona_score")
        .eq("parent_domain", domain)
        .execute()
        .data
    )
    contacts = [c for c in contacts if c.get("full_name") or c.get("first_name")]
    contacts.sort(key=lambda c: c.get("persona_score") or 0, reverse=True)
    return contacts[0] if contacts else {}


@router.get("/accounts", response_model=BeaconAccounts)
async def beacon_accounts():
    """Weekly Hot Accounts — the 20 target accounts + their top contacts,
    with per-contact sales angles (LLM, template fallback)."""
    return await build_beacon_accounts()


@router.post("/gamma", response_model=BeaconGammaResult)
def beacon_gamma(req: BeaconGammaRequest):
    """Generate (once, then cache) a personalized Polar deck for an account via
    the Gamma API. Returns the deck URL."""
    settings = get_settings()
    if not settings.gamma_configured:
        raise HTTPException(status_code=503, detail="Gamma is not configured (set GAMMA_API_KEY).")

    client = get_client()
    domain = req.domain.strip().lower()

    rows = (
        client.table(settings.target_accounts_table)
        .select(_ACCOUNT_GAMMA_COLS)
        .eq("domain", domain)
        .limit(1)
        .execute()
        .data
    )
    if not rows:
        raise HTTPException(status_code=404, detail=f"Account not found: {domain}")
    account = rows[0]

    if account.get("gamma_deck_url"):
        return BeaconGammaResult(domain=domain, url=account["gamma_deck_url"], cached=True)

    contacts = (
        client.table(settings.target_contacts_table)
        .select("full_name,first_name,job_title,job_function,department,persona_score")
        .eq("parent_domain", domain)
        .execute()
        .data
    )
    contacts = [c for c in contacts if c.get("full_name") or c.get("first_name")]
    contacts.sort(key=lambda c: c.get("persona_score") or 0, reverse=True)
    contact = contacts[0] if contacts else {}
    persona = classify_persona(
        contact.get("job_title"), contact.get("job_function"), contact.get("department")
    )

    try:
        url = generate_deck(account, contact, persona)
    except Exception as e:  # surface a clean error to the UI
        raise HTTPException(status_code=502, detail=f"Gamma generation failed: {e}")

    client.table(settings.target_accounts_table).update({"gamma_deck_url": url}).eq(
        "domain", domain
    ).execute()
    return BeaconGammaResult(domain=domain, url=url, cached=False)


@router.post("/landing", response_model=BeaconLandingResult)
def beacon_landing(req: BeaconLandingRequest):
    """Generate (once, then cache) a personalized landing page for an account,
    stored in hackathon_landings. Returns its id (rendered at /#/landing/{id})."""
    settings = get_settings()
    client = get_client()
    domain = req.domain.strip().lower()

    rows = (
        client.table(settings.target_accounts_table)
        .select(_ACCOUNT_LANDING_COLS)
        .eq("domain", domain)
        .limit(1)
        .execute()
        .data
    )
    if not rows:
        raise HTTPException(status_code=404, detail=f"Account not found: {domain}")
    account = rows[0]

    if account.get("landing_id"):
        return BeaconLandingResult(domain=domain, id=str(account["landing_id"]), cached=True)

    row = build_landing_row(account, _champion(client, settings, domain))
    inserted = client.table("hackathon_landings").insert(row).execute().data
    if not inserted:
        raise HTTPException(status_code=502, detail="Landing insert returned no row")
    landing_id = str(inserted[0]["id"])

    client.table(settings.target_accounts_table).update({"landing_id": landing_id}).eq(
        "domain", domain
    ).execute()
    return BeaconLandingResult(domain=domain, id=landing_id, cached=False)
