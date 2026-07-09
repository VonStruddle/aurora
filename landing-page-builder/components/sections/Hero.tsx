import { LandingConfig } from '@/types/landing'

interface HeroProps {
  config: LandingConfig
}

export function Hero({ config }: HeroProps) {
  const { persona, company, contactUrl } = config

  return (
    <section className="relative overflow-hidden pt-32 pb-20 px-6">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a2235] via-[#0A0F1E] to-[#0A0F1E] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#4F6EF7]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-4xl text-center">
        {/* Personalization greeting */}
        {persona.recipientName && (
          <p className="mb-4 text-sm font-medium text-[#4F6EF7] tracking-wide uppercase">
            Hey {persona.recipientName} — here&apos;s why Polar makes sense for {company.name}
          </p>
        )}

        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 mb-8">
          <span className="h-1.5 w-1.5 rounded-full bg-[#4F6EF7] animate-pulse" />
          <span className="text-xs font-medium text-[#8892a4]">
            Trusted by 4,000+ Shopify brands
          </span>
        </div>

        {/* Main headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight mb-6">
          {persona.heroHeadline}
        </h1>

        {/* Subheadline */}
        <p className="text-lg sm:text-xl text-[#8892a4] max-w-2xl mx-auto mb-10 leading-relaxed">
          {persona.heroSubheadline}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={contactUrl}
            className="w-full sm:w-auto rounded-full bg-[#4F6EF7] px-8 py-3.5 text-base font-semibold text-white hover:bg-[#6B85FF] transition-colors shadow-lg shadow-[#4F6EF7]/20"
          >
            Get in touch →
          </a>
        </div>

        {/* Industry + GMV signal */}
        {(company.estimatedGMV || company.industry) && (
          <p className="mt-8 text-xs text-[#8892a4]">
            Prepared for{' '}
            <span className="text-white font-medium">{company.name}</span>
            {company.industry && ` · ${company.industry}`}
            {company.estimatedGMV && ` · ${company.estimatedGMV}`}
          </p>
        )}
      </div>
    </section>
  )
}
