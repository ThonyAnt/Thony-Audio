"use client"

import { ReactNode } from "react"

/**
 * imagiro feature/toggle pill. Inactive = bordered cream; active = olive fill + light text
 * + inset shadow. Presses down 1px on :active. Optional corner badge.
 */
export default function FeatureTab({
  active = false,
  badge,
  onClick,
  children,
}: {
  active?: boolean
  badge?: string
  onClick?: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`relative rounded border px-4 py-2 text-sm tracking-wide transition-[transform,background-color,color] duration-200 active:translate-y-[1px] hover:underline ${
        active
          ? "bg-olive text-cream border-olive inset-shadow-sm"
          : "bg-cream text-muted border-ink/12"
      }`}
    >
      {children}
      {badge && (
        <span className="absolute -top-2 -left-2 bg-accent text-cream text-xs leading-tight rounded-md px-1.5 py-0.5">
          {badge}
        </span>
      )}
    </button>
  )
}
