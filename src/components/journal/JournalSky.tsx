"use client";

import type { JournalEntry } from "@/lib/journal/types";
import Link from "next/link";

function hash(id: string) {
  let h = 2166136261;
  for (let i = 0; i < id.length; i += 1) {
    h = Math.imul(h ^ id.charCodeAt(i), 16777619);
  }
  return h >>> 0;
}

function place(item: JournalEntry, index: number, total: number) {
  const h = hash(item.id);
  if (total === 1) {
    return { left: 50, top: 42, size: 8, delay: "0.2s" };
  }
  const golden = Math.PI * (3 - Math.sqrt(5));
  const angle = index * golden + (h % 80) / 260;
  const radius = 10 + Math.sqrt((index + 0.4) / total) * 36;
  return {
    left: Math.min(90, Math.max(10, 50 + radius * Math.cos(angle))),
    top: Math.min(86, Math.max(12, 48 + radius * Math.sin(angle) * 0.7)),
    size: 5 + (h % 6),
    delay: `${(h % 9) * 0.35}s`,
  };
}

export function JournalSky({ items }: { items: JournalEntry[] }) {
  return (
    <div className="relative min-h-[28rem] w-full md:min-h-[32rem]">
      {items.map((item, index) => {
        const star = place(item, index, items.length);
        const date = item.createdAt.slice(5, 10).replace("-", ".");
        return (
          <Link
            key={item.id}
            href={`/journal/${item.id}`}
            title={`${item.title} · ${date}`}
            className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1"
            style={{ left: `${star.left}%`, top: `${star.top}%` }}
          >
            <span
              className="journal-entry-star"
              style={{
                width: star.size,
                height: star.size,
                animationDelay: star.delay,
              }}
            />
            <span className="max-w-24 truncate text-[10px] text-on-surface-variant">
              {item.title}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
