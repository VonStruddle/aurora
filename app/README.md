# app/ — Weekly Hot Accounts (owner : Hugo)

App interne Sales de Polar Analytics : surface + orchestrateur du flow GTM.
Voir le plan complet dans [`docs/app-plan.md`](../docs/app-plan.md).

## Écrans
1. **Weekly Review** `/` — top 10 comptes chauds (score + signaux + contexte), sélection du **top 5**, CTA "Activer".
2. **Account Workspace** `/account/[id]` — la fiche qui "s'allume" : contacts (Sillage + FullEnrich, SLA 5/5), use cases par persona, assets (deck Gamma, landing page, draft HubSpot), timeline d'orchestration.
3. **Pipeline** `/pipeline` *(nice-to-have)* — vue manager (SLA, assets prêts, drafts à review).

## Orchestration
Au clic **"Activer"** → people mapping (Sillage) → enrichissement (FullEnrich) → triggers Gamma / Landing / HubSpot.

## Stack
- Next.js (App Router) + TypeScript + Tailwind
- Supabase (tables Company + Signals live via Quentin ; + `selected_accounts`, `contacts`, `use_cases`, `assets`, `tasks`)
- Design system Polar (tokens à intégrer — en attente de Quentin)

## Contrats d'interface (voir docs/app-plan.md)
- **Quentin** → schéma Supabase + tokens design system
- **Adrien** → payload trigger Gamma + retour lien deck / statut HubSpot draft
- **Alex** → trigger landing page + retour URL

## Statut
🚧 Scaffolding à venir. En attente des tokens Polar avant de figer le style.
