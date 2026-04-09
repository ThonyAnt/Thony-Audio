import Image from "next/image"
import FadeIn from "@/components/FadeIn"

export default function ChordsSection() {
  return (
    <section className="px-6 py-20 max-w-6xl mx-auto">
      <div className="border-t border-[#d8d4ce] pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left — text */}
          <FadeIn>
            <p className="text-xs tracking-[0.3em] uppercase text-[#8a837c] mb-4">chord progression</p>
            <h2 className="font-display text-5xl lg:text-6xl text-[#1a1a1a] leading-tight mb-8">
              create chord progressions
            </h2>
            <p className="text-[#8a837c] leading-relaxed max-w-sm">
              Store chords in up to 8 modules. Switch between them mid-track to build a living,
              evolving harmonic progression.
            </p>
          </FadeIn>

          {/* Right — image fixed in its own column */}
          <FadeIn delay={0.15} direction="right" className="flex justify-center mt-[10px]">
            <Image
              src="/assets/products/resonator/Chord Selector.png"
              alt="Chord selector — 8 chord modules"
              width={588}
              height={1382}
              style={{ width: "100px", height: "auto" }}
              className="rounded-xl shadow-lg"
            />
          </FadeIn>

        </div>
      </div>
    </section>
  )
}
