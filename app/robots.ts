import type { MetadataRoute } from "next"

export const dynamic = "force-static"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // account/auth/download are user-specific — no reason to index them
      disallow: ["/account/", "/auth/", "/download/"],
    },
    sitemap: "https://thony.audio/sitemap.xml",
  }
}
