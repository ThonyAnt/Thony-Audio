"use client"

import Image from "next/image"
import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { FeatureTab as FeatureTabType } from "@/types"
import Section from "@/components/Section"
import FeatureTab from "@/components/resonator/FeatureTab"

/**
 * imagiro feature overview: a row of tabs swaps a framed screenshot + centered caption.
 * Replaces the old sticky-scroll StickyFeatures. Driven by product.featureTabs.
 */
export default function FeatureOverview({ features }: { features: FeatureTabType[] }) {
  const [active, setActive] = useState(0)
  if (!features.length) return null
  const f = features[active]

  return (
    <Section title="feature overview">
      {/* tab row */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {features.map((feat, i) => (
          <FeatureTab key={feat.name} active={i === active} onClick={() => setActive(i)}>
            {feat.name}
          </FeatureTab>
        ))}
      </div>

      {/* framed screenshot + caption */}
      <div className="flex flex-col items-center gap-6">
        <div className="w-full max-w-3xl bg-cream rounded border border-ink/12 shadow-md overflow-hidden">
          <div className="relative h-[300px] sm:h-[360px] m-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={f.img}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.165, 0.84, 0.44, 1] }}
                className="absolute inset-0"
              >
                <Image src={f.img} alt={f.name} fill className="object-contain" sizes="768px" />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={f.name}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="max-w-md text-center"
          >
            <h3 className="font-display text-2xl text-ink mb-2">{f.name}</h3>
            <p className="text-sm text-muted leading-relaxed">{f.desc}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </Section>
  )
}
