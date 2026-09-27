"use client";

import { Starfield } from "@/components/planet/Starfield";
import { DOLL_OPTIONS, type DollId } from "@/lib/doll/dolls";
import { useState } from "react";

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
        <h1 className="text-center text-[1.7rem] font-medium tracking-wide">请选择你的娃娃</h1>
        <p className="mt-4 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-sm text-on-surface-variant">
          你想让谁站在星球上？
        </p>
        <section className="planet-glass mt-7 w-full px-5 pb-8 pt-7 text-center">
          <div className="flex items-end justify-center gap-2">
            {DOLL_OPTIONS.map((doll) => {
              const active = selected === doll.id;
              return (
                <button
                  key={doll.id}
                  type="button"
                  onClick={() => setSelected(doll.id)}
                  className={`mood-figure flex w-[31%] flex-col items-center rounded-3xl px-1 pb-3 pt-4 transition ${
                    active ? "mood-figure-on" : "hover:bg-white/5"
                  }`}
                >
                  <img
                    src={doll.src}
                    alt=""
                    className="h-28 w-auto object-contain drop-shadow-[0_10px_18px_rgba(0,0,0,0.35)]"
                  />
                  <span className="mt-2 text-base font-medium">{doll.label}</span>
                  <span className="text-xs text-on-surface-variant">{doll.hint}</span>
                </button>
              );
            })}
          </div>
          <p className="mt-6 text-sm leading-relaxed text-on-surface-variant">
            选定后，它会一直站在你的伴语星球上
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
