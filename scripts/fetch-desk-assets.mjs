// Downloads the CC0 Poly Haven assets the desk scene uses into public/assets/desk.
// Models come as glTF (1k textures) with their .bin and textures laid out the way
// the .gltf references them. (The desk itself is CSS: components/desk/WoodTable.)
// Run: node scripts/fetch-desk-assets.mjs
import fs from "node:fs"
import path from "node:path"

const root = process.cwd()
const out = path.join(root, "public", "assets", "desk")
const API = "https://api.polyhaven.com/files/"
const RES = "1k"

const MODELS = {
  plant: "potted_plant_04",
}
const TEXTURES = {}

async function json(url) {
  const r = await fetch(url)
  if (!r.ok) throw new Error(`${r.status} ${url}`)
  return r.json()
}

async function save(url, file) {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  const r = await fetch(url)
  if (!r.ok) throw new Error(`${r.status} ${url}`)
  const buf = Buffer.from(await r.arrayBuffer())
  fs.writeFileSync(file, buf)
  console.log(`${String(buf.length).padStart(9)}  ${path.relative(root, file)}`)
  return buf.length
}

let total = 0
for (const [folder, id] of Object.entries(MODELS)) {
  const files = await json(API + id)
  const entry = files.gltf[RES].gltf
  const dir = path.join(out, folder)
  total += await save(entry.url, path.join(dir, path.basename(entry.url)))
  for (const [rel, f] of Object.entries(entry.include)) total += await save(f.url, path.join(dir, rel))
}
for (const [folder, { id, maps }] of Object.entries(TEXTURES)) {
  const files = await json(API + id)
  for (const m of maps) {
    const f = files[m][RES].jpg
    total += await save(f.url, path.join(out, folder, path.basename(f.url)))
  }
}
console.log(`total ${(total / 1e6).toFixed(1)} MB`)
