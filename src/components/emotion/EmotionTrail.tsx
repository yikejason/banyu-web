"use client";

import { deleteEmotions, listEmotions } from "@/lib/emotion/repository";
import { formatEmotionLine } from "@/lib/emotion/labels";
import type { EmotionRecord } from "@/lib/emotion/types";
import { useEffect, useState } from "react";

function FigureMark({ hue }: { hue: number }) {
  const fill = `hsl(${hue} 72% 62%)`;
  return (
    <span
      className="flex size-11 shrink-0 items-center justify-center rounded-full shadow-[0_0_14px_currentColor]"
      style={{ background: `hsl(${hue} 55% 28%)`, color: fill }}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" className="size-6 fill-current">
        <circle cx="12" cy="8" r="3.4" />
        <path d="M5.2 19.2c.7-3.4 3.4-5.4 6.8-5.4s6.1 2 6.8 5.4c.1.6-.3 1.2-.9 1.2H6.1c-.6 0-1-.6-.9-1.2Z" />
      </svg>
    </span>
  );
}

function exportLocal(records: EmotionRecord[]) {
  const payload = records.map((record) => ({
    createdAt: record.createdAt,
    label: record.visual.label,
    kind: record.input.kind,
    intensity: record.input.intensity,
    text: record.input.text ?? "",
    line: formatEmotionLine(record),
  }));
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "伴语情绪足迹.json";
  link.click();
  URL.revokeObjectURL(url);
}

export function EmotionTrail() {
  const [items, setItems] = useState<EmotionRecord[] | null>(null);
  const [selecting, setSelecting] = useState(false);
  const [picked, setPicked] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  async function reload() {
    setItems(await listEmotions());
  }

  useEffect(() => {
    reload();
  }, []);

  async function removeSelected() {
    if (picked.length === 0) return;
    setBusy(true);
    try {
      await deleteEmotions(picked);
      setPicked([]);
      setSelecting(false);
      await reload();
    } finally {
      setBusy(false);
    }
  }

  function toggle(id: string) {
    setPicked((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  if (!items) return <p className="text-center text-on-surface-variant">读取中…</p>;

  return (
    <div className="flex flex-col gap-5">
      <section className="planet-glass overflow-hidden px-4 py-3">
        {items.length === 0 ? (
          <p className="py-8 text-center text-on-surface-variant">还没有留下情绪足迹。</p>
        ) : (
          <ul>
            {items.map((record, index) => {
              const active = picked.includes(record.id);
              return (
                <li
                  key={record.id}
                  className={index === 0 ? "" : "border-t border-white/10"}
                >
                  {selecting ? (
                    <button
                      type="button"
                      onClick={() => toggle(record.id)}
                      className="flex w-full items-center gap-3 py-3.5 text-left"
                      aria-pressed={active}
                    >
                      <FigureMark hue={record.visual.hue} />
                      <span className="flex-1 text-[15px] leading-relaxed">
                        {formatEmotionLine(record)}
                      </span>
                      <span
                        className={`flex size-5 shrink-0 items-center justify-center rounded-full border ${
                          active
                            ? "border-primary bg-primary"
                            : "border-white/35 bg-transparent"
                        }`}
                      >
                        {active && <span className="size-2 rounded-full bg-on-primary" />}
                      </span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-3 py-3.5">
                      <FigureMark hue={record.visual.hue} />
                      <p className="text-[15px] leading-relaxed">{formatEmotionLine(record)}</p>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
        <p className="mb-2 mt-1 flex items-center justify-center gap-2 rounded-full border border-white/12 px-3 py-2 text-center text-xs text-on-surface-variant">
          <span className="size-2 rounded-full border border-white/40" />
          仅记录本机情绪选择，不自动上传
        </p>
      </section>
      <div className="flex gap-3">
        {selecting ? (
          <>
            <button
              type="button"
              className="inline-flex h-12 flex-1 items-center justify-center rounded-full border border-white/18 bg-white/6 text-sm"
              onClick={() => {
                setSelecting(false);
                setPicked([]);
              }}
            >
              取消
            </button>
            <button
              type="button"
              className="inline-flex h-12 flex-1 items-center justify-center rounded-full border border-white/18 bg-white/10 text-sm disabled:opacity-40"
              disabled={busy || picked.length === 0}
              onClick={removeSelected}
            >
              删除所选
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className="inline-flex h-12 flex-1 items-center justify-center rounded-full border border-white/18 bg-white/10 text-sm disabled:opacity-40"
              disabled={items.length === 0}
              onClick={() => exportLocal(items)}
            >
              保存本地
            </button>
            <button
              type="button"
              className="inline-flex h-12 flex-1 items-center justify-center rounded-full border border-white/18 bg-white/6 text-sm disabled:opacity-40"
              disabled={items.length === 0}
              onClick={() => setSelecting(true)}
            >
              选择删除
            </button>
          </>
        )}
      </div>
    </div>
  );
}
