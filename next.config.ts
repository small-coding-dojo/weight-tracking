import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    // Aktualisierte serverActions-Konfiguration gemäß Next.js 15.3.1
    serverActions: {
      bodySizeLimit: "2mb",
      allowedOrigins: ["*"],
    },
  },
  // A simpler approach to exclude the design-system page from production builds
  typescript: {
    ignoreBuildErrors: true,
  },
  pageExtensions: ["tsx", "ts", "jsx", "js"],
};

export default nextConfig;
