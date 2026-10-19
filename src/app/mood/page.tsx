import { NightScene } from "@/components/layout/NightScene";
import { MoodComposer } from "@/components/mood/MoodComposer";

export default function MoodSharePage() {
  return (
    <NightScene title="" subtitle="">
      <section className="planet-glass p-5">
        <MoodComposer />
      </section>
    </NightScene>
  );
}
