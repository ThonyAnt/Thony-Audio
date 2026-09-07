/**
 * The wooden table the cassette sits on. Straight grain stripes are warped by
 * an SVG turbulence filter into organic grain, then planks, fine noise, a
 * key light from the top-left and a vignette are layered on top.
 */
export default function WoodTable() {
  return (
    <div className="wood" aria-hidden>
      <svg className="wood-defs" width="0" height="0" focusable="false">
        <filter id="wood-warp" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.0022 0.018" numOctaves="3" seed="11" result="warp" />
          <feDisplacementMap in="SourceGraphic" in2="warp" scale="60" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <div className="wood-grain" />
      <div className="wood-planks" />
      <div className="wood-noise" />
      <div className="wood-light" />
    </div>
  )
}
