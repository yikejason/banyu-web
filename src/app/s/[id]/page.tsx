import { NightScene } from "@/components/layout/NightScene";
import { ShareViewer } from "@/components/share/ShareViewer";

export default async function SharedPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <NightScene fullScreen title="伴语星球" subtitle="有人把性情和此刻，只交给你。">
      <ShareViewer id={id} />
    </NightScene>
  );
}
