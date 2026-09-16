"use client";

import { JournalEditor } from "@/components/journal/JournalEditor";
import { NightScene } from "@/components/layout/NightScene";
import { useParams } from "next/navigation";

export default function JournalDetailPage() {
  const params = useParams<{ id: string }>();
  return (
    <NightScene title="日记" subtitle="这篇只加密保存在本机，不会上传。">
      <section className="planet-glass p-5">
        <JournalEditor id={params.id} />
      </section>
    </NightScene>
  );
}
