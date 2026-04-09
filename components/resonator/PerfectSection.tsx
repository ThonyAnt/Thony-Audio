"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import FadeIn from "@/components/FadeIn"

const controls = [
  {
    name: "fine",
    label: "Fine Tune",
    unit: "cents",
    description: "Adjust the intonation of each voice in cents. Perfect for lush detuning or precise microtonality.",
  },
  {
    name: "pan",
    label: "Pan",
    unit: "L/R",
    description: "Place each resonator voice in the stereo field independently.",
  },
  {
    name: "gain",
    label: "Gain",
    unit: "dB",
    description: "Control the wet signal level of each voice — blend voices at different volumes to shape the harmonic balance.",
  },
]

export default function PerfectSection() {
  const [active, setActive] = useState<number | null>(null)

  return (
    <section className="px-6 py-20 max-w-6xl mx-auto">
      <div className="border-t border-[#d8d4ce] pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left — accordion list */}
          <FadeIn>
            <p className="text-xs tracking-[0.3em] uppercase text-[#8a837c] mb-4">per-voice control</p>
            <h2 className="font-display text-5xl lg:text-6xl text-[#1a1a1a] leading-tight mb-8">
              perfect your sound
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
          </FadeIn>

          {/* Right — image fixed in its own column */}
          <FadeIn delay={0.15} direction="right" className="flex justify-center mt-[10px]">
            <Image
              src="/assets/products/resonator/Pitch Module.png"
              alt="Pitch module with fine, pan, and gain sliders"
              width={415}
              height={1180}
              style={{ width: "120px", height: "auto" }}
              className="rounded-xl shadow-lg"
            />
          </FadeIn>

        </div>
      </div>
    </section>
  )
}
