import { PersonaConfig } from '@/types/landing'

export const marketingPersona: Omit<PersonaConfig, 'hookText' | 'recipientName' | 'recipientTitle'> = {
  type: 'marketing',
  heroHeadline: 'Attribution you can forward to the CEO without second-guessing it.',
  heroSubheadline: 'First-party attribution, incrementality testing, and AI-powered channel recommendations — all grounded in data your team actually trusts.',
  painSolutions: [
    {
      pain: 'Meta says ROAS is 4x. Google says 6x. Your P&L says neither is right.',
      solution: 'Polar\'s first-party pixel + Lifetime ID attributes every conversion accurately — across channels, devices, and sessions.',
      result: '+95% attribution accuracy (ROAR Studios).',
      icon: '◉',
    },
    {
      pain: 'You\'re scaling channels based on last-click attribution. Half your budget might be wasted.',
      solution: 'Causal lift testing proves which channels are truly incremental — so you stop funding channels that steal organic credit.',
      result: 'CAC reduced -36% at YellowPop after incrementality testing.',
      icon: '↑',
    },
    {
      pain: 'Your media buyer is making decisions on gut feel because the data is 3 days old.',
      solution: 'AI Media Buyer Agent delivers daily recommendations grounded in live ROAS, CAC, and incrementality data.',
      result: '$25K in Google Ads savings in 30 days (The Feed).',
      icon: '◆',
    },
  ],
  highlightedFeatureIds: ['attribution', 'incrementality', 'media-buyer-agent', 'ask-polar'],
  relevantCaseStudy: {
    brand: 'ROAR Studios',
    industry: 'DTC Agency',
    metric: 'Attribution Accuracy',
    value: '+95%',
    quote: 'We finally have attribution numbers we can show clients without caveats.',
    role: 'Head of Analytics',
  },
  closingOutcome: 'attribution clarity, incrementality-backed budget decisions, and an AI media buyer that works from your live data.',
}
