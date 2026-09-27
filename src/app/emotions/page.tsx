"use client";

import { EmotionTrail } from "@/components/emotion/EmotionTrail";
import { NightScene } from "@/components/layout/NightScene";

export default function EmotionsPage() {
  return (
    <NightScene title="我的情绪足迹" subtitle="查看近期情绪选择">
      <EmotionTrail />
    </NightScene>
  );
}
