"use client";

import { Chip } from "@/components/m3/Chip";
import { Button } from "@/components/m3/Button";
import { TextField } from "@/components/m3/TextField";
import { saveEmotion } from "@/lib/emotion/repository";
import type { EmotionKind, EmotionRecord } from "@/lib/emotion/types";
import { useState } from "react";

const KINDS: { kind: EmotionKind; label: string }[] = [
  { kind: "joy", label: "喜悦" },
  { kind: "calm", label: "平静" },
  { kind: "sad", label: "难过" },
  { kind: "anxious", label: "不安" },
  { kind: "angry", label: "生气" },
  { kind: "tender", label: "温柔" },
  { kind: "empty", label: "空" },
  { kind: "mixed", label: "混杂" },
  { kind: "unspoken", label: "说不清" },
];

export function EmotionComposer({
  onSaved,
}: {
  onSaved: (record: EmotionRecord) => void;
}) {
  const [kind, setKind] = useState<EmotionKind | undefined>();
  const [text, setText] = useState("");
  const [intensity, setIntensity] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    try {
      const record = await saveEmotion({
        kind,
        text: text.trim() || undefined,
        intensity,
      });
      setText("");
      onSaved(record);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {KINDS.map((k) => (
          <Chip key={k.kind} selected={kind === k.kind} onClick={() => setKind(k.kind)}>
            {k.label}
          </Chip>
        ))}
      </div>
      <TextField label="此刻的感受" value={text} onChange={setText} />
      <div className="flex items-center gap-2">
        <span className="text-sm text-on-surface-variant">强度</span>
        {([1, 2, 3, 4, 5] as const).map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setIntensity(n)}
            className={`h-8 w-8 rounded-lg ${
              intensity === n ? "bg-primary text-on-primary" : "bg-surface-container-high"
            }`}
          >
            {n}
          </button>
        ))}
      </div>
      <Button variant="filled" disabled={busy} onClick={submit}>
        留下这一刻
      </Button>
    </div>
  );
}
