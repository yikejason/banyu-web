"use client";

import { FAB } from "@/components/m3/FAB";
import { JournalList } from "@/components/journal/JournalList";
import { NightScene } from "@/components/layout/NightScene";
import { useRouter } from "next/navigation";

export default function JournalPage() {
  const router = useRouter();
  return (
    <NightScene title="私密日记" subtitle="每一篇都是夜空里的一颗星。">
      <JournalList />
      <FAB label="写日记" onClick={() => router.push("/journal/new")} />
    </NightScene>
  );
}
