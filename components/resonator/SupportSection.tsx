import Link from "next/link"
import FadeIn from "@/components/FadeIn"

export default function SupportSection() {
  return (
    <section className="px-6 py-28 max-w-6xl mx-auto">
      <div className="border-t border-[#d8d4ce] pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <FadeIn>
            <p className="text-xs tracking-[0.3em] uppercase text-[#8a837c] mb-4">support</p>
            <h2 className="font-display text-5xl lg:text-6xl text-[#1a1a1a] leading-tight">
              we&apos;re here
            </h2>
            <p className="mt-5 text-[#8a837c] leading-relaxed max-w-sm">
              Something not working? Questions about compatibility? Reach out — we read everything
              and respond personally.
            </p>
            <Link
              href="/support"
              className="mt-8 inline-block border border-[#b85c3a] text-[#b85c3a] hover:bg-[#b85c3a] hover:text-[#f5f2ed] px-8 py-3 rounded-full text-sm tracking-wide transition-colors"
            >
              get support
            </Link>
          </FadeIn>

          <FadeIn delay={0.15} direction="right">
            <div className="bg-[#edeae4] rounded-2xl p-8">
              <p className="font-display text-2xl text-[#1a1a1a] mb-6">quick links</p>
              <ul className="space-y-3 text-sm text-[#8a837c]">
                {[
                  ["How do I install?", "/support"],
                  ["Which DAWs are supported?", "/support"],
                  ["VST3 · AU · AAX formats", "/support"],
                  ["Report a bug", "/support"],
                ].map(([label, href]) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="flex items-center justify-between group hover:text-[#1a1a1a] transition-colors"
                    >
                      <span>{label}</span>
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[#b85c3a]">
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
