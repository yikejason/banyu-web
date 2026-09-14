"use client";

import { Button } from "@/components/m3/Button";
import { TextField } from "@/components/m3/TextField";
import { listEmotions } from "@/lib/emotion/repository";
import type { EmotionRecord } from "@/lib/emotion/types";
import {
  buildShareUrl,
  encryptSnapshot,
  hashToken,
  newShareSecrets,
} from "@/lib/share/payload";
import type { ShareLocal } from "@/lib/share/types";
import { getTemperament } from "@/lib/temperament/repository";
import { putRecord } from "@/lib/storage/vault";
import { useEffect, useState } from "react";

export function ShareComposer() {
  const [note, setNote] = useState("");
  const [link, setLink] = useState("");
  const [error, setError] = useState("");
  const [latest, setLatest] = useState<EmotionRecord | null>(null);

  useEffect(() => {
    listEmotions().then((list) => setLatest(list[0] ?? null));
  }, []);

  async function create() {
    setError("");
    const temperament = await getTemperament();
    if (!temperament?.tone) {
      setError("请先在星球页写下至少一句气质。");
      return;
    }
    if (!latest) {
      setError("请先留下此刻的状态。");
      return;
    }
    const { contentKey, contentKeyParam, revokeToken } = await newShareSecrets();
    const enc = await encryptSnapshot(
      {
        temperament,
        status: {
          label: latest.visual.label,
          intensity: latest.input.intensity,
          visual: latest.visual,
          note: note.trim() || undefined,
        },
        createdAt: new Date().toISOString(),
      },
      contentKey,
    );
    const revokeTokenHash = await hashToken(revokeToken);
    const expiresAt = new Date(Date.now() + 7 * 86400000).toISOString();
    const res = await fetch("/api/shares", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        iv: enc.iv,
        ciphertext: enc.ciphertext,
        expiresAt,
        revokeTokenHash,
      }),
    });
    if (!res.ok) {
      setError("无法生成链接");
      return;
    }
    const { id } = (await res.json()) as { id: string };
    const local: ShareLocal = { id, createdAt: new Date().toISOString(), revokeToken, expiresAt };
    await putRecord("shareLocal", id, local);
    setLink(buildShareUrl(window.location.origin, id, contentKeyParam));
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-on-surface-variant">
        只会分享性情和当前状态。日记正文不会出现在链接里。请把链接亲自发给想看见的人。
      </p>
      <TextField label="简要状态（可选，不要写日记）" value={note} onChange={setNote} />
      <Button variant="filled" onClick={create}>
        生成分享链接
      </Button>
      {error && <p className="text-sm text-error">{error}</p>}
      {link && (
        <div className="flex flex-col gap-2">
          <p className="text-sm break-all">{link}</p>
          <Button variant="tonal" onClick={() => navigator.clipboard.writeText(link)}>
            复制链接
          </Button>
        </div>
      )}
    </div>
  );
}
