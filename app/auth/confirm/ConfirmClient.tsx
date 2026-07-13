"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { EmailOtpType } from "@supabase/supabase-js"
import FadeIn from "@/components/FadeIn"
import { supabase } from "@/lib/supabase"

type Status = "verifying" | "ok" | "error"

/**
 * Verifies the token from a Thony Audio confirmation / magic-link email and establishes the
 * session in the browser, then forwards to /account. Reads the token straight off the URL
 * (no useSearchParams → no Suspense boundary needed) and scrubs it from history afterward.
 */
export default function ConfirmClient() {
  const router = useRouter()
  const [status, setStatus] = useState<Status>("verifying")
  const [message, setMessage] = useState("")

  useEffect(() => {
    const params = new URL(window.location.href).searchParams
    const tokenHash = params.get("token_hash")
    const type = params.get("type") as EmailOtpType | null

    function done() {
      setStatus("ok")
      window.history.replaceState(null, "", "/auth/confirm") // drop the token from the URL
      setTimeout(() => router.replace("/account"), 900)
    }

    async function run() {
      // Token-hash flow — our branded email links carry ?token_hash=…&type=…
      if (tokenHash && type) {
        const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type })
        if (error) {
          setStatus("error")
          setMessage(friendly(error.message))
          return
        }
        done()
        return
      }
      // Fallback — Supabase may instead drop an implicit session in the URL (detectSessionInUrl)
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        done()
        return
      }
      setStatus("error")
      setMessage("this link is invalid or has expired. request a new one from the account page.")
    }

    run()
  }, [router])

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <FadeIn>
        <div className="bg-surface rounded-2xl p-10 max-w-md text-center">
          <p className="text-xs tracking-[0.2em] uppercase font-mono text-faint mb-4">thony audio</p>

          {status === "verifying" && (
            <>
              <h1 className="font-display text-3xl text-ink mb-2">verifying…</h1>
              <p className="text-muted text-sm">one moment while we confirm your link.</p>
            </>
          )}

          {status === "ok" && (
            <>
              <h1 className="font-display text-3xl text-ink mb-2">you&apos;re in</h1>
              <p className="text-muted text-sm">taking you to your account…</p>
            </>
          )}

          {status === "error" && (
            <>
              <h1 className="font-display text-3xl text-ink mb-2">link expired</h1>
              <p className="text-muted text-sm leading-relaxed mb-6">{message}</p>
              <a
                href="/account"
                className="inline-block rounded-xl bg-accent px-5 py-2.5 text-sm text-cream hover:bg-accent-hover transition-colors"
              >
                back to sign in
              </a>
            </>
          )}
        </div>
      </FadeIn>
    </div>
  )
}

function friendly(m: string): string {
  if (/expired|invalid|not found/i.test(m))
    return "this link is invalid or has expired. request a new one from the account page."
  return m
}
