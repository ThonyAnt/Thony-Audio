// ─────────────────────────────────────────────────────────────────────────────
//  Account + license data layer — Supabase (magic-link auth + RLS-protected reads).
//
//  Auth: passwordless magic link (signInWithOtp). The link returns the user to
//  /account, where the Supabase client establishes the session automatically.
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

/** Email the user a magic sign-in link that returns them to /account. */
export async function sendSignInLink(email: string): Promise<void> {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${window.location.origin}/account` },
  })
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
