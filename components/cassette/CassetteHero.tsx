"use client"

import { useCallback, useRef, useState } from "react"
import dynamic from "next/dynamic"

// three.js screen content — client-only, code-split
const PluginUnit3D = dynamic(() => import("@/components/PluginUnit3D"), { ssr: false })

/**
 * CassetteHero — the TA-1 v3A cassette deck (Figma → figma/ta1-cassette branch)
 * as the home hero, used 1:1:
 *   layer 1  components/cassette/cassette-body.svg   — the device, glass removed
 *   layer 2  live screen content in the CRT phosphor  — rotating 3D plugin units
 *   layer 3  components/cassette/cassette-glass.svg  — vignette/lights/reflections
 *   layer 4  invisible hit areas over Btn_Prev / Btn_Next — the ONLY pressable
 *            controls (knobs, presets, power are decorative for now)
 *
 * All overlay geometry is % of the 894×561 viewBox, measured from the SVG:
 *   phosphor face  85.605,110.87  335.79×238.5  r42.4
 *   Btn_Prev       706.25,215.12  64×64 · Btn_Next 782.25,215.12  64×64
 */

const UNITS = [
  {
    slug: "chorale", name: "chorale", price: "$39", tag: "per-note convolution reverb",
    texture: "/assets/products/chorale/chorale-3d-bake.png", w: 1562, h: 1680, raised: true,
  },
  {
    slug: "resonator", name: "resonator", price: "free", tag: "7-voice harmonic resonator",
    texture: "/assets/products/resonator/Resonator.png", w: 4396, h: 3040, raised: false,
  },
]

export default function CassetteHero({ bodySvg, glassSvg }: { bodySvg: string; glassSvg: string }) {
  const [index, setIndex] = useState(0)
  const [blink, setBlink] = useState(false)
  const busy = useRef(false)

  // CRT channel-change: squeeze to a line, swap the unit, snap back
  const paginate = useCallback((d: number) => {
    if (busy.current) return
    busy.current = true
    setBlink(true)
    setTimeout(() => setIndex((i) => (i + d + UNITS.length) % UNITS.length), 140)
    setTimeout(() => { setBlink(false); busy.current = false }, 300)
  }, [])

  const u = UNITS[index]

  return (
    <section
      className="min-h-dvh flex flex-col items-center justify-center px-4 py-16"
      style={{ background: "linear-gradient(90deg,#fff,#f5f1ee 60.5%)" }} // EP-133 page ground
    >
      <div
        className="relative w-full max-w-[1040px]"
        style={{ aspectRatio: "894/561", filter: "drop-shadow(0 34px 44px rgba(43,45,66,.16))" }}
      >
        {/* the device */}
        <div
          className="absolute inset-0 [&>svg]:block [&>svg]:w-full [&>svg]:h-full"
          dangerouslySetInnerHTML={{ __html: bodySvg }}
        />

        {/* live CRT content, clipped to the phosphor face */}
        <div
          className="absolute overflow-hidden"
          style={{ left: "9.575%", top: "19.763%", width: "37.56%", height: "42.513%", borderRadius: "12.6% / 17.8%" }}
        >
          <div
            className="absolute inset-[3%] origin-center transition-[opacity,transform] duration-150 ease-in"
            style={blink ? { opacity: 0, transform: "scaleY(0.03)" } : { opacity: 1, transform: "scaleY(1)" }}
          >
            <PluginUnit3D key={u.slug} texture={u.texture} designW={u.w} designH={u.h} raised={u.raised} />
          </div>
          {/* faint scanlines keep it a CRT, not a browser div */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "repeating-linear-gradient(0deg, rgba(255,255,255,.025) 0 1px, transparent 1px 3px)" }}
          />
        </div>

        {/* the glass, back on top */}
        <div
          className="absolute inset-0 pointer-events-none [&>svg]:block [&>svg]:w-full [&>svg]:h-full"
          dangerouslySetInnerHTML={{ __html: glassSvg }}
        />

        {/* PREV / NEXT — the only pressable controls */}
        <button
          type="button" aria-label="previous plugin" onClick={() => paginate(-1)}
          className="absolute cursor-pointer group"
          style={{ left: "79.0%", top: "38.35%", width: "7.16%", height: "11.41%" }}
        >
          <span className="absolute inset-[3.5%] rounded-[14%] bg-black/0 group-active:bg-black/30 transition-colors duration-75" />
        </button>
        <button
          type="button" aria-label="next plugin" onClick={() => paginate(1)}
          className="absolute cursor-pointer group"
          style={{ left: "87.5%", top: "38.35%", width: "7.16%", height: "11.41%" }}
        >
          <span className="absolute inset-[3.5%] rounded-[14%] bg-black/0 group-active:bg-black/30 transition-colors duration-75" />
        </button>
      </div>

      {/* now playing — plain text, not a control */}
      <p
        className="mt-10 text-[12px] tracking-[0.3em] uppercase transition-opacity duration-150"
        style={{ color: "#3d3b37", opacity: blink ? 0 : 1 }}
      >
        {u.name} — {u.price} · {u.tag}
      </p>
    </section>
  )
}
