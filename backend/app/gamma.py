"""Generate a personalized Polar sales deck via the Gamma public API.

Wires up the colleague's MVP (gamma/gamma_creation_prompt.md + the variable
builders from landing-page-builder/scripts/update-gamma-fields.mjs, ported here):
build the per-prospect brief from the account + champion contact, POST it to
Gamma's Generate API, poll for the deck URL, and cache it on the account row.

Case-study proof points were cross-checked against the live
polaranalytics.com/case-studies page (Firecrawl) — all still current.
"""

import time
from typing import Any

import httpx

from app.config import get_settings

GAMMA_BASE = "https://public-api.gamma.app/v1.0/generations"
# Cloudflare bans default library user-agents (403 error 1010); send a browser UA.
_UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36"

# our Beacon persona -> the persona key used by the value-prop knowledge below
_PERSONA_KEY = {
    "Founder": "founder", "Marketing": "marketing", "Ecommerce": "ecom",
    "Finance": "finance", "Retention": "retention", "Data": "founder",
}

# Polar use cases by persona (from update-gamma-fields.mjs).
USE_CASES = {
    "founder": (
        "1. One profit-legible source of truth — blended MER, real CAC, contribution "
        "margin and LTV across Shopify, Meta, Google, Klaviyo and Amazon in one place.\n"
        "2. Ask Polar (AI Data Analyst) — plain-English answers to 'how did we do "
        "yesterday, what changed?' in seconds, no SQL.\n"
        "3. CFO Agent — a daily morning read of P&L, CAC and cash with action items.\n"
        "4. Polar MCP — governed commerce data piped into Claude, ChatGPT or Slack.\n"
        "5. Causal Lift (incrementality) — which channels actually drive revenue."
    ),
    "marketing": (
        "1. First-party attribution — Polar Pixel + Lifetime ID attributes every "
        "conversion across channels and devices; no platform inflation.\n"
        "2. Causal Lift — twin-geo holdout tests proving incremental revenue by channel.\n"
        "3. AI Media Buyer — daily spend recommendations grounded in live ROAS/CAC.\n"
        "4. Blended MER/ROAS by channel and campaign — one trusted cross-channel view.\n"
        "5. Ask Polar — dynamic alerts when ROAS drops or CAC spikes."
    ),
    "ecom": (
        "1. Daily store performance cockpit — revenue, AOV, conversion and product "
        "performance across Shopify, Amazon and retail in one view.\n"
        "2. AI Inventory Planner — predicts stockouts 2-4 weeks ahead, auto reorder recos.\n"
        "3. Product/SKU profitability — margin per SKU incl. COGS, returns and ad spend.\n"
        "4. Merchandiser Agent — daily markdown/reorder/bundle decisions surfaced.\n"
        "5. Omnichannel roll-up — Shopify + Amazon + retail in a single view."
    ),
    "finance": (
        "1. Contribution margin & blended profitability — defined once in a governed "
        "semantic layer, consistent across every report.\n"
        "2. CAC payback and LTV:CAC — live, by channel, cohort and campaign.\n"
        "3. CFO Agent — a daily finance-grade read of P&L, margin and payback curves.\n"
        "4. Ask Polar — auditable answers to margin/payback questions in seconds.\n"
        "5. Governed Snowflake warehouse — your own, with SQL access and data ownership."
    ),
    "retention": (
        "1. Klaviyo Audiences enrichment — LTV, frequency, predicted churn and product "
        "affinity pushed into segments; up to 70% more flow revenue.\n"
        "2. LTV & cohort analysis — curves by acquisition channel, campaign and product.\n"
        "3. AI Email Marketer — builds, tests and optimizes Klaviyo flows on live revenue.\n"
        "4. Retention & LTV Analyst Agent — monitors cohort health and churn risk daily.\n"
        "5. Repeat-purchase gap analysis — trigger the right flow at the right moment."
    ),
}

# Curated case studies with quotes (from the mjs; verified live on the site).
_CASE_STUDIES = {
    "default_founder": [
        ("Jones Road Beauty", "AI & reporting speed",
         "13 of 17 staff self-serve 130+ AI analyses/month; reports went from 1-2 weeks to seconds",
         '"...it used to take two weeks to get a report; you can get anything in a heartbeat." — Cody Plofker, CEO'),
        ("Tiege Hanley", "Data stack consolidation",
         "Replaced a $300K+/year in-house data stack (Snowflake/Fivetran/dbt/Tableau) with Polar",
         '"Now I focus on the deeper analytics that actually move the business forward." — Tri Ngo, Sr. Manager, Advanced Analytics'),
        ("Homefield", "Founder-led analytics",
         "Founder went from monthly spreadsheet analysis to daily data-driven decisions",
         '"Polar helps drive better decisions." — Connor Hitchcock, Founder & CEO'),
    ],
    "home_wellness": [
        ("Canopy", "Reporting efficiency",
         "432 hours/year saved on manual reporting across 17+ connected platforms",
         '"The custom metrics builder became our one source of truth." — Noel Espinosa, Chief of Staff'),
    ],
    "fashion": [
        ("Sage and Paige", "Attribution & CAPI",
         "+41% Meta ROAS and -32% cost per purchase in 14 days via Polar CAPI",
         '"Our Meta ROAS increased by 41% and cost per purchase dropped 32%." — Arthur Chau, Director'),
        ("The Frankie Shop", "Attribution & CAPI",
         "+30% ROAS and -22% cost per purchase in 7 days across two stores",
         '"...about seizing an opportunity." — Robin Caillaud, CMO'),
    ],
    "grooming_skincare": [
        ("Tiege Hanley", "Data stack",
         "Replaced a $300K+/year in-house data stack — identical vertical (men's DTC on Shopify)",
         '"Before Polar, we had to build everything manually."'),
    ],
    "incrementality": [
        ("The Feed", "Incrementality",
         "Geo-holdout proved $25K/month brand-search spend was largely non-incremental",
         '"Proving this could help us gain significant savings." — Matthew Johnson, Founder'),
        ("CABA Design", "Incrementality",
         "3.45x incremental ROAS proven via Twin Geo test -> a 50% Google Ads scale-up",
         '"Without incrementality, every dollar felt like a guess." — CEO, CABA Design'),
    ],
}

# Peer brands by vertical for the "brands like you" line (from gamma/logo_registry.py).
_PEERS = {
    "apparel": ["The Frankie Shop", "Colorful Standard", "Dôen", "Volcom"],
    "beauty": ["Tiege Hanley", "Jones Road Beauty", "ARMRA"],
    "home": ["Canopy", "Joseph Joseph", "Modular Closets", "Yellow Pop"],
    "food": ["The Feed", "ARMRA"],
    "accessories": ["Polène", "gorjana", "Quad Lock"],
}


def _fmt_gmv(account: dict[str, Any]) -> str | None:
    gmv = account.get("rob_tam__shopify_gmv") or account.get("marketing_annual_gmv")
    if not gmv:
        return None
    if gmv >= 1e9:
        return f"${gmv / 1e9:.1f}B"
    if gmv >= 1e6:
        return f"${gmv / 1e6:.1f}M"
    return f"${gmv / 1e3:.0f}K"


def _present(buckets: Any) -> list[str]:
    if not isinstance(buckets, dict):
        return []
    return [k for k, v in buckets.items() if isinstance(v, dict) and v.get("present")]


def _case_studies(industry: str, buckets: Any) -> list[tuple]:
    studies = list(_CASE_STUDIES["default_founder"])
    il = (industry or "").lower()
    if "home" in il or "wellness" in il or "garden" in il:
        studies = _CASE_STUDIES["home_wellness"] + studies
    if any(w in il for w in ("fashion", "apparel", "cloth", "accessor")):
        studies = _CASE_STUDIES["fashion"] + studies
    if any(w in il for w in ("groom", "skin", "beauty", "personal care")):
        studies = _CASE_STUDIES["grooming_skincare"] + studies
    if any(s in _present(buckets) for s in ("getting_mature_on_ads", "high_ad_spend", "evaluating_a_competitor")):
        studies = _CASE_STUDIES["incrementality"] + studies
    seen, out = set(), []
    for s in studies:
        if s[0] in seen:
            continue
        seen.add(s[0])
        out.append(s)
    return out[:3]


def _vertical(industry: str) -> str:
    il = (industry or "").lower()
    if any(w in il for w in ("apparel", "fashion", "cloth")):
        return "apparel"
    if any(w in il for w in ("beauty", "skin", "groom", "personal")):
        return "beauty"
    if any(w in il for w in ("home", "garden", "furniture")):
        return "home"
    if any(w in il for w in ("food", "beverage", "supplement", "nutrition")):
        return "food"
    if any(w in il for w in ("accessor", "jewel", "eyewear")):
        return "accessories"
    return "apparel"


def build_input_text(account: dict[str, Any], contact: dict[str, Any], persona: str) -> str:
    key = _PERSONA_KEY.get(persona, "founder")
    company = account.get("company_name") or account.get("seed_brand") or account.get("domain")
    name = contact.get("first_name") or (contact.get("full_name") or "the team").split(" ")[0]
    title = contact.get("job_title") or "Decision-maker"
    gmv = _fmt_gmv(account)
    category = (account.get("rob_tam__category") or account.get("industry_cleaned") or "DTC")
    category = category.lstrip("/").replace("/", " → ")
    emp = account.get("estimated_employee_count")
    signals = _present(account.get("in_market_buckets"))

    case_studies = "\n".join(
        f"- {b} ({theme}): {result} {quote}" for b, theme, result, quote in _case_studies(
            account.get("industry_cleaned"), account.get("in_market_buckets")
        )
    )
    peers = ", ".join(_PEERS.get(_vertical(account.get("industry_cleaned")), [])[:4])

    ctx = (
        f"{company} is a Shopify DTC brand in the {category} vertical"
        + (f", generating ~{gmv} in annual GMV" if gmv else "")
        + (f", ~{int(emp)}-person team" if emp else "")
        + ".\n"
        + (f"Live buying signals: {', '.join(signals)}.\n" if signals else "")
    )

    return (
        f"Create a concise, personalized Polar Analytics sales presentation (6-8 slides) for "
        f"{name}, {title} at {company}.\n\n"
        f"COMPANY CONTEXT:\n{ctx}\n"
        f"RELEVANT POLAR USE CASES (feature the 2-3 most relevant to a {persona.lower()} persona):\n"
        f"{USE_CASES.get(key, USE_CASES['founder'])}\n\n"
        f"CUSTOMER PROOF POINTS (use one or two; never invent results):\n{case_studies}\n\n"
        f"PEER BRANDS ALREADY ON POLAR: {peers}\n\n"
        f"OBJECTIVE: book {name} a 30-minute Polar demo by showing, with concrete proof, how "
        f"Polar gives DTC brands a profit-legible source of truth.\n\n"
        "STRUCTURE:\n"
        f"1. Personalized title slide for {company}\n"
        "2. Company context & key priorities\n"
        f"3. The core challenges {name} faces\n"
        "4. Relevant Polar use case\n5. Second relevant Polar use case\n"
        "6. Customer proof point\n7. Expected value\n8. Suggested next step (book a 30-min demo)\n\n"
        "Keep it visual and scannable. Never invent company facts, metrics, customer results, or "
        "product capabilities."
    )


def generate_deck(account: dict[str, Any], contact: dict[str, Any], persona: str) -> str:
    """Call the Gamma Generate API, poll to completion, return the deck URL."""
    settings = get_settings()
    headers = {
        "X-API-KEY": settings.gamma_api_key,
        "Content-Type": "application/json",
        "accept": "application/json",
        "User-Agent": _UA,
    }
    body = {
        "inputText": build_input_text(account, contact, persona),
        "textMode": "generate",
        "format": "presentation",
        "themeId": settings.gamma_theme_id,
        "numCards": 8,
        "textOptions": {"amount": "brief", "language": "en"},
        # Make the deck viewable by anyone with the link (so the AE can share it).
        "sharingOptions": {"workspaceAccess": "view", "externalAccess": "view"},
        "additionalInstructions": (
            "TEXT ONLY. Do not generate, add, or invent any image, illustration, infographic, "
            "diagram, flowchart or clipart. Stay premium, analytical and on-brand. "
            "Never invent metrics or customer results."
        ),
    }
    with httpx.Client(timeout=30) as client:
        r = client.post(GAMMA_BASE, json=body, headers=headers)
        r.raise_for_status()
        gid = r.json().get("generationId")
        if not gid:
            raise RuntimeError(f"Gamma: no generationId in response: {r.text[:200]}")
        for _ in range(30):  # up to ~150s
            time.sleep(5)
            s = client.get(f"{GAMMA_BASE}/{gid}", headers=headers).json()
            status = s.get("status")
            if status == "completed":
                url = s.get("gammaUrl")
                if not url:
                    raise RuntimeError("Gamma: completed without a gammaUrl")
                return url
            if status in ("failed", "error"):
                raise RuntimeError(f"Gamma generation {status}: {str(s)[:200]}")
    raise TimeoutError("Gamma generation did not complete in time")
