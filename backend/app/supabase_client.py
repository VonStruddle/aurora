from functools import lru_cache

from supabase import Client, create_client

from app.config import get_settings


@lru_cache
def get_client() -> Client:
    """Cached Supabase client. Talks to the project's REST API over HTTPS,
    which avoids the direct-Postgres IPv6/pooler networking issues."""
    settings = get_settings()
    if not settings.supabase_url or not settings.supabase_api_key:
        raise RuntimeError(
            "Supabase is not configured. Set SUPABASE_URL and a key in backend/.env "
            "(SUPABASE_SERVICE_ROLE_KEY recommended so the backend can bypass RLS)."
        )
    return create_client(settings.supabase_url, settings.supabase_api_key)


def items_table():
    """Query builder for this project's items table (e.g. `hackathon_items`)."""
    return get_client().table(get_settings().items_table)
