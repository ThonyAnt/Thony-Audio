import type { MetadataRoute } from "next"
import { products } from "@/data/products"

export const dynamic = "force-static"

const BASE = "https://thony.audio"

// trailing slashes throughout — matches next.config trailingSlash + how the host 301s
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${BASE}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/plugins/`, changeFrequency: "weekly", priority: 0.9 },
    ...products.map((p) => ({
      url: `${BASE}/plugins/${p.slug}/`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    { url: `${BASE}/support/`, changeFrequency: "monthly", priority: 0.4 },
  ]
}
