"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/", label: "星球" },
  { href: "/journal", label: "日记" },
  { href: "/mood", label: "分享" },
];

type Props = {
  active: boolean;
  uid: string;
};

/* 确定性伪随机：SSR 与客户端生成同一批星尘坐标，避免 hydration 抖动 */
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

/* 星环几何：中心 (90,40)，长轴 62 短轴 24，整体倾斜 -12° */
const RING = { cx: 90, cy: 40, rx: 62, ry: 24, tilt: (-12 * Math.PI) / 180 };

function ringPoint(t: number, jitter = 0) {
  const { cx, cy, rx, ry, tilt } = RING;
  const cosT = Math.cos(t);
  const sinT = Math.sin(t);
  const scale = 1 + jitter;
  return {
    x: cx + scale * (rx * cosT * Math.cos(tilt) - ry * sinT * Math.sin(tilt)),
    y: cy + scale * (rx * cosT * Math.sin(tilt) + ry * sinT * Math.cos(tilt)),
  };
}

/* 环带星尘：贴着椭圆散布，越靠近右下亮弧越亮越密 */
const RING_DUST = (() => {
  const rand = mulberry32(20261117);
  const brightAngle = Math.PI / 4;
  return Array.from({ length: 26 }, (_, i) => {
    const t = (i / 26) * Math.PI * 2 + rand() * 0.22;
    const { x, y } = ringPoint(t, (rand() - 0.5) * 0.16);
    const near = Math.max(0, Math.cos(t - brightAngle));
    return {
      x,
      y,
      r: 0.4 + rand() * 0.5 + near * 0.35,
      o: 0.3 + near * near * 0.65 + rand() * 0.1,
    };
  });
})();

/* 四角星芒 */
function Sparkle({
  x,
  y,
  s,
  o = 1,
  delay = "0s",
}: {
  x: number;
  y: number;
  s: number;
  o?: number;
  delay?: string;
}) {
  const k = s * 0.16;
  const d = `M ${x} ${y - s} Q ${x + k} ${y - k} ${x + s} ${y} Q ${x + k} ${y + k} ${x} ${y + s} Q ${x - k} ${y + k} ${x - s} ${y} Q ${x - k} ${y - k} ${x} ${y - s} Z`;
  return (
    <path
      d={d}
      fill="#ffffff"
      opacity={o}
      className="nav-sparkle"
      style={{ animationDelay: delay }}
    />
  );
}

// 星环导航：亮弧光圈 + 环带星尘 + 四角星芒，围绕文字一圈轨道
function GalaxyRing({ active, uid }: Props) {
  const gradId = `galaxy-${uid}`;
  const glowId = `galaxy-glow-${uid}`;
  const orbitId = `galaxy-orbit-${uid}`;

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 180 80"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        {/* 主环渐变：右下白亮，左上紫暗，紫更浓 */}
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3c1580" stopOpacity="0" />
          <stop offset="28%" stopColor="#9a4fe0" stopOpacity="0.75" />
          <stop offset="52%" stopColor="#d9b3ff" stopOpacity="0.95" />
          <stop offset="66%" stopColor="#ffffff" />
          <stop offset="88%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#c77dff" stopOpacity="0.85" />
        </linearGradient>

        {/* 右下爆发光晕 */}
        <radialGradient id={glowId} cx="72%" cy="64%" r="46%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity={active ? 0.4 : 0.2} />
          <stop offset="40%" stopColor="#c77dff" stopOpacity={active ? 0.3 : 0.14} />
          <stop offset="100%" stopColor="#6a21b5" stopOpacity="0" />
        </radialGradient>

        {/* 流星飞行轨道（与主环同形） */}
        <path
          id={orbitId}
          d="M150.6 27.1 A62 24 -12 1 0 29.4 52.9 A62 24 -12 1 0 150.6 27.1"
          fill="none"
        />
      </defs>

      {/* 环内极淡柔光 */}
      <ellipse
        cx="90"
        cy="40"
        rx="62"
        ry="24"
        fill={`url(#${glowId})`}
        transform="rotate(-12 90 40)"
      />

      {/* 多层细线轨道：主环 */}
      <ellipse
        cx="90"
        cy="40"
        rx="62"
        ry="24"
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth={active ? 1.3 : 0.9}
        transform="rotate(-12 90 40)"
      />

      {/* 第二层细线：略微错开倾角 */}
      <ellipse
        cx="90"
        cy="40"
        rx="57"
        ry="21"
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth={active ? 0.8 : 0.55}
        opacity={active ? 0.9 : 0.65}
        transform="rotate(-14 90 40)"
      />

      {/* 第三层更细的内线 */}
      <ellipse
        cx="91"
        cy="41"
        rx="51"
        ry="18"
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth="0.45"
        opacity={active ? 0.6 : 0.4}
        transform="rotate(-15 91 41)"
      />

      {/* 第四层外侧若隐若现细线 */}
      <ellipse
        cx="90"
        cy="40"
        rx="68"
        ry="27"
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth="0.4"
        opacity={active ? 0.35 : 0.22}
        transform="rotate(-10 90 40)"
      />

      {/* 亮弧白热光斑：小而脆，无模糊 */}
      <circle cx="142" cy="44" r={active ? 1.6 : 1.1} fill="#ffffff" opacity={active ? 1 : 0.8} />
      <circle cx="128" cy="53" r={active ? 1.1 : 0.8} fill="#ffffff" opacity={active ? 0.9 : 0.6} />

      {/* 沿星轨流走的星星：多颗不同速度循环 */}
      <circle r={active ? 1.1 : 0.85} fill="#ffffff" opacity="0.95">
        <animateMotion dur="5s" begin="-1s" repeatCount="indefinite">
          <mpath href={`#${orbitId}`} />
        </animateMotion>
      </circle>
      <circle r={active ? 0.9 : 0.7} fill="#ffffff" opacity="0.8">
        <animateMotion dur="7s" begin="-3s" repeatCount="indefinite">
          <mpath href={`#${orbitId}`} />
        </animateMotion>
      </circle>
      <circle r="0.65" fill="#e9c6ff" opacity="0.85">
        <animateMotion dur="6s" begin="-4.5s" repeatCount="indefinite">
          <mpath href={`#${orbitId}`} />
        </animateMotion>
      </circle>
      <circle r="0.55" fill="#ffffff" opacity="0.7">
        <animateMotion dur="8s" begin="-6s" repeatCount="indefinite">
          <mpath href={`#${orbitId}`} />
        </animateMotion>
      </circle>

      {/* 环带星尘 */}
      <g>
        {RING_DUST.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={d.r} fill="#ffffff" opacity={d.o} />
        ))}
      </g>

      {/* 四角星芒：选中更大更亮更多 */}
      <Sparkle x={148} y={52} s={active ? 5.6 : 4} o={1} />
      <Sparkle x={122} y={58} s={3.6} o={0.9} delay="1.2s" />
      <Sparkle x={152} y={30} s={3} o={0.8} delay="0.6s" />
      <Sparkle x={34} y={28} s={2.4} o={0.5} delay="1.8s" />
      <Sparkle x={136} y={46} s={2.2} o={0.85} delay="2.6s" />
      <Sparkle x={44} y={54} s={2} o={0.6} delay="0.3s" />
      {active && (
        <>
          <Sparkle x={64} y={60} s={3.2} o={0.9} delay="0.9s" />
          <Sparkle x={106} y={17} s={3.6} o={0.95} delay="1.5s" />
          <Sparkle x={158} y={46} s={2.6} o={0.85} delay="2.2s" />
        </>
      )}
    </svg>
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
      {/* 桌面侧边栏：星环居中包裹文字，与移动端一致 */}
      <aside className="hidden md:flex w-44 flex-col gap-2 p-4 border-r border-outline-variant">
        <p className="px-3 py-2 text-sm text-on-surface-variant">伴语星球</p>
        {ITEMS.map((item) => {
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative h-10 px-3 rounded-xl flex items-center justify-center overflow-visible ${
                active
                  ? "bg-surface-container-high text-primary"
                  : "text-on-surface-variant"
              }`}
            >
              <span className="relative z-10">{item.label}</span>
              <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="relative w-32 h-14">
                  <GalaxyRing active={active} uid={`side-${item.label}`} />
                </span>
              </span>
            </Link>
          );
        })}
      </aside>

      <div className="flex-1 pb-20 md:pb-0">{children}</div>

      {/* 移动端底部导航：浅紫半透明条带，上缘亮线 */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 h-20 flex z-10"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.08) 100%)",
          backdropFilter: "blur(18px)",
          borderTop: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        {ITEMS.map((item) => {
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex-1 flex items-center justify-center"
            >
              <span className="relative w-full h-16 flex items-center justify-center">
                <GalaxyRing active={active} uid={`bot-${item.label}`} />
                <span
                  className={`relative z-10 text-xl transition-all duration-500 ${
                    active ? "text-white font-medium" : "text-gray-200/90"
                  }`}
                  style={{
                    textShadow: active
                      ? "0 0 8px #e19cff, 0 0 18px #9b46dd"
                      : "0 0 3px rgba(255,255,255,0.4)",
                  }}
                >
                  {item.label}
                </span>
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
