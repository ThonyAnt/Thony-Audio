import ResetClient from "./ResetClient"

// Branded password-reset landing. Our "Reset Password" email (supabase/templates/reset-password.html)
// links here with ?token_hash=…&type=recovery so the click stays on OUR domain, not supabase.co.
export const metadata = {
  title: "reset password — thony audio",
  robots: { index: false },
}

export default function ResetPage() {
  return <ResetClient />
}
