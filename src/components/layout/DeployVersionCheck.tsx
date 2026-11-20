"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// 构建时由 deploy.sh 注入的发版版本号（NEXT_PUBLIC_DEPLOY_V），dev 下为 undefined 走旧逻辑。
// 有了它就能直接判断「当前页是不是旧包」，不再依赖「首次打开一定是最新页」的假设——
// 手机浏览器常无视 no-store 头（磁盘缓存 / 后台标签恢复 / 返回键 bfcache），
// 首次进入拿到的可能是旧 HTML + 旧 JS，旧逻辑首次只记录版本号不刷新，之后就永远比不出差异了。
const BUILT_V = process.env.NEXT_PUBLIC_DEPLOY_V;

const KEY = "banyu-deploy-v";
// 节流放宽到 8s：发版后「选心境 → 星球 → 日记」这类连续快速导航也要能触发检查
const CHECK_THROTTLE_MS = 8_000;
let lastCheck = 0;

async function checkVersion(force = false) {
  const now = Date.now();
  if (!force && now - lastCheck < CHECK_THROTTLE_MS) return;
  lastCheck = now;
  try {
    const res = await fetch(`/version.json?_=${now}`, { cache: "no-store" });
    if (!res.ok) return;
    const data = (await res.json()) as { v?: number | string };
    if (data.v == null) return;
    const server = String(data.v);

    if (BUILT_V != null) {
      if (BUILT_V === server) {
        // 当前包就是最新版
        sessionStorage.setItem(KEY, server);
        return;
      }
      // 包内旧 ≠ 服务器新：当前页必是旧包，刷新一次。
      // KEY 同时充当防循环闸：若浏览器连 reload 都给旧缓存，同一版本号不会刷第二次，避免死循环。
      if (sessionStorage.getItem(KEY) !== server) {
        sessionStorage.setItem(KEY, server);
        window.location.reload();
      }
      return;
    }

    // dev：没有构建版本号，沿用「首次记录 + 变更刷新」
    const prev = sessionStorage.getItem(KEY);
    if (prev == null) {
      sessionStorage.setItem(KEY, server);
      return;
    }
    if (server !== prev) {
      sessionStorage.setItem(KEY, server);
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
    // 返回键从 bfcache 恢复页面时既不走网络也不触发路由变化，这里强制检查
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) void checkVersion(true);
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("pageshow", onPageShow);
    const timer = window.setInterval(() => void checkVersion(), 60_000);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("pageshow", onPageShow);
      window.clearInterval(timer);
    };
  }, [pathname]);
  return null;
}
