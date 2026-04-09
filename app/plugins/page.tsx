import { products } from "@/data/products"
import ProductCard from "@/components/ProductCard"

export const metadata = {
  title: "plugins — thony audio",
  description: "all plugins by thony audio",
}

export default function PluginsPage() {
  return (
    <div className="pt-28 pb-24 px-6 max-w-6xl mx-auto">
      <div className="mb-14">
        <h1 className="font-display text-6xl text-[#1a1a1a]">plugins</h1>
        <p className="mt-3 text-[#8a837c] text-base max-w-sm">
          every plugin is built to add character, not just process.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
