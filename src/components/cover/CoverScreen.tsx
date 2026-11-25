"use client";

import { Starfield } from "@/components/planet/Starfield";
import { useEffect, useRef } from "react";

export function CoverScreen({
  onEnter,
  busy,
}: {
  onEnter: () => void;
  busy?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // 浏览器禁止带声自动播放：首次用户交互（点击/按键）时解除静音，还原视频原声；
    // 若浏览器仍拒绝，静默回退为静音播放
    const unlockAudio = () => {
      const video = videoRef.current;
      if (!video || !video.muted) return;
      video.muted = false;
      video.volume = 0.6;
      video.play().catch(() => {
        video.muted = true;
      });
    };
    window.addEventListener("pointerdown", unlockAudio, { once: true });
    window.addEventListener("keydown", unlockAudio, { once: true });
    return () => {
      window.removeEventListener("pointerdown", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
    };
  }, []);

  useEffect(() => {
    // loop 回绕瞬间部分浏览器会闪一帧空帧（顿挫感的来源）：
    // 回绕前 120ms 轻微降低透明度盖住闪帧，回绕后立即恢复——
    // 源视频首末帧几乎一致（实测亮度差仅 3.24/255），内容无跳变，观感平滑连续
    const video = videoRef.current;
    if (!video) return;
    const onTimeUpdate = () => {
      const remaining = video.duration - video.currentTime;
      video.style.opacity = remaining < 0.12 ? "0.3" : "1";
    };
    video.addEventListener("timeupdate", onTimeUpdate);
    return () => video.removeEventListener("timeupdate", onTimeUpdate);
  }, []);

  return (
    <main className="cover-scene relative isolate flex min-h-dvh flex-col overflow-hidden">
      {/* 星云背景视频：静音循环自动播放铺满全屏，首次交互后恢复原声；
          加载失败或未就绪时回退到 cover-scene 渐变底色，视觉无缝 */}
      <video
        ref={videoRef}
        className="cover-video pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-150"
        src="/videos/home-nebula.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden
      />
      <Starfield />
      {/* 上下渐变暗化：保证标题/按钮区文字可读，中部保留星云亮度 */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#070512]/50 via-[#070512]/5 to-[#070512]/60"
        aria-hidden
      />
      {/* 移动端底部留白要避开 fixed 的 ICP 备案号（bottom-[4.5rem]），否则按钮和备案号重叠容易误触 */}
      <div className="relative z-10 flex w-full flex-1 flex-col items-center px-6 pb-[7.5rem] pt-[8.5vh] md:pb-[5vh] md:pt-[6.5vh]">
        <h1 className="cover-title">欢迎来到伴语星球</h1>
        <p className="cover-subtitle mt-[1.8vh]">听见彼此—心底的声音</p>
        <div className="flex-1" />
        <button type="button" onClick={onEnter} disabled={busy} className="cover-connect">
          <span className="relative z-10">{busy ? "正在连接…" : "开始连接"}</span>
        </button>
      </div>
    </main>
  );
}
