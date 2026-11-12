"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FAB } from "@/components/m3/FAB";
import { useToast } from "@/components/m3/Toast";
import { JournalList } from "@/components/journal/JournalList";
import { NightScene } from "@/components/layout/NightScene";

export default function JournalPage() {
  const router = useRouter();
  const toast = useToast();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    router.refresh();
  }, [pathname, router]);

  return (
    <div key={pathname}>
      <NightScene title="星语日记" subtitle="每一颗心事，都有星光回应。">
        <JournalList />
      </NightScene>
        {mounted && (
            <div
                className="fixed bottom-24 left-1/2 -translate-x-1/2 z-20 flex gap-3 w-[calc(100%-32px)] max-w-[480px] md:bottom-8"
              >
                <button
                  type="button"
                  onClick={() => toast("已保存到本地")}
                  className="cover-connect flex-1 min-w-0"
                >
                  <span className="relative z-10 block w-full truncate">
                    保存到本地
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/journal/new")}
                  className="cover-connect flex-1 min-w-0"
                >
                  <span className="relative z-10 block w-full truncate">
                    编写日记
                  </span>
                </button>
              </div>
        )}
    </div>
  );
}
