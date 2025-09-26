/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed output: 'export' to enable API routes
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  // Add experimental features for better performance
  experimental: {
    serverComponentsExternalPackages: ['leaflet'],
  },
};

module.exports = nextConfig;
