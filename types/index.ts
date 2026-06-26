export interface Product {
  id: string
  slug: string
  name: string
  tagline: string
  description: string
  price: number          // 0 = free
  downloadUrl: string    // path to file or external URL (free products; paid = via /account)
  checkoutUrl?: string   // hosted checkout link (Lemon Squeezy / Paddle) for paid products
  thumbnail: string      // path relative to /public
  demoImages: string[]   // shown in DemoSection (add when ready)
  demoVideoUrl?: string  // optional video embed URL
  features: string[]
  releaseDate: string
  available: boolean
}
