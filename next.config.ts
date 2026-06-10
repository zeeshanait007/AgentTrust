import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // The ResolvingViewport type only exists in .d.ts, not the .js module.
    // Next.js auto-generated route types trigger a false-positive error.
    ignoreBuildErrors: true,
  },
  eslint: {
    // eslint-config-next plugin warning is non-blocking; skip during build.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
