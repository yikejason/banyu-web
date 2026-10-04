import type { NextConfig } from "next";

// 独立后端地址，如 https://api.example.com；未设置时 /api/* 走 Next 自身 404
const apiBase = process.env.API_BASE;

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async rewrites() {
    if (!apiBase) return [];
    return [{ source: "/api/:path*", destination: `${apiBase}/api/:path*` }];
  },
};

export default nextConfig;
