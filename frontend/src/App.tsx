import { useEffect, useState, type FormEvent } from 'react'
import { api } from './api'
import type { Item } from './types'
import CompaniesView from './CompaniesView'
import TamView from './TamView'

type View = 'tam' | 'companies' | 'items'

const NAV: { id: View; label: string }[] = [
  { id: 'tam', label: 'TAM by tier' },
  { id: 'companies', label: 'Companies' },
  { id: 'items', label: 'Items' },
]

const VIEW_IDS = NAV.map((n) => n.id)

function initialView(): View {
  const h = window.location.hash.replace('#', '') as View
  return VIEW_IDS.includes(h) ? h : 'tam'
}

export default function App() {
  const [view, setViewState] = useState<View>(initialView)
  const setView = (v: View) => {
    setViewState(v)
    window.location.hash = v
  }
  const [items, setItems] = useState<Item[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [dbOk, setDbOk] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)

  async function refresh() {
    try {
      setItems(await api.listItems())
      setError(null)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    api
      .health()
      .then((h) => setDbOk(h.database === 'connected'))
      .catch(() => setDbOk(false))
    void refresh()
  }, [])

  async function onAdd(e: FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    try {
      await api.createItem({
        title: title.trim(),
        description: description.trim() || undefined,
      })
      setTitle('')
      setDescription('')
      await refresh()
    } catch (e) {
      setError((e as Error).message)
    }
  }

  async function onDelete(id: string) {
    try {
      await api.deleteItem(id)
      await refresh()
    } catch (e) {
      setError((e as Error).message)
    }
  }

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

      <main className="content">
        {view === 'tam' && <TamView />}
        {view === 'companies' && <CompaniesView />}
        {view === 'items' && (
          <section>
            <p className="sub">
              React + FastAPI + Supabase — table{' '}
              <code>public.hackathon_items</code>
            </p>

            <form onSubmit={onAdd} className="card form">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                aria-label="Title"
              />
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description (optional)"
                aria-label="Description"
              />
              <button type="submit">Add item</button>
            </form>

            {error && <div className="error">{error}</div>}

            {loading ? (
              <p className="muted">Loading…</p>
            ) : items.length === 0 ? (
              <p className="muted">No items yet. Add one above.</p>
            ) : (
              <ul className="list">
                {items.map((it) => (
                  <li key={it.id} className="card item">
                    <div>
                      <strong>{it.title}</strong>
                      {it.description && <p className="muted">{it.description}</p>}
                    </div>
                    <button className="ghost" onClick={() => onDelete(it.id)}>
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </main>
    </div>
  )
}
