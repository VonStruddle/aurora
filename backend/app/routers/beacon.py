from fastapi import APIRouter

from app.beacon import build_beacon_accounts
from app.schemas import BeaconAccounts

router = APIRouter(prefix="/api/beacon", tags=["beacon"])


@router.get("/accounts", response_model=BeaconAccounts)
async def beacon_accounts():
    """Weekly Hot Accounts — the 20 target accounts + their top contacts,
    with per-contact sales angles (LLM, template fallback)."""
    return await build_beacon_accounts()
