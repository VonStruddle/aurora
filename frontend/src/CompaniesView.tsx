import { useEffect, useState } from 'react'
import { api } from './api'
import type { Company } from './types'

const PAGE_SIZE = 25

function tierClass(tier: string | null): string {
  return tier ? `tier tier-${tier.toLowerCase()}` : 'muted'
}

export default function CompaniesView() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    api
      .listCompanies(page, PAGE_SIZE)
      .then((res) => {
        if (cancelled) return
        setCompanies(res.companies)
        setHasMore(res.has_more)
        setError(null)
      })
      .catch((e) => !cancelled && setError((e as Error).message))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [page])

  return (
    <section>
      <p className="sub">
        Parent brands from <code>internal.marketing.brands</code> (where{' '}
        <code>domain = parent_domain</code>)
      </p>

      {error && <div className="error">{error}</div>}

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Domain</th>
              <th>Platform</th>
              <th>SOM category</th>
              <th>Tier</th>
              <th>GMV category</th>
              <th>Industry</th>
              <th>Deal</th>
              <th>Signals</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="muted center">
                  Loading… (Snowflake queries can take a few seconds)
                </td>
              </tr>
            ) : companies.length === 0 ? (
              <tr>
                <td colSpan={9} className="muted center">
                  No companies on this page.
                </td>
              </tr>
            ) : (
              companies.map((c, i) => (
                <tr key={`${c.domain ?? 'row'}-${i}`}>
                  <td>{c.company_name ?? <span className="muted">—</span>}</td>
                  <td>
                    {c.domain ? (
                      <a
                        href={`https://${c.domain}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {c.domain}
                      </a>
                    ) : (
                      <span className="muted">—</span>
                    )}
                  </td>
                  <td>{c.platform ?? <span className="muted">—</span>}</td>
                  <td>{c.som_category ?? <span className="muted">—</span>}</td>
                  <td>
                    {c.tier ? (
                      <span className={tierClass(c.tier)}>{c.tier}</span>
                    ) : (
                      <span className="muted">—</span>
                    )}
                  </td>
                  <td>
                    {c.marketing_gmv_category ?? <span className="muted">—</span>}
                  </td>
                  <td>{c.industry_cleaned ?? <span className="muted">—</span>}</td>
                  <td>
                    {c.has_deal ? (
                      <span className="badge ok">Yes</span>
                    ) : (
                      <span className="muted">No</span>
                    )}
                  </td>
                  <td>
                    {c.signals.length === 0 ? (
                      <span className="muted">—</span>
                    ) : (
                      <span className="sigs">
                        {c.signals.slice(0, 4).map((s) => (
                          <span
                            key={s.key}
                            className={s.high_intent ? 'sig hi' : 'sig'}
                            title={s.last_at ? `${s.label} · last ${s.last_at}` : s.label}
                          >
                            {s.label}
                          </span>
                        ))}
                        {c.signals.length > 4 && (
                          <span
                            className="sig more"
                            title={c.signals.slice(4).map((s) => s.label).join(', ')}
                          >
                            +{c.signals.length - 4}
                          </span>
                        )}
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="pager">
        <button
          className="ghost"
          disabled={page === 1 || loading}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          ← Prev
        </button>
        <span className="muted">Page {page}</span>
        <button
          className="ghost"
          disabled={!hasMore || loading}
          onClick={() => setPage((p) => p + 1)}
        >
          Next →
        </button>
      </div>
    </section>
  )
}
