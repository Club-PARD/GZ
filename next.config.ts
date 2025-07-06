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
        source: "/api/auth/register",
        destination: "https://gz-zigu.store/auth/signup",
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
