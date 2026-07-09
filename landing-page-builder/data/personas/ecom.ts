import { PersonaConfig } from '@/types/landing'

export const ecomPersona: Omit<PersonaConfig, 'hookText' | 'recipientName' | 'recipientTitle'> = {
  type: 'ecom',
  heroHeadline: 'Daily revenue ops from one cockpit. No SQL required.',
  heroSubheadline: 'See what moved revenue today, predict stockouts before they happen, and get merchandising recommendations — all in the tools you already use.',
  painSolutions: [
    {
      pain: 'You don\'t know what drove yesterday\'s revenue until Tuesday. By then you\'ve already missed the window.',
      solution: 'Polar\'s Ecommerce Manager Agent monitors daily GMV, AOV, and conversion — and alerts you the moment something shifts, with the "why" already surfaced.',
      result: 'Act on revenue signals the same day, not the same week.',
      icon: '◎',
    },
    {
      pain: 'You\'re finding out about stockouts after customers complain — not before they happen.',
      solution: 'AI Inventory Planner predicts stockouts 2–4 weeks ahead from velocity, lead time, and seasonal patterns. Reorder recommendations are generated automatically.',
      result: 'Canopy unified 17+ data sources to eliminate stockout blind spots.',
      icon: '▣',
    },
    {
      pain: 'Merchandising decisions are based on gut feel because product-level profitability is too hard to calculate.',
      solution: 'Polar calculates margin per SKU, category, and collection — including COGS, returns, and ad spend. Surface your best performers and kill the losers.',
      result: 'Data-driven buy decisions that protect margin.',
      icon: '⬡',
    },
  ],
  highlightedFeatureIds: ['ask-polar', 'inventory-agent', 'semantic-layer', 'connectors'],
  relevantCaseStudy: {
    brand: 'Canopy',
    industry: 'Home & Lifestyle DTC',
    metric: 'Data Sources Unified',
    value: '+17',
    quote: 'We finally have a single view across all our channels. Inventory decisions went from guesswork to systematic.',
    role: 'Head of Ecommerce',
  },
  closingOutcome: 'real-time revenue visibility, automated stockout prevention, and margin-backed merchandising decisions.',
}
