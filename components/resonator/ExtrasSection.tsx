import FadeIn from "@/components/FadeIn"

const extras = [
  {
    title: "Presets",
    body: "Store all your settings in a preset, allowing you to load your favorite chord progressions on the fly across projects.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
        <polyline points="17 21 17 13 7 13 7 21" />
        <polyline points="7 3 7 8 15 8" />
      </svg>
    ),
  },
  {
    title: "Lifetime Updates",
    body: "Once you own Resonator, updates will be free forever.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 4 23 10 17 10" />
        <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
      </svg>
    ),
  },
]

export default function ExtrasSection() {
  return (
    <section className="px-6 py-28 bg-[#edeae4]">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <p className="text-xs tracking-[0.3em] uppercase text-[#8a837c] mb-4">what else?</p>
          <h2 className="font-display text-5xl lg:text-6xl text-[#1a1a1a] leading-tight">
            built to last
          </h2>
        </FadeIn>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {extras.map((item, i) => (
            <FadeIn key={item.title} delay={i * 0.1}>
              <div className="bg-[#f5f2ed] rounded-2xl p-8 h-full">
                <div className="w-10 h-10 rounded-xl bg-[#edeae4] flex items-center justify-center text-[#b85c3a] mb-6">
                  {item.icon}
                </div>
                <h3 className="font-display text-2xl text-[#1a1a1a] mb-3">{item.title}</h3>
                <p className="text-[#8a837c] leading-relaxed text-sm">{item.body}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
