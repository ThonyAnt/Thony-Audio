// Turns the raw Figma export of "TA-1 v3A (metal band)" into the two inline
// layers the landing page uses:
//   components/cassette/cassette-body.svg  - the whole device, glass removed
//   components/cassette/cassette-glass.svg - the CRT glass (vignette, lights,
//                                            reflections) drawn over the screen
// Embedded textures are swapped for the files in public/assets/cassette.
// Run: node scripts/build-cassette-svg.mjs
import fs from "node:fs"
import path from "node:path"

const root = process.cwd()
const src = path.join(root, "design-refs", "ta1-v3a-export.svg")
const outDir = path.join(root, "components", "cassette")
const texDir = path.join(root, "public", "assets", "cassette")

let svg = fs.readFileSync(src, "utf8")

// 1. page background + fixed size go; CSS sizes the inline svg
svg = svg.replace(/<rect width="894" height="561" fill="#F5F5F5"\/>\s*/, "")
svg = svg.replace(/^<svg width="894" height="561"/, "<svg")

// 2. de-embed textures, matching bytes against the committed files
const textures = ["white-paper-texture.jpg", "board-grain-noise.png", "board-mottle.png"].map((f) => ({
  f,
  bytes: fs.readFileSync(path.join(texDir, f)),
}))
let swapped = 0
svg = svg.replace(/xlink:href="data:image\/\w+;base64,([^"]+)"/g, (_, b64) => {
  const buf = Buffer.from(b64, "base64")
  const hit = textures.find((t) => t.bytes.equals(buf))
  if (!hit) throw new Error("embedded image does not match any committed texture")
  swapped++
  return `href="/assets/cassette/${hit.f}"`
})
if (swapped !== 3) throw new Error(`expected 3 textures, swapped ${swapped}`)

// 3. lift the glass out of the tube
const vi = svg.indexOf('<rect id="vignette"')
const di = svg.indexOf('<g id="deck controls">')
if (vi < 0 || di < 0) throw new Error("tube markers not found")
let chunk = svg.slice(vi, di)
const closers = /(\s*<\/g>){3}\s*$/ // masked group, tube, CRT screen
if (!closers.test(chunk)) throw new Error("unexpected tube closing structure")
chunk = chunk.replace(closers, "\n")
const body = svg.slice(0, vi) + "</g>\n</g>\n</g>\n" + svg.slice(di)

// 4. self-contained glass overlay: same viewBox, only the defs it needs
const tubeAt = svg.indexOf('<g id="tube">')
const maskEl = svg.slice(tubeAt).match(/<mask id="([^"]+)"[\s\S]*?<\/mask>/)
if (!maskEl) throw new Error("tube mask not found")
const defsAll = svg.slice(svg.indexOf("<defs>") + 6, svg.indexOf("</defs>"))
const refsIn = (s) => [
  ...[...s.matchAll(/url\(#([^)]+)\)/g)].map((m) => m[1]),
  ...[...s.matchAll(/href="#([^"]+)"/g)].map((m) => m[1]),
]
const escapeRe = (s) => s.replace(/[^\w-]/g, (c) => "\\" + c)
const need = new Set(refsIn(chunk))
const picked = new Map()
for (const id of need) {
  if (picked.has(id)) continue
  const m = defsAll.match(new RegExp(`<(\\w+) id="${escapeRe(id)}"[\\s\\S]*?<\\/\\1>`))
  if (!m) throw new Error("def not found: " + id)
  picked.set(id, m[0])
  for (const r of refsIn(m[0])) need.add(r)
}
let glass =
  `<svg viewBox="0 0 894 561" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n` +
  `<g mask="url(#${maskEl[1]})">\n${chunk}</g>\n<defs>\n${maskEl[0]}\n${[...picked.values()].join("\n")}\n</defs>\n</svg>\n`
// suffix every id so the overlay never collides with the body's defs
glass = glass
  .replace(/id="([^"]+)"/g, 'id="$1-ov"')
  .replace(/url\(#([^)]+)\)/g, "url(#$1-ov)")
  .replace(/href="#([^"]+)"/g, 'href="#$1-ov"')

fs.writeFileSync(path.join(outDir, "cassette-body.svg"), body)
fs.writeFileSync(path.join(outDir, "cassette-glass.svg"), glass)
console.log("body", body.length, "bytes; glass", glass.length, "bytes; defs picked", picked.size)
