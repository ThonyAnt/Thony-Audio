"use client"

import { useEffect, useId, useRef, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { products } from "@/data/products"

// The home and account links navigate through router.push instead of Link's own
// click path: Link marks itself "pending" with useOptimistic on click, and that
// optimistic update renders in the sync lane entangled with the navigation, which
// makes React skip the desk ⇄ notepad view transition for the whole commit
// ("view transitions" in globals.css). router.push has no such side effect.

// the plugins menu lists the products in desk order (Chorale on the left)
const MENU_ORDER = ["chorale", "resonator"]
const MENU = [...products].sort(
  (a, b) => (MENU_ORDER.indexOf(a.slug) + 1 || 99) - (MENU_ORDER.indexOf(b.slug) + 1 || 99),
)

export default function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const go = (href: string) => (e: { preventDefault: () => void }) => {
    e.preventDefault()
    router.push(href)
  }

  // (The old bento home rendered its own nav row; the cassette hero uses this one.)
  // The header is pinned during view transitions (site-header in globals.css).
  return (
    <header className="fixed top-0 left-0 right-0 z-50" style={{ viewTransitionName: "site-header" }}>
      <nav className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          onNavigate={go("/")}
          className="font-display text-xl text-ink tracking-wide hover:text-accent transition-colors"
        >
          thony audio
        </Link>

        <div className="flex items-center gap-8">
          <PluginsMenu active={pathname.startsWith("/plugins")} pathname={pathname} />
          <NavLink href="/support" active={pathname === "/support"}>
            support
          </NavLink>
          <NavLink href="/account" active={pathname.startsWith("/account")} onNavigate={go("/account")}>
            account
          </NavLink>
        </div>
      </nav>
    </header>
  )
}

/**
 * "plugins" is a dropdown: the products, one line each with the price, and a link
 * to the full page at the foot. Opens on hover with a short grace period so the
 * pointer can travel to it, on click/tap, and from the keyboard (Enter, Space,
 * ArrowDown); Escape, an outside click, or a navigation closes it.
 */
function PluginsMenu({ active, pathname }: { active: boolean; pathname: string }) {
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const closeTimer = useRef<number | null>(null)
  const id = useId()

  const cancelClose = () => {
    if (closeTimer.current !== null) window.clearTimeout(closeTimer.current)
    closeTimer.current = null
  }
  const show = () => { cancelClose(); setOpen(true) }
  const hideSoon = () => { cancelClose(); closeTimer.current = window.setTimeout(() => setOpen(false), 140) }

  // any navigation closes the menu
  useEffect(() => { setOpen(false) }, [pathname])
  // Escape and outside clicks close it
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false) }
    const onDown = (e: PointerEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(false) }
    window.addEventListener("keydown", onKey)
    window.addEventListener("pointerdown", onDown)
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("pointerdown", onDown) }
  }, [open])
  useEffect(() => cancelClose, [])

  // arrow keys walk the items
  const onMenuKey = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return
    e.preventDefault()
    const items = Array.from(root.current?.querySelectorAll<HTMLElement>("[role=menuitem]") ?? [])
    const i = items.indexOf(document.activeElement as HTMLElement)
    const next = e.key === "ArrowDown" ? (i + 1) % items.length : (i - 1 + items.length) % items.length
    items[next]?.focus()
  }

  return (
    <div
      ref={root}
      className="relative"
      onMouseEnter={show}
      onMouseLeave={hideSoon}
      onFocus={cancelClose}
      onBlur={(e) => { if (!root.current?.contains(e.relatedTarget as Node)) setOpen(false) }}
      onKeyDown={onMenuKey}
    >
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault()
            setOpen(true)
            requestAnimationFrame(() => root.current?.querySelector<HTMLElement>("[role=menuitem]")?.focus())
          }
        }}
        className={`inline-flex items-center gap-1 text-sm tracking-wide transition-colors ${
          active || open ? "text-accent" : "text-muted hover:text-ink"
        }`}
      >
        plugins
        <svg
          viewBox="0 0 10 10"
          className="h-2.5 w-2.5 transition-transform duration-200 ease-[var(--ease-soft)]"
          style={{ transform: open ? "rotate(180deg)" : "none" }}
          aria-hidden
        >
          <path d="M2 3.5 L5 6.5 L8 3.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* the menu: a small warm card hanging under the word, right-aligned to it */}
      <div
        id={id}
        role="menu"
        aria-label="plugins"
        className="absolute right-0 top-full mt-3 w-64 rounded border border-dark/10 bg-surface shadow-lg transition-[opacity,transform] duration-200 ease-[var(--ease-soft)]"
        style={{
          opacity: open ? 1 : 0,
          transform: open ? "translateY(0)" : "translateY(-4px)",
          visibility: open ? "visible" : "hidden",
          pointerEvents: open ? "auto" : "none",
        }}
      >
        {/* an invisible bridge so the pointer can cross the gap from the word to the card */}
        <div className="absolute -top-3 left-0 right-0 h-3" aria-hidden />
        <ul className="m-0 list-none p-1.5">
          {MENU.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/plugins/${p.slug}`}
                role="menuitem"
                tabIndex={open ? 0 : -1}
                className="group flex items-baseline justify-between gap-3 rounded px-3 py-2 outline-none transition-colors hover:bg-surface-hover focus-visible:bg-surface-hover"
              >
                <span className="min-w-0">
                  <span className="block font-display text-lg leading-tight text-ink lowercase">{p.name}</span>
                  <span className="block truncate text-xs text-faint lowercase">{p.tagline}</span>
                </span>
                <span className="shrink-0 font-mono text-[11px] text-faint group-hover:text-ink transition-colors">
                  {p.price === 0 ? "free" : `$${p.price}`}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="border-t border-line px-3 py-2">
          <Link
            href="/plugins"
            role="menuitem"
            tabIndex={open ? 0 : -1}
            className="text-xs text-muted hover:text-ink outline-none focus-visible:text-ink transition-colors"
          >
            all plugins →
          </Link>
        </div>
      </div>
    </div>
  )
}

function NavLink({
  href,
  active,
  onNavigate,
  children,
}: {
  href: string
  active: boolean
  onNavigate?: React.ComponentProps<typeof Link>["onNavigate"]
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      onNavigate={onNavigate}
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
