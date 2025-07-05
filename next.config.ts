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
        destination: "https://gz-zigu.store/auth/register",
      },
      {
        source: "/api/auth/login", 
        destination: "https://gz-zigu.store/auth/login",
      },
      {
        source: "/api/auth/univCheck",
        destination: "https://gz-zigu.store/auth/univCheck",
      },
      {
        source: "/api/auth/sendCode",
        destination: "https://gz-zigu.store/auth/sendCode", 
      },
      {
        source: "/api/auth/verifyCode",
        destination: "https://gz-zigu.store/auth/verifyCode",
      },
    ];
  },
};

export default nextConfig;
