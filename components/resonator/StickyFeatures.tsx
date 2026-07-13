"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import TiltCard from "@/components/TiltCard"

// The 5 features, in scroll order. Labels drive the pinned tab bar.
const TABS = ["flavors", "voices", "chords", "midi", "controls"]

// Alternate the slide background between paper (grain shows) and a warm tan, for variety.
const PAPER = "transparent"
const TAN = "var(--color-tan)"

type RegisterRef = (index: number, el: HTMLDivElement | null) => void
interface SlideProps {
  index: number
  bg: string
  registerRef: RegisterRef
}

// ─── Snap slide wrapper ───────────────────────────────────────────────────────
// One full-viewport panel that scroll-snaps into place. Content is vertically
// centered, so a feature's image never reaches the very top of the screen where
// it would clip the (now transparent, floating) nav text. Scrolling eases-settles
// from feature to feature instead of scrubbing continuously.
function StickySlide({
  index,
  bg,
  registerRef,
  children,
}: SlideProps & { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    registerRef(index, ref.current)
    return () => registerRef(index, null)
  }, [index, registerRef])

  return (
    <div
      ref={ref}
      className="snap-start h-screen overflow-hidden flex items-center"
      style={{ backgroundColor: bg }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
        className="w-full pt-24 px-8 lg:px-20 max-w-7xl mx-auto"
      >
        {children}
      </motion.div>
    </div>
  )
}

// ─── Slide 1: 2 Flavors ───────────────────────────────────────────────────────
const flavorData = {
  saw: { name: "Saw", description: "Use saw mode for immediate richness in your sound." },
  square: { name: "Square", description: "Square mode resonates only odd harmonics, creating a hollow, subtler tone." },
}

function FlavorsSlide(props: SlideProps) {
  const [active, setActive] = useState<"saw" | "square">("saw")

  return (
    <StickySlide {...props}>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-16 items-center">
        <div>
          <p className="text-xs tracking-[0.08em] uppercase font-mono text-muted mb-3">timbre</p>
          <h2 className="font-display text-ink leading-none mb-8" style={{ fontSize: "clamp(4rem, 11vw, 10rem)" }}>
            2 flavors
          </h2>

          <div className="inline-flex bg-surface rounded-[3px] p-1 mb-6">
            {(["saw", "square"] as const).map((key) => (
              <button
                key={key}
                onClick={() => setActive(key)}
                className="relative px-6 py-2 rounded-[2px] text-sm tracking-wide"
                style={{ color: active === key ? "var(--color-cream)" : "var(--color-muted)" }}
              >
                {active === key && (
                  <motion.div
                    layoutId="flavor-pill-sticky"
                    className="absolute inset-0 rounded-[2px] bg-accent"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{key}</span>
              </button>
            ))}
          </div>

          <div style={{ minHeight: "3.5rem" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <p className="font-display text-xl italic text-accent mb-1">{flavorData[active].name}</p>
                <p className="text-muted text-sm leading-relaxed max-w-xs">{flavorData[active].description}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        <TiltCard maxRotation={10}>
          <Image
            src="/assets/products/resonator/Timbre Selector.png"
            alt="Timbre selector"
            width={746}
            height={1297}
            style={{ width: "140px", height: "auto" }}
            className="rounded-xl shadow-lg"
          />
        </TiltCard>
      </div>
    </StickySlide>
  )
}

// ─── Slide 2: 7 Voices ───────────────────────────────────────────────────────
function VoicesSlide(props: SlideProps) {
  return (
    <StickySlide {...props}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-xs tracking-[0.08em] uppercase font-mono text-muted mb-3">voices</p>
          <h2 className="font-display text-ink leading-none mb-6" style={{ fontSize: "clamp(4rem, 11vw, 8rem)" }}>
            resonate<br />your sound
          </h2>
          <p className="text-muted text-sm leading-relaxed max-w-md">
            Stack up to 7 independent pitch voices to create complex harmonies.
          </p>
        </div>

        <div className="flex justify-center">
          <TiltCard maxRotation={5}>
            <Image
              src="/assets/products/resonator/Pitch Panel.png"
              alt="Pitch panel"
              width={2998}
              height={1293}
              style={{ maxWidth: "10000px", width: "100%", height: "auto" }}
              className="rounded-xl shadow-lg"
            />
          </TiltCard>
        </div>
      </div>
    </StickySlide>
  )
}

// ─── Slide 3: Chord Progressions ─────────────────────────────────────────────
function ChordsSlide(props: SlideProps) {
  return (
    <StickySlide {...props}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="text-right">
          <p className="text-xs tracking-[0.08em] uppercase font-mono text-muted mb-3">chord progression</p>
          <h2 className="font-display text-ink leading-none mb-6" style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}>
            create chord<br />progressions
          </h2>
          <p className="text-muted text-sm leading-relaxed ml-auto max-w-xs">
            Store chords in up to 8 modules. Switch between them mid-track to build a chord progression.
          </p>
        </div>

        <div className="flex justify-center">
          <TiltCard maxRotation={10}>
            <Image
              src="/assets/products/resonator/Chord Selector.png"
              alt="Chord selector"
              width={588}
              height={1382}
              style={{ width: "130px", height: "auto" }}
              className="rounded-xl shadow-lg"
            />
          </TiltCard>
        </div>
      </div>
    </StickySlide>
  )
}

// ─── Slide 4: MIDI ───────────────────────────────────────────────────────────
function MidiSlide(props: SlideProps) {
  return (
    <StickySlide {...props}>
      <div className="text-center">
        <p className="text-xs tracking-[0.08em] uppercase font-mono text-muted mb-4">midi</p>
        <h2 className="font-display text-ink leading-none mb-6" style={{ fontSize: "clamp(4rem, 15vw, 13rem)" }}>
          play it live
        </h2>
        <p className="text-muted text-sm leading-relaxed max-w-sm mx-auto">
          Enable MIDI input and Resonator follows your keyboard in real time, turning any sound into an instrument!
        </p>
      </div>
    </StickySlide>
  )
}

// ─── Slide 5: Perfect Your Sound ─────────────────────────────────────────────
const controls = [
  { name: "fine", label: "Fine Tune", unit: "cents", description: "Adjust the pitch of each voice in cents. Perfect for detuning or creating microtonal pitches." },
  { name: "pan", label: "Pan", unit: "L/R", description: "Place each resonator voice in the stereo field independently." },
  { name: "gain", label: "Gain", unit: "dB", description: "Control the wet signal level of each voice." },
]

function PerfectSlide(props: SlideProps) {
  const [active, setActive] = useState<number | null>(null)

  return (
    <StickySlide {...props}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-xs tracking-[0.08em] uppercase font-mono text-muted mb-3">per-voice control</p>
          <h2 className="font-display text-ink leading-none mb-8" style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}>
            perfect<br />your sound
          </h2>

          <div className="divide-y divide-line">
            {controls.map((ctrl, i) => (
              <button
                key={ctrl.name}
                onClick={() => setActive(active === i ? null : i)}
                className="w-full text-left py-4 group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-display text-xl text-ink group-hover:text-accent transition-colors">
                    {ctrl.label}
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-muted">{ctrl.unit}</span>
                    <motion.span
                      animate={{ rotate: active === i ? 45 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-muted text-lg leading-none"
                    >
                      +
                    </motion.span>
                  </div>
                </div>
                <AnimatePresence>
                  {active === i && (
                    <motion.p
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: "auto", marginTop: 8 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      transition={{ duration: 0.22 }}
                      className="text-sm text-muted leading-relaxed overflow-hidden"
                    >
                      {ctrl.description}
                    </motion.p>
                  )}
                </AnimatePresence>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <TiltCard maxRotation={10}>
            <Image
              src="/assets/products/resonator/Pitch Module.png"
              alt="Pitch module"
              width={415}
              height={1180}
              style={{ width: "120px", height: "auto" }}
              className="rounded-xl shadow-lg"
            />
          </TiltCard>
        </div>
      </div>
    </StickySlide>
  )
}

// ─── Orchestrator: pinned feature-tab bar that the scroll rotates through ──────
export default function StickyFeatures() {
  const refs = useRef<(HTMLDivElement | null)[]>([])
  const registerRef = useCallback<RegisterRef>((i, el) => {
    refs.current[i] = el
  }, [])
  const sectionRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const activeRef = useRef(0)
  const lockRef = useRef(false)

  const scrollTo = useCallback((i: number) => {
    const el = refs.current[i]
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: "smooth" })
  }, [])

  // active-feature detection for the tab bar (viewport mid)
  useEffect(() => {
    const onScroll = () => {
      const mid = window.innerHeight / 2
      let idx = 0
      refs.current.forEach((el, i) => {
        if (!el) return
        const r = el.getBoundingClientRect()
        if (r.top <= mid && r.bottom >= mid) idx = i
      })
      activeRef.current = idx
      setActive(idx)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Strict pager: while the feature block fills the viewport, one wheel notch advances
  // exactly one feature (eased) and free-scroll is blocked. At the first/last feature the
  // gesture is released so a further scroll carries on to the hero / the section below.
  useEffect(() => {
    const count = TABS.length
    const engaged = () => {
      const el = sectionRef.current
      if (!el) return false
      const r = el.getBoundingClientRect()
      return r.top <= 1 && r.bottom >= window.innerHeight - 1
    }
    const onWheel = (e: WheelEvent) => {
      if (lockRef.current) { e.preventDefault(); return } // swallow momentum mid-step
      if (!engaged()) return
      const target = activeRef.current + (e.deltaY > 0 ? 1 : -1)
      if (target < 0 || target >= count) return // boundary → let native scroll exit
      e.preventDefault()
      lockRef.current = true
      activeRef.current = target
      setActive(target)
      scrollTo(target)
      window.setTimeout(() => { lockRef.current = false }, 620)
    }
    window.addEventListener("wheel", onWheel, { passive: false })
    return () => window.removeEventListener("wheel", onWheel)
  }, [scrollTo])

  return (
    <section ref={sectionRef}>
      {/* pinned tab bar — sticks under the nav and rotates as you scroll the slides */}
      <div className="sticky top-14 z-40 flex justify-center pt-5 pointer-events-none">
        <div className="flex flex-wrap gap-2 justify-center pointer-events-auto">
          {TABS.map((t, i) => (
            <button
              key={t}
              onClick={() => scrollTo(i)}
              aria-current={active === i}
              className={`rounded border px-4 py-1.5 text-sm tracking-wide transition-colors ${
                active === i
                  ? "bg-accent text-cream border-accent"
                  : "bg-surface text-muted border-ink/15 hover:text-ink"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <FlavorsSlide index={0} bg={PAPER} registerRef={registerRef} />
      <VoicesSlide index={1} bg={TAN} registerRef={registerRef} />
      <ChordsSlide index={2} bg={PAPER} registerRef={registerRef} />
      <MidiSlide index={3} bg={TAN} registerRef={registerRef} />
      <PerfectSlide index={4} bg={PAPER} registerRef={registerRef} />
    </section>
  )
}
