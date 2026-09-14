"use client";

import { Card } from "@/components/m3/Card";
import { listJournals } from "@/lib/journal/repository";
import type { JournalEntry } from "@/lib/journal/types";
import Link from "next/link";
import { useEffect, useState } from "react";

export function JournalList() {
  const [items, setItems] = useState<JournalEntry[] | null>(null);

  useEffect(() => {
    listJournals().then(setItems);
  }, []);

  if (!items) return <p className="text-on-surface-variant">读取中…</p>;
  if (items.length === 0) {
    return <p className="text-on-surface-variant">这里只属于你。</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <Link key={item.id} href={`/journal/${item.id}`}>
          <Card>
            <p className="font-medium">{item.title}</p>
            <p className="text-sm text-on-surface-variant mt-1 line-clamp-2">{item.body}</p>
            <p className="text-xs text-on-surface-variant mt-2">{item.createdAt.slice(0, 10)}</p>
          </Card>
        </Link>
      ))}
    </div>
  );
}
