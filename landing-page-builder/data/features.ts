import { Feature } from '@/types/landing'

export const ALL_FEATURES: Feature[] = [
  {
    id: 'semantic-layer',
    title: 'Semantic Layer',
    description: 'CAC, contribution margin, LTV — defined once, trusted everywhere. No more conflicting numbers across tools.',
    icon: '⬡',
  },
  {
    id: 'connectors',
    title: '45+ Native Connectors',
    description: 'Shopify, Meta, Google, Klaviyo, Amazon, NetSuite — one-click setup, no engineering required.',
    icon: '⟡',
  },
  {
    id: 'ask-polar',
    title: 'Ask Polar (AI Analyst)',
    description: 'Ask any business question in plain English. Get real answers grounded in your live, attributed data.',
    icon: '◎',
    badge: 'Live',
  },
  {
    id: 'polar-mcp',
    title: 'Polar MCP',
    description: 'One endpoint connects your live commerce data to Claude, ChatGPT, Slack, Notion — any AI you already use.',
    icon: '⌬',
    badge: 'New',
  },
  {
    id: 'incrementality',
    title: 'Incrementality Testing',
    description: 'Causal lift tests that prove which channels actually drive revenue. Stop funding channels on faith.',
    icon: '↑',
  },
  {
    id: 'attribution',
    title: 'First-Party Attribution',
    description: 'Polar Pixel + Lifetime ID tracks every customer across devices. Accurate attribution without third-party cookies.',
    icon: '◉',
  },
  {
    id: 'klaviyo-audiences',
    title: 'Klaviyo Audiences',
    description: 'Enrich Klaviyo with warehouse-level segments. Brands see up to 70% increase in flow revenue.',
    icon: '◈',
    badge: 'Popular',
  },
  {
    id: 'snowflake',
    title: 'Dedicated Data Warehouse',
    description: 'Your own Snowflake instance. You own the data, access the SQL, and keep it after you leave.',
    icon: '❄',
  },
  {
    id: 'media-buyer-agent',
    title: 'AI Media Buyer Agent',
    description: 'Turns noisy ad data into clean channel recommendations. Built on ROAS, CAC, and incrementality — not guesswork.',
    icon: '◆',
    badge: 'Waitlist',
  },
  {
    id: 'inventory-agent',
    title: 'AI Inventory Planner',
    description: 'Predicts stockouts before they happen. Smart reorder recommendations from velocity and lead time data.',
    icon: '▣',
    badge: 'Waitlist',
  },
  {
    id: 'email-agent',
    title: 'AI Email Marketer',
    description: 'Automatically builds, tests, and optimizes Klaviyo campaigns against your own revenue data.',
    icon: '✉',
    badge: 'Waitlist',
  },
  {
    id: 'ltv-cohort',
    title: 'LTV & Cohort Analysis',
    description: 'Full cohort tables and LTV curves per acquisition channel, product, and campaign.',
    icon: '◑',
  },
]

export function getFeaturesByIds(ids: string[]): Feature[] {
  return ids
    .map(id => ALL_FEATURES.find(f => f.id === id))
    .filter((f): f is Feature => f !== undefined)
}
