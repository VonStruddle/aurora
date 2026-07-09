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
