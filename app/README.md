# app/ — Beacon (Weekly Hot Accounts) · owner: Hugo

Internal Sales app for Polar Analytics: the surface + orchestrator of the weekly
GTM ritual. An AE opens **Beacon** on Monday, sees their ~10 hottest accounts,
understands *why* each is hot, selects **5**, and pushes them into orchestration
(Gamma deck + landing page + HubSpot draft).

Full product plan: [`../docs/app-plan.md`](../docs/app-plan.md).
Design source (static hi-fi mock): [`../docs/design/beacon.html`](../docs/design/beacon.html).

## Run it

```bash
cd app
npm install
npm run dev        # http://localhost:5174
```

Build / typecheck: `npm run build` · Preview a build: `npm run preview`.

> Runs on port **5174** so it can sit alongside the data-explorer in
> [`../frontend`](../frontend) (port 5173) without clashing.

## Stack

- **Vite + React 18 + TypeScript** (same toolchain as `../frontend`, so the team
  only learns one build). `lucide-react` for icons.
- **Polar design system** — Beacon ships a self-contained subset of the design
  tokens (`src/beacon.css`, scoped to `.beacon`) taken from
  `../knowledge/polar-design-system/colors_and_type.css`. Dark by default, with a
  light toggle. No external CSS/font dependency, so the build stays clean.

## What's here (v1 — single screen)

`src/Beacon.tsx` — the whole screen:

- **Topbar** — flame badge, week volumetry, `n/5 selected` progress, **Push
  accounts** CTA, light/dark toggle.
- **Table** (company grain) — Company · Contact (primary + `+N`) · Signals
  (hover to expand the "why now") · Sales angle (persona × Polar use-case) ·
  Decision.
- **Select with a 5/5 cap** — at 5/5 the remaining rows lock.
- **Push accounts** — each selected row shows an inline orchestration state, then
  its Gamma / landing / HubSpot links.
- **Account drawer** — click any row to see *all* contacts with their per-persona
  sales angle, champion marker, email + phone, and a HubSpot deep link.

## Data — currently mocked

`src/data.ts` holds 8 fictional DTC/Shopify accounts (the same fixtures as the
mock). This is where the real feed plugs in.

- **Quentin** → Supabase schema (Company + Contacts + Signals) that replaces
  `ROWS` in `src/data.ts`; the `Company`/`Person`/`Signal` types there are the
  first draft of that data contract.
- **Adrien** → `Push accounts` payload → Gamma deck link + HubSpot draft status.
- **Alex** → landing-page trigger → returned URL.

Until then the Push flow is a simulated inline state (see `push()` in
`Beacon.tsx`).

## Not in v1 (later)

- Live data wiring · post-push persistence · manager dashboard (`/pipeline`) ·
  on-demand phone enrichment · Aeonik/Heldane webfonts (falls back to system now).
