import type { NextConfig } from "next";

// 独立后端地址，如 https://api.example.com；未设置时 /api/* 走 Next 自身 404
const apiBase = process.env.API_BASE;

const nextConfig: NextConfig = {
  // 纯静态导出（out/），由 nginx 托管；/api 由 nginx 分流到独立后端
  output: "export",
  poweredByHeader: false,
  // 放行局域网来源，手机真机访问 dev 服务器时 HMR 热更新才能推送到位
  allowedDevOrigins: [
    "192.168.*.*",
    "10.*.*.*",
    "172.16.*.*",
    "172.17.*.*",
    "172.18.*.*",
    "172.19.*.*",
    "172.20.*.*",
    "172.21.*.*",
    "172.22.*.*",
    "172.23.*.*",
    "172.24.*.*",
    "172.25.*.*",
    "172.26.*.*",
    "172.27.*.*",
    "172.28.*.*",
    "172.29.*.*",
    "172.30.*.*",
    "172.31.*.*",
  ],
  async rewrites() {
    if (!apiBase) return [];
    return [{ source: "/api/:path*", destination: `${apiBase}/api/:path*` }];
  },
};

export default nextConfig;
