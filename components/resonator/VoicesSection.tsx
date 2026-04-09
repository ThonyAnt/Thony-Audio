"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import Image from "next/image"
import FadeIn from "@/components/FadeIn"

const notes = ["C", "E", "G", "B♭", "D", "F", "A"]
const colors = [
  "#b85c3a", "#c46b47", "#d07a54", "#c8856a", "#be9080", "#a89990", "#8a837c",
]

export default function VoicesSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section className="px-6 py-28 bg-[#edeae4]">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <p className="text-xs tracking-[0.3em] uppercase text-[#8a837c] mb-4">voices</p>
          <h2 className="font-display text-5xl lg:text-6xl text-[#1a1a1a] leading-tight">
            resonate your sound
          </h2>
          <p className="mt-5 text-[#8a837c] leading-relaxed max-w-md">
            Stack up to 7 independent pitch voices to create complex harmonies.
          </p>
        </FadeIn>


        {/* Pitch Panel — very wide image, full width */}
        <FadeIn className="mt-16" delay={0.3}>
          <Image
            src="/assets/products/resonator/Pitch Panel.png"
            alt="Pitch panel showing 7 voice slots"
            width={2998}
            height={1293}
            style={{ maxWidth: "100%", height: "auto" }}
            className="shadow-xl rounded-xl"
          />
        </FadeIn>
      </div>
    </section>
  )
}
