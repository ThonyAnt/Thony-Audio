import ConfirmClient from "./ConfirmClient"

// Branded verification landing. Our email templates (see supabase/README.md) point their
// links here with ?token_hash=…&type=… so the click lands on OUR domain, not supabase.co.
export const metadata = {
  title: "verifying — thony audio",
  robots: { index: false },
}

export default function ConfirmPage() {
  return <ConfirmClient />
}
