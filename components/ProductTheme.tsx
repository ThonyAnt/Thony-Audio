"use client"

import { CSSProperties, ReactNode, useEffect } from "react"
import { ProductAccent } from "@/types"

/**
 * Apply a product's accent (--color-accent / --color-accent-hover) to <html> while the
 * given accent is active, reverting on change/unmount. Global on purpose: the nav and
 * footer live outside any page subtree, so a scoped wrapper can't reach them.
 *
 * Reusable — product pages drive it via ProductTheme; the home carousel calls it directly
 * with the active slide's accent. Generalizable: any product with an `accent` re-themes.
 */
export function useAccentColor(accent?: ProductAccent) {
  useEffect(() => {
    if (!accent) return
    const root = document.documentElement
    root.style.setProperty("--color-accent", accent.fg)
    root.style.setProperty("--color-accent-hover", accent.hover ?? accent.fg)
    return () => {
      root.style.removeProperty("--color-accent")
      root.style.removeProperty("--color-accent-hover")
    }
  }, [accent])
}

/**
 * Per-product page theming. Applies the accent globally (see useAccentColor) and, if a
 * surface `bg` is given, tints --color-surface on the product's own content subtree.
 * Products with no `accent` render untouched (default terracotta).
 */
export default function ProductTheme({
  accent,
  children,
}: {
  accent?: ProductAccent
  children: ReactNode
}) {
  useAccentColor(accent)
  if (!accent?.bg) return <>{children}</>
  return <div style={{ "--color-surface": accent.bg } as CSSProperties}>{children}</div>
}
