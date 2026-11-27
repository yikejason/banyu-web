"use client";

import { Starfield } from "@/components/planet/Starfield";

export function CoverScreen({
  onEnter,
  busy,
}: {
  onEnter: () => void;
  busy?: boolean;
}) {
  return (
    <main className="cover-scene relative isolate flex min-h-dvh flex-col overflow-hidden">
      <Starfield />
      {/* 上下渐变暗化：保证标题/按钮区文字可读，中部保留星云亮度 */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#070512]/50 via-[#070512]/5 to-[#070512]/60"
        aria-hidden
      />
      {/* 移动端底部留白要避开 fixed 的 ICP 备案号（bottom-[4.5rem]），否则按钮和备案号重叠容易误触 */}
      <div className="relative z-10 flex w-full flex-1 flex-col items-center px-6 pb-[7.5rem] pt-[8.5vh] md:pb-[5vh] md:pt-[6.5vh]">
        <h1 className="cover-title">欢迎来到伴语星球</h1>
        <p className="cover-subtitle mt-[1.8vh]">听见彼此心底的声音</p>
        <div className="flex-1" />
        <button type="button" onClick={onEnter} disabled={busy} className="cover-connect">
          <span className="relative z-10">{busy ? "正在连接…" : "开始连接"}</span>
        </button>
      </div>
    </main>
  );
}
