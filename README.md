# Aurora Hackathon App

A starter full-stack app: **React (Vite + TS)** frontend → **FastAPI** backend → **Supabase Postgres**.

```
frontend/   Vite + React + TypeScript (talks to the backend over REST)
backend/    FastAPI + async SQLAlchemy (talks to Supabase Postgres)
knowledge/  Reference material (design system, analyses)
```

## Supabase

Uses the existing **Aurora** Supabase project (`vmpzkytxdruwbdftxtnm`). To avoid
colliding with that project's tables, this app keeps everything in the shared
`public` schema behind a `hackathon_` prefix (e.g. `public.hackathon_items`).
The demo table is created and RLS-protected; the backend reaches it via a direct
Postgres connection.

## Backend

```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env          # then set DATABASE_URL's password
uvicorn app.main:app --reload --port 8000
```

Set the password in `backend/.env` `DATABASE_URL` (Supabase → Project Settings →
Database). API docs: http://localhost:8000/docs · health: http://localhost:8000/api/health

Endpoints: `GET/POST /api/items`, `GET/PATCH/DELETE /api/items/{id}`, `GET /api/health`.

## Frontend

```bash
cd frontend
npm install
cp .env.example .env          # VITE_API_URL defaults to http://localhost:8000
npm run dev                   # http://localhost:5173
```
