from fastapi import APIRouter

from app.supabase_client import items_table

router = APIRouter(tags=["health"])


@router.get("/api/health")
def health():
    """Liveness + Supabase REST connectivity check."""
    # A reachable PostgREST returns 200 (rows may be empty if RLS hides them).
    items_table().select("id").limit(1).execute()
    return {"status": "ok", "database": "connected"}
