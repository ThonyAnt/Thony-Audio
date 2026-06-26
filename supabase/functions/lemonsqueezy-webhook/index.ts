// ════════════════════════════════════════════════════════════════════════════
//  Lemon Squeezy purchase webhook → mint a Chorale license → store it.
//  On `order_created`: verify LS's HMAC signature, mint a license byte-compatible
//  with the plugin (the TS port), and upsert it into `licenses`. The buyer then
//  signs into /account with their purchase email (RLS) and downloads it.
//
//  Function secrets to set (Supabase dashboard → Edge Functions → Secrets, or
//  `supabase secrets set ...`):
//    CHORALE_PRIVATE_KEY           the license private key ("expHex,modHex") — SECRET
//    LEMONSQUEEZY_WEBHOOK_SECRET   the signing secret from the LS webhook setup
//  (SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY are injected automatically.)
//
//  Deploy:  supabase functions deploy lemonsqueezy-webhook --no-verify-jwt
//  (no-verify-jwt: LS calls it unauthenticated; we authenticate via the signature.)
// ════════════════════════════════════════════════════════════════════════════
import { createClient } from "npm:@supabase/supabase-js@2"
import { generateKeyFile } from "../_shared/chorale-license.ts"

const PRODUCT = "Chorale" // license appName MUST equal the plugin's getProductID()
const MACHINE = "CHORALE-ANY"

/** Constant-time-ish HMAC-SHA256 hex verification of the raw body. */
async function validSignature(secret: string, rawBody: string, signature: string): Promise<boolean> {
  if (!signature) return false
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    "raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"],
  )
  const mac = await crypto.subtle.sign("HMAC", key, enc.encode(rawBody))
  const hex = [...new Uint8Array(mac)].map((b) => b.toString(16).padStart(2, "0")).join("")
  if (hex.length !== signature.length) return false
  let diff = 0
  for (let i = 0; i < hex.length; i++) diff |= hex.charCodeAt(i) ^ signature.toLowerCase().charCodeAt(i)
  return diff === 0
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("method not allowed", { status: 405 })

  const rawBody = await req.text()
  const ok = await validSignature(
    Deno.env.get("LEMONSQUEEZY_WEBHOOK_SECRET")!,
    rawBody,
    req.headers.get("X-Signature") ?? "",
  )
  if (!ok) return new Response("invalid signature", { status: 401 })

  const event = JSON.parse(rawBody)
  // mint only on a completed order (ignore refunds, subscription pings, etc.)
  if (event?.meta?.event_name !== "order_created") return new Response("ignored", { status: 200 })

  const attr = event?.data?.attributes ?? {}
  const email = String(attr.user_email ?? "").trim()
  const name = String(attr.user_name ?? "").trim() || email.split("@")[0]
  if (!email) return new Response("no email", { status: 400 })

  const keyText = generateKeyFile({
    appName: PRODUCT,
    email,
    userName: name,
    machineNumbers: MACHINE,
    privateKey: Deno.env.get("CHORALE_PRIVATE_KEY")!,
  })

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, // service role bypasses RLS for the insert
  )

  // upsert on the LS order identifier so webhook re-deliveries are idempotent
  const id = `CHRL-${attr.identifier ?? event?.data?.id ?? Date.now()}`
  const { error } = await supabase.from("licenses").upsert({
    id,
    email,
    product: PRODUCT,
    key_text: keyText,
    issued: new Date().getFullYear().toString(),
  })
  if (error) {
    console.error("[lemonsqueezy-webhook] insert failed:", error.message)
    return new Response("db error", { status: 500 })
  }

  return new Response("ok", { status: 200 })
})
