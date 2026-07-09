from fastapi import APIRouter, HTTPException, Query

from app.schemas import CompaniesPage, CompanyOut
from app.snowflake_client import is_snowflake_configured, query_snowflake

router = APIRouter(prefix="/api/companies", tags=["companies"])

# Only the columns the UI shows, plus `tier`.
_COLUMNS = (
    "company_name, domain, platform, som_category, tier, "
    "marketing_gmv_category, industry_cleaned, has_deal"
)


@router.get("", response_model=CompaniesPage)
def list_companies(
    page: int = Query(1, ge=1),
    page_size: int = Query(25, ge=1, le=100),
):
    """Parent brands from internal.marketing.brands (domain = parent_domain),
    paginated. Ordered by domain for stable paging across requests."""
    if not is_snowflake_configured():
        raise HTTPException(status_code=503, detail="Snowflake is not configured.")

    offset = (page - 1) * page_size
    # Fetch one extra row to detect whether a next page exists.
    rows = query_snowflake(
        f"SELECT {_COLUMNS} FROM internal.marketing.brands "
        "WHERE domain = parent_domain "
        "ORDER BY domain, domain_id "
        "LIMIT ? OFFSET ?",
        [page_size + 1, offset],
    )
    has_more = len(rows) > page_size
    companies = [
        CompanyOut(**{k.lower(): v for k, v in row.items()})
        for row in rows[:page_size]
    ]
    return CompaniesPage(
        companies=companies, page=page, page_size=page_size, has_more=has_more
    )
