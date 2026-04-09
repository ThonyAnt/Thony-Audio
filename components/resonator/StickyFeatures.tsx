"use client"

import { useRef, useState } from "react"
import { motion, useScroll, useTransform, AnimatePresence, MotionValue } from "framer-motion"
import Image from "next/image"
import TiltCard from "@/components/TiltCard"

// ─── Progress ring ────────────────────────────────────────────────────────────
const R = 18
const CIRCUMFERENCE = 2 * Math.PI * R

function ProgressRing({
  scrollYProgress,
  index,
  total,
}: {
  scrollYProgress: MotionValue<number>
  index: number
  total: number
}) {
  const strokeDashoffset = useTransform(
    scrollYProgress,
    [0, 1],
    [CIRCUMFERENCE, 0]
  )

  return (
    <div className="absolute bottom-6 right-8 flex items-center gap-3 select-none">
      <span className="text-xs tracking-widest text-[#8a837c]">
        {index}<span className="opacity-40">/{total}</span>
      </span>
      <div className="relative w-10 h-10">
        <svg viewBox="0 0 44 44" className="absolute inset-0 -rotate-90">
          <circle
            cx="22" cy="22" r={R}
            fill="none" stroke="#d8d4ce" strokeWidth="2"
          />
          <motion.circle
            cx="22" cy="22" r={R}
            fill="none" stroke="#b85c3a" strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            style={{ strokeDashoffset }}
          />
        </svg>
      </div>
    </div>
  )
}

// ─── Sticky slide wrapper ─────────────────────────────────────────────────────
function StickySlide({
  bg,
  index,
  total,
  children,
}: {
  bg: string
  index: number
  total: number
  children: React.ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.08, 0.92, 1], [0, 1, 1, 0])
  const y = useTransform(scrollYProgress, [0, 0.08, 0.92, 1], [60, 0, 0, -60])

  return (
    <div ref={ref} style={{ height: "200vh" }}>
      <div
        className="sticky top-0 h-screen overflow-hidden flex items-center"
        style={{ backgroundColor: bg }}
      >
        <motion.div
          style={{ opacity, y }}
          className="w-full pt-14 px-8 lg:px-20 max-w-7xl mx-auto"
        >
          {children}
        </motion.div>

        <ProgressRing scrollYProgress={scrollYProgress} index={index} total={total} />
      </div>
    </div>
  )
}

const BG = "#f5f2ed"
const TOTAL = 5

// ─── Slide 1: 2 Flavors ───────────────────────────────────────────────────────
const flavorData = {
  saw:    { name: "Saw",    description: "Use saw mode for immediate richness in your sound." },
  square: { name: "Square", description: "Square mode resonates only odd harmonics, creating a hollow, subtler tone." },
}

function FlavorsSlide() {
  const [active, setActive] = useState<"saw" | "square">("saw")

  return (
    <StickySlide bg={BG} index={1} total={TOTAL}>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-16 items-center">
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-[#8a837c] mb-3">timbre</p>
          <h2
            className="font-display text-[#1a1a1a] leading-none mb-8"
            style={{ fontSize: "clamp(4rem, 11vw, 10rem)" }}
          >
            2 flavors
          </h2>

          <div className="inline-flex bg-[#edeae4] rounded-full p-1 mb-6">
            {(["saw", "square"] as const).map((key) => (
              <button
                key={key}
                onClick={() => setActive(key)}
                className="relative px-6 py-2 rounded-full text-sm tracking-wide"
                style={{ color: active === key ? "#f5f2ed" : "#8a837c" }}
              >
                {active === key && (
                  <motion.div
                    layoutId="flavor-pill-sticky"
                    className="absolute inset-0 rounded-full bg-[#b85c3a]"
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
                <p className="font-display text-xl italic text-[#b85c3a] mb-1">
                  {flavorData[active].name}
                </p>
                <p className="text-[#8a837c] text-sm leading-relaxed max-w-xs">
                  {flavorData[active].description}
                </p>
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
function VoicesSlide() {
  return (
    <StickySlide bg={BG} index={2} total={TOTAL}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-[#8a837c] mb-3">voices</p>
          <h2
            className="font-display text-[#1a1a1a] leading-none mb-6"
            style={{ fontSize: "clamp(4rem, 11vw, 8rem)" }}
          >
            resonate<br />your sound
          </h2>
          <p className="text-[#8a837c] text-sm leading-relaxed max-w-md">
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
function ChordsSlide() {
  return (
    <StickySlide bg={BG} index={3} total={TOTAL}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="text-right">
          <p className="text-xs tracking-[0.3em] uppercase text-[#8a837c] mb-3">chord progression</p>
          <h2
            className="font-display text-[#1a1a1a] leading-none mb-6"
            style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}
          >
            create chord<br />progressions
          </h2>
          <p className="text-[#8a837c] text-sm leading-relaxed ml-auto max-w-xs">
            Store chords in up to 8 modules. Switch between them mid-track
            to build a chord progression.
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
function MidiSlide() {
  return (
    <StickySlide bg={BG} index={4} total={TOTAL}>
      <div className="text-center">
        <p className="text-xs tracking-[0.3em] uppercase text-[#8a837c] mb-4">midi</p>
        <h2
          className="font-display text-[#1a1a1a] leading-none mb-6"
          style={{ fontSize: "clamp(4rem, 15vw, 13rem)" }}
        >
          play it live
        </h2>
        <p className="text-[#8a837c] text-sm leading-relaxed max-w-sm mx-auto">
          Enable MIDI input and Resonator follows your keyboard in real time,
          turning any sound into an instrument!
        </p>
      </div>
    </StickySlide>
  )
}

// ─── Slide 5: Perfect Your Sound ─────────────────────────────────────────────
const controls = [
  { name: "fine", label: "Fine Tune", unit: "cents", description: "Adjust the pitch of each voice in cents. Perfect for detuning or creating microtonal pitches." },
  { name: "pan",  label: "Pan",       unit: "L/R",   description: "Place each resonator voice in the stereo field independently." },
  { name: "gain", label: "Gain",      unit: "dB",    description: "Control the wet signal level of each voice." },
]

function PerfectSlide() {
  const [active, setActive] = useState<number | null>(null)

  return (
    <StickySlide bg={BG} index={5} total={TOTAL}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-[#8a837c] mb-3">per-voice control</p>
          <h2
            className="font-display text-[#1a1a1a] leading-none mb-8"
            style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}
          >
            perfect<br />your sound
          </h2>

          <div className="divide-y divide-[#d8d4ce]">
            {controls.map((ctrl, i) => (
              <button
                key={ctrl.name}
                onClick={() => setActive(active === i ? null : i)}
                className="w-full text-left py-4 group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-display text-xl text-[#1a1a1a] group-hover:text-[#b85c3a] transition-colors">
                    {ctrl.label}
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-[#8a837c]">{ctrl.unit}</span>
                    <motion.span
                      animate={{ rotate: active === i ? 45 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-[#8a837c] text-lg leading-none"
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
                      className="text-sm text-[#8a837c] leading-relaxed overflow-hidden"
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

// ─── Export ───────────────────────────────────────────────────────────────────
export default function StickyFeatures() {
  return (
    <>
      <FlavorsSlide />
      <VoicesSlide />
      <ChordsSlide />
      <MidiSlide />
      <PerfectSlide />
    </>
  )
}
