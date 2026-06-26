"use client"

import { useEffect, useState } from "react"
import FadeIn from "@/components/FadeIn"
import {
  type AccountUser,
  type Download,
  type License,
  getCurrentUser,
  onAuthChange,
  sendSignInLink,
  signOut,
  getLicenses,
  deriveDownloads,
} from "@/lib/account"

export default function AccountClient() {
  const [ready, setReady] = useState(false)
  const [user, setUser] = useState<AccountUser | null>(null)

  useEffect(() => {
    // resolve the current session, then keep in sync (covers the magic-link redirect)
    getCurrentUser().then((u) => {
      setUser(u)
      setReady(true)
    })
    return onAuthChange(setUser)
  }, [])

  return (
    <div className="pt-28 pb-24 px-6 max-w-2xl mx-auto">
      {!ready ? (
        <p className="text-[#8a837c] text-sm">loading…</p>
      ) : user ? (
        <Dashboard user={user} onSignOut={() => signOut()} />
      ) : (
        <SignIn />
      )}
    </div>
  )
}

// ── signed out ────────────────────────────────────────────────────────────────
function SignIn() {
  const [email, setEmail] = useState("")
  const [busy, setBusy] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (busy || !email.includes("@")) return
    setBusy(true)
    setError(null)
    try {
      await sendSignInLink(email.trim())
      setSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "something went wrong — try again.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <FadeIn>
      <h1 className="font-display text-6xl text-[#1a1a1a] mb-3">account</h1>
      <p className="text-[#8a837c] leading-relaxed mb-8">
        sign in to download your plugins and manage your licenses.
      </p>

      {sent ? (
        <div className="bg-[#edeae4] rounded-2xl p-8">
          <h2 className="font-display text-2xl text-[#1a1a1a] mb-2">check your email</h2>
          <p className="text-[#8a837c] text-sm leading-relaxed">
            we sent a sign-in link to <span className="text-[#1a1a1a]">{email}</span>. open it on
            this device to continue.
          </p>
          <button
            onClick={() => setSent(false)}
            className="mt-5 text-[#b85c3a] text-sm hover:underline"
          >
            use a different email
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="bg-[#edeae4] rounded-2xl p-8 space-y-4">
          <label className="block">
            <span className="text-[#1a1a1a] text-sm font-medium">email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-2 w-full rounded-xl border border-[#d8d4ce] bg-[#f5f2ed] px-4 py-3 text-sm text-[#1a1a1a] placeholder:text-[#b3ada5] outline-none focus:border-[#b85c3a] transition-colors"
            />
          </label>
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-[#b85c3a] px-4 py-3 text-sm text-[#f5f2ed] tracking-wide hover:bg-[#a04e30] transition-colors disabled:opacity-60"
          >
            {busy ? "sending link…" : "continue with email"}
          </button>
          {error && <p className="text-[#b85c3a] text-xs">{error}</p>}
          <p className="text-[#b3ada5] text-xs pt-1">
            we&apos;ll email you a sign-in link — no password needed.
          </p>
        </form>
      )}
    </FadeIn>
  )
}

// ── signed in ─────────────────────────────────────────────────────────────────
function Dashboard({
  user,
  onSignOut,
}: {
  user: AccountUser
  onSignOut: () => void
}) {
  const [downloads, setDownloads] = useState<Download[] | null>(null)
  const [licenses, setLicenses] = useState<License[] | null>(null)

  useEffect(() => {
    getLicenses().then((ls) => {
      setLicenses(ls)
      setDownloads(deriveDownloads(ls))
    })
  }, [user])

  return (
    <>
      <FadeIn>
        <h1 className="font-display text-6xl text-[#1a1a1a] mb-2">your account</h1>
        <div className="flex items-center justify-between mb-10">
          <p className="text-[#8a837c] text-sm">{user.email}</p>
          <button
            onClick={onSignOut}
            className="text-[#8a837c] text-sm hover:text-[#1a1a1a] transition-colors"
          >
            sign out
          </button>
        </div>
      </FadeIn>

      <FadeIn delay={0.05}>
        <Section title="downloads">
          {downloads === null ? (
            <Loading />
          ) : (
            downloads.map((d) => <DownloadRow key={d.slug} d={d} />)
          )}
        </Section>
      </FadeIn>

      <FadeIn delay={0.1}>
        <Section title="licenses">
          {licenses === null ? (
            <Loading />
          ) : licenses.length === 0 ? (
            <Empty>no licenses yet — paid plugins you buy will appear here.</Empty>
          ) : (
            licenses.map((l) => <LicenseRow key={l.id} l={l} />)
          )}
        </Section>
      </FadeIn>
    </>
  )
}

// ── pieces ────────────────────────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="font-display text-2xl text-[#1a1a1a] mb-4">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  )
}

function DownloadRow({ d }: { d: Download }) {
  return (
    <div className="bg-[#edeae4] rounded-2xl p-6 flex items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[#1a1a1a] font-medium">{d.name}</span>
          <span className="text-[#b3ada5] text-xs">v{d.version}</span>
          {d.free && (
            <span className="text-[#b85c3a] text-xs border border-[#b85c3a]/30 rounded-full px-2 py-0.5">
              free
            </span>
          )}
        </div>
        <p className="text-[#8a837c] text-sm mt-1">{d.tagline}</p>
      </div>
      <a
        href={d.href}
        className="shrink-0 rounded-xl bg-[#b85c3a] px-4 py-2.5 text-sm text-[#f5f2ed] hover:bg-[#a04e30] transition-colors"
      >
        download
      </a>
    </div>
  )
}

function LicenseRow({ l }: { l: License }) {
  return (
    <div className="bg-[#edeae4] rounded-2xl p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[#1a1a1a] font-medium">{l.product}</span>
            <span className="text-[#5a8a5a] text-xs border border-[#5a8a5a]/30 rounded-full px-2 py-0.5">
              {l.status}
            </span>
          </div>
          <p className="text-[#8a837c] text-sm mt-1">
            issued {l.issued} · {l.email}
          </p>
        </div>
        <a
          href={`data:text/plain;charset=utf-8,${encodeURIComponent(l.keyText)}`}
          download={`${l.product}.chorale-license`}
          className="shrink-0 rounded-xl border border-[#b85c3a] px-4 py-2.5 text-sm text-[#b85c3a] hover:bg-[#b85c3a] hover:text-[#f5f2ed] transition-colors"
        >
          license file
        </a>
      </div>
      <p className="text-[#b3ada5] text-xs mt-4 border-t border-[#d8d4ce] pt-4 leading-relaxed">
        to activate: open {l.product} in your daw, click the &quot;demo&quot; chip in the top
        bar, and select this license file.
      </p>
    </div>
  )
}

function Loading() {
  return <div className="text-[#8a837c] text-sm py-2">loading…</div>
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#edeae4] rounded-2xl p-6 text-[#8a837c] text-sm">{children}</div>
  )
}
