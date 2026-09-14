import type { PlanetVisual } from "@/lib/emotion/types";

export function PlanetView({ visual }: { visual: PlanetVisual }) {
  const fill = `hsl(${visual.hue} ${visual.chroma}% ${48 - visual.glow * 8}%)`;
  const glow = 0.25 + visual.glow * 0.7;
  return (
    <div className="flex flex-col items-center gap-3">
      <svg viewBox="0 0 200 200" className="w-56 h-56">
        <defs>
          <radialGradient id="core" cx="38%" cy="32%">
            <stop offset="0%" stopColor="#fff" stopOpacity={0.55} />
            <stop offset="55%" stopColor={fill} />
            <stop offset="100%" stopColor={fill} stopOpacity={0.8} />
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="70" fill={fill} opacity={glow} filter="url()" />
        <circle cx="100" cy="100" r="58" fill="url(#core)" />
        {visual.weather === "mist" && (
          <ellipse cx="100" cy="100" rx="72" ry="20" fill="#fff" opacity="0.18" />
        )}
        {visual.weather === "rain" &&
          [0, 1, 2, 3, 4].map((i) => (
            <line
              key={i}
              x1={70 + i * 14}
              y1="40"
              x2={62 + i * 14}
              y2="70"
              stroke="#cfe4ff"
              strokeWidth="2"
              opacity="0.5"
            />
          ))}
        {visual.weather === "aurora" && (
          <path d="M40 80 C 80 40, 120 120, 160 70" fill="none" stroke="#f0b7ff" strokeWidth="6" opacity="0.45" />
        )}
        {visual.weather === "eclipse" && (
          <circle cx="118" cy="88" r="52" fill="#141318" opacity="0.55" />
        )}
        {visual.companion === "moon" && <circle cx="150" cy="58" r="10" fill="#f4eff4" />}
        {visual.companion === "ring" && (
          <ellipse cx="100" cy="108" rx="78" ry="16" fill="none" stroke="#e6ddff" strokeWidth="3" opacity="0.7" />
        )}
        {visual.companion === "spark" &&
          [0, 1, 2].map((i) => (
            <circle key={i} cx={48 + i * 18} cy={46 + i * 8} r="2.5" fill="#fff7c2" />
          ))}
        {visual.companion === "dust" &&
          [0, 1, 2, 3, 4].map((i) => (
            <circle key={i} cx={50 + i * 22} cy={150} r="1.6" fill="#cac4d0" />
          ))}
      </svg>
      <p className="text-xl font-medium text-on-surface">{visual.label}</p>
    </div>
  );
}
