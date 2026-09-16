import { JournalEditor } from "@/components/journal/JournalEditor";
import { NightScene } from "@/components/layout/NightScene";

export default function NewJournalPage() {
  return (
    <NightScene title="写日记" subtitle="这篇只加密保存在本机，不会上传。">
      <section className="planet-glass p-5">
        <JournalEditor />
      </section>
    </NightScene>
  );
}
