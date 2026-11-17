"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FAB } from "@/components/m3/FAB";
import { useToast } from "@/components/m3/Toast";
import { JournalList } from "@/components/journal/JournalList";
import { NightScene } from "@/components/layout/NightScene";

export default function JournalPage() {
  const router = useRouter();
  const toast = useToast();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div key={pathname}>
      <NightScene title="星语日记" subtitle="&nbsp;&nbsp;每一颗心事，都有星光回应。">
        <JournalList />
      </NightScene>
        {mounted && (
          <div
            className="fixed bottom-[110px] md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-6 md:gap-7"
            style={{ width: "auto" }}
          >
            {/* 次按钮：亮玻璃胶囊 + 立体星，碎片玻璃质感 + 光晕 + 星点 */}
            <button
              type="button"
              onClick={() => toast("已保存到本地")}
              className="relative flex items-center justify-center rounded-full text-white transition-transform active:scale-95"
              style={{
                flex: "none",
                minWidth: "0",
                padding: "12px 20px",
                fontSize: "17px",
                letterSpacing: "0.05em",
                background: [
                  "linear-gradient(180deg, #352657 0%, #1e1442 35%, #0a0620 100%) padding-box",
                  "conic-gradient(from 0deg, #ecd9ff 0deg, #b78aec 70deg, #f2e6ff 140deg, #a878e6 210deg, #ecd9ff 280deg, #c49af5 330deg, #ecd9ff 360deg) border-box",
                ].join(", "),
                border: "1.5px solid transparent",
                boxShadow: [
                  "0 0 12px 2px rgba(238,226,255,0.42)",
                  "0 0 24px 5px rgba(210,185,255,0.22)",
                  "0 12px 28px rgba(6,3,16,0.6)",
                  "inset 0 1px 0 rgba(255,255,255,0.65)",
                  "inset 0 10px 16px rgba(130,100,225,0.28)",
                  "inset 0 -14px 22px rgba(5,2,18,0.75)",
                ].join(", "),
                textShadow:
                  "0 1px 6px rgba(8,4,22,0.85), 0 0 12px rgba(255,255,255,0.25)",
              }}
            >
              {/* 内层细环 */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-[3px] rounded-full"
                style={{ border: "1px solid rgba(255,255,255,0.35)" }}
              />
              {/* 玻璃层：顶部白光 + 不均匀紫色光斑 */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-[3px] rounded-full"
                style={{
                  background: `
                    radial-gradient(70% 90% at 68% 32%, rgba(147,104,240,0.3), transparent 68%),
                    radial-gradient(120% 38% at 50% -12%, rgba(255,255,255,0.45), transparent 60%)
                  `,
                }}
              />
              {/* 星点层：常亮 + 轻柔闪烁 */}
              <span
                aria-hidden
                className="btn-glass-dust pointer-events-none absolute inset-[3px] rounded-full"
                style={{
                  background: `
                    radial-gradient(1.8px 1.8px at 14% 40%, rgba(255,255,255,0.95) 45%, transparent 62%),
                    radial-gradient(1.2px 1.2px at 22% 66%, rgba(255,255,255,0.7) 45%, transparent 62%),
                    radial-gradient(1.5px 1.5px at 46% 22%, rgba(255,255,255,0.8) 45%, transparent 62%),
                    radial-gradient(1.8px 1.8px at 72% 68%, rgba(255,255,255,0.8) 45%, transparent 62%),
                    radial-gradient(1.2px 1.2px at 87% 32%, rgba(255,255,255,0.65) 45%, transparent 62%)
                  `,
                }}
              />
              <svg className="relative z-10 w-[20px] h-[20px] mr-2 shrink-0" viewBox="0 0 24 24" aria-hidden>
                <defs>
                  <linearGradient id="save-star-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="55%" stopColor="#f2e7ff" />
                    <stop offset="100%" stopColor="#c3a6f5" />
                  </linearGradient>
                  <radialGradient id="save-star-glow">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                    <stop offset="50%" stopColor="#f0e2ff" stopOpacity="0.38" />
                    <stop offset="100%" stopColor="#f0e2ff" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <g className="btn-star-glimmer">
                  <circle cx="12" cy="12" r="11" fill="url(#save-star-glow)" />
                  <path
                    d="M12 2.8l2.86 5.8 6.4.93-4.63 4.51 1.1 6.37L12 17.4l-5.73 3.01 1.1-6.37-4.63-4.51 6.4-.93L12 2.8z"
                    fill="url(#save-star-fill)"
                    stroke="rgba(255,255,255,0.9)"
                    strokeWidth="0.8"
                    transform="translate(12 12) scale(1.15) translate(-12 -12)"
                  />
                </g>
                {/* 星周围：小四角星 + 放射光线，错峰闪烁 */}
                <g className="btn-spark-shine" style={{ animationDelay: "0.7s" }}>
                  <path
                    d="M5.2 4.6c.2 1.5.85 2.15 2.35 2.35-1.5.2-2.15.85-2.35 2.35-.2-1.5-.85-2.15-2.35-2.35 1.5-.2 2.15-.85 2.35-2.35z"
                    fill="#ffffff"
                    opacity="0.9"
                  />
                  <path
                    d="M20 16.2c.15 1.1.6 1.6 1.75 1.8-1.15.2-1.6.65-1.75 1.8-.15-1.15-.6-1.6-1.75-1.8 1.15-.2 1.6-.7 1.75-1.8z"
                    fill="#ffffff"
                    opacity="0.92"
                  />
                  <g
                    stroke="rgba(255,255,255,0.85)"
                    strokeWidth="1"
                    strokeLinecap="round"
                  >
                    <path d="M17.8 5.2L21.2 2.8" />
                    <path d="M20.4 11.4L23.4 10.8" />
                    <path d="M6.4 19.2L4 21.4" />
                    <path d="M3.6 9.6L1 8.6" />
                  </g>
                </g>
              </svg>
              <span className="relative z-10 truncate">保存本地</span>
            </button>

            {/* 主按钮：亮紫霓虹双层描边，碎片迷离玻璃质感 + 光晕 + 流星 */}
            <button
              type="button"
              onClick={() => router.push("/journal/new")}
              className="relative flex items-center justify-center rounded-full text-white font-semibold transition-transform active:scale-95"
              style={{
                flex: "none",
                minWidth: "0",
                padding: "12px 20px",
                fontSize: "17px",
                letterSpacing: "0.05em",
                background: [
                  "linear-gradient(180deg, #3d2d6e 0%, #241752 35%, #0d0822 100%) padding-box",
                  "conic-gradient(from 0deg, #ffffff 0deg, #c9a5ff 70deg, #ffffff 140deg, #b57bff 210deg, #ffffff 280deg, #cf9dff 330deg, #ffffff 360deg) border-box",
                ].join(", "),
                border: "2px solid transparent",
                boxShadow: [
                  "0 0 14px 2px rgba(245,235,255,0.55)",
                  "0 0 30px 8px rgba(205,175,255,0.35)",
                  "0 12px 28px rgba(6,3,16,0.6)",
                  "inset 0 1px 0 rgba(255,255,255,0.7)",
                  "inset 0 10px 16px rgba(150,115,240,0.35)",
                  "inset 0 -14px 22px rgba(6,2,20,0.75)",
                ].join(", "),
                textShadow:
                  "0 1px 8px rgba(18,7,46,0.9), 0 0 16px rgba(255,255,255,0.35)",
              }}
            >
              {/* 内层细环：干净的紫色细线 */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-[3px] rounded-full"
                style={{ border: "1px solid rgba(255,255,255,0.42)" }}
              />
              {/* 玻璃层：顶部白光 + 图标光晕 + 不均匀紫色光斑 */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-[3px] rounded-full"
                style={{
                  background: `
                    radial-gradient(60% 80% at 74% 30%, rgba(150,105,245,0.32), transparent 66%),
                    radial-gradient(46% 68% at 24% 52%, rgba(236,214,255,0.2), transparent 70%),
                    radial-gradient(110% 38% at 50% -12%, rgba(255,255,255,0.5), transparent 60%)
                  `,
                }}
              />
              {/* 星点层：常亮 + 轻柔闪烁 */}
              <span
                aria-hidden
                className="btn-glass-dust pointer-events-none absolute inset-[3px] rounded-full"
                style={{
                  background: `
                    radial-gradient(2.2px 2.2px at 13% 38%, rgba(255,255,255,1) 45%, transparent 62%),
                    radial-gradient(1.3px 1.3px at 21% 66%, rgba(255,255,255,0.8) 45%, transparent 62%),
                    radial-gradient(1.7px 1.7px at 47% 20%, rgba(255,255,255,0.9) 45%, transparent 62%),
                    radial-gradient(1.2px 1.2px at 58% 76%, rgba(255,255,255,0.7) 45%, transparent 62%),
                    radial-gradient(2px 2px at 90% 40%, rgba(255,255,255,0.95) 45%, transparent 62%),
                    radial-gradient(1.3px 1.3px at 83% 70%, rgba(255,255,255,0.65) 45%, transparent 62%)
                  `,
                }}
              />
              {/* 流星图标：大四角芒星头 + 辐射光晕 + 亮 S 拖尾 + 小四角伴星，整体飞行 */}
              <svg className="relative z-10 w-[20px] h-[20px] mr-2 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden>
                <defs>
                  <linearGradient id="comet-trail" x1="0" y1="1" x2="1" y2="0">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
                    <stop offset="50%" stopColor="#ffffff" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#ffffff" />
                  </linearGradient>
                  <radialGradient id="comet-head-glow">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                    <stop offset="40%" stopColor="#f2e3ff" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#f2e3ff" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <g className="btn-comet">
                  <circle cx="16.5" cy="8.3" r="8.5" fill="url(#comet-head-glow)" />
                  <path
                    d="M3.5 21Q8 19.5 11 15.5T17 8"
                    stroke="url(#comet-trail)"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M16.5 2.2c.45 4 2.1 5.65 6.1 6.1-4 .45-5.65 2.1-6.1 6.1-.45-4-2.1-5.65-6.1-6.1 4-.45 5.65-2.1 6.1-6.1z"
                    fill="#ffffff"
                  />
                  <path
                    d="M8.6 13.6c.25 1.9 1.05 2.7 2.95 2.95-1.9.25-2.7 1.05-2.95 2.95-.25-1.9-1.05-2.7-2.95-2.95 1.9-.25 2.7-1.05 2.95-2.95z"
                    fill="#ffffff"
                    opacity="0.95"
                  />
                  <circle cx="5.4" cy="19.6" r="0.9" fill="rgba(255,255,255,0.9)" />
                </g>
              </svg>
              <span className="relative z-10 truncate">编写日记</span>
            </button>
          </div>
        )}
    </div>
  );
}
