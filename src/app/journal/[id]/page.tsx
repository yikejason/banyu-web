"use client";

import { JournalEditor } from "@/components/journal/JournalEditor";
import { useParams } from "next/navigation";

export default function JournalDetailPage() {
  const params = useParams<{ id: string }>();
  return (
    <main className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-medium mb-4">日记</h1>
      <JournalEditor id={params.id} />
    </main>
  );
}
