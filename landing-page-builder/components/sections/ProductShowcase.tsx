import { Feature } from '@/types/landing'
import { ALL_FEATURES, getFeaturesByIds } from '@/data/features'

interface ProductShowcaseProps {
  highlightedFeatureIds: string[]
}

const CORE_FEATURE_IDS = ['semantic-layer', 'connectors', 'ask-polar', 'snowflake']

export function ProductShowcase({ highlightedFeatureIds }: ProductShowcaseProps) {
  const coreFeatures = getFeaturesByIds(CORE_FEATURE_IDS)
  const spotlightFeatures = getFeaturesByIds(
    highlightedFeatureIds.filter(id => !CORE_FEATURE_IDS.includes(id))
  ).slice(0, 2)

  return (
    <section className="py-20 px-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-xs font-medium text-[#4F6EF7] uppercase tracking-widest mb-3">
            The platform
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            A complete data stack for ecommerce
          </h2>
          <p className="text-[#8892a4] max-w-xl mx-auto text-lg">
            Insights, activations, and AI agents — built on a data foundation you own.
          </p>
        </div>

        {/* Core pillars grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {coreFeatures.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>

        {/* Spotlight features (persona-specific) */}
        {spotlightFeatures.length > 0 && (
          <>
            <div className="flex items-center gap-3 my-8">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-xs font-medium text-[#8892a4] uppercase tracking-widest">
                Built for your specific use case
              </span>
              <div className="h-px flex-1 bg-white/10" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {spotlightFeatures.map((feature) => (
                <FeatureCard key={feature.id} feature={feature} spotlight />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}

function FeatureCard({ feature, spotlight = false }: { feature: Feature; spotlight?: boolean }) {
  return (
    <div
      className={`rounded-2xl border p-6 flex flex-col gap-4 ${
        spotlight
          ? 'border-[#4F6EF7]/30 bg-gradient-to-br from-[#1a2235] to-[#131929]'
          : 'border-white/8 bg-[#131929]'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-2xl">{feature.icon}</span>
        {feature.badge && (
          <span className="rounded-full bg-[#4F6EF7]/10 border border-[#4F6EF7]/20 px-2 py-0.5 text-xs font-semibold text-[#4F6EF7]">
            {feature.badge}
          </span>
        )}
      </div>
      <div>
        <h3 className="text-white font-semibold text-sm mb-2">{feature.title}</h3>
        <p className="text-[#8892a4] text-sm leading-relaxed">{feature.description}</p>
      </div>
    </div>
  )
}
