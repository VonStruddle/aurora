import { Fragment, useEffect, useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  Activity,
  Boxes,
  Briefcase,
  Check,
  CheckCircle2,
  ChevronRight,
  Crown,
  ExternalLink,
  Flame,
  Gauge,
  Layout,
  Lock,
  Mail,
  Moon,
  MousePointerClick,
  Phone,
  Plus,
  Presentation,
  Repeat,
  Rocket,
  ShoppingBag,
  Sun,
  Swords,
  TrendingUp,
  UserPlus,
  Users,
  X,
} from 'lucide-react'
import { api } from './api'
import type { BeaconCompany } from './types'
import './beacon.css'

const MAX = 5

// Brand icon stroke (Polar design system uses ~1.5–1.75)
const STROKE = { strokeWidth: 1.75 } as const

// kebab signal name -> lucide component (see backend app/beacon.py)
const SIGNAL_ICONS: Record<string, LucideIcon> = {
  'user-plus': UserPlus,
  'trending-up': TrendingUp,
  'shopping-bag': ShoppingBag,
  briefcase: Briefcase,
  swords: Swords,
  gauge: Gauge,
  repeat: Repeat,
  boxes: Boxes,
  activity: Activity,
  'mouse-pointer-click': MousePointerClick,
}

type OrchState = 'pending' | 'done'

export default function Beacon() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [companies, setCompanies] = useState<BeaconCompany[]>([])
  const [weekOf, setWeekOf] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [orch, setOrch] = useState<Record<number, OrchState>>({})
  const [pushed, setPushed] = useState(false)

  // Drawer: keep the index while sliding out so content doesn't flash empty
  const [drawerIndex, setDrawerIndex] = useState<number | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Gamma deck generation: domain -> url, plus busy/error tracking
  const [decks, setDecks] = useState<Record<string, string>>({})
  const [deckBusy, setDeckBusy] = useState<string | null>(null)
  const [deckErr, setDeckErr] = useState<string | null>(null)

  const n = selected.size
  const contactCount = companies.reduce((s, r) => s + r.people.length, 0)

  useEffect(() => {
    api
      .beaconAccounts()
      .then((d) => {
        setCompanies(d.companies)
        setWeekOf(d.week_of)
        setError(null)
      })
      .catch((e) => setError((e as Error).message))
      .finally(() => setLoading(false))
  }, [])

  function toggle(i: number) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else {
        if (next.size >= MAX) return prev
        next.add(i)
      }
      return next
    })
  }

  function openDrawer(i: number) {
    setDrawerIndex(i)
    setDrawerOpen(true)
  }

  function closeDrawer() {
    setDrawerOpen(false)
    window.setTimeout(() => setDrawerIndex(null), 260)
  }

  function push() {
    if (selected.size === 0) return
    setPushed(true)
    selected.forEach((i) => {
      setOrch((o) => ({ ...o, [i]: 'pending' }))
      window.setTimeout(
        () => setOrch((o) => ({ ...o, [i]: 'done' })),
        1600 + i * 250,
      )
    })
  }

  async function genDeck(domain: string) {
    setDeckBusy(domain)
    setDeckErr(null)
    try {
      const res = await api.beaconGamma(domain)
      setDecks((d) => ({ ...d, [domain]: res.url }))
      window.open(res.url, '_blank', 'noopener')
    } catch (e) {
      setDeckErr((e as Error).message)
    } finally {
      setDeckBusy(null)
    }
  }

  // Esc closes the drawer
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeDrawer()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="beacon" data-theme={theme}>
      {/* Topbar */}
      <div className="bc-topbar">
        <div className="tb-left">
          <span className="flame-badge">
            <Flame size={20} {...STROKE} />
          </span>
          <div>
            <div className="tb-title">Beacon</div>
            <div className="tb-sub">
              <b>{companies.length} companies</b> · {contactCount} contacts
              {weekOf ? ` · ${weekOf}` : ''}
            </div>
          </div>
        </div>
        <div className="tb-right">
          <button
            className="theme-btn"
            title="Toggle light / dark"
            onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
          >
            {theme === 'light' ? (
              <Moon size={16} {...STROKE} />
            ) : (
              <Sun size={16} {...STROKE} />
            )}
          </button>
          <div className="progress">
            <span className="n">{n}</span>/{MAX} selected
            <div className="pbar">
              <div className="pfill" style={{ width: `${(n / MAX) * 100}%` }} />
            </div>
          </div>
          <button
            className="btn-primary"
            disabled={n === 0 || pushed}
            onClick={push}
          >
            <Rocket size={16} {...STROKE} /> Push accounts ({n})
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="scroll">
        {loading ? (
          <p style={{ color: 'var(--fg-muted)', padding: '8px 16px' }}>
            Loading accounts… (first load generates sales angles — a few seconds)
          </p>
        ) : error ? (
          <p style={{ color: '#f87700', padding: '8px 16px' }}>{error}</p>
        ) : (
          <table className="lf">
            <thead>
              <tr>
                <th>Company</th>
                <th>Contact</th>
                <th>Signals</th>
                <th>Sales angle</th>
                <th className="right">Decision</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((r, i) => {
                const primary = r.people[0]
                const more = r.people.length - 1
                const isSel = selected.has(i)
                const locked = !isSel && n >= MAX
                const rowClass = `acct${isSel ? ' selected' : ''}${
                  locked ? ' locked' : ''
                }`
                return (
                  <Fragment key={i}>
                    <tr className={rowClass} onClick={() => openDrawer(i)}>
                      {/* Company */}
                      <td>
                        <div className="company">
                          <div className="logo" style={{ background: r.color }}>
                            {r.logo}
                          </div>
                          <div>
                            <div className="co-top">
                              <span className="co-name">{r.name}</span>
                              <span
                                className={`heat ${r.score}`}
                                title={r.score === 'hot' ? 'Hot account' : 'Warm account'}
                              >
                                <Flame size={14} {...STROKE} />
                              </span>
                            </div>
                            <div className="co-meta">
                              {r.sector} <span>·</span>{' '}
                              <Users size={12} {...STROKE} /> {r.size}{' '}
                              {r.cc && <span className="cc">{r.cc}</span>}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td>
                        {primary ? (
                          <div className="contact">
                            <div className="ct-top">
                              <span className="ct-name">{primary.name}</span>
                              {primary.champion && (
                                <span className="crown" title="Champion / decision-maker">
                                  <Crown size={14} {...STROKE} />
                                </span>
                              )}
                              {more > 0 && <span className="plus">+{more}</span>}
                            </div>
                            <div className="ct-title">{primary.title}</div>
                            <div className="ct-more">
                              {more > 0
                                ? `View all ${r.people.length} contacts`
                                : 'View contact details'}{' '}
                              <ChevronRight size={13} {...STROKE} />
                            </div>
                          </div>
                        ) : (
                          <span style={{ color: 'var(--fg-muted)' }}>—</span>
                        )}
                      </td>

                      {/* Signals */}
                      <td>
                        <div className="signals">
                          <span className="sig-pill">
                            <Activity size={13} {...STROKE} /> {r.signals.length}
                          </span>
                          <div className="sig-pop">
                            {r.signals.map((s, si) => {
                              const SigIcon = SIGNAL_ICONS[s.icon] ?? Activity
                              return (
                                <div className="sig-line" key={si}>
                                  <SigIcon size={14} {...STROKE} />
                                  <div>
                                    {s.text}
                                    {s.meta && (
                                      <>
                                        {' · '}
                                        <em>{s.meta}</em>
                                      </>
                                    )}
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </td>

                      {/* Sales angle */}
                      <td>
                        <div className="angle">
                          {primary && (
                            <span className="angle-tag">{primary.persona} angle</span>
                          )}
                          <div className="angle-txt" title={primary?.angle}>
                            {primary?.angle}
                          </div>
                        </div>
                      </td>

                      {/* Decision */}
                      <td className="decision">
                        <button
                          className="select-btn"
                          disabled={locked}
                          onClick={(e) => {
                            e.stopPropagation()
                            toggle(i)
                          }}
                        >
                          {isSel ? (
                            <>
                              <Check size={15} {...STROKE} /> Selected
                            </>
                          ) : locked ? (
                            <>
                              <Lock size={15} {...STROKE} /> Locked
                            </>
                          ) : (
                            <>
                              <Plus size={15} {...STROKE} /> Select
                            </>
                          )}
                        </button>
                      </td>
                    </tr>

                    {/* Orchestration detail row */}
                    {orch[i] && (
                      <tr className="detailrow">
                        <td colSpan={5}>
                          <OrchRow name={r.name} state={orch[i]} />
                        </td>
                      </tr>
                    )}
                  </Fragment>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Backdrop + Account drawer */}
      <div
        className={`backdrop${drawerOpen ? ' open' : ''}`}
        onClick={closeDrawer}
      />
      <aside className={`drawer${drawerOpen ? ' open' : ''}`} aria-hidden={!drawerOpen}>
        {drawerIndex !== null &&
          companies[drawerIndex] &&
          (() => {
            const r = companies[drawerIndex]
            const isSel = selected.has(drawerIndex)
            const locked = !isSel && n >= MAX
            const deckUrl = decks[r.domain] ?? r.gamma_deck_url
            const deckBusyNow = deckBusy === r.domain
            // the champion's HubSpot record (first contact that has one)
            const hsUrl = r.people.find((p) => p.hubspot_url)?.hubspot_url
            return (
              <>
                <div className="dr-head">
                  <div className="dr-row">
                    <div className="logo" style={{ background: r.color }}>
                      {r.logo}
                    </div>
                    <span className="dr-name">{r.name}</span>
                    <span className={`heat ${r.score}`}>
                      <Flame size={16} {...STROKE} />
                    </span>
                    <button className="dr-close" onClick={closeDrawer}>
                      <X size={16} {...STROKE} />
                    </button>
                  </div>
                  <div className="dr-meta">
                    {r.sector} <span>·</span> <Users size={13} {...STROKE} />{' '}
                    {r.size} employees {r.cc && <span className="cc">{r.cc}</span>}
                  </div>
                  <div className="dr-actions">
                    <button
                      className={`dr-select${isSel ? ' on' : ''}`}
                      disabled={locked}
                      onClick={() => toggle(drawerIndex)}
                    >
                      {isSel ? (
                        <>
                          <Check size={15} {...STROKE} /> Selected
                        </>
                      ) : locked ? (
                        <>
                          <Lock size={15} {...STROKE} /> Locked (5/5)
                        </>
                      ) : (
                        <>
                          <Plus size={15} {...STROKE} /> Select account
                        </>
                      )}
                    </button>
                    <a
                      className="dr-hs"
                      href={hsUrl || '#'}
                      target={hsUrl ? '_blank' : undefined}
                      rel="noreferrer"
                    >
                      <ExternalLink size={14} {...STROKE} />{' '}
                      {hsUrl ? 'Open contact in HubSpot' : 'Open in HubSpot'}
                    </a>
                  </div>
                  <div className="dr-assets">
                    {deckUrl ? (
                      <a className="dr-hs" href={deckUrl} target="_blank" rel="noreferrer">
                        <Presentation size={14} {...STROKE} /> Gamma deck ›
                      </a>
                    ) : (
                      <button
                        className="dr-hs"
                        disabled={deckBusyNow}
                        onClick={() => genDeck(r.domain)}
                      >
                        {deckBusyNow ? (
                          <>
                            <span className="spin" /> Generating deck…
                          </>
                        ) : (
                          <>
                            <Presentation size={14} {...STROKE} /> Generate Gamma deck
                          </>
                        )}
                      </button>
                    )}
                    <a className="dr-hs" href="#">
                      <Layout size={14} {...STROKE} /> Landing page
                    </a>
                    <a className="dr-hs" href="#">
                      <Mail size={14} {...STROKE} /> HubSpot draft
                    </a>
                  </div>
                  {deckErr && deckBusy === null && (
                    <div
                      style={{
                        color: '#f87700',
                        fontSize: '12px',
                        marginTop: '8px',
                      }}
                    >
                      Deck generation failed: {deckErr}
                    </div>
                  )}
                </div>

                <div className="dr-count">
                  {r.people.length} contact{r.people.length > 1 ? 's' : ''} · with
                  sales angle
                </div>

                <div className="dr-body">
                  {r.people.map((p, idx) => (
                    <div className="person" key={idx}>
                      <div className="p-top">
                        <span className="p-name">{p.name}</span>
                        {p.champion && (
                          <span className="p-crown" title="Champion / decision-maker">
                            <Crown size={14} {...STROKE} />
                          </span>
                        )}
                        <span className={`ptag ${p.persona.toLowerCase()}`}>
                          {p.persona}
                        </span>
                      </div>
                      <div className="p-title">{p.title}</div>
                      <div className="p-contact">
                        {p.email && (
                          <span>
                            <Mail size={13} {...STROKE} /> {p.email}
                          </span>
                        )}
                        {p.phone && (
                          <span>
                            <Phone size={13} {...STROKE} /> {p.phone}
                          </span>
                        )}
                        {p.hubspot_url && (
                          <span>
                            <ExternalLink size={13} {...STROKE} />
                            <a
                              href={p.hubspot_url}
                              target="_blank"
                              rel="noreferrer"
                              style={{ color: 'var(--link)', textDecoration: 'none' }}
                            >
                              HubSpot
                            </a>
                          </span>
                        )}
                      </div>
                      <div className="p-angle">{p.angle}</div>
                    </div>
                  ))}
                </div>
              </>
            )
          })()}
      </aside>
    </div>
  )
}

function OrchRow({ name, state }: { name: string; state: OrchState }) {
  if (state === 'pending') {
    return (
      <div className="orch">
        <span className="lead">
          <span className="spin" /> Orchestrating {name}…
        </span>
        <span className="asset pending">
          <Presentation size={15} {...STROKE} /> Gamma deck
        </span>
        <span className="asset pending">
          <Layout size={15} {...STROKE} /> Landing page
        </span>
        <span className="asset pending">
          <Mail size={15} {...STROKE} /> HubSpot draft
        </span>
      </div>
    )
  }
  return (
    <div className="orch">
      <span className="lead done">
        <CheckCircle2 size={15} {...STROKE} /> {name} pushed
      </span>
      <span className="asset done">
        <Presentation size={15} {...STROKE} /> <a href="#">Gamma deck ›</a>
      </span>
      <span className="asset done">
        <Layout size={15} {...STROKE} /> <a href="#">Landing page ›</a>
      </span>
      <span className="asset done">
        <Mail size={15} {...STROKE} /> <a href="#">HubSpot draft ›</a>
      </span>
      <span className="asset done">
        <ExternalLink size={15} {...STROKE} /> <a href="#">Open in HubSpot ›</a>
      </span>
    </div>
  )
}
