import { ShareComposer } from "@/components/share/ShareComposer";

export default function NewSharePage() {
  return (
    <main className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-medium mb-4">定制分享</h1>
      <ShareComposer />
    </main>
  );
}
