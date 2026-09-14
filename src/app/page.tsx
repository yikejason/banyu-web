"use client";

import { EmotionComposer } from "@/components/planet/EmotionComposer";
import { PlanetView } from "@/components/planet/PlanetView";
import { TemperamentForm } from "@/components/temperament/TemperamentForm";
import { listEmotions } from "@/lib/emotion/repository";
import { mapEmotion } from "@/lib/emotion/mapEmotion";
import type { EmotionRecord } from "@/lib/emotion/types";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [current, setCurrent] = useState<EmotionRecord | null>(null);
  const [history, setHistory] = useState<EmotionRecord[]>([]);

  useEffect(() => {
    listEmotions().then((list) => {
      setHistory(list);
      setCurrent(list[0] ?? null);
    });
  }, []);

  const visual = current?.visual ?? mapEmotion({ intensity: 1 });

  return (
    <main className="max-w-lg mx-auto p-6 flex flex-col gap-8">
      <header>
        <h1 className="text-2xl font-medium">伴语星球</h1>
        <p className="text-sm text-on-surface-variant mt-1">把感受留下，不必起一个准确的名字。</p>
      </header>
      <PlanetView visual={visual} />
      {!current && (
        <p className="text-center text-on-surface-variant text-sm">
          还没有留下任何一刻。不必起一个准确的名字。
        </p>
      )}
      <EmotionComposer
        onSaved={(record) => {
          setCurrent(record);
          setHistory((h) => [record, ...h]);
        }}
      />
      {history.length > 0 && (
        <ul className="text-sm text-on-surface-variant flex flex-col gap-1">
          {history.slice(0, 7).map((h) => (
            <li key={h.id}>
              {h.createdAt.slice(5, 10)} · {h.visual.label}
            </li>
          ))}
        </ul>
      )}
      <TemperamentForm compact />
    </main>
  );
}
