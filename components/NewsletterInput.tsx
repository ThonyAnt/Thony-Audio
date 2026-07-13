"use client"

import { useState } from "react"

/**
 * Footer newsletter signup. Visual + optimistic for now.
 * TODO: wire onSubmit to a Supabase `subscribers` insert (project already uses Supabase).
 */
export default function NewsletterInput() {
  const [sent, setSent] = useState(false)

  if (sent) {
    return <p className="text-sm text-cream/85">thanks — you&apos;re on the list ✿</p>
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        setSent(true)
      }}
      className="flex items-center gap-2"
    >
      <input
        type="email"
        required
        placeholder="your@email.com"
        aria-label="email address"
        className="w-full max-w-[16rem] rounded bg-cream/85 px-3 py-2 text-sm text-ink placeholder:text-ink/50 outline-none focus:ring-1 focus:ring-cream"
      />
      <button
        type="submit"
        aria-label="subscribe"
        className="rounded bg-ink px-3 py-2 text-sm text-cream transition-colors hover:bg-dark active:translate-y-[var(--press)]"
      >
        →
      </button>
    </form>
  )
}
