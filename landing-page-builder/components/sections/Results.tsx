import { CaseStudy } from '@/types/landing'

interface ResultsProps {
  featuredCaseStudy: CaseStudy
}

const METRICS = [
  { value: '-36%', label: 'CAC reduction', brand: 'YellowPop' },
  { value: '+54%', label: 'Email revenue', brand: 'Modular Closets' },
  { value: '$300K', label: 'Infra cost saved', brand: 'Tiege Hanley' },
  { value: '+95%', label: 'Attribution accuracy', brand: 'ROAR Studios' },
  { value: '$25K', label: 'Ad spend saved', brand: 'The Feed' },
  { value: '+70%', label: 'Flow revenue', brand: 'Klaviyo Audiences' },
]

export function Results({ featuredCaseStudy }: ResultsProps) {
  return (
    <section className="py-20 px-6 bg-[#131929]">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-xs font-medium text-[#4F6EF7] uppercase tracking-widest mb-3">
            Proven results
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Real numbers. Not estimates.
          </h2>
        </div>

        {/* Metrics grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          {METRICS.map((m, i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/8 bg-[#1a2235] p-6 text-center"
            >
              <p className="text-3xl font-extrabold text-white mb-1">{m.value}</p>
              <p className="text-sm text-[#8892a4] mb-1">{m.label}</p>
              <p className="text-xs text-[#4F6EF7] font-medium">{m.brand}</p>
            </div>
          ))}
        </div>

        {/* Featured case study */}
        <div className="rounded-2xl border border-[#4F6EF7]/20 bg-gradient-to-br from-[#1a2235] to-[#131929] p-8 sm:p-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
            <div>
              <p className="text-xs font-medium text-[#4F6EF7] uppercase tracking-widest mb-1">
                Case Study
              </p>
              <h3 className="text-2xl font-bold text-white">{featuredCaseStudy.brand}</h3>
              <p className="text-[#8892a4] text-sm">{featuredCaseStudy.industry}</p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-extrabold text-white">{featuredCaseStudy.value}</p>
              <p className="text-sm text-[#8892a4]">{featuredCaseStudy.metric}</p>
            </div>
          </div>

          {featuredCaseStudy.quote && (
            <div className="border-t border-white/8 pt-6">
              <p className="text-white text-lg leading-relaxed mb-4">
                &ldquo;{featuredCaseStudy.quote}&rdquo;
              </p>
              {featuredCaseStudy.author && (
                <p className="text-[#8892a4] text-sm">
                  — <span className="text-white font-medium">{featuredCaseStudy.author}</span>
                  {featuredCaseStudy.role && `, ${featuredCaseStudy.role}`}
                  {', '}
                  {featuredCaseStudy.brand}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
