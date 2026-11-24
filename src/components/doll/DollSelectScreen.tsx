"use client";

import { Starfield } from "@/components/planet/Starfield";
import { DOLL_OPTIONS, type DollId } from "@/lib/doll/dolls";
import { useState, type CSSProperties } from "react";

export function DollSelectScreen({
  onConfirm,
}: {
  onConfirm: (id: DollId) => void;
}) {
  const [selected, setSelected] = useState<DollId | null>(null);

  return (
    <main className="planet-scene relative isolate flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6">
      <Starfield />
      <div className="relative z-10 flex w-full max-w-[400px] flex-col items-center">
        <h1 className="text-center text-[1.7rem] font-medium tracking-wide">请选择你的心境能量</h1>
        <section className="planet-glass mt-7 w-full px-5 pb-8 pt-7 text-center">
          <div className="flex items-end justify-center gap-2">
            {DOLL_OPTIONS.map((doll) => {
              const active = selected === doll.id;
              return (
                <button
                  key={doll.id}
                  type="button"
                  onClick={() => setSelected(doll.id)}
                  className={`mood-figure flex w-[31%] flex-col items-center rounded-3xl px-1 pb-3 pt-4 transition ${active ? "mood-figure-on" : "hover:bg-white/5"
                    }`}
                >
                  <span
                    className={`orb-halo orb3d orb-${doll.id} orb-float relative block h-28 w-28`}
                    style={{ "--ring": doll.ring } as CSSProperties}
                  >
                    {/* 外层光圈：代码画的 3D 细环，按参考视频绕各自轴转动，
                        整圈进动（tumble）与缓摆（sway）两层错开，前后穿插靠 preserve-3d */}
                    <span className="orb3d-precess" aria-hidden>
                      <span className="orb3d-ring orb3d-ring-a" aria-hidden />
                      <span className="orb3d-ring orb3d-ring-b" aria-hidden />
                    </span>
                    <span className="orb3d-sway" aria-hidden>
                      <span className="orb3d-ring orb3d-ring-c" aria-hidden />
                      <span className="orb3d-ring orb3d-ring-d" aria-hidden>
                        <span className="orb3d-ring-dash" aria-hidden />
                      </span>
                    </span>
                    {/* 行星环：贴球紧环绕，像土星环一样固定倾角围在星球周围，
                        亮弧沿环轨道公转，远端转到球后、近端扫过球前；
                        a=主环 b/c=副环（默认隐藏，按星球启用） */}
                    <span className="orb3d-orbit" aria-hidden>
                      <span className="orb3d-ring-plane orb3d-plane-a" aria-hidden>
                        <span className="orb3d-ring-track" aria-hidden />
                        <span className="orb3d-ring-track orb3d-ring-track-outer" aria-hidden />
                        <span className="orb3d-orbit-rotor" aria-hidden>
                          <span className="orb3d-ring-arc" aria-hidden />
                        </span>
                      </span>
                      <span className="orb3d-ring-plane orb3d-plane-b" aria-hidden>
                        <span className="orb3d-yaw" aria-hidden>
                          <span className="orb3d-ring-pose" aria-hidden>
                            <span className="orb3d-ring-track" aria-hidden />
                            <span className="orb3d-ring-track-outer" aria-hidden />
                            <span className="orb3d-orbit-rotor" aria-hidden>
                              <span className="orb3d-ring-arc" aria-hidden />
                            </span>
                          </span>
                        </span>
                      </span>
                      <span className="orb3d-ring-plane orb3d-plane-c" aria-hidden>
                        <span className="orb3d-ring-track" aria-hidden />
                        <span className="orb3d-orbit-rotor" aria-hidden>
                          <span className="orb3d-ring-arc" aria-hidden />
                        </span>
                      </span>
                    </span>
                    {/* 球：PNG 素材（已烘入裁净旧星环，只留球体）+ 高光漂移 */}
                    <span className="orb3d-body">
                      <img
                        src={doll.src}
                        alt=""
                        className="h-full w-full object-contain"
                      />
                      <span
                        className="orb-sheen"
                        aria-hidden
                        style={
                          {
                            maskImage: `url(${doll.src})`,
                            WebkitMaskImage: `url(${doll.src})`,
                            maskSize: "contain",
                            maskPosition: "center",
                            maskRepeat: "no-repeat",
                          } as CSSProperties
                        }
                      />
                    </span>
                    <span className="orb-spark orb-spark-1" aria-hidden />
                    <span className="orb-spark orb-spark-2" aria-hidden />
                  </span>
                  <span className="mt-2 text-base font-medium">{doll.label}</span>
                  <span className="text-xs text-on-surface-variant">{doll.hint}</span>
                </button>
              );
            })}
          </div>
          <p className="mt-6 text-sm leading-relaxed text-on-surface-variant">
            选定后你会被对应属性的光晕完整笼罩
          </p>
        </section>
        <button
          type="button"
          className="cover-connect mt-8"
          disabled={!selected}
          onClick={() => {
            if (selected) onConfirm(selected);
          }}
        >
          <span className="relative z-10">确认选择</span>
        </button>
      </div>
    </main>
  );
}
