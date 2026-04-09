"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"

export default function HeroSection() {
  return (
    <section className="min-h-screen flex items-center px-6 pt-14 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full py-20">
        {/* Left */}
        <div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-xs tracking-[0.3em] uppercase text-[#8a837c] mb-4"
          >
            thony audio
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            className="font-display text-7xl sm:text-8xl lg:text-9xl text-[#1a1a1a] leading-none"
          >
            Resonator
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-6 font-display text-2xl text-[#b85c3a] italic leading-snug max-w-sm"
          >
            Color your sounds with vibrant, tonal resonance.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-10 flex items-center gap-6"
          >
            <Link
              href="/download/resonator"
              className="bg-[#1a1a1a] hover:bg-[#333] text-[#f5f2ed] px-9 py-4 rounded-full text-sm tracking-wide transition-colors"
            >
              get it free
            </Link>
            <a
              href="#demo"
              className="text-sm text-[#8a837c] hover:text-[#1a1a1a] transition-colors"
            >
              hear it first ↓
            </a>
          </motion.div>
        </div>

        {/* Right — plugin screenshot */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
          className="flex items-center justify-center"
        >
          <Image
            src="/assets/products/resonator/Resonator.png"
            alt="Resonator plugin"
            width={4396}
            height={3040}
            style={{ maxWidth: "100%", height: "auto", filter: "drop-shadow(0 24px 48px rgba(0,0,0,0.18))" }}
            priority
          />
        </motion.div>
      </div>
    </section>
  )
}
