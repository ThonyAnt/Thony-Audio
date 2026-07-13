import { products } from "@/data/products"
import ProductCard from "@/components/ProductCard"
import FadeIn from "@/components/FadeIn"

export const metadata = {
  title: "plugins — thony audio",
  description: "all plugins by thony audio",
}

export default function PluginsPage() {
  return (
    <div className="pt-32 pb-28 px-6 max-w-6xl mx-auto">
      <FadeIn>
        <header className="mb-16 max-w-2xl">
          <h1
            className="font-display text-ink leading-[0.95] lowercase"
            style={{ fontSize: "clamp(3.5rem, 9vw, 6.5rem)" }}
          >
            plugins
          </h1>
          <p className="mt-5 font-display italic text-2xl text-accent leading-snug lowercase">
            instruments and effects with character.
          </p>
          <p className="mt-3 text-muted text-sm leading-relaxed">stay tuned for more : )</p>
        </header>
      </FadeIn>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, i) => (
          <FadeIn key={product.id} delay={0.06 + i * 0.06}>
            <ProductCard product={product} />
          </FadeIn>
        ))}
      </div>
    </div>
  )
}
