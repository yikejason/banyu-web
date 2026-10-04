import { NightScene } from "@/components/layout/NightScene";
import { MoodComposer } from "@/components/mood/MoodComposer";

export default function MoodSharePage() {
  return (
    <NightScene title="匿名心情" subtitle="链接会被转发，口令只给你想给的人。">
      <section className="planet-glass p-5">
        <MoodComposer />
      </section>
    </NightScene>
  );
}
