import { Product } from "@/types"

// Buy CTA for a paid product. Points at the product's hosted checkout
// (Lemon Squeezy / Paddle). Until that link is set it shows "coming soon",
// so the page is shippable before the store account exists.
export default function BuyButton({ product }: { product: Product }) {
  if (!product.checkoutUrl) {
    return (
      <span className="rounded-xl bg-[#edeae4] text-[#8a837c] px-6 py-3 text-sm tracking-wide">
        buy — coming soon
      </span>
    )
  }
  return (
    <a
      href={product.checkoutUrl}
      className="rounded-xl bg-[#b85c3a] text-[#f5f2ed] px-6 py-3 text-sm tracking-wide hover:bg-[#a04e30] transition-colors"
    >
      buy ${product.price}
    </a>
  )
}
