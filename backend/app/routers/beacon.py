from fastapi import APIRouter, HTTPException

from app.beacon import build_beacon_accounts, classify_persona
from app.config import get_settings
from app.gamma import generate_deck
from app.schemas import BeaconAccounts, BeaconGammaRequest, BeaconGammaResult
from app.supabase_client import get_client

router = APIRouter(prefix="/api/beacon", tags=["beacon"])

_ACCOUNT_GAMMA_COLS = (
    "domain,seed_brand,company_name,industry_cleaned,marketing_annual_gmv,"
    "rob_tam__shopify_gmv,rob_tam__category,estimated_employee_count,"
    "in_market_buckets,gamma_deck_url"
)


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
