import Image from "next/image"
import { Product } from "@/types"
import GetButton from "./GetButton"

interface ProductHeroProps {
  product: Product
}

export default function ProductHero({ product }: ProductHeroProps) {
  const priceLabel = product.price === 0 ? "free" : `$${product.price}`

  return (
    <section className="pt-28 pb-16 px-6 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Thumbnail / visual */}
        <div className="aspect-square bg-[#edeae4] rounded-3xl overflow-hidden relative">
          {product.thumbnail ? (
            <Image
              src={product.thumbnail}
              alt={product.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-8xl text-[#8a837c]">
                {product.name[0]}
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="font-display text-6xl lg:text-7xl text-[#1a1a1a] leading-none">
              {product.name}
            </h1>
            <p className="mt-3 text-lg text-[#b85c3a] font-display italic">
              {product.tagline}
            </p>
          </div>

          <p className="text-[#8a837c] leading-relaxed max-w-md">
            {product.description}
          </p>

          <div className="flex items-center gap-4">
            <GetButton product={product} size="lg" />
            <span className="text-sm text-[#8a837c]">{priceLabel}</span>
          </div>

          {/* Features */}
          {product.features.length > 0 && (
            <ul className="mt-2 space-y-2">
              {product.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-[#1a1a1a]">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-[#b85c3a] shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
