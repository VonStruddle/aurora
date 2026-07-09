from fastapi import APIRouter, HTTPException

from app.landing import build_config
from app.supabase_client import get_client

router = APIRouter(prefix="/api/landings", tags=["landings"])


@router.get("/{landing_id}")
def get_landing(landing_id: str):
    """Return the merged LandingConfig (row + persona template) for rendering."""
    rows = (
        get_client()
        .table("hackathon_landings")
        .select("*")
        .eq("id", landing_id)
        .limit(1)
        .execute()
        .data
    )
    if not rows:
        raise HTTPException(status_code=404, detail="Landing not found")
    return build_config(rows[0])
