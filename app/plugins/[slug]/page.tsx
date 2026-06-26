import { notFound } from "next/navigation"
import { products, getProductBySlug } from "@/data/products"
import BuyButton from "@/components/BuyButton"
import HeroSection from "@/components/resonator/HeroSection"
import StickyFeatures from "@/components/resonator/StickyFeatures"
import ExtrasSection from "@/components/resonator/ExtrasSection"
import PricingSection from "@/components/resonator/PricingSection"
import AudioSection from "@/components/resonator/AudioSection"
import SupportSection from "@/components/resonator/SupportSection"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const product = getProductBySlug(slug)
  if (!product) return {}
  return {
    title: `${product.name} — thony audio`,
    description: product.tagline,
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = getProductBySlug(slug)
  if (!product) notFound()

  if (slug === "resonator") {
    return (
      <>
        <HeroSection />
        <StickyFeatures />
        <ExtrasSection />
        <PricingSection />
        <AudioSection />
        <SupportSection />
      </>
    )
  }

  return (
    <div className="pt-28 pb-24 px-6 max-w-3xl mx-auto">
      <h1 className="font-display text-7xl text-[#1a1a1a]">{product.name}</h1>
      <p className="mt-4 font-display text-2xl italic text-[#b85c3a]">{product.tagline}</p>
      <p className="mt-6 text-[#8a837c] leading-relaxed">{product.description}</p>

      {product.features.length > 0 && (
        <ul className="mt-8 grid sm:grid-cols-2 gap-x-8 gap-y-2">
          {product.features.map((f) => (
            <li key={f} className="text-sm text-[#8a837c] flex gap-2">
              <span className="text-[#b85c3a]">—</span>
              {f}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-12 flex items-center gap-5 border-t border-[#d8d4ce] pt-8">
        <span className="font-display text-4xl text-[#1a1a1a]">
          {product.price === 0 ? "free" : `$${product.price}`}
        </span>
        {product.price === 0 ? (
          <a
            href={product.downloadUrl}
            className="rounded-xl bg-[#b85c3a] text-[#f5f2ed] px-6 py-3 text-sm tracking-wide hover:bg-[#a04e30] transition-colors"
          >
            download
          </a>
        ) : (
          <BuyButton product={product} />
        )}
      </div>
    </div>
  )
}
