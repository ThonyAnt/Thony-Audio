import { preload } from "react-dom"
import { WOOD_GRAIN, WOOD_GRAIN_LQIP } from "./woodGrain"

/**
 * The wooden table the desk scene sits on: baked grain, then planks, fine
 * noise, a key light from the top-left and a vignette layered on top in CSS
 * (globals.css, .wood-*).
 *
 * The grain is a static image, baked by scripts/bake-wood.mjs (straight
 * stripes warped by fractal noise — what used to be a live SVG filter here).
 * Static because it has to be in the first paint: a runtime filter or bake
 * showed a flash of flat stripes before the wood arrived, and Chromium would
 * sometimes drop a filtered element's rasterisation after a tab switch and
 * leave the desk blank. The image is preloaded, and a tiny inline copy of it
 * paints underneath in the meantime, so there is never a different wood.
 */
export default function WoodTable() {
  preload(WOOD_GRAIN, { as: "image", fetchPriority: "high" })
  return (
    <div className="wood" aria-hidden>
      <div className="wood-grain" style={{ backgroundImage: `url(${WOOD_GRAIN}), url(${WOOD_GRAIN_LQIP})` }} />
      <div className="wood-planks" />
      <div className="wood-noise" />
      <div className="wood-light" />
    </div>
  )
}
