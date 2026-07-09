# Agent Instructions — Creating `hackathon_landings` Entries

_Last updated: 2026-07-09. For use by AI agents generating personalized sales assets (landing pages + Gamma decks) for Polar Analytics prospects._

---

## 1. System Overview

This system generates two types of personalized sales assets from a single database row in `hackathon_landings`:

1. **Landing page** — A personalized web page served at `/landing/{id}` built with Next.js. Each section of the page is populated by fields from the row. The recipient receives a unique URL.

2. **Gamma deck** — A personalized slide presentation generated via the Gamma API. The `gamma_*` fields provide all the context Gamma needs to build the deck.

A single row in `hackathon_landings` powers both assets simultaneously. Every field must be filled with care — the quality of the generated assets depends entirely on the richness of the data you write into this table.

---

## 2. Source Data

### 2.1 `hackathon_target_accounts` — Company data

Key columns to read:

| Column | Description |
|--------|-------------|
| `domain_id` | Primary join key with contacts |
| `company_name` | Official company name |
| `logo` | Clearbit logo URL |
| `industry_cleaned` | Cleaned industry label (e.g. "Home & Garden", "Apparel") |
| `rob_tam__shopify_gmv` | Estimated Shopify GMV (numeric, in USD) |
| `marketing_annual_gmv` | Fallback GMV estimate if `rob_tam__shopify_gmv` is null |
| `marketing_gmv_category` | Size bucket (e.g. "F) Enterprise 1 ($20-100M)") |
| `estimated_employee_count` | Approximate headcount |
| `in_market_buckets` | JSON object — keys are active intent signals (see §4.3) |
| `rob_tam__category` | Category path (e.g. "/Home & Garden/Bed & Bath") |
| `som_category` | ICP fit: `Core` = Shopify brand with $5M+ GMV (ideal), `Peripheral`, `Irrelevant` |

**Always prefer accounts where `som_category = 'Core'`.**

### 2.2 `hackathon_target_contacts` — Person data

Key columns to read:

| Column | Description |
|--------|-------------|
| `domain_id` | Join key to account |
| `first_name` | Recipient's first name |
| `last_name` | Recipient's last name |
| `job_title` | Current title — primary signal for persona derivation |
| `job_function` | Broad function category |
| `job_seniority` | Seniority level |
| `persona_score` | Aurora ICP score 0–100 (prefer ≥ 70) |
| `is_icp` | Boolean — prioritize `true` |
| `country` | Country for language detection |
| `email` | Contact email (for reference only, do not store in landings) |

**Always prefer contacts where `is_icp = true` and `persona_score ≥ 70`.**

### 2.3 Join logic

`hackathon_target_contacts.domain_id` = `hackathon_target_accounts.domain_id`

One contact per company per landing row. If a company has multiple ICP contacts, pick the one with the highest `persona_score` and most senior title.

---

## 3. Target Table — `hackathon_landings`

Full schema of columns to populate:

### 3.1 Landing page fields

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `id` | uuid | Auto | Primary key — becomes the URL `/landing/{id}` |
| `created_at` | timestamptz | Auto | Creation timestamp |
| `contact_url` | text | **Yes** | CTA button destination. Use `https://polaranalytics.com/contact` unless instructed otherwise |
| `persona_type` | text | **Yes** | One of: `founder`, `marketing`, `finance`, `ecom`, `retention` |
| `company_name` | text | **Yes** | Exact company name from `hackathon_target_accounts.company_name` |
| `company_industry` | text | No | From `industry_cleaned` — e.g. "Fashion DTC", "Home & Garden" |
| `company_estimated_gmv` | text | No | Human-readable GMV string — e.g. "$71.8M GMV" |
| `company_logo_url` | text | No | From `hackathon_target_accounts.logo` |
| `company_pain_points` | text[] | No | Postgres array of 2–3 short pain point strings |
| `recipient_name` | text | No | Contact's first name — triggers personalized greeting in hero |
| `recipient_title` | text | No | Contact's job title — displayed in hero context line |
| `hook_text` | text | **Yes** | 2–3 paragraph personalized narrative. Paragraphs separated by `\n\n` |
| `hero_headline` | text | No | Override for the hero H1. If null → uses persona default (recommended) |
| `hero_subheadline` | text | No | Override for hero subheadline. If null → uses persona default (recommended) |
| `closing_outcome` | text | No | Override for closing CTA outcome phrase. If null → uses persona default |

### 3.2 Gamma deck fields

| Column | Type | Description |
|--------|------|-------------|
| `gamma_prospect_name` | text | Recipient first name (same as `recipient_name`) |
| `gamma_prospect_job_title` | text | Recipient job title (same as `recipient_title`) |
| `gamma_company_name` | text | Company name (same as `company_name`) |
| `gamma_company_context` | text | Rich 2–4 paragraph company brief for Gamma to use as context |
| `gamma_company_challenges` | text | 3–5 numbered paragraphs describing the company's main challenges |
| `gamma_relevant_polar_use_cases` | text | 4–5 numbered Polar use cases most relevant to this persona and company |
| `gamma_relevant_case_studies` | text | 2–3 formatted case studies most relevant to this company's profile |
| `gamma_presentation_language` | text | Language for the deck — e.g. `English`, `French` |
| `gamma_presentation_objective` | text | One-sentence goal of the presentation |
| `gamma_theme_id` | text | Fixed value: `41qx0nu4jsi7txp` |
| `gamma_api_key` | text | Fixed value: `sk-gamma-s3RpgzwgtKWEGcQ2pPhvy3oYNnzGHixQIW1rMmA` |

---

## 4. Field Generation Guide

### 4.1 Deriving `persona_type`

Analyze `job_title` and `job_function` together using this priority order:

| Persona | Matching keywords (case-insensitive) |
|---------|--------------------------------------|
| `founder` | CEO, Founder, Co-Founder, Owner, President, Managing Director, General Manager, COO |
| `retention` | CRM, Retention, Email, Lifecycle, Loyalty, Customer Success |
| `finance` | CFO, Finance, FP&A, Controller, Treasurer, Chief Finance |
| `ecom` | Ecommerce, E-commerce, DTC, Digital, Merchandis, Head of Commerce, Marketplace, Omnichannel |
| `marketing` | CMO, Marketing, Growth, Acquisition, Performance, Media, Brand, Creative, Paid, SEO |
| _(default)_ | `founder` |

Each `persona_type` loads a pre-built set of pain/solution cards, product features, and case studies from the Next.js codebase. Only override `hero_headline`, `hero_subheadline`, or `closing_outcome` if you have a strong, specific reason — the defaults from `data/personas/*.ts` are well-written and tested.

### 4.2 Formatting `company_estimated_gmv`

```
gmv = rob_tam__shopify_gmv ?? marketing_annual_gmv

if gmv >= 1,000,000,000 → "$X.XB GMV"
if gmv >= 1,000,000     → "$X.XM GMV"   (e.g. "$71.8M GMV")
if gmv >= 1,000         → "$XXXK GMV"
if gmv is null          → leave null
```

### 4.3 Reading `in_market_buckets`

This JSON field contains active intent signals. Each present signal means the company is exhibiting that buying behavior right now. Use the keys to personalize content:

| Signal key | Meaning | Content implication |
|------------|---------|---------------------|
| `getting_mature_on_ads` | Paid spend is scaling | Lead with attribution and incrementality |
| `high_ad_spend` | Large media budgets | Lead with CAC payback and incrementality |
| `high_growth` | Rapid GMV growth | Lead with data infrastructure keeping pace |
| `klaviyo_user` | Active Klaviyo user | Mention Klaviyo Audiences enrichment |
| `shopify_plus` | On Shopify Plus | Confirm ICP fit in hook_text |
| `multi_channel` | Selling on multiple channels | Lead with unified attribution |
| `retention_focused` | Retention priority | Lead with LTV cohorts and Klaviyo enrichment |

Read: `Object.keys(in_market_buckets).filter(k => in_market_buckets[k].present === true)`

### 4.4 Writing `hook_text`

This is the personalized narrative shown in the "What we found at [Company]" section of the landing page. It is always written from Polar's perspective to the recipient.

**Structure (2–3 paragraphs, separated by `\n\n`):**

```
Paragraph 1: Company snapshot
"{Company} is a {industry} brand on Shopify doing ~{GMV} in annual GMV
with a {headcount}-person team."

Paragraph 2: In-market signal or specific context
Use the active signals from in_market_buckets to write a sentence that
shows you've done your homework. E.g.:
"Your paid media spend is scaling — and at this stage, the gap between
what platforms report and what's actually in your P&L tends to widen."

Paragraph 3: Bridge to Polar
"Brands at {company}'s stage typically struggle with {persona_pain_phrase}.
We think Polar can change that — and we've seen it work for similar brands
in {industry}."
```

**Tone rules (from Polar's brand guidelines):**
- Sentence case only — never title case
- No "supercharge", "unlock", "revolutionary", "game-changing"
- Lead with outcomes, not features
- Numbers and concrete verbs over adjectives
- No exclamation points

### 4.5 Writing `company_pain_points`

A Postgres text array of 2–3 short strings (shown as chips/tags on the landing page).

Derive from:
1. Active `in_market_buckets` signals (see §4.3)
2. Persona-default pain points if signals are sparse

**Persona default pain points:**
- `founder`: "No unified profit view across channels", "Reporting takes hours of leadership time"
- `marketing`: "Attribution inconsistencies across Meta and Google", "No incrementality testing in place"
- `finance`: "Contribution margin calculated manually", "No live CAC payback metric"
- `ecom`: "Revenue movement not visible in real time", "Inventory stockouts discovered too late"
- `retention`: "Klaviyo segments limited to email events only", "LTV cohort data unavailable without SQL"

Keep each string under 60 characters. No verbs — noun phrases only.

### 4.6 Writing `gamma_company_context`

A richer version of `hook_text` written for a Gamma AI to use as slide context. Should be 3–4 paragraphs:

1. **Company profile** — name, GMV, industry, team size, platform (Shopify), market position
2. **Active signals** — what the intent data shows about their current challenges
3. **Contact profile** — who the recipient is, what they care about given their title
4. **Why Polar now** — why this company is a good fit at this stage

This field is used by Gamma to generate contextually accurate slides — the richer it is, the better the output.

### 4.7 Writing `gamma_company_challenges`

3–5 numbered paragraphs, each describing a specific challenge. Each challenge should:
- Be grounded in actual data from `in_market_buckets` or the persona
- Be specific enough that the recipient recognizes it from their own experience
- Connect implicitly to a Polar solution (without being salesy)

**Format:**
```
1. {Challenge title or first sentence describing the problem}
   {One or two supporting sentences with specifics.}

2. ...
```

### 4.8 Writing `gamma_relevant_polar_use_cases`

5 numbered use cases from the knowledge file `polar_usecases_by_persona.md`, selected for the contact's persona. Each should include:
- Bold name of the use case
- One sentence describing what it does
- One sentence on the outcome/value

Use the persona matrix in `polar_usecases_by_persona.md` to select the most relevant 5. Order them with the most compelling use case first (based on the contact's active signals).

### 4.9 Writing `gamma_relevant_case_studies`

2–3 case studies from `polar_case_studies.md`, selected for relevance to:
1. The company's industry (same or adjacent vertical gets priority)
2. The active in-market signals (e.g. `getting_mature_on_ads` → cite an incrementality case study)
3. The persona type (founder → cite Jones Road, Tiege Hanley, Homefield)

**Format for each:**
```
{N}. **{Brand}** ({Theme})
   {Key result — verbatim metric from the case study file}
   "{Quote}" — {Name, Title}
```

**Important:** All numbers must be verbatim from `polar_case_studies.md`. Never round up or extrapolate metrics.

### 4.10 Writing `gamma_presentation_objective`

One sentence. Structure:
```
Convince {first_name} ({job_title} at {company_name}) to schedule a 30-minute
Polar Analytics demo by demonstrating how Polar solves {their specific pain},
with proof from brands at a similar stage and scale.
```

### 4.11 `gamma_presentation_language`

Derive from the contact's `country` field:
- United States, United Kingdom, Australia, Canada → `English`
- France, Belgium (FR), Switzerland (FR) → `French`
- Germany, Austria, Switzerland (DE) → `German`
- Spain, Mexico, Latin America → `Spanish`
- Default → `English`

### 4.12 Fixed values

```
gamma_theme_id  = "41qx0nu4jsi7txp"
gamma_api_key   = "sk-gamma-s3RpgzwgtKWEGcQ2pPhvy3oYNnzGHixQIW1rMmA"
contact_url     = "https://polaranalytics.com/contact"
```

---

## 5. How the Data Is Used

### 5.1 Landing page placeholders

The Next.js app at `/landing/{id}` maps each field to a UI section:

| Section | Fields consumed |
|---------|----------------|
| **Header** | `contact_url` → "Get in touch" button |
| **Hero** | `recipient_name` → greeting line · `hero_headline` (or persona default) · `hero_subheadline` (or persona default) · `company_name`, `company_industry`, `company_estimated_gmv` → context line · `contact_url` → CTA button |
| **Social proof** | Static (not from DB) |
| **Personalized hook** | `company_name` → section title · `hook_text` → narrative paragraphs · `company_pain_points` → tags |
| **Pain → Solution cards** | Loaded from `persona_type` → maps to `data/personas/{persona_type}.ts` in the codebase |
| **Product showcase** | Loaded from `persona_type` |
| **Results / case studies** | Loaded from `persona_type` |
| **Closing CTA** | `company_name` → headline · `closing_outcome` (or persona default) → subheadline · `contact_url` → button |
| **Footer** | Static |

### 5.2 Gamma deck placeholders

The Gamma API receives these fields as template variables:

| Gamma placeholder | DB column |
|------------------|-----------|
| `{{prospect_name}}` | `gamma_prospect_name` |
| `{{prospect_job_title}}` | `gamma_prospect_job_title` |
| `{{company_name}}` | `gamma_company_name` |
| `{{company_context}}` | `gamma_company_context` |
| `{{company_challenges}}` | `gamma_company_challenges` |
| `{{relevant_polar_use_cases}}` | `gamma_relevant_polar_use_cases` |
| `{{relevant_case_studies}}` | `gamma_relevant_case_studies` |
| `{{presentation_language}}` | `gamma_presentation_language` |
| `{{presentation_objective}}` | `gamma_presentation_objective` |
| `{{gamma_theme_id}}` | `gamma_theme_id` |
| `{{gamma_api_key}}` | `gamma_api_key` |

---

## 6. Knowledge Files to Use

Located in `/knowledge/` at the root of the Aurora repo:

| File | When to use |
|------|-------------|
| `polar_usecases_by_persona.md` | Building `gamma_relevant_polar_use_cases` and selecting features to highlight in `hook_text` |
| `polar_case_studies.md` | Building `gamma_relevant_case_studies`. All metrics must be verbatim from this file |
| `polar_usecases_by_persona.md` §"Talk-track guardrails" | Tone and framing checks before writing any copy |
| `personas_chased_vs_closed.md` | Understanding which personas close most often (Founder > Marketing > Ecom) — prioritize accordingly |
| `brand_som_tiers.md` | Understanding `som_category` and `TIER` fields — use to prioritize high-intent accounts |

---

## 7. Contact Selection Criteria

When choosing which contacts to create landings for, apply these filters in order:

1. `hackathon_target_accounts.som_category = 'Core'` (Shopify brand, $5M+ GMV)
2. `hackathon_target_contacts.is_icp = true`
3. `hackathon_target_contacts.persona_score >= 70`
4. `hackathon_target_contacts.job_title IS NOT NULL`
5. One contact per company (deduplicate by `domain_id`, keep highest `persona_score`)
6. Prefer `job_seniority` in: `Executive & C-Level`, `Director & VP`, `Head of & Senior Manager`

---

## 8. Quality Checklist

Before inserting a row, verify:

- [ ] `persona_type` correctly reflects the contact's actual role
- [ ] `hook_text` mentions the company by name and references at least one specific data point (GMV, signal, or industry)
- [ ] `hook_text` paragraphs are separated by `\n\n` (not `\n`)
- [ ] `company_pain_points` contains 2–3 items, each under 60 characters
- [ ] `gamma_company_context` is at least 3 paragraphs and specific enough to generate accurate slide content
- [ ] `gamma_relevant_case_studies` uses only verbatim metrics from `polar_case_studies.md`
- [ ] `gamma_theme_id` and `gamma_api_key` are set to the fixed values above
- [ ] `contact_url` is set
- [ ] No French, Spanish, or other non-English copy if `gamma_presentation_language = 'English'`
- [ ] No emoji anywhere in the copy (Polar brand guideline)

---

## 9. Insertion Method

The hackathon Supabase project blocks direct PostgreSQL connections. All writes must go through the REST API:

```
POST {SUPABASE_URL}/rest/v1/hackathon_landings
Headers:
  apikey: {SUPABASE_KEY}
  Authorization: Bearer {SUPABASE_KEY}
  Content-Type: application/json
  Prefer: return=representation
Body: JSON object with all fields
```

The response returns the created row including its auto-generated `id` (UUID). This `id` is the landing page URL: `/landing/{id}`.

Credentials are stored in `/landing-page-builder/.env.local`:
- `SUPABASE_URL` — project URL
- `SUPABASE_KEY` — service role key (bypasses RLS)

Reference scripts:
- `landing-page-builder/scripts/seed-landings.mjs` — bulk seeding from contacts/accounts tables
- `landing-page-builder/scripts/update-gamma-fields.mjs` — patching gamma_ fields on existing rows
