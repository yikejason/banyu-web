"use client";

import { FAB } from "@/components/m3/FAB";
import { useToast } from "@/components/m3/Toast";
import { JournalList } from "@/components/journal/JournalList";
import { NightScene } from "@/components/layout/NightScene";
import { useRouter } from "next/navigation";

export default function JournalPage() {
  const router = useRouter();
  const toast = useToast();
  return (
    <NightScene title="星语日记" subtitle="每一颗心事，都有星光回应。">
      <JournalList />
      {/*
          <div className="fixed bottom-24 right-4 z-20 flex gap-4 md:bottom-8" >
            原来靠右的按钮容器
          </div>
      */}
      {/* 底部悬浮按钮组，水平居中 */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-20 flex gap-4 md:bottom-8" >
        <FAB label="保存到本地" onClick={() => toast("已保存到本地")} />
        <FAB label="写日记" onClick={() => router.push("/journal/new")} />
      </div>
    </NightScene>
  );
}
