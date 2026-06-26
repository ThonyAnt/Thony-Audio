# Supabase Edge Functions

## `lemonsqueezy-webhook` — auto-mint a license on purchase

On a Lemon Squeezy `order_created` event: verifies LS's signature, mints a Chorale
license (the TS port — byte-compatible with the plugin), and upserts it into the
`licenses` table. The buyer then signs into `/account` with their purchase email and
downloads it (RLS scopes the row to their email).

```
buy → Lemon Squeezy checkout → webhook → mint + insert → buyer's /account → download → plugin unlock
```

### One-time setup

1. **Database** — run [`../schema.sql`](../schema.sql) in the SQL Editor (creates `licenses` + RLS).

2. **Function secrets** — Supabase → Edge Functions → Secrets (or CLI):
   ```
   supabase secrets set CHORALE_PRIVATE_KEY="expHex,modHex"      # the license private key — SECRET
   supabase secrets set LEMONSQUEEZY_WEBHOOK_SECRET="whsec_..."   # from the LS webhook setup
   ```
   (`SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` are injected automatically.)

3. **Deploy** (needs the Supabase CLI, `supabase login`, `supabase link`):
   ```
   supabase functions deploy lemonsqueezy-webhook --no-verify-jwt
   ```
   `--no-verify-jwt` because Lemon Squeezy calls it unauthenticated — we authenticate
   via the HMAC signature instead. Note the function URL it prints.

4. **Lemon Squeezy dashboard**:
   - Create the **Chorale** product → copy its **checkout URL** → paste into
     `data/products.ts` → Chorale's `checkoutUrl` (the buy button goes live).
   - Settings → **Webhooks** → add the function URL, set a **signing secret** (the same
     value you put in `LEMONSQUEEZY_WEBHOOK_SECRET`), and subscribe to **`order_created`**.

### Keep in sync

`_shared/chorale-license.ts` is a copy of the canonical
`Chorale/installer/licensing/keygen-ts/chorale-license.ts` (verified against the plugin's
C++ `--verify`). If you change the plugin's product id / machine sentinel, update both,
and `PRODUCT` / `MACHINE` in `lemonsqueezy-webhook/index.ts`.

> Before relying on this, confirm Lemon Squeezy can **pay out** to your bank
> (their payouts run via PayPal / Wise — verify your country is supported).
