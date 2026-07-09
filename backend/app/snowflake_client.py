"""Snowflake access, ported from ../aurora's src/lib/snowflake/client.ts.

Uses JWT key-pair auth (SNOWFLAKE_JWT). A fresh connection is opened per query
and torn down in a finally block, matching the Node client's stateless approach.
"""

import logging
from typing import Any, Sequence

import snowflake.connector
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import serialization

from app.config import get_settings

# Quiet the connector's chatty INFO logging (mirrors `logLevel: "OFF"` in aurora).
logging.getLogger("snowflake.connector").setLevel(logging.WARNING)

# Match aurora's `?` bind placeholders so query ports are drop-in. This is a
# module-level connector setting; safe because Snowflake is the only user.
snowflake.connector.paramstyle = "qmark"


def is_snowflake_configured() -> bool:
    return get_settings().snowflake_configured


def _private_key_der() -> bytes:
    """Parse the PEM private key from env into DER bytes for the connector."""
    settings = get_settings()
    pem = settings.snowflake_private_key.replace("\\n", "\n").encode()
    passphrase = settings.snowflake_private_key_passphrase or None
    key = serialization.load_pem_private_key(
        pem,
        password=passphrase.encode() if passphrase else None,
        backend=default_backend(),
    )
    return key.private_bytes(
        encoding=serialization.Encoding.DER,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.NoEncryption(),
    )


def _connect() -> "snowflake.connector.SnowflakeConnection":
    settings = get_settings()
    if not settings.snowflake_configured:
        raise RuntimeError(
            "Snowflake env vars missing: SNOWFLAKE_ACCOUNT, SNOWFLAKE_USER, "
            "SNOWFLAKE_PRIVATE_KEY"
        )
    # Only pass optional context params when set, so Snowflake falls back to the
    # user/role defaults otherwise (same behaviour as the Node client).
    kwargs: dict[str, Any] = {
        "account": settings.snowflake_account,
        "user": settings.snowflake_user,
        "private_key": _private_key_der(),
    }
    if settings.snowflake_role:
        kwargs["role"] = settings.snowflake_role
    if settings.snowflake_warehouse:
        kwargs["warehouse"] = settings.snowflake_warehouse
    if settings.snowflake_database:
        kwargs["database"] = settings.snowflake_database
    if settings.snowflake_schema:
        kwargs["schema"] = settings.snowflake_schema
    return snowflake.connector.connect(**kwargs)


def query_snowflake(
    sql_text: str, binds: Sequence[Any] | None = None
) -> list[dict[str, Any]]:
    """Run a query and return rows as dicts keyed by (uppercase) column name."""
    conn = _connect()
    try:
        cur = conn.cursor(snowflake.connector.DictCursor)
        try:
            cur.execute(sql_text, tuple(binds) if binds else None)
            return cur.fetchall()
        finally:
            cur.close()
    finally:
        conn.close()
