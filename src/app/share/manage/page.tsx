"use client";

import { Button } from "@/components/m3/Button";
import { Card } from "@/components/m3/Card";
import { FAB } from "@/components/m3/FAB";
import { deleteRecord, listRecords } from "@/lib/storage/vault";
import type { ShareLocal } from "@/lib/share/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ShareManagePage() {
  const router = useRouter();
  const [items, setItems] = useState<ShareLocal[] | null>(null);

  async function reload() {
    const list = await listRecords<ShareLocal>("shareLocal");
    setItems(list.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
  }

  useEffect(() => {
    reload();
  }, []);

  async function stop(item: ShareLocal) {
    await fetch(`/api/shares/${item.id}`, {
      method: "DELETE",
      headers: { "x-revoke-token": item.revokeToken },
    });
    await deleteRecord("shareLocal", item.id);
    await reload();
  }

  return (
    <main className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-medium mb-4">私密分享</h1>
      {!items || items.length === 0 ? (
        <p className="text-on-surface-variant">没有正在进行的分享。</p>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <Card key={item.id}>
              <p className="text-sm">{item.createdAt.slice(0, 16).replace("T", " ")}</p>
              <p className="text-xs text-on-surface-variant mt-1">
                {item.expiresAt.slice(0, 10)} 到期
              </p>
              <Button className="mt-3" variant="outlined" onClick={() => stop(item)}>
                停止分享
              </Button>
            </Card>
          ))}
        </div>
      )}
      <FAB label="发起分享" onClick={() => router.push("/share/new")} />
    </main>
  );
}
