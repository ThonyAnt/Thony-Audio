import { Product } from "@/types"

/**
 * Product catalog.
 * To add a new product, append an object to this array.
 * All pages and components derive their content from here automatically.
 */
export const products: Product[] = [
  {
    id: "resonator",
    slug: "resonator",
    name: "Resonator",
    tagline: "Color your sounds with vibrant, tonal resonance.",
    description:
      "A rich sounding harmonic resonator supporting 7 voices, configurable states, and MIDI input.",
    price: 0,
    downloadUrl: "/assets/products/resonator/Thony Audio - Resonator.zip",
    thumbnail: "/assets/products/resonator/Resonator.png",
    demoImages: [],
    demoVideoUrl: undefined,
    features: [
      "7-voice harmonic resonator",
      "Saw and square waveform modes",
      "8 storable chord modules for progressions",
      "Real-time MIDI input",
      "Per-voice fine tune, pan, and gain",
      "Preset system for saving configurations",
      "Lifetime free updates",
    ],
    releaseDate: "2024",
    available: true,
  },
]

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}
