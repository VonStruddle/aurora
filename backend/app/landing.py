"""Personalized landing-page generation, backported from landing-page-builder/.

Builds a hackathon_landings row from an account + champion contact (persona
templates + per-company hook/pain-points), and merges a row back into a full
LandingConfig for rendering. Icons are literal Unicode glyphs (no icon lib).
"""

from typing import Any

CONTACT_URL = "https://polaranalytics.com/contact"

VALID_PERSONAS = {"founder", "marketing", "finance", "ecom", "retention"}

# --- persona templates (verbatim from data/personas/*.ts) ---------------------
PERSONAS: dict[str, dict[str, Any]] = {
    "founder": {
        "hero_headline": "One profit-legible source of truth — without the analyst headcount.",
        "hero_subheadline": "Polar gives founders a real-time view of CAC, contribution margin, and LTV across every channel. Ask any question in plain English. Get answers you can act on in 30 seconds.",
        "pain_solutions": [
            {"pain": "Five dashboards, three different ROAS numbers — you still don't know if you're profitable.",
             "solution": "Polar's semantic layer defines every metric once. CAC, blended MER, and contribution margin are identical across every tool you use.",
             "result": "One number your whole team trusts.", "icon": "⬡"},
            {"pain": "You're spending hours every Monday pulling numbers before you can make a single call.",
             "solution": "Ask Polar answers \"What drove the CAC spike last week?\" in plain English — no SQL, no waiting for an analyst.",
             "result": "CEO-level clarity in under 30 seconds.", "icon": "◎"},
            {"pain": "You can't tell which marketing spend is actually driving revenue vs. burning cash.",
             "solution": "Causal lift testing shows exactly which channels are incremental — and which are stealing attribution from organic.",
             "result": "Reallocate budget with confidence, not faith.", "icon": "↑"},
        ],
        "highlighted_feature_ids": ["ask-polar", "semantic-layer", "incrementality", "polar-mcp"],
        "case_study": {"brand": "Tiege Hanley", "industry": "Men's Grooming DTC",
                       "metric": "Infrastructure Cost Saved", "value": "$300K",
                       "quote": "Polar replaced our entire data stack. One source of truth, no engineering team required.",
                       "author": None, "role": "Founder"},
        "closing_outcome": "one source of truth for profit, CAC, and revenue — so you can run the business, not the spreadsheets.",
    },
    "marketing": {
        "hero_headline": "Attribution you can forward to the CEO without second-guessing it.",
        "hero_subheadline": "First-party attribution, incrementality testing, and AI-powered channel recommendations — all grounded in data your team actually trusts.",
        "pain_solutions": [
            {"pain": "Meta says ROAS is 4x. Google says 6x. Your P&L says neither is right.",
             "solution": "Polar's first-party pixel + Lifetime ID attributes every conversion accurately — across channels, devices, and sessions.",
             "result": "+95% attribution accuracy (ROAR Studios).", "icon": "◉"},
            {"pain": "You're scaling channels based on last-click attribution. Half your budget might be wasted.",
             "solution": "Causal lift testing proves which channels are truly incremental — so you stop funding channels that steal organic credit.",
             "result": "CAC reduced -36% at YellowPop after incrementality testing.", "icon": "↑"},
            {"pain": "Your media buyer is making decisions on gut feel because the data is 3 days old.",
             "solution": "AI Media Buyer Agent delivers daily recommendations grounded in live ROAS, CAC, and incrementality data.",
             "result": "$25K in Google Ads savings in 30 days (The Feed).", "icon": "◆"},
        ],
        "highlighted_feature_ids": ["attribution", "incrementality", "media-buyer-agent", "ask-polar"],
        "case_study": {"brand": "ROAR Studios", "industry": "DTC Agency",
                       "metric": "Attribution Accuracy", "value": "+95%",
                       "quote": "We finally have attribution numbers we can show clients without caveats.",
                       "author": None, "role": "Head of Analytics"},
        "closing_outcome": "attribution clarity, incrementality-backed budget decisions, and an AI media buyer that works from your live data.",
    },
    "finance": {
        "hero_headline": "CAC payback, contribution margin, LTV:CAC — automated. Not estimated.",
        "hero_subheadline": "Polar gives finance leaders real-time blended profitability metrics across every channel. No more manual Excel reconciliation. No more waiting for the data team.",
        "pain_solutions": [
            {"pain": "Contribution margin is calculated in five different spreadsheets and nobody agrees on the number.",
             "solution": "Polar's semantic layer defines contribution margin once — including COGS, ad spend, fulfillment, and returns — and enforces it across every report.",
             "result": "One authoritative P&L view your whole leadership team trusts.", "icon": "⬡"},
            {"pain": "You can't calculate true CAC payback because acquisition data and revenue data live in different systems.",
             "solution": "Polar connects ad spend, revenue, and LTV in one semantic model. CAC payback period is a live metric, not a monthly project.",
             "result": "Real-time CAC:LTV visibility across cohorts and channels.", "icon": "◑"},
            {"pain": "CFO reporting takes 3 days of analyst time every month.",
             "solution": "Polar's CFO Agent runs weekly reviews automatically — contribution margin, payback curves, and channel ROI delivered to your Notion or Slack.",
             "result": "50% reduction in reporting time (Swanky).", "icon": "◎"},
        ],
        "highlighted_feature_ids": ["semantic-layer", "ltv-cohort", "snowflake", "ask-polar"],
        "case_study": {"brand": "Swanky", "industry": "DTC Agency",
                       "metric": "Reporting Time Saved", "value": "50%",
                       "quote": "We cut our monthly reporting cycle in half and the numbers are finally consistent.",
                       "author": None, "role": "Head of Finance"},
        "closing_outcome": "automated contribution margin, real-time CAC payback, and CFO-ready reporting — without an analyst bottleneck.",
    },
    "ecom": {
        "hero_headline": "Daily revenue ops from one cockpit. No SQL required.",
        "hero_subheadline": "See what moved revenue today, predict stockouts before they happen, and get merchandising recommendations — all in the tools you already use.",
        "pain_solutions": [
            {"pain": "You don't know what drove yesterday's revenue until Tuesday. By then you've already missed the window.",
             "solution": "Polar's Ecommerce Manager Agent monitors daily GMV, AOV, and conversion — and alerts you the moment something shifts, with the \"why\" already surfaced.",
             "result": "Act on revenue signals the same day, not the same week.", "icon": "◎"},
            {"pain": "You're finding out about stockouts after customers complain — not before they happen.",
             "solution": "AI Inventory Planner predicts stockouts 2–4 weeks ahead from velocity, lead time, and seasonal patterns. Reorder recommendations are generated automatically.",
             "result": "Canopy unified 17+ data sources to eliminate stockout blind spots.", "icon": "▣"},
            {"pain": "Merchandising decisions are based on gut feel because product-level profitability is too hard to calculate.",
             "solution": "Polar calculates margin per SKU, category, and collection — including COGS, returns, and ad spend. Surface your best performers and kill the losers.",
             "result": "Data-driven buy decisions that protect margin.", "icon": "⬡"},
        ],
        "highlighted_feature_ids": ["ask-polar", "inventory-agent", "semantic-layer", "connectors"],
        "case_study": {"brand": "Canopy", "industry": "Home & Lifestyle DTC",
                       "metric": "Data Sources Unified", "value": "+17",
                       "quote": "We finally have a single view across all our channels. Inventory decisions went from guesswork to systematic.",
                       "author": None, "role": "Head of Ecommerce"},
        "closing_outcome": "real-time revenue visibility, automated stockout prevention, and margin-backed merchandising decisions.",
    },
    "retention": {
        "hero_headline": "Increase flow revenue 70% with enriched Klaviyo audiences.",
        "hero_subheadline": "Polar connects your warehouse-level customer data to Klaviyo — so your flows reach the right people with the right message, grounded in real purchase behavior and LTV data.",
        "pain_solutions": [
            {"pain": "Your Klaviyo segments are based on email events only. You're missing 40% of your best customers.",
             "solution": "Polar's Klaviyo Audiences connector enriches your segments with warehouse-level data: LTV, purchase frequency, predicted churn risk, and product affinity.",
             "result": "Up to 70% increase in flow revenue.", "icon": "◈"},
            {"pain": "You can't tell which cohorts are actually retained vs. which are just repeat one-time buyers.",
             "solution": "Polar's LTV cohort tables break down customer retention by acquisition channel, campaign, and product — so you know which sources produce loyal customers.",
             "result": "+10% revenue per subscriber at Doen.", "icon": "◑"},
            {"pain": "Building and testing Klaviyo campaigns takes your team hours every week.",
             "solution": "AI Email Marketer Agent automatically builds, tests, and optimizes flows against your live revenue data — without manual setup.",
             "result": "+54% email revenue at Modular Closets.", "icon": "✉"},
        ],
        "highlighted_feature_ids": ["klaviyo-audiences", "ltv-cohort", "email-agent", "attribution"],
        "case_study": {"brand": "Modular Closets", "industry": "Home & Storage DTC",
                       "metric": "Email Revenue Increase", "value": "+54%",
                       "quote": "Polar's audience enrichment transformed our Klaviyo performance. We're reaching customers we didn't even know existed.",
                       "author": None, "role": "Head of CRM & Retention"},
        "closing_outcome": "Klaviyo audiences built on real purchase behavior, LTV-driven segmentation, and automated email optimization that runs itself.",
    },
}

# --- features (verbatim from data/features.ts) --------------------------------
ALL_FEATURES = [
    {"id": "semantic-layer", "title": "Semantic Layer", "description": "CAC, contribution margin, LTV — defined once, trusted everywhere. No more conflicting numbers across tools.", "icon": "⬡", "badge": None},
    {"id": "connectors", "title": "45+ Native Connectors", "description": "Shopify, Meta, Google, Klaviyo, Amazon, NetSuite — one-click setup, no engineering required.", "icon": "⟡", "badge": None},
    {"id": "ask-polar", "title": "Ask Polar (AI Analyst)", "description": "Ask any business question in plain English. Get real answers grounded in your live, attributed data.", "icon": "◎", "badge": "Live"},
    {"id": "polar-mcp", "title": "Polar MCP", "description": "One endpoint connects your live commerce data to Claude, ChatGPT, Slack, Notion — any AI you already use.", "icon": "⌬", "badge": "New"},
    {"id": "incrementality", "title": "Incrementality Testing", "description": "Causal lift tests that prove which channels actually drive revenue. Stop funding channels on faith.", "icon": "↑", "badge": None},
    {"id": "attribution", "title": "First-Party Attribution", "description": "Polar Pixel + Lifetime ID tracks every customer across devices. Accurate attribution without third-party cookies.", "icon": "◉", "badge": None},
    {"id": "klaviyo-audiences", "title": "Klaviyo Audiences", "description": "Enrich Klaviyo with warehouse-level segments. Brands see up to 70% increase in flow revenue.", "icon": "◈", "badge": "Popular"},
    {"id": "snowflake", "title": "Dedicated Data Warehouse", "description": "Your own Snowflake instance. You own the data, access the SQL, and keep it after you leave.", "icon": "❄", "badge": None},
    {"id": "media-buyer-agent", "title": "AI Media Buyer Agent", "description": "Turns noisy ad data into clean channel recommendations. Built on ROAS, CAC, and incrementality — not guesswork.", "icon": "◆", "badge": "Waitlist"},
    {"id": "inventory-agent", "title": "AI Inventory Planner", "description": "Predicts stockouts before they happen. Smart reorder recommendations from velocity and lead time data.", "icon": "▣", "badge": "Waitlist"},
    {"id": "email-agent", "title": "AI Email Marketer", "description": "Automatically builds, tests, and optimizes Klaviyo campaigns against your own revenue data.", "icon": "✉", "badge": "Waitlist"},
    {"id": "ltv-cohort", "title": "LTV & Cohort Analysis", "description": "Full cohort tables and LTV curves per acquisition channel, product, and campaign.", "icon": "◑", "badge": None},
]
_FEATURE_BY_ID = {f["id"]: f for f in ALL_FEATURES}
CORE_FEATURE_IDS = ["semantic-layer", "connectors", "ask-polar", "snowflake"]

# --- generation knowledge (verbatim from seed-landings.mjs) -------------------
PERSONA_CLOSING = {
    "founder": "one source of truth for profit, CAC, and revenue — so you can run the business, not the spreadsheets",
    "marketing": "attribution clarity and incrementality-backed budget decisions your team can act on immediately",
    "finance": "automated contribution margin, real-time CAC payback, and CFO-ready reporting without the analyst bottleneck",
    "ecom": "real-time revenue visibility, automated stockout prevention, and margin-backed merchandising decisions",
    "retention": "Klaviyo audiences built on real purchase behavior and LTV-driven segmentation that drives flow revenue",
}
_SIGNAL_PAIN = {
    "getting_mature_on_ads": "Attribution inconsistencies as paid media spend scales",
    "high_ad_spend": "No incrementality testing despite significant media budgets",
    "high_growth": "Reporting infrastructure not keeping pace with growth",
    "klaviyo_user": "Klaviyo audiences limited to email events, missing purchase behavior",
    "shopify_plus": "Data fragmented across Shopify Plus, ads, and email platforms",
    "multi_channel": "No unified view across channels — each platform reports differently",
    "retention_focused": "LTV and cohort data unavailable without analyst help",
}
_DEFAULT_PAIN = {
    "founder": ["No unified profit view across channels", "Weekly reporting takes too long"],
    "marketing": ["Attribution inconsistencies across Meta and Google", "No incrementality testing in place"],
    "finance": ["Contribution margin calculated manually in spreadsheets", "No live CAC payback metric"],
    "ecom": ["Revenue movement not visible until days later", "Inventory stockouts discovered too late"],
    "retention": ["Klaviyo segments limited to email events only", "LTV cohort data unavailable without SQL"],
}
_SIGNAL_SENTENCE = {
    "getting_mature_on_ads": "Your paid media spend is scaling — attribution clarity becomes critical at this stage.",
    "high_ad_spend": "With significant media budgets in play, knowing your true incremental ROAS matters.",
    "high_growth": "You are growing fast — the data infrastructure needs to keep up.",
    "klaviyo_user": "You are already on Klaviyo, so enriching your audiences with warehouse-level data is a quick win.",
    "shopify_plus": "You are on Shopify Plus — the kind of brand Polar was built for.",
    "multi_channel": "You are selling across multiple channels, which makes unified attribution non-negotiable.",
    "retention_focused": "Retention is clearly a priority — Polar gives you the LTV and cohort data to act on it.",
}
_PERSONA_PAIN_PHRASE = {
    "founder": "getting a clean view of profit, CAC, and revenue without analyst overhead",
    "marketing": "having attribution numbers they can actually trust and forward to leadership",
    "finance": "calculating true CAC payback and contribution margin from live data",
    "ecom": "seeing daily revenue movement and acting on it without waiting for reports",
    "retention": "enriching Klaviyo audiences with real purchase data and cohort LTV",
}

_PERSONA_PATTERNS = [
    ("founder", ("ceo", "founder", "owner", "president", "co-founder", "managing director", "general manager", "coo")),
    ("retention", ("crm", "retention", "email", "lifecycle", "loyalty", "customer success")),
    ("finance", ("cfo", "finance", "fp&a", "controller", "treasurer", "chief finance")),
    ("ecom", ("ecommerce", "e-commerce", "dtc", "digital", "merchandis", "head of commerce", "marketplace")),
    ("marketing", ("marketing", "growth", "acquisition", "performance", "media", "brand", "creative", "paid", "seo", "content")),
]


def derive_persona(job_title: str | None, job_function: str | None) -> str:
    hay = f"{job_title or ''} {job_function or ''}".lower()
    for persona, kws in _PERSONA_PATTERNS:
        if any(kw in hay for kw in kws):
            return persona
    return "founder"


def _num(v: Any) -> float | None:
    try:
        return float(v)
    except (TypeError, ValueError):
        return None


def _fmt_gmv(v: float | None) -> str | None:
    """Money only, no suffix (callers add ' GMV'/'in annual GMV' as needed)."""
    if not v:
        return None
    if v >= 1e9:
        return f"${v / 1e9:.1f}B"
    if v >= 1e6:
        return f"${v / 1e6:.1f}M"
    return f"${v / 1e3:.0f}K"


def _present_buckets(buckets: Any) -> list[str]:
    if not isinstance(buckets, dict):
        return []
    return [k for k, v in buckets.items() if isinstance(v, dict) and v.get("present")]


def _build_pain_points(buckets: Any, persona: str) -> list[str]:
    out = [_SIGNAL_PAIN[b] for b in _present_buckets(buckets) if b in _SIGNAL_PAIN][:2]
    for d in _DEFAULT_PAIN.get(persona, _DEFAULT_PAIN["founder"]):
        if len(out) >= 2:
            break
        if d not in out:
            out.append(d)
    return out[:2]


def _build_hook_text(account: dict[str, Any], persona: str) -> str:
    company = account.get("company_name") or "This brand"
    industry = account.get("industry_cleaned") or "DTC"
    gmv = _num(account.get("rob_tam__shopify_gmv")) or _num(account.get("marketing_annual_gmv"))
    gmv_str = _fmt_gmv(gmv) or "strong revenue"
    emp = account.get("estimated_employee_count")
    size = f"{int(emp)}-person team" if emp else "growing team"

    p1 = f"{company} is a {industry} brand on Shopify doing ~{gmv_str} in annual GMV with a {size}."
    present = _present_buckets(account.get("in_market_buckets"))
    p2 = next((_SIGNAL_SENTENCE[b] for b in present if b in _SIGNAL_SENTENCE),
              "At this scale, getting clean data across all channels becomes the bottleneck.")
    p3 = (f"Brands like {company} typically struggle with {_PERSONA_PAIN_PHRASE[persona]}. "
          "We think Polar can change that — and we have seen it work for similar-stage brands in this space.")
    return "\n\n".join([p1, p2, p3])


def build_landing_row(account: dict[str, Any], contact: dict[str, Any]) -> dict[str, Any]:
    """Assemble the hackathon_landings row (minus id/created_at) for insertion."""
    persona = derive_persona(contact.get("job_title"), contact.get("job_function"))
    gmv = _num(account.get("rob_tam__shopify_gmv")) or _num(account.get("marketing_annual_gmv"))
    gmv_fmt = _fmt_gmv(gmv)
    return {
        "contact_url": CONTACT_URL,
        "persona_type": persona,
        "company_name": account.get("company_name") or account.get("seed_brand") or account.get("domain"),
        "company_industry": account.get("industry_cleaned"),
        "company_estimated_gmv": f"{gmv_fmt} GMV" if gmv_fmt else None,
        "company_logo_url": account.get("logo"),
        "company_pain_points": _build_pain_points(account.get("in_market_buckets"), persona),
        "recipient_name": contact.get("first_name"),
        "recipient_title": contact.get("job_title"),
        "hook_text": _build_hook_text(account, persona),
        "hero_headline": None,   # fall back to persona default at render
        "hero_subheadline": None,
        "closing_outcome": PERSONA_CLOSING[persona],
    }


def build_config(row: dict[str, Any]) -> dict[str, Any]:
    """Merge a hackathon_landings row with its persona template -> render config."""
    persona_type = row.get("persona_type") if row.get("persona_type") in VALID_PERSONAS else "founder"
    tpl = PERSONAS[persona_type]

    highlighted = [_FEATURE_BY_ID[i] for i in tpl["highlighted_feature_ids"] if i in _FEATURE_BY_ID]
    core = [_FEATURE_BY_ID[i] for i in CORE_FEATURE_IDS if i in _FEATURE_BY_ID]
    spotlight = [f for f in highlighted if f["id"] not in CORE_FEATURE_IDS][:2]

    return {
        "company": {
            "name": row.get("company_name"),
            "industry": row.get("company_industry"),
            "estimated_gmv": row.get("company_estimated_gmv"),
            "logo": row.get("company_logo_url"),
            "pain_points": row.get("company_pain_points"),
        },
        "persona": {
            "type": persona_type,
            "recipient_name": row.get("recipient_name"),
            "recipient_title": row.get("recipient_title"),
            "hero_headline": row.get("hero_headline") or tpl["hero_headline"],
            "hero_subheadline": row.get("hero_subheadline") or tpl["hero_subheadline"],
            "hook_text": row.get("hook_text") or "",
            "pain_solutions": tpl["pain_solutions"],
            "case_study": tpl["case_study"],
            "closing_outcome": row.get("closing_outcome") or tpl["closing_outcome"],
        },
        "core_features": core,
        "spotlight_features": spotlight,
        "contact_url": row.get("contact_url") or CONTACT_URL,
    }
