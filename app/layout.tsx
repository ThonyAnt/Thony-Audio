import type { Metadata } from "next"
import { Caveat, Cormorant_Garamond, DM_Sans, Space_Mono } from "next/font/google"
import "./globals.css"
import Navigation from "@/components/Navigation"
import Footer from "@/components/Footer"
import PaperGrain, { PaperThemeProvider } from "@/components/PaperGrain"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-sans",
  display: "swap",
})

const mono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-plex-mono",
  display: "swap",
})

// the pen: what you write on the account notepad (components/desk/Notepad)
const hand = Caveat({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-caveat",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://thony.audio"),
  title: {
    default: "thony audio — audio plugins with character",
    template: "%s — thony audio",
  },
  description:
    "hand-built audio plugins: Chorale, a per-note convolution reverb that resonates in key with your music, and Resonator, a free 7-voice harmonic resonator. VST3 · AU · mac + windows.",
  keywords: ["audio plugins", "VST3", "AU", "convolution reverb", "Chorale plugin", "Resonator plugin", "thony audio"],
  openGraph: {
    type: "website",
    url: "https://thony.audio",
    siteName: "thony audio",
    title: "thony audio — audio plugins with character",
    description: "hand-built audio plugins: Chorale, a per-note convolution reverb, and Resonator, a free harmonic resonator.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "thony audio — Chorale plugin" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "thony audio — audio plugins with character",
    description: "hand-built audio plugins: Chorale, a per-note convolution reverb, and Resonator, a free harmonic resonator.",
    images: ["/og.png"],
  },
  icons: { icon: "/logo.svg" },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${cormorant.variable} ${dmSans.variable} ${mono.variable} ${hand.variable}`}>
      <body suppressHydrationWarning>
        <PaperThemeProvider>
          <PaperGrain />
          <Navigation />
          <main>{children}</main>
          <Footer />
        </PaperThemeProvider>
      </body>
    </html>
  )
}
