"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// 发版检测：静态导出部署后，浏览器里已打开的旧页面（旧 JS 在内存里）点导航仍是旧效果，
// 手动刷新才能拿到新版本。这里在路由切换 / 回到前台时拉取 version.json 对比版本号，
// 发现新版本自动刷新一次，保证一进入就是最新效果（手机和电脑行为一致）。
const KEY = "banyu-deploy-v";
const CHECK_THROTTLE_MS = 30_000;
let lastCheck = 0;

async function checkVersion() {
  const now = Date.now();
  if (now - lastCheck < CHECK_THROTTLE_MS) return;
  lastCheck = now;
  try {
    const res = await fetch(`/version.json?_=${now}`, { cache: "no-store" });
    if (!res.ok) return;
    const data = (await res.json()) as { v?: number | string };
    if (data.v == null) return;
    const prev = sessionStorage.getItem(KEY);
    if (prev == null) {
      // 首次记录，不刷新（当前页面本身就是最新加载的）
      sessionStorage.setItem(KEY, String(data.v));
      return;
    }
    if (String(data.v) !== prev) {
      sessionStorage.setItem(KEY, String(data.v));
      window.location.reload();
    }
  } catch {
    // 本地 dev 没有 version.json（404 返回 HTML 解析失败）时静默跳过
  }
}

export function DeployVersionCheck() {
  const pathname = usePathname();
  useEffect(() => {
    void checkVersion();
    const onVisible = () => {
      if (document.visibilityState === "visible") void checkVersion();
    };
    document.addEventListener("visibilitychange", onVisible);
    const timer = window.setInterval(() => void checkVersion(), 60_000);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.clearInterval(timer);
    };
  }, [pathname]);
  return null;
}
