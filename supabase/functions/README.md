# Supabase Edge Functions

Two webhook functions that do the same job — **auto-mint a Chorale license on purchase
and store it** — for two payment setups. **`paypal-webhook` is the active path**
(PayPal-direct, works for a China-based seller). `lemonsqueezy-webhook` is the
Merchant-of-Record alternative, kept for if you ever switch.

```
buy → PayPal checkout → webhook → mint + insert → buyer's /account → download → plugin unlock
```

Both mint with `_shared/chorale-license.ts` (the TS port — verified byte-compatible
with the plugin's C++ `--verify`).

## `paypal-webhook` — PayPal-direct (active)

### 1. Database
Run [`../schema.sql`](../schema.sql) in the SQL Editor (creates `licenses` + RLS).

### 2. PayPal Developer dashboard (developer.paypal.com)
- Create a **REST API app** → copy its **Client ID** + **Secret**.
- Create a **Webhook** → URL = the deployed function URL (step 4), subscribe to
  **`PAYMENT.CAPTURE.COMPLETED`** → copy the **Webhook ID**.
- Create a **Buy Now button / payment link** for Chorale → paste that link into
  `data/products.ts` → Chorale's `checkoutUrl` (the buy button goes live).

### 3. Function secrets
```
supabase secrets set CHORALE_PRIVATE_KEY="expHex,modHex"     # license private key — SECRET
supabase secrets set PAYPAL_CLIENT_ID="..."
supabase secrets set PAYPAL_CLIENT_SECRET="..."
supabase secrets set PAYPAL_WEBHOOK_ID="..."
# optional, to test against PayPal sandbox first:
supabase secrets set PAYPAL_API_BASE="https://api-m.sandbox.paypal.com"
```
(`SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` are injected automatically.)

### 4. Deploy
```
supabase functions deploy paypal-webhook --no-verify-jwt
```
`--no-verify-jwt` because PayPal calls it unauthenticated — we authenticate by handing
the event back to PayPal's verify-webhook-signature API.

### 5. ⚠ Test before going live
PayPal's payload shape varies by checkout type, and the buyer email isn't always in the
same place. **Use PayPal's webhook simulator**, fire a `PAYMENT.CAPTURE.COMPLETED`, and
confirm `extractBuyer()` finds the email. If not, adjust the event type / paths in
`paypal-webhook/index.ts`. (If a real sale ever slips through without an email, the
function logs it and you can mint manually with `mint.ps1`.)

> **Buyer note:** the license is keyed to the **PayPal account email**. Buyers sign into
> `/account` with that same email to see and download it (RLS scopes by email).

## Keep in sync
`_shared/chorale-license.ts` is a copy of the canonical
`Chorale/installer/licensing/keygen-ts/chorale-license.ts`. If the plugin's product id /
machine sentinel changes, update both, plus `PRODUCT` / `MACHINE` in the function.
