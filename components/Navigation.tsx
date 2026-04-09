"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Navigation() {
  const pathname = usePathname()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#f5f2ed]/90 backdrop-blur-sm border-b border-[#d8d4ce]">
      <nav className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="font-display text-xl text-[#1a1a1a] tracking-wide hover:text-[#b85c3a] transition-colors"
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
          ? "text-[#b85c3a]"
          : "text-[#8a837c] hover:text-[#1a1a1a]"
      }`}
    >
      {children}
    </Link>
  )
}
