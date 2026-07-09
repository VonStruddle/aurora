import { LandingConfig } from '@/types/landing'
import { founderPersona } from '@/data/personas/founder'

// Duplicate this file and rename it to your prospect's slug (e.g., acme-corp.ts)
// Then import it in app/[company]/page.tsx configs map

export const exampleConfig: LandingConfig = {
  company: {
    slug: 'example',
    name: 'Acme Corp',
    estimatedGMV: '$15M GMV',
    industry: 'Fashion DTC',
    painPoints: [
      'Attribution inconsistencies across Meta and Google',
      'No unified profit view for the CEO',
    ],
  },
  persona: {
    ...founderPersona,
    recipientName: 'Marc',
    recipientTitle: 'CEO & Co-Founder',
    hookText: `Acme Corp is doing ~$15M in GMV with strong Meta and Google presence. Brands at this stage typically hit the same wall: five dashboards, three different ROAS numbers, and a weekly reporting ritual that eats 4 hours of leadership time.

We think Polar can change that — and we've seen it work for similar-stage brands in fashion DTC.`,
  },
  contactUrl: 'https://polaranalytics.com/contact',
}
