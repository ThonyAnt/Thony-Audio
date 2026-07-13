"use client"

import { CSSProperties, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import dynamic from "next/dynamic"
import { AnimatePresence, motion } from "framer-motion"
import { products } from "@/data/products"
import { PaperFill } from "@/components/PaperGrain"

// three.js hero unit — client-only and code-split so it never weighs down slides that don't use it
const Chorale3D = dynamic(() => import("@/components/Chorale3D"), { ssr: false })

const ArrowLeft = () => (
  <svg width="42" height="16" viewBox="0 0 42 16" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M41 8H1m0 0l7-7M1 8l7 7" />
  </svg>
)
const ArrowRight = () => (
  <svg width="42" height="16" viewBox="0 0 42 16" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 8h40m0 0l-7-7m7 7l-7 7" />
  </svg>
)
const UserIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="3.5" />
    <path d="M4.5 20c0-3.6 3.4-5.5 7.5-5.5s7.5 1.9 7.5 5.5" />
  </svg>
)

const variants = {
  enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%" }),
  center: { x: 0 },
  exit: (d: number) => ({ x: d > 0 ? "-100%" : "100%" }),
}

/**
 * Bento-grid plugin showcase (Hyperplexed / dylanbrouwer.design recreation, warm-adapted).
 * Top row = site nav. Below = a carousel of plugin slides: big plugin shot (left), description
 * (top-right), title (bottom-left), L/R arrow boxes (bottom-right). Arrows cycle the catalog.
 */
export default function BentoShowcase() {
  const slides = products
  // open on Chorale by default; fall back to the first plugin if it's not in the catalog
  const [[index, dir], setState] = useState<[number, number]>(() => [
    Math.max(0, slides.findIndex((s) => s.slug === "chorale")),
    0,
  ])
  const paginate = (d: number) => setState([(index + d + slides.length) % slides.length, d])
  const p = slides[index]
  const priceLabel = p.price === 0 ? "free" : `$${p.price}`

  // Each slide carries its plugin's theme on the article ITSELF (scoped, not global), so the
  // accent/surface/paper travel WITH the slide as it animates — the outgoing slide keeps its
  // theme on the way out, the incoming brings its own in. No global var swap = no teleport.
  const themeVars = {
    ...(p.accent ? { "--color-accent": p.accent.fg, "--color-accent-hover": p.accent.hover ?? p.accent.fg } : {}),
    ...(p.accent?.bg ? { "--color-surface": p.accent.bg } : {}),
  } as CSSProperties

  return (
    <motion.div
      className="h-screen w-full flex flex-col overflow-hidden border-2 border-dark"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.165, 0.84, 0.44, 1] }}
    >
      {/* nav row — themeVars live HERE (on the nav, a SIBLING of the slides), never on a shared
          ancestor. So the persistent nav still inherits + glides the active slide's color, but the
          sliding articles can't inherit a changing ancestor var. An un-themed slide (e.g. Resonator,
          no accent) keeps the stable global default on its way out instead of snapping to the
          incoming slide's color. */}
      <nav
        className="flex border-b-2 border-dark shrink-0 bg-surface transition-colors duration-500 ease-[var(--ease-soft)]"
        style={themeVars}
      >
        <Link
          href="/"
          className="flex items-center px-8 py-8 basis-1/3 font-display text-xl text-ink tracking-wide"
        >
          thony audio
        </Link>
        <Link
          href="/plugins"
          className="flex flex-1 items-center justify-center px-6 py-8 border-l-2 border-dark text-sm tracking-wide text-muted hover:text-ink transition-colors"
        >
          plugins
        </Link>
        <Link
          href="/support"
          className="flex flex-1 items-center justify-center px-6 py-8 border-l-2 border-dark text-sm tracking-wide text-muted hover:text-ink transition-colors"
        >
          support
        </Link>
        <Link
          href="/account"
          aria-label="account"
          className="flex items-center justify-center px-8 py-8 border-l-2 border-dark text-muted hover:text-ink transition-colors"
        >
          <UserIcon />
        </Link>
      </nav>

      {/* carousel */}
      <main className="relative flex-grow overflow-hidden">
        <AnimatePresence custom={dir} initial={false}>
          <motion.article
            key={index}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0 grid"
            style={{ gridTemplateColumns: "2fr 1fr", gridTemplateRows: "2.4fr 1fr", ...themeVars }}
          >
            {/* big plugin shot (top-left). The cell + paper stay put; ONLY the plugin rotates,
                clipped to the cell (overflow-hidden) so it never protrudes. */}
            <Link
              href={`/plugins/${p.slug}`}
              className="group relative overflow-hidden bg-cream"
              aria-label={p.name}
              // links are natively draggable — dragging the 3D unit would otherwise start a
              // browser link-drag (red no-drop cursor) instead of rotating it
              draggable={false}
              onDragStart={(e) => e.preventDefault()}
            >
              {/* static paper backing — does NOT rotate with the plugin; carries this slide's paper */}
              <PaperFill preset={p.paper ?? "warm"} />
              {p.model3d ? (
                // real spinning 3D unit (three.js) — transparent canvas over the paper; its own
                // in-scene shadow catcher replaces --plugin-shadow (a per-frame CSS filter on a
                // spinning canvas would re-run the whole drop-shadow chain every frame)
                <Chorale3D texture={p.model3d} />
              ) : p.thumbnail ? (
                // drop-shadow on the OUTER wrapper so it's computed on the already-rotated plugin
                // (correct post-rotation shadow, cast straight down); INNER wrapper does the 3D rotate.
                <div
                  className="absolute left-1/2 top-12 w-[90%] -translate-x-1/2"
                  style={{ filter: "var(--plugin-shadow)" }}
                >
                  <div className="transition-transform duration-500 ease-in-out [transform:perspective(1000px)_rotate3d(0.5,1,0,0deg)_translateZ(0px)] group-hover:[transform:perspective(1200px)_rotate3d(0.5,1,0,20deg)_translateZ(50px)]">
                    <Image
                      src={p.thumbnail}
                      alt={p.name}
                      width={4396}
                      height={3040}
                      sizes="66vw"
                      priority
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-display text-[10rem] leading-none text-faint">{p.name[0]}</span>
                </div>
              )}
            </Link>

            {/* description (top-right) */}
            <div className="flex flex-col justify-end gap-3 border-l-2 border-dark bg-surface p-8">
              <p className="font-display italic text-lg text-accent leading-snug lowercase">{p.tagline}</p>
              <p className="font-body text-sm text-muted leading-relaxed lowercase">{p.description}</p>
            </div>

            {/* title (bottom-left) on ink */}
            <div className="flex items-center justify-between border-t-2 border-dark bg-dark px-8 py-6">
              <h2 className="font-display text-5xl lg:text-6xl font-semibold leading-none lowercase" style={{ color: "var(--color-cream)" }}>{p.name}</h2>
              <span className="font-display italic text-lg text-cream/70 shrink-0">{priceLabel}</span>
            </div>

            {/* arrows (bottom-right) — two equally sized boxes; imagiro-style underline on hover */}
            <div className="grid grid-cols-2 border-t-2 border-l-2 border-dark bg-accent">
              <button
                type="button"
                onClick={() => paginate(-1)}
                aria-label="previous plugin"
                className="group flex flex-col items-center justify-center gap-1.5 text-cream"
              >
                <ArrowLeft />
                <span className="block h-px w-10 origin-center scale-x-0 bg-cream transition-transform duration-300 ease-[var(--ease-soft)] group-hover:scale-x-100" />
              </button>
              <button
                type="button"
                onClick={() => paginate(1)}
                aria-label="next plugin"
                className="group flex flex-col items-center justify-center gap-1.5 border-l-2 border-dark text-cream"
              >
                <ArrowRight />
                <span className="block h-px w-10 origin-center scale-x-0 bg-cream transition-transform duration-300 ease-[var(--ease-soft)] group-hover:scale-x-100" />
              </button>
            </div>
          </motion.article>
        </AnimatePresence>
      </main>
    </motion.div>
  )
}
