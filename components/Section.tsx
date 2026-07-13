import { ReactNode } from "react"

type Tone = "paper" | "panel" | "tan" | "olive" | "dark"

/* Full-bleed background tone. "paper" = transparent so the global grain shows through;
   the others are SOLID and occlude the grain — alternate them down the page for variety. */
const toneBg: Record<Tone, string> = {
  paper: "",
  panel: "bg-surface",
  tan: "bg-tan",
  olive: "bg-olive",
  dark: "bg-dark",
}

/**
 * imagiro section rhythm. Full-bleed tone background + centered content capped at ~1024px
 * with a 96px (py-24) rhythm. `bordered` adds rectangular sectioning lines (top+bottom).
 */
export default function Section({
  title,
  children,
  tone = "paper",
  bordered = false,
  className = "",
  id,
}: {
  title?: string
  children: ReactNode
  tone?: Tone
  bordered?: boolean
  className?: string
  id?: string
}) {
  const dark = tone === "olive" || tone === "dark"

  return (
    <section
      id={id}
      className={`${toneBg[tone]} ${dark ? "text-cream" : ""} ${
        bordered ? "border-y border-ink/15" : ""
      }`}
    >
      <div className={`max-w-5xl mx-auto px-6 py-24 ${className}`}>
        {title && (
          <h2
            className={`font-display text-4xl sm:text-5xl text-center mb-12 ${
              dark ? "text-cream" : "text-ink"
            }`}
          >
            {title}
          </h2>
        )}
        {children}
      </div>
    </section>
  )
}
