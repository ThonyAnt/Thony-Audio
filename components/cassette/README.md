# Cassette hero — rendering notes

The home hero (`CassetteHero.tsx`) shows the TA-1 v3A deck as **raster images**, not
as inline SVG. This file explains why, and how to regenerate the rasters.

## Layers

| Layer | Source | Served as |
| --- | --- | --- |
| body (the device, glass removed) | Figma frame `TA-1 v3A (metal band)` → PNG export | `public/assets/cassette/cassette-body-{2x,4x}.png` |
| live screen | `PluginUnit3D` (three.js) clipped to the phosphor face, painted `#1C1C1E` | — |
| glass (vignette, lights, window reflections) | `cassette-glass.svg` → resvg | `public/assets/cassette/cassette-glass-{2x,4x}.png` |
| PREV / NEXT | invisible `<button>`s over `Btn_Prev` / `Btn_Next` | — |

Overlay geometry is % of the Figma frame (894 × 560.25):
phosphor face `85.605, 110.87, 335.79 × 238.5, r42.4`; buttons `706.25 / 782.25, 215.12, 64 × 64`.

## Why rasters, and why NOT headless Chromium (2026-09-07)

Inline SVG looked aliased and its labels grew a white "stroke". The SVG was fine —
the Figma-side render of the same file is crisp. Diagnosed causes, in order found:

1. **Fractional display scale.** The 894px design is shown at ~680px on the desk (and
   was briefly upscaled to 1040px). Hairline seams, 5px vent slots and 0.28px
   letterpress shadows land between pixels under the browser's single-sample
   vector AA and shimmer. A supersampled raster downscaled by the browser's
   area-averaging filter does not.
2. **Chromium/Skia skips Gaussian blurs under ~0.5px.** Figma exports drop shadows as
   a hard-alpha mask (`feColorMatrix … 127 0` → binary alpha) offset and blurred by
   `stdDeviation="0.28"`. At exactly 1× the un-blurred staircase hides inside the
   edge pixel; at ANY scale above 1× — a 1.75-DPR monitor, a 2× export, CSS or
   device-scale-factor alike — it shows as a jagged white halo around every label.
   Proven by experiment: 1× headless render == Figma render; 2× via
   `--force-device-scale-factor` == halo.
3. **Two more Chromium-vs-Figma effect differences** (patched at the time, now moot):
   the transport keys' base rect carries an inset-shadow-only filter that Chromium
   paints as nothing, and Chromium over-applies the white-paper `soft-light`
   overlay — together the dark keys rendered silver.
4. A CSS `filter: drop-shadow()` on an ancestor rasterizes the whole SVG subtree and
   resamples it (softening). Ground/contact shadows must be siblings, never
   ancestor filters.

**Rule:** do not render these Figma-exported SVGs with a browser above 1×.
Use the Figma export for the body (source of truth), and **resvg** for anything
that must be rendered from the SVG (`scripts/render-cassette-pngs.mjs`) — it
resolves filters analytically at the target resolution.

## resvg vs Figma (measured 2026-09-07, 4× side by side)

resvg reproduces the labels' letterpress, knurling and grain at Figma quality with
none of Chromium's halos — but two effects still deviate from Figma's renderer:
the TA-1 tab comes out pale lavender (opacity/blend handled differently) and the
CRT recess inner shadow renders as a hard black band instead of a soft grey wall.
Hence: **body = Figma export**, resvg for the glass (blur-only filters, identical)
and for any other SVG that has no Figma render to fall back on.

## resvg-js gotchas (v2.6)

- Setting `resourcesDir` makes resvg-js silently ignore **all** other options,
  including `fitTo` — the output comes back at viewBox size. Embed external images
  as data URIs instead (the script does this for the de-embedded textures).
- `fitTo: { mode: "width" }` is ignored for a viewBox-only root; use `mode: "zoom"`.
- `fontdb` warnings about `mstmc.ttf` / default font-family are harmless: every label
  in these SVGs is outlined vectors.

## Regenerating

- Design change → re-export the Figma frame at 2× and 4× (PNG, transparent
  background) → `cassette-body-2x.png` / `cassette-body-4x.png`.
- Glass or any SVG-side change → `node scripts/build-cassette-svg.mjs` (if the raw
  export changed) then `node scripts/render-cassette-pngs.mjs`.
