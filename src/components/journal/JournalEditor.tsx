"use client";

import { Button } from "@/components/m3/Button";
import { TextField } from "@/components/m3/TextField";
import { createJournal, getJournal, updateJournal } from "@/lib/journal/repository";
import { listEmotions } from "@/lib/emotion/repository";
import type { EmotionRecord } from "@/lib/emotion/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function JournalEditor({ id }: { id?: string }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [emotionId, setEmotionId] = useState("");
  const [emotions, setEmotions] = useState<EmotionRecord[]>([]);

  useEffect(() => {
    listEmotions().then(setEmotions);
    if (!id) return;
    getJournal(id).then((e) => {
      if (!e) return;
      setTitle(e.title);
      setBody(e.body);
      setEmotionId(e.emotionId ?? "");
    });
  }, [id]);

  async function onSave() {
    if (!body.trim()) return;
    if (id) await updateJournal(id, { title, body, emotionId: emotionId || undefined });
    else {
      const created = await createJournal({ title, body, emotionId: emotionId || undefined });
      router.replace(`/journal/${created.id}`);
      return;
    }
    router.push("/journal");
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-on-surface-variant">这篇日记只加密保存在本机，不会上传。</p>
      <TextField label="标题（可空）" value={title} onChange={setTitle} />
      <TextField label="正文" value={body} onChange={setBody} textarea />
      <label className="text-sm text-on-surface-variant flex flex-col gap-2">
        关联情绪
        <select
          className="h-12 rounded-md border border-outline bg-transparent px-3"
          value={emotionId}
          onChange={(e) => setEmotionId(e.target.value)}
        >
          <option value="">不关联</option>
          {emotions.map((e) => (
            <option key={e.id} value={e.id}>
              {e.visual.label} · {e.createdAt.slice(0, 10)}
            </option>
          ))}
        </select>
      </label>
      <Button variant="filled" onClick={onSave}>
        保存
      </Button>
    </div>
  );
}
