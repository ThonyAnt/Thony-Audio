"use client"

import { useState } from "react"
import FadeIn from "@/components/FadeIn"
import Section from "@/components/Section"
import { Demo } from "@/types"

const fallback: Demo[] = [{ label: "demo 1" }, { label: "demo 2" }, { label: "demo 3" }]

function AudioPlayer({ demo, index }: { demo: Demo; index: number }) {
  const [playing, setPlaying] = useState(false)
  const [progress] = useState(0) // cosmetic until real audio is wired

  return (
    <FadeIn delay={index * 0.1}>
      <div className="bg-dark text-cream rounded p-4 flex items-center gap-4 border border-black/20">
        {/* Play button — terracotta circle */}
        <button
          onClick={() => setPlaying((p) => !p)}
          className="w-11 h-11 rounded-full bg-accent hover:bg-accent-hover flex items-center justify-center shrink-0 transition-colors"
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? (
            <svg width="14" height="14" viewBox="0 0 24 24" className="fill-cream">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" className="fill-cream">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          )}
        </button>

        {/* Label + waveform (recolored for the dark bar) */}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-cream/90 mb-2">{demo.label}</p>
          <div className="relative h-7 flex items-center gap-0.5">
            {Array.from({ length: 48 }, (_, i) => {
              const h = 20 + Math.sin(i * 0.7) * 14 + Math.sin(i * 1.3) * 8
              const filled = (i / 48) * 100 <= progress
              return (
                <div
                  key={i}
                  className="flex-1 rounded-full"
                  style={{
                    height: `${h.toFixed(2)}%`,
                    backgroundColor: filled
                      ? "var(--color-accent)"
                      : "color-mix(in oklab, var(--color-cream) 22%, transparent)",
                  }}
                />
              )
            })}
          </div>
        </div>

        <span className="text-xs font-mono text-cream/70 shrink-0">0:00</span>
      </div>
    </FadeIn>
  )
}

export default function AudioSection({ demos = fallback }: { demos?: Demo[] }) {
  return (
    <Section id="demo" tone="panel">
      <div className="text-center mb-12">
        <p className="text-xs tracking-[0.08em] uppercase font-mono text-muted mb-4">audio demos</p>
        <h2 className="font-display text-4xl sm:text-5xl text-ink">hear it</h2>
        <p className="mt-4 text-sm text-muted max-w-sm mx-auto">Listen to what Resonator can do.</p>
      </div>

      <div className="space-y-4 max-w-3xl mx-auto">
        {demos.map((demo, i) => (
          <AudioPlayer key={demo.label} demo={demo} index={i} />
        ))}
      </div>

      <FadeIn delay={0.3}>
        <p className="mt-6 text-center text-xs text-muted/60 italic">
          audio files coming soon — placeholders shown above
        </p>
      </FadeIn>
    </Section>
  )
}
