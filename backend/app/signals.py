"""Parse the BRANDS.SIGNALS object into a compact, display-ready list.

SIGNALS is an OBJECT keyed by signal_key; each value has `present`, `last_at`,
`source` and family-specific fields. We collapse the ~60 integration-page and
the dynamic event variants into their family, dedupe, and flag high-intent
conversions. See knowledge/ + the signals catalog for the vocabulary.
"""

import json
from typing import Any

from app.schemas import CompanySignal

# High-intent conversions (best opportunity predictors).
HIGH_INTENT = {
    "demo_request",
    "dtcmvp_meeting",
    "claude_mcp_signup",
    "meta_ads_leadgen_form_submitted",
}

_LABELS = {
    "demo_request": "Demo request",
    "dtcmvp_meeting": "DTCMVP meeting",
    "claude_mcp_signup": "Claude MCP",
    "meta_ads_leadgen_form_submitted": "Meta leadgen",
    "visited_website": "Visited site",
    "revisited_site_within_24_hours": "Revisit <24h",
    "viewed_pricing_page": "Pricing page",
    "viewed_integration_page": "Integration page",
    "visited_irl_event_page": "IRL event page",
    "linkedin_reaction": "LI reaction",
    "linkedin_comment": "LI comment",
    "linkedin_engaged_multiple": "LI engaged",
    "clicked_ad": "Clicked ad",
    "30_plus_ad_impressions": "30+ ad impr.",
    "event": "IRL event",
}


def _family(key: str) -> str:
    if key.startswith("viewed_integration_page"):
        return "viewed_integration_page"
    if key.startswith("event_"):
        return "event"
    return key


def _label(family: str) -> str:
    return _LABELS.get(family, family.replace("_", " ").capitalize())


def parse_signals(raw: Any) -> list[CompanySignal]:
    if not raw:
        return []
    obj = json.loads(raw) if isinstance(raw, str) else raw
    if not isinstance(obj, dict):
        return []

    # family -> most recent last_at across its variants
    last_by_family: dict[str, str | None] = {}
    for key, val in obj.items():
        if not isinstance(val, dict) or not val.get("present"):
            continue
        fam = _family(key)
        last = val.get("last_at")
        prev = last_by_family.get(fam)
        if fam not in last_by_family or (last and (prev is None or last > prev)):
            last_by_family[fam] = last

    signals = [
        CompanySignal(
            key=fam,
            label=_label(fam),
            last_at=last,
            high_intent=fam in HIGH_INTENT,
        )
        for fam, last in last_by_family.items()
    ]
    # high-intent first, then most recent first
    signals.sort(key=lambda s: s.last_at or "", reverse=True)
    signals.sort(key=lambda s: 0 if s.high_intent else 1)
    return signals
