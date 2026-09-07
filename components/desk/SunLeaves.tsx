/**
 * SunLeaves — sunlight through a plant above the desk: soft palm-frond
 * shadows that drift and sway across the wood.
 *
 * Every frond is drawn procedurally into its own <svg> (a stem plus fanned,
 * tapered leaflets) from a seeded generator, so server and client render the
 * same shapes. Each one lives in its own blurred, multiply-blended layer and
 * sways with a CSS animation, so the blur is rasterised once and the motion
 * runs on the compositor. Fronds farther from the desk get a wider blur.
 * The hero renders it twice: once under the device (desk and plant) and once
 * above it, clipped to the device and shifted, so the shadows "fold" over the
 * raised body. The bright sun wash lives in WoodTable's light layer.
 */

type Vec = [number, number]

// deterministic PRNG (mulberry32)
function rng(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const f = (n: number) => n.toFixed(1)

/** A frond growing from (0,0) along +x, length L, in local units. */
function frondPaths(L: number, seed: number): string[] {
  const rand = rng(seed)
  const curve = L * (0.12 + rand() * 0.1) * (rand() < 0.5 ? -1 : 1)
  const P = (t: number): Vec => [L * t, curve * Math.pow(t, 1.6)]
  const T = (t: number): Vec => {
    const dx = L, dy = 1.6 * curve * Math.pow(Math.max(t, 1e-3), 0.6)
    const n = Math.hypot(dx, dy)
    return [dx / n, dy / n]
  }
  const paths: string[] = []

  // tapered stem
  const left: string[] = [], right: string[] = []
  for (let i = 0; i <= 24; i++) {
    const t = i / 24
    const [x, y] = P(t), [tx, ty] = T(t)
    const w = (18 * (1 - t) + 5) / 2
    left.push(`${f(x - ty * w)},${f(y + tx * w)}`)
    right.unshift(`${f(x + ty * w)},${f(y - tx * w)}`)
  }
  paths.push(`M${left.join("L")}L${right.join("L")}Z`)

  // leaflets, alternating sides, swept toward the tip
  const n = 24
  for (let i = 0; i < n; i++) {
    const t = 0.1 + 0.88 * (i / (n - 1))
    for (const s of [1, -1] as const) {
      const [bx, by] = P(t), [tx, ty] = T(t)
      const a = s * ((28 + 24 * (1 - t)) * (Math.PI / 180) + (rand() - 0.5) * 0.18)
      const dx = tx * Math.cos(a) - ty * Math.sin(a)
      const dy = tx * Math.sin(a) + ty * Math.cos(a)
      const len = L * 0.36 * Math.pow(Math.sin(Math.PI * (0.08 + 0.9 * t)), 0.7) * (0.8 + rand() * 0.35)
      const wb = 24 + rand() * 14
      const nx = -dy, ny = dx
      const p0: Vec = [bx + nx * wb / 2, by + ny * wb / 2]
      const p1: Vec = [bx - nx * wb / 2, by - ny * wb / 2]
      const tip: Vec = [bx + dx * len, by + dy * len]
      const bend = s * len * (0.04 + rand() * 0.05)
      const c: Vec = [bx + dx * len * 0.55 + nx * bend, by + dy * len * 0.55 + ny * bend]
      paths.push(`M${f(p0[0])},${f(p0[1])}Q${f(c[0])},${f(c[1])} ${f(tip[0])},${f(tip[1])}Q${f(c[0])},${f(c[1])} ${f(p1[0])},${f(p1[1])}Z`)
    }
  }
  return paths
}

type FrondSpec = {
  x: number // base position, % of desk width
  y: number // base position, % of desk height
  angle: number // degrees, 0 = pointing right, clockwise
  size: number // length as % of desk width
  blur: number // px
  opacity: number
  sway: number // degrees
  period: number // s
  delay: number // s
  seed: number
}

// Two fronds reach in from the top-left, one from the top-right, and a
// smaller one low on the left, like the reference: bases sit off-screen.
const FRONDS: FrondSpec[] = [
  { x: -6, y: -10, angle: 42, size: 58, blur: 6, opacity: 0.7, sway: 1.6, period: 9.5, delay: -2, seed: 11 },
  { x: -10, y: 22, angle: 18, size: 50, blur: 9, opacity: 0.54, sway: 1.9, period: 11, delay: -6, seed: 23 },
  { x: 108, y: -8, angle: 138, size: 56, blur: 7, opacity: 0.66, sway: 1.4, period: 10.2, delay: -4, seed: 37 },
  { x: -8, y: 78, angle: -8, size: 34, blur: 11, opacity: 0.42, sway: 2.2, period: 8.3, delay: -1, seed: 51 },
]

const L = 1000 // local frond length; the svg viewBox spans ±L around the base

/** A rectangle in px, relative to the layer's top-left. */
export type Rect = { left: number; top: number; width: number; height: number }

/**
 * `fold` draws the copy that lands on top of the cassette: clipped to its
 * outline, shifted toward the light by a fraction of the device width (the
 * raised face catches the shadow earlier), and a touch sharper because that
 * face is closer to the leaves. Rendering the layer twice this way puts a
 * visible step in every leaf edge where it meets the device, which is what
 * reads as thickness.
 */
export default function SunLeaves({ fold }: { fold?: Rect | null }) {
  if (fold === null) return null
  const style: React.CSSProperties = {}
  let shift = ""
  let sharpen = 1
  // the plain layer is pinned during route transitions (globals.css); a fold copy
  // must not reuse the name — duplicate names cancel the whole transition
  if (!fold) style.viewTransitionName = "desk-sun"
  if (fold) {
    style.clipPath = `inset(${fold.top}px calc(100% - ${fold.left + fold.width}px) calc(100% - ${fold.top + fold.height}px) ${fold.left}px)`
    style.zIndex = 20 // above the device
    shift = `translate(${-fold.width * 0.022}px, ${-fold.width * 0.028}px)`
    sharpen = 0.7
  }
  return (
    <div className="sun" style={style} aria-hidden>
      <div className="sun-shift" style={shift ? { transform: shift } : undefined}>
        {FRONDS.map((s, i) => (
          <div
            key={i}
            className="sun-frond"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: `${s.size * 2}%`,
              transform: `translate(-50%, -50%) rotate(${s.angle}deg)`,
            }}
          >
            <div
              className="sun-frond-sway"
              style={{
                filter: `blur(${(s.blur * sharpen).toFixed(1)}px)`,
                opacity: s.opacity,
                animationDuration: `${s.period}s`,
                animationDelay: `${s.delay}s`,
                ["--sway" as string]: `${s.sway}deg`,
              }}
            >
              {/* overflow visible: the stem ends exactly at the viewBox edge (x = L), so the
                  tip leaflets sweep past it — without this the tip is sliced off in a
                  straight line that rotates with the frond */}
              <svg viewBox={`${-L} ${-L} ${2 * L} ${2 * L}`} width="100%" height="100%" overflow="visible">
                {frondPaths(L, s.seed).map((d, j) => (
                  <path key={j} d={d} />
                ))}
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
