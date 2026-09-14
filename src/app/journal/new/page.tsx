import { JournalEditor } from "@/components/journal/JournalEditor";

export default function NewJournalPage() {
  return (
    <main className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-medium mb-4">写日记</h1>
      <JournalEditor />
    </main>
  );
}
