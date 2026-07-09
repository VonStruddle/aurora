import { useEffect, useState } from 'react'
import { api } from './api'
import type { LandingConfig, LandingFeature } from './types'
import { POLAR_CUSTOMER_LOGOS } from './polar-logos'
import './landing.css'

const TESTIMONIALS = [
  { quote: 'Polar replaced our entire data stack. We finally have one number everyone trusts.', author: 'Founder', company: 'Fashion DTC Brand', stars: 5 },
  { quote: 'The incrementality testing alone saved us $25K in 30 days. The rest is a bonus.', author: 'Head of Marketing', company: 'The Feed', stars: 5 },
  { quote: 'Tons of value, KPIs and metrics out of the box. Plug-and-play setup.', author: 'Ecommerce Director', company: 'European DTC Brand', stars: 5 },
]

const METRICS = [
  { value: '-36%', label: 'CAC reduction', brand: 'YellowPop' },
  { value: '+54%', label: 'Email revenue', brand: 'Modular Closets' },
  { value: '$300K', label: 'Infra cost saved', brand: 'Tiege Hanley' },
  { value: '+95%', label: 'Attribution accuracy', brand: 'ROAR Studios' },
  { value: '$25K', label: 'Ad spend saved', brand: 'The Feed' },
  { value: '+70%', label: 'Flow revenue', brand: 'Klaviyo Audiences' },
]

function PolarLogo({ size = 28 }: { size?: number }) {
  return (
    <svg viewBox="0 0 28 28" width={size} height={size} aria-hidden="true">
      <rect width="28" height="28" rx="8" fill="#4F6EF7" />
      <path d="M8 19c0-5 2.7-9 6-9s6 4 6 9" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M11 19c0-3 1.3-5 3-5s3 2 3 5" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="14" cy="20" r="1.6" fill="#fff" />
    </svg>
  )
}

function FeatureCard({ f, spot }: { f: LandingFeature; spot?: boolean }) {
  return (
    <div className={spot ? 'feat spot' : 'feat'}>
      <div className="feat-top">
        <span className="feat-icon">{f.icon}</span>
        {f.badge && <span className="feat-badge">{f.badge}</span>}
      </div>
      <h3>{f.title}</h3>
      <p>{f.description}</p>
    </div>
  )
}

export default function LandingPage({ id }: { id: string }) {
  const [cfg, setCfg] = useState<LandingConfig | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    document.title = 'Polar Analytics × …'
    api
      .getLanding(id)
      .then(setCfg)
      .catch((e) => setError((e as Error).message))
  }, [id])

  useEffect(() => {
    if (cfg) document.title = `Polar Analytics × ${cfg.company.name}`
  }, [cfg])

  if (error) return <div className="landing"><div className="lp-state">Landing not found — {error}</div></div>
  if (!cfg) return <div className="landing"><div className="lp-state">Loading…</div></div>

  const { company, persona, core_features, spotlight_features, contact_url } = cfg
  const hookParas = persona.hook_text.trim().split('\n\n').filter(Boolean)

  return (
    <div className="landing">
      {/* Header */}
      <header className="lp-header">
        <div className="wrap bar">
          <span className="brand">
            <PolarLogo /> Polar
          </span>
          <a className="header-cta" href={contact_url} target="_blank" rel="noreferrer">
            Get in touch
          </a>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="lp-hero">
          <div className="glow" />
          <div className="inner">
            {persona.recipient_name && (
              <p className="hero-hey">
                Hey {persona.recipient_name} — here's why Polar makes sense for {company.name}
              </p>
            )}
            <span className="badge-pill">
              <span className="dot" /> Trusted by 4,000+ Shopify brands
            </span>
            <h1>{persona.hero_headline}</h1>
            <p className="sub">{persona.hero_subheadline}</p>
            <a className="cta" href={contact_url} target="_blank" rel="noreferrer">
              Get in touch →
            </a>
            {(company.estimated_gmv || company.industry) && (
              <p className="hero-foot">
                Prepared for <b>{company.name}</b>
                {company.industry ? ` · ${company.industry}` : ''}
                {company.estimated_gmv ? ` · ${company.estimated_gmv}` : ''}
              </p>
            )}
          </div>
        </section>

        {/* Social proof */}
        <section className="lp-social sec-alt">
          <div className="wrap">
            <div className="sec-head" style={{ marginBottom: 0 }}>
              <p className="eyebrow">Trusted by</p>
              <h2 style={{ fontSize: '1.9rem', fontWeight: 800, marginTop: 8 }}>
                4,000+ ecommerce brands
              </h2>
            </div>
            <div className="ticker">
              <div className="ticker-row">
                {[...POLAR_CUSTOMER_LOGOS, ...POLAR_CUSTOMER_LOGOS].map((b, i) => (
                  <img key={i} src={b.url} alt={b.name} title={b.name} />
                ))}
              </div>
            </div>
            <div className="grid-3">
              {TESTIMONIALS.map((t, i) => (
                <div className="card" key={i}>
                  <div className="stars">{'★'.repeat(t.stars)}</div>
                  <p className="tst-q">“{t.quote}”</p>
                  <p className="tst-a">
                    {t.author} · {t.company}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Personalized hook */}
        <section>
          <div className="wrap-narrow">
            <div className="why-row">
              <span className="line" />
              <span className="eyebrow">Why {company.name}</span>
              <span className="line" />
            </div>
            <div className="hook-card">
              <h2>
                What we found at <span className="accent">{company.name}</span>
              </h2>
              {hookParas.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              {company.pain_points && company.pain_points.length > 0 && (
                <div className="chips">
                  <div className="lbl">Key challenges identified</div>
                  <div className="row">
                    {company.pain_points.map((c, i) => (
                      <span className="chip" key={i}>
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Pain / solution */}
        <section className="sec-alt">
          <div className="wrap">
            <div className="sec-head">
              <p className="eyebrow">Your challenges → Polar's answers</p>
              <h2>From frustration to clear decisions</h2>
            </div>
            <div className="grid-3">
              {persona.pain_solutions.map((it, i) => (
                <div className="card ps-card" key={i}>
                  <div className="ps-top">
                    <span className="ps-icon">{it.icon}</span>
                    <span className="ps-idx">0{i + 1}</span>
                  </div>
                  <div>
                    <div className="ps-lbl pain">The problem</div>
                    <div className="ps-pain">{it.pain}</div>
                  </div>
                  <div className="ps-div" />
                  <div>
                    <div className="ps-lbl sol">The Polar solution</div>
                    <div className="ps-sol">{it.solution}</div>
                  </div>
                  <div className="ps-res">→ {it.result}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Product showcase */}
        <section>
          <div className="wrap">
            <div className="sec-head">
              <p className="eyebrow">The platform</p>
              <h2>A complete data stack for ecommerce</h2>
              <p>Insights, activations, and AI agents — built on a data foundation you own.</p>
            </div>
            <div className="grid-4">
              {core_features.map((f) => (
                <FeatureCard key={f.id} f={f} />
              ))}
            </div>
            {spotlight_features.length > 0 && (
              <>
                <div className="spot-div">
                  <span className="line" />
                  <span>Built for your specific use case</span>
                  <span className="line" />
                </div>
                <div className="grid-2">
                  {spotlight_features.map((f) => (
                    <FeatureCard key={f.id} f={f} spot />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        {/* Results */}
        <section className="sec-alt">
          <div className="wrap">
            <div className="sec-head">
              <p className="eyebrow">Proven results</p>
              <h2>Real numbers. Not estimates.</h2>
            </div>
            <div className="metrics">
              {METRICS.map((m, i) => (
                <div className="card metric" key={i}>
                  <div className="v">{m.value}</div>
                  <div className="l">{m.label}</div>
                  <div className="b">{m.brand}</div>
                </div>
              ))}
            </div>
            <div className="cs-card">
              <div className="cs-head">
                <div>
                  <p className="eyebrow">Case Study</p>
                  <div className="cs-brand">{persona.case_study.brand}</div>
                  <div className="cs-ind">{persona.case_study.industry}</div>
                </div>
                <div>
                  <div className="cs-val">{persona.case_study.value}</div>
                  <div className="cs-metric">{persona.case_study.metric}</div>
                </div>
              </div>
              {persona.case_study.quote && (
                <div className="cs-quote">
                  “{persona.case_study.quote}”
                  {persona.case_study.author && (
                    <div className="cs-author">
                      — {persona.case_study.author}
                      {persona.case_study.role ? `, ${persona.case_study.role}` : ''},{' '}
                      {persona.case_study.brand}
                    </div>
                  )}
                  {!persona.case_study.author && persona.case_study.role && (
                    <div className="cs-author">
                      — {persona.case_study.role}, {persona.case_study.brand}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="lp-closing">
          <div className="glow" />
          <div className="inner">
            <p className="eyebrow">Next step</p>
            <h2>
              Let's talk about what Polar can do for{' '}
              <span className="accent">{company.name}</span>
            </h2>
            <p className="p">
              Our goal: give you <b>{persona.closing_outcome}</b> — in under 30 days.
            </p>
            <a className="cta" href={contact_url} target="_blank" rel="noreferrer">
              Get in touch →
            </a>
            <p className="trust">No commitment. A 30-minute call to see if it's a fit.</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="lp-footer">
        <div className="wrap row">
          <span className="brand" style={{ fontSize: 15 }}>
            <PolarLogo size={22} /> Polar Analytics
          </span>
          <div className="links">
            <a href="https://www.polaranalytics.com/legal/privacy" target="_blank" rel="noreferrer">
              Privacy
            </a>
            <a href="https://www.polaranalytics.com/legal/terms" target="_blank" rel="noreferrer">
              Terms
            </a>
            <span>© {new Date().getFullYear()} Polar Analytics</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
