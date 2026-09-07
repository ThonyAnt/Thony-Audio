"use client"

import { useEffect, useState, useSyncExternalStore } from "react"
import FadeIn from "@/components/FadeIn"
import Notepad, { DeskStage } from "@/components/desk/Notepad"
import {
  type AccountUser,
  type Download,
  type License,
  getCurrentUser,
  likelySignedIn,
  onAuthChange,
  signInWithPassword,
  signUpWithPassword,
  sendSignInLink,
  sendPasswordReset,
  signOut,
  getLicenses,
  deriveDownloads,
} from "@/lib/account"

const noSubscribe = () => () => {}

export default function AccountClient() {
  const [ready, setReady] = useState(false)
  const [user, setUser] = useState<AccountUser | null>(null)
  // a synchronous guess, so a visitor gets the notepad on the very first frame (and the
  // route transition can carry it in) while a member sees an empty desk until resolved
  const member = useSyncExternalStore(noSubscribe, likelySignedIn, () => true)

  useEffect(() => {
    // resolve the current session, then keep in sync (covers the magic-link redirect)
    getCurrentUser().then((u) => {
      setUser(u)
      setReady(true)
    })
    return onAuthChange(setUser)
  }, [])

  // the empty desk while resolving — avoids flashing the notepad at signed-in users
  if (!ready && member) return <DeskStage>{null}</DeskStage>

  // signed out → the notepad on the desk
  if (!user) return <SignIn />

  // signed in → the dashboard, on a cream sheet on the desk for now
  return (
    <div className="relative z-[2] mx-auto max-w-2xl px-6 pt-28 pb-24">
      <div className="rounded bg-cream/95 px-8 py-10 shadow-lg">
        <Dashboard user={user} onSignOut={() => signOut()} />
      </div>
    </div>
  )
}

// ── the notepad page: a dated sheet with a title and whatever is written under it ──
function Page({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <DeskStage>
      <Notepad>
        <div className="notepad-page">
          <Dateline />
          <h1 className="notepad-title">{title}</h1>
          {children}
        </div>
      </Notepad>
    </DeskStage>
  )
}

// today's date, pencilled in the corner. Written after mount so the static shell and
// the browser never disagree on what day it is.
function Dateline() {
  const [date, setDate] = useState("")
  useEffect(() => {
    setDate(new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }).toLowerCase())
  }, [])
  return <span className="notepad-date" aria-hidden>{date}</span>
}

// the pen-drawn circle around the submit
function Circle() {
  return (
    <svg viewBox="0 0 140 52" preserveAspectRatio="none" aria-hidden focusable="false">
      <path d="M12 27 C 8 8, 60 3, 96 6 C 135 9, 142 30, 118 43 C 90 54, 20 52, 8 36 C 2 28, 14 14, 40 10" />
    </svg>
  )
}

// reused on the post-action confirmation screens
function AuthNotice({
  title,
  children,
  onBack,
  backLabel,
}: {
  title: string
  children: React.ReactNode
  onBack: () => void
  backLabel: string
}) {
  return (
    <Page title={title}>
      <p className="notepad-sub">{children}</p>
      <div className="notepad-foot">
        <button type="button" onClick={onBack}>← {backLabel}</button>
      </div>
    </Page>
  )
}

// ── signed out ────────────────────────────────────────────────────────────────
function SignIn() {
  const [mode, setMode] = useState<"signin" | "signup">("signin")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmSent, setConfirmSent] = useState(false)
  const [linkSent, setLinkSent] = useState(false)
  const [resetSent, setResetSent] = useState(false)

  const validEmail = email.includes("@")

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (busy || !validEmail || !password) return
    if (mode === "signup" && password.length < 8) {
      setError("password must be at least 8 characters.")
      return
    }
    setBusy(true)
    setError(null)
    try {
      if (mode === "signup") {
        const { needsConfirmation } = await signUpWithPassword(email.trim(), password)
        if (needsConfirmation) setConfirmSent(true)
        // otherwise onAuthChange swaps us to the dashboard
      } else {
        await signInWithPassword(email.trim(), password)
        // onAuthChange swaps us to the dashboard on success
      }
    } catch (err) {
      setError(authMessage(err))
    } finally {
      setBusy(false)
    }
  }

  async function emailLink() {
    if (busy) return
    if (!validEmail) {
      setError("enter your email first.")
      return
    }
    setBusy(true)
    setError(null)
    try {
      await sendSignInLink(email.trim())
      setLinkSent(true)
    } catch (err) {
      setError(authMessage(err))
    } finally {
      setBusy(false)
    }
  }

  async function forgotPassword() {
    if (busy) return
    if (!validEmail) {
      setError("enter your email first.")
      return
    }
    setBusy(true)
    setError(null)
    try {
      await sendPasswordReset(email.trim())
      setResetSent(true)
    } catch (err) {
      setError(authMessage(err))
    } finally {
      setBusy(false)
    }
  }

  // ── post-submit confirmation screens ──
  if (confirmSent) {
    return (
      <AuthNotice
        title="confirm your email"
        onBack={() => { setConfirmSent(false); setMode("signin") }}
        backLabel="back to sign in"
      >
        we sent a confirmation link to <b>{email}</b>. open it to verify your address, then come
        back and sign in.
      </AuthNotice>
    )
  }

  if (linkSent) {
    return (
      <AuthNotice
        title="check your email"
        onBack={() => setLinkSent(false)}
        backLabel="use a password instead"
      >
        we sent a one-time sign-in link to <b>{email}</b>. open it on this device to continue.
      </AuthNotice>
    )
  }

  if (resetSent) {
    return (
      <AuthNotice
        title="check your email"
        onBack={() => setResetSent(false)}
        backLabel="back to sign in"
      >
        we sent a password-reset link to <b>{email}</b>. open it to choose a new password.
      </AuthNotice>
    )
  }

  // ── the form ──
  const signin = mode === "signin"
  return (
    <Page title={signin ? "sign in" : "create account"}>
      <p className="notepad-sub">
        {signin
          ? "to download your plugins and manage your licenses."
          : "to download your plugins and manage your licenses."}
      </p>

      <form onSubmit={submit}>
        <div className="notepad-row">
          <label htmlFor="account-email">email</label>
          <input
            id="account-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>

        <div className="notepad-row">
          <label htmlFor="account-password">password</label>
          <input
            id="account-password"
            type="password"
            required
            minLength={signin ? undefined : 8}
            autoComplete={signin ? "current-password" : "new-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>
        {signin ? (
          <button type="button" className="notepad-note" onClick={forgotPassword}>
            forgot it?
          </button>
        ) : (
          <span className="notepad-note" style={{ cursor: "default" }}>at least 8 characters</span>
        )}

        <button type="submit" disabled={busy} className="notepad-go">
          {busy ? "…" : signin ? "sign in →" : "create account →"}
          <Circle />
        </button>

        {error && <p className="notepad-error">{error}</p>}

        <div className="notepad-foot">
          <button
            type="button"
            onClick={() => { setMode(signin ? "signup" : "signin"); setError(null) }}
          >
            {signin ? "need an account? sign up" : "have an account? sign in"}
          </button>
          <button type="button" className="is-link" onClick={emailLink}>
            email me a link instead
          </button>
        </div>
      </form>
    </Page>
  )
}

// Map Supabase auth errors to short, human messages.
function authMessage(err: unknown): string {
  const m = err instanceof Error ? err.message : ""
  if (/invalid login credentials/i.test(m)) return "wrong email or password."
  if (/email not confirmed/i.test(m)) return "confirm your email first — check your inbox."
  if (/already registered|already exists|user already/i.test(m))
    return "that email already has an account — sign in instead."
  if (/password should be at least|at least 8/i.test(m)) return "password is too short."
  return m || "something went wrong — try again."
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
        <h1 className="font-display text-6xl text-ink mb-2">your account</h1>
        <div className="flex items-center justify-between mb-10">
          <p className="text-muted text-sm">{user.email}</p>
          <button
            onClick={onSignOut}
            className="text-muted text-sm hover:text-ink transition-colors"
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
      <h2 className="font-display text-2xl text-ink mb-4">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  )
}

function DownloadRow({ d }: { d: Download }) {
  return (
    <div className="bg-surface rounded-2xl p-6 flex items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-ink font-medium">{d.name}</span>
          <span className="text-faint text-xs">v{d.version}</span>
          {d.free && (
            <span className="text-accent text-xs border border-accent/30 rounded-[3px] px-2 py-0.5 font-mono">
              free
            </span>
          )}
        </div>
        <p className="text-muted text-sm mt-1">{d.tagline}</p>
      </div>
      <a
        href={d.href}
        className="shrink-0 rounded-xl bg-accent px-4 py-2.5 text-sm text-cream hover:bg-accent-hover transition-colors"
      >
        download
      </a>
    </div>
  )
}

function LicenseRow({ l }: { l: License }) {
  return (
    <div className="bg-surface rounded-2xl p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-ink font-medium">{l.product}</span>
            <span className="text-success text-xs border border-success/30 rounded-[3px] px-2 py-0.5 font-mono">
              {l.status}
            </span>
          </div>
          <p className="text-muted text-sm mt-1">
            issued {l.issued} · {l.email}
          </p>
        </div>
        <a
          href={`data:text/plain;charset=utf-8,${encodeURIComponent(l.keyText)}`}
          download={`${l.product}.chorale-license`}
          className="shrink-0 rounded-xl border border-accent px-4 py-2.5 text-sm text-accent hover:bg-accent hover:text-cream transition-colors"
        >
          license file
        </a>
      </div>
      <p className="text-faint text-xs mt-4 border-t border-line pt-4 leading-relaxed">
        to activate: open {l.product} in your daw, click the &quot;demo&quot; chip in the top
        bar, and select this license file.
      </p>
    </div>
  )
}

function Loading() {
  return <div className="text-muted text-sm py-2">loading…</div>
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-surface rounded-2xl p-6 text-muted text-sm">{children}</div>
  )
}
