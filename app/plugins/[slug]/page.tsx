import { notFound } from "next/navigation"
import { products, getProductBySlug } from "@/data/products"
import type { CSSProperties } from "react"
import BuyButton from "@/components/BuyButton"
import ProductTheme from "@/components/ProductTheme"
import { PaperTheme } from "@/components/PaperGrain"
import HeroSection from "@/components/resonator/HeroSection"
import StickyFeatures from "@/components/resonator/StickyFeatures"
import AudioSection from "@/components/resonator/AudioSection"
import ExtrasSection from "@/components/resonator/ExtrasSection"
import TechSpecsSection from "@/components/resonator/TechSpecsSection"
import PricingSection from "@/components/resonator/PricingSection"
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
      <ProductTheme accent={product.accent}>
        <HeroSection />
        <StickyFeatures />
        <AudioSection demos={product.demos} />
        <ExtrasSection />
        {product.specs && <TechSpecsSection specs={product.specs} />}
        <PricingSection />
        <SupportSection />
      </ProductTheme>
    )
  }

  const content = (
    <div className="pt-28 pb-24 px-6 max-w-3xl mx-auto">
      <h1 className="font-display text-7xl text-ink">{product.name}</h1>
      <p className="mt-4 font-display text-2xl italic text-accent">{product.tagline}</p>
      <p className="mt-6 text-muted leading-relaxed">{product.description}</p>

      {product.features.length > 0 && (
        <ul className="mt-8 grid sm:grid-cols-2 gap-x-8 gap-y-2">
          {product.features.map((f) => (
            <li key={f} className="text-sm text-muted flex gap-2">
              <span className="text-accent">—</span>
              {f}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-12 flex items-center gap-5 border-t border-line pt-8">
        <span className="font-display text-4xl text-ink">
          {product.price === 0 ? "free" : `$${product.price}`}
        </span>
        {product.price === 0 ? (
          <a
            href={product.downloadUrl}
            className="rounded bg-accent text-cream px-6 py-3 text-sm tracking-wide hover:bg-accent-hover transition-colors active:translate-y-[var(--press)]"
          >
            download
          </a>
        ) : (
          <BuyButton product={product} />
        )}
      </div>
    </div>
  )

  if (product.paper) {
    return (
      <ProductTheme accent={product.accent}>
        <PaperTheme variant={product.paper} />
        <div style={{ "--color-cream": "#edf0f3" } as CSSProperties}>{content}</div>
      </ProductTheme>
    )
  }

  return content
}
