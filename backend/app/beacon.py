"""Build the Beacon "Weekly Hot Accounts" payload from Supabase.

Maps the 20 rows of hackathon_target_accounts + their hackathon_target_contacts
into the BeaconCompany shape the ported frontend expects (see app/src/data.ts).
The demo fiction: these 20 ARE the hottest/ready-to-close accounts, and each
company's primary contact is the highest-persona_score contact.
"""

from datetime import date, timedelta
from typing import Any

from app.config import get_settings
from app.llm import generate_angles
from app.schemas import BeaconAccounts, BeaconCompany, BeaconPerson, BeaconSignal
from app.supabase_client import get_client

_PALETTE = [
    "#5433FB", "#00BC84", "#F87700", "#9542FE", "#3F9FF8",
    "#F038F3", "#5A50FE", "#04AB7D", "#3F9FF8", "#9542FE",
]

_ACCOUNT_COLS = (
    "seed_brand,company_name,domain,tier,industry_cleaned,estimated_employee_count,"
    "signals,in_market_buckets,storeleads__country_code,apollo__country,marketing_annual_gmv"
)
_CONTACT_COLS = (
    "id,parent_domain,full_name,first_name,last_name,job_title,job_function,"
    "department,email,phone,apollo_contacts__sanitized_phone,persona_score"
)

_TIER_RANK = {"selecting": 4, "evaluating": 3, "interested": 2, "aware": 1}
_HIGH_INTENT = {"demo_request", "dtcmvp_meeting", "meta_ads_leadgen_form_submitted"}
_MAX_CONTACTS = 5

# --- in-market bucket -> (icon, text builder) ---------------------------------


def _bucket_signal(name: str, detail: dict[str, Any]) -> BeaconSignal | None:
    comp = (detail or {}).get("competitor")
    if name == "evaluating_a_competitor":
        return BeaconSignal(icon="swords", text=f"Evaluating {comp}" if comp else "Evaluating a competitor", meta="competitor")
    if name == "churning_from_a_competitor":
        return BeaconSignal(icon="swords", text=f"Churning from {comp}" if comp else "Churning from a competitor", meta="competitor")
    if name == "getting_mature_on_ads":
        return BeaconSignal(icon="trending-up", text="Scaling ad spend", meta="in-market")
    if name == "moved_to_shopify_plus":
        return BeaconSignal(icon="shopping-bag", text="Moved to Shopify Plus", meta="")
    if name == "growing_fast":
        return BeaconSignal(icon="trending-up", text="Growing fast", meta="Storeleads")
    return None


# --- signal family -> (icon, text). Only icons wired in Beacon.tsx SIGNAL_ICONS. ---
_FAMILY_SIGNAL = {
    "demo_request": ("gauge", "Requested a demo"),
    "dtcmvp_meeting": ("gauge", "Booked a DTC MVP meeting"),
    "meta_ads_leadgen_form_submitted": ("briefcase", "Submitted a lead form"),
    "claude_mcp_signup": ("boxes", "Signed up for Claude MCP"),
    "viewed_pricing_page": ("gauge", "Viewed pricing page"),
    "viewed_integration_page": ("boxes", "Viewed an integration page"),
    "visited_website": ("mouse-pointer-click", "Visited the website"),
    "revisited_site_within_24_hours": ("repeat", "Revisited within 24h"),
    "clicked_ad": ("mouse-pointer-click", "Clicked an ad"),
    "30_plus_ad_impressions": ("trending-up", "30+ ad impressions"),
    "linkedin_comment": ("activity", "Commented on LinkedIn"),
    "linkedin_reaction": ("activity", "Reacted on LinkedIn"),
    "linkedin_engaged_multiple": ("activity", "Engaged on LinkedIn"),
    "visited_irl_event_page": ("briefcase", "Viewed an event page"),
    "event": ("briefcase", "Attended an IRL event"),
}


def _family(key: str) -> str:
    if key.startswith("viewed_integration_page"):
        return "viewed_integration_page"
    if key.startswith("event_"):
        return "event"
    return key


def _build_signals(signals: Any, buckets: Any) -> tuple[list[BeaconSignal], list[str]]:
    out: list[BeaconSignal] = []
    bucket_names: list[str] = []
    # in-market buckets first — the richest "ready to close" story
    if isinstance(buckets, dict):
        for name, detail in buckets.items():
            if isinstance(detail, dict) and not detail.get("present"):
                continue
            bucket_names.append(name)
            s = _bucket_signal(name, detail if isinstance(detail, dict) else {})
            if s:
                out.append(s)
    # engagement / intent families
    seen = {s.text for s in out}
    fams: dict[str, Any] = {}
    if isinstance(signals, dict):
        for key, val in signals.items():
            if isinstance(val, dict) and not val.get("present"):
                continue
            fam = _family(key)
            fams.setdefault(fam, val if isinstance(val, dict) else {})
    # high-intent families before low-intent
    ordered = sorted(fams, key=lambda f: 0 if f in _HIGH_INTENT else 1)
    for fam in ordered:
        icon_text = _FAMILY_SIGNAL.get(fam)
        if not icon_text or icon_text[1] in seen:
            continue
        icon, text = icon_text
        out.append(BeaconSignal(icon=icon, text=text, meta=""))
    return out[:6], bucket_names


# --- persona classification ---------------------------------------------------

_PERSONA_RULES = [
    ("Founder", ("founder", "ceo", "chief executive", "owner", "president", "co-founder")),
    ("Finance", ("cfo", "finance", "fp&a", "controller", "accounting", "treasur")),
    ("Data", ("data", "analytics", "analyst", "business intelligence", " bi ", "engineer")),
    ("Retention", ("retention", "crm", "lifecycle", "email", "loyalty")),
    ("Ecommerce", ("ecommerce", "e-commerce", "commerce", "dtc", "digital", "web", "store", "merch", "site")),
    ("Marketing", ("marketing", "growth", "brand", "acquisition", "paid", "performance", "demand", "media")),
]


def _persona(*fields: str | None) -> str:
    hay = " " + " ".join(f.lower() for f in fields if f) + " "
    for persona, kws in _PERSONA_RULES:
        if any(kw in hay for kw in kws):
            return persona
    return "Marketing"


def _num(v: Any) -> float:
    try:
        return float(v)
    except (TypeError, ValueError):
        return 0.0


def _readiness(tier: str | None, has_high_intent: bool) -> int:
    return _TIER_RANK.get((tier or "").lower(), 0) * 10 + (5 if has_high_intent else 0)


async def build_beacon_accounts() -> BeaconAccounts:
    settings = get_settings()
    client = get_client()

    accounts = (
        client.table(settings.target_accounts_table).select(_ACCOUNT_COLS).execute().data
    )
    contacts = (
        client.table(settings.target_contacts_table).select(_CONTACT_COLS).execute().data
    )

    # group contacts by parent_domain, best persona_score first
    by_domain: dict[str, list[dict]] = {}
    for c in contacts:
        by_domain.setdefault((c.get("parent_domain") or "").lower(), []).append(c)
    for rows in by_domain.values():
        rows.sort(key=lambda c: _num(c.get("persona_score")), reverse=True)

    companies: list[dict[str, Any]] = []
    llm_accounts: list[dict[str, Any]] = []

    for acc in accounts:
        domain = (acc.get("domain") or "").lower()
        name = acc.get("seed_brand") or acc.get("company_name") or domain
        signals, buckets = _build_signals(acc.get("signals"), acc.get("in_market_buckets"))
        sig_families = set(
            _family(k) for k in (acc.get("signals") or {}) if isinstance(acc.get("signals"), dict)
        )
        has_high_intent = bool(sig_families & _HIGH_INTENT) or any(
            b in ("evaluating_a_competitor", "churning_from_a_competitor") for b in buckets
        )
        tier = acc.get("tier")
        score = "hot" if (_TIER_RANK.get((tier or "").lower(), 0) >= 3 or has_high_intent) else "warm"

        emp = acc.get("estimated_employee_count")
        people: list[BeaconPerson] = []
        for idx, c in enumerate(by_domain.get(domain, [])[:_MAX_CONTACTS]):
            pname = c.get("full_name") or " ".join(
                x for x in (c.get("first_name"), c.get("last_name")) if x
            ) or "Unknown"
            people.append(
                BeaconPerson(
                    name=pname,
                    title=c.get("job_title") or "",
                    persona=_persona(c.get("job_title"), c.get("job_function"), c.get("department")),
                    champion=(idx == 0),
                    email=c.get("email") or "",
                    phone=c.get("phone") or c.get("apollo_contacts__sanitized_phone") or "",
                    angle="",
                    # carry the contact id out-of-band for angle assignment
                )
            )
        # keep the contact ids parallel to `people` for angle merge
        ids = [c.get("id") for c in by_domain.get(domain, [])[:_MAX_CONTACTS]]

        company = BeaconCompany(
            logo=(name.strip()[:1] or "?").upper(),
            color=_PALETTE[len(companies) % len(_PALETTE)],
            name=name,
            score=score,
            sector=acc.get("industry_cleaned") or "",
            size=str(int(_num(emp))) if emp else "",
            cc=acc.get("storeleads__country_code") or "",
            domain=domain,
            signals=signals,
            people=people,
        )
        companies.append(
            {
                "company": company,
                "ids": ids,
                "rank": _readiness(tier, has_high_intent),
                "gmv": _num(acc.get("marketing_annual_gmv")),
            }
        )
        if people:
            llm_accounts.append(
                {
                    "brand": name,
                    "sector": company.sector,
                    "signals": [s.text for s in signals],
                    "buckets": buckets,
                    "contacts": [
                        {"id": ids[i], "name": p.name, "title": p.title, "persona": p.persona}
                        for i, p in enumerate(people)
                        if ids[i]
                    ],
                }
            )

    # hottest first
    companies.sort(key=lambda x: (x["rank"], x["gmv"]), reverse=True)

    # generate angles (LLM or template fallback) and merge in
    angles = await generate_angles(llm_accounts)
    for item in companies:
        for p, cid in zip(item["company"].people, item["ids"]):
            if cid and cid in angles:
                p.angle = angles[cid]

    monday = date.today() - timedelta(days=date.today().weekday())
    return BeaconAccounts(
        week_of=monday.strftime("Week of %b %-d"),
        companies=[item["company"] for item in companies],
    )
