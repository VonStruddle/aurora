import { PainSolutionItem } from '@/types/landing'

interface PainSolutionProps {
  items: PainSolutionItem[]
}

export function PainSolution({ items }: PainSolutionProps) {
  return (
    <section className="py-20 px-6 bg-[#131929]">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-xs font-medium text-[#4F6EF7] uppercase tracking-widest mb-3">
            Your challenges → Polar&apos;s answers
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            From frustration to clear decisions
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/8 bg-[#1a2235] p-6 flex flex-col gap-5 group hover:border-[#4F6EF7]/30 transition-colors"
            >
              {/* Icon + number */}
              <div className="flex items-center justify-between">
                <span className="text-2xl">{item.icon}</span>
                <span className="text-xs font-bold text-[#8892a4]">0{i + 1}</span>
              </div>

              {/* Pain */}
              <div>
                <p className="text-xs font-medium text-red-400/70 uppercase tracking-widest mb-2">
                  The problem
                </p>
                <p className="text-[#8892a4] text-sm leading-relaxed">
                  {item.pain}
                </p>
              </div>

              {/* Divider */}
              <div className="h-px bg-white/8 group-hover:bg-[#4F6EF7]/20 transition-colors" />

              {/* Solution */}
              <div>
                <p className="text-xs font-medium text-[#4F6EF7] uppercase tracking-widest mb-2">
                  The Polar solution
                </p>
                <p className="text-white text-sm leading-relaxed">
                  {item.solution}
                </p>
              </div>

              {/* Result */}
              <div className="mt-auto pt-2 border-t border-white/5">
                <p className="text-xs font-semibold text-green-400/80">
                  → {item.result}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
