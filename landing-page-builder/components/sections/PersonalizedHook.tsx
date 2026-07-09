import { CompanyConfig } from '@/types/landing'

interface PersonalizedHookProps {
  company: CompanyConfig
  hookText: string
}

export function PersonalizedHook({ company, hookText }: PersonalizedHookProps) {
  const paragraphs = hookText.trim().split('\n\n').filter(Boolean)

  return (
    <section className="py-20 px-6">
      <div className="mx-auto max-w-4xl">
        {/* Section label */}
        <div className="flex items-center gap-3 mb-8">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs font-medium text-[#4F6EF7] uppercase tracking-widest">
            Why {company.name}
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        {/* Hook card */}
        <div className="rounded-2xl border border-[#4F6EF7]/20 bg-gradient-to-br from-[#1a2235] to-[#131929] p-8 sm:p-10 relative overflow-hidden">
          {/* Accent dot */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#4F6EF7]/5 rounded-full blur-2xl pointer-events-none" />

          <div className="relative">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
              What we found at{' '}
              <span className="text-[#4F6EF7]">{company.name}</span>
            </h2>

            <div className="space-y-4">
              {paragraphs.map((p, i) => (
                <p key={i} className="text-[#8892a4] leading-relaxed text-base sm:text-lg">
                  {p.trim()}
                </p>
              ))}
            </div>

            {/* Pain points chips */}
            {company.painPoints && company.painPoints.length > 0 && (
              <div className="mt-8 pt-6 border-t border-white/8">
                <p className="text-xs font-medium text-[#8892a4] uppercase tracking-widest mb-3">
                  Key challenges identified
                </p>
                <div className="flex flex-wrap gap-2">
                  {company.painPoints.map((point, i) => (
                    <span
                      key={i}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white"
                    >
                      {point}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
