"use client";

import { PlanetView } from "@/components/planet/PlanetView";
import { Card } from "@/components/m3/Card";
import { decryptSnapshot, importContentKey } from "@/lib/share/payload";
import type { ShareSnapshot } from "@/lib/share/types";
import { useEffect, useState } from "react";

export function ShareViewer({ id }: { id: string }) {
  const [snap, setSnap] = useState<ShareSnapshot | null>(null);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    async function load() {
      const keyParam = new URLSearchParams(window.location.hash.slice(1)).get("k");
      const res = await fetch(`/api/shares/${id}`);
      if (!res.ok || !keyParam) {
        setClosed(true);
        return;
      }
      const enc = (await res.json()) as { iv: string; ciphertext: string };
      try {
        const key = await importContentKey(keyParam);
        setSnap(await decryptSnapshot(enc, key));
      } catch {
        setClosed(true);
      }
    }
    load();
  }, [id]);

  if (closed) {
    return <p className="text-on-surface-variant">这份分享已关闭或从不存在。</p>;
  }
  if (!snap) return <p className="text-on-surface-variant">正在打开…</p>;

  return (
    <div className="flex flex-col items-center gap-6">
      <PlanetView visual={snap.status.visual} />
      <Card className="w-full">
        <p className="text-sm text-on-surface-variant">性情</p>
        <p className="mt-1">{snap.temperament.tone}</p>
        {snap.temperament.style && (
          <p className="text-sm text-on-surface-variant mt-2">{snap.temperament.style}</p>
        )}
      </Card>
      <Card className="w-full">
        <p className="text-sm text-on-surface-variant">状态</p>
        <p className="mt-1">{snap.status.label}</p>
        {snap.status.note && <p className="mt-2">{snap.status.note}</p>}
      </Card>
    </div>
  );
}
