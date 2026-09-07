import SupportDesk from "@/components/desk/SupportDesk"

// server wrapper: exports metadata (client components can't), renders the desk objects.
export const metadata = {
  title: "support — thony audio",
  description: "write to thony audio, and the answers to the usual questions.",
}

export default function SupportPage() {
  return <SupportDesk />
}
