"use client";

import { Starfield } from "@/components/planet/Starfield";
import { useEffect, useRef, useState } from "react";

export function CoverScreen({
  onEnter,
  busy,
}: {
  onEnter: () => void;
  busy?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  // intro = 进场视频播放中（纯画面，无内嵌文字）；arrived = 播放完成，
  // 视频停在末帧作封面背景，标题/副标题/按钮带渐变慢慢浮现
  const [arrived, setArrived] = useState(false);
  const [videoBroken, setVideoBroken] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // 加载失败兜底：隐藏视频，cover-scene 渐变底色接管，直接进 UI
    const onError = () => {
      setVideoBroken(true);
      setArrived(true);
    };
    video.addEventListener("error", onError);
    // 兜底：视频正常约 9.5s 播完；20s 还没结束（网络卡住）就暂停在当前帧放行 UI
    const failsafe = window.setTimeout(() => {
      video.pause();
      setArrived(true);
    }, 20000);
    return () => {
      video.removeEventListener("error", onError);
      window.clearTimeout(failsafe);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // reduced-motion 用户跳过进场动画：直接冻结进 UI（jsdom 无 matchMedia，需判存在）
    if (
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      video.pause();
      setArrived(true);
      return;
    }
    // 播放完成：停在末帧（星球全景作封面背景），实时 UI 带渐变慢慢浮现
    const onEnded = () => setArrived(true);
    video.addEventListener("ended", onEnded);
    return () => video.removeEventListener("ended", onEnded);
  }, []);

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

  return (
    <main className="cover-scene relative isolate flex min-h-dvh flex-col overflow-hidden">
      {/* 进场视频：一进页面自动播放完整开场（纯画面无内嵌文字），播放完成后停在末帧
          作封面背景；失败/未就绪时回退到 cover-scene 渐变底色，视觉无缝 */}
      <video
        ref={videoRef}
        className={
          "cover-video pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-150" +
          (videoBroken ? " opacity-0" : "")
        }
        src="/videos/home-intro.mp4"
        autoPlay
        muted
        playsInline
        preload="auto"
        aria-hidden
      />
      {/* 以下各层随 arrived 慢慢淡入（2s 渐变 + 逐层错峰） */}
      <div
        aria-hidden
        className={
          "pointer-events-none absolute inset-0 transition-opacity duration-[2000ms] " +
          (arrived ? "opacity-100" : "opacity-0")
        }
      >
        <Starfield />
        {/* 上下渐变暗化：保证标题/按钮区文字可读，中部保留画面亮度 */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#070512]/50 via-[#070512]/5 to-[#070512]/60" />
      </div>
      {/* 移动端底部留白要避开 fixed 的 ICP 备案号（bottom-[4.5rem]），否则按钮和备案号重叠容易误触 */}
      <div className="relative z-10 flex w-full flex-1 flex-col items-center px-6 pb-[7.5rem] pt-[8.5vh] md:pb-[5vh] md:pt-[6.5vh]">
        <h1
          className={
            "cover-title transition-opacity duration-[2000ms] ease-out " +
            (arrived ? "opacity-100" : "opacity-0")
          }
        >
          欢迎来到伴语星球
        </h1>
        <p
          className={
            "cover-subtitle mt-[1.8vh] transition-opacity delay-[400ms] duration-[2000ms] ease-out " +
            (arrived ? "opacity-100" : "opacity-0")
          }
        >
          听见彼此心底的声音
        </p>
        <div className="flex-1" />
        <button
          type="button"
          onClick={onEnter}
          disabled={busy}
          className={
            "cover-connect transition-opacity delay-[800ms] duration-[2000ms] ease-out " +
            (arrived ? "opacity-100" : "pointer-events-none opacity-0")
          }
        >
          <span className="relative z-10">{busy ? "正在连接…" : "开始连接"}</span>
        </button>
      </div>
    </main>
  );
}
