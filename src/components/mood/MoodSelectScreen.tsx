"use client";

import { Starfield } from "@/components/planet/Starfield";
import { MOOD_COMPANIONS, type MoodCompanionId } from "@/lib/mood/companion";
import { useState } from "react";

export function MoodSelectScreen({
  onConfirm,
}: {
  onConfirm: (id: MoodCompanionId) => void;
}) {
  const [selected, setSelected] = useState<MoodCompanionId | null>(null);

  return (
    <main className="planet-scene relative isolate flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6">
      <Starfield />
      <div className="relative z-10 flex w-full max-w-[460px] flex-col items-center">
        <h1 className="text-center text-[1.7rem] font-medium tracking-wide">请选择你的性别</h1>
        {/* 人物背景满幅铺满玻璃卡：无缝拼接、无边框；选中态用亮度区分 */}
        <section className="planet-glass mt-6 w-full overflow-hidden">
          <div className="flex items-stretch">
            {MOOD_COMPANIONS.map((companion) => {
              const active = selected === companion.id;
              return (
                <button
                  key={companion.id}
                  type="button"
                  onClick={() => setSelected(companion.id)}
                  className={`relative w-1/2 overflow-hidden transition duration-300 ${active ? "" : "brightness-[.55]"
                    }`}
                >
                  <img
                    src={companion.src}
                    alt=""
                    className="mood-char block aspect-[2/3] w-full object-cover"
                  />
                  {/* 地面光圈 + 环绕光弧 + 身边氤氲光（纯 CSS 动效层） */}
                  <span className="mood-ground-glow" aria-hidden />
                  <span className="mood-ground-sweep" aria-hidden />
                  <span className="mood-aura" aria-hidden />
                  {companion.label ? (
                    <span className="absolute inset-x-0 bottom-3 text-base font-medium text-white/90">
                      {companion.label}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
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
