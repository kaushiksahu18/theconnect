import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  // experimental: {
  //   ppr: true,
  //   dynamicIO: true,
  // },
};

export default nextConfig;
