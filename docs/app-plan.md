# Aurora — App interne "Weekly Hot Accounts" (scope Hugo)

> Boîte : **Polar Analytics** (analytics e-com/DTC). ICP = marques e-commerce Shopify/DTC.
> L'app est la **surface + le chef d'orchestre** du flow GTM. Elle rend le rituel hebdo fluide pour les Sales
> et déclenche les agents (Sillage → FullEnrich → Gamma / Landing page / HubSpot) quand un compte est validé.

## Personas utilisateurs de l'app
- **Sales rep (AE)** — utilisateur principal. Vit dans l'app pendant le rituel hebdo et pour travailler ses comptes.
- **Sales manager / RevOps** — anime le rituel, veut voir l'avancement et le SLA respecté.

## Cibles de prospection (personas des comptes)
CEO · CMO · Head of e-com · Head of revenue · Traffic Manager

---

## User stories

### Épopée 1 — Le rituel hebdo (le cœur de la démo)
- **US1.1** En tant que Sales, je vois chaque semaine le **top 10 des comptes les plus chauds**, triés par score, pour préparer mon meeting.
- **US1.2** Pour chaque compte, je vois **pourquoi il est chaud** : score (chaud/moyen/cold) + les **signaux clés** (Sillage : job change, hiring intent, competitor engagement, croissance Storeleads) + infos company.
- **US1.3** Je **sélectionne mon top 5** parmi les 10 (ownership) ; les 5 restants retournent au pool.
- **US1.4** Quand je valide ma sélection, l'app **déclenche l'activation** de ces 5 comptes (people mapping lancé).

### Épopée 2 — People mapping & enrichissement
- **US2.1** Pour un compte validé, l'app trouve les **personas clés via Sillage** et respecte un **SLA de 5 contacts min**.
- **US2.2** Chaque contact est **enrichi via FullEnrich** (email vérifié + téléphone) ; je vois le statut d'enrichissement.
- **US2.3** Je vois un **état de progression** clair par compte (mapping → enrichi → assets prêts).

### Épopée 3 — Use cases & activation
- **US3.1** Pour chaque persona/ICP, l'app propose des **use cases matchés** (knowledge Polar : value props, testimonials, extraits Gong).
- **US3.2** Quand les contacts sont trouvés, ça **trigger** la génération : **PPT Gamma** (Adrien) + **Landing page** (Alex).
- **US3.3** Depuis la fiche compte, j'accède aux **liens partageables** (deck Gamma, landing page).
- **US3.4** L'app crée un **draft d'email dans HubSpot** + des **tâches** ; je peux review/valider facilement.

### Épopée 4 — Pilotage
- **US4.1** En tant que manager, je vois un **dashboard** : comptes en cours, SLA contacts, assets générés, drafts en attente de review.

---

## Carte des écrans (MVP démo)

1. **Weekly Review** `/` — LE hero screen
   - Header : "Semaine du X — Vos 10 comptes les plus chauds"
   - Grille de 10 cartes compte (score badge, top 3 signaux, logo/nom/secteur, revenue/trafic Storeleads)
   - Sélection multiple (max 5) → CTA "Activer mes 5 comptes"

2. **Account Workspace** `/account/[id]` — la fiche qui "s'allume"
   - Bandeau compte : score, signaux, contexte boîte
   - Section **Contacts** (Sillage + FullEnrich) : liste des personas, statut enrichissement, SLA 5/5
   - Section **Use cases** par persona
   - Section **Assets** : carte Gamma (lien), carte Landing page (lien), carte HubSpot draft (statut) + tâches
   - Timeline d'orchestration (mapping → enrich → assets)

3. **Pipeline / Dashboard** `/pipeline` — vue manager (nice-to-have)
   - Comptes actifs, SLA, assets prêts, drafts à review

---

## Stack app (proposée)
- **Next.js (App Router) + TypeScript + Tailwind** + design system Polar (tokens à récupérer via Quentin)
- **Supabase** comme backend (déjà live : tables Company + Signals via Polar/Quentin)
- Orchestration : actions serveur qui appellent Sillage / FullEnrich / triggers Gamma & Landing & HubSpot

## Contrats d'interface à figer avec l'équipe (pour bosser en parallèle)
- **Quentin** : schéma Supabase (Company, Signals, + tables Accounts sélectionnés, Contacts, Assets, Tasks) + où sont les tokens du design system
- **Adrien** : forme du trigger Gamma (payload compte+contacts) + comment le lien deck revient / champ HubSpot draft
- **Alex** : trigger landing page + comment l'URL revient dans l'app
