import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: false,

  experimental: {
    // Tree-shake these large packages so only used exports end up in the bundle.
    optimizePackageImports: ["@sanity/client", "@sanity/image-url", "@portabletext/react"],
  },

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
