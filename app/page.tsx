import fs from "node:fs"
import path from "node:path"
import CassetteHero from "@/components/cassette/CassetteHero"

// The cassette SVGs are inlined (not <img>'d) because SVG-in-img cannot load
// its external texture files (/assets/cassette/*). Read at build time — this
// is a server component, so the strings are baked into the static export.
export default function Home() {
  const dir = path.join(process.cwd(), "components", "cassette")
  // Browsers drop the PREV/NEXT black base rects (their inset-shadow-only filter
  // yields no paint), so the 64% grey key reads light against the chassis. Solidify
  // the key fill to the intended dark — patched here so the generated SVG stays pristine.
  const bodySvg = fs
    .readFileSync(path.join(dir, "cassette-body.svg"), "utf8")
    .replaceAll('fill="#2A2A2C" fill-opacity="0.64"', 'fill="#232326" fill-opacity="1"')
    // …and browsers apply the white-paper soft-light far stronger than Figma,
    // washing the dark keys to grey — drop the texture on the two transport keys
    .replaceAll('<g id="white-paper-texture_3" style="mix-blend-mode:soft-light">', '<g id="white-paper-texture_3" style="display:none">')
    .replaceAll('<g id="white-paper-texture_4" style="mix-blend-mode:soft-light">', '<g id="white-paper-texture_4" style="display:none">')
  const glassSvg = fs.readFileSync(path.join(dir, "cassette-glass.svg"), "utf8")
  return <CassetteHero bodySvg={bodySvg} glassSvg={glassSvg} />
}
