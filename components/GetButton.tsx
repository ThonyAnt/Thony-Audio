import Link from "next/link"
import { Product } from "@/types"

interface GetButtonProps {
  product: Product
  size?: "sm" | "md" | "lg"
  className?: string
}

export default function GetButton({ product, size = "md", className = "" }: GetButtonProps) {
  const label =
    product.price === 0
      ? "get it free"
      : `$${product.price} — add to cart`

  const sizeClasses = {
    sm: "px-5 py-2 text-sm",
    md: "px-7 py-3 text-sm",
    lg: "px-10 py-4 text-base",
  }

  if (!product.available) {
    return (
      <span
        className={`inline-block bg-[#edeae4] text-[#8a837c] rounded-full tracking-wide cursor-not-allowed ${sizeClasses[size]} ${className}`}
      >
        coming soon
      </span>
    )
  }

  return (
    <Link
      href={product.price === 0 ? `/download/${product.slug}` : `/checkout/${product.slug}`}
      className={`inline-block bg-[#b85c3a] hover:bg-[#a04e30] text-[#f5f2ed] rounded-full tracking-wide transition-colors ${sizeClasses[size]} ${className}`}
    >
      {label}
    </Link>
  )
}
