# Outreach Sequences by Persona — Schematic Plan (v0)

_Date: 2026-07-09 · Builds on `polar_usecases_by_persona.md`, `personas_chased_vs_closed.md`, `brand_som_tiers.md`, and the 35 live case studies at [polaranalytics.com/case-studies](https://www.polaranalytics.com/case-studies). Status: schematic only — copy, triggers and tooling to be specced next._

---

## 1. The four assets and their role in a sequence

| Asset                                      | Role                                                                         | Cost to produce             | When it's built                                        |
| ------------------------------------------ | ---------------------------------------------------------------------------- | --------------------------- | ------------------------------------------------------ |
| **E — Custom cold email**                  | Hook + carrier of the other assets                                           | Low (generated per contact) | Always, upfront                                        |
| **LP — Custom landing page**               | Destination: a "{Brand} × Polar" page showing _their_ persona use case       | Medium                      | Upfront for hot tiers; templated-per-persona otherwise |
| **G — Gamma presentation (on Polar data)** | Proof that travels: a mini-audit / briefing the champion forwards internally | High                        | Upfront for hot tiers; engagement-triggered otherwise  |
| **V — Gradium voice message**              | Human touch / pattern-break: ~30s voice note in the rep's voice              | Low–medium                  | Mid-sequence, or triggered by LP visit                 |

**Principle:** email carries, the landing page demonstrates, the Gamma deck proves and travels internally, voice humanizes. Escalate asset cost with engagement, not hope.

---

## 2. Universal sequence skeleton (5 touches / ~2 weeks)

```
Day 0    E1  Hook email — persona pain × brand-specific signal (no link, reply-optimized)
Day 2    E2  Email → custom landing page ("built a page for {Brand}")
Day 5    V   Gradium voice note (LinkedIn DM or email audio) — references the LP
Day 8    E3  Email → Gamma deck ("we ran this briefing for {Brand}")
Day 12   E4  Breakup — recap the 3 assets, single CTA
```

**Escalation triggers (override the calendar):**

- LP visited → send V the next day (pull it forward)
- Deck opened ≥2× or forwarded → rep takes over manually (call / LinkedIn)
- Any reply → sequence stops, human owns it
- No engagement after E4 → recycle to nurture, retry next quarter with a different use-case angle

**Hot-tier variant (Core + `evaluating`/`selecting`):** lead with the deck — G at touch 2, LP at touch 3, compressed to ~8 days. They're already comparing vendors; give the decision-support asset first.

---

## 3. Persona × asset matrix (the core)

| Persona                        | E1 hook (pain)                                                    | LP shows                                                                         | Gamma deck                                                                                                         | V voice angle                                                      | CTA                                                        |
| ------------------------------ | ----------------------------------------------------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------ | ---------------------------------------------------------- |
| **Founder** _(#1 closer)_      | "Your money is leaking and your tools may be lying to you"        | One source of truth for {Brand}: Ask Polar demo + morning-brief mockup           | **"{Brand} Profit Leak Audit"** — blended MER/CAC/payback, what a CFO agent would flag day 1                       | Founder-to-founder, one sharp observation about their brand        | "15 min — I'll show you the one chart you can't see today" |
| **Marketing** _(#2)_           | "Are your numbers defensible when the CEO pushes back?"           | First-party attribution + Causal Lift explainer, framed on {Brand}'s channel mix | **"{Brand} Incrementality Briefing"** — what's working vs. would-have-happened-anyway + AI Media Buyer reco mockup | Peer tone: name their channel mix, tease the briefing              | "Forward the deck to your CEO — then let's talk"           |
| **Ecom** _(#3)_                | "What moved yesterday, and why?"                                  | Operational cockpit: daily movement, SKU/bought-together on their catalog        | **"{Brand} Merch & Ops Cockpit"** — promo impact, bundles, inventory alert mockup                                  | Tempo angle: "how long does 'what changed' take you today?"        | "20 min working session on your daily read"                |
| **Finance** _(multi-thread)_   | "Quantify payback, not vanity revenue"                            | Finance-grade view: contribution margin, LTV:CAC, payback                        | **"CFO view of {Brand}"** — payback/margin one-pager + CFO-agent task list                                         | Numbers-first, no hype; mention "AI can't hallucinate the metrics" | "I'll send the margin math — poke holes in it"             |
| **Retention** _(multi-thread)_ | "You're missing flow revenue Klaviyo never sees (up to 70% lift)" | Cohort curves + LTV by product + Klaviyo Audiences explainer                     | **"{Brand} Retention Deep-Dive"** — repeat-purchase gap + AI Email Marketer mockup                                 | LTV/cohort angle, one repeat-rate question                         | "Want the cohort table for your top SKU?"                  |
| **Data lead** _(deal support)_ | "One audited source of truth, no engineering tax"                 | Semantic layer + Polar MCP technical page (architecture, roles/permissions)      | **"Architecture briefing"** — warehouse/semantic-layer/MCP diagram, governance story                               | Skip or keep strictly technical — this persona prefers text        | "30 min technical walkthrough, bring objections"           |

**Signal → angle modifiers** (swap the lead use case when an in-market signal says so):

| Signal (Storeleads buckets)                              | Override                                                            | Proof to cite                                                                           |
| -------------------------------------------------------- | ------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `evaluating_a_competitor` / `churning_from_a_competitor` | Lead with attribution-distrust / "tools lying" angle, comparison LP | **CABA vs. Triple Whale** (recovered valid first touches on 100% of disputed orders)    |
| `getting_mature_on_ads`                                  | Lead with Causal Lift + AI Media Buyer                              | **Joseph Joseph** (de-risked Meta reach) or **CABA** (+50% Google Ads w/ ROI certainty) |
| `moved_to_shopify_plus`                                  | Lead with "brands graduate to Polar" line                           | **Swanky** (scales enterprise Shopify Plus brands)                                      |
| `growing_fast`                                           | Lead with founder profit-legibility / consolidation                 | **Tiege Hanley** (replaced $300K in-house stack)                                        |

---

## 4. Proof layer — case studies in every touch

_Source: [polaranalytics.com/case-studies](https://www.polaranalytics.com/case-studies) (35 live studies, pulled 2026-07-09) — **full extracted detail per client (metrics, quotes, named voices, citation rules) lives in `polar_case_studies.md`**. The one asset we don't have to build — every touch carries **exactly one**, matched use-case-first, then vertical, then size/region._

**Where proof appears in the skeleton:**

| Touch  | How proof is used                                                                                   |
| ------ | --------------------------------------------------------------------------------------------------- |
| **E1** | One-line metric proof matched to the pain (e.g. "CABA scaled Google Ads 50% with certainty of ROI") |
| **LP** | 2–3 logos + one embedded case tile for the persona's use case                                       |
| **G**  | One "brands like you" slide — closest-match study, same vertical if possible                        |
| **V**  | Name-drop a single brand, no numbers ("what we built with Jones Road")                              |
| **E4** | A _different_ study than E1 — fresh proof, never a repeat                                           |

**Persona → best-fit studies:**

| Persona                              | Lead case studies (metric)                                                                                                                                                                                                                          |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Founder**                          | Tiege Hanley (replaced a $300K in-house data stack) · Jones Road Beauty (AI-native on a warehouse they own) · Homefield (monthly spreadsheets → daily automated reporting)                                                                          |
| **Marketing** — incrementality angle | CABA (+50% Google Ads with ROI certainty) · Konges Sløjd (challenged Meta attribution bias) · Joseph Joseph (de-risked Meta reach) · WillPowders / The Feed (brand-search truth)                                                                    |
| **Marketing** — tracking/CAPI angle  | ELEAT Cereal (−53% Meta cost per purchase, 2× ROAS) · Sage and Paige (+41% Meta ROAS) · Safe & Vault Store (+34% Meta conversion events) · The Frankie Shop (+30% ad return)                                                                        |
| **Ecom**                             | Schleich (global DTC reporting across 11 countries) · Merci Handy (21 data sources in one place) · COES UK (5 retail stores + Shopify) · Canopy (432 hours of manual work saved/year)                                                               |
| **Finance**                          | Tiege Hanley ($300K build-vs-buy) · Aetrex (−63% reporting time) · CABA (the "certainty of ROI" language is finance-native)                                                                                                                         |
| **Retention**                        | Maui Nui Venison (drop-off agent became their #1 Klaviyo flow) · L.A. fashion brand (+10% revenue/subscriber, 60× ROI on AI Email Marketer) · Modular Closets (+54% browse-abandonment revenue) · fashion brand (37% missed flow revenue uncovered) |
| **Data lead**                        | Jones Road Beauty (data ownership + AI-native) · Tiege Hanley (the build-vs-buy story told by someone who built) · Aetrex (custom analytics + data enrichment)                                                                                      |
| **(Agency)**                         | Swanky (−50% reporting time) · ROAR (95% attribution accuracy, +35% client revenue) · The Email Experience (30+ client accounts) · Inspiir (+50% agency revenue) · Razor Group (70+ brand portfolio, 42 stores) — reserved for the partner motion              |

**Vertical upgrade rule:** a same-vertical story beats a bigger metric — beauty → Jones Road / Merci Handy; food & supplements → Maui Nui / ELEAT / The Feed / 13Seeds; fashion → The Frankie Shop / Sage and Paige / RSVP; home & durable → Modular Closets / Joseph Joseph / Yellow Pop / Safe & Vault; EU / global multi-market → Schleich / Konges Sløjd / Merci Handy.

---

## 5. Asset intensity by SOM tier (who gets the expensive treatment)

| Tier (Core only)           |        Volume | Sequence intensity                                                                                       |
| -------------------------- | ------------: | -------------------------------------------------------------------------------------------------------- |
| `selecting` + `evaluating` | ~1,100 brands | **Full custom**: all 4 assets built upfront, deck-first variant, rep watches engagement daily            |
| `interested` + `aware`     | ~6,000 brands | **Standard**: custom E, persona-templated LP with brand merge fields; G and V only on engagement trigger |
| Unaware (NULL tier)        |  ~147K brands | **Light**: email-only 3-touch (E1/E2/E4), generic persona LP; any engagement promotes them to Standard   |

---

## 6. Build order & multi-threading

1. **Build Founder, Marketing, Ecom sequences first** — that's who actually closes (460 / 373 / 288 won contacts). Finance (39) and Retention (29) almost never sign as the deal contact.
2. **Use Finance & Retention sequences as multi-threading plays** into _open opportunities_ (add the CFO once a founder engages), not as standalone cold motions.
3. **Data lead** is a deal-support sequence: deploy when a technical evaluator appears in an active deal, or as the objection-handler for "we don't trust AI on our numbers."
4. Agency/partner outreach is a separate motion (portfolio pitch, partner narratives) — out of scope for v0.

---

## 7. Guardrails (from the call library)

- Lead with the **specific lever** the persona/signal proves they care about — never the "all-in-one data stack" homepage line cold.
- **"The AI can't hallucinate — it's grounded on the semantic layer"** lands with Finance, Data, and skeptical Marketing. Use it there, not everywhere.
- Agents are **custom-trained per brand with task lists** — say so, it's a differentiator.
- Stay honest on roadmap: AI Media Buyer **recommends** today; auto-reallocation is coming. Don't let a deck overpromise.

---

## Next steps (not in this doc)

- Copy blocks per persona × touch (E1–E4, V script, LP wireframe, G outline)
- Trigger/automation spec (Instantly + LP analytics + deck-open tracking → rep tasks)
- Asset production pipeline: what's generated vs. hand-built per tier
- Keep the case-study map fresh — recheck [polaranalytics.com/case-studies](https://www.polaranalytics.com/case-studies) monthly for new proof (metrics get updated, new verticals appear)
