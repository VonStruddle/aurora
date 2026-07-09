const BRANDS = [
  'Allbirds', 'Jones Road Beauty', 'Gorjana', 'Canopy', 'The Frankie Shop',
  'Volcom', 'Modular Closets', 'Quad Lock', 'Tiege Hanley', 'YellowPop',
  'Armra', 'Polène', 'Fashion Eyewear', 'Mud Jeans', 'The Feed',
  'Mister Zimi', 'Colorful Standard', 'Doen', 'Negative',
]

const TESTIMONIALS = [
  {
    quote: 'Polar replaced our entire data stack. We finally have one number everyone trusts.',
    author: 'Founder',
    company: 'Fashion DTC Brand',
    stars: 5,
  },
  {
    quote: 'The incrementality testing alone saved us $25K in 30 days. The rest is a bonus.',
    author: 'Head of Marketing',
    company: 'The Feed',
    stars: 5,
  },
  {
    quote: 'Tons of value, KPIs and metrics out of the box. Plug-and-play setup.',
    author: 'Ecommerce Director',
    company: 'European DTC Brand',
    stars: 5,
  },
]

export function SocialProof() {
  return (
    <section className="py-16 px-6 border-y border-white/5 bg-[#131929]">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-[#8892a4] text-sm font-medium uppercase tracking-widest mb-2">
            Trusted by
          </p>
          <p className="text-white text-3xl font-bold">4,000+ ecommerce brands</p>
        </div>

        {/* Brand ticker */}
        <div className="overflow-hidden mb-12">
          <div className="flex gap-8 animate-scroll whitespace-nowrap">
            {[...BRANDS, ...BRANDS].map((brand, i) => (
              <span
                key={i}
                className="inline-block text-[#8892a4] font-semibold text-sm tracking-wide shrink-0 hover:text-white transition-colors"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/8 bg-[#1a2235] p-6"
            >
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <span key={j} className="text-[#4F6EF7] text-sm">★</span>
                ))}
              </div>
              <p className="text-white text-sm leading-relaxed mb-4">
                &ldquo;{t.quote}&rdquo;
              </p>
              <p className="text-[#8892a4] text-xs">
                <span className="text-white font-medium">{t.author}</span>
                {' · '}
                {t.company}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
