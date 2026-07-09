import { PersonaConfig } from '@/types/landing'

export const financePersona: Omit<PersonaConfig, 'hookText' | 'recipientName' | 'recipientTitle'> = {
  type: 'finance',
  heroHeadline: 'CAC payback, contribution margin, LTV:CAC — automated. Not estimated.',
  heroSubheadline: 'Polar gives finance leaders real-time blended profitability metrics across every channel. No more manual Excel reconciliation. No more waiting for the data team.',
  painSolutions: [
    {
      pain: 'Contribution margin is calculated in five different spreadsheets and nobody agrees on the number.',
      solution: 'Polar\'s semantic layer defines contribution margin once — including COGS, ad spend, fulfillment, and returns — and enforces it across every report.',
      result: 'One authoritative P&L view your whole leadership team trusts.',
      icon: '⬡',
    },
    {
      pain: 'You can\'t calculate true CAC payback because acquisition data and revenue data live in different systems.',
      solution: 'Polar connects ad spend, revenue, and LTV in one semantic model. CAC payback period is a live metric, not a monthly project.',
      result: 'Real-time CAC:LTV visibility across cohorts and channels.',
      icon: '◑',
    },
    {
      pain: 'CFO reporting takes 3 days of analyst time every month.',
      solution: 'Polar\'s CFO Agent runs weekly reviews automatically — contribution margin, payback curves, and channel ROI delivered to your Notion or Slack.',
      result: '50% reduction in reporting time (Swanky).',
      icon: '◎',
    },
  ],
  highlightedFeatureIds: ['semantic-layer', 'ltv-cohort', 'snowflake', 'ask-polar'],
  relevantCaseStudy: {
    brand: 'Swanky',
    industry: 'DTC Agency',
    metric: 'Reporting Time Saved',
    value: '50%',
    quote: 'We cut our monthly reporting cycle in half and the numbers are finally consistent.',
    role: 'Head of Finance',
  },
  closingOutcome: 'automated contribution margin, real-time CAC payback, and CFO-ready reporting — without an analyst bottleneck.',
}
