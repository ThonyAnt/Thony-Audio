"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { EmailOtpType } from "@supabase/supabase-js"
import FadeIn from "@/components/FadeIn"
import { supabase } from "@/lib/supabase"
import { updatePassword } from "@/lib/account"

type Phase = "verifying" | "form" | "saving" | "done" | "error"

/**
 * Password reset. The recovery link from our branded email lands here with a token_hash;
 * we verify it (establishing a short-lived recovery session), then let the user choose a new
 * password (updateUser) and forward to /account signed in. Token is read off the URL and
 * scrubbed from history immediately after.
 */
export default function ResetClient() {
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>("verifying")
  const [message, setMessage] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const params = new URL(window.location.href).searchParams
    const tokenHash = params.get("token_hash")
    const type = params.get("type") as EmailOtpType | null
    const expired =
      "this reset link is invalid or has expired. request a new one from the account page."

    async function run() {
      if (tokenHash && type) {
        const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type })
        window.history.replaceState(null, "", "/auth/reset") // drop the token from the URL
        if (error) {
          setPhase("error")
          setMessage(expired)
          return
        }
        setPhase("form")
        return
      }
      // Fallback — a recovery session may already be present (implicit URL flow)
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        setPhase("form")
        return
      }
      setPhase("error")
      setMessage(expired)
    }

    run()
  }, [])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (phase === "saving") return
    setError(null)
    if (password.length < 8) {
      setError("password must be at least 8 characters.")
      return
    }
    if (password !== confirm) {
      setError("passwords don't match.")
      return
    }
    setPhase("saving")
    try {
      await updatePassword(password)
      setPhase("done")
      setTimeout(() => router.replace("/account"), 900)
    } catch (err) {
      setError(err instanceof Error ? err.message : "something went wrong — try again.")
      setPhase("form")
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <FadeIn>
        <div className="bg-surface rounded-2xl p-10 max-w-md w-full">
          <p className="text-xs tracking-[0.2em] uppercase font-mono text-faint mb-4 text-center">
            thony audio
          </p>

          {phase === "verifying" && (
            <div className="text-center">
              <h1 className="font-display text-3xl text-ink mb-2">verifying…</h1>
              <p className="text-muted text-sm">checking your reset link.</p>
            </div>
          )}

          {(phase === "form" || phase === "saving") && (
            <>
              <h1 className="font-display text-3xl text-ink mb-2 text-center">choose a new password</h1>
              <form onSubmit={submit} className="space-y-4 mt-6">
                <label className="block">
                  <span className="text-ink text-sm font-medium">new password</span>
                  <input
                    type="password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="mt-2 w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm text-ink placeholder:text-faint outline-none focus:border-accent transition-colors"
                  />
                </label>
                <label className="block">
                  <span className="text-ink text-sm font-medium">confirm password</span>
                  <input
                    type="password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="••••••••"
                    className="mt-2 w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm text-ink placeholder:text-faint outline-none focus:border-accent transition-colors"
                  />
                </label>
                <button
                  type="submit"
                  disabled={phase === "saving"}
                  className="w-full rounded-xl bg-accent px-4 py-3 text-sm text-cream tracking-wide hover:bg-accent-hover transition-colors disabled:opacity-60"
                >
                  {phase === "saving" ? "saving…" : "update password"}
                </button>
                {error && <p className="text-accent text-xs">{error}</p>}
              </form>
            </>
          )}

          {phase === "done" && (
            <div className="text-center">
              <h1 className="font-display text-3xl text-ink mb-2">password updated</h1>
              <p className="text-muted text-sm">taking you to your account…</p>
            </div>
          )}

          {phase === "error" && (
            <div className="text-center">
              <h1 className="font-display text-3xl text-ink mb-2">link expired</h1>
              <p className="text-muted text-sm leading-relaxed mb-6">{message}</p>
              <a
                href="/account"
                className="inline-block rounded-xl bg-accent px-5 py-2.5 text-sm text-cream hover:bg-accent-hover transition-colors"
              >
                back to sign in
              </a>
            </div>
          )}
        </div>
      </FadeIn>
    </div>
  )
}
