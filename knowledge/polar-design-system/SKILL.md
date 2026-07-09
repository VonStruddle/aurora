---
name: polar-design
description: Use this skill to generate well-branded interfaces and assets for Polar Analytics (commerce data platform for DTC brands) — for production or throwaway prototypes, mocks, slides, and marketing pages. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components.
user-invocable: true
---

Read the `README.md` file at the root of this skill, and explore the other files available:

- `colors_and_type.css` — drop-in CSS tokens: color, type, radii, spacing, shadows. Semantic h1/h2/body rules included.
- `fonts/` — Inter webfonts. (Aeonik and Heldane Display are the production typefaces — substitutions are flagged in the README. If Aeonik/Heldane files are present in the project, prefer those.)
- `assets/` — logos, product illustrations, connector marks, hero imagery.
- `preview/` — small spec cards for every token (type, color, spacing, components, brand).
- `ui_kits/website/` — marketing site recreation (dark-mode hero, feature cards, pricing, footer).
- `ui_kits/product/` — in-product dashboard (Analyze surface — KPIs + blended performance).

If creating visual artifacts (slides, mocks, throwaway prototypes), copy assets out of `assets/` and write static HTML files for the user to view. Reference `colors_and_type.css` directly — don't re-define tokens.

If working on production code, copy assets and read the brand rules in `README.md` to become an expert in designing with this brand.

If the user invokes this skill without other guidance, ask what they want to build, ask a few focused questions (audience, surface, length, variants), then act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

Core reminders while designing:
- Dark `#0D0D11` is the hero surface; never pure black.
- One Heldane Display italic word **or** one display numeral per page — never body copy.
- One gradient per asset, max. Flat 1px borders, not heavy shadows.
- Anis `#B1FFD1` carries positive deltas and category labels; use sparingly.
- Use the one-word "Polar" lockup by default. Horizontal "Polar Analytics" lockup is reserved.
