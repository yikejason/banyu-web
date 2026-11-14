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

// 移动端底部：强光环 + 多星点
function GalaxyRingBottom({ active, uid }: Props) {
  const gradId = `galaxy-bot-${uid}`;
  const glowId = `galaxy-bot-glow-${uid}`;
  const outerId = `galaxy-bot-outer-${uid}`;

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 170 72"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        {/* 主环渐变：右下白亮，左上紫暗 */}
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4a1a85" stopOpacity="0" />
          <stop offset="48%" stopColor="#8a3dd1" stopOpacity="0.55" />
          <stop offset="72%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="88%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="100%" stopColor="#d38bff" stopOpacity="0.7" />
        </linearGradient>

        {/* 右下爆发光晕 */}
        <radialGradient id={glowId} cx="74%" cy="66%" r="44%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity={active ? 0.7 : 0.35} />
          <stop offset="38%" stopColor="#c77dff" stopOpacity={active ? 0.5 : 0.22} />
          <stop offset="100%" stopColor="#6a21b5" stopOpacity="0" />
        </radialGradient>

        {/* 外侧扩散弱环 */}
        <radialGradient id={outerId} cx="74%" cy="66%" r="50%">
          <stop offset="58%" stopColor="#9c4ae8" stopOpacity="0" />
          <stop offset="76%" stopColor="#9c4ae8" stopOpacity={active ? 0.32 : 0.14} />
          <stop offset="100%" stopColor="#541ca3" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* 外层扩散环 */}
      <ellipse
        cx="85"
        cy="36"
        rx="56"
        ry="23"
        fill="none"
        stroke={`url(#${outerId})`}
        strokeWidth={active ? 8 : 3}
        transform="rotate(-22 85 36)"
      />

      {/* 右下高光晕 */}
      <ellipse
        cx="85"
        cy="36"
        rx="48"
        ry="20"
        fill={`url(#${glowId})`}
        transform="rotate(-22 85 36)"
      />

      {/* 主亮环 */}
      <ellipse
        cx="85"
        cy="35"
        rx="50"
        ry="20"
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth={active ? 3 : 1.4}
        strokeLinecap="round"
        transform="rotate(-22 85 35)"
      />

      {/* 内侧细环 */}
      <ellipse
        cx="87"
        cy="37"
        rx="42"
        ry="15"
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth={active ? 1.6 : 0.8}
        opacity={0.8}
        transform="rotate(-22 87 37)"
      />

      {/* 环上附着星芒：选中更大更密 */}
      <g>
        <circle cx="120" cy="24" r={active ? 1.5 : 0.9} fill="#ffffff" />
        <circle cx="128" cy="32" r={active ? 1.2 : 0.75} fill="#ffffff" />
        <circle cx="114" cy="48" r={active ? 1.3 : 0.85} fill="#ffffff" />
        <circle cx="134" cy="42" r={active ? 1.1 : 0.65} fill="#ffffff" />
        <circle cx="104" cy="22" r={active ? 1 : 0.6} fill="#ffffff" />
        <circle cx="118" cy="54" r={active ? 1.2 : 0.8} fill="#ffffff" />
        <circle cx="138" cy="28" r={active ? 0.9 : 0.55} fill="#ffffff" />
        <circle cx="130" cy="56" r={active ? 0.8 : 0.5} fill="#ffffff" />
        <circle cx="142" cy="34" r={active ? 0.7 : 0.4} fill="#ffffff" />
        <circle cx="110" cy="14" r={active ? 0.6 : 0.35} fill="#ffffff" />
      </g>

      {/* 游离细碎星点：未选中也保留，选中再加密 */}
      <g>
        <circle cx="96" cy="14" r="0.5" fill="#ffffff" />
        <circle cx="146" cy="24" r="0.45" fill="#ffffff" />
        <circle cx="152" cy="38" r="0.4" fill="#ffffff" />
        <circle cx="140" cy="60" r="0.45" fill="#ffffff" />
        <circle cx="100" cy="62" r="0.35" fill="#ffffff" />
        <circle cx="70" cy="20" r="0.35" fill="#ffffff" />
        <circle cx="64" cy="40" r="0.3" fill="#ffffff" />
        <circle cx="156" cy="54" r="0.4" fill="#ffffff" />

        {active && (
          <>
            <circle cx="156" cy="16" r="0.6" fill="#ffffff" />
            <circle cx="160" cy="48" r="0.55" fill="#ffffff" />
            <circle cx="148" cy="8" r="0.45" fill="#ffffff" />
            <circle cx="92" cy="6" r="0.5" fill="#ffffff" />
            <circle cx="164" cy="30" r="0.4" fill="#ffffff" />
            <circle cx="78" cy="64" r="0.4" fill="#ffffff" />
          </>
        )}
      </g>
    </svg>
  );
}

// 桌面端：同样加强光环识别度和星点
function GalaxyRingDesktop({ active, uid }: Props) {
  const gradId = `galaxy-side-${uid}`;
  const glowId = `galaxy-side-glow-${uid}`;

  return (
    <svg
      className="absolute right-1 top-1/2 -translate-y-1/2 w-11 h-7 pointer-events-none"
      viewBox="0 0 120 50"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4a1a85" stopOpacity="0" />
          <stop offset="48%" stopColor="#8a3dd1" stopOpacity="0.52" />
          <stop offset="72%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="88%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="100%" stopColor="#d38bff" stopOpacity="0.68" />
        </linearGradient>

        <radialGradient id={glowId} cx="74%" cy="66%" r="44%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity={active ? 0.6 : 0.3} />
          <stop offset="38%" stopColor="#c77dff" stopOpacity={active ? 0.42 : 0.18} />
          <stop offset="100%" stopColor="#6a21b5" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse
        cx="60"
        cy="25"
        rx="34"
        ry="14"
        fill={`url(#${glowId})`}
        transform="rotate(-22 60 25)"
      />

      <ellipse
        cx="60"
        cy="24"
        rx="36"
        ry="14"
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth={active ? 2.4 : 1.1}
        strokeLinecap="round"
        transform="rotate(-22 60 24)"
      />

      <ellipse
        cx="62"
        cy="25"
        rx="30"
        ry="11"
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth={active ? 1.4 : 0.7}
        opacity={0.8}
        transform="rotate(-22 62 25)"
      />

      <g>
        <circle cx="84" cy="16" r={active ? 1.1 : 0.7} fill="#ffffff" />
        <circle cx="92" cy="22" r={active ? 0.9 : 0.6} fill="#ffffff" />
        <circle cx="82" cy="34" r={active ? 1 : 0.7} fill="#ffffff" />
        <circle cx="96" cy="30" r={active ? 0.8 : 0.5} fill="#ffffff" />
        <circle cx="74" cy="12" r={active ? 0.5 : 0.35} fill="#ffffff" />
        <circle cx="100" cy="40" r={active ? 0.45 : 0.3} fill="#ffffff" />
      </g>
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
      {/* 桌面侧边栏 */}
      <aside className="hidden md:flex w-44 flex-col gap-1 p-4 border-r border-outline-variant">
        <p className="px-3 py-2 text-sm text-on-surface-variant">伴语星球</p>
        {ITEMS.map((item) => {
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative h-9 px-3 rounded-xl flex items-center overflow-visible ${
                active
                  ? "bg-surface-container-high text-primary"
                  : "text-on-surface-variant"
              }`}
            >
              <span className="relative z-10">{item.label}</span>
              <GalaxyRingDesktop active={active} uid={`side-${item.label}`} />
            </Link>
          );
        })}
      </aside>

      <div className="flex-1 pb-20 md:pb-0">{children}</div>

      {/* 移动端底部导航 */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 h-20 flex bg-transparent">
        {ITEMS.map((item) => {
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex-1 flex items-center justify-center overflow-visible"
            >
              <GalaxyRingBottom active={active} uid={`bottom-${item.label}`} />
              <span
                className={`relative z-10 text-xl transition-all duration-500 ${
                  active ? "text-white font-medium" : "text-gray-300/90"
                }`}
                style={{
                  textShadow: active
                    ? "0 0 8px #e19cff, 0 0 16px #9b46dd"
                    : "0 0 3px rgba(255,255,255,0.45)",
                }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
