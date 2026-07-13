import { ReactNode } from "react"

type BadgeTone = "new" | "updated" | "dark"

/**
 * Tiny status pill — the ONE place pills are allowed (imagiro convention).
 * "new!" = terracotta, "updated!" = olive (inset), "dark" = near-black.
 */
export default function Badge({
  tone = "new",
  children,
  className = "",
}: {
  tone?: BadgeTone
  children: ReactNode
  className?: string
}) {
  const tones: Record<BadgeTone, string> = {
    new: "bg-accent text-cream",
    updated: "bg-olive text-cream inset-shadow-sm",
    dark: "bg-dark text-cream",
  }
  return (
    <span
      className={`inline-block font-mono text-xs leading-tight rounded-md px-1.5 py-0.5 whitespace-nowrap ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  )
}
