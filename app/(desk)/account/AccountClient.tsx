"use client"

import { useEffect, useState } from "react"
import FadeIn from "@/components/FadeIn"
import {
  type AccountUser,
  type Download,
  type License,
  getCurrentUser,
  onAuthChange,
  signInWithPassword,
  signUpWithPassword,
  sendSignInLink,
  sendPasswordReset,
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

  // neutral while resolving — avoids flashing the olive auth field at signed-in users
  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted text-sm">loading…</p>
      </div>
    )
  }

  // signed out → the imagiro olive auth field (SignIn brings its own shell)
  if (!user) return <SignIn />

  // signed in → the dashboard on the calm paper field
  return (
    <div className="pt-28 pb-24 px-6 max-w-2xl mx-auto">
      <Dashboard user={user} onSignOut={() => signOut()} />
    </div>
  )
}

// ── imagiro auth shell: a warm light card centered on the olive-green field ──────
function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-olive flex items-center justify-center px-6 pt-28 pb-16">
      <FadeIn className="w-full max-w-md">
        <div className="bg-surface rounded border border-dark/10 shadow-lg p-8 sm:p-10">
          {children}
        </div>
      </FadeIn>
    </div>
  )
}

function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-ink text-sm">{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-faint text-xs">{hint}</span>}
    </label>
  )
}

// imagiro inputs/buttons: 4px radius, dark hairline border, press-down on the CTA
const inputCls =
  "w-full rounded border border-dark/25 bg-cream px-4 py-3 text-sm text-ink placeholder:text-faint outline-none transition-colors focus:border-accent"
const btnCls =
  "w-full rounded bg-accent px-4 py-3.5 text-sm tracking-wide text-cream transition-[background-color,transform] duration-150 ease-[var(--ease-soft)] hover:bg-accent-hover active:translate-y-[var(--press)] disabled:opacity-85"

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
    <AuthShell>
      <h1 className="font-display text-4xl sm:text-5xl text-ink leading-[1.1] mb-3 lowercase">
        {title}
      </h1>
      <p className="text-muted text-sm leading-relaxed">{children}</p>
      <button onClick={onBack} className="mt-6 text-accent text-sm hover:underline">
        ← {backLabel}
      </button>
    </AuthShell>
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
        we sent a confirmation link to <span className="text-ink">{email}</span>. open it to verify
        your address, then come back and sign in.
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
        we sent a one-time sign-in link to <span className="text-ink">{email}</span>. open it on this
        device to continue.
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
        we sent a password-reset link to <span className="text-ink">{email}</span>. open it to choose
        a new password.
      </AuthNotice>
    )
  }

  // ── the form ──
  return (
    <AuthShell>
      <h1 className="font-display text-4xl sm:text-5xl text-ink leading-[1.1] mb-2 lowercase">
        {mode === "signin" ? "sign in" : "create account"}
      </h1>
      <p className="text-muted text-sm leading-relaxed mb-8">
        {mode === "signin"
          ? "sign in to download your plugins and manage your licenses."
          : "create an account to download your plugins and manage your licenses."}
      </p>

      <form onSubmit={submit} className="space-y-5">
        <Field label="email">
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={inputCls}
          />
        </Field>

        <div>
          <Field label="password" hint={mode === "signup" ? "at least 8 characters." : undefined}>
            <input
              type="password"
              required
              minLength={mode === "signup" ? 8 : undefined}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={inputCls}
            />
          </Field>
          {mode === "signin" && (
            <button
              type="button"
              onClick={forgotPassword}
              className="mt-2 block w-full text-right text-faint text-xs hover:text-ink transition-colors"
            >
              forgot password?
            </button>
          )}
        </div>

        <button type="submit" disabled={busy} className={btnCls}>
          {busy ? "…" : mode === "signin" ? "sign in" : "create account"}
        </button>

        {error && <p className="text-accent text-xs">{error}</p>}

        <div className="flex items-center justify-between gap-3 pt-1 text-xs">
          <button
            type="button"
            onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(null) }}
            className="text-muted hover:text-ink transition-colors"
          >
            {mode === "signin" ? "need an account? sign up" : "have an account? sign in"}
          </button>
          <button
            type="button"
            onClick={emailLink}
            className="text-accent hover:underline transition-colors"
          >
            email me a link instead
          </button>
        </div>
      </form>
    </AuthShell>
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
