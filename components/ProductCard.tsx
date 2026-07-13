import Link from "next/link"
import Image from "next/image"
import { Product } from "@/types"
import Badge from "@/components/ui/Badge"
import PriceTag from "@/components/ui/PriceTag"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const isNew = Number(product.releaseDate) >= 2026 // newest catalog year → show the "new!" tag
  const accent = product.accent?.fg // image-less cards hint the plugin's own accent

  return (
    <Link
      href={`/plugins/${product.slug}`}
      className="group block overflow-hidden rounded border border-dark/15 bg-surface shadow-sm transition-[transform,box-shadow,background-color] duration-300 ease-[var(--ease-soft)] hover:-translate-y-1 hover:bg-surface-hover hover:shadow-md"
    >
      {/* thumbnail */}
      <div
        className="relative aspect-[4/3] overflow-hidden border-b border-dark/10"
        style={accent ? { backgroundColor: `color-mix(in srgb, ${accent} 9%, var(--color-surface))` } : undefined}
      >
        {product.thumbnail ? (
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <Image
              src={product.thumbnail}
              alt={product.name}
              fill
              className="object-contain transition-transform duration-500 ease-[var(--ease-soft)] group-hover:scale-[1.04]"
              style={{ filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.15))" }}
            />
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="font-display lowercase leading-none transition-transform duration-500 ease-[var(--ease-soft)] group-hover:scale-105"
              style={{ fontSize: "7.5rem", color: accent ?? "var(--color-faint)" }}
            >
              {product.name[0].toLowerCase()}
            </span>
          </div>
        )}

        {/* new! badge (top-left) */}
        {isNew && (
          <Badge tone="new" className="absolute top-3 left-3">
            new!
          </Badge>
        )}

        {/* price chip (top-right) */}
        <PriceTag price={product.price} className="absolute top-3 right-3" />
      </div>

      {/* info */}
      <div className="p-5">
        <h3 className="font-display text-2xl leading-tight text-ink transition-colors group-hover:text-accent lowercase">
          {product.name}
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-muted lowercase">{product.tagline}</p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-xs tracking-wide text-accent">
          view plugin
          <span className="inline-block transition-transform duration-300 ease-[var(--ease-soft)] group-hover:translate-x-1">
            →
          </span>
        </span>
      </div>
    </Link>
  )
}
