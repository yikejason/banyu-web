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
  }, []);

  return (
    <div key={pathname}>
      <NightScene title="星语日记" subtitle="&nbsp;&nbsp;每一颗心事，都有星光回应。">
        <JournalList />
      </NightScene>
        {mounted && (
          <div
//             className="fixed bottom-24 left-1/2 -translate-x-1/2 z-20 flex gap-7 md:bottom-8"
            // 1. 调整了 bottom 的值，让底部间距更符合设计图（可根据实际手机安全区微调 bottom-20 或 bottom-24）
            className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-5 md:gap-7"
            style={{ width: "auto" }}
          >
            <button
              type="button"
              onClick={() => toast("已保存到本地")}
              className="cover-connect flex items-center justify-center"
              style={{
                width: "auto",
                flex: "none",
                minWidth: "0",
                paddingTop: "5px",
                paddingBottom: "5px",
                paddingLeft: "24px",
                paddingRight: "24px",
                fontSize: "18px",
                letterSpacing: "-0.02em",
              }}
            >
            {/* 添加保存图标 (使用 SVG 示例，您可以替换为您项目使用的图标库如 lucide-react 或 iconfont) */}
              <svg className="w-[18px] h-[18px] relative z-10 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              <span className="relative z-10 block w-full truncate">
                保存本地
              </span>
            </button>

            <button
              type="button"
              onClick={() => router.push("/journal/new")}
              className="cover-connect flex items-center justify-center"
              style={{
                width: "auto",
                flex: "none",
                minWidth: "0",
                paddingTop: "5px",
                paddingBottom: "5px",
                paddingLeft: "24px",
                paddingRight: "24px",
                fontSize: "18px",
                letterSpacing: "-0.02em",
              }}
            >
            {/* 添加编写/编辑图标 (使用 SVG 示例) */}
              <svg className="w-[18px] h-[18px] relative z-10 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span className="relative z-10 block w-full truncate">
                编写日记
              </span>
            </button>
          </div>
        )}
    </div>
  );
}
