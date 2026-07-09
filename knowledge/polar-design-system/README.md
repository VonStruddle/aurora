# Polar Analytics — Design System

Polar Analytics is the all-in-one commerce data platform for DTC and ecommerce brands. The product unifies marketing, revenue, inventory, and CRM data onto a single semantic layer and exposes it through four surfaces: **Analyze** (dashboards + reporting), **Activate** (audience + data activations), **Ask Polar** (AI assistant + MCP), and **Agents** (autonomous media/inventory workflows). This design system is the source of truth for building branded surfaces — slides, reports, mocks, and production UI — for the Polar Analytics team.

---

## Sources consulted

- **Marketing website codebase** — mounted locally at `dokes.webflow/` (Webflow export of polaranalytics.com). Colors, type, and component vocabulary were extracted from `dokes.webflow/css/dokes.webflow.css` and page markup across `index.html`, `activate.html`, `ai.html`, `pricing.html`, `home-agent.html`, and the `ai/` + `solution/` subfolders.
- **Fonts** — licensed OTFs for Aeonik and Heldane Display were bundled in the Webflow export and copied to `fonts/`. Inter WOFF2 files were supplied as an open-source fallback.
- **Logos + imagery** — PNGs provided via `uploads/` (`logo-primary.png`, `logo-symbol.png`, `hero-01.jpg`, `hero-02.jpg`, `hero-03.jpg`, favicons). SVG brand logos and connector icons were lifted from `dokes.webflow/images/`.
- **Brand guidelines** — voice, tone, color hex values, and visual principles were provided by the product team alongside this build.

If the reader has access, treat `dokes.webflow/` as the canonical marketing-site reference. The `index.html`, `activate.html`, `pricing.html`, `home-agent.html`, and `ai/` pages cover the full component range.

---

## Index

- `README.md` — this file (context, content, visual, iconography, index)
- `SKILL.md` — Agent Skills manifest for portable use
- `colors_and_type.css` — CSS custom properties + semantic type (h1…p, eyebrow, figure-display)
- `fonts/` — Aeonik (Reg/Med/Bold) + Heldane Display (italic weights) + Inter fallback
- `assets/` — logos, favicon, brand imagery, product illustrations, connector icons
- `preview/` — individual specimen cards registered into the Design System tab
- `ui_kits/website/` — marketing-site UI kit (home, pricing, product page, AI/MCP)
- `ui_kits/product/` — in-product dashboard UI kit (Analyze surface)

---

## CONTENT FUNDAMENTALS

Polar copy is **product-led founders talking to DTC operators**. Direct, concrete, data-first; restraint is the default. Headlines are **sentence case**, never title-cased. Second person ("you", "your brand") is used for operator-facing claims; first-person plural ("we build…") only appears in about/manifesto copy.

**Vibe:** confident, understated, a little dry. No "supercharge," "unlock," "revolutionary," "game-changing," "AI-powered" (said about Polar itself). Claims are backed by a number or a concrete verb, never a superlative.

**Voice rules:**
- Lead with the outcome, then the mechanism. *"Grow resilient brands on a strong data foundation."* — the outcome is the headline; the stack is the subhead.
- Numbers over adjectives. "4.7 on Shopify App Store" > "the best-rated analytics app."
- Verbs are operational: *connect, unify, activate, enrich, alert, forecast*. Not *empower, transform, streamline*.
- One italic word per headline (Heldane) reserves editorial weight for one idea only.
- No exclamation points. No rhetorical questions in marketing copy.
- Never use emoji in product copy or marketing copy. (The marketing codebase contains a 🟣 emoji in one internal filename; it is not user-facing.)
- No corporate hedging: "helps you" → "lets you" or just the verb.

**Casing:**
- Headlines and subheads: sentence case.
- Eyebrows and category labels: UPPERCASE with 0.12em tracking.
- Button labels: sentence case. "Book a demo," "Start for free," "Talk to sales."
- Product names: "Polar" one-word by default; "Polar Analytics" only for legal/formal contexts. Products themselves are lowercase-in-sentence: "the Activate feature," "Ask Polar," "Polar MCP."

**Examples from the site:**
- *Grow resilient brands on a strong data foundation.*
- *The all-in-one data stack for insights, activations, and AI agent foundations.*
- *Rated 4.7 on Shopify App Store.*
- *Get instant answers from your commerce data — in Claude, ChatGPT, or Cursor.*
- Eyebrows: `BLENDED CAC`, `INCREMENTALITY`, `ACTIVATE`, `POLAR MCP`.

---

## VISUAL FOUNDATIONS

**Color.** Dark mode is the hero surface. Canvas is `#0D0D11` (never `#000`), occasionally `#08080A` for the deepest blocks. Indigo `#5433FB` is the one accent per composition; Anis `#B1FFD1` is reserved for positive deltas, category labels, or a single editorial highlight. Light surfaces use `#F0F9FF` body / `#FAFBFE` cards with `#303051` text — the light palette is cooler than white and always carries a faint blue cast. One gradient moment per asset, max — never on body text. When gradients appear, they run indigo → violet (`#5433FB → #9542FE`) or they are subtle radial bloom for marketing heroes only.

**Typography.** Aeonik is everything by default — Bold for headlines (sentence case, -0.02em tracking), Medium for subheads/UI, Regular for body at 15–17px with line-height 1.55. Heldane Display Italic is the accent: **one italic word per headline, or one display numeral, or one pull-quote per page — never body copy**. Eyebrows are Aeonik Medium 12–14px, uppercase, 0.12em tracking, usually in `--indigo-300` on dark or `--indigo-500` on light. Numerals in KPIs use `font-feature-settings: "tnum"` to stay aligned in tables.

**Spacing.** Whitespace first. Page padding 48–80px on desktop, 24–32px on mobile. Card padding 32–48px. The grid is 12-column, 24px gutter. Section rhythm runs 80px → 120px → 80px between hero, proof, feature blocks. Tight composition (filled cards, dashboards) uses a 4/8/12/16/24 step; macro layout uses 32/48/64/80/120.

**Backgrounds.** Dark canvas is primary. Marketing heroes may add a **single** pattern element: a faint perspective wireframe grid (see `hero-01.jpg`) or the `pattern-account.svg` dotted field — always low-contrast, always masked to one quadrant, never tiled edge-to-edge. No stock photography. No cosmic/star-field backgrounds unless explicitly a marketing hero. Product illustrations are flat SVGs with indigo + anis spot-color — they live inside rounded cards, never float loose on canvas.

**Borders, not shadows.** Surfaces are flat. Dividers are **1px solid** `#3B3B54` on dark, `#EAE9FF` on light. Inset highlights (the subtle top-border lightening on cards) use `rgba(255,255,255,0.04)` on dark. Heavy drop shadows are almost absent; one exception is the floating "pop" menu (`--shadow-pop: 0 8px 32px -8px rgba(13,13,17,0.24)`). Never stack shadow + heavy border + rounded corners — pick one.

**Corner radii.** Components use 6/8/12 (inputs, buttons, badges). Cards use 16–20. Hero images and feature cards use 20. Pills/tags use `50rem`. Icons-in-squares (the app icon lockup) use ~22% of side length.

**Cards.** On dark: `#16161C` fill, `1px solid #3B3B54` border, 16–20px radius, 32–48px padding, no shadow. On light: `#FAFBFE` fill, `1px solid #EAE9FF` border, matching radius and padding. A subtle interior top gradient (`linear-gradient(180deg, rgba(255,255,255,0.02), transparent 40%)`) is optional on hero dark cards.

**Buttons.**
- *Primary dark:* `#5433FB` fill, white text, 12px radius, 14–16px × 20–28px padding, Aeonik Medium. Hover: `#4337FE` (primary-1-darken).
- *Primary light:* `#5A50FE` fill.
- *Secondary:* transparent fill, 1px border `#3B3B54` on dark / `#EAE9FF` on light, same dimensions.
- *Ghost link:* color `#776EF8`, underline on hover.
- *Press state:* 97% scale + instant color deepen (no long press animation).

**Hover + press.**
- Hover = deepen color one step (e.g. `indigo-400 → indigo-600`) OR shift opacity to 0.9. Never lighten. Never glow.
- Links underline on hover only.
- Transitions are 150–250ms `ease-out` — crisp, not bouncy.
- Press = `scale(0.97)` + 80ms.

**Animation.** Minimal. Fades at 200ms, slide-ups at 300ms with a 0.2–0.8 cubic-bezier (ease-out). No bounces, no parallax, no emphasis spring. Charts animate with a single 400ms bar grow-in on mount. Never animate on scroll-enter beyond the first paint.

**Transparency + blur.** Used sparingly: navigation chrome on dark uses `rgba(24,22,65,0.7)` + `backdrop-filter: blur(16px)`. Modal backdrops are `rgba(0,0,0,0.75)`. Card backgrounds are always solid — blur is reserved for overlay layers.

**Imagery tone.** Provided hero JPGs (hero-01, hero-02, hero-03) use the dark canvas with indigo perspective grid + anis-for-positive deltas + violet-to-indigo icon gradients. Imagery is cool, flat, and synthetic — no warmth, no grain, no filter, no human photography.

**Charts (critical).** Indigo `#5433FB` is the primary series. Anis `#B1FFD1` for positive deltas. Error `#F92572` for negative deltas. Gridlines `#EAE9FF` (light) or `rgba(139, 133, 254, 0.12)` (dark). No 3D, no gradients on bars, no drop shadow on points. Axes labels Aeonik Medium 12px, `--fg-muted`. Always tabular-number alignment.

**Layout rules.**
- One accent color per composition — let a single element carry the color.
- One Heldane italic per page.
- One gradient moment per asset.
- Don't stack colored pills in one view (alert + badge + CTA of different hues = noise).
- Don't gradient every headline.

---

## ICONOGRAPHY

Polar does not use a branded icon font. The marketing site uses **individually-drawn SVGs** for product illustrations (e.g. `illus-kpis.svg`, `illus-blended-performance.svg`) and **vendor/connector logos as SVGs** for integrations (see `assets/connector-*.svg`). These are not systematic — they're handpicked per section.

**For UI icons** (navigation, buttons, inline metrics), the product uses a **1.5px stroke, rounded-cap, 24×24 line-icon style** consistent with the marketing-site product illustrations. No existing icon font in the codebase matches this exactly. **Substitution:** we ship with **Lucide** (CDN, same stroke weight and rounded caps) as the working icon set. Flag to the brand team whether to formalize Lucide as the canonical set or license a custom family.

Do use:
- `assets/brand-logo-full.svg` and `assets/brand-logo-horizontal.svg` for headers.
- `assets/logo-symbol.png` for the one-word "Polar" square lockup (favicon, avatars, compact nav).
- Flat product illustrations (`assets/illus-*.svg`) inside feature-block cards.
- Connector SVGs (`assets/connector-*.svg`) at their original aspect ratio in integration grids.

Don't use:
- Emoji as icons. Never.
- Unicode pictographs as icons.
- Hand-rolled SVG icons for UI when Lucide already covers it.
- PNG icons except for the provided brand PNGs (logo, favicon).

**Lucide usage:** `<script src="https://unpkg.com/lucide@latest"></script>` then `<i data-lucide="trending-up"></i>`. Default stroke `1.5`, size `20` (UI) or `24` (feature). Color via `currentColor`; coerce to `--fg-muted` for inline-in-body icons.

---

## Caveats — read me

- **Aeonik and Heldane Display are licensed.** They ship in `fonts/` for convenience because they were present in the supplied Webflow export, but the brand team must confirm the license covers this workspace and any downstream use. If not, the design system still renders correctly via the Inter fallback stack declared in `colors_and_type.css`.
- **Icon substitution.** Lucide is used as a stand-in for UI iconography. This is an unconfirmed substitution and is flagged above.
- **Product app UI kit.** The product dashboard (`ui_kits/product/`) is recreated from `hero-02.jpg` alone — no in-product codebase was provided. Visuals are faithful to the screenshot; component internals are simplified. Request in-product source to tighten.

---

## ITERATE WITH ME

**Please review and tell me:**
1. Is the icon substitution (Lucide) acceptable, or do you want a custom set sourced?
2. Does the product UI kit accurately reflect the current in-product look? (only the hero screenshot was used)
3. Are there additional surfaces (mobile app? email template? pitch deck?) I should add kits for?
