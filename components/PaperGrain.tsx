"use client"

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { PaperTexture } from "@paper-design/shaders-react"

type PaperParams = {
  speed: number
  scale: number
  colorBack: string
  colorFront: string
  contrast: number
  roughness: number
  fiber: number
  fiberSize: number
  crumples: number
  crumpleSize: number
  folds: number
  foldCount: number
  drops: number
  seed: number
}

/**
 * Named paper presets — one source of truth for the global field and any in-card fill.
 * colorBack = the paper, colorFront = the fiber/grain.
 *  - `warm`          → the site default (warm cream + tan fiber)
 *  - `metallicWhite` → cool blue-grey-white, finer + smoother grain (the Chorale paper)
 */
export const PAPER_PRESETS = {
  warm: {
    speed: 0, scale: 0.4, colorBack: "#fefdfd", colorFront: "#cebfa2",
    contrast: 0.34, roughness: 0.5, fiber: 0.45, fiberSize: 0.16,
    crumples: 0.12, crumpleSize: 0.3, folds: 0.1, foldCount: 3, drops: 0.05, seed: 5.8,
  },
  metallicWhite: {
    speed: 0, scale: 0.4, colorBack: "#edf0f3", colorFront: "#a9b2c0",
    contrast: 0.42, roughness: 0.62, fiber: 0.5, fiberSize: 0.11,
    crumples: 0.06, crumpleSize: 0.28, folds: 0.05, foldCount: 2, drops: 0.03, seed: 3.2,
  },
} satisfies Record<string, PaperParams>

export type PaperPreset = keyof typeof PAPER_PRESETS

type PaperContextValue = { preset: PaperPreset; setPreset: (p: PaperPreset) => void }
const PaperContext = createContext<PaperContextValue>({ preset: "warm", setPreset: () => {} })

/** Holds the active paper preset. Wrap the app once, in the root layout. */
export function PaperThemeProvider({ children }: { children: ReactNode }) {
  const [preset, setPreset] = useState<PaperPreset>("warm")
  const value = useMemo(() => ({ preset, setPreset }), [preset])
  return <PaperContext.Provider value={value}>{children}</PaperContext.Provider>
}

/**
 * Swap the GLOBAL paper while this subtree is mounted; reverts to `warm` on unmount.
 * Renders nothing — drop <PaperTheme variant="metallicWhite" /> into a page to re-skin the field.
 */
export function PaperTheme({ variant }: { variant: PaperPreset }) {
  const { setPreset } = useContext(PaperContext)
  useEffect(() => {
    setPreset(variant)
    return () => setPreset("warm")
  }, [variant, setPreset])
  return null
}

function useMountedPreset() {
  const { preset } = useContext(PaperContext)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return mounted ? preset : null
}

/**
 * Global paper texture — a fixed, full-viewport layer BEHIND all content (z-index:-1).
 * Static (speed:0 → renders once, no GPU loop). Client-only to avoid SSR/WebGL issues.
 */
export default function PaperGrain() {
  const preset = useMountedPreset()
  if (!preset) return null

  return (
    <div aria-hidden style={{ position: "fixed", inset: 0, zIndex: -1, pointerEvents: "none" }}>
      <PaperTexture style={{ width: "100%", height: "100%" }} {...PAPER_PRESETS[preset]} />
    </div>
  )
}

/**
 * Same paper, but an ABSOLUTE fill meant to live inside a card/cell. Because it's a child
 * of that element, it transforms with it — so a tile that scales/lifts on hover carries its
 * paper backing along, instead of detaching from the fixed global layer. Pair with a solid
 * `bg-cream` on the parent as the pre-mount / no-WebGL fallback.
 */
export function PaperFill({ preset }: { preset?: PaperPreset } = {}) {
  const ctx = useMountedPreset()
  if (!ctx) return null
  const active = preset ?? ctx // explicit per-slide preset wins; else follow the global field

  return (
    <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <PaperTexture style={{ width: "100%", height: "100%" }} {...PAPER_PRESETS[active]} />
    </div>
  )
}
