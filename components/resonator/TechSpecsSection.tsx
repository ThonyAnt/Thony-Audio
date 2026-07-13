import Section from "@/components/Section"
import { SpecRow } from "@/types"

/**
 * imagiro tech-specs sheet — a dark card with mono rows: LABEL · dotted leader · value.
 * Driven by product.specs.
 */
export default function TechSpecsSection({ specs }: { specs: SpecRow[] }) {
  if (!specs.length) return null

  return (
    <Section title="tech specs" tone="tan">
      <div className="bg-dark text-cream rounded max-w-lg mx-auto p-6 font-mono">
        {specs.map((row) => (
          <div key={row.label} className="flex items-center gap-4 py-1.5">
            <span className="text-xs font-bold uppercase tracking-wide whitespace-nowrap">
              {row.label}
            </span>
            <span className="flex-1 border-t border-dotted border-cream/30" />
            <span className="text-xs text-right whitespace-nowrap">{row.value}</span>
          </div>
        ))}
      </div>
    </Section>
  )
}
