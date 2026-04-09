import Link from "next/link"
import Image from "next/image"
import { Product } from "@/types"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const priceLabel = product.price === 0 ? "free" : `$${product.price}`

  return (
    <Link
      href={`/plugins/${product.slug}`}
      className="group block bg-[#edeae4] hover:bg-[#e5e1da] rounded-2xl overflow-hidden transition-colors"
    >
      {/* Thumbnail */}
      <div className="aspect-[4/3] bg-[#d8d4ce] relative overflow-hidden">
        {product.thumbnail ? (
          <Image
            src={product.thumbnail}
            alt={product.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-4xl text-[#8a837c] tracking-wider">
              {product.name[0]}
            </span>
          </div>
        )}
        {/* Price badge */}
        <span className="absolute top-3 right-3 bg-[#f5f2ed]/90 text-[#1a1a1a] text-xs px-3 py-1 rounded-full tracking-wide">
          {priceLabel}
        </span>
      </div>

      {/* Info */}
      <div className="p-5">
        <h3 className="font-display text-2xl text-[#1a1a1a] group-hover:text-[#b85c3a] transition-colors leading-tight">
          {product.name}
        </h3>
        <p className="mt-1 text-sm text-[#8a837c] leading-relaxed">
          {product.tagline}
        </p>
      </div>
    </Link>
  )
}
