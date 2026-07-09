from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="ignore"
    )

    supabase_url: str = ""

    # Prefer a service_role / secret key for server-side use: it bypasses RLS so
    # the backend can access RLS-protected tables. The publishable/anon key is
    # subject to RLS and is only a fallback.
    supabase_service_role_key: str = ""
    supabase_key: str = ""
    supabase_anon_key: str = ""

    # Comma-separated list of origins allowed to call the API (the Vite dev server).
    cors_origins: str = "http://localhost:5173"

    # Prefix applied to this project's tables in the shared `public` schema.
    table_prefix: str = "hackathon_"

    @property
    def supabase_api_key(self) -> str:
        return self.supabase_service_role_key or self.supabase_key or self.supabase_anon_key

    @property
    def items_table(self) -> str:
        return f"{self.table_prefix}items"

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
