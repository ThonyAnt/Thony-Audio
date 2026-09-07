"use client"

import { useCallback, useEffect, useState } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { Focus, UnitRect, UnitSpec } from "@/components/desk/DeskScene"
import PaperTag, { TAG_VIEW } from "@/components/desk/PaperTag"

// the desk and everything on it (react-three-fiber) — client-only, code-split
const DeskScene = dynamic(() => import("@/components/desk/DeskScene"), { ssr: false })

/**
 * DeskHero — the plugins themselves, lying on the sunlit desk.
 *
 *   (desk)/layout   the wood and the leaf shadows; renders this on every desk route
 *   DeskScene       the units (real 3D chassis) + the plant + every shadow
 *   captions        real links, placed exactly on each unit from the scene's layout
 *
 * Resonator sits in the sun. Chorale asks the scene for the cool rig — white
 * overhead light and violet grazing lights — so it reads industrial next to it.
 *
 * Clicking a unit focuses it, in place: the camera dollies in until it fills
 * the viewport and, for units that power on, its accent graphics light up
 * (see Focus in DeskScene). Clicking anywhere or pressing Escape lets go —
 * the unit powers down and the camera pulls back to the desk. No page change.
 * While focused, <html data-desk-focus> fades the layout's leaf shadows (they
 * can't follow the camera) and sets the zoom-out cursor — see globals.css.
 *
 * The layer is on the desk only at "/". On any other desk route it stays
 * mounted (so the 3D scene stays drawn) but parks off-screen, unnamed and
 * inert. Its view-transition-name comes and goes with that, which is what
 * makes a route change slide it out to the left and back in fully rendered
 * ("view transitions" in globals.css).
 */

const UNITS: UnitSpec[] = [
  {
    slug: "chorale",
    texture: "/assets/desk/units/chorale-1600.png", // 1600px bake of products/chorale/chorale-3d-bake.png
    designW: 1562, designH: 1680, raised: true,
    width: 0.30, light: "cool", yaw: 0.035, powers: true,
  },
  {
    slug: "resonator",
    texture: "/assets/desk/units/resonator-2048.png", // 2048px bake of products/resonator/Resonator.png
    designW: 4396, designH: 3040, raised: false,
    width: 0.42, light: "sun", yaw: -0.022, powers: false,
  },
]

const COPY: Record<string, { name: string; tag: string; price: string; tagRot: number }> = {
  chorale: { name: "chorale", tag: "a reverb that resonates in key with your music", price: "$39", tagRot: 24 },
  resonator: { name: "resonator", tag: "seven-voice harmonic resonator with chords and midi", price: "free", tagRot: 33 },
}

export default function DeskHero() {
  const onDesk = usePathname() === "/"
  const [rects, setRects] = useState<UnitRect[]>([])
  const [hovered, setHovered] = useState<string | null>(null)
  const [ready, setReady] = useState(false)
  const [focus, setFocus] = useState<Focus | null>(null)
  const onReady = useCallback(() => setReady(true), [])
  const onLayout = useCallback((r: UnitRect[]) => setRects(r), [])

  // focus a unit in place. Modified clicks and reduced-motion users get the plain link.
  const pick = (e: React.MouseEvent<HTMLAnchorElement>, slug: string) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return
    e.preventDefault()
    setFocus({ slug, startedAt: performance.now() })
  }
  const release = useCallback(() => setFocus(null), [])
  useEffect(() => {
    if (!focus) return
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") release() }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [focus, release])
  // leaving the desk lets go of a focused unit
  useEffect(() => { if (!onDesk) setFocus(null) }, [onDesk])
  // tell the layout (leaf shadows, cursor) that a unit is focused
  useEffect(() => {
    document.documentElement.toggleAttribute("data-desk-focus", focus !== null)
    return () => document.documentElement.removeAttribute("data-desk-focus")
  }, [focus])

  return (
    <div
      className="desk-units absolute inset-0"
      data-away={onDesk ? undefined : ""}
      style={{ viewTransitionName: onDesk ? "desk-units" : undefined }}
      inert={!onDesk}
      onClick={focus ? release : undefined}
    >
      <div
        className="absolute inset-0 transition-opacity duration-700 ease-out"
        style={{ opacity: ready ? 1 : 0 }}
        aria-hidden
      >
        <DeskScene units={UNITS} hovered={hovered} focus={focus} onLayout={onLayout} onReady={onReady} />
      </div>

      {/* the paper price tags, tied to a top corner of each unit: the outer one on the
          desk (Chorale left, Resonator right), draped over the unit on narrow screens.
          They sit under the leaf shadows, like the units, and are graded to the same
          warm light (see .paper-tags in globals.css) */}
      <div
        className="paper-tags absolute inset-0 transition-opacity ease-out"
        style={{
          opacity: ready && !focus ? 1 : 0,
          transitionDuration: focus ? "300ms" : "700ms",
          transitionDelay: focus ? "0ms" : "950ms",
        }}
        aria-hidden
      >
        {rects.map((r) => {
          const c = COPY[r.slug]
          const w = Math.max(104, Math.min(160, r.width * 0.42))
          const h = w * (TAG_VIEW.h / TAG_VIEW.w)
          const a = w * (TAG_VIEW.anchor / TAG_VIEW.w)
          const narrow = r.width < 300
          const side = narrow || r.slug === "chorale" ? "left" : "right"
          const corner = narrow || r.slug !== "chorale" ? r.width : 0
          const left = side === "left" ? corner - (w - a) : corner - a
          return (
            <PaperTag
              key={r.slug}
              label={c.price}
              side={side}
              rot={c.tagRot}
              swing={hovered === r.slug}
              className="absolute"
              style={{ width: w, height: h, left: r.left + left, top: r.top - a }}
            />
          )
        })}
      </div>

      {/* the links: one per unit, sized to it, with the caption hanging below */}
      <ul
        className="absolute inset-0 z-10 m-0 list-none p-0 transition-opacity ease-out"
        style={{
          opacity: ready && !focus ? 1 : 0,
          // out fast; back only after the camera has settled on the desk
          transitionDuration: focus ? "300ms" : "700ms",
          transitionDelay: focus ? "0ms" : "950ms",
          pointerEvents: focus ? "none" : undefined,
        }}
      >
        {rects.map((r) => {
          const c = COPY[r.slug]
          const isHover = hovered === r.slug
          return (
            <li
              key={r.slug}
              className="absolute"
              style={{ left: r.left, top: r.top, width: r.width, height: r.height }}
            >
              <Link
                href={`/plugins/${r.slug}`}
                className="group absolute inset-x-0 top-0 block cursor-pointer outline-none"
                style={{ height: r.height + 96 }}
                onClick={(e) => pick(e, r.slug)}
                onMouseEnter={() => setHovered(r.slug)}
                onMouseLeave={() => setHovered((h) => (h === r.slug ? null : h))}
                onFocus={() => setHovered(r.slug)}
                onBlur={() => setHovered((h) => (h === r.slug ? null : h))}
              >
                <span className="sr-only">{c.name}, {c.price}: </span>
                <span
                  className="absolute inset-x-0 flex flex-col items-start gap-1 px-1 text-[#2a1a0c] transition-[transform,opacity] duration-300 ease-out"
                  style={{ top: r.height + 18, transform: isHover ? "translateY(-2px)" : "none" }}
                >
                  <span className="font-display text-[1.75rem] leading-none tracking-tight lowercase">{c.name}</span>
                  <span className="text-[0.86rem] leading-snug text-[#2a1a0c]/75">{c.tag}</span>
                  <span
                    className="mt-1 h-px w-8 bg-[#2a1a0c]/50 transition-[width] duration-300 ease-out"
                    style={{ width: isHover ? 56 : 32 }}
                  />
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
