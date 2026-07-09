from fastapi import APIRouter
from fastapi.responses import JSONResponse

from app.snowflake_client import is_snowflake_configured, query_snowflake

router = APIRouter(prefix="/api/snowflake", tags=["snowflake"])


@router.get("/test")
def snowflake_test():
    """Connectivity check — ported from ../aurora's /api/snowflake/test."""
    if not is_snowflake_configured():
        return JSONResponse(
            status_code=503,
            content={
                "ok": False,
                "error": (
                    "Snowflake env vars missing. Set SNOWFLAKE_ACCOUNT, "
                    "SNOWFLAKE_USER, SNOWFLAKE_PRIVATE_KEY (and optional "
                    "ROLE/WAREHOUSE/DATABASE/SCHEMA)."
                ),
            },
        )
    try:
        rows = query_snowflake(
            "SELECT CURRENT_VERSION() AS V, CURRENT_USER() AS U, "
            "CURRENT_ROLE() AS R, CURRENT_WAREHOUSE() AS W"
        )
        return {"ok": True, "rows": rows}
    except Exception as err:
        return JSONResponse(status_code=500, content={"ok": False, "error": str(err)})
