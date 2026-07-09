import { PersonaType } from './landing'

export interface LandingRow {
  id: string
  created_at: string
  contact_url: string
  persona_type: PersonaType
  company_name: string
  company_industry: string | null
  company_estimated_gmv: string | null
  company_logo_url: string | null
  company_pain_points: string[] | null
  recipient_name: string | null
  recipient_title: string | null
  hook_text: string
  hero_headline: string | null
  hero_subheadline: string | null
  closing_outcome: string | null
}
