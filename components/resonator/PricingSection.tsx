"use client"

import FadeIn from "@/components/FadeIn"
import Section from "@/components/Section"
import Button from "@/components/ui/Button"

export default function PricingSection() {
  return (
    <Section className="text-center">
      <div className="border-t border-line pt-20">
        <FadeIn>
          <p className="text-xs tracking-[0.08em] uppercase font-mono text-muted mb-6">cost</p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h2 className="font-display text-8xl lg:text-[12rem] text-ink leading-none">
            free.
          </h2>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="mt-8 text-muted leading-relaxed max-w-md mx-auto">
            Yes, it&apos;s true — Resonator is completely free. We believe every producer should have access
            to this tool to fully explore and enhance their creative potential.
          </p>
        </FadeIn>

        <FadeIn delay={0.35}>
          <div className="mt-10">
            <Button href="/download/resonator" size="lg">
              download now
            </Button>
          </div>
        </FadeIn>
      </div>
    </Section>
  )
}
