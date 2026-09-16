"use client";

import type { PlanetVisual } from "@/lib/emotion/types";

export type PlanetTrace = {
  id: string;
  hue: number;
  label: string;
};

export function PlanetView({
  visual,
  traces = [],
  activeId,
  onSelect,
  figureSrc,
  figureLabel,
}: {
  visual: PlanetVisual;
  traces?: PlanetTrace[];
  activeId?: string;
  onSelect?: (id: string) => void;
  figureSrc?: string;
  figureLabel?: string;
}) {
  const fill = `hsl(${visual.hue} ${visual.chroma}% ${46 - visual.glow * 6}%)`;
  const glow = 0.35 + visual.glow * 0.55;
  const gid = `planet-${visual.hue}-${visual.weather}`;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative h-72 w-72 md:h-80 md:w-80">
        <div
          className="planet-aura pointer-events-none absolute inset-[12%] rounded-full"
          style={{
            background: `radial-gradient(circle, ${fill} 0%, transparent 70%)`,
            opacity: glow,
          }}
        />
        <svg viewBox="0 0 240 240" className="absolute inset-0 size-full">
          <defs>
            <radialGradient id={`${gid}-core`} cx="36%" cy="30%">
              <stop offset="0%" stopColor="#fff" stopOpacity={0.7} />
              <stop offset="42%" stopColor={fill} />
              <stop offset="100%" stopColor={fill} stopOpacity={0.85} />
            </radialGradient>
            <filter id={`${gid}-glow`} x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="7" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <ellipse
            className="planet-ring"
            cx="120"
            cy="128"
            rx="102"
            ry="36"
            fill="none"
            stroke="color-mix(in srgb, white 28%, transparent)"
            strokeWidth="1"
          />
          <circle cx="120" cy="118" r="78" fill={fill} opacity={glow * 0.35} filter={`url(#${gid}-glow)`} />
          <circle cx="120" cy="118" r="58" fill={`url(#${gid}-core)`} />
          {visual.weather === "mist" && (
            <ellipse cx="120" cy="118" rx="70" ry="18" fill="#fff" opacity="0.16" />
          )}
          {visual.weather === "rain" &&
            [0, 1, 2, 3, 4].map((i) => (
              <line
                key={i}
                x1={90 + i * 14}
                y1="62"
                x2={82 + i * 14}
                y2="92"
                stroke="#cfe4ff"
                strokeWidth="2"
                opacity="0.45"
              />
            ))}
          {visual.weather === "aurora" && (
            <path
              d="M55 100 C 95 58, 140 142, 185 88"
              fill="none"
              stroke="#f0b7ff"
              strokeWidth="6"
              opacity="0.45"
            />
          )}
          {visual.weather === "eclipse" && (
            <circle cx="138" cy="106" r="50" fill="#0d0a16" opacity="0.55" />
          )}
          {visual.companion === "moon" && <circle cx="176" cy="72" r="9" fill="#f4eff4" />}
          {visual.companion === "ring" && (
            <ellipse
              cx="120"
              cy="124"
              rx="76"
              ry="16"
              fill="none"
              stroke="#e6ddff"
              strokeWidth="3"
              opacity="0.7"
            />
          )}
          {visual.companion === "spark" &&
            [0, 1, 2].map((i) => (
              <circle key={i} cx={62 + i * 16} cy={64 + i * 7} r="2.4" fill="#fff7c2" />
            ))}
          {visual.companion === "dust" && traces.length === 0 &&
            [0, 1, 2, 3, 4].map((i) => (
              <circle key={i} cx={70 + i * 22} cy="168" r="1.6" fill="#cac4d0" />
            ))}
        </svg>
        {figureSrc && (
          <img
            src={figureSrc}
            alt={figureLabel ?? ""}
            className="pointer-events-none absolute bottom-[6%] left-1/2 z-10 h-[46%] -translate-x-1/2 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.45)]"
          />
        )}
        {traces.slice(0, 8).map((trace, i) => {
          const angle = (i / Math.max(traces.length, 8)) * Math.PI * 2 - Math.PI / 2;
          const left = 50 + 38 * Math.cos(angle);
          const top = 53 + 15 * Math.sin(angle);
          const active = trace.id === activeId;
          return (
            <button
              key={trace.id}
              type="button"
              aria-label={trace.label}
              title={trace.label}
              onClick={() => onSelect?.(trace.id)}
              className={`absolute size-3 rounded-full -translate-x-1/2 -translate-y-1/2 shadow-[0_0_12px_currentColor] transition-transform ${
                active ? "scale-150 ring-2 ring-white/80" : "hover:scale-125"
              }`}
              style={{
                left: `${left}%`,
                top: `${top}%`,
                background: `hsl(${trace.hue} 80% 72%)`,
                color: `hsl(${trace.hue} 80% 72%)`,
              }}
            />
          );
        })}
      </div>
      <p className="text-xl font-medium tracking-wide text-on-surface">{visual.label}</p>
    </div>
  );
}
