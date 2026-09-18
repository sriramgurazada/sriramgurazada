import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // The photographs are pre-sized by scripts/process-photos.mjs, and keeping
    // them unoptimized means the site deploys anywhere, including static hosts.
    unoptimized: true,
  },
};

export default nextConfig;
