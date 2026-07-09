import { useEffect, useState } from 'react'
import { api } from './api'
import CompaniesView from './CompaniesView'
import TamView from './TamView'
import Beacon from './Beacon'
import LandingPage from './LandingPage'

type View = 'beacon' | 'tam' | 'companies'

function landingId(): string | null {
  const m = window.location.hash.match(/^#\/landing\/(.+)$/)
  return m ? m[1] : null
}

const NAV: { id: View; label: string }[] = [
  { id: 'beacon', label: 'Beacon' },
  { id: 'tam', label: 'TAM by tier' },
  { id: 'companies', label: 'Companies' },
]

const VIEW_IDS = NAV.map((n) => n.id)

function initialView(): View {
  const h = window.location.hash.replace('#', '') as View
  return VIEW_IDS.includes(h) ? h : 'beacon'
}

export default function App() {
  const [lid, setLid] = useState<string | null>(landingId)
  const [view, setViewState] = useState<View>(initialView)
  const setView = (v: View) => {
    setViewState(v)
    window.location.hash = v
  }
  const [dbOk, setDbOk] = useState<boolean | null>(null)

  useEffect(() => {
    const onHash = () => setLid(landingId())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  useEffect(() => {
    api
      .health()
      .then((h) => setDbOk(h.database === 'connected'))
      .catch(() => setDbOk(false))
  }, [])

  // Standalone shareable landing route (#/landing/:id) — no app shell.
  if (lid) return <LandingPage id={lid} />

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <h1>Hackathon App</h1>
          <span
            className={`badge ${dbOk ? 'ok' : dbOk === false ? 'bad' : ''}`}
            title="Backend /api/health"
          >
            {dbOk === null ? '…' : dbOk ? 'DB ok' : 'DB down'}
          </span>
        </div>
        <nav className="side-nav">
          {NAV.map((n) => (
            <button
              key={n.id}
              className={view === n.id ? 'side-link active' : 'side-link'}
              onClick={() => setView(n.id)}
            >
              {n.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className={`content${view === 'beacon' ? ' content-flush' : ''}`}>
        {view === 'beacon' && <Beacon />}
        {view === 'tam' && <TamView />}
        {view === 'companies' && <CompaniesView />}
      </main>
    </div>
  )
}
