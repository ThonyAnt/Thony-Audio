"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import FadeIn from "@/components/FadeIn"

const demos = [
  { id: 1, title: "Demo 1", description: "Audio demo placeholder" },
  { id: 2, title: "Demo 2", description: "Audio demo placeholder" },
  { id: 3, title: "Demo 3", description: "Audio demo placeholder" },
]

function AudioPlayer({ demo, index }: { demo: typeof demos[0]; index: number }) {
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)

  return (
    <FadeIn delay={index * 0.1}>
      <div className="bg-[#edeae4] rounded-2xl p-6 flex items-center gap-5">
        {/* Play button */}
        <button
          onClick={() => setPlaying((p) => !p)}
          className="w-12 h-12 rounded-full bg-[#b85c3a] hover:bg-[#a04e30] flex items-center justify-center shrink-0 transition-colors"
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#f5f2ed">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#f5f2ed">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          )}
        </button>

        {/* Info + waveform */}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-[#1a1a1a] font-medium mb-3">{demo.title}</p>

          {/* Waveform placeholder */}
          <div className="relative h-8 flex items-center gap-0.5">
            {Array.from({ length: 48 }, (_, i) => {
              const h = 20 + Math.sin(i * 0.7) * 14 + Math.sin(i * 1.3) * 8
              const filled = (i / 48) * 100 <= progress
              return (
                <div
                  key={i}
                  className="flex-1 rounded-full transition-colors"
                  style={{
                    height: `${h}%`,
                    backgroundColor: filled ? "#b85c3a" : "#d8d4ce",
                  }}
                />
              )
            })}
          </div>
        </div>

        <span className="text-xs text-[#8a837c] shrink-0">0:00</span>
      </div>
    </FadeIn>
  )
}

export default function AudioSection() {
  return (
    <section id="demo" className="px-6 py-28 bg-[#edeae4]">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <p className="text-xs tracking-[0.3em] uppercase text-[#8a837c] mb-4">audio demos</p>
          <h2 className="font-display text-5xl lg:text-6xl text-[#1a1a1a] leading-tight">
            hear it
          </h2>
          <p className="mt-5 text-[#8a837c] leading-relaxed max-w-sm">
            Listen to what Resonator can do!
          </p>
        </FadeIn>

        <div className="mt-14 space-y-4">
          {demos.map((demo, i) => (
            <AudioPlayer key={demo.id} demo={demo} index={i} />
          ))}
        </div>

        <FadeIn delay={0.3}>
          <p className="mt-6 text-xs text-[#8a837c]/60 italic">
            audio files coming soon — placeholders shown above
          </p>
        </FadeIn>
      </div>
    </section>
  )
}
