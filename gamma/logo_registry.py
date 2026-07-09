"""Polar customer logos, tagged by vertical, for the "brands like you" slide.

Every URL below was fetched and checked: HTTP 200, white-fill (built for a dark canvas).
Every brand is one Polar publicly claims as a customer.

`evidence` records *why* we may name them:
  "case-study" -> written up in knowledge/polar_case_studies.md (strongest)
  "logo-wall"  -> displayed as a customer on polaranalytics.com

Never put an agency on a brand slide (Swanky, ROAR, Vervaunt...) - partner motion, different story.
Never call these "competitors" in deck copy. They are peer brands running on Polar.
"""

CDN = "https://cdn.prod.website-files.com/5d41ab9d8cacf54c04df67c0"

# brand -> (display name, vertical, url, evidence)
LOGOS = {
    "the-frankie-shop":  ("The Frankie Shop",  "apparel", f"{CDN}/6825f0b5bb9768e9a6502cb2_logo-the-frankie-shop.svg", "case-study"),
    "maniere-de-voir":   ("Manière de Voir",   "apparel", f"{CDN}/6825f0b5de2be899666797a6_logo-maniere-de-voir.svg",  "logo-wall"),
    "colorful-standard": ("Colorful Standard", "apparel", f"{CDN}/6825f0b44e74689fc23ec201_logo-colorful-standard.svg", "logo-wall"),
    "mud-jeans":         ("MUD Jeans",         "apparel", f"{CDN}/6825f0b5a9855cd97b385567_logo-mud-jeans.svg",         "logo-wall"),
    "doen":              ("Dôen",              "apparel", f"{CDN}/682b40e60bba6b87ceceb33f_logo-white-doen.png",        "logo-wall"),
    "negative":          ("Negative",          "apparel", f"{CDN}/68c2a14218d1c7c4a49a866f_logo-negative-white.svg",    "logo-wall"),
    "volcom":            ("Volcom",            "apparel", f"{CDN}/6825f0b688175de2cc92777b_logo-volcom.svg",            "logo-wall"),

    "allbirds":          ("Allbirds",          "footwear", f"{CDN}/6825f0b40e695993f1c11af4_logo-allbirds.svg",         "logo-wall"),

    "polene":            ("Polène",            "accessories", f"{CDN}/6825f0b5cef914c8b960824f_logo-pole%CC%80ne.svg",  "logo-wall"),
    "gorjana":           ("gorjana",           "accessories", f"{CDN}/68c2a14037218e440d07b559_logo-gorjana-white.svg", "logo-wall"),
    "fashion-eyewear":   ("Fashion Eyewear",   "accessories", f"{CDN}/6825f0b4290e132ae0b82784_logo-fashion-eyewear.svg", "logo-wall"),
    "quad-lock":         ("Quad Lock",         "accessories", f"{CDN}/6825f0b53d4d9f709e9be5db_logo-quad-lock.svg",     "logo-wall"),

    "tiege-hanley":      ("Tiege Hanley",      "beauty", f"{CDN}/6825f0b65979a09ed8ec8162_logo-tiege-hanley.svg",       "case-study"),

    "canopy":            ("Canopy",            "home", f"{CDN}/6825f0b41b5e16ce1b4fda4e_logo-canopy.svg",               "case-study"),
    "joseph-and-joseph": ("Joseph Joseph",     "home", f"{CDN}/6825f0b4aaba2a8df2e02435_logo-joseph-and-joseph.svg",    "case-study"),
    "modular-closets":   ("Modular Closets",   "home", f"{CDN}/6825f0b551abf228e52f8a69_logo-modular-closets.svg",      "case-study"),
    "yellowpop":         ("Yellow Pop",        "home", f"{CDN}/6825f0b63f2a590734bee03f_logo-yellowpop.svg",            "case-study"),
    "caba":              ("CABA Design",       "home", f"{CDN}/68c2a1402495e6e426ebdeaa_logo-caba-white.svg",           "case-study"),

    "the-feed":          ("The Feed",          "food", f"{CDN}/6825f0b5d225a6c213810896_logo-the-feed.svg",             "case-study"),
    "armra":             ("ARMRA",             "food", f"{CDN}/6825f0b67ce8440701b84409_logo-armra.svg",                "logo-wall"),
}

# Nearest-neighbour verticals, most-similar first. Used to backfill when a vertical is thin.
ADJACENT = {
    "apparel":     ["footwear", "accessories", "beauty"],
    "footwear":    ["apparel", "accessories"],
    "accessories": ["apparel", "footwear"],
    "beauty":      ["food", "apparel"],
    "home":        ["accessories", "apparel"],
    "food":        ["beauty", "home"],
}

POLAR_LOGO = f"{CDN}/682c8fe566bb6b09ae68b3d3_Logo%20Polar%20only.png"

# Only claim what the sources support. Polar names these brands as customers; it does not
# publish each one's platform, so the caption never asserts "all on Shopify".
VERTICAL_LABEL = {
    "apparel": "Apparel brands",
    "footwear": "Footwear brands",
    "accessories": "Accessories brands",
    "beauty": "Beauty and personal-care brands",
    "home": "Home and lifestyle brands",
    "food": "Food and supplement brands",
}


def select_peers(vertical, n=5, exclude=()):
    """Logos for the peer slide: same vertical first, then adjacent, case-studies ranked first.

    `exclude` drops brands already named on the proof slide, so the deck never
    repeats the same brand twice.
    """
    if vertical not in ADJACENT:
        raise ValueError(f"unknown vertical {vertical!r}; known: {sorted(ADJACENT)}")

    def bucket(v):
        rows = [(k, *LOGOS[k]) for k in LOGOS if LOGOS[k][1] == v and k not in exclude]
        # case-study proof outranks a bare logo-wall appearance
        return sorted(rows, key=lambda r: (r[4] != "case-study", r[1]))

    picked, seen = [], set()
    for v in [vertical] + ADJACENT[vertical]:
        for row in bucket(v):
            if row[0] in seen:
                continue
            picked.append(row); seen.add(row[0])
            if len(picked) >= n:
                return picked
    return picked


def peer_slide(vertical, n=5, exclude=(), eyebrow="PEERS"):
    """Return the markdown card for the peer-logo slide, or None if nothing matched."""
    peers = select_peers(vertical, n, exclude)
    if not peers:
        return None
    urls = "\n".join(p[3] for p in peers)
    names = ", ".join(p[1] for p in peers)
    label = VERTICAL_LABEL[vertical]
    return (
        f"{eyebrow}\n\n"
        f"# Brands like yours already run on Polar\n\n"
        f"{urls}\n\n"
        f"{label} running on Polar: {names}."
    ), peers
