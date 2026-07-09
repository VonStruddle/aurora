"""HubSpot CRM client (v3 objects + v4 associations).

Upserts companies/contacts and associates them. Auth is a HubSpot private-app
token (Bearer). Batch endpoints cap at 100 records per call, so inputs are
chunked. Stateless: a short-lived httpx.Client per call, mirroring the
Snowflake client's per-query connections.
"""

from __future__ import annotations

import logging
from typing import Any

import httpx

from app.config import get_settings

log = logging.getLogger(__name__)

BASE_URL = "https://api.hubapi.com"
_BATCH_LIMIT = 100
_TIMEOUT = 30.0


class HubSpotError(RuntimeError):
    """Raised when the HubSpot API returns a non-2xx response."""


def is_hubspot_configured() -> bool:
    return get_settings().hubspot_configured


def _client() -> httpx.Client:
    settings = get_settings()
    if not settings.hubspot_access_token:
        raise HubSpotError(
            "HubSpot is not configured. Set HUBSPOT_ACCESS_TOKEN in backend/.env."
        )
    return httpx.Client(
        base_url=BASE_URL,
        headers={
            "Authorization": f"Bearer {settings.hubspot_access_token}",
            "Content-Type": "application/json",
        },
        timeout=_TIMEOUT,
    )


def _chunks(seq: list, size: int = _BATCH_LIMIT):
    for i in range(0, len(seq), size):
        yield seq[i : i + size]


def _post(client: httpx.Client, path: str, payload: dict) -> dict:
    res = client.post(path, json=payload)
    if res.status_code >= 400:
        raise HubSpotError(f"POST {path} -> {res.status_code}: {res.text}")
    return res.json() if res.content else {}


def _search_existing(
    client: httpx.Client, object_type: str, property_name: str, values: list[str]
) -> dict[str, str]:
    """Return ``{value_lower: hubspot_id}`` for records whose `property_name`
    matches one of `values`. Uses the CRM Search API (case-insensitive `IN`)."""
    found: dict[str, str] = {}
    for chunk in _chunks(values):
        after: str | None = None
        while True:
            body: dict[str, Any] = {
                "filterGroups": [
                    {
                        "filters": [
                            {
                                "propertyName": property_name,
                                "operator": "IN",
                                "values": [v.lower() for v in chunk],
                            }
                        ]
                    }
                ],
                "properties": [property_name],
                "limit": 100,
            }
            if after:
                body["after"] = after
            data = _post(client, f"/crm/v3/objects/{object_type}/search", body)
            for r in data.get("results", []):
                key = (r.get("properties", {}).get(property_name) or "").lower()
                if key:
                    found[key] = r["id"]
            after = data.get("paging", {}).get("next", {}).get("after")
            if not after:
                break
    return found


def upsert_by_property(
    object_type: str, id_property: str, records: list[dict]
) -> dict[str, str]:
    """Create-or-update `object_type` records keyed by `id_property` (e.g.
    `domain` for companies, `email` for contacts). HubSpot's batch/upsert needs a
    property with a uniqueness constraint, which `domain`/`email` lack in most
    portals — so we search for existing records, update those, and create the
    rest. Each record is a flat property dict that must contain `id_property`.

    Returns ``{id_property_value_lower: hubspot_id}`` for every synced record.
    """
    records = [r for r in records if r.get(id_property)]
    if not records:
        return {}
    values = [str(r[id_property]) for r in records]

    with _client() as client:
        id_map = _search_existing(client, object_type, id_property, values)

        to_create, to_update = [], []
        for r in records:
            key = str(r[id_property]).lower()
            if key in id_map:
                to_update.append({"id": id_map[key], "properties": r})
            else:
                to_create.append({"properties": r})

        for chunk in _chunks(to_create):
            data = _post(
                client, f"/crm/v3/objects/{object_type}/batch/create", {"inputs": chunk}
            )
            for res in data.get("results", []):
                key = (res.get("properties", {}).get(id_property) or "").lower()
                if key:
                    id_map[key] = res["id"]

        for chunk in _chunks(to_update):
            _post(
                client, f"/crm/v3/objects/{object_type}/batch/update", {"inputs": chunk}
            )

    return id_map


def create_task(
    properties: dict, associate_contact_ids: list[str] | None = None
) -> str:
    """Create a task and (optionally) associate it with contacts. Returns the new
    task id. Used to drop an AI-drafted email into an owner's task queue for
    review-and-send, since HubSpot has no public "email draft" endpoint."""
    with _client() as client:
        data = _post(client, "/crm/v3/objects/tasks", {"properties": properties})
    task_id = data["id"]
    if associate_contact_ids:
        batch_associate_default(
            "tasks", "contacts", [(task_id, cid) for cid in associate_contact_ids]
        )
    return task_id


def batch_associate_default(
    from_type: str, to_type: str, pairs: list[tuple[str, str]]
) -> int:
    """Associate ``from_id -> to_id`` using HubSpot's default association label,
    in batches. Idempotent — re-associating an existing pair is a no-op on
    HubSpot's side. Returns the number of pairs submitted.
    """
    if not pairs:
        return 0
    submitted = 0
    with _client() as client:
        for chunk in _chunks(pairs):
            body = {
                "inputs": [{"from": {"id": f}, "to": {"id": t}} for f, t in chunk]
            }
            _post(
                client,
                f"/crm/v4/associations/{from_type}/{to_type}/batch/associate/default",
                body,
            )
            submitted += len(chunk)
    return submitted
