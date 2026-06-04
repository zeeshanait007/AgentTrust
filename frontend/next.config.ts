import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Output to root-level build/ directory (relative to frontend/)
  // This means `cd frontend && next build` writes to ../build at the repo root
  distDir: "../build",
};

export default nextConfig;
