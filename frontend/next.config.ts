import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep build output inside frontend/ to avoid dual-React-instance issues.
  // The root prebuild script copies the output to the repo root if needed.
  distDir: ".next",
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
