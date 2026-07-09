"""Ingest a curated 20-account target list + their contacts into Supabase.

Source: Snowflake internal.marketing.brands (accounts) and
internal.marketing.brand_contacts (contacts, joined on parent_domain).
Destination: public.hackathon_target_accounts and public.hackathon_target_contacts.

Idempotent — upserts on the primary key, so it can be re-run to refresh.

Run from the backend/ dir:
    PYTHONPATH=. python scripts/ingest_target_accounts.py
"""

from decimal import Decimal

from app.snowflake_client import query_snowflake
from app.supabase_client import get_client

# Curated seed list: (brand display name, domain, GMV in $M, signal shorthand).
SEED = [
    ("UrbanStems", "urbanstems.com", 176, "mvp"),
    ("Benchmade", "benchmade.com", 156, "mvp"),
    ("Cozy Earth", "cozyearth.com", 92, "mvp+price+li"),
    ("STAUD", "staud.clothing", 87, "mvp"),
    ("SuitShop", "suitshop.com", 82, "mvp"),
    ("Melissa", "shopmelissa.com", 66, "mvp"),
    ("Denim Tears", "denimtears.com", 60, "mvp"),
    ("Marine Layer", "marinelayer.com", 60, "mvp"),
    ("Thuma", "thuma.co", 54, "mvp+li"),
    ("Shapermint", "shapermint.com", 46, "mvp+li"),
    ("Skull Shaver", "skullshaver.com", 46, "mvp"),
    ("Jaanuu", "jaanuu.com", 39, "mvp"),
    ("David Protein", "davidprotein.com", 30, "mvp"),
    ("LifeStraw", "lifestraw.com", 29, "mvp+rev"),
    ("Normal Brand", "thenormalbrand.com", 29, "mvp"),
    ("Clive", "clivecoffee.com", 26, "mvp"),
    ("&Collar", "andcollar.com", 25, "mvp+li"),
    ("Boy Smells", "boysmells.com", 22, "mvp+rev"),
    ("Topo Designs", "topodesigns.com", 22, "mvp"),
    ("Modloft", "modloft.com", 16, "mvp"),
]

DOMAINS = [d for _, d, _, _ in SEED]


def _num(v):
    """Coerce Snowflake NUMBER/Decimal to a JSON-serializable float."""
    if v is None:
        return None
    if isinstance(v, Decimal):
        return float(v)
    return v


def _hubspot_id(v):
    if v is None:
        return None
    try:
        return str(int(v))  # HUBSPOT_ID is a FLOAT in Snowflake
    except (ValueError, TypeError):
        return str(v)


def ingest_accounts() -> int:
    ph = ",".join(["?"] * len(DOMAINS))
    rows = query_snowflake(
        f"""SELECT LOWER(domain) AS domain, LOWER(parent_domain) AS parent_domain,
                   company_name, marketing_annual_gmv, tier, som_category,
                   industry_cleaned, platform, has_deal, estimated_employee_count,
                   hubspot_id
            FROM internal.marketing.brands
            WHERE LOWER(domain) IN ({ph})""",
        [d.lower() for d in DOMAINS],
    )
    by_domain = {r["DOMAIN"]: r for r in rows}
    seed_meta = {d: (brand, gmv, sig) for brand, d, gmv, sig in SEED}

    records = []
    for domain, r in by_domain.items():
        brand, gmv_musd, sig = seed_meta[domain]
        records.append(
            {
                "domain": domain,
                "brand": brand,
                "gmv_musd": gmv_musd,
                "sig": sig,
                "company_name": r["COMPANY_NAME"],
                "marketing_annual_gmv": _num(r["MARKETING_ANNUAL_GMV"]),
                "tier": r["TIER"],
                "som_category": r["SOM_CATEGORY"],
                "industry": r["INDUSTRY_CLEANED"],
                "platform": r["PLATFORM"],
                "has_deal": r["HAS_DEAL"],
                "estimated_employee_count": _num(r["ESTIMATED_EMPLOYEE_COUNT"]),
                "hubspot_id": _hubspot_id(r["HUBSPOT_ID"]),
                "parent_domain": r["PARENT_DOMAIN"],
            }
        )

    get_client().table("hackathon_target_accounts").upsert(
        records, on_conflict="domain"
    ).execute()
    missing = set(DOMAINS) - set(by_domain)
    if missing:
        print(f"  WARNING: not found in brands: {sorted(missing)}")
    return len(records)


def ingest_contacts() -> int:
    ph = ",".join(["?"] * len(DOMAINS))
    rows = query_snowflake(
        f"""SELECT id, LOWER(parent_domain) AS parent_domain, LOWER(domain) AS domain,
                   full_name, first_name, last_name, job_title, job_seniority,
                   department, job_function, email, personal_email,
                   has_verified_email, linkedin_page, country, city, state,
                   persona_score, is_icp, is_likely_to_engage, company_name
            FROM internal.marketing.brand_contacts
            WHERE LOWER(parent_domain) IN ({ph})
              AND id IS NOT NULL""",  # skip degenerate id-less stubs (no email/name)
        [d.lower() for d in DOMAINS],
    )
    records = [
        {
            "id": r["ID"],
            "parent_domain": r["PARENT_DOMAIN"],
            "domain": r["DOMAIN"],
            "full_name": r["FULL_NAME"],
            "first_name": r["FIRST_NAME"],
            "last_name": r["LAST_NAME"],
            "job_title": r["JOB_TITLE"],
            "job_seniority": r["JOB_SENIORITY"],
            "department": r["DEPARTMENT"],
            "job_function": r["JOB_FUNCTION"],
            "email": r["EMAIL"],
            "personal_email": r["PERSONAL_EMAIL"],
            "has_verified_email": r["HAS_VERIFIED_EMAIL"],
            "linkedin_page": r["LINKEDIN_PAGE"],
            "country": r["COUNTRY"],
            "city": r["CITY"],
            "state": r["STATE"],
            "persona_score": _num(r["PERSONA_SCORE"]),
            "is_icp": r["IS_ICP"],
            "is_likely_to_engage": r["IS_LIKELY_TO_ENGAGE"],
            "company_name": r["COMPANY_NAME"],
        }
        for r in rows
    ]
    # De-dupe on id (defensive) and upsert in batches.
    seen, deduped = set(), []
    for rec in records:
        if rec["id"] in seen:
            continue
        seen.add(rec["id"])
        deduped.append(rec)

    table = get_client().table("hackathon_target_contacts")
    for i in range(0, len(deduped), 500):
        table.upsert(deduped[i : i + 500], on_conflict="id").execute()
    return len(deduped)


if __name__ == "__main__":
    n_acc = ingest_accounts()
    print(f"upserted {n_acc} accounts")
    n_con = ingest_contacts()
    print(f"upserted {n_con} contacts")
