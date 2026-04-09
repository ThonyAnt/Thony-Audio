"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { products } from "@/data/products"
import TiltCard from "@/components/TiltCard"

const featured = products[0]

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="min-h-screen flex flex-col justify-center px-6 pt-14 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-screen">
          {/* Left */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-xs tracking-[0.3em] uppercase text-[#8a837c] mb-6"
            >
              thony audio
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display text-6xl sm:text-7xl lg:text-8xl text-[#1a1a1a] leading-none"
            >
              {featured.name}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="mt-6 text-[#8a837c] text-lg leading-relaxed max-w-sm"
            >
              {featured.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-10 flex items-center gap-5"
            >
              <Link
                href={`/plugins/${featured.slug}`}
                className="bg-[#1a1a1a] hover:bg-[#333] text-[#f5f2ed] px-8 py-3.5 rounded-full text-sm tracking-wide transition-colors"
              >
                explore plugin
              </Link>
              <span className="text-sm text-[#8a837c]">free</span>
            </motion.div>
          </div>

          {/* Right — 3D tilt card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
          >
            <TiltCard>
              <Image
                src="/assets/products/resonator/Resonator.png"
                alt="Resonator plugin"
                width={4396}
                height={3040}
                style={{ maxWidth: "100%", height: "auto", filter: "drop-shadow(0 24px 48px rgba(0,0,0,0.18))" }}
                priority
              />
            </TiltCard>
          </motion.div>
        </div>
      </section>

      {/* All plugins strip — only shown when there are multiple products */}
      {products.length > 1 && (
        <section className="px-6 pb-24 max-w-6xl mx-auto">
          <div className="border-t border-[#d8d4ce] pt-16 mb-10 flex items-baseline justify-between">
            <h2 className="font-display text-4xl text-[#1a1a1a]">all plugins</h2>
            <Link href="/plugins" className="text-sm text-[#8a837c] hover:text-[#1a1a1a] transition-colors">
              view all →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.slice(1).map((product) => (
              <Link
                key={product.id}
                href={`/plugins/${product.slug}`}
                className="group block bg-[#edeae4] hover:bg-[#e5e1da] rounded-2xl p-6 transition-colors"
              >
                <h3 className="font-display text-2xl text-[#1a1a1a] group-hover:text-[#b85c3a] transition-colors">
                  {product.name}
                </h3>
                <p className="mt-1 text-sm text-[#8a837c]">{product.tagline}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  )
}
