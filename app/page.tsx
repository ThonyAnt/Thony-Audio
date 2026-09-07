import CassetteHero from "@/components/cassette/CassetteHero"

// The cassette is served as 2x/4x PNGs exported from Figma (public/assets/cassette/):
// live vector rasterization at fractional display scales aliases the hairline
// work, and browsers render the Figma filter exports (hard-alpha shadows, paper
// soft-light) differently from Figma itself. Re-export from the "TA-1 v3A (metal
// band)" frame after design changes — see components/cassette/CassetteHero.tsx.
export default function Home() {
  return <CassetteHero />
}
