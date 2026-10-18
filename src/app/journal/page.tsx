"use client";

import { FAB } from "@/components/m3/FAB";
import { useToast } from "@/components/m3/Toast";
import { JournalList } from "@/components/journal/JournalList";
import { NightScene } from "@/components/layout/NightScene";
import { useRouter } from "next/navigation";

export default function JournalPage() {
  const router = useRouter();
  const toast = useToast();
  return (
    <NightScene title="私密日记" subtitle="每一篇都是夜空里的一颗星。">
      <JournalList />
      <div className="fixed bottom-24 right-4 z-20 flex gap-4 md:bottom-8">
        <FAB label="保存到本地" onClick={() => toast("已保存到本地")} />
        <FAB label="写日记" onClick={() => router.push("/journal/new")} />
      </div>
    </NightScene>
  );
}
