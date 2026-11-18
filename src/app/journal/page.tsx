"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FAB } from "@/components/m3/FAB";
import { useToast } from "@/components/m3/Toast";
import { JournalList } from "@/components/journal/JournalList";
import { NightScene } from "@/components/layout/NightScene";

/* 确定性伪随机：SSR 与客户端生成同一批粒子坐标，避免 hydration 抖动 */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* 二次贝塞尔取点 */
function quadAt(p0: number[], p1: number[], p2: number[], t: number): [number, number] {
  const mt = 1 - t;
  return [
    mt * mt * p0[0] + 2 * mt * t * p1[0] + t * t * p2[0],
    mt * mt * p0[1] + 2 * mt * t * p1[1] + t * t * p2[1],
  ];
}

/* 四角十字芒星路径（center cx,cy，半径 r） */
function starPath(cx: number, cy: number, r: number): string {
  const k = r / 6.1;
  const f = (v: number) => (v * k).toFixed(2);
  return [
    `M${cx} ${(cy - r).toFixed(2)}`,
    `c${f(0.45)} ${f(4)} ${f(2.1)} ${f(5.65)} ${f(6.1)} ${f(6.1)}`,
    `c${f(-4)} ${f(0.45)} ${f(-5.65)} ${f(2.1)} ${f(-6.1)} ${f(6.1)}`,
    `c${f(-0.45)} ${f(-4)} ${f(-2.1)} ${f(-5.65)} ${f(-6.1)} ${f(-6.1)}`,
    `c${f(4)} ${f(-0.45)} ${f(5.65)} ${f(-2.1)} ${f(6.1)} ${f(-6.1)}`,
    "z",
  ].join("");
}

/* 三次贝塞尔取点 */
function cubicAt(
  p0: number[], c1: number[], c2: number[], p3: number[], t: number
): [number, number] {
  const mt = 1 - t;
  return [
    mt * mt * mt * p0[0] + 3 * mt * mt * t * c1[0] + 3 * mt * t * t * c2[0] + t * t * t * p3[0],
    mt * mt * mt * p0[1] + 3 * mt * mt * t * c1[1] + 3 * mt * t * t * c2[1] + t * t * t * p3[1],
  ];
}

type ArcOpts = {
  w: number;
  haloW: number;
  bright: number;
  /* 粒子数量（默认 9）与整体透明度折扣 */
  dots?: number;
  dotDim?: number;
  /* 虚线样式：断断续续的细丝感 */
  dash?: string;
};

type ArcDef = ArcOpts & {
  d: string;
  from: [number, number];
  to: [number, number];
  sample: (t: number) => [number, number];
};

function quadArc(p0: number[], p1: number[], p2: number[], o: ArcOpts): ArcDef {
  return {
    d: `M${p0[0]} ${p0[1]}Q${p1[0]} ${p1[1]} ${p2[0]} ${p2[1]}`,
    from: [p0[0], p0[1]],
    to: [p2[0], p2[1]],
    ...o,
    sample: (t) => quadAt(p0, p1, p2, t),
  };
}

function cubicArc(
  p0: number[], c1: number[], c2: number[], p3: number[],
  o: ArcOpts
): ArcDef {
  return {
    d: `M${p0[0]} ${p0[1]}C${c1[0]} ${c1[1]} ${c2[0]} ${c2[1]} ${p3[0]} ${p3[1]}`,
    from: [p0[0], p0[1]],
    to: [p3[0], p3[1]],
    ...o,
    sample: (t) => cubicAt(p0, c1, c2, p3, t),
  };
}

/* 白羊座创意星座：Z 字形 —— 顶部蜿蜒横线（左上端星 → 右上角星）、
   中间撇分成两根漂移弧束（右上角星 → 左下折点主星）、底部横线（折点 → 右端星） */
const ARIES2_STARS: { cx: number; cy: number; r: number; glow: number; delay: number }[] = [
  { cx: 5.8, cy: 18.6, r: 2.5, glow: 4.4, delay: 0 },     // 折点主星（左下）
  { cx: 16.8, cy: 6.2, r: 1.8, glow: 3.4, delay: 0.9 },   // Z 上角星（右上，斜撇与顶横的交点）
  { cx: 21.7, cy: 20.5, r: 1.5, glow: 2.9, delay: 1.8 },  // 底横右端星（与撇等长）
  { cx: 4, cy: 4.8, r: 1.5, glow: 2.9, delay: 2.7 },      // 顶横左端星（左上）
];

const ARIES2_ARCS: ArcDef[] = [
  // 顶部横线：长度减半，极细的丝，往上拱的弯曲线，虚线断续、很不明显、缓慢漂移
  cubicArc([7.2, 5], [8.8, 2.6], [12, 2.8], [13.6, 6], {
    w: 0.5, haloW: 1.1, bright: 0.22, dots: 5, dotDim: 0.4, dash: "0.6 2.4",
  }),
  // 中间那一撇拆成两根弧束：首尾都接在两端星上，一束向左上拱、一束向右下拱，中间留空成透镜形
  quadArc([5.8, 18.6], [9.7, 10.9], [16.8, 6.2], { w: 0.95, haloW: 2.1, bright: 0.66 }),
  quadArc([5.8, 18.6], [12.9, 13.9], [16.8, 6.2], { w: 0.85, haloW: 1.9, bright: 0.58 }),
  // 底部横线：长度与撇相当（~16），下偏约 7°，轻微上拱
  cubicArc([5.8, 18.6], [11.2, 18.2], [16.6, 18.8], [21.7, 20.5], { w: 0.95, haloW: 2.1, bright: 0.66 }),
];

/* 弧线上的粒子流光：两端淡出、中段更亮，夹杂淡紫颗粒 */
const ARIES2_DOTS: { x: number; y: number; r: number; o: number; purple: boolean }[] = (() => {
  const rand = mulberry32(20881);
  const dots: { x: number; y: number; r: number; o: number; purple: boolean }[] = [];
  for (const arc of ARIES2_ARCS) {
    const n = arc.dots ?? 9;
    const dim = arc.dotDim ?? 1;
    for (let i = 0; i < n; i++) {
      const t = (i + 0.5) / n;
      const [x0, y0] = arc.sample(t);
      const fade = Math.sin(Math.PI * t);
      dots.push({
        x: Number((x0 + (rand() - 0.5) * 0.6).toFixed(2)),
        y: Number((y0 + (rand() - 0.5) * 0.6).toFixed(2)),
        r: Number(((0.35 + rand() * 0.4 + fade * 0.3) * (0.75 + dim * 0.25)).toFixed(2)),
        o: Number((Math.min(0.85, 0.12 + fade * (0.38 + rand() * 0.3)) * dim).toFixed(2)),
        purple: rand() < 0.36,
      });
    }
  }
  return dots;
})();

/* 线上的闪耀星星：取点在弧线上，错峰闪烁 */
const ARIES2_LINE_STARS: { cx: number; cy: number; r: number; delay: number }[] = (() => {
  const picks = [
    { arc: ARIES2_ARCS[0], ts: [0.34, 0.7] },  // 顶部蜿蜒横线
    { arc: ARIES2_ARCS[1], ts: [0.52] },       // 斜束一
    { arc: ARIES2_ARCS[2], ts: [0.62] },       // 斜束二
    { arc: ARIES2_ARCS[3], ts: [0.45] },       // 底部横线
  ];
  const out: { cx: number; cy: number; r: number; delay: number }[] = [];
  let d = 0;
  for (const p of picks) {
    for (const t of p.ts) {
      const [cx, cy] = p.arc.sample(t);
      out.push({
        cx: Number(cx.toFixed(2)),
        cy: Number(cy.toFixed(2)),
        r: 0.95 + (d % 2) * 0.18,
        delay: 0.5 + d * 0.55,
      });
      d++;
    }
  }
  return out;
})();

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
              {/* 定制白羊座星座图标：3 颗十字星光点 + 2 条交汇弧形粒子光轨，舒展倾斜构图，柔光不刺眼 */}
              <svg className="relative z-10 w-[20px] h-[20px] mr-2 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden>
                <defs>
                  {/* 白色光轨：两端缓慢淡出，无硬端点 */}
                  {ARIES2_ARCS.map((a, i) => (
                    <linearGradient
                      key={`l${i}`}
                      id={`aries2-line-${i}`}
                      gradientUnits="userSpaceOnUse"
                      x1={a.from[0]} y1={a.from[1]} x2={a.to[0]} y2={a.to[1]}
                    >
                      <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
                      <stop offset="0.3" stopColor="#ffffff" stopOpacity={a.bright * 0.75} />
                      <stop offset="0.55" stopColor="#ffffff" stopOpacity={a.bright} />
                      <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
                    </linearGradient>
                  ))}
                  {/* 淡紫色弥散辉光：跟随弧线走向渐隐 */}
                  {ARIES2_ARCS.map((a, i) => (
                    <linearGradient
                      key={`h${i}`}
                      id={`aries2-halo-${i}`}
                      gradientUnits="userSpaceOnUse"
                      x1={a.from[0]} y1={a.from[1]} x2={a.to[0]} y2={a.to[1]}
                    >
                      <stop offset="0" stopColor="#a06bff" stopOpacity="0" />
                      <stop offset="0.5" stopColor="#a06bff" stopOpacity="0.45" />
                      <stop offset="1" stopColor="#a06bff" stopOpacity="0" />
                    </linearGradient>
                  ))}
                  {/* 星点自带的淡紫色径向辉光 */}
                  <radialGradient id="aries2-star-glow">
                    <stop offset="0%" stopColor="#dcc6ff" stopOpacity="0.6" />
                    <stop offset="50%" stopColor="#c9a9f2" stopOpacity="0.26" />
                    <stop offset="100%" stopColor="#c9a9f2" stopOpacity="0" />
                  </radialGradient>
                  <filter id="aries2-blur-glow" x="-60%" y="-60%" width="220%" height="220%">
                    <feGaussianBlur stdDeviation="1.25" />
                  </filter>
                  <filter id="aries2-blur-core" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="0.4" />
                  </filter>
                </defs>
                <g className="btn-comet">
                  {/* 弧线的淡紫弥散辉光层 */}
                  <g filter="url(#aries2-blur-glow)" strokeLinecap="round" fill="none">
                    {ARIES2_ARCS.map((a, i) => (
                      <path
                        key={i}
                        d={a.d}
                        stroke={`url(#aries2-halo-${i})`}
                        strokeWidth={a.haloW}
                      />
                    ))}
                  </g>
                  {/* 白色半透明光轨柔芯（轻微模糊去硬边；顶横细丝带虚线漂移） */}
                  <g filter="url(#aries2-blur-core)" strokeLinecap="round" fill="none">
                    {ARIES2_ARCS.map((a, i) => (
                      <path
                        key={i}
                        d={a.d}
                        stroke={`url(#aries2-line-${i})`}
                        strokeWidth={a.w}
                        strokeDasharray={a.dash}
                        className={i === 0 ? "aries2-thread" : undefined}
                      />
                    ))}
                  </g>
                  {/* 粒子流光 */}
                  {ARIES2_DOTS.map((d, i) => (
                    <circle
                      key={i}
                      cx={d.x}
                      cy={d.y}
                      r={d.r}
                      fill={d.purple ? "#c9a9f2" : "#ffffff"}
                      opacity={d.o}
                    />
                  ))}
                  {/* 线上的闪耀星星：错峰闪烁 */}
                  {ARIES2_LINE_STARS.map((s, i) => (
                    <g key={`ls${i}`} className="btn-spark-shine" style={{ animationDelay: `${s.delay}s` }}>
                      <path d={starPath(s.cx, s.cy, s.r)} fill="#ffffff" opacity="0.9" />
                    </g>
                  ))}
                  {/* 顶点处的闪耀星星：以自身为中心缩放闪烁 */}
                  <circle cx="5.8" cy="18.6" r="2.8" fill="url(#aries2-star-glow)" opacity="0.9" />
                  <g className="vertex-star">
                    <path d={starPath(5.8, 18.6, 1.7)} fill="#ffffff" />
                  </g>
                  {/* 三颗十字星光点：淡紫径向辉光 + 错峰闪烁 */}
                  {ARIES2_STARS.map((s, i) => (
                    <g key={i}>
                      <circle cx={s.cx} cy={s.cy} r={s.glow} fill="url(#aries2-star-glow)" />
                      <g className="btn-spark-shine" style={{ animationDelay: `${s.delay}s` }}>
                        <path d={starPath(s.cx, s.cy, s.r)} fill="#ffffff" />
                      </g>
                    </g>
                  ))}
                </g>
              </svg>
              <span className="relative z-10 truncate">编写日记</span>
            </button>
          </div>
        )}
    </div>
  );
}
