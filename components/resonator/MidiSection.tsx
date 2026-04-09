import FadeIn from "@/components/FadeIn"

export default function MidiSection() {
  return (
    <section className="px-6 py-28 bg-[#1a1a1a]">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <p className="text-xs tracking-[0.3em] uppercase text-[#8a837c] mb-4">midi</p>
          <h2 className="font-display text-5xl lg:text-6xl text-[#f5f2ed] leading-tight max-w-lg">
            play it live
          </h2>
          <p className="mt-6 text-[#8a837c] leading-relaxed max-w-md">
            Enable MIDI input and Resonator follows your keyboard in real time — resonating
            whatever notes you play, turning any sound into a tuned instrument.
          </p>
        </FadeIn>
      </div>
    </section>
  )
}
