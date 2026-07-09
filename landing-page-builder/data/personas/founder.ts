import { PersonaConfig } from '@/types/landing'

export const founderPersona: Omit<PersonaConfig, 'hookText' | 'recipientName' | 'recipientTitle'> = {
  type: 'founder',
  heroHeadline: 'One profit-legible source of truth — without the analyst headcount.',
  heroSubheadline: 'Polar gives founders a real-time view of CAC, contribution margin, and LTV across every channel. Ask any question in plain English. Get answers you can act on in 30 seconds.',
  painSolutions: [
    {
      pain: 'Five dashboards, three different ROAS numbers — you still don\'t know if you\'re profitable.',
      solution: 'Polar\'s semantic layer defines every metric once. CAC, blended MER, and contribution margin are identical across every tool you use.',
      result: 'One number your whole team trusts.',
      icon: '⬡',
    },
    {
      pain: 'You\'re spending hours every Monday pulling numbers before you can make a single call.',
      solution: 'Ask Polar answers "What drove the CAC spike last week?" in plain English — no SQL, no waiting for an analyst.',
      result: 'CEO-level clarity in under 30 seconds.',
      icon: '◎',
    },
    {
      pain: 'You can\'t tell which marketing spend is actually driving revenue vs. burning cash.',
      solution: 'Causal lift testing shows exactly which channels are incremental — and which are stealing attribution from organic.',
      result: 'Reallocate budget with confidence, not faith.',
      icon: '↑',
    },
  ],
  highlightedFeatureIds: ['ask-polar', 'semantic-layer', 'incrementality', 'polar-mcp'],
  relevantCaseStudy: {
    brand: 'Tiege Hanley',
    industry: 'Men\'s Grooming DTC',
    metric: 'Infrastructure Cost Saved',
    value: '$300K',
    quote: 'Polar replaced our entire data stack. One source of truth, no engineering team required.',
    role: 'Founder',
  },
  closingOutcome: 'one source of truth for profit, CAC, and revenue — so you can run the business, not the spreadsheets.',
}
