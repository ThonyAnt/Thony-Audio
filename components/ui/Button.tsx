"use client"

import Link from "next/link"
import { MouseEventHandler, ReactNode } from "react"

type Variant = "primary" | "outline" | "link"
type Size = "md" | "lg"

/* De-pilled (4px radius) + the imagiro signature press: nudges down 3px on :active.
   primary = Thony's ink→accent CTA; outline inverts to olive on hover; link = inline accent. */
const base =
  "inline-flex items-center justify-center gap-2 rounded tracking-wide transition-[transform,background-color,color] duration-200 active:translate-y-[var(--press)]"

const variants: Record<Variant, string> = {
  primary: "bg-ink hover:bg-accent text-cream",
  outline: "bg-cream border border-ink text-ink hover:bg-olive hover:border-olive hover:text-cream",
  link: "text-accent hover:underline",
}

const sizes: Record<Size, string> = {
  md: "px-8 py-3.5 text-sm",
  lg: "px-9 py-4 text-base",
}

export default function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  href,
  external = false,
  onClick,
  type = "button",
  ariaLabel,
  className = "",
  children,
}: {
  variant?: Variant
  size?: Size
  fullWidth?: boolean
  href?: string
  external?: boolean
  onClick?: MouseEventHandler
  type?: "button" | "submit"
  ariaLabel?: string
  className?: string
  children: ReactNode
}) {
  const cls = [
    base,
    variants[variant],
    variant === "link" ? "active:translate-y-0" : sizes[size],
    fullWidth ? "w-full" : "",
    className,
  ].join(" ")

  if (href) {
    return external ? (
      <a href={href} className={cls} onClick={onClick} aria-label={ariaLabel}>
        {children}
      </a>
    ) : (
      <Link href={href} className={cls} onClick={onClick} aria-label={ariaLabel}>
        {children}
      </Link>
    )
  }
  return (
    <button type={type} className={cls} onClick={onClick} aria-label={ariaLabel}>
      {children}
    </button>
  )
}
