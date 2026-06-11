import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // React Compiler adds noticeable overhead in dev mode (1–3s per route on first hit).
  // Leave it off here; enable in prod via build flags if you want the runtime win.
  reactCompiler: false,

  // Tell Next which external image hosts we use so it can cache/optimize them.
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "framerusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
