# Landing Page Builder — Contexte global

_Dernière mise à jour : 2026-07-09. Document destiné aux agents IA et aux membres de l'équipe Aurora qui travaillent sur ce projet._

---

## 1. Vue d'ensemble

Le **landing page builder** est une application Next.js qui génère des landing pages de vente personnalisées pour pitcher **Polar Analytics** à des prospects DTC ecommerce.

Chaque landing page est adaptée à deux dimensions simultanées :
- **L'entreprise cible** — nom, GMV estimé, industrie, pain points spécifiques identifiés
- **La persona du destinataire** — Founder, Marketing, Finance, Ecom, ou Retention

Le destinataire reçoit une URL unique. En ouvrant la page, il voit une landing page qui lui parle directement, cite son entreprise par son nom, et met en avant les problèmes Polar les plus pertinents pour son rôle.

Le même enregistrement base de données alimente également une présentation **Gamma** personnalisée via l'API Gamma.

---

## 2. Stack technique

| Élément | Choix |
|---------|-------|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4 |
| Langage | TypeScript |
| Base de données | Supabase (PostgreSQL via REST API) |
| Fonts | Aeonik (Regular/Medium/Bold) + Inter (fallback) |
| Icônes | Lucide React (stroke 1.5px, 20px) |
| Design system | Polar Analytics officiel (extrait du Webflow export) |

Dépôt : `https://github.com/VonStruddle/aurora`  
Dossier : `landing-page-builder/`

---

## 3. URLs et routes

| URL | Comportement |
|-----|-------------|
| `/` | Redirige vers `/landing` |
| `/landing` | Landing page générique — persona Founder, aucune personnalisation entreprise, section "Personalized Hook" absente |
| `/landing/{uuid}` | Landing page personnalisée — données lues depuis Supabase par UUID |
| `/[company]` | Route legacy pour configs TypeScript statiques (non utilisé en production) |

L'UUID dans `/landing/{uuid}` correspond à la colonne `id` de la table `hackathon_landings`.

---

## 4. Architecture de personnalisation

La personnalisation fonctionne sur deux niveaux :

### Niveau 1 — Données spécifiques à l'entreprise (viennent de Supabase)
Ces champs changent pour chaque destinataire :
- Nom de l'entreprise, industrie, GMV estimé
- Prénom et titre du destinataire
- `hook_text` — le paragraphe d'accroche personnalisé
- `company_pain_points` — tags spécifiques à l'entreprise

### Niveau 2 — Template par persona (chargé depuis le code)
Ces champs sont identiques pour tous les contacts d'une même persona. Ils sont définis dans `data/personas/*.ts` et chargés automatiquement selon le champ `persona_type` de la row Supabase :

| Persona | Fichier | Headline par défaut |
|---------|---------|---------------------|
| `founder` | `data/personas/founder.ts` | "One profit-legible source of truth — without the analyst headcount." |
| `marketing` | `data/personas/marketing.ts` | "Attribution you can forward to the CEO without second-guessing it." |
| `finance` | `data/personas/finance.ts` | "CAC payback, contribution margin, LTV:CAC — automated, not estimated." |
| `ecom` | `data/personas/ecom.ts` | "Daily revenue ops from one cockpit. No SQL required." |
| `retention` | `data/personas/retention.ts` | "Increase flow revenue 70% with enriched Klaviyo audiences." |

Chaque fichier persona contient : `heroHeadline`, `heroSubheadline`, `painSolutions` (3 cards), `highlightedFeatureIds`, `relevantCaseStudy`, `closingOutcome`.

Les champs `hero_headline`, `hero_subheadline`, et `closing_outcome` dans Supabase permettent de surcharger ces defaults si besoin — sinon laisser `null`.

---

## 5. Sections de la landing page

La page `/landing/{id}` est composée de 7 sections dans cet ordre :

### 5.1 Header (statique)
- Logo Polar SVG (officiel, extrait du design system)
- Bouton "Get in touch" → `contact_url` de la row Supabase
- Fond semi-transparent avec backdrop-blur

### 5.2 Hero (partiellement personnalisé)
- Si `recipient_name` est renseigné → affiche "Hey {name} — here's why Polar makes sense for {company}"
- H1 : `hero_headline` ou default persona
- Sous-titre : `hero_subheadline` ou default persona
- Badge "Trusted by 4,000+ Shopify brands"
- CTA "Get in touch →" → `contact_url`
- Ligne de contexte : "Prepared for **{company_name}** · {industry} · {estimated_gmv}"

### 5.3 Social Proof (entièrement statique)
- "Trusted by 4,000+ ecommerce brands"
- Ticker de marques (Allbirds, Jones Road, Gorjana, etc.)
- 3 témoignages clients

### 5.4 Personalized Hook (entièrement personnalisé)
- Titre : "What we found at **{company_name}**"
- Corps : `hook_text` découpé en paragraphes (séparateur `\n\n`)
- Tags : `company_pain_points` (tableau Postgres)
- **Absente sur `/landing` (page générique)**

### 5.5 Pain → Solution (par persona)
- 3 cartes chargées depuis `persona.painSolutions`
- Chaque carte : "The problem" (rouge) + "The Polar solution" (indigo) + résultat (vert anis)
- Icônes Lucide (1.5px stroke)

### 5.6 Product Showcase (partiellement personnalisé)
- 4 features core toujours affichées : `semantic-layer`, `connectors`, `ask-polar`, `snowflake`
- 1–2 features "spotlight" selon `persona.highlightedFeatureIds` (hors core)
- Catalogue complet dans `data/features.ts`

### 5.7 Results (partiellement personnalisé)
- 6 métriques statiques (YellowPop, Modular Closets, Tiege Hanley, ROAR Studios, The Feed, Klaviyo)
- 1 case study featured depuis `persona.relevantCaseStudy`

### 5.8 Closing CTA (personnalisé)
- "Let's talk about what Polar can do for **{company_name}**" (ou "for you" si company vide)
- Outcome : `closing_outcome` ou default persona
- Bouton "Get in touch →" → `contact_url`
- Mention : "No commitment. A 30-minute call to see if it's a fit."

### 5.9 Footer (statique)
- Logo Polar SVG
- Liens Privacy · Terms
- © Polar Analytics

---

## 6. Flux de données

```
hackathon_target_contacts  ──┐
hackathon_target_accounts  ──┤──► seed-landings.mjs ──► hackathon_landings (row)
knowledge/*.md             ──┘                              │
                                                            │
                                    ┌───────────────────────┤
                                    │                       │
                              /landing/{id}          Gamma API
                           (landing page Next.js)   (présentation)
```

1. Le script `seed-landings.mjs` lit les tables sources et insère une row dans `hackathon_landings`
2. Le script `update-gamma-fields.mjs` enrichit la même row avec les champs `gamma_*`
3. Next.js sert `/landing/{id}` en Server Component — il fetch la row Supabase au moment de la requête
4. La row est mappée vers un `LandingConfig` complet via `lib/landing-from-db.ts`
5. Le `LandingConfig` est passé aux composants de section pour le rendu

---

## 7. Intégration Supabase

### Connexion
La connexion directe PostgreSQL est bloquée réseau depuis la machine de développement. **Toutes les opérations passent par l'API REST HTTPS** (port 443).

```
SUPABASE_URL=https://vmpzkytxdruwbdftxtnm.supabase.co
SUPABASE_KEY=<service_role_key>   # Donne un accès complet, bypass RLS
```

Variables dans `landing-page-builder/.env.local`.

### Fetch côté serveur
Le fichier `lib/supabase.ts` expose `getLandingById(id)` — utilisé dans `app/landing/[id]/page.tsx` comme Server Component. La clé service role ne transite jamais vers le browser.

### Opérations disponibles via REST
- `GET /rest/v1/hackathon_landings?id=eq.{uuid}` — lire une row
- `POST /rest/v1/hackathon_landings` — créer une row
- `PATCH /rest/v1/hackathon_landings?id=eq.{uuid}` — mettre à jour une row
- `GET /rest/v1/hackathon_target_contacts?...` — lire les contacts
- `GET /rest/v1/hackathon_target_accounts?...` — lire les comptes

### Tables clés
| Table | Rôle |
|-------|------|
| `hackathon_landings` | Chaque row = une landing page + un deck Gamma |
| `hackathon_target_accounts` | Données entreprises (GMV, industrie, signaux in-market) |
| `hackathon_target_contacts` | Données contacts (nom, titre, score ICP) |

---

## 8. Design system

La landing page implémente le design system officiel Polar Analytics extrait du Webflow export.

### Couleurs
| Token | Valeur | Usage |
|-------|--------|-------|
| Background | `#0D0D11` | Canvas principal |
| Card fill | `#16161C` | Toutes les cartes |
| Card border | `1px solid #3B3B54` | Toutes les cartes |
| Elevated | `#22222D` | Sections alternées |
| Primary (CTA) | `#5433FB` | Boutons, accents |
| Primary hover | `#4337FE` | Hover boutons |
| Link/accent | `#776EF8` | Eyebrows, liens |
| Muted text | `#8C8A98` | Corps de texte secondaire |
| Positive delta | `#B1FFD1` | Résultats positifs (anis) |
| Error/pain | `#F92572` | Labels "The problem" |

### Typographie
- **Font** : Aeonik (servie depuis `/public/fonts/`) avec fallback Inter
- **H1** : 700, `clamp(40px, 4.5vw, 64px)`, letter-spacing `-0.02em`
- **H2** : 700, `clamp(28px, 3vw, 40px)`, letter-spacing `-0.018em`
- **Eyebrow** : 500, 12px, uppercase, letter-spacing `0.12em`, couleur `#776EF8`
- **KPI figures** : 700, tnum, large

### Composants
- **Boutons primaires** : `bg #5433FB`, radius `10px`, padding `10-14px 20-40px`, Medium 15px
- **Cartes** : `bg #16161C`, `border 1px solid #3B3B54`, radius `16-20px`
- **Header nav** : `rgba(13,13,17,0.85)` + `backdrop-filter: blur(16px)`

---

## 9. Ajouter une nouvelle landing page

### Option A — Depuis Supabase (méthode principale)

1. Identifier un contact dans `hackathon_target_contacts` (`is_icp = true`, `persona_score >= 70`)
2. Récupérer l'account associé via `domain_id`
3. Construire les champs selon le guide dans `knowledge/landing_generation_instructions.md`
4. Insérer via REST API ou via le script `seed-landings.mjs`
5. Enrichir les champs `gamma_*` via `update-gamma-fields.mjs`
6. L'URL est immédiatement disponible : `/landing/{uuid retourné}`

### Option B — Config TypeScript statique (legacy)

Dupliquer `data/companies/_example.ts`, remplir les champs, enregistrer le slug dans `app/[company]/page.tsx`. Accessible à `/{slug}`. Cette approche ne nécessite pas Supabase mais exige un redéploiement.

---

## 10. Scripts utilitaires

| Script | Usage |
|--------|-------|
| `scripts/seed-landings.mjs` | Sélectionne 4 contacts ICP aléatoires depuis les tables sources et crée leurs landings dans Supabase |
| `scripts/update-gamma-fields.mjs` | Met à jour les champs `gamma_*` sur les 4 rows de test |
| `scripts/migration.sql` | SQL de création de la table `hackathon_landings` (à exécuter dans le SQL Editor Supabase) |

Lancer avec : `node scripts/{script}.mjs` depuis le dossier `landing-page-builder/`.

---

## 11. Structure des fichiers

```
landing-page-builder/
├── app/
│   ├── layout.tsx                  # Root layout, fonts, lang="en-US"
│   ├── page.tsx                    # Redirect → /landing
│   ├── landing/
│   │   ├── page.tsx                # Page générique (sans personnalisation)
│   │   └── [id]/page.tsx           # Page personnalisée depuis Supabase
│   └── [company]/page.tsx          # Route legacy (configs TypeScript)
├── components/
│   ├── layout/
│   │   ├── Header.tsx              # Logo Polar + CTA (commun)
│   │   └── Footer.tsx              # Footer minimal (commun)
│   ├── sections/
│   │   ├── Hero.tsx                # Section hero (personnalisée)
│   │   ├── SocialProof.tsx         # Brands + témoignages (statique)
│   │   ├── PersonalizedHook.tsx    # "What we found at X" (personnalisée)
│   │   ├── PainSolution.tsx        # 3 cartes pain/solution (par persona)
│   │   ├── ProductShowcase.tsx     # Features Polar (semi-custom)
│   │   ├── Results.tsx             # Métriques + case study (semi-custom)
│   │   └── ClosingCTA.tsx          # CTA final (personnalisée)
│   └── ui/
│       └── Icon.tsx                # Mapping Lucide icons
├── data/
│   ├── features.ts                 # Catalogue complet des features Polar
│   ├── personas/
│   │   ├── founder.ts
│   │   ├── marketing.ts
│   │   ├── finance.ts
│   │   ├── ecom.ts
│   │   └── retention.ts
│   └── companies/
│       └── _example.ts             # Template config TypeScript
├── lib/
│   ├── supabase.ts                 # Client Supabase + getLandingById()
│   └── landing-from-db.ts          # Mapper row DB → LandingConfig
├── types/
│   ├── landing.ts                  # Interfaces TypeScript (LandingConfig etc.)
│   └── db.ts                       # Type LandingRow (colonnes Supabase)
├── scripts/
│   ├── seed-landings.mjs
│   ├── update-gamma-fields.mjs
│   └── migration.sql
├── public/
│   └── fonts/                      # Aeonik + Inter (servies localement)
└── .env.local                      # SUPABASE_URL + SUPABASE_KEY
```

---

## 12. Lancer le projet

```bash
cd landing-page-builder
npm install
npm run dev
# → http://localhost:3000
```

Pages disponibles en local :
- `http://localhost:3000/landing` — page générique
- `http://localhost:3000/landing/{uuid}` — page personnalisée

---

## 13. Contraintes et points d'attention

- **Connexion PostgreSQL bloquée** — uniquement l'API REST HTTPS fonctionne depuis la machine de dev. Ne pas tenter de connexion directe `pg` ou CLI Supabase sans token personnel.
- **Pas de `onMouseEnter` en Server Components** — les effets hover passent par des classes CSS dans `globals.css` (`.btn-primary:hover`, `.card-hover:hover`).
- **Fonts Aeonik sont sous licence** — présentes dans `/public/fonts/` mais la licence doit couvrir l'usage downstream. Inter est le fallback open-source.
- **Pas d'emoji dans les textes** — règle de brand Polar. Utiliser Lucide pour les icônes.
- **Titres en sentence case** — jamais en Title Case (règle Polar).
- **La page générique `/landing` n'affiche pas `PersonalizedHook`** — cette section est omise intentionnellement quand il n'y a pas de personnalisation.
- **Les champs `hero_headline`, `hero_subheadline`, `closing_outcome` sont optionnels** — si `null`, les defaults du fichier persona sont utilisés. Ne les renseigner que pour des overrides spécifiques.
