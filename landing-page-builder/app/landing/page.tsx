import { LandingConfig } from '@/types/landing'
import { founderPersona } from '@/data/personas/founder'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/sections/Hero'
import { SocialProof } from '@/components/sections/SocialProof'
import { PainSolution } from '@/components/sections/PainSolution'
import { ProductShowcase } from '@/components/sections/ProductShowcase'
import { Results } from '@/components/sections/Results'
import { ClosingCTA } from '@/components/sections/ClosingCTA'

export const metadata = {
  title: 'Polar Analytics — The data stack for ecommerce',
  description: founderPersona.heroSubheadline,
}

const CONTACT_URL = 'https://polaranalytics.com/contact'

const genericConfig: LandingConfig = {
  company: {
    slug: 'landing',
    name: '',
  },
  persona: {
    ...founderPersona,
    hookText: '',
  },
  contactUrl: CONTACT_URL,
}

export default function GenericLandingPage() {
  return (
    <>
      <Header contactUrl={CONTACT_URL} />
      <main>
        <Hero config={genericConfig} />
        <SocialProof />
        {/* PersonalizedHook intentionally omitted on the generic page */}
        <PainSolution items={founderPersona.painSolutions} />
        <ProductShowcase highlightedFeatureIds={founderPersona.highlightedFeatureIds} />
        <Results featuredCaseStudy={founderPersona.relevantCaseStudy} />
        <ClosingCTA config={genericConfig} />
      </main>
      <Footer />
    </>
  )
}
