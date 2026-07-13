import type { NextConfig } from "next";

const nextConfig = {
  output: 'export',
  // static hosts (Porkbun) resolve /auth/confirm as a directory; without this the export
  // writes confirm.html + an index-less confirm/ dir → 301 to the dir → 403 Forbidden
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
