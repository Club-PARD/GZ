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
      {
        source: "/api/auth/signUp",
        destination: "https://gz-zigu.store/auth/signUp",
      },
      {
        source: "/api/auth/login", 
        destination: "https://gz-zigu.store/auth/login",
      },
      {
        source: "/api/auth/check-nickname",
        destination: "https://gz-zigu.store/auth/check-nickname",
      },
    ];
  },
};

export default nextConfig;
