"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import FadeIn from "@/components/FadeIn"

export default function PricingSection() {
  return (
    <section className="px-6 py-28 max-w-6xl mx-auto text-center">
      <div className="border-t border-[#d8d4ce] pt-20">
        <FadeIn>
          <p className="text-xs tracking-[0.3em] uppercase text-[#8a837c] mb-6">cost</p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h2 className="font-display text-8xl lg:text-[12rem] text-[#1a1a1a] leading-none">
            free.
          </h2>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="mt-8 text-[#8a837c] leading-relaxed max-w-md mx-auto">
            Yes, it&apos;s true — Resonator is completely free. We believe every producer should have access
            to this tool to fully explore and enhance their creative potential.
          </p>
        </FadeIn>

        <FadeIn delay={0.35}>
          <Link
            href="/download/resonator"
            className="mt-10 inline-block bg-[#1a1a1a] hover:bg-[#333] text-[#f5f2ed] px-12 py-4 rounded-full text-sm tracking-wide transition-colors"
          >
            download now
          </Link>
        </FadeIn>
      </div>
    </section>
  )
}
