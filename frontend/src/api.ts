import type { Item } from './types'

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`${res.status} ${res.statusText}${body ? `: ${body}` : ''}`)
  }
  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}

export const api = {
  health: () =>
    fetch(`${BASE}/api/health`).then((r) =>
      handle<{ status: string; database: string }>(r),
    ),
  listItems: () => fetch(`${BASE}/api/items`).then((r) => handle<Item[]>(r)),
  createItem: (data: { title: string; description?: string }) =>
    fetch(`${BASE}/api/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then((r) => handle<Item>(r)),
  deleteItem: (id: string) =>
    fetch(`${BASE}/api/items/${id}`, { method: 'DELETE' }).then((r) =>
      handle<void>(r),
    ),
}
