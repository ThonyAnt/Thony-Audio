import Link from "next/link"
import NewsletterInput from "@/components/NewsletterInput"

export default function Footer() {
  return (
    <footer className="bg-olive text-cream">
      <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
        {/* brand + newsletter */}
        <div className="space-y-5">
          <span className="font-display text-3xl tracking-wide">thony audio</span>
          <div>
            <p className="mb-3 text-sm italic text-cream/85">stay in the loop</p>
            <NewsletterInput />
          </div>
        </div>

        {/* nav */}
        <nav className="flex flex-col gap-2 text-base">
          <Link href="/plugins" className="hover:underline">
            plugins
          </Link>
          <Link href="/support" className="hover:underline">
            support
          </Link>
          <Link href="/account" className="hover:underline">
            account
          </Link>
        </nav>

        {/* contact + copyright */}
        <div className="flex flex-col gap-2 text-base sm:items-end">
          <a href="mailto:hello@thony.audio" className="hover:underline">
            hello@thony.audio
          </a>
          <p className="mt-6 text-xs text-cream/70">© {new Date().getFullYear()} thony audio</p>
        </div>
      </div>
    </footer>
  )
}
