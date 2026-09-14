"use client";

import { Button } from "@/components/m3/Button";
import { Card } from "@/components/m3/Card";
import { TextField } from "@/components/m3/TextField";
import { getTemperament, saveTemperament } from "@/lib/temperament/repository";
import type { Temperament } from "@/lib/temperament/types";
import { useEffect, useState } from "react";

export function TemperamentForm({ compact }: { compact?: boolean }) {
  const [tone, setTone] = useState("");
  const [style, setStyle] = useState("");
  const [keywords, setKeywords] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getTemperament().then((t) => {
      if (!t) return;
      setTone(t.tone);
      setStyle(t.style);
      setKeywords(t.keywords.join(" "));
    });
  }, []);

  async function onSave() {
    const next: Temperament = {
      tone: tone.trim(),
      style: style.trim(),
      keywords: keywords.trim().split(/\s+/).filter(Boolean).slice(0, 5),
    };
    await saveTemperament(next);
    setSaved(true);
  }

  return (
    <Card>
      <h2 className="mb-3 font-medium">{compact ? "性情底色" : "编辑性情"}</h2>
      <div className="flex flex-col gap-3">
        <TextField label="气质" value={tone} onChange={setTone} />
        <TextField label="表达风格" value={style} onChange={setStyle} />
        <TextField label="关键词（空格分隔，最多 5 个）" value={keywords} onChange={setKeywords} />
        <Button variant="tonal" onClick={onSave}>
          保存
        </Button>
        {saved && <p className="text-sm text-on-surface-variant">已留在本机。</p>}
      </div>
    </Card>
  );
}
