"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";

const ITEMS = [
  { href: "/", label: "星球" },
  { href: "/journal", label: "日记" },
  { href: "/mood", label: "分享" },
];

/* 确定性伪随机：SSR 与客户端生成同一批星点坐标，避免 hydration 抖动 */
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

/* ---------- 背景星尘：细碎微弱白点，大小不一，静态不闪烁 ---------- */
type StarDot = { left: string; top: string; size: number; opacity: number; glow: boolean };

function makeStars(count: number, seed: number): StarDot[] {
  const rand = mulberry32(seed);
  return Array.from({ length: count }, () => {
    const size = 0.8 + rand() * rand() * 2.6;
    return {
      left: `${(rand() * 100).toFixed(2)}%`,
      top: `${(rand() * 100).toFixed(2)}%`,
      size: Number(size.toFixed(2)),
      opacity: Number((0.1 + rand() * 0.3).toFixed(2)),
      glow: size > 2.2,
    };
  });
}

const NAV_STARS = makeStars(46, 20261118);
const SIDE_STARS = makeStars(36, 20261121);

function StarDots({ stars }: { stars: StarDot[] }) {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((s, i) => {
        const box = s.glow ? s.size * 2.4 : s.size;
        return (
          <span
            key={i}
            className="bg-star"
            style={{
              left: s.left,
              top: s.top,
              width: Number(box.toFixed(2)),
              height: Number(box.toFixed(2)),
              opacity: s.opacity,
              ...(s.glow
                ? {
                    background:
                      "radial-gradient(circle, #fff 0%, rgba(255,255,255,0.45) 40%, transparent 70%)",
                  }
                : null),
            }}
          />
        );
      })}
    </div>
  );
}

/* ---------- 星环轨道：两层错开的倾斜椭圆光轨，纯 CSS 粒子拖尾 ---------- */

/* 椭圆参数角（度）→ 轨道盒内的百分比坐标 */
function ellipsePos(deg: number) {
  const rad = (deg * Math.PI) / 180;
  return {
    left: `${(50 + 49 * Math.cos(rad)).toFixed(2)}%`,
    top: `${(50 + 48.5 * Math.sin(rad)).toFixed(2)}%`,
  };
}

type MoonConf = {
  /* 公转周期倍数：基于轨道基准周期，错开速度 */
  mult: number;
  /* 负延迟 = 开场就走在轨道的不同位置 */
  delay: number;
  size: number;
};

type TrackConf = {
  w: number;
  h: number;
  /* 轨道倾斜角（度），几条错开形成缠绕 */
  tilt: number;
  /* 细线亮弧的 conic 起始角，各环错开 */
  ringFrom: number;
  /* 十字星芒高光所在的参数角 */
  nodes: number[];
  nodeScale: number;
  /* 沿轨道公转的星星 */
  moons: MoonConf[];
  moonDurActive: number;
  moonDurIdle: number;
  dim: number;
};

/* 三条倾角/尺寸各异的椭圆细线轨道，缠绕在一起 */
const TRACKS: TrackConf[] = [
  {
    w: 104, h: 44, tilt: -15, ringFrom: 210, dim: 0.88,
    nodes: [15, 105, 195, 285], nodeScale: 1,
    moons: [
      { mult: 1, delay: 0, size: 3.4 },
      { mult: 1.55, delay: -6.2, size: 2.6 },
      { mult: 2.4, delay: -13.8, size: 2.1 },
    ],
    moonDurActive: 13, moonDurIdle: 24,
  },
  {
    w: 86, h: 36, tilt: -24, ringFrom: 30, dim: 0.8,
    nodes: [70, 250], nodeScale: 0.8,
    moons: [
      { mult: 1, delay: -3.4, size: 2.7 },
      { mult: 1.8, delay: -12.6, size: 2.2 },
    ],
    moonDurActive: 17, moonDurIdle: 30,
  },
  {
    w: 118, h: 30, tilt: -7, ringFrom: 120, dim: 0.52,
    nodes: [150], nodeScale: 0.7,
    moons: [
      { mult: 1, delay: -9, size: 2.3 },
    ],
    moonDurActive: 21, moonDurIdle: 34,
  },
];

/* 光轨细线：两段亮弧 + 自然淡出的透明缺口，非闭合硬圈（亮度压低适配按钮） */
function ringBackground(from: number): string {
  return `conic-gradient(from ${from}deg,
    transparent 0deg,
    rgba(255,255,255,0.68) 55deg,
    rgba(255,255,255,0.88) 85deg,
    rgba(255,255,255,0.2) 130deg,
    transparent 185deg,
    rgba(216,172,255,0.46) 245deg,
    rgba(255,255,255,0.78) 290deg,
    rgba(255,255,255,0.16) 330deg,
    transparent 360deg)`;
}

/* 环周明亮闪烁的星点：贴着轨道外围散布，部分带十字星芒，错峰闪烁 */
const SPARK_SEEDS = [20261, 20262, 20263];

type RingSpark = {
  left: number;
  top: number;
  size: number;
  dur: number;
  delay: number;
  big: boolean;
};

function makeRingSparks(seed: number): RingSpark[] {
  const rand = mulberry32(seed);
  return Array.from({ length: 12 }, () => {
    const t = rand() * Math.PI * 2;
    const f = 0.72 + rand() * 0.75;
    const big = rand() > 0.78;
    return {
      left: Number((65 + 56 * Math.cos(t) * f).toFixed(1)),
      top: Number((37 + 27 * Math.sin(t) * f).toFixed(1)),
      size: Number((big ? 2.4 + rand() * 1.2 : 1.2 + rand() * 1.2).toFixed(1)),
      dur: Number((2.6 + rand() * 2.6).toFixed(2)),
      delay: Number((-rand() * 5).toFixed(2)),
      big,
    };
  });
}

const RING_SPARKS = SPARK_SEEDS.map(makeRingSparks);

/* 高光星点：白色星核 + 十字星芒 + 紫色径向辉光，随轨道一起转动 */
function OrbitStarNode({ deg, scale = 1, delay = 0 }: { deg: number; scale?: number; delay?: number }) {
  return (
    <span
      className="orbit-node"
      style={{ ...ellipsePos(deg), "--ns": scale, animationDelay: `${delay}s` } as CSSProperties}
    >
      <span className="orbit-node-aura" />
      <span className="orbit-node-beam" />
      <span className="orbit-node-beam-v" />
      <span className="orbit-node-core" />
    </span>
  );
}

/* 沿椭圆轨道公转的星星：tilt 压扁把圆周变椭圆路径，arm 提供半径偏移，
   anti 与 rotor 同速反转抵消朝向，星点自身始终保持正立圆形 */
function OrbitMoon({
  w,
  h,
  dur,
  delay,
  size,
}: {
  w: number;
  h: number;
  dur: number;
  delay: number;
  size: number;
}) {
  const f = h / w;
  const spin = { animationDuration: `${dur}s`, animationDelay: `${delay}s` };
  return (
    <span className="orbit-tilt" style={{ transform: `scaleY(${f.toFixed(4)})` }}>
      <span className="orbit-rotor" style={spin}>
        <span className="orbit-arm" style={{ marginLeft: w / 2 }}>
          <span className="orbit-anti" style={spin}>
            <span
              className="orbit-moon"
              style={{ width: size, height: size, transform: `scaleY(${(1 / f).toFixed(4)})` }}
            />
          </span>
        </span>
      </span>
    </span>
  );
}

/* 环周闪烁星点层 */
function RingSparkles({ sparks, active }: { sparks: RingSpark[]; active: boolean }) {
  return (
    <span
      className="ring-sparkles"
      style={{ opacity: active ? 1 : 0.55, transition: "opacity 0.6s ease" }}
    >
      {sparks.map((s, i) => (
        <span
          key={i}
          className={`ring-twinkle${s.big ? " ring-twinkle-x" : ""}`}
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            animationDuration: `${s.dur}s`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </span>
  );
}

/* 单层轨道：倾斜椭圆细线，本体静止、轻微闪动，星星沿轨道公转（选中态公转更快） */
function OrbitTrack({
  conf,
  phase,
  active,
}: {
  conf: TrackConf;
  phase: number;
  active: boolean;
}) {
  return (
    <span
      className="absolute left-1/2 top-1/2 block"
      style={{
        width: conf.w,
        height: conf.h,
        translate: "-50% -50%",
        rotate: `${conf.tilt}deg`,
        opacity: active ? conf.dim : conf.dim * 0.45,
        transition: "opacity 0.6s ease",
      }}
    >
      <span className="orbit-track">
        <span className="orbit-shimmer" style={{ animationDelay: `${Math.abs(phase) % 6.2}s` }}>
          <span className="orbit-ring-glow">
            <span className="orbit-ring" style={{ background: ringBackground(conf.ringFrom) }} />
          </span>
        </span>
        {conf.nodes.map((deg, i) => (
          <OrbitStarNode
            key={deg}
            deg={deg}
            scale={conf.nodeScale * (i === 0 ? 1.2 : 1)}
            delay={i * 1.4}
          />
        ))}
        {conf.moons.map((m, i) => (
          <OrbitMoon
            key={i}
            w={conf.w}
            h={conf.h}
            dur={(active ? conf.moonDurActive : conf.moonDurIdle) * m.mult}
            delay={m.delay}
            size={active ? m.size : m.size * 0.85}
          />
        ))}
      </span>
    </span>
  );
}

/* 各 Tab 的闪动相位（作为 shimmer 的负延迟），让三个星环闪动节奏错开 */
const TAB_PHASES: { outer: number; inner: number; flat: number }[] = [
  { outer: -2.4, inner: -2.2, flat: -1.1 },
  { outer: -0.6, inner: 1.7, flat: -4.3 },
  { outer: -1.5, inner: -3.7, flat: -2.8 },
];

/*
 * 星环整体：环心柔光 + 三条倾斜缠绕的椭圆细线轨道（原地轻微闪动）
 * + 沿轨道公转的星星 + 环周明亮闪烁的星点。
 * 全部为 CSS 动画：组件卸载（或所在导航 display:none）即自动停止，无定时器需要清理。
 */
function GalaxyRing({
  active,
  phase,
  sparks,
}: {
  active: boolean;
  phase: { outer: number; inner: number; flat: number };
  sparks: RingSpark[];
}) {
  return (
    <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <span className="orbit-halo" style={{ opacity: active ? 1 : 0.35, transition: "opacity 0.6s ease" }} />
      <OrbitTrack conf={TRACKS[0]} phase={phase.outer} active={active} />
      <OrbitTrack conf={TRACKS[1]} phase={phase.inner} active={active} />
      <OrbitTrack conf={TRACKS[2]} phase={phase.flat} active={active} />
      <RingSparkles sparks={sparks} active={active} />
    </span>
  );
}

/* 文字光晕：选中为白紫柔光，未选中仅微弱白光 */
function labelGlow(active: boolean): CSSProperties {
  return {
    textShadow: active
      ? "0 0 10px rgba(228,208,255,0.7), 0 0 24px rgba(150,92,232,0.4)"
      : "0 0 6px rgba(255,255,255,0.22)",
  };
}

function TabLabel({ label, active, size }: { label: string; active: boolean; size: string }) {
  return (
    <span
      className={`relative z-10 ${size} transition-colors duration-500 ${
        active ? "text-white font-medium" : "text-white/60"
      }`}
      style={labelGlow(active)}
    >
      {label}
    </span>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();

  function isActive(item: (typeof ITEMS)[0]) {
    if (item.href === "/") return path === "/";
    return path.startsWith(item.href);
  }

  return (
    <div className="planet-shell min-h-dvh flex flex-col md:flex-row">
      {/* 桌面侧边栏：星环居中包裹文字，与移动端一致（md 以下 display:none，动画自动暂停） */}
      <aside className="hidden md:flex relative w-44 flex-col gap-3 p-4 border-r border-white/[0.06]">
        <StarDots stars={SIDE_STARS} />
        <p className="relative px-3 py-2 text-sm tracking-[0.3em] text-white/40">伴语星球</p>
        {ITEMS.map((item, i) => {
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className="relative h-14 rounded-xl flex items-center justify-center"
            >
              <GalaxyRing active={active} phase={TAB_PHASES[i]} sparks={RING_SPARKS[i]} />
              <TabLabel label={item.label} active={active} size="text-lg" />
            </Link>
          );
        })}
      </aside>

      <div className="flex-1 pb-20 md:pb-0">{children}</div>

      {/* 移动端底部导航：悬浮星环 + 静态星尘，无硬描边 */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 h-20 flex z-10">
        <StarDots stars={NAV_STARS} />
        {ITEMS.map((item, i) => {
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className="relative flex-1 flex items-center justify-center"
            >
              <GalaxyRing active={active} phase={TAB_PHASES[i]} sparks={RING_SPARKS[i]} />
              <TabLabel label={item.label} active={active} size="text-xl" />
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
