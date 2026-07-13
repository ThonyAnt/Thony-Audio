# Supabase auth — branding the verification emails

The app signs in with **email + password** (with a magic-link fallback). Both the sign-up
confirmation email and the magic-link email should look like **Thony Audio**, not Supabase, and
their links should land on **our** domain (`/auth/confirm`) instead of `*.supabase.co`.

The code side is already done (`lib/account.ts`, `app/auth/confirm/`). The two things below live in
the **Supabase dashboard** and have to be set there — they can't be committed to the repo.

## 1. Site URL + Redirect URLs (one Site URL; localhost works via the allowlist)

Dashboard → **Authentication → URL Configuration**

- **Site URL**: `https://thony.audio` — Supabase allows exactly ONE; keep it on production.
- **Redirect URLs**: add ALL of these — the allowlist is what makes dev and prod work at once:
  - `https://thony.audio/auth/confirm` and `https://thony.audio/auth/reset`
  - `http://localhost:3000/auth/confirm` and `http://localhost:3000/auth/reset`

Dev + prod from one config: the templates link via `{{ .RedirectTo }}`, which expands to the
`redirectTo`/`emailRedirectTo` our code passes (`window.location.origin/auth/…` — see
`lib/account.ts`), validated against the allowlist above. Sign up from localhost → localhost
link; from thony.audio → thony.audio link. If a call ever omits it, Supabase falls back to the
Site URL.

## 2. Email templates (the branded HTML + on-domain links)

**Preferred: sync from the repo.** `supabase/config.toml` declares the three templates
(subject + `content_path`), so after editing a template just run:

```
supabase config push
```

It diffs against the hosted project and asks before applying — review the diff so it only
touches what you expect. (URL configuration from §1 is declared there too.)

**Manual fallback:** Dashboard → **Authentication → Email Templates**, paste the matching
file from `supabase/templates/`. The key part is the link — it points at our page with a
`token_hash`, which `app/auth/confirm` verifies:

| Template          | File                              | Link `type` |
| ----------------- | --------------------------------- | ----------- |
| Confirm signup    | `templates/confirm-signup.html`   | `signup`    |
| Magic Link        | `templates/magic-link.html`       | `magiclink` |
| Reset Password    | `templates/reset-password.html`   | `recovery`  |

(Change Email follows the same pattern with `type=email_change` if you add it later.)

## 3. Sender address — custom SMTP (the last "reek of Supabase")

By default emails come from `Supabase Auth <noreply@mail.app.supabase.io>`, and the built-in
sender is heavily rate-limited (a few emails/hour — fine for testing, not for launch). Custom
SMTP fixes both. Full walkthrough (Resend shown; Postmark/SES/Brevo are equivalent):

1. **Provider account** — resend.com, free tier (3k emails/mo) is plenty for auth mail.
2. **Verify the domain** — Resend → Domains → Add `thony.audio`. It hands you DNS records
   (DKIM TXT + SPF/Return-Path, optionally DMARC). Add them wherever thony.audio's DNS lives,
   wait for "Verified" (minutes-ish, TTL depending).
3. **SMTP credentials** — Resend → SMTP: host `smtp.resend.com`, port `465`, user `resend`,
   password = an API key you create.
4. **Supabase dashboard** → Project Settings → **Authentication → SMTP Settings** → enable
   Custom SMTP and fill in host/port/user/password, sender email `noreply@thony.audio`,
   sender name `Thony Audio`.
5. **Raise the send limit** — Authentication → **Rate Limits**: with custom SMTP active you
   can lift "emails per hour" from the built-in cap to something sane (e.g. 100/hr).
6. **Test** — trigger a sign-up; the mail should arrive from `Thony Audio <noreply@thony.audio>`
   and land in inbox, not spam (DKIM verified = usually fine).

Credentials stay in the dashboard on purpose — don't commit them. (config.toml could carry
SMTP via env vars, but dashboard is simpler and this rarely changes.)

## 4. Confirm it works

1. `Authentication → Providers → Email`: make sure **Confirm email** is ON (so sign-up requires verification).
2. Sign up on `/account` with a test email → you should get the Thony-branded email.
3. The link should read `https://<your-domain>/auth/confirm?token_hash=…&type=signup` — open it → lands on our verifying page → bounces to `/account` signed in.
