import { notFound } from 'next/navigation'
import { getLandingById } from '@/lib/supabase'
import { landingConfigFromRow } from '@/lib/landing-from-db'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/sections/Hero'
import { SocialProof } from '@/components/sections/SocialProof'
import { PersonalizedHook } from '@/components/sections/PersonalizedHook'
import { PainSolution } from '@/components/sections/PainSolution'
import { ProductShowcase } from '@/components/sections/ProductShowcase'
import { Results } from '@/components/sections/Results'
import { ClosingCTA } from '@/components/sections/ClosingCTA'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const row = await getLandingById(id)
  if (!row) return {}

  return {
    title: `Polar Analytics × ${row.company_name}`,
    description: row.hero_subheadline ?? undefined,
  }
}

export default async function PersonalizedLandingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const row = await getLandingById(id)

  if (!row) notFound()

  const config = landingConfigFromRow(row)

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
