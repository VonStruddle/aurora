import { LandingConfig } from '@/types/landing'

interface ClosingCTAProps {
  config: LandingConfig
}

export function ClosingCTA({ config }: ClosingCTAProps) {
  const { company, persona, contactUrl } = config

  return (
    <section className="py-24 px-6">
      <div className="mx-auto max-w-4xl text-center">
        {/* Glow */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[500px] h-[300px] bg-[#4F6EF7]/10 rounded-full blur-3xl" />
          </div>

          <div className="relative">
            {/* Label */}
            <p className="text-xs font-medium text-[#4F6EF7] uppercase tracking-widest mb-6">
              Next step
            </p>

            {/* Headline */}
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-6 leading-tight">
              Let&apos;s talk about what Polar can do for{' '}
              <span className="text-[#4F6EF7]">{company.name}</span>
            </h2>

            {/* Outcome */}
            <p className="text-lg text-[#8892a4] max-w-2xl mx-auto mb-10 leading-relaxed">
              Our goal: give you{' '}
              <span className="text-white">{persona.closingOutcome}</span>
              {' '}— in under 30 days.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={contactUrl}
                className="w-full sm:w-auto rounded-full bg-[#4F6EF7] px-10 py-4 text-base font-semibold text-white hover:bg-[#6B85FF] transition-colors shadow-xl shadow-[#4F6EF7]/20"
              >
                Get in touch →
              </a>
            </div>

            {/* Trust line */}
            <p className="mt-8 text-xs text-[#8892a4]">
              No commitment. A 30-minute call to see if it&apos;s a fit.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
