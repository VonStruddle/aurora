import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Load .env.local
const envContent = readFileSync(resolve(__dirname, '../.env.local'), 'utf8')
for (const line of envContent.split('\n')) {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith('#')) continue
  const [key, ...rest] = trimmed.split('=')
  if (key && rest.length) process.env[key] = rest.join('=')
}

const BASE = process.env.SUPABASE_URL
const KEY  = process.env.SUPABASE_KEY

async function get(table, params = '') {
  const res = await fetch(`${BASE}/rest/v1/${table}?${params}`, {
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
  })
  return res.json()
}

async function insert(table, rows) {
  const res = await fetch(`${BASE}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify(rows),
  })
  return res.json()
}

// ── Persona derivation ──────────────────────────────────────────────────────

function derivePersona(jobTitle = '', jobFunction = '') {
  const t = (jobTitle + ' ' + jobFunction).toLowerCase()
  if (/ceo|founder|owner|president|co-founder|managing director|general manager|coo/.test(t)) return 'founder'
  if (/crm|retention|email|lifecycle|loyalty|customer success/.test(t)) return 'retention'
  if (/cfo|finance|fp&a|controller|treasurer|chief finance/.test(t)) return 'finance'
  if (/ecommerce|e-commerce|dtc|digital|merchandis|head of commerce|marketplace/.test(t)) return 'ecom'
  if (/marketing|growth|acquisition|performance|media|brand|creative|paid|seo|content/.test(t)) return 'marketing'
  return 'founder'
}

// ── GMV formatter ────────────────────────────────────────────────────────────

function formatGmv(value) {
  if (!value) return null
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B GMV`
  if (value >= 1_000_000)     return `$${(value / 1_000_000).toFixed(1)}M GMV`
  return `$${(value / 1_000).toFixed(0)}K GMV`
}

// ── In-market signal translation ─────────────────────────────────────────────

const SIGNAL_SENTENCES = {
  getting_mature_on_ads:    'Your paid media spend is scaling — attribution clarity becomes critical at this stage.',
  high_ad_spend:            'With significant media budgets in play, knowing your true incremental ROAS matters.',
  high_growth:              'You are growing fast — the data infrastructure needs to keep up.',
  klaviyo_user:             'You are already on Klaviyo, so enriching your audiences with warehouse-level data is a quick win.',
  shopify_plus:             'You are on Shopify Plus — the kind of brand Polar was built for.',
  multi_channel:            'You are selling across multiple channels, which makes unified attribution non-negotiable.',
  retention_focused:        'Retention is clearly a priority — Polar gives you the LTV and cohort data to act on it.',
}

const SIGNAL_PAIN_POINTS = {
  getting_mature_on_ads:    'Attribution inconsistencies as paid media spend scales',
  high_ad_spend:            'No incrementality testing despite significant media budgets',
  high_growth:              'Reporting infrastructure not keeping pace with growth',
  klaviyo_user:             'Klaviyo audiences limited to email events, missing purchase behavior',
  shopify_plus:             'Data fragmented across Shopify Plus, ads, and email platforms',
  multi_channel:            'No unified view across channels — each platform reports differently',
  retention_focused:        'LTV and cohort data unavailable without analyst help',
}

const PERSONA_PAIN_PHRASE = {
  founder:   'getting a clean view of profit, CAC, and revenue without analyst overhead',
  marketing: 'having attribution numbers they can actually trust and forward to leadership',
  finance:   'calculating true CAC payback and contribution margin from live data',
  ecom:      'seeing daily revenue movement and acting on it without waiting for reports',
  retention: 'enriching Klaviyo audiences with real purchase data and cohort LTV',
}

const PERSONA_CLOSING = {
  founder:   'one source of truth for profit, CAC, and revenue — so you can run the business, not the spreadsheets',
  marketing: 'attribution clarity and incrementality-backed budget decisions your team can act on immediately',
  finance:   'automated contribution margin, real-time CAC payback, and CFO-ready reporting without the analyst bottleneck',
  ecom:      'real-time revenue visibility, automated stockout prevention, and margin-backed merchandising decisions',
  retention: 'Klaviyo audiences built on real purchase behavior and LTV-driven segmentation that drives flow revenue',
}

function buildPainPoints(inMarketBuckets, persona) {
  const signals = Object.keys(inMarketBuckets || {}).filter(k => inMarketBuckets[k]?.present)
  const points = signals
    .map(k => SIGNAL_PAIN_POINTS[k])
    .filter(Boolean)
    .slice(0, 2)

  // Fill with persona defaults if not enough signals
  const defaults = {
    founder:   ['No unified profit view across channels', 'Weekly reporting takes too long'],
    marketing: ['Attribution inconsistencies across Meta and Google', 'No incrementality testing in place'],
    finance:   ['Contribution margin calculated manually in spreadsheets', 'No live CAC payback metric'],
    ecom:      ['Revenue movement not visible until days later', 'Inventory stockouts discovered too late'],
    retention: ['Klaviyo segments limited to email events only', 'LTV cohort data unavailable without SQL'],
  }

  while (points.length < 2) {
    const def = defaults[persona].find(d => !points.includes(d))
    if (def) points.push(def)
    else break
  }
  return points
}

function buildHookText(account, persona) {
  const { company_name, industry_cleaned, in_market_buckets, estimated_employee_count } = account
  const gmv = account.rob_tam__shopify_gmv ?? account.marketing_annual_gmv
  const gmvStr = formatGmv(gmv) ?? 'strong revenue'

  const signals = Object.keys(in_market_buckets || {}).filter(k => in_market_buckets[k]?.present)
  const signalSentence = signals
    .map(k => SIGNAL_SENTENCES[k])
    .filter(Boolean)
    .slice(0, 1)
    .join(' ')

  const size = estimated_employee_count
    ? `${estimated_employee_count}-person team`
    : 'growing team'

  return [
    `${company_name} is a ${industry_cleaned ?? 'DTC'} brand on Shopify doing ~${gmvStr} in annual GMV with a ${size}.`,
    signalSentence || `At this scale, getting clean data across all channels becomes the bottleneck.`,
    `Brands like ${company_name} typically struggle with ${PERSONA_PAIN_PHRASE[persona]}. We think Polar can change that — and we have seen it work for similar-stage brands in this space.`,
  ].join('\n\n')
}

// ── Main ─────────────────────────────────────────────────────────────────────

console.log('Fetching ICP contacts...')
const contacts = await get(
  'hackathon_target_contacts',
  'is_icp=eq.true&job_title=not.is.null&select=id,domain_id,first_name,job_title,job_function&order=persona_score.desc&limit=50'
)

// Deduplicate by domain_id — pick best (first) contact per company
const seenDomains = new Set()
const picked = []
for (const c of contacts) {
  if (c.domain_id && !seenDomains.has(c.domain_id) && picked.length < 4) {
    seenDomains.add(c.domain_id)
    picked.push(c)
  }
}

console.log(`Selected ${picked.length} contacts from distinct companies:`)
picked.forEach(c => console.log(`  ${c.first_name} — ${c.job_title} (domain: ${c.domain_id})`))

// Fetch associated accounts
const domainIds = picked.map(c => c.domain_id)
const domainFilter = `(${domainIds.join(',')})`
const accounts = await get(
  'hackathon_target_accounts',
  `domain_id=in.${domainFilter}&select=domain_id,company_name,logo,industry_cleaned,rob_tam__shopify_gmv,marketing_annual_gmv,in_market_buckets,estimated_employee_count`
)
const accountMap = Object.fromEntries(accounts.map(a => [a.domain_id, a]))

// Build landing rows
const rows = picked.map(contact => {
  const account = accountMap[contact.domain_id]
  if (!account) {
    console.warn(`  ⚠ No account found for domain ${contact.domain_id}, skipping`)
    return null
  }

  const persona = derivePersona(contact.job_title, contact.job_function)
  const gmv = account.rob_tam__shopify_gmv ?? account.marketing_annual_gmv

  return {
    contact_url:           'https://polaranalytics.com/contact',
    persona_type:          persona,
    company_name:          account.company_name,
    company_industry:      account.industry_cleaned ?? null,
    company_estimated_gmv: formatGmv(gmv),
    company_logo_url:      account.logo ?? null,
    company_pain_points:   buildPainPoints(account.in_market_buckets, persona),
    recipient_name:        contact.first_name ?? null,
    recipient_title:       contact.job_title ?? null,
    hook_text:             buildHookText(account, persona),
    hero_headline:         null,
    hero_subheadline:      null,
    closing_outcome:       PERSONA_CLOSING[persona],
  }
}).filter(Boolean)

console.log('\nInserting into hackathon_landings...')
const created = await insert('hackathon_landings', rows)

if (!Array.isArray(created)) {
  console.error('Insert failed:', JSON.stringify(created, null, 2))
  process.exit(1)
}

console.log('\n✓ Created 4 landing entries:\n')
created.forEach(row => {
  console.log(`  ${row.company_name} — ${row.recipient_name} (${row.persona_type})`)
  console.log(`  URL: /landing/${row.id}`)
  console.log()
})
