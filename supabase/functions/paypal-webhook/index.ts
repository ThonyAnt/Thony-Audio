// ════════════════════════════════════════════════════════════════════════════
//  PayPal purchase webhook → mint a Chorale license → store it.
//  PayPal-direct (no Merchant of Record): on a completed payment, verify the
//  webhook with PayPal, mint a license byte-compatible with the plugin, and upsert
//  it into `licenses`. The buyer signs into /account with their PayPal email (RLS)
//  and downloads it.
//
//  Function secrets (Supabase → Edge Functions → Secrets, or `supabase secrets set`):
//    CHORALE_PRIVATE_KEY     license private key ("expHex,modHex") — SECRET
//    PAYPAL_CLIENT_ID        REST app client id   (PayPal Developer dashboard)
//    PAYPAL_CLIENT_SECRET    REST app secret
//    PAYPAL_WEBHOOK_ID       the id of the webhook you create in the dashboard
//    PAYPAL_API_BASE         optional — set to https://api-m.sandbox.paypal.com to test
//  (SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY are injected automatically.)
//
//  Deploy:  supabase functions deploy paypal-webhook --no-verify-jwt
//  ⚠ TEST with PayPal's webhook simulator and confirm the buyer email lands where
//  extractBuyer() looks — PayPal's payload shape varies by checkout type. Adjust
//  the event types / paths below to match your actual checkout.
// ════════════════════════════════════════════════════════════════════════════
import { createClient } from "npm:@supabase/supabase-js@2"
import { generateKeyFile } from "../_shared/chorale-license.ts"

const PRODUCT = "Chorale"
const MACHINE = "CHORALE-ANY"
const API = Deno.env.get("PAYPAL_API_BASE") ?? "https://api-m.paypal.com" // live
const FULFILL_EVENTS = ["PAYMENT.CAPTURE.COMPLETED", "CHECKOUT.ORDER.APPROVED"]

async function accessToken(): Promise<string> {
  const basic = btoa(`${Deno.env.get("PAYPAL_CLIENT_ID")}:${Deno.env.get("PAYPAL_CLIENT_SECRET")}`)
  const res = await fetch(`${API}/v1/oauth2/token`, {
    method: "POST",
    headers: { Authorization: `Basic ${basic}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: "grant_type=client_credentials",
  })
  return (await res.json()).access_token
}

// PayPal webhook verification: hand the headers + event back to PayPal to confirm authenticity.
async function verify(headers: Headers, event: unknown): Promise<boolean> {
  const token = await accessToken()
  const res = await fetch(`${API}/v1/notifications/verify-webhook-signature`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      auth_algo: headers.get("paypal-auth-algo"),
      cert_url: headers.get("paypal-cert-url"),
      transmission_id: headers.get("paypal-transmission-id"),
      transmission_sig: headers.get("paypal-transmission-sig"),
      transmission_time: headers.get("paypal-transmission-time"),
      webhook_id: Deno.env.get("PAYPAL_WEBHOOK_ID"),
      webhook_event: event,
    }),
  })
  return (await res.json()).verification_status === "SUCCESS"
}

// Email/name location varies by event type — dig defensively. Verify against the simulator.
function extractBuyer(event: any): { email: string; name: string } {
  const r = event?.resource ?? {}
  const email = (
    r.payer?.email_address ??
    r.payer?.payer_info?.email ??
    r.payer_info?.email ??
    r.subscriber?.email_address ??
    ""
  ).toString().trim()
  const n = r.payer?.name ?? r.subscriber?.name ?? r.payer?.payer_info ?? {}
  const given = n.given_name ?? n.first_name ?? ""
  const surname = n.surname ?? n.last_name ?? ""
  let name = `${given} ${surname}`.trim()
  if (!name && email) name = email.split("@")[0]
  return { email, name }
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("method not allowed", { status: 405 })

  const event = JSON.parse(await req.text())
  if (!(await verify(req.headers, event))) return new Response("invalid signature", { status: 401 })

  if (!FULFILL_EVENTS.includes(event.event_type)) return new Response("ignored", { status: 200 })

  const { email, name } = extractBuyer(event)
  if (!email) {
    // can't mint without an email — log loudly; you can recover with mint.ps1 if a sale slips
    console.error("[paypal-webhook] no buyer email in", event.event_type, JSON.stringify(event.resource ?? {}))
    return new Response("ok (no email; logged)", { status: 200 })
  }

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
  const id = `CHRL-${event?.resource?.id ?? event?.id ?? Date.now()}`
  const { error } = await supabase.from("licenses").upsert({
    id,
    email,
    product: PRODUCT,
    key_text: keyText,
    issued: new Date().getFullYear().toString(),
  })
  if (error) {
    console.error("[paypal-webhook] insert failed:", error.message)
    return new Response("db error", { status: 500 }) // 5xx → PayPal retries (transient)
  }

  return new Response("ok", { status: 200 })
})
