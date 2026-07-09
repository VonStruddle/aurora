export interface Item {
  id: string
  title: string
  description: string | null
  created_at: string
  updated_at: string
}

export interface CompanySignal {
  key: string
  label: string
  last_at: string | null
  high_intent: boolean
}

export interface Company {
  company_name: string | null
  domain: string | null
  platform: string | null
  som_category: string | null
  tier: string | null
  marketing_gmv_category: string | null
  industry_cleaned: string | null
  has_deal: boolean | null
  signals: CompanySignal[]
}

export interface CompaniesPage {
  companies: Company[]
  page: number
  page_size: number
  has_more: boolean
}

export interface TamTier {
  tier: string
  label: string
  gmv: number
  brand_count: number
}

export interface TamByTier {
  total_gmv: number
  total_brands: number
  tiers: TamTier[]
}

// --- Beacon (Weekly Hot Accounts) ---
export type Persona =
  | 'Founder'
  | 'Marketing'
  | 'Ecommerce'
  | 'Retention'
  | 'Finance'
  | 'Data'

export interface BeaconSignal {
  icon: string
  text: string
  meta: string
}

export interface BeaconPerson {
  name: string
  title: string
  persona: Persona
  champion: boolean
  email: string
  phone: string
  angle: string
}

export interface BeaconCompany {
  logo: string
  color: string
  name: string
  score: 'hot' | 'warm'
  sector: string
  size: string
  cc: string
  domain: string
  gamma_deck_url: string | null
  signals: BeaconSignal[]
  people: BeaconPerson[]
}

export interface BeaconGammaResult {
  domain: string
  url: string
  cached: boolean
}

export interface BeaconAccounts {
  week_of: string
  companies: BeaconCompany[]
}
