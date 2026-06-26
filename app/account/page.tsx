import AccountClient from "./AccountClient"

// server wrapper: exports metadata (client components can't), renders the client portal.
// Statically prerendered as a shell; all auth/data runs in the browser (see AccountClient).
export const metadata = {
  title: "account — thony audio",
}

export default function AccountPage() {
  return <AccountClient />
}
