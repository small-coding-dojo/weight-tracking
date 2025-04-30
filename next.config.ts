import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    // Aktualisierte serverActions-Konfiguration gemäß Next.js 15.3.1
    serverActions: {
      bodySizeLimit: '2mb',
      allowedOrigins: ['*']
    },
  },
};

export default nextConfig;
