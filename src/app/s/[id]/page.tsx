import { ShareViewer } from "@/components/share/ShareViewer";

export default async function SharedPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <main className="min-h-dvh max-w-lg mx-auto p-6 flex flex-col items-center justify-center">
      <h1 className="text-2xl font-medium mb-8">伴语星球</h1>
      <ShareViewer id={id} />
    </main>
  );
}
