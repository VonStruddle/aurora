import { LandingConfig } from '@/types/landing'
import { LandingRow } from '@/types/db'
import { founderPersona } from '@/data/personas/founder'
import { marketingPersona } from '@/data/personas/marketing'
import { financePersona } from '@/data/personas/finance'
import { ecomPersona } from '@/data/personas/ecom'
import { retentionPersona } from '@/data/personas/retention'

const PERSONA_DEFAULTS = {
  founder: founderPersona,
  marketing: marketingPersona,
  finance: financePersona,
  ecom: ecomPersona,
  retention: retentionPersona,
}

export function landingConfigFromRow(row: LandingRow): LandingConfig {
  const basePersona = PERSONA_DEFAULTS[row.persona_type]

  return {
    company: {
      slug: row.id,
      name: row.company_name,
      industry: row.company_industry ?? undefined,
      estimatedGMV: row.company_estimated_gmv ?? undefined,
      logo: row.company_logo_url ?? undefined,
      painPoints: row.company_pain_points ?? undefined,
    },
    persona: {
      ...basePersona,
      recipientName: row.recipient_name ?? undefined,
      recipientTitle: row.recipient_title ?? undefined,
      hookText: row.hook_text,
      heroHeadline: row.hero_headline ?? basePersona.heroHeadline,
      heroSubheadline: row.hero_subheadline ?? basePersona.heroSubheadline,
      closingOutcome: row.closing_outcome ?? basePersona.closingOutcome,
    },
    contactUrl: row.contact_url,
  }
}
