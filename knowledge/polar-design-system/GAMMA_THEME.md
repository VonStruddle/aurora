# Polar theme for Gamma — setup spec

The Gamma public API can **select** a theme (`themeId`) but cannot **create** one: it exposes only
`GET /v1.0/themes`. There is no `POST /themes`. So the Polar theme has to be built once, by hand, in
the Gamma UI. After that every generated deck is on-brand with a one-line change.

Until it exists, the closest standard theme is **`default-dark`** — it is the only dark theme in the
standard set with a geometric sans headline, an indigo-family accent, and no gradient on headlines.
Measured against the brand tokens, no standard theme carries Polar indigo `#5433FB`; the nearest
accents are `#315C98` (`blues`) and `#281C6A` (`default-dark`).

## Create it

Gamma UI → **Themes → Create new theme**. Name it `Polar` (the API matches on the returned `id`).

### Colors

In Gamma's editor a **card is a slide**, so "Couleur du fond de carte" is the surface the audience
actually sees. It takes the canvas token, not the card token. (Verified by sampling a render: setting
it to `#16161C` made every slide `#16161C`; the page background never showed.)

| Gamma field | Hex | Token |
|---|---|---|
| Couleur du fond de carte (**the slide**) | `#0D0D11` | `--anthracite-800` (never `#000`) |
| Arrière-plan de la page (behind slides) | `#08080A` | `--abyss` |
| Border / divider | `#3B3B54` | `--anthracite-400` |
| Accent (the one accent) | `#5433FB` | `--indigo-400` |
| Accent hover / deepen | `#4337FE` | `--primary-110` |
| Eyebrow / label on dark | `#776EF8` | `--indigo-300` |
| Positive delta only | `#B1FFD1` | anis |
| Negative delta only | `#F92572` | error |
| Body text on dark | `#FFFFFF` at ~85% | — |

Light surfaces, if ever needed: body `#F0F9FF`, card `#FAFBFE`, text `#303051`, border `#EAE9FF`.

### Type

Gamma takes a **heading font** and a **body font** as separate uploads. Assign different weights —
if Aeonik Bold is set for both, every paragraph renders bold. Check the exported PDF: it should embed
`Aeonik-Bold` *and* `Aeonik-Regular`. If only `Aeonik-Bold` appears, the body font is wrong.

- Heading font: **Aeonik Bold**, sentence case, `-0.02em` tracking. Fallback: Inter.
- Body font: **Aeonik Regular** 15–17px, line-height 1.55. Fallback: Inter.
- Accent: **Heldane Display Italic** — one italic word per headline, or one pull quote. Never body.
- KPI numerals: enable tabular figures (`tnum`).

```bash
python3 -c "
from pypdf import PdfReader
fs={str(r['/Font'][k].get_object().get('/BaseFont')) for p in PdfReader('deck.pdf').pages
    for r in [p['/Resources']] if '/Font' in r for k in r['/Font']}
print(sorted(fs))"
```

> Aeonik and Heldane are licensed. Confirm the license covers Gamma before uploading the OTFs
> (`knowledge/polar-design-system/fonts/`). Inter is the sanctioned open fallback.

### Surfaces

Flat. 1px borders, no drop shadows, no glow. Card radius 16–20; buttons/badges 6–12.
One gradient moment per deck, max — **never on a headline**.

## Then use it

```bash
curl -s "https://public-api.gamma.app/v1.0/themes" -H "X-API-KEY: $GAMMA_API_KEY" \
  | python3 -c "import json,sys; [print(t['id'], t['name']) for t in json.load(sys.stdin)['data'] if t['type']!='standard']"
```

Swap the returned id into the generation payload (`"themeId": "<polar-theme-id>"`).

## Two API behaviours that bite

**1. `imageOptions: {source: "noImages"}` does not stop Gamma inventing pictures.** It only stops it
pulling from an image *source*. Illustrations, infographics and diagrams are generated independently
and are not governed by `imageOptions`. Left unchecked, Gamma drew an inventory "infographic" that
invented thresholds Polar never published ("Stock below 10%. Stop operations."), and a bride-and-groom
clipart. To suppress, put this in `additionalInstructions`:

> TEXT ONLY. Do not generate, add, or invent any image, illustration, infographic, diagram, flowchart,
> chart, icon, pictogram or decorative graphic. The ONLY images permitted are the logo image URLs
> supplied in the text. Never draw a picture of the content. Never put words inside a graphic.

Verify after every generation — count raster images per page in the exported PDF. Anything beyond the
header logo is generated art. It also shows up in the bill: the same deck cost 92 credits with
generated art and 27 without.

**2. Inline image URLs override `noImages`.** Raw `https://…` URLs in `inputText` are always placed
(no markdown, no `<img>` — raw URL on its own line). Formats: jpg, png, gif, webp, svg, heic, avif.

**3. Gamma intermittently fails to fetch a header image — on a different card every run.** Not a layout
bug: across three identical generations the broken card was p4, then p9, then none. A broken-image
placeholder ships silently into the PDF. Always validate after generating, and regenerate on failure:

```python
from pypdf import PdfReader
# every card must carry both logos (card 1 carries them inline)
bad = [i for i, p in enumerate(PdfReader("deck.pdf").pages, 1) if len(p.images) < 2]
```

## Prospect logo (the co-branding lockup)

Polar logo top-left, prospect logo top-right, on every card via `cardOptions.headerFooter`; both side
by side on the title card via inline URLs. The prospect logo must be **light** — the canvas is `#0D0D11`.

Finding one is the work. For SuitShop: the site header logo was an inline `<svg>` (no URL, unusable),
the favicon was only the "S" mark, and the one asset named `logo` in their JSON-LD was **The Knot's**
press logo, not theirs. The real wordmark was `/_next/static/media/suitshop-logo.*.png` — black on
transparent, so invisible on dark. Invert it at generation time through a public image proxy:

```python
src = "suitshop.com/_next/static/media/suitshop-logo.c0a38c72.png"
url = "https://images.weserv.nl/?url=" + src.replace("/", "%2F") + "&filt=negate&w=600"
```

Gamma fetches the image once and stores it, so the proxy is not a runtime dependency of the finished
deck. Always render the logo on `#0D0D11` and *look at it* before shipping — a black-on-transparent
PNG passes every automated check and is invisible on the slide.

## Verified public asset URLs

Base: `https://cdn.prod.website-files.com/5d41ab9d8cacf54c04df67c0`

| Asset | Path |
|---|---|
| **Polar logo** (white wordmark + indigo mark, 234×84) | `/682c8fe566bb6b09ae68b3d3_Logo%20Polar%20only.png` |
| Polar logomark, square | `/68b98f6120215cbd4dd844e5_polar-logomark-sq-bg.svg` |
| The Frankie Shop | `/6825f0b5bb9768e9a6502cb2_logo-the-frankie-shop.svg` |
| Tiege Hanley | `/6825f0b65979a09ed8ec8162_logo-tiege-hanley.svg` |
| Canopy | `/6825f0b41b5e16ce1b4fda4e_logo-canopy.svg` |
| Joseph Joseph | `/6825f0b4aaba2a8df2e02435_logo-joseph-and-joseph.svg` |
| Modular Closets | `/6825f0b551abf228e52f8a69_logo-modular-closets.svg` |
| Yellow Pop | `/6825f0b63f2a590734bee03f_logo-yellowpop.svg` |
| The Feed | `/6825f0b5d225a6c213810896_logo-the-feed.svg` |

Customer logos are white-fill SVGs, built for a dark canvas. Every brand above is documented in
`polar_case_studies.md`.

### Do not use

- `…_🟣 Integrated Brand Logo.svg` — despite the name this is **Meta's logo**, a connector mark, not Polar's.
- `Maximize Profit.png` (hardcodes `$12.8M` contribution margin) and `Consolidate Reporting.png`
  (hardcodes `$100,000` / `102%`). These are marketing crops with sample figures baked in; in a
  prospect deck they read as that prospect's numbers. They are also green, not indigo.
- `Name=Increase Retention.svg` — a recycle/returns glyph, not a retention or cohort visual.
