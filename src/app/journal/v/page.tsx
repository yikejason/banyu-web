"use client";

import { JournalEditor } from "@/components/journal/JournalEditor";
import { NightScene } from "@/components/layout/NightScene";
import { useEffect, useState } from "react";

// 静态导出没有动态路由：日记 id 从 ?id= 查询参数读取（/journal/v?id=xxx）
export default function JournalDetailPage() {
  const [id, setId] = useState("");

  useEffect(() => {
    setId(new URLSearchParams(window.location.search).get("id") ?? "");
  }, []);

  if (!id) {
    return (
      <NightScene title="日记" subtitle="这篇只加密保存在本机，不会上传。">
        <p className="text-center text-on-surface-variant">正在打开…</p>
      </NightScene>
    );
  }

  return (
    <NightScene title="日记" subtitle="这篇只加密保存在本机，不会上传。">
      <section className="planet-glass p-5">
        <JournalEditor id={id} />
      </section>
    </NightScene>
  );
}
