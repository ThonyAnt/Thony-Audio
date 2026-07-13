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
    featureTabs: [
      {
        name: "flavors",
        desc: "Saw mode for immediate richness; square resonates only odd harmonics for a hollow, subtler tone.",
        img: "/assets/products/resonator/Timbre Selector.png",
      },
      {
        name: "voices",
        desc: "Stack up to 7 independent pitch voices to build complex, evolving harmonies.",
        img: "/assets/products/resonator/Pitch Panel.png",
      },
      {
        name: "chords",
        desc: "Store chords in up to 8 modules and switch between them mid-track to write progressions.",
        img: "/assets/products/resonator/Chord Selector.png",
      },
      {
        name: "midi",
        desc: "Enable MIDI input and Resonator follows your keyboard in real time — turning any sound into an instrument.",
        img: "/assets/products/resonator/Resonator.png",
      },
      {
        name: "controls",
        desc: "Per-voice fine tune (cents), pan (L/R), and gain (dB) — shape every voice independently.",
        img: "/assets/products/resonator/Pitch Module.png",
      },
    ],
    specs: [
      { label: "plugin formats", value: "VST3 · AU · AAX" },
      { label: "platforms", value: "macOS 10.15+ · Windows 10+" },
      { label: "voices", value: "up to 7" },
      { label: "midi", value: "real-time input" },
      { label: "license", value: "royalty-free" },
    ],
    demos: [
      { label: "demo 1" },
      { label: "demo 2" },
      { label: "demo 3" },
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
    model3d: "/assets/products/chorale/chorale-3d-bake.png", // baked from Chorale/assets/faceplate.html — rebake after UI changes
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
    accent: { fg: "#7c5cff", hover: "#6a4ae6", bg: "#e6eaef" }, // Chorale violet + cool surface tint
    paper: "metallicWhite",                   // cool metallic-white paper on the Chorale page
    releaseDate: "2026",
    available: true,
  },
]

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}
