"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import FadeIn from "@/components/FadeIn"

const flavors = {
  saw: {
    name: "Saw",
    description: "Use saw mode for immediate richness in your sound.",
  },
  square: {
    name: "Square",
    description: "Square mode resonates only odd harmonics, producing a hollow, subtler tone.",
  },
}

export default function FlavorsSection() {
  const [active, setActive] = useState<"saw" | "square">("saw")

  return (
    <section className="px-6 py-20 max-w-6xl mx-auto">
      <div className="border-t border-[#d8d4ce] pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — all text content */}
          <FadeIn>
            <p className="text-xs tracking-[0.3em] uppercase text-[#8a837c] mb-4">timbre</p>
            <h2 className="font-display text-5xl lg:text-6xl text-[#1a1a1a] leading-tight mb-10">
              2 flavors
            </h2>

            {/* Toggle */}
            <div className="inline-flex bg-[#edeae4] rounded-full p-1 mb-8">
              {(["saw", "square"] as const).map((key) => (
                <button
                  key={key}
                  onClick={() => setActive(key)}
                  className="relative px-7 py-2.5 rounded-full text-sm tracking-wide"
                  style={{ color: active === key ? "#f5f2ed" : "#8a837c" }}
                >
                  {active === key && (
                    <motion.div
                      layoutId="flavor-pill"
                      className="absolute inset-0 rounded-full bg-[#1a1a1a]"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{key}</span>
                </button>
              ))}
            </div>

            {/* Fixed-height text area so nothing shifts */}
            <div style={{ minHeight: "5rem" }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="font-display text-xl text-[#1a1a1a] mb-2">
                    {flavors[active].name}
                  </p>
                  <p className="text-[#8a837c] leading-relaxed max-w-xs">
                    {flavors[active].description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </FadeIn>

          {/* Right — image fixed in its own column, never moves */}
          <FadeIn delay={0.15} direction="right" className="flex justify-center mt-[10px]">
            <Image
              src="/assets/products/resonator/Timbre Selector.png"
              alt="Timbre selector — saw and square waveform modes"
              width={746}
              height={1297}
              style={{ width: "140px", height: "auto" }}
              className="rounded-xl shadow-lg"
            />
          </FadeIn>

        </div>
      </div>
    </section>
  )
}
