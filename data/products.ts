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
  {
    id: "chorale",
    slug: "chorale",
    name: "Chorale",
    tagline: "A reverb that resonates in key with your music.",
    description:
      "A per-note convolution reverb — every note can carry its own impulse response, and a pitch-track mode tunes one IR to follow your MIDI. The reverb resonates in key with what you play.",
    price: 39, // TODO: set your price
    downloadUrl: "#", // paid — delivered via /account after purchase
    checkoutUrl: "", // TODO: paste your PayPal Buy Now / payment link (see supabase/functions/README.md)
    thumbnail: "",
    demoImages: [],
    demoVideoUrl: undefined,
    features: [
      "Per-note impulse responses across 12 pitch classes",
      "Pitch-track mode — one IR tunes to your MIDI",
      "Mono and polyphonic voices",
      "Per-note EQ and ADSR with chain links",
      "Master transpose and key-shift",
      "Presets with embedded or referenced IRs",
      "VST3, AU, and standalone (mac + windows)",
    ],
    releaseDate: "2026",
    available: true,
  },
]

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}
