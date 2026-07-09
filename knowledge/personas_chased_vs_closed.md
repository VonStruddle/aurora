# Personas & Job Titles — Who We Chase vs. Who We Close

_Analysis date: 2026-07-09 · Sources: Aurora bot knowledge (`aurora/`, `pipeline_pulse_agent/knowledge/`), Dagster job-title scoring (`dagster_project/.../job_title_scoring.py`), HubSpot (mirrored to Snowflake `INTERNAL_STAGING`)._

---

## TL;DR

- **Intent (who we target):** founders, marketing leaders, and ecommerce leaders at DTC/Shopify brands — plus finance and retention buyers, each with a defined sales angle.
- **Reality (who we close):** overwhelmingly **Founder/CEO** (owner-operators of small brands press "buy"), then **Marketing leaders** (Head of / Manager / Director / CMO), then **Ecommerce managers/heads**. Finance and Retention rarely appear as the deal contact.
- HubSpot's native `Persona` field is effectively unused (~91% null); **job title is the real signal**, and ~50% of won-deal contacts have a blank title.

---

## 1. Who we're chasing — the target definition

### 1a. Aurora bot's canonical persona enum (`aurora/src/lib/persona.ts`)

Six personas, each with the angle Aurora sells on:

| Persona | Derived from titles containing… | Sales angle |
|---|---|---|
| **Founder** | founder, ceo, president, co-founder, owner | Whole-picture + decision speed; "one chart they can't see today and the unlock it creates" |
| **Marketing** | cmo, market, growth, acquisition, paid, performance, brand, seo, attribution, analytics | Attribution clarity, MMM, channel decisions; insight quality + speed-to-answer |
| **Ecom** | ecom, ecommerce, digital (non-marketing), shopify | Daily revenue movement, store performance, merch decisions; operational tempo |
| **Finance** | cfo, finance, controller, treasurer | CAC payback, MER, ROI of ad spend; quantify before you sell capability |
| **Retention** | retention, loyalty, cx, customer experience, customer success, lifecycle | LTV, cohorts, post-purchase; cohort visibility + expansion levers |
| **Other** | everything else | Generic DTC operator; consolidate tools into one source of truth |

_Title→persona logic lives in `derivePersona()` (regex on job title). HubSpot's native persona field is **not** used._

### 1b. The concrete ICP title list (Dagster `job_title_gate`, OpenAI-scored 0–100)

Highest-fit titles the scoring model prioritizes (`is_icp = true`):

- **C-level / Founder tier:** CEO, CMO, CFO, COO, CRO, CDO (Chief Data Officer), Chief Digital Officer, Chief Ecommerce Officer, Chief Growth Officer, President, Founder, Co-Founder, Owner, Co-Owner, Managing Director, Deputy CEO, Group CEO, Chief of Staff
- **VP / Head of / Director of:** Ecommerce, Digital, DTC, Growth, Marketing, Performance Marketing, Digital Marketing, Brand, Acquisition, Retention, Lifecycle, CRM, Email, Analytics, BI, Data, Data Engineering, AI, Insights, Operations, Finance, FP&A, Revenue
- **Manager / Lead / Senior IC:** Ecommerce Manager, Growth Manager, Marketing Manager, Acquisition Manager, Performance Manager, Email/Retention/CRM/Lifecycle Marketing Manager, Brand Manager, FP&A Manager, Financial/Data/BI/Marketing Analyst, Analytics Engineer, Marketing/Growth/Performance Lead, Marketing Specialist

**Explicitly excluded (`is_icp = false`):** retail/store roles (Sales Associate, Store Manager, Cashier, Barista, Key Holder), warehouse/fulfillment (Warehouse Associate, Packaging Technician), customer support (Support Specialist), generic software engineering (Software/Backend/Frontend Engineer, Web Developer) unless data/AI/founding, non-director design, interns.

> Outbound playbook summary: _"Target personas are typically marketing leaders, founders, and agency owners at DTC ecommerce companies."_

---

## 2. Who we've actually closed — HubSpot won deals

**Sales Pipeline "Closed won" = 1,962 deals / 3,603 associated contacts.**

### Top real job titles on won deals (by distinct contacts)

| # | Job title | Contacts | # | Job title | Contacts |
|---|---|---:|---|---|---:|
| 1 | Founder | 72 | 16 | Head of Growth | 12 |
| 2 | Co-Founder | 65 | 17 | Managing Director | 12 |
| 3 | CEO | 41 | 18 | Chief Financial Officer | 11 |
| 4 | Chief Executive Officer | 36 | 19 | Owner | 11 |
| 5 | Marketing Manager | 20 | 20 | CEO & Founder | 10 |
| 6 | Head of Marketing | 19 | 21 | General Manager | 9 |
| 7 | Founder & CEO | 19 | 22 | Marketing Coordinator | 9 |
| 8 | Chief Operating Officer | 18 | 23 | COO | 8 |
| 9 | Ecommerce Manager | 16 | 24 | CMO | 7 |
| 10 | Director | 15 | 25 | Head of Digital | 7 |
| 11 | President | 15 | 26 | Head of Operations | 7 |
| 12 | Co-Founder & CEO | 14 | 27 | Chief Growth Officer | 7 |
| 13 | Head of Ecommerce | 14 | 28 | Chief Financial Officer / CFO | 6 |
| 14 | Chief Marketing Officer | 13 | 29 | Performance Marketing Manager | 6 |
| 15 | Marketing Director / Digital Marketing Manager | 13 | 30 | … | … |

### Persona rollup of won contacts (Aurora taxonomy)

| Persona | Won contacts | Notes |
|---|---:|---|
| **Founder** | 460 | Founder, Co-Founder, CEO, President, "Founder & CEO" |
| **Marketing** | 373 | Head of Marketing, Marketing Manager/Director, CMO, Digital Marketing Manager, Head of Growth |
| **Ecom** | 288 | Ecommerce Manager, Head of Ecommerce, Head of Digital |
| **Finance** | 39 | CFO / Chief Financial Officer |
| **Retention** | 29 | Retention / Lifecycle / CX roles |
| **Other** | 610 | COO, Owner, Managing Director, General Manager, Director (Ops & generalist leadership) |
| **Blank title** | 1,804 | ~50% of won-deal contacts have no job title recorded |

**Read:** closes are founder/CEO-led first, Marketing second, Ecommerce third. The large **"Other"** bucket is mostly **Ops/COO/Owner/GM** — real buyers that Aurora's taxonomy doesn't cleanly categorize.

---

## 3. What we're chasing right now — open pipeline

- **Active Sales-Pipeline opportunities** (S1 Discovery → S4 Commit): currently thin (~152 open deals, few with named contacts). Example open-opp titles: _VP of Product and Technology, Founder & CEO, VP Corporate Development, VP of Digital Product, Senior Marketing Manager, Senior Channel Business Development Manager._
- **All open leads across pipelines (2,060 contacts)** mirror the closed mix:

| Persona | Open contacts |
|---|---:|
| Marketing | 369 |
| Founder | 210 |
| Ecom | 146 |
| Retention | 35 |
| Finance | 19 |
| Other | 875 |
| Blank | 406 |

---

## 4. Caveats

- **Native HubSpot `Persona` field is unused** — 3,301 of 3,603 won contacts null; the rest are opaque `persona_1/2/3` codes. Persona must be derived from `JOB_TITLE`.
- **~50% blank titles** on won-deal contacts — the ranking reflects only the titled half.
- **"Persona" is defined 5 different ways** in the stack: Aurora's 6-enum (`derivePersona`), the Dagster ICP gate, the legacy operator `persona_score` (function × seniority), the Pipeline-Pulse buckets, and the HubSpot field. This analysis buckets HubSpot data using **Aurora's canonical logic** for consistency with the bot.
- "Won" = `PIPELINE_STAGE_LABEL ILIKE '%won%'` (Sales Pipeline only). "Open" = `is_closed = false AND is_pipeline_active = true`.

---

## 5. Methodology

Snowflake (`INTERNAL_STAGING`), joining deals → contacts:

```sql
from hubspot.hubspot__deals d
join stg_hubspot.stg_hubspot__deal_contact dc on dc.deal_id = d.deal_id
join stg_hubspot.stg_hubspot__contact c on c.contact_id = dc.contact_id
where coalesce(d.is_deal_deleted,false)=false
  and coalesce(c.is_contact_deleted,false)=false
-- WON:  and d.pipeline_stage_label ilike '%won%'
-- OPEN: and coalesce(d.is_closed,false)=false and coalesce(d.is_pipeline_active,true)=true
```

Persona bucket = Aurora `derivePersona` regex applied to `lower(c.job_title)` (Snowflake `REGEXP_LIKE`, patterns wrapped `.*(...).*`). Table notes: `.claude/table_examples/hubspot__deals.md`, `stg_hubspot__contact.md`, `stg_hubspot__deal_contact.md`.
