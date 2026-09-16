"use client";

import { Starfield } from "@/components/planet/Starfield";

const ORBS = [
  { src: "/orbs/gold.png", label: "暖光", glow: "#f5c56b", duration: "7.5s" },
  { src: "/orbs/blue.png", label: "静海", glow: "#8bd0ff", duration: "10s", reverse: true },
  { src: "/orbs/heart.png", label: "薄暮", glow: "#ff8eb4", duration: "8.5s" },
] as const;

function Orb({
  src,
  label,
  glow,
  duration,
  reverse,
}: {
  src: string;
  label: string;
  glow: string;
  duration: string;
  reverse?: boolean;
}) {
  return (
    <div className="relative size-[5.75rem] overflow-visible [perspective:240px] md:size-[6.5rem]" style={{ color: glow }}>
      <span
        className={`cover-orb-halo ${reverse ? "cover-orb-halo-rev" : ""}`}
        style={{ animationDuration: duration }}
      />
      <span
        className={`cover-orb-rim ${reverse ? "cover-orb-halo-rev" : ""}`}
        style={{ animationDuration: reverse ? "6.5s" : "5s" }}
      />
      <img
        src={src}
        alt=""
        className="relative z-10 size-full object-contain"
        style={{ filter: `drop-shadow(0 0 14px ${glow})` }}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}

export function CoverScreen({
  onEnter,
  busy,
}: {
  onEnter: () => void;
  busy?: boolean;
}) {
  return (
    <main className="planet-scene relative isolate flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6">
      <Starfield />
      <div className="relative z-10 flex w-full max-w-[400px] flex-col items-center">
        <svg viewBox="0 0 72 48" className="h-10 w-14" aria-hidden>
          <ellipse cx="36" cy="28" rx="22" ry="7" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2" />
          <circle cx="36" cy="22" r="12" fill="url(#cover-planet)" />
          <defs>
            <radialGradient id="cover-planet" cx="35%" cy="30%">
              <stop offset="0%" stopColor="#f3e8ff" />
              <stop offset="70%" stopColor="#b57bff" />
              <stop offset="100%" stopColor="#6d28d9" />
            </radialGradient>
          </defs>
        </svg>
        <section className="planet-glass mt-5 w-full px-6 pb-8 pt-6 text-center">
          <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm">
            <span className="size-1.5 rounded-full bg-primary" />
            伴语星球
          </p>
          <h1 className="mt-6 text-[1.7rem] font-medium leading-snug tracking-wide">
            于同一颗星球，
            <br />
            听见彼此心底的声音。
          </h1>
          <div className="relative mx-auto mt-8 flex h-44 w-full items-center justify-center overflow-visible">
            <div className="relative z-10 flex items-center justify-center gap-2 md:gap-3">
              {ORBS.map((orb) => (
                <Orb key={orb.label} {...orb} />
              ))}
            </div>
          </div>
          <p className="mt-2 text-sm tracking-[0.2em] text-on-surface-variant">— 进入伴语星球 —</p>
        </section>
        <button
          type="button"
          onClick={onEnter}
          disabled={busy}
          className="cover-connect mt-8"
        >
          <span className="relative z-10">{busy ? "正在连接…" : "开始连接"}</span>
        </button>
      </div>
    </main>
  );
}
