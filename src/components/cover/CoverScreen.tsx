"use client";

import { Starfield } from "@/components/planet/Starfield";

const NEBULAE = [
  { left: "-16%", top: "-14%", size: "64vmin", from: "rgba(124, 107, 196, 0.22)", delay: "0s" },
  { left: "56%", top: "-10%", size: "56vmin", from: "rgba(240, 183, 196, 0.15)", delay: "2.6s" },
  { left: "20%", top: "24%", size: "48vmin", from: "rgba(203, 189, 255, 0.12)", delay: "5.2s" },
] as const;

export function CoverScreen({
  onEnter,
  busy,
}: {
  onEnter: () => void;
  busy?: boolean;
}) {
  return (
    <main className="cover-scene relative isolate flex min-h-dvh flex-col overflow-hidden">
      <Starfield />
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {NEBULAE.map((nebula) => (
          <span
            key={`${nebula.left}-${nebula.top}`}
            className="cover-nebula"
            style={{
              left: nebula.left,
              top: nebula.top,
              width: nebula.size,
              height: nebula.size,
              background: `radial-gradient(closest-side, ${nebula.from}, transparent 72%)`,
              animationDelay: nebula.delay,
            }}
          />
        ))}
        <div className="cover-planet absolute bottom-0 left-1/2 h-[46vh] w-[220vw] -translate-x-1/2 md:h-[42vh]" />
      </div>
      <div className="relative z-10 flex w-full flex-1 flex-col items-center px-6 pb-[5vh] pt-[8.5vh] md:pt-[6.5vh]">
        <h1 className="text-center font-black leading-[1.12] tracking-[0.04em] text-white [text-shadow:0_0_36px_rgba(150,125,255,0.35)]">
          <span className="block text-[clamp(2.5rem,16.5vw,5.8rem)]">欢迎来到</span>
          <span className="block text-[clamp(2.65rem,17.5vw,6.2rem)]">伴语星球</span>
        </h1>
        <p className="mt-[2.2vh] text-center text-[clamp(1rem,4.3vw,1.35rem)] tracking-[0.16em] text-[#cbc2db] [text-shadow:0_0_14px_rgba(170,140,255,0.35)]">
          在这里，每一句话都有回响
        </p>
        <div className="flex-1" />
        <button type="button" onClick={onEnter} disabled={busy} className="cover-connect">
          <span className="relative z-10">{busy ? "正在连接…" : "开始连接"}</span>
        </button>
      </div>
    </main>
  );
}
