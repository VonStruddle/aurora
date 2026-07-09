export type PersonaType = 'founder' | 'marketing' | 'finance' | 'ecom' | 'retention'

export interface PainSolutionItem {
  pain: string
  solution: string
  result: string
  icon: string
}

export interface CaseStudy {
  brand: string
  industry: string
  metric: string
  value: string
  quote?: string
  author?: string
  role?: string
}

export interface Feature {
  id: string
  title: string
  description: string
  icon: string
  badge?: string
}

export interface CompanyConfig {
  slug: string
  name: string
  logo?: string
  estimatedGMV?: string
  industry?: string
  painPoints?: string[]
}

export interface PersonaConfig {
  type: PersonaType
  recipientName?: string
  recipientTitle?: string
  heroHeadline: string
  heroSubheadline: string
  hookText: string
  painSolutions: PainSolutionItem[]
  highlightedFeatureIds: string[]
  relevantCaseStudy: CaseStudy
  closingOutcome: string
}

export interface LandingConfig {
  company: CompanyConfig
  persona: PersonaConfig
  contactUrl: string
}
