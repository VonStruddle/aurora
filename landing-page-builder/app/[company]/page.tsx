import { notFound } from 'next/navigation'
import { LandingConfig } from '@/types/landing'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/sections/Hero'
import { SocialProof } from '@/components/sections/SocialProof'
import { PersonalizedHook } from '@/components/sections/PersonalizedHook'
import { PainSolution } from '@/components/sections/PainSolution'
import { ProductShowcase } from '@/components/sections/ProductShowcase'
import { Results } from '@/components/sections/Results'
import { ClosingCTA } from '@/components/sections/ClosingCTA'

// Register company configs here — add one entry per prospect
async function getConfig(slug: string): Promise<LandingConfig | null> {
  const configs: Record<string, () => Promise<{ default?: LandingConfig; [key: string]: unknown }>> = {
    example: () => import('@/data/companies/_example').then(m => ({ default: m.exampleConfig })),
    // Add new prospects below:
    // 'acme-corp': () => import('@/data/companies/acme-corp').then(m => ({ default: m.acmeCorpConfig })),
  }

  const loader = configs[slug]
  if (!loader) return null

  const mod = await loader()
  return (mod.default as LandingConfig) ?? null
}

export async function generateMetadata({ params }: { params: Promise<{ company: string }> }) {
  const { company: slug } = await params
  const config = await getConfig(slug)
  if (!config) return {}

  return {
    title: `Polar Analytics × ${config.company.name}`,
    description: config.persona.heroSubheadline,
  }
}

export default async function LandingPage({ params }: { params: Promise<{ company: string }> }) {
  const { company: slug } = await params
  const config = await getConfig(slug)

  if (!config) notFound()

  return (
    <>
      <Header contactUrl={config.contactUrl} />
      <main>
        <Hero config={config} />
        <SocialProof />
        <PersonalizedHook company={config.company} hookText={config.persona.hookText} />
        <PainSolution items={config.persona.painSolutions} />
        <ProductShowcase highlightedFeatureIds={config.persona.highlightedFeatureIds} />
        <Results featuredCaseStudy={config.persona.relevantCaseStudy} />
        <ClosingCTA config={config} />
      </main>
      <Footer />
    </>
  )
}
