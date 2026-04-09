import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t border-[#d8d4ce] mt-24">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="font-display text-lg text-[#1a1a1a] tracking-wide">
          thony audio
        </span>

        <div className="flex items-center gap-6 text-sm text-[#8a837c]">
          <Link href="/plugins" className="hover:text-[#1a1a1a] transition-colors">
            plugins
          </Link>
          <Link href="/support" className="hover:text-[#1a1a1a] transition-colors">
            support
          </Link>
        </div>

        <p className="text-xs text-[#8a837c]">
          © {new Date().getFullYear()} thony audio
        </p>
      </div>
    </footer>
  )
}
