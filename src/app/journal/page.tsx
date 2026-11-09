"use client";

import { useState, useEffect } from "react";
import { FAB } from "@/components/m3/FAB";
import { useToast } from "@/components/m3/Toast";
import { JournalList } from "@/components/journal/JournalList";
import { NightScene } from "@/components/layout/NightScene";
import { useRouter } from "next/navigation";

export default function JournalPage() {
  const router = useRouter();
  const toast = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <NightScene title="星语日记" subtitle="每一颗心事，都有星光回应。">
        <JournalList />
      </NightScene>
        {mounted && (
            <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-20 flex gap-4 md:bottom-8" >
              <FAB label="保存到本地" onClick={() => toast("已保存到本地")} />
              <FAB label="写日记" onClick={() => router.push("/journal/new")} />
            </div>
        )}
    </>
  );
}
