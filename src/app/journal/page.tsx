"use client";

import { FAB } from "@/components/m3/FAB";
import { JournalList } from "@/components/journal/JournalList";
import { useRouter } from "next/navigation";

export default function JournalPage() {
  const router = useRouter();
  return (
    <main className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-medium mb-4">私密日记</h1>
      <JournalList />
      <FAB label="写日记" onClick={() => router.push("/journal/new")} />
    </main>
  );
}
