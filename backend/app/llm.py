"""Sales-angle generation for Beacon contacts.

Given a company's signals and each contact's persona, produce a 1-2 sentence
Polar value-prop angle. Uses Claude (one batched call per account, all accounts
concurrent) when ANTHROPIC_API_KEY is set; otherwise falls back to a deterministic
persona + in-market-signal template. Angles are cached in-process by contact id so
only the first request pays the latency.

Grounded in knowledge/outreach_sequences_by_persona.md (persona x value-prop matrix
+ signal->angle modifiers).
"""

import asyncio
import json
from typing import Any

from app.config import get_settings

# contact_id -> angle
_CACHE: dict[str, str] = {}

# Deterministic fallback — condensed from the persona value-prop matrix.
_PERSONA_ANGLE = {
    "Founder": (
        "Decides fast and alone. Lead with one profit-legible source of truth — "
        "blended MER, real CAC and payback — they can run without an analyst."
    ),
    "Marketing": (
        "Defends spend to the board. Lead with first-party attribution and "
        "incrementality-backed ROAS by channel, not platform-reported numbers."
    ),
    "Ecommerce": (
        "Runs the store day to day. Lead with daily revenue movement, SKU-level "
        "performance and bought-together bundles."
    ),
    "Retention": (
        "Owns email and SMS. Lead with cohort LTV and Klaviyo audience enrichment "
        "to recover flow revenue Klaviyo never sees."
    ),
    "Finance": (
        "Quantifies before believing. Lead with contribution margin, CAC payback "
        "and a governed CFO view."
    ),
    "Data": (
        "Owns reporting. Lead with the semantic layer and Polar MCP — governed "
        "data, no black boxes."
    ),
}
_DEFAULT_ANGLE = _PERSONA_ANGLE["Marketing"]

# In-market bucket -> short modifier clause appended to the template angle.
_SIGNAL_MOD = {
    "evaluating_a_competitor": " They're comparing tools now — anchor on attribution they can trust.",
    "churning_from_a_competitor": " Coming off a tool that let them down — anchor on trustworthy attribution.",
    "getting_mature_on_ads": " Scaling ad spend — lead with Causal Lift and the AI Media Buyer.",
    "moved_to_shopify_plus": " Just graduated to Shopify Plus — position Polar as the next step up.",
    "growing_fast": " Growing fast — lead with consolidation into one profit view.",
}

_SYSTEM = """You are an SDR at Polar Analytics (analytics for Shopify/DTC e-commerce brands).
For each contact, write ONE crisp sales angle (1-2 sentences, ~30 words) telling the rep how to
open with this person, grounded in their persona and the company's buying signals. Be specific and
concrete; no fluff, no greeting, no sign-off.

Persona playbook:
- Founder/CEO: money is leaking and tools may be lying. Lead with one profit source of truth (blended MER, real CAC, payback) they can read every morning.
- Marketing/CMO/Growth: are the numbers defensible when the CEO pushes back? Lead with first-party attribution + Causal Lift / incrementality.
- Ecommerce: "what moved yesterday, and why?" Lead with the operational cockpit — daily movement, SKU and bought-together analysis.
- Finance/CFO: quantify payback, not vanity revenue. Lead with contribution margin, LTV:CAC, payback, a governed CFO view.
- Retention/CRM: missing flow revenue Klaviyo never sees (up to 70% lift). Lead with cohort curves, LTV by product, Klaviyo Audiences.
- Data: one audited source of truth, no engineering tax. Lead with the semantic layer + Polar MCP and governance.

Signal modifiers (override the lead use-case when present):
- evaluating_a_competitor / churning_from_a_competitor -> attribution-distrust / "tools are lying" angle.
- getting_mature_on_ads -> Causal Lift + AI Media Buyer.
- moved_to_shopify_plus -> "brands graduate to Polar".
- growing_fast -> founder profit-legibility / consolidation.

Return ONLY JSON: {"angles":[{"id":"<contact id>","angle":"<text>"}, ...]} for every contact given."""


def _template(persona: str, buckets: list[str]) -> str:
    angle = _PERSONA_ANGLE.get(persona, _DEFAULT_ANGLE)
    for b in buckets:
        if b in _SIGNAL_MOD:
            return angle + _SIGNAL_MOD[b]
    return angle


async def _account_angles(client, model: str, acct: dict[str, Any]) -> dict[str, str]:
    """One Claude call for one account's contacts. Returns {id: angle}."""
    contacts = acct["contacts"]
    user = json.dumps(
        {
            "brand": acct["brand"],
            "sector": acct.get("sector", ""),
            "signals": acct.get("signals", []),
            "in_market_buckets": acct.get("buckets", []),
            "contacts": [
                {"id": c["id"], "name": c["name"], "title": c["title"], "persona": c["persona"]}
                for c in contacts
            ],
        },
        ensure_ascii=False,
    )
    resp = await client.messages.create(
        model=model,
        max_tokens=700,
        temperature=0.5,
        system=_SYSTEM,
        messages=[{"role": "user", "content": user}],
    )
    text = "".join(b.text for b in resp.content if b.type == "text").strip()
    # Tolerate accidental code fences.
    if text.startswith("```"):
        text = text.strip("`").split("\n", 1)[-1]
    data = json.loads(text)
    out = {a["id"]: a["angle"].strip() for a in data.get("angles", []) if a.get("id")}
    # Any contact the model skipped falls back to the template.
    for c in contacts:
        out.setdefault(c["id"], _template(c["persona"], acct.get("buckets", [])))
    return out


async def generate_angles(accounts: list[dict[str, Any]]) -> dict[str, str]:
    """accounts: [{brand, sector, signals:[str], buckets:[str],
    contacts:[{id,name,title,persona}]}] -> {contact_id: angle}."""
    settings = get_settings()

    # Everything already cached? return immediately.
    result: dict[str, str] = {}
    todo: list[dict[str, Any]] = []
    for acct in accounts:
        missing = [c for c in acct["contacts"] if c["id"] not in _CACHE]
        for c in acct["contacts"]:
            if c["id"] in _CACHE:
                result[c["id"]] = _CACHE[c["id"]]
        if missing:
            todo.append({**acct, "contacts": missing})

    if not todo:
        return result

    if not settings.anthropic_api_key:
        # Deterministic fallback for everything uncached.
        for acct in todo:
            for c in acct["contacts"]:
                result[c["id"]] = _CACHE.setdefault(
                    c["id"], _template(c["persona"], acct.get("buckets", []))
                )
        return result

    from anthropic import AsyncAnthropic

    client = AsyncAnthropic(api_key=settings.anthropic_api_key)
    model = settings.anthropic_model

    async def run(acct):
        try:
            return await _account_angles(client, model, acct)
        except Exception:
            # Per-account fallback so one failure doesn't blank the board.
            return {c["id"]: _template(c["persona"], acct.get("buckets", [])) for c in acct["contacts"]}

    for angles in await asyncio.gather(*(run(a) for a in todo)):
        for cid, angle in angles.items():
            _CACHE[cid] = angle
            result[cid] = angle
    return result
