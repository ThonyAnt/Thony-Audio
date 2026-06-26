import { createClient } from "@supabase/supabase-js"

// Browser Supabase client. The publishable/anon key is safe to ship in the static
// build; row-level security (RLS) on the database is what actually protects data.
// Defaults: persistSession + detectSessionInUrl = true, so the magic-link redirect
// (/account#access_token=...) establishes the session automatically on load.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)
