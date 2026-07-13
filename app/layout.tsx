import type { Metadata } from "next"
import { Cormorant_Garamond, DM_Sans, Space_Mono } from "next/font/google"
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

export const metadata: Metadata = {
  title: "thony audio",
  description: "audio plugins with character",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${cormorant.variable} ${dmSans.variable} ${mono.variable}`}>
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
