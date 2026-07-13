"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import TiltCard from "@/components/TiltCard"
import Button from "@/components/ui/Button"

export default function HeroSection() {
  return (
    <section className="relative grid grid-cols-1 lg:grid-cols-2 min-h-screen">
      {/* LEFT — text on the paper field */}
      <div className="flex items-center px-6 lg:px-12 pt-24 pb-12 lg:py-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="w-full max-w-md lg:ml-auto lg:mr-12"
        >
          <p className="text-xs tracking-[0.08em] uppercase font-mono text-muted mb-4">
            thony audio
          </p>
          <h1 className="font-display text-6xl sm:text-7xl text-ink leading-none">
            Resonator
          </h1>
          <p className="mt-6 font-display text-2xl text-accent italic leading-snug max-w-sm">
            Color your sounds with vibrant, tonal resonance.
          </p>
          <div className="mt-10 flex items-center gap-6">
            <Button href="/download/resonator" size="lg">
              get it free
            </Button>
            <a
              href="#demo"
              className="text-sm text-muted hover:text-ink transition-colors"
            >
              hear it first ↓
            </a>
          </div>
        </motion.div>
      </div>

      {/* RIGHT — plugin on the solid olive tone band (full-bleed) */}
      <div className="flex items-center justify-center px-6 lg:px-12 pt-12 pb-24 lg:py-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: "easeOut" }}
          className="w-full max-w-lg"
        >
          <TiltCard>
            <Image
              src="/assets/products/resonator/Resonator.png"
              alt="Resonator plugin"
              width={4396}
              height={3040}
              style={{ maxWidth: "100%", height: "auto", filter: "var(--plugin-shadow)" }}
              priority
            />
          </TiltCard>
        </motion.div>
      </div>
    </section>
  )
}
