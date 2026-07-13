import Link from "next/link"
import FadeIn from "@/components/FadeIn"
import Section from "@/components/Section"
import Button from "@/components/ui/Button"

export default function SupportSection() {
  return (
    <Section tone="panel">
      <div className="border-t border-line pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <FadeIn>
            <p className="text-xs tracking-[0.08em] uppercase font-mono text-muted mb-4">support</p>
            <h2 className="font-display text-4xl sm:text-5xl text-ink leading-tight">
              we&apos;re here
            </h2>
            <p className="mt-5 text-muted leading-relaxed max-w-sm">
              Something not working? Questions about compatibility? Reach out — we read everything
              and respond personally.
            </p>
            <div className="mt-8">
              <Button href="/support" variant="outline">
                get support
              </Button>
            </div>
          </FadeIn>

          <FadeIn delay={0.15} direction="right">
            <div className="bg-surface rounded border border-ink/15 p-8">
              <p className="font-display text-2xl text-ink mb-6">quick links</p>
              <ul className="space-y-3 text-sm text-muted">
                {[
                  ["How do I install?", "/support"],
                  ["Which DAWs are supported?", "/support"],
                  ["VST3 · AU · AAX formats", "/support"],
                  ["Report a bug", "/support"],
                ].map(([label, href]) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="flex items-center justify-between group hover:text-ink transition-colors"
                    >
                      <span>{label}</span>
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity text-accent">
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
    </Section>
  )
}
