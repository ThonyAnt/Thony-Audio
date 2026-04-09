import Image from "next/image"
import { Product } from "@/types"

interface DemoSectionProps {
  product: Product
}

export default function DemoSection({ product }: DemoSectionProps) {
  const hasDemo = product.demoImages.length > 0 || product.demoVideoUrl

  return (
    <section className="px-6 py-16 max-w-6xl mx-auto">
      <div className="border-t border-[#d8d4ce] pt-16">
        <h2 className="font-display text-4xl text-[#1a1a1a] mb-10">in action</h2>

        {hasDemo ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Video slot */}
            {product.demoVideoUrl && (
              <div className="lg:col-span-2 aspect-video bg-[#edeae4] rounded-2xl overflow-hidden">
                <iframe
                  src={product.demoVideoUrl}
                  className="w-full h-full"
                  allowFullScreen
                  title={`${product.name} demo`}
                />
              </div>
            )}

            {/* Image slots */}
            {product.demoImages.map((src, i) => (
              <div key={i} className="aspect-video bg-[#edeae4] rounded-2xl overflow-hidden relative">
                <Image src={src} alt={`${product.name} demo ${i + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        ) : (
          /* Placeholder state — remove once demo content is added */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DemoPlaceholder label="screenshot" />
            <DemoPlaceholder label="screenshot" />
            <DemoPlaceholder label="screenshot" />
            <div className="md:col-span-3">
              <DemoPlaceholder label="video" tall />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

function DemoPlaceholder({ label, tall = false }: { label: string; tall?: boolean }) {
  return (
    <div
      className={`bg-[#edeae4] rounded-2xl flex flex-col items-center justify-center gap-2 border border-dashed border-[#d8d4ce] ${
        tall ? "aspect-video" : "aspect-video"
      }`}
    >
      <span className="text-xs uppercase tracking-widest text-[#8a837c]">{label}</span>
      <span className="text-xs text-[#8a837c] opacity-60">coming soon</span>
    </div>
  )
}
