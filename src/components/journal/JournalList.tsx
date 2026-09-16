"use client";

import { JournalSky } from "@/components/journal/JournalSky";
import { listJournals } from "@/lib/journal/repository";
import type { JournalEntry } from "@/lib/journal/types";
import { useEffect, useState } from "react";

export function JournalList() {
  const [items, setItems] = useState<JournalEntry[] | null>(null);

  useEffect(() => {
    listJournals().then(setItems);
  }, []);

  if (!items) return <p className="text-center text-on-surface-variant">读取中…</p>;
  if (items.length === 0) {
    return (
      <div className="planet-glass p-6 text-center">
        <p>这里只属于你。</p>
        <p className="mt-2 text-sm text-on-surface-variant">还没有写下任何一篇。</p>
      </div>
    );
  }

  return <JournalSky items={items} />;
}
