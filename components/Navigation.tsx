"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Navigation() {
  const pathname = usePathname()

  // The home page renders its own bento nav row (components/BentoShowcase.tsx).
  if (pathname === "/") return null

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="font-display text-xl text-ink tracking-wide hover:text-accent transition-colors"
        >
          thony audio
        </Link>

        <div className="flex items-center gap-8">
          <NavLink href="/plugins" active={pathname.startsWith("/plugins")}>
            plugins
          </NavLink>
          <NavLink href="/support" active={pathname === "/support"}>
            support
          </NavLink>
          <NavLink href="/account" active={pathname.startsWith("/account")}>
            account
          </NavLink>
        </div>
      </nav>
    </header>
  )
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string
  active: boolean
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className={`text-sm tracking-wide transition-colors ${
        active
          ? "text-accent"
          : "text-muted hover:text-ink"
      }`}
    >
      {children}
    </Link>
  )
}
