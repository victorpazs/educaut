import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  /* config options here */
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
