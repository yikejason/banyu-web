import { NightScene } from "@/components/layout/NightScene";
import { ShareComposer } from "@/components/share/ShareComposer";

export default function NewSharePage() {
  return (
    <NightScene title="定制分享" subtitle="只会交出性情和当前状态。日记正文不会出现在链接里。">
      <section className="planet-glass p-5">
        <ShareComposer />
      </section>
    </NightScene>
  );
}
