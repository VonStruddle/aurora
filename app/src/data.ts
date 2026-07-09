// Beacon sample data — 8 fictional DTC/Shopify accounts.
// Replace with the live Supabase feed (Company + Contacts + Signals) — see README.

export type Persona =
  | 'Founder'
  | 'Marketing'
  | 'Ecommerce'
  | 'Retention'
  | 'Finance'
  | 'Data'

export interface Signal {
  /** kebab-case lucide icon name, mapped to a component in Beacon.tsx */
  icon: string
  text: string
  meta: string
}

export interface Person {
  name: string
  title: string
  persona: Persona
  champion: boolean
  email: string
  phone: string
  /** Use-case matching: the Polar value-prop angle for this persona */
  angle: string
}

export interface Company {
  logo: string
  color: string
  name: string
  score: 'hot' | 'warm'
  sector: string
  size: string
  cc: string
  domain: string
  signals: Signal[]
  people: Person[]
}

export const ROWS: Company[] = [
  {
    logo: 'E',
    color: '#5433FB',
    name: 'Everbloom',
    score: 'hot',
    sector: 'Skincare & beauty',
    size: '48',
    cc: 'US',
    domain: 'everbloom.co',
    signals: [
      { icon: 'user-plus', text: 'New CFO hired', meta: '2 weeks ago' },
      { icon: 'trending-up', text: 'Meta spend +60% QoQ', meta: 'Storeleads' },
      { icon: 'shopping-bag', text: 'Moved to Shopify Plus', meta: '' },
      { icon: 'briefcase', text: 'Hiring: Sr. Growth Manager', meta: '' },
    ],
    people: [
      {
        name: 'Dana Whitfield',
        title: 'Founder & CEO',
        persona: 'Founder',
        champion: true,
        email: 'dana@everbloom.co',
        phone: '+1 (512) 555-0148',
        angle:
          'Decides fast and alone. Lead with one profit-legible source of truth — blended MER, real CAC and payback — she can run herself.',
      },
      {
        name: 'Liam Ortega',
        title: 'VP Marketing',
        persona: 'Marketing',
        champion: false,
        email: 'liam@everbloom.co',
        phone: '+1 (512) 555-0192',
        angle:
          'Owns paid across Meta and Google. Lead with first-party attribution and blended ROAS by channel.',
      },
      {
        name: 'Sana Reyes',
        title: 'Head of Retention',
        persona: 'Retention',
        champion: false,
        email: 'sana@everbloom.co',
        phone: '+1 (512) 555-0173',
        angle:
          'Building Klaviyo flows now. Lead with cohort LTV and enriched audiences to recover missed flow revenue.',
      },
    ],
  },
  {
    logo: 'F',
    color: '#00BC84',
    name: 'Fjord Supply',
    score: 'hot',
    sector: 'Outdoor apparel',
    size: '120',
    cc: 'US',
    domain: 'fjordsupply.com',
    signals: [
      { icon: 'user-plus', text: 'Head of Growth started', meta: '3 weeks ago' },
      { icon: 'swords', text: 'Evaluating Northbeam', meta: 'competitor' },
      { icon: 'trending-up', text: 'Traffic +38% QoQ', meta: '' },
    ],
    people: [
      {
        name: 'Marcus Lindqvist',
        title: 'Head of Growth',
        persona: 'Marketing',
        champion: true,
        email: 'marcus@fjordsupply.com',
        phone: '+1 (303) 555-0121',
        angle:
          'New in seat, inheriting an unproven attribution stack. Lead with first-party attribution and Causal Lift he can forward to the CEO.',
      },
      {
        name: 'Erin Walsh',
        title: 'Chief Marketing Officer',
        persona: 'Marketing',
        champion: false,
        email: 'erin@fjordsupply.com',
        phone: '+1 (303) 555-0188',
        angle:
          'Defends spend to the board. Lead with incrementality-backed ROAS, not platform-reported numbers.',
      },
      {
        name: 'Cole Barrett',
        title: 'Ecommerce Manager',
        persona: 'Ecommerce',
        champion: false,
        email: 'cole@fjordsupply.com',
        phone: '+1 (303) 555-0164',
        angle:
          'Runs the store day to day. Lead with daily revenue movement and SKU-level performance.',
      },
      {
        name: 'Nadia Improta',
        title: 'Data Analyst',
        persona: 'Data',
        champion: false,
        email: 'nadia@fjordsupply.com',
        phone: '+1 (303) 555-0139',
        angle:
          'Owns reporting. Lead with the semantic layer and Polar MCP — governed data, no black boxes.',
      },
    ],
  },
  {
    logo: 'N',
    color: '#F87700',
    name: 'Nectar Wellness',
    score: 'hot',
    sector: 'Supplements',
    size: '65',
    cc: 'UK',
    domain: 'nectarwellness.com',
    signals: [
      { icon: 'user-plus', text: 'CMO joined', meta: '4 weeks ago' },
      { icon: 'briefcase', text: 'Hiring 2 performance roles', meta: '' },
      { icon: 'swords', text: 'Using Triple Whale', meta: 'competitor' },
      { icon: 'gauge', text: 'Est. GMV $14M', meta: '' },
      { icon: 'trending-up', text: 'Ramping Meta spend', meta: '' },
    ],
    people: [
      {
        name: 'Priya Anand',
        title: 'Chief Marketing Officer',
        persona: 'Marketing',
        champion: true,
        email: 'priya@nectarwellness.com',
        phone: '+44 20 7946 0114',
        angle:
          'One month in, defending spend to the board. Lead with defensible channel ROAS and incrementality.',
      },
      {
        name: 'Tom Fielding',
        title: 'Performance Marketing Manager',
        persona: 'Marketing',
        champion: false,
        email: 'tom@nectarwellness.com',
        phone: '+44 20 7946 0177',
        angle:
          'In the ad accounts daily. Lead with AI Media Buyer spend recommendations and creative performance.',
      },
    ],
  },
  {
    logo: 'R',
    color: '#9542FE',
    name: 'Roam Coffee',
    score: 'warm',
    sector: 'Food & beverage',
    size: '34',
    cc: 'CA',
    domain: 'roamcoffee.co',
    signals: [
      { icon: 'repeat', text: 'Launched subscription', meta: '' },
      { icon: 'trending-up', text: 'Repeat rate +12%', meta: '' },
    ],
    people: [
      {
        name: 'Théo Brunel',
        title: 'Co-Founder',
        persona: 'Founder',
        champion: true,
        email: 'theo@roamcoffee.co',
        phone: '+1 (514) 555-0143',
        angle:
          'Just launched subscription. Lead with cohort LTV and repeat-purchase gaps to protect the new recurring base.',
      },
    ],
  },
  {
    logo: 'M',
    color: '#3F9FF8',
    name: 'Meridian Apparel',
    score: 'hot',
    sector: 'Fashion',
    size: '210',
    cc: 'US',
    domain: 'meridianapparel.com',
    signals: [
      { icon: 'shopping-bag', text: 'Migrated to Shopify Plus', meta: '' },
      { icon: 'boxes', text: 'Expanding to Amazon', meta: '' },
      { icon: 'briefcase', text: 'Hiring Ecommerce Analyst', meta: '' },
    ],
    people: [
      {
        name: 'Sarah Klein',
        title: 'Head of Ecommerce',
        persona: 'Ecommerce',
        champion: true,
        email: 'sarah@meridianapparel.com',
        phone: '+1 (212) 555-0155',
        angle:
          'Running Shopify Plus into Amazon. Lead with daily store performance and an omnichannel roll-up.',
      },
      {
        name: 'Gina Marsh',
        title: 'Chief Marketing Officer',
        persona: 'Marketing',
        champion: false,
        email: 'gina@meridianapparel.com',
        phone: '+1 (212) 555-0198',
        angle:
          'Owns channel mix. Lead with blended MER and incrementality across Meta, Google and TikTok.',
      },
      {
        name: 'Dev Patel',
        title: 'Head of CRM',
        persona: 'Retention',
        champion: false,
        email: 'dev@meridianapparel.com',
        phone: '+1 (212) 555-0126',
        angle:
          'Owns email and SMS. Lead with cohort retention curves and Klaviyo audience enrichment.',
      },
      {
        name: 'Marco Ferri',
        title: 'Inventory & Ops Manager',
        persona: 'Ecommerce',
        champion: false,
        email: 'marco@meridianapparel.com',
        phone: '+1 (212) 555-0171',
        angle:
          'Stock is the constraint. Lead with the AI Inventory Planner — reorder timing and overstock alerts.',
      },
      {
        name: 'Alicia Gomez',
        title: 'FP&A Manager',
        persona: 'Finance',
        champion: false,
        email: 'alicia@meridianapparel.com',
        phone: '+1 (212) 555-0109',
        angle:
          'Quantifies before believing. Lead with contribution margin, CAC payback and a governed CFO view.',
      },
    ],
  },
  {
    logo: 'H',
    color: '#F038F3',
    name: 'Halcyon Skincare',
    score: 'warm',
    sector: 'Beauty',
    size: '52',
    cc: 'AU',
    domain: 'halcyonskin.com',
    signals: [
      { icon: 'gauge', text: 'Est. GMV $8M', meta: '' },
      { icon: 'trending-up', text: 'Traffic +22% QoQ', meta: '' },
    ],
    people: [
      {
        name: 'Emma Doyle',
        title: 'Founder',
        persona: 'Founder',
        champion: true,
        email: 'emma@halcyonskin.com',
        phone: '+61 2 5550 0132',
        angle:
          'Profitable but flying blind across Shopify, Meta and Klaviyo. Lead with a consolidated profit view she can read every morning without an analyst.',
      },
      {
        name: 'Ruby Chen',
        title: 'Marketing Manager',
        persona: 'Marketing',
        champion: false,
        email: 'ruby@halcyonskin.com',
        phone: '+61 2 5550 0187',
        angle:
          'Scaling paid on a lean team. Lead with channel ROAS clarity and dynamic alerts.',
      },
    ],
  },
  {
    logo: 'O',
    color: '#5A50FE',
    name: 'Ovation Pet',
    score: 'warm',
    sector: 'Pet food',
    size: '88',
    cc: 'US',
    domain: 'ovationpet.com',
    signals: [
      { icon: 'swords', text: 'Testing a competitor tool', meta: 'competitor' },
      { icon: 'trending-up', text: 'Meta spend +30% QoQ', meta: '' },
    ],
    people: [
      {
        name: 'Dana Ruiz',
        title: 'VP Marketing',
        persona: 'Marketing',
        champion: false,
        email: 'dana@ovationpet.com',
        phone: '+1 (503) 555-0146',
        angle:
          'Scaling paid with no incrementality read. Lead with twin-geo Causal Lift to prove which spend drives new customers.',
      },
      {
        name: 'Greg Hollis',
        title: 'CEO',
        persona: 'Founder',
        champion: true,
        email: 'greg@ovationpet.com',
        phone: '+1 (503) 555-0191',
        angle:
          'Owner-operator watching cash. Lead with real CAC, payback and one profit view he can trust.',
      },
      {
        name: 'Priti Shah',
        title: 'Ecommerce Lead',
        persona: 'Ecommerce',
        champion: false,
        email: 'priti@ovationpet.com',
        phone: '+1 (503) 555-0168',
        angle:
          'Owns store performance. Lead with daily revenue movement and bought-together bundle analysis.',
      },
    ],
  },
  {
    logo: 'L',
    color: '#04AB7D',
    name: 'Larkspur & Co',
    score: 'warm',
    sector: 'Home goods',
    size: '41',
    cc: 'US',
    domain: 'larkspurco.com',
    signals: [
      { icon: 'shopping-bag', text: 'Replatformed to Shopify', meta: '' },
      { icon: 'trending-up', text: 'Traffic +18% QoQ', meta: '' },
    ],
    people: [
      {
        name: 'Nathan Cole',
        title: 'Head of DTC',
        persona: 'Ecommerce',
        champion: false,
        email: 'nathan@larkspurco.com',
        phone: '+1 (312) 555-0134',
        angle:
          'Growing DTC alongside wholesale. Lead with SKU performance and bought-together bundles to lift AOV.',
      },
      {
        name: 'Beth Alvarez',
        title: 'Marketing Director',
        persona: 'Marketing',
        champion: false,
        email: 'beth@larkspurco.com',
        phone: '+1 (312) 555-0176',
        angle:
          'Owns acquisition. Lead with first-party attribution and blended ROAS by channel.',
      },
    ],
  },
]
