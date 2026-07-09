from fastapi import APIRouter, HTTPException

from app.schemas import TamByTier, TamTier
from app.snowflake_client import is_snowflake_configured, query_snowflake

router = APIRouter(prefix="/api/tam", tags=["tam"])

# Canonical SOM ladder order (cold -> hot). NULL tier = "Unaware".
# From knowledge/brand_som_tiers.md (Aurora's SOM_TIER_ORDER).
_LADDER = [
    ("unaware", "Unaware"),
    ("aware", "Aware"),
    ("interested", "Interested"),
    ("evaluating", "Evaluating"),
    ("selecting", "Selecting"),
]
_LABELS = dict(_LADDER)
_ORDER = {tier: i for i, (tier, _) in enumerate(_LADDER)}


@router.get("/by-tier", response_model=TamByTier)
def tam_by_tier():
    """Total addressable market (sum of annual GMV) of parent brands
    (domain = parent_domain), broken down by SOM tier."""
    if not is_snowflake_configured():
        raise HTTPException(status_code=503, detail="Snowflake is not configured.")

    rows = query_snowflake(
        "SELECT COALESCE(LOWER(tier), 'unaware') AS tier, "
        "COUNT(*) AS brand_count, SUM(marketing_annual_gmv) AS gmv "
        "FROM internal.marketing.brands "
        "WHERE domain = parent_domain "
        "GROUP BY 1"
    )

    tiers = [
        TamTier(
            tier=str(r["TIER"]),
            label=_LABELS.get(str(r["TIER"]), str(r["TIER"]).title()),
            gmv=float(r["GMV"] or 0),
            brand_count=int(r["BRAND_COUNT"] or 0),
        )
        for r in rows
    ]
    tiers.sort(key=lambda t: _ORDER.get(t.tier, len(_ORDER)))

    return TamByTier(
        total_gmv=sum(t.gmv for t in tiers),
        total_brands=sum(t.brand_count for t in tiers),
        tiers=tiers,
    )
