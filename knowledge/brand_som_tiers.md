# Brand SOM Tiers — The Awareness / Buying-Stage Ladder (Unaware → Selecting → Customer)

_Analysis date: 2026-07-09 · Source: `INTERNAL.MARKETING.BRANDS` (Snowflake), Aurora bot (`aurora/src/lib/snowflake/discover.ts`, `pipeline-commonalities.ts`, `marketing-panel.tsx`). Also documented in the pulse knowledge base at `pipeline_pulse_agent/knowledge/glossary/som_tiers.md`._

---

## TL;DR

A brand carries **two independent SOM dimensions** in `INTERNAL.MARKETING.BRANDS`:

1. **`SOM_CATEGORY`** = *market fit* — is this brand in our serviceable market at all: `Core`, `Peripheral`, `Irrelevant`, or NULL. **Core = $5M+ GMV AND Shopify** (Polar's ICP).
2. **`TIER`** = *awareness / buying-stage ladder* — how far along the path-to-purchase the brand is. This is the **"Unaware / Aware / … / Selecting"** ladder. **NULL = "Unaware".**

They are orthogonal: a brand can be `Core` **and** `Unaware`.

---

## The ladder (canonical order)

From Aurora's `SOM_TIER_ORDER`. Low → high = colder → hottest.

| # | Stage | `BRANDS.TIER` value | Meaning (intent × trust) |
|---|---|---|---|
| 0 | **Unaware** | `NULL` | No intent signal on record. Default state of the whole universe. |
| 1 | **Aware** | `aware` | Light awareness / early intent signal surfaced. |
| 2 | **Considering** | *(app-defined, not populated in data)* | Actively considering the category. |
| 3 | **Interested** | `interested` | Stronger intent — engaging / researching. |
| 4 | **Evaluating** | `evaluating` | In active evaluation, comparing tools. |
| 5 | **Selecting** | `selecting` | Late stage — choosing a vendor. Hottest pre-customer rung. |
| 6 | **Customer** | *(app-defined; lives in accounts/REV_OPS, not BRANDS)* | Won. |

> **Populated in the data:** only `aware`, `interested`, `evaluating`, `selecting` (+ `NULL` = Unaware). **`Considering` and `Customer` are defined in Aurora's UI enum but are not present in `BRANDS.TIER`** — Considering is unused; Customer is tracked in the accounts / revenue layer (see `customer` knowledge / `REV_OPS`).

---

## Real distribution (parent brands, `LOWER(DOMAIN)=LOWER(PARENT_DOMAIN)`, 2026-07-09)

### TIER ladder

| TIER | Parent brands |
|---|---:|
| Unaware (NULL) | 14,931,674 |
| aware | 5,398 |
| interested | 3,686 |
| selecting | 1,050 |
| evaluating | 517 |

Tiered (non-null) total ≈ **10,650 brands** out of ~15M. The ladder is **not monotonic** — `selecting` (1,050) > `evaluating` (517). Tiers are signal-assigned, not a strict funnel, so higher rungs aren't always smaller.

### SOM_CATEGORY (for context)

| SOM_CATEGORY | Parent brands |
|---|---:|
| NULL | ~14,517,703 |
| Peripheral | 270,480 |
| Core | 153,779 |
| Irrelevant | 363 |

### TIER × SOM_CATEGORY — where the tiered brands sit

| SOM_CATEGORY | Unaware | aware | interested | evaluating | selecting |
|---|---:|---:|---:|---:|---:|
| **Core** | 146,646 | 3,649 | 2,368 | 323 | 793 |
| **Peripheral** | 269,577 | 379 | 391 | 30 | 103 |
| NULL | 14,515,090 | 1,369 | 926 | 164 | 154 |
| Irrelevant | 361 | 1 | 1 | — | — |

**The tier ladder is densest inside Core** — our ICP brands are the ones with intent signals attached, which is the point. Late-stage ICP demand ≈ **Core `evaluating` (323) + `selecting` (793) = ~1,116 hot brands** to prioritize.

---

## Source & how it's set

- `TIER` is **assigned upstream** (intent-signal / SOM categorization pipeline), **not computed in dbt**. In `models/analytics/marketing/brands.sql` (lines 197-200) it is `coalesce(domain_id_signals.tier, domain_signals.tier, linkedin_signals.tier)` — first non-null across the per-domain, per-domain-id, and LinkedIn signal sources.
- Like `SOM_CATEGORY`, the underlying categorization play (`brands_som`) has been frozen at times (see the Core stopgap in `int_brands_enriched.sql`), so treat absolute tier counts as approximate / lagging.

---

## Query patterns

```sql
-- Ladder distribution over ICP brands (NULL = Unaware)
select coalesce(tier,'Unaware') as tier, count(distinct parent_domain) as brands
from internal.marketing.brands
where lower(domain)=lower(parent_domain) and som_category='Core'
group by 1 order by 2 desc;

-- "Hot" ICP brands to prioritise (late-stage, still not customers)
select company_name, parent_domain, tier, marketing_annual_gmv
from internal.marketing.brands
where lower(domain)=lower(parent_domain)
  and som_category='Core' and lower(tier) in ('evaluating','selecting')
  and (is_active = true or is_active is null)
order by marketing_annual_gmv desc nulls last;
```

**Gotchas:** Unaware = `TIER IS NULL` (when filtering to only Unaware, drop the `SOM_CATEGORY` predicate — unaware rows usually have no category). `IS_ACTIVE` is sparsely populated — treat NULL as active (`IS_ACTIVE = TRUE OR IS_ACTIVE IS NULL`); only explicit FALSE excludes. Brand grain = `parent_domain`.

---

## Don't confuse with

- **`SOM_CATEGORY`** (Core / Peripheral / Irrelevant) = market fit, not stage.
- **The openness ladder A–F** = ranks *outreach motions* (referral/inbound → cold), a different axis entirely.
- **In-market buckets** (growing_fast, evaluating_a_competitor, moved_to_shopify_plus, getting_mature_on_ads, churning_from_a_competitor) = the Storeleads brand-state signals that drive Instantly outbound — the raw signals that *feed* intent; `TIER` is the rolled-up stage.
