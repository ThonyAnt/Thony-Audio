import { notFound } from "next/navigation"
import Link from "next/link"
import { products, getProductBySlug } from "@/data/products"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return products.filter((p) => p.price === 0).map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const product = getProductBySlug(slug)
  if (!product) return {}
  return {
    title: `download ${product.name} — thony audio`,
  }
}

export default async function DownloadPage({ params }: Props) {
  const { slug } = await params
  const product = getProductBySlug(slug)

  if (!product || product.price !== 0) notFound()

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        {/* Decorative circle */}
        <div className="w-20 h-20 rounded-full bg-[#edeae4] flex items-center justify-center mx-auto mb-8">
          <span className="font-display text-3xl text-[#1a1a1a]">
            {product.name[0]}
          </span>
        </div>

        <h1 className="font-display text-5xl text-[#1a1a1a] leading-tight">
          {product.name}
        </h1>
        <p className="mt-3 text-[#8a837c]">{product.tagline}</p>

        <div className="mt-10 p-6 bg-[#edeae4] rounded-2xl">
          <p className="text-sm text-[#8a837c] mb-6">
            thanks for downloading. enjoy the plugin — and if you make something with it,{" "}
            <Link href="/support" className="text-[#b85c3a] hover:underline">
              we&apos;d love to hear it.
            </Link>
          </p>

          <a
            href={product.downloadUrl}
            download
            className="w-full inline-block bg-[#b85c3a] hover:bg-[#a04e30] text-[#f5f2ed] py-4 px-8 rounded-full text-sm tracking-wide transition-colors text-center"
          >
            download now
          </a>
        </div>

        <Link
          href={`/plugins/${product.slug}`}
          className="mt-6 inline-block text-sm text-[#8a837c] hover:text-[#1a1a1a] transition-colors"
        >
          ← back to {product.name}
        </Link>
      </div>
    </div>
  )
}
