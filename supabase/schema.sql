-- ─────────────────────────────────────────────────────────────────────────────
--  CHORALE / Thony Audio — licenses schema. Run this once in the Supabase
--  dashboard → SQL Editor.
--
--  One row per minted license. The Edge Function (service-role key) INSERTS rows
--  on purchase; signed-in users can only SELECT their own (matched by email via
--  RLS). License content lives in `key_text` (no public storage needed) and is
--  served to the owner's browser as a download.
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.licenses (
  id          text primary key,                                   -- e.g. CHRL-2026-0001
  email       text not null,
  product     text not null default 'Chorale',
  status      text not null default 'active',
  issued      text not null default to_char(now(), 'YYYY'),
  key_text    text not null,                                      -- the .chorale-license file content
  created_at  timestamptz not null default now()
);

alter table public.licenses enable row level security;

-- a user may read ONLY licenses whose email matches their signed-in email.
-- (No insert/update/delete policy → the anon/publishable key cannot write;
--  only the service-role key used by the Edge Function can.)
drop policy if exists "read own licenses" on public.licenses;
create policy "read own licenses"
  on public.licenses for select
  to authenticated
  using (lower(email) = lower(auth.jwt() ->> 'email'));

-- helpful for the email-scoped reads
create index if not exists licenses_email_idx on public.licenses (lower(email));
