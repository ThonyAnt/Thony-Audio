// Renders the cassette SVGs to PNG with resvg — NOT a browser.
//   node scripts/render-cassette-pngs.mjs [outDir]      (default: public/assets/cassette)
// Produces cassette-{body,glass}-{2x,4x}.png from components/cassette/*.svg.
//
// The hero's BODY raster is normally the Figma export of the frame (the source of
// truth); this script is for the GLASS overlay and for any future SVG→PNG need.
// See components/cassette/README.md for why headless Chromium must not be used.
import fs from "node:fs"
import path from "node:path"
import { Resvg } from "@resvg/resvg-js"

const root = process.cwd()
const outDir = process.argv[2] ?? path.join(root, "public", "assets", "cassette")
const read = (f) => fs.readFileSync(path.join(root, "components", "cassette", f), "utf8")

// Textures are web paths (/assets/cassette/…). Embed them as data URIs: resvg-js
// silently ignores EVERY option (fitTo included) when `resourcesDir` is set.
const embedTextures = (svg) =>
  svg.replace(/href="\/assets\/cassette\/([^"]+)"/g, (_, f) => {
    const p = path.join(root, "public", "assets", "cassette", f)
    const mime = f.endsWith(".jpg") ? "image/jpeg" : "image/png"
    return `href="data:${mime};base64,${fs.readFileSync(p).toString("base64")}"`
  })

const sources = { body: embedTextures(read("cassette-body.svg")), glass: read("cassette-glass.svg") }

for (const [tag, zoom] of [["2x", 2], ["4x", 4]]) {
  for (const [name, svg] of Object.entries(sources)) {
    const r = new Resvg(svg, {
      fitTo: { mode: "zoom", value: zoom },  // viewBox-only SVG: 'width' mode is ignored
      background: "rgba(0,0,0,0)",
      shapeRendering: 2,  // geometricPrecision
      imageRendering: 0,  // optimizeQuality
      textRendering: 2,
      logLevel: "warn",
    })
    const img = r.render()
    const png = img.asPng()
    const out = path.join(outDir, `cassette-${name}-${tag}.png`)
    fs.writeFileSync(out, png)
    console.log(path.relative(root, out), `${img.width}x${img.height}`, `${(png.length / 1024 / 1024).toFixed(2)} MB`)
  }
}
