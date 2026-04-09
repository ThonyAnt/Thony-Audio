import { notFound } from "next/navigation"
import { products, getProductBySlug } from "@/data/products"
import HeroSection from "@/components/resonator/HeroSection"
import FlavorsSection from "@/components/resonator/FlavorsSection"
import VoicesSection from "@/components/resonator/VoicesSection"
import ChordsSection from "@/components/resonator/ChordsSection"
import MidiSection from "@/components/resonator/MidiSection"
import PerfectSection from "@/components/resonator/PerfectSection"
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

  // Resonator gets the full custom page
  if (slug === "resonator") {
    return (
      <>
        <HeroSection />
        <FlavorsSection />
        <VoicesSection />
        <ChordsSection />
        <MidiSection />
        <PerfectSection />
        <ExtrasSection />
        <PricingSection />
        <AudioSection />
        <SupportSection />
      </>
    )
  }

  // Future products: generic layout (replace with custom section components when ready)
  return (
    <div className="pt-28 pb-24 px-6 max-w-3xl mx-auto">
      <h1 className="font-display text-7xl text-[#1a1a1a]">{product.name}</h1>
      <p className="mt-4 font-display text-2xl italic text-[#b85c3a]">{product.tagline}</p>
      <p className="mt-6 text-[#8a837c] leading-relaxed">{product.description}</p>
    </div>
  )
}
