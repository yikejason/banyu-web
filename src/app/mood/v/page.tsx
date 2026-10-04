"use client";

import { MoodUnlocker } from "@/components/mood/MoodUnlocker";
import { NightScene } from "@/components/layout/NightScene";

// 静态导出没有动态路由：口令标识从 ?c= 查询参数读取（/mood/v?c=m_xxxx）
export default function MoodViewPage() {
  return (
    <NightScene fullScreen title="伴语星球" subtitle="有人把此刻的心情锁了起来，钥匙在你手里。">
      <MoodUnlocker />
    </NightScene>
  );
}
