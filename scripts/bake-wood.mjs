/**
 * Bakes the desk's wood grain to a static image, so the wood is in the very
 * first paint of the landing page — no runtime filter, no JS, nothing to
 * flash in before it.
 *
 *   node scripts/bake-wood.mjs
 *
 * Writes public/assets/desk/wood-grain.webp (the grain, shown with
 * background-size: cover) and components/desk/woodGrain.ts (its URL plus a
 * tiny inline placeholder that paints while the real one loads).
 *
 * The look is the old CSS + SVG filter reproduced exactly: straight grain
 * stripes (two repeating gradients, the second overlaid at 179.3deg), warped
 * by fractal Perlin noise (baseFrequency 0.0022 × 0.018, 3 octaves, seed 11)
 * displacing 60px on the red (x) and green (y) channels.
 */
import sharp from "sharp"
import { mkdir, writeFile } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const OUT = "public/assets/desk/wood-grain.webp"
const TS = "components/desk/woodGrain.ts"
// image size, CSS px of desk: covers a 1920-wide desk at 1:1 (the layer is 116% of the viewport)
const W = 2240, H = 1400

// the two repeating gradients: [px, r, g, b, a]
const GRAIN = [
  [0, 0xbb, 0x83, 0x52, 1], [3, 0xcc, 0x95, 0x5f, 1], [5, 0xad, 0x74, 0x43, 1], [9, 0xd2, 0x9c, 0x65, 1],
  [12, 0xa0, 0x6a, 0x3b, 1], [14, 0xc6, 0x8d, 0x58, 1], [19, 0xb8, 0x7f, 0x4d, 1], [23, 0xd1, 0x9c, 0x66, 1],
  [27, 0xa3, 0x6e, 0x3f, 1],
]
const GRAIN_PERIOD = 27
const BANDS = [
  [0, 255, 228, 190, 0.16], [11, 255, 228, 190, 0], [19, 70, 38, 12, 0.26],
  [31, 70, 38, 12, 0], [40, 255, 228, 190, 0.12], [53, 255, 228, 190, 0],
]
const BANDS_PERIOD = 53
const BANDS_DX = Math.sin((179.3 * Math.PI) / 180), BANDS_DY = -Math.cos((179.3 * Math.PI) / 180)

const FREQ_X = 0.0022, FREQ_Y = 0.018, OCTAVES = 3, SEED = 11, WARP = 60

const LUT_RES = 4
function lut(stops, period) {
  const n = period * LUT_RES
  const out = new Float32Array(n * 4)
  for (let i = 0; i < n; i++) {
    const t = i / LUT_RES
    let k = 0
    while (k < stops.length - 2 && t >= stops[k + 1][0]) k++
    const a = stops[k], b = stops[k + 1]
    const u = b[0] === a[0] ? 0 : (t - a[0]) / (b[0] - a[0])
    const aa = a[4] + (b[4] - a[4]) * u
    for (let c = 0; c < 3; c++) {
      const pa = a[c + 1] * a[4], pb = b[c + 1] * b[4]
      const p = pa + (pb - pa) * u
      out[i * 4 + c] = aa > 0 ? p / aa : 0
    }
    out[i * 4 + 3] = aa
  }
  return out
}

function perlin(seed) {
  let s = seed >>> 0
  const rnd = () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  const N = 256
  const perm = new Uint8Array(N * 2)
  for (let i = 0; i < N; i++) perm[i] = i
  for (let i = N - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); const t = perm[i]; perm[i] = perm[j]; perm[j] = t }
  for (let i = 0; i < N; i++) perm[i + N] = perm[i]
  const gx = new Float32Array(N), gy = new Float32Array(N)
  for (let i = 0; i < N; i++) { const a = rnd() * Math.PI * 2; gx[i] = Math.cos(a); gy[i] = Math.sin(a) }
  const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10)
  const noise = (x, y) => {
    const X = Math.floor(x), Y = Math.floor(y)
    const fx = x - X, fy = y - Y
    const xi = X & 255, yi = Y & 255
    const g00 = perm[perm[xi] + yi], g10 = perm[perm[xi + 1] + yi]
    const g01 = perm[perm[xi] + yi + 1], g11 = perm[perm[xi + 1] + yi + 1]
    const n00 = gx[g00] * fx + gy[g00] * fy
    const n10 = gx[g10] * (fx - 1) + gy[g10] * fy
    const n01 = gx[g01] * fx + gy[g01] * (fy - 1)
    const n11 = gx[g11] * (fx - 1) + gy[g11] * (fy - 1)
    const u = fade(fx), v = fade(fy)
    const a = n00 + (n10 - n00) * u, b = n01 + (n11 - n01) * u
    return a + (b - a) * v
  }
  return (x, y) => {
    let sum = 0, amp = 1, fx = FREQ_X, fy = FREQ_Y
    for (let o = 0; o < OCTAVES; o++) {
      sum += noise(x * fx, y * fy) * amp
      amp *= 0.5; fx *= 2; fy *= 2
    }
    return Math.min(1, Math.max(0, (sum + 1) / 2))
  }
}

function bake() {
  const STEP = 2
  const FW = Math.ceil(W / STEP) + 1, FH = Math.ceil(H / STEP) + 1
  const dxF = new Float32Array(FW * FH), dyF = new Float32Array(FW * FH)
  const nx = perlin(SEED), ny = perlin(SEED + 1)
  for (let j = 0; j < FH; j++) for (let i = 0; i < FW; i++) {
    dxF[j * FW + i] = WARP * (nx(i * STEP, j * STEP) - 0.5)
    dyF[j * FW + i] = WARP * (ny(i * STEP, j * STEP) - 0.5)
  }
  const grain = lut(GRAIN, GRAIN_PERIOD), bands = lut(BANDS, BANDS_PERIOD)
  const gn = GRAIN_PERIOD * LUT_RES, bn = BANDS_PERIOD * LUT_RES
  const d = new Uint8Array(W * H * 4)
  const overlay = (b, s) => (b <= 0.5 ? 2 * b * s : 1 - 2 * (1 - b) * (1 - s))
  let p = 0
  for (let j = 0; j < H; j++) {
    const fj = j / STEP, j0 = Math.floor(fj), tj = fj - j0, j1 = Math.min(FH - 1, j0 + 1)
    for (let i = 0; i < W; i++) {
      const fi = i / STEP, i0 = Math.floor(fi), ti = fi - i0, i1 = Math.min(FW - 1, i0 + 1)
      const a = j0 * FW + i0, b = j0 * FW + i1, c = j1 * FW + i0, e = j1 * FW + i1
      const dx = (dxF[a] + (dxF[b] - dxF[a]) * ti) * (1 - tj) + (dxF[c] + (dxF[e] - dxF[c]) * ti) * tj
      const dy = (dyF[a] + (dyF[b] - dyF[a]) * ti) * (1 - tj) + (dyF[c] + (dyF[e] - dyF[c]) * ti) * tj
      const X = i + dx, Y = j + dy
      const g = ((Y % GRAIN_PERIOD) + GRAIN_PERIOD) % GRAIN_PERIOD * LUT_RES
      let gi = Math.floor(g); if (gi >= gn) gi = gn - 1
      const tb = BANDS_DX * X + BANDS_DY * Y
      const bq = ((tb % BANDS_PERIOD) + BANDS_PERIOD) % BANDS_PERIOD * LUT_RES
      let bi = Math.floor(bq); if (bi >= bn) bi = bn - 1
      const ba = bands[bi * 4 + 3]
      for (let ch = 0; ch < 3; ch++) {
        const base = grain[gi * 4 + ch] / 255
        const src = bands[bi * 4 + ch] / 255
        d[p + ch] = (base * (1 - ba) + overlay(base, src) * ba) * 255
      }
      d[p + 3] = 255
      p += 4
    }
  }
  return d
}

const t0 = Date.now()
const rgba = bake()
const img = sharp(Buffer.from(rgba.buffer), { raw: { width: W, height: H, channels: 4 } })
await mkdir(resolve(root, dirname(OUT)), { recursive: true })
const full = await img.clone().webp({ quality: 78 }).toBuffer()
await writeFile(resolve(root, OUT), full)
// the placeholder: a few dozen pixels, blurred by the upscale, ~half a kilobyte inline
const tiny = await img.clone().resize(48, 30, { kernel: "lanczos3" }).webp({ quality: 55 }).toBuffer()
const ts = `// generated by scripts/bake-wood.mjs — do not edit
/** the baked wood grain (public/) */
export const WOOD_GRAIN = "/${OUT.replace(/^public\//, "")}"
/** a ${48}×${30} version to paint while WOOD_GRAIN loads */
export const WOOD_GRAIN_LQIP = "data:image/webp;base64,${tiny.toString("base64")}"
`
await writeFile(resolve(root, TS), ts)
console.log(`${OUT}: ${W}×${H}, ${(full.length / 1024).toFixed(0)} KB; placeholder ${tiny.length} B; ${Date.now() - t0} ms`)
