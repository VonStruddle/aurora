import { useEffect, useMemo, useRef, useState } from 'react'
import { hierarchy, treemap, treemapSquarify } from 'd3-hierarchy'
import { api } from './api'
import type { TamByTier, TamTier } from './types'

// Treemap coordinate space; the SVG scales to its container via viewBox.
const W = 1000
const H = 520

function fmtUSD(n: number): string {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`
  return `$${Math.round(n).toLocaleString()}`
}
const fmtInt = (n: number) => n.toLocaleString()
const pct = (n: number, total: number) =>
  total ? `${((n / total) * 100).toFixed(1)}%` : '0%'

interface HoverState {
  x: number
  y: number
  tier: TamTier
}

export default function TamView() {
  const [data, setData] = useState<TamByTier | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [hover, setHover] = useState<HoverState | null>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    api
      .tamByTier()
      .then(setData)
      .catch((e) => setError((e as Error).message))
      .finally(() => setLoading(false))
  }, [])

  const leaves = useMemo(() => {
    if (!data) return []
    type Node = { children?: TamTier[]; gmv?: number }
    const root = hierarchy<Node>({ children: data.tiers })
      .sum((d) => (d as TamTier).gmv ?? 0)
      .sort((a, b) => (b.value ?? 0) - (a.value ?? 0))
    const laidOut = treemap<Node>()
      .size([W, H])
      .paddingInner(3)
      .round(true)
      .tile(treemapSquarify)(root)
    return laidOut.leaves()
  }, [data])

  const total = data?.total_gmv ?? 0

  function moveHover(tier: TamTier, e: React.MouseEvent) {
    const rect = wrapRef.current?.getBoundingClientRect()
    if (!rect) return
    setHover({ x: e.clientX - rect.left, y: e.clientY - rect.top, tier })
  }

  return (
    <section className="tam">
      <p className="sub">
        Total addressable market — annual GMV of parent brands (
        <code>domain = parent_domain</code>) in{' '}
        <code>internal.marketing.brands</code>, broken down by SOM tier. Each
        area is proportional to GMV.
      </p>

      {error && <div className="error">{error}</div>}

      {loading ? (
        <p className="muted">Loading… (Snowflake queries can take a few seconds)</p>
      ) : data ? (
        <>
          <div className="hero">
            <div className="hero-num">{fmtUSD(total)}</div>
            <div className="muted">
              total addressable GMV · {fmtInt(data.total_brands)} parent brands
            </div>
          </div>

          <div className="tree-wrap" ref={wrapRef}>
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="tree-svg"
              role="img"
              aria-label="Treemap of total GMV by SOM tier"
              onMouseLeave={() => setHover(null)}
            >
              {leaves.map((leaf) => {
                const d = leaf.data as TamTier
                const w = leaf.x1 - leaf.x0
                const h = leaf.y1 - leaf.y0
                const showLabel = w >= 128 && h >= 92
                const plateW = Math.min(150, w - 16)
                return (
                  <g
                    key={d.tier}
                    transform={`translate(${leaf.x0},${leaf.y0})`}
                    onMouseMove={(e) => moveHover(d, e)}
                    onMouseEnter={(e) => moveHover(d, e)}
                  >
                    <rect
                      className={`cell cell-${d.tier}`}
                      width={w}
                      height={h}
                      rx={4}
                    />
                    {showLabel && (
                      <g transform="translate(11,12)">
                        <rect
                          className="label-plate"
                          width={plateW}
                          height={62}
                          rx={7}
                        />
                        <text className="label-tier" x={11} y={25}>
                          {d.label}
                        </text>
                        <text className="label-gmv" x={11} y={44}>
                          {fmtUSD(d.gmv)}
                        </text>
                        <text className="label-share" x={11} y={57}>
                          {pct(d.gmv, total)} of TAM
                        </text>
                      </g>
                    )}
                  </g>
                )
              })}
            </svg>

            {hover && (
              <div
                className="tree-tip"
                style={{
                  left: Math.min(hover.x + 14, (wrapRef.current?.clientWidth ?? 0) - 180),
                  top: hover.y + 14,
                }}
              >
                <div className="tip-head">
                  <span className={`swatch sw-${hover.tier.tier}`} />
                  {hover.tier.label}
                </div>
                <div className="tip-row">
                  <span>GMV</span>
                  <b>{fmtUSD(hover.tier.gmv)}</b>
                </div>
                <div className="tip-row">
                  <span>Share</span>
                  <b>{pct(hover.tier.gmv, total)}</b>
                </div>
                <div className="tip-row">
                  <span>Brands</span>
                  <b>{fmtInt(hover.tier.brand_count)}</b>
                </div>
              </div>
            )}
          </div>

          {/* Legend + table view (identity is never color-alone). */}
          <table className="tam-table">
            <thead>
              <tr>
                <th>Tier</th>
                <th className="num">GMV</th>
                <th className="num">Share</th>
                <th className="num">Brands</th>
              </tr>
            </thead>
            <tbody>
              {data.tiers.map((t) => (
                <tr key={t.tier}>
                  <td>
                    <span className={`swatch sw-${t.tier}`} /> {t.label}
                  </td>
                  <td className="num">{fmtUSD(t.gmv)}</td>
                  <td className="num">{pct(t.gmv, total)}</td>
                  <td className="num">{fmtInt(t.brand_count)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : null}
    </section>
  )
}
