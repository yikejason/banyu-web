"use client";

import { EmotionComposer } from "@/components/planet/EmotionComposer";
import { PlanetView } from "@/components/planet/PlanetView";
import { Starfield } from "@/components/planet/Starfield";
import { TemperamentForm } from "@/components/temperament/TemperamentForm";
import { listEmotions } from "@/lib/emotion/repository";
import { mapEmotion } from "@/lib/emotion/mapEmotion";
import type { EmotionRecord } from "@/lib/emotion/types";
import { companionById, getMoodCompanion, type MoodCompanionId } from "@/lib/mood/companion";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [current, setCurrent] = useState<EmotionRecord | null>(null);
  const [history, setHistory] = useState<EmotionRecord[]>([]);
  const [companionId, setCompanionId] = useState<MoodCompanionId | null>(null);

  useEffect(() => {
    setCompanionId(getMoodCompanion());
    listEmotions().then((list) => {
      setHistory(list);
      setCurrent(list[0] ?? null);
    });
  }, []);

  const figure = companionId ? companionById(companionId) : null;
  const visual =
    current?.visual ??
    mapEmotion({ intensity: 3, kind: figure?.kind ?? "unspoken" });

  return (
    <main className="planet-scene relative isolate min-h-[calc(100dvh-4rem)] md:min-h-dvh">
      <Starfield />
      <div className="relative z-10 mx-auto flex max-w-lg flex-col gap-5 px-5 pb-28 pt-6 md:pb-10">
        <header className="text-center">
          <p className="text-[11px] tracking-[0.42em] text-on-surface-variant">伴语</p>
          <h1 className="mt-1 text-2xl font-medium">伴语星球</h1>
          <p className="mt-1 text-sm text-on-surface-variant">把感受留下，不必起一个准确的名字。</p>
          <Link href="/emotions" className="mt-3 inline-flex items-center gap-1 text-sm text-primary">
            我的情绪足迹
            <span aria-hidden>→</span>
          </Link>
        </header>
        <PlanetView
          visual={visual}
          figureSrc={figure?.src}
          figureLabel={figure?.label}
          traces={history.slice(0, 8).map((record) => ({
            id: record.id,
            hue: record.visual.hue,
            label: record.visual.label,
          }))}
          activeId={current?.id}
          onSelect={(id) => {
            const next = history.find((record) => record.id === id);
            if (next) setCurrent(next);
          }}
        />
        <section className="planet-glass relative z-10 -mt-4 p-5">
          <EmotionComposer
            onSaved={(record) => {
              setCurrent(record);
              setHistory((h) => [record, ...h]);
            }}
          />
        </section>
        <details className="planet-glass px-4 py-3">
          <summary className="cursor-pointer text-sm text-on-surface-variant">性情底色</summary>
          <div className="pt-3">
            <TemperamentForm compact />
          </div>
        </details>
      </div>
    </main>
  );
}
