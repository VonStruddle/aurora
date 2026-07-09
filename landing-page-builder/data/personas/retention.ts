import { PersonaConfig } from '@/types/landing'

export const retentionPersona: Omit<PersonaConfig, 'hookText' | 'recipientName' | 'recipientTitle'> = {
  type: 'retention',
  heroHeadline: 'Increase flow revenue 70% with enriched Klaviyo audiences.',
  heroSubheadline: 'Polar connects your warehouse-level customer data to Klaviyo — so your flows reach the right people with the right message, grounded in real purchase behavior and LTV data.',
  painSolutions: [
    {
      pain: 'Your Klaviyo segments are based on email events only. You\'re missing 40% of your best customers.',
      solution: 'Polar\'s Klaviyo Audiences connector enriches your segments with warehouse-level data: LTV, purchase frequency, predicted churn risk, and product affinity.',
      result: 'Up to 70% increase in flow revenue.',
      icon: '◈',
    },
    {
      pain: 'You can\'t tell which cohorts are actually retained vs. which are just repeat one-time buyers.',
      solution: 'Polar\'s LTV cohort tables break down customer retention by acquisition channel, campaign, and product — so you know which sources produce loyal customers.',
      result: '+10% revenue per subscriber at Doen.',
      icon: '◑',
    },
    {
      pain: 'Building and testing Klaviyo campaigns takes your team hours every week.',
      solution: 'AI Email Marketer Agent automatically builds, tests, and optimizes flows against your live revenue data — without manual setup.',
      result: '+54% email revenue at Modular Closets.',
      icon: '✉',
    },
  ],
  highlightedFeatureIds: ['klaviyo-audiences', 'ltv-cohort', 'email-agent', 'attribution'],
  relevantCaseStudy: {
    brand: 'Modular Closets',
    industry: 'Home & Storage DTC',
    metric: 'Email Revenue Increase',
    value: '+54%',
    quote: 'Polar\'s audience enrichment transformed our Klaviyo performance. We\'re reaching customers we didn\'t even know existed.',
    role: 'Head of CRM & Retention',
  },
  closingOutcome: 'Klaviyo audiences built on real purchase behavior, LTV-driven segmentation, and automated email optimization that runs itself.',
}
