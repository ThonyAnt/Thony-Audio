// ─────────────────────────────────────────────────────────────────────────────
//  Account + license data layer — Supabase (email+password auth + RLS-protected reads).
//
//  Auth: email + password (signInWithPassword / signUp) with a passwordless
//  magic-link fallback (signInWithOtp). Sign-up confirmation links and magic links
//  both route through our own branded /auth/confirm page (token-hash flow) instead
//  of supabase.co — see supabase/README.md for the email templates to paste in.
//  Licenses: read from the `licenses` table; RLS limits each user to rows whose
//  email matches their signed-in email (see installer/licensing SQL / the README).
// ─────────────────────────────────────────────────────────────────────────────
import type { User } from "@supabase/supabase-js"
import { supabase } from "./supabase"

export interface AccountUser {
  email: string
  name: string
}

export interface Download {
  slug: string
  name: string
  tagline: string
  version: string
  href: string
  free: boolean
}

export interface License {
  id: string
  product: string
  email: string
  status: "active"
  issued: string
  keyText: string // the .chorale-license content (RLS-protected; downloaded as a blob)
}

const titleCase = (s: string) =>
  s.replace(/[._-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())

function toUser(u: User): AccountUser {
  const email = u.email ?? ""
  const name = (u.user_metadata?.name as string) || titleCase(email.split("@")[0])
  return { email, name }
}

/**
 * Synchronous best guess at "is someone signed in?", before the session has
 * been resolved: a persisted Supabase session in localStorage, or an auth
 * redirect landing (magic link / PKCE code) that is about to become one.
 * Lets /account decide what to draw on its very first frame — the notepad
 * for visitors, an empty desk for members — so the route transition carries it.
 */
export function likelySignedIn(): boolean {
  if (typeof window === "undefined") return true
  try {
    if (/access_token=|type=recovery/.test(location.hash) || /[?&]code=/.test(location.search)) return true
    const ref = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!).hostname.split(".")[0]
    return localStorage.getItem(`sb-${ref}-auth-token`) !== null
  } catch {
    return false
  }
}

/** Current signed-in user (from the persisted session), or null. */
export async function getCurrentUser(): Promise<AccountUser | null> {
  const { data } = await supabase.auth.getSession()
  return data.session?.user ? toUser(data.session.user) : null
}

/** Subscribe to sign-in / sign-out (fires after the magic-link redirect too). Returns an unsubscribe. */
export function onAuthChange(cb: (user: AccountUser | null) => void): () => void {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    cb(session?.user ? toUser(session.user) : null)
  })
  return () => data.subscription.unsubscribe()
}

/** Sign in with email + password. Throws on invalid credentials or an unconfirmed email. */
export async function signInWithPassword(email: string, password: string): Promise<void> {
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
}

/**
 * Create an account with email + password. Supabase emails a confirmation link that
 * lands on our branded /auth/confirm page. Returns `needsConfirmation: true` when email
 * confirmation is enabled (no session yet until the link is opened) — the expected case.
 */
export async function signUpWithPassword(
  email: string,
  password: string,
): Promise<{ needsConfirmation: boolean }> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${window.location.origin}/auth/confirm/` },
  })
  if (error) throw error
  return { needsConfirmation: !data.session }
}

/** Fallback: email a one-time passwordless sign-in link (also lands on /auth/confirm). */
export async function sendSignInLink(email: string): Promise<void> {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${window.location.origin}/auth/confirm/` },
  })
  if (error) throw error
}

/** Email a branded password-reset link that lands on /auth/reset to choose a new password. */
export async function sendPasswordReset(email: string): Promise<void> {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset/`,
  })
  if (error) throw error
}

/** Set a new password for the current (recovery) session — used by the /auth/reset page. */
export async function updatePassword(password: string): Promise<void> {
  const { error } = await supabase.auth.updateUser({ password })
  if (error) throw error
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut()
}

/** The user's licenses (RLS-scoped to their email). Empty until the table/rows exist. */
export async function getLicenses(): Promise<License[]> {
  const { data, error } = await supabase
    .from("licenses")
    .select("id, product, email, status, issued, key_text")
    .order("issued", { ascending: false })

  if (error) {
    // table not created yet, or no access — surface nothing rather than crashing the page
    console.warn("[account] licenses query:", error.message)
    return []
  }

  return (data ?? []).map((r) => ({
    id: String(r.id),
    product: String(r.product),
    email: String(r.email),
    status: "active",
    issued: String(r.issued ?? ""),
    keyText: String(r.key_text ?? ""),
  }))
}

/** Downloads = free products (always) + a download per licensed product. */
export function deriveDownloads(licenses: License[]): Download[] {
  const free: Download[] = [
    {
      slug: "resonator",
      name: "Resonator",
      tagline: "Color your sounds with vibrant, tonal resonance.",
      version: "1.0",
      href: "/assets/products/resonator/Thony Audio - Resonator.zip",
      free: true,
    },
  ]
  const licensed: Download[] = licenses.map((l) => ({
    slug: l.product.toLowerCase(),
    name: l.product,
    tagline: `Licensed to ${l.email}.`,
    version: "1.0",
    href: "#", // TODO: Supabase Storage signed URL for the installer
    free: false,
  }))
  return [...free, ...licensed]
}
