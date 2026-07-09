import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const envContent = readFileSync(resolve(__dirname, '../.env.local'), 'utf8')
for (const line of envContent.split('\n')) {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith('#')) continue
  const [key, ...rest] = trimmed.split('=')
  if (key && rest.length) process.env[key] = rest.join('=')
}

const BASE = process.env.SUPABASE_URL
const KEY  = process.env.SUPABASE_KEY
const GAMMA_THEME_ID = '41qx0nu4jsi7txp'
const GAMMA_API_KEY  = 'sk-gamma-s3RpgzwgtKWEGcQ2pPhvy3oYNnzGHixQIW1rMmA'

async function get(table, params = '') {
  const res = await fetch(`${BASE}/rest/v1/${table}?${params}`, {
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
  })
  return res.json()
}

async function patch(table, id, data) {
  const res = await fetch(`${BASE}/rest/v1/${table}?id=eq.${id}`, {
    method: 'PATCH',
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify(data),
  })
  return res.json()
}

// ── Knowledge: Use cases by persona ─────────────────────────────────────────

const USE_CASES = {
  founder: `1. **One profit-legible source of truth** — Blended MER, real CAC, contribution margin, and LTV across Shopify, Meta, Google, Klaviyo, and Amazon in one place. No more conflicting numbers across tools.

2. **Ask Polar (AI Data Analyst)** — Ask "How did we do yesterday? What changed? What should I look at?" in plain English and get answers in seconds. No SQL, no analyst bottleneck, no waiting until Monday.

3. **CFO Agent with daily task list** — A custom AI agent trained on your brand's data that delivers a morning read of your P&L, CAC, and cash position — with action items, not just charts.

4. **Polar MCP — data into the tools you already use** — Pipe clean, governed commerce data directly into Claude, ChatGPT, or Slack. Ask business questions in the tools your team already lives in.

5. **Causal Lift (Incrementality Testing)** — Find out which channels are actually driving revenue versus stealing credit from organic. Stop funding channels on faith.`,

  marketing: `1. **First-party attribution** — Polar Pixel + Lifetime ID attributes every conversion accurately across channels, devices, and sessions. No more platform inflation.

2. **Causal Lift (Incrementality Testing)** — Twin-geo holdout tests that prove which channels drive incremental revenue — and which are cannibalizing organic. Forward the results to the CEO with confidence.

3. **AI Media Buyer Agent** — Daily spend recommendations and budget monitoring grounded in live ROAS, CAC, and incrementality data. Not guesswork.

4. **Blended MER/ROAS by channel and campaign** — One trusted view of cross-channel performance, so spend decisions are backed by a number, not a platform's self-reported ROAS.

5. **Ask Polar (AI Analyst)** — Dynamic AI alerts when ROAS drops, CAC spikes, or conversion rates dip — before anyone notices in a Monday report.`,

  ecom: `1. **Daily store performance cockpit** — Real-time revenue, AOV, conversion, and product performance across Shopify, Amazon, and retail in one view. No more waiting until Tuesday.

2. **AI Inventory Planner** — Predicts stockouts 2–4 weeks ahead from velocity, lead time, and seasonal patterns. Generates reorder recommendations automatically.

3. **Product and SKU profitability** — Margin per SKU, category, and collection including COGS, returns, and ad attribution. Know which products to buy more of and which to cut.

4. **Merchandiser Agent** — An AI agent that monitors your catalog performance daily and surfaces the decisions that need attention — markdowns, reorders, bundle opportunities.

5. **Omnichannel roll-up** — Shopify + Amazon + retail consolidated into a single operational view. No more toggling between dashboards.`,

  finance: `1. **Contribution margin and blended profitability** — CAC, blended MER, contribution margin, and payback period defined once in a governed semantic layer and consistent across every report.

2. **CAC payback and LTV:CAC** — Live metrics that show exactly when ad spend pays back, broken down by channel, cohort, and campaign. Not a monthly spreadsheet exercise.

3. **CFO Agent with automated task list** — An AI agent that delivers a daily finance-grade read of your P&L and KPIs — margin, payback curves, and channel ROI — without waiting on an analyst.

4. **Ask Polar for margin and payback questions** — Ask "What's our true contribution margin after returns this month?" and get a grounded, auditable answer in seconds.

5. **Governed Snowflake warehouse** — Your own dedicated data warehouse with SQL access, auditable metric definitions, and full data ownership. Finance-grade, not a black box.`,

  retention: `1. **Klaviyo Audiences enrichment** — Enrich Klaviyo segments with warehouse-level data: LTV, purchase frequency, predicted churn, and product affinity. Up to 70% increase in flow revenue.

2. **LTV and cohort analysis** — Full cohort tables and LTV curves by acquisition channel, campaign, and product. Know which sources produce loyal customers vs. one-time buyers.

3. **AI Email Marketer (Klaviyo)** — Automatically builds, tests, and optimizes Klaviyo flows against live revenue data. No manual segment setup, no guesswork on timing or subject lines.

4. **Retention & LTV Analyst Agent** — A custom AI agent that monitors cohort health, flags churn risk, and surfaces re-engagement opportunities on a daily basis.

5. **Repeat-purchase gap analysis** — Identify the exact window when customers are most likely to repurchase — and trigger the right flow at the right moment.`,
}

// ── Knowledge: Case studies by industry ─────────────────────────────────────

const CASE_STUDIES_BY_INDUSTRY = {
  default_founder: [
    {
      brand: 'Jones Road Beauty',
      result: '13 of 17 staff now self-serve 130+ AI analyses/month; reports went from 1–2 weeks to seconds',
      quote: '"We have one data analyst and in the past it used to take two weeks to get a report...you can get anything in a heartbeat." — Cody Plofker, CEO',
      theme: 'AI & reporting speed',
    },
    {
      brand: 'Tiege Hanley',
      result: 'Replaced a $300K+/year in-house data stack (Snowflake/Fivetran/dbt/Tableau) with Polar',
      quote: '"Before Polar, we had to build everything manually...Now, I focus on the deeper analytics that actually move the business forward." — Tri Ngo, Senior Manager of Advanced Analytics',
      theme: 'Data stack consolidation',
    },
    {
      brand: 'Homefield',
      result: 'Founder went from monthly spreadsheet analysis to daily data-driven decisions',
      quote: '"Polar is something we plan to use for a long time because it helps drive better decisions." — Connor Hitchcock, Founder & CEO',
      theme: 'Founder-led analytics',
    },
  ],
  home_wellness: [
    {
      brand: 'Canopy',
      result: '432 hours/year saved on manual reporting across 17+ connected data platforms',
      quote: '"What really stood out was the custom metrics builder. It became our one source of truth." — Noel Espinosa, Chief of Staff',
      theme: 'Reporting efficiency',
    },
  ],
  fashion: [
    {
      brand: 'Sage and Paige',
      result: '+41% Meta ROAS and −32% cost per purchase in 14 days via Polar CAPI',
      quote: '"Thanks to Polar, our Meta ROAS increased by 41% and cost per purchase dropped by 32%." — Arthur Chau, Director',
      theme: 'Attribution & CAPI',
    },
    {
      brand: 'The Frankie Shop',
      result: '+30% ROAS and −22% cost per purchase in 7 days across two stores',
      quote: '"Our decision to adopt Polar\'s server-side tracking wasn\'t just about solving a problem; it was about seizing an opportunity." — Robin Caillaud, CMO',
      theme: 'Attribution & CAPI',
    },
  ],
  grooming_skincare: [
    {
      brand: 'Tiege Hanley',
      result: 'Replaced $300K+/year in-house data stack — identical vertical (men\'s DTC brand on Shopify)',
      quote: '"Before Polar, we had to build everything manually...Now, I focus on the deeper analytics that actually move the business forward."',
      theme: 'Data stack',
    },
  ],
  incrementality: [
    {
      brand: 'The Feed',
      result: 'Geo-holdout test proved $25K/month brand search spend was largely non-incremental',
      quote: '"I have a hunch that some strategies might not be as effective as presumed, and proving this could help us gain significant savings." — Matthew Johnson, Founder',
      theme: 'Incrementality',
    },
    {
      brand: 'CABA Design',
      result: '3.45× incremental ROAS proven via Twin Geo test → unlocked a 50% Google Ads scale-up',
      quote: '"We had conviction to scale, but not the proof to back it. Without incrementality, every dollar felt like a guess." — CEO, CABA Design',
      theme: 'Incrementality',
    },
  ],
}

function getCaseStudies(industry, inMarketBuckets) {
  const studies = [...CASE_STUDIES_BY_INDUSTRY.default_founder]

  const industry_lower = (industry || '').toLowerCase()
  if (industry_lower.includes('home') || industry_lower.includes('wellness')) {
    studies.unshift(...CASE_STUDIES_BY_INDUSTRY.home_wellness)
  }
  if (industry_lower.includes('fashion') || industry_lower.includes('apparel') || industry_lower.includes('cloth')) {
    studies.unshift(...CASE_STUDIES_BY_INDUSTRY.fashion)
  }
  if (industry_lower.includes('groom') || industry_lower.includes('skin') || industry_lower.includes('beauty') || industry_lower.includes('personal care')) {
    studies.unshift(...CASE_STUDIES_BY_INDUSTRY.grooming_skincare)
  }

  const signals = Object.keys(inMarketBuckets || {}).filter(k => inMarketBuckets[k]?.present)
  if (signals.includes('getting_mature_on_ads') || signals.includes('high_ad_spend')) {
    studies.unshift(...CASE_STUDIES_BY_INDUSTRY.incrementality)
  }

  // Deduplicate by brand, take best 3
  const seen = new Set()
  return studies.filter(s => {
    if (seen.has(s.brand)) return false
    seen.add(s.brand)
    return true
  }).slice(0, 3)
}

function formatCaseStudies(studies) {
  return studies.map((s, i) =>
    `${i + 1}. **${s.brand}** (${s.theme})\n   ${s.result}\n   ${s.quote}`
  ).join('\n\n')
}

// ── Company context builder ──────────────────────────────────────────────────

function buildCompanyContext(account, contact) {
  const { company_name, industry_cleaned, rob_tam__shopify_gmv, marketing_annual_gmv,
          estimated_employee_count, in_market_buckets, rob_tam__category } = account

  const gmv = rob_tam__shopify_gmv ?? marketing_annual_gmv
  const gmvStr = gmv ? (gmv >= 1e9 ? `$${(gmv/1e9).toFixed(1)}B` : gmv >= 1e6 ? `$${(gmv/1e6).toFixed(1)}M` : `$${(gmv/1e3).toFixed(0)}K`) : null
  const signals = Object.keys(in_market_buckets || {}).filter(k => in_market_buckets[k]?.present)
  const category = rob_tam__category?.replace(/^\//, '').replace(/\//g, ' → ') || industry_cleaned || 'DTC'

  const signalPhrases = {
    getting_mature_on_ads: 'scaling paid media spend with growing complexity around attribution and incrementality',
    high_ad_spend: 'operating with significant media budgets across Meta and Google',
    high_growth: 'growing quickly, with reporting infrastructure struggling to keep up',
    klaviyo_user: 'actively using Klaviyo for email marketing',
    shopify_plus: 'operating on Shopify Plus',
    multi_channel: 'selling across multiple channels (DTC + marketplace)',
    retention_focused: 'prioritizing customer retention and repeat purchase optimization',
  }

  const contextSignals = signals.map(s => signalPhrases[s]).filter(Boolean)

  return [
    `${company_name} is a Shopify DTC brand operating in the ${category} vertical${gmvStr ? `, generating ~${gmvStr} in annual GMV` : ''}.${estimated_employee_count ? ` They have an estimated ${estimated_employee_count}-person team.` : ''}`,
    contextSignals.length > 0
      ? `Key signals: the brand is currently ${contextSignals.join(', and ')}.`
      : `The brand is at a stage where data clarity and operational efficiency are becoming critical competitive factors.`,
    `${contact.first_name ?? 'The CEO'} is the point of contact for strategic decisions including data infrastructure, marketing ROI, and profitability. As a founder-led brand at this scale, the core challenge is getting a profit-legible view of the business without an army of analysts — and Polar is built exactly for this.`,
  ].join('\n\n')
}

// ── Challenges builder ───────────────────────────────────────────────────────

const SIGNAL_CHALLENGES = {
  getting_mature_on_ads: 'Attribution is becoming unreliable as paid spend scales — platform ROAS numbers differ from actual P&L performance, making budget allocation decisions feel like guesswork.',
  high_ad_spend: 'With significant media budgets across Meta and Google, there is no reliable way to prove which spend is truly incremental versus cannibalizing organic revenue.',
  high_growth: 'Rapid growth has outpaced the data infrastructure — reporting is manual, delayed, and inconsistent across teams, slowing down decisions that need to be made in hours, not weeks.',
  klaviyo_user: 'Klaviyo segments are limited to email-event data, missing a large share of customer behavior that lives in Shopify — leading to under-optimized flows and missed revenue.',
  shopify_plus: 'Data is siloed across Shopify Plus, Meta, Google Ads, and Klaviyo — no single platform gives a complete view of performance.',
  multi_channel: 'Each channel reports its own version of ROAS and CAC, with no blended view that reflects actual profitability across all touchpoints.',
  retention_focused: 'LTV and cohort analysis is either unavailable or requires manual SQL work — making it hard to identify which acquisition channels produce the most loyal customers.',
}

const PERSONA_CHALLENGES = {
  founder: [
    'Profitability is hard to read — five dashboards, three different ROAS numbers, and no single source of truth for contribution margin.',
    'Reporting takes hours of leadership time every week — pulling numbers from disconnected tools before any strategic call can happen.',
    'It is unclear which marketing channels are actually driving incremental revenue versus claiming credit for sales that would have happened anyway.',
  ],
}

function buildChallenges(account, persona) {
  const signals = Object.keys(account.in_market_buckets || {}).filter(k => account.in_market_buckets[k]?.present)
  const signalChallenges = signals.map(s => SIGNAL_CHALLENGES[s]).filter(Boolean)
  const personaChallenges = PERSONA_CHALLENGES[persona] || PERSONA_CHALLENGES.founder

  const all = [...new Set([...signalChallenges, ...personaChallenges])]
  return all.slice(0, 4).map((c, i) => `${i + 1}. ${c}`).join('\n\n')
}

function buildObjective(contact, account, persona) {
  const name = contact.first_name ?? 'the CEO'
  const title = contact.job_title ?? 'CEO'
  const company = account.company_name
  return `Convince ${name} (${title} at ${company}) to schedule a 30-minute Polar Analytics demo by showing, with concrete proof, how Polar gives founder-led DTC brands a profit-legible source of truth — eliminating the reporting overhead and attribution guesswork that costs their team hours every week. The goal is a booked demo, not a closed deal.`
}

// ── Main ─────────────────────────────────────────────────────────────────────

console.log('Fetching existing landing entries...')
const landings = await get(
  'hackathon_landings',
  `id=in.(38fc974a-7799-4ad6-8f5b-b4e250d97b14,00b2dc5f-6cac-4afe-b49f-b8395043a9bc,537b26ed-7942-4cf3-ae0c-ac7cdc61eb68,1abb5aea-9e52-43e9-8233-5a71e04fbf66)&select=id,company_name,recipient_name,recipient_title,persona_type`
)

// Fetch account data for each company
console.log('Fetching account data...')
const accounts_raw = await get(
  'hackathon_target_contacts',
  `first_name=in.(Tyler,Michael,Neelbharat)&is_icp=eq.true&select=domain_id,first_name&limit=10`
)

// Also get the David contact
const david_contact = await get(
  'hackathon_target_contacts',
  `domain_id=eq.0d49ebc190ff8896ec412a8b3e9cdf67&select=domain_id,first_name&limit=1`
)

// Collect domain IDs from the seed contacts
const SEED_DOMAIN_IDS = [
  '5338fa246471bcb0e625101ae2695a24', // Tyler / Cozy Earth
  '0d49ebc190ff8896ec412a8b3e9cdf67', // David
  'e5ce4a112fd57df34590e8ca3fd2fcf2', // Michael / Jaanuu
  'ff4814550cf547b6cc2d46208bc4f73e', // Neelbharat / Skull Shaver
]

const accounts_list = await get(
  'hackathon_target_accounts',
  `domain_id=in.(${SEED_DOMAIN_IDS.join(',')})&select=domain_id,company_name,industry_cleaned,rob_tam__shopify_gmv,marketing_annual_gmv,in_market_buckets,estimated_employee_count,rob_tam__category`
)

const accountByCompanyName = {}
accounts_list.forEach(a => { accountByCompanyName[a.company_name] = a })

// Map landing entries to contacts (simple match by recipient_name)
const CONTACT_META = {
  'Cozy Earth': { first_name: 'Tyler', job_title: 'CEO' },
  'David': { first_name: 'David', job_title: 'CEO' },
  'Jaanuu': { first_name: 'Michael', job_title: 'Chief Executive Officer' },
  'Skull Shaver': { first_name: 'Neelbharat', job_title: 'CEO' },
}

console.log('\nBuilding and patching Gamma fields...\n')

for (const landing of landings) {
  const account = accountByCompanyName[landing.company_name]
  if (!account) {
    console.warn(`⚠ No account found for "${landing.company_name}", skipping`)
    continue
  }

  const contact = CONTACT_META[landing.company_name] ?? {
    first_name: landing.recipient_name,
    job_title: landing.recipient_title,
  }
  const persona = landing.persona_type ?? 'founder'
  const caseStudies = getCaseStudies(account.industry_cleaned, account.in_market_buckets)

  const gammaFields = {
    gamma_prospect_name:             contact.first_name,
    gamma_prospect_job_title:        contact.job_title,
    gamma_company_name:              account.company_name,
    gamma_company_context:           buildCompanyContext(account, contact),
    gamma_company_challenges:        buildChallenges(account, persona),
    gamma_relevant_polar_use_cases:  USE_CASES[persona] ?? USE_CASES.founder,
    gamma_relevant_case_studies:     formatCaseStudies(caseStudies),
    gamma_presentation_language:     'English',
    gamma_presentation_objective:    buildObjective(contact, account, persona),
    gamma_theme_id:                  GAMMA_THEME_ID,
    gamma_api_key:                   GAMMA_API_KEY,
  }

  const result = await patch('hackathon_landings', landing.id, gammaFields)

  if (Array.isArray(result) && result.length > 0) {
    console.log(`✓ ${account.company_name} — ${contact.first_name}`)
  } else {
    console.error(`✗ Failed for ${account.company_name}:`, JSON.stringify(result))
  }
}

console.log('\nDone. Run the landing pages on /landing/{id} to verify.')
