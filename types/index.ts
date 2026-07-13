/** One tab in the imagiro-style feature overview: a pill that swaps a framed screenshot + caption. */
export interface FeatureTab {
  name: string   // short lowercase label — used as both the pill and the caption heading
  desc: string
  img: string    // path relative to /public
}

/** One row in the dark tech-specs sheet: LABEL · dotted leader · value. */
export interface SpecRow {
  label: string
  value: string
}

/** One demo in the dark audio-player list. */
export interface Demo {
  label: string
  src?: string   // audio file path; omitted = "coming soon" placeholder
}

/** Per-product accent theming. Consumed by components/ProductTheme.tsx. */
export interface ProductAccent {
  fg: string     // accent foreground — overrides --color-accent globally (nav + content) while open
  hover?: string // accent hover shade — overrides --color-accent-hover (defaults to fg)
  bg?: string    // optional soft surface tint — overrides --color-surface on the product content
}

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
  model3d?: string       // faceplate bake texture for the spinning 3D hero unit (Chorale3D); unset = flat thumbnail
  demoImages: string[]   // shown in DemoSection (add when ready)
  demoVideoUrl?: string  // optional video embed URL
  features: string[]
  releaseDate: string
  available: boolean

  // ── optional structured content (drives the rebuilt product page; Resonator only for now) ──
  featureTabs?: FeatureTab[]  // → FeatureOverview
  specs?: SpecRow[]           // → TechSpecsSection
  demos?: Demo[]              // → AudioSection
  accent?: ProductAccent      // → ProductTheme (per-product accent; unset = default terracotta)
  paper?: "warm" | "metallicWhite"  // → PaperTheme (swaps the global paper preset on this product's page; unset = warm)
}
