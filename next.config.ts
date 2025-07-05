import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  async rewrites() {
    return [
      {
        source: "/api/post/create",
        destination: "https://gz-zigu.store/post/create",
      },
    ];
  },
};

export default nextConfig;
