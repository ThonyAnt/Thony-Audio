"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"
import type { Footprint } from "@/components/desk/DeskScene"
import type { Rect } from "@/components/desk/SunLeaves"

// three.js screen content — client-only, code-split
const PluginUnit3D = dynamic(() => import("@/components/PluginUnit3D"), { ssr: false })
// the props on the desk (react-three-fiber) — client-only, code-split
const DeskScene = dynamic(() => import("@/components/desk/DeskScene"), { ssr: false })
import WoodTable from "@/components/desk/WoodTable"
import SunLeaves from "@/components/desk/SunLeaves"

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

export default function CassetteHero() {
  const [index, setIndex] = useState(0)
  const [blink, setBlink] = useState(false)
  const busy = useRef(false)

  // desk: the device's footprint (px, relative to the section centre) feeds the
  // shadow caster in the 3D scene so the device and the plant share one light
  const sectionRef = useRef<HTMLElement>(null)
  const deviceRef = useRef<HTMLDivElement>(null)
  const [footprint, setFootprint] = useState<Footprint | null>(null)
  const [deviceRect, setDeviceRect] = useState<Rect | null>(null)
  const [deskReady, setDeskReady] = useState(false)
  const onDeskReady = useCallback(() => setDeskReady(true), [])
  useEffect(() => {
    const section = sectionRef.current, device = deviceRef.current
    if (!section || !device) return
    const measure = () => {
      const s = section.getBoundingClientRect(), d = device.getBoundingClientRect()
      // the SVG canvas pads the 888×560 device by 3px each side
      const px = d.width * (3 / 894), py = d.height * (0.5 / 561)
      setFootprint({
        x: d.left + d.width / 2 - (s.left + s.width / 2),
        y: d.top + d.height / 2 - (s.top + s.height / 2),
        w: d.width - 2 * px,
        h: d.height - 2 * py,
      })
      setDeviceRect({ left: d.left - s.left + px, top: d.top - s.top + py, width: d.width - 2 * px, height: d.height - 2 * py })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(section)
    ro.observe(device)
    return () => ro.disconnect()
  }, [])

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
      ref={sectionRef}
      className="relative min-h-dvh flex flex-col items-center justify-center px-4 py-16 overflow-hidden"
    >
      {/* the desk (CSS wood) */}
      <WoodTable />
      {/* what sits on it — the plant and the device's shadow (three.js) */}
      <div
        className="absolute inset-0 transition-opacity duration-700 ease-out"
        style={{ opacity: deskReady ? 1 : 0 }}
        aria-hidden
      >
        <DeskScene footprint={footprint} onReady={onDeskReady} />
      </div>

      {/* sun through the plant above — the copy that lands on the desk and the plant */}
      <SunLeaves />

      {/* the device — sits small on the desk; its shadow is cast in the scene.
          No CSS filter on this wrapper: it would rasterize the SVG subtree and soften the hairlines */}
      <div
        ref={deviceRef}
        className="relative isolate z-10 w-full max-w-[680px]"
        style={{ aspectRatio: "3576/2241" }} // the Figma frame: 894 × 560.25
      >
        {/* contact shadow: seats the device on the desk (the SVG canvas pads the body by ~3px) */}
        <div
          aria-hidden
          className="absolute rounded-[4px]"
          style={{
            inset: "0.13% 0.5% 1.2% 0.4%",
            boxShadow: [
              "0 10px 1px rgba(0,0,0,.6)",        // bottom edge
              "2px 10px 1px rgba(0,0,0,.55)",      // right edge
              "0 11px 6px -2px rgba(0,0,0,.42)",  // soft spill
            ].join(", "),
          }}
        />
        {/* the device — Figma PNG exports (2x/4x of the 894×561 frame, transparent bg):
            body = frame with the CRT glass layers hidden · glass = only those layers.
            The browser's area-averaged image downscale keeps hairlines calm at any
            display size, where live vector rasterization at fractional scales shimmers. */}
        <img
          src="/assets/cassette/cassette-body-2x.png"
          srcSet="/assets/cassette/cassette-body-2x.png 1788w, /assets/cassette/cassette-body-4x.png 3576w"
          sizes="(max-width: 760px) 92vw, 680px"
          alt="" draggable={false}
          className="absolute inset-0 w-full h-full"
        />

        {/* live CRT content, clipped to the phosphor face. Painted phosphor-dark so the
            glass baked into the Figma body export is hidden here — the glass overlay
            above supplies the only reflections over the live content */}
        <div
          className="absolute overflow-hidden"
          style={{ left: "9.575%", top: "19.79%", width: "37.56%", height: "42.57%", borderRadius: "12.6% / 17.8%", background: "#1C1C1E" }}
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
        <img
          src="/assets/cassette/cassette-glass-2x.png"
          srcSet="/assets/cassette/cassette-glass-2x.png 1788w, /assets/cassette/cassette-glass-4x.png 3576w"
          sizes="(max-width: 760px) 92vw, 680px"
          alt="" draggable={false}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />

        {/* PREV / NEXT — the only pressable controls */}
        <button
          type="button" aria-label="previous plugin" onClick={() => paginate(-1)}
          className="absolute cursor-pointer group"
          style={{ left: "79.0%", top: "38.40%", width: "7.16%", height: "11.42%" }}
        >
          <span className="absolute inset-[3.5%] rounded-[14%] bg-black/0 group-active:bg-black/30 transition-colors duration-75" />
        </button>
        <button
          type="button" aria-label="next plugin" onClick={() => paginate(1)}
          className="absolute cursor-pointer group"
          style={{ left: "87.5%", top: "38.40%", width: "7.16%", height: "11.42%" }}
        >
          <span className="absolute inset-[3.5%] rounded-[14%] bg-black/0 group-active:bg-black/30 transition-colors duration-75" />
        </button>
      </div>


      {/* …and the copy that folds over the raised device */}
      <SunLeaves fold={deviceRect} />
    </section>
  )
}
