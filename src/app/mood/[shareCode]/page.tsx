import { NightScene } from "@/components/layout/NightScene";
import { MoodUnlocker } from "@/components/mood/MoodUnlocker";

export default async function MoodViewPage({
  params,
}: {
  params: Promise<{ shareCode: string }>;
}) {
  const { shareCode } = await params;
  return (
    <NightScene fullScreen title="伴语星球" subtitle="有人把此刻的心情锁了起来，钥匙在你手里。">
      <MoodUnlocker shareCode={shareCode} />
    </NightScene>
  );
}
