# Polar Use-Cases & Value Props by Job Title / Persona (AI + Historic BI)

_Date: 2026-07-09 · Sources: OpenRAG (Gong customer calls, Battle Cards, polaranalytics.com), Aurora persona angles (`aurora/src/lib/persona.ts`), the 9/10 offer matrix, positioning knowledge. Personas use Aurora's canonical enum (founder / marketing / ecom / finance / retention / other) crossed with the ICP job-title tiers._

---

## The product surface (two layers)

**Historic / core BI (the "data in → data out" platform):**
- Managed Snowflake warehouse + 1-click connectors + **semantic layer** + custom roles/permissions ("like Looker/Tableau, more flexible")
- Marketing **attribution** on first-party data (not platform attribution); assisted conversions
- **Causal Lift** — twin-geo incrementality testing (holdouts, ~2 weeks to result), measures incremental lift vs. MMM correlation
- **LTV / cohort / retention** — cohort tables (first-order cohorts, cumulative/absolute), LTV by product, LTV:CAC by cohort/channel/campaign, repeat-purchase gap analysis, subscription analysis, bought-together bundles
- Blended **MER / ROAS / CAC / payback / contribution margin**
- **Klaviyo Audiences** (data activation) — enrich missed audience events ("up to 70% flow revenue lift")
- **CAPI Enhancer** (server-side conversions, EMQ) + **first-party pixel / Lifetime ID** (cross-device)

**AI layer:**
- **Ask Polar (AI Data Analyst)** — plain-English Q&A aggregating across all sources (not just Shopify), auto-insights, recommendations, **dynamic AI alerts** (ROAS drop, CR dip, inventory threshold). Grounded on the semantic layer — *"we don't let the AI write code, so it can't hallucinate."* The old static metric-alerts are being sunset in favor of AI automations.
- **Custom role agents / "views" with task lists** — customers spin up per-function agents: **CFO agent, AI Media Buyer, Ecommerce Manager, Merchandiser, Pricing Analyst, Conversion-Rate Optimizer, Retention & LTV Analyst.** Custom-trained per brand ("you train your agents" — not one-size-fits-all).
- **AI Media Buyer** — spend recommendations, budget monitoring, creative-performance insights ("enable my team to not lean on an ad buyer as much"). Note: auto budget *reallocation* is on the roadmap; today it recommends, humans execute.
- **AI Email Marketer (for Klaviyo)** — automate incremental Klaviyo revenue via enriched audiences.
- **AI Inventory Planner** — stock alerts (critical/low), reorder timing, overstock.
- **Polar MCP** — pipe clean commerce data into Claude / ChatGPT / Slack / n8n and ask questions there.

> Positioning spine: *"Brands graduate to Polar when they need to answer complex questions, not just view pretty charts."* All-in-one first-party data stack for omnichannel DTC. ICP: $5–20M+ Shopify/Shopify Plus, ACV ~$30–60K.

---

## Persona × use-case matrix

### 1. Founder / Owner-operator
**Titles:** Founder, Co-Founder, CEO, President, Owner, Managing Director (often wearing CFO/COO/CMO hats at $5–15M). *This is the #1 closer by volume.*
**Core JTBD / pain:** decides alone and fast; wants to stop wasting cash and find profit; fears tools that lie to him and burning money he can't spare.
| | Use cases |
|---|---|
| **Historic BI** | One consolidated source of truth across Shopify + Meta + Google + Klaviyo + Amazon; blended MER/ROAS + real CAC & payback; "am I actually profitable" contribution view |
| **AI** | **Ask Polar** as the daily driver — "how did we do yesterday, what changed, what should I look at"; **Polar MCP** into Claude/Slack; a personal **CFO/CEO agent** with a morning task list |
| **Value-prop lever** | *"Your money is leaking and your tools may be lying to you — here's one profit-legible source of truth you can run yourself."* |

### 2. Marketing leader
**Titles:** CMO, Head of Marketing, Marketing Director, Head of Growth / Performance, Digital Marketing Manager, Head of Digital Marketing & CRM, Performance Marketing Manager.
**Core JTBD / pain:** defensible numbers + channel decisions; prove spend works; CEO cover; keep pace with peers; fears defending a black box.
| | Use cases |
|---|---|
| **Historic BI** | First-party **attribution** (vs. Triple Whale/Northbeam distrust); **Causal Lift incrementality** to prove "would this have happened anyway"; blended ROAS/MER by channel/campaign; creative & assisted-conversion analysis |
| **AI** | **AI Media Buyer** for spend recommendations + budget monitoring + creative performance; **Ask Polar** for channel Q&A and dynamic alerts ("alert me if Meta ROAS drops below X") |
| **Value-prop lever** | *"Your numbers aren't defensible and you may be losing to peers — get transparent, incrementality-backed attribution you can forward to the CEO."* |

### 3. Ecommerce / Growth operator
**Titles:** Head of Ecommerce, Ecommerce Manager/Director, Chief Digital / Ecommerce Officer, Ecommerce Ops Manager, Sr. Manager Ecom Strategy & Ops, Head of Omnichannel Buying & Planning.
**Core JTBD / pain:** daily revenue movement, store & merch decisions, operational tempo across channels.
| | Use cases |
|---|---|
| **Historic BI** | Daily store performance, product/SKU performance, **bought-together bundles**, omnichannel (Shopify + Amazon + retail) roll-up, promo/discount impact |
| **AI** | **AI Inventory Planner** (reorder/overstock alerts); **Merchandiser + Pricing-Analyst agents**; **Ask Polar** for "what moved and why" |
| **Value-prop lever** | *"See daily revenue movement and act on it — merch, inventory, and channel decisions from one operational cockpit."* |

### 4. Finance
**Titles:** CFO, Commercial Finance Manager, FP&A Manager, Controller.
**Core JTBD / pain:** CAC payback, MER, ROI of ad spend, contribution margin; quantify before believing.
| | Use cases |
|---|---|
| **Historic BI** | Contribution margin & blended profitability; CAC/LTV:CAC & payback; marketing spend vs. return; a governed **CFO role/permission view** |
| **AI** | A **CFO agent** with an automated task list (daily P&L-style read of the Polar data); **Ask Polar** for margin/payback questions without waiting on an analyst |
| **Value-prop lever** | *"Quantify payback and margin, not vanity revenue — a finance-grade view of whether the spend actually pays."* |

### 5. Retention / Lifecycle / CRM
**Titles:** Head of Retention, CRM Manager, Lifecycle Marketing Manager, Senior Retention Manager, Email Marketing Manager/Executive.
**Core JTBD / pain:** LTV, cohorts, post-purchase, repeat rate, expansion via email/SMS.
| | Use cases |
|---|---|
| **Historic BI** | **Cohort tables** & retention curves; LTV by product/cohort; repeat-purchase gap & subscription analysis; email/CRM KPI dashboards; **Klaviyo Audiences** enrichment (up to 70% flow revenue lift) |
| **AI** | **AI Email Marketer (Klaviyo)** to automate incremental flow revenue; **Retention & LTV Analyst agent**; **Ask Polar** repeat-purchase / cohort questions |
| **Value-prop lever** | *"Grow LTV and post-purchase revenue — cohort visibility plus enriched Klaviyo audiences that recover missed flow revenue."* |

### 6. Data / Analytics lead
**Titles:** Head of Data/Analytics, Chief Data Officer, BI Manager, Data Analyst, Analytics Engineer.
**Core JTBD / pain:** one source of truth, no black boxes, less reconciliation, no engineering tax; fears owning the mess.
| | Use cases |
|---|---|
| **Historic BI** | Managed warehouse + semantic layer (no data team required); custom roles/permissions; governed metric definitions; export/modeling like Looker/Tableau |
| **AI** | **Polar MCP** to pipe clean, governed data into Claude/n8n/Slack; **Ask Polar** grounded on *their* semantic layer (no hallucination because it reads definitions, doesn't write code) |
| **Value-prop lever** | *"Own one audited source of truth without an army of engineers — and safe AI on top that can't hallucinate your metrics."* |

### (Adjacent) Agency / Partner
**Titles:** Agency owner, Head of Client Strategy. Route via partner narratives (Brand X Commerce, Swanky, ROAR).
**Use cases:** multi-client reporting, portfolio retention & upsell, white-glove BI + AI they resell to brands. **Lever:** portfolio retention + upsell.

---

## Quick reference: AI surface → who uses it

| AI surface | What it does | Primary persona(s) |
|---|---|---|
| **Ask Polar (Data Analyst)** | Plain-English Q&A across all sources, auto-insights, dynamic alerts | All — esp. Founder, Marketing |
| **AI Media Buyer** | Spend recommendations, budget monitoring, creative insights | Marketing / Growth / Media buyer |
| **AI Email Marketer (Klaviyo)** | Enriched audiences → automated incremental flow revenue | Retention / CRM / Email |
| **AI Inventory Planner** | Reorder / overstock / stock-out alerts | Ecom Ops / Merchandiser / Finance |
| **Custom role agents (task lists)** | CFO, Merchandiser, Pricing Analyst, CRO, Retention/LTV analyst — trained per brand | Per function |
| **Polar MCP** | Clean commerce data into Claude / ChatGPT / Slack / n8n | Data lead / Founder / technical |

## Talk-track guardrails (from the calls)
- Lead with the **specific lever** the persona/signal proves they care about — never the "all-in-one data stack" homepage line cold.
- The **"AI can't hallucinate" (semantic-layer-grounded)** point lands hard with Data + Finance + skeptical Marketing buyers.
- Agents are **custom-trained per brand with task lists**, not a downloadable one-size-fits-all bot — say so; it's a differentiator.
- Be honest on roadmap edges: AI Media Buyer **recommends** today; automatic budget reallocation is coming.
