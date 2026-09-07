import type { NextConfig } from "next";

const nextConfig = {
  output: 'export',
  // static hosts (Porkbun) resolve /auth/confirm as a directory; without this the export
  // writes confirm.html + an index-less confirm/ dir → 301 to the dir → 403 Forbidden
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  experimental: {
    // React <ViewTransition> on route changes: the desk ↔ account notepad hand-off
    // (components/desk/DeskHero, components/desk/Notepad, "view transitions" in globals.css)
    viewTransition: true,
  },
} satisfies NextConfig;

module.exports = nextConfig;
