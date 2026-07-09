from fastapi import APIRouter

from app.config import get_settings
from app.supabase_client import get_client

router = APIRouter(tags=["health"])


@router.get("/api/health")
def health():
    """Liveness + Supabase REST connectivity check."""
    # A reachable PostgREST returns 200 (rows may be empty if RLS hides them).
    # Probe a table this app actually uses (hackathon_items was removed).
    get_client().table(get_settings().target_accounts_table).select("domain").limit(1).execute()
    return {"status": "ok", "database": "connected"}
