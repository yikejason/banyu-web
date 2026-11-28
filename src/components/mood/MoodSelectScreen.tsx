"use client";

import { MOOD_COMPANIONS, type MoodCompanionId } from "@/lib/mood/companion";
import { useState } from "react";

/** 确定性伪随机（固定种子）：粒子布局每次渲染一致，不闪跳 */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Dust = {
  x: number;
  y: number;
  s: number;
  delay: number;
  dur: number;
  bright?: boolean;
};

/** 环绕轨道曲线（三次贝塞尔，百分比坐标）：从「命」左下尾迹起，弯过标题上方，沿右侧向下延伸 */
const ARC_PATH = {
  p0: { x: 2, y: 62 },
  c1: { x: 22, y: -18 },
  c2: { x: 78, y: -50 },
  p3: { x: 106, y: 42 },
};
function cubicAt(t: number) {
  const u = 1 - t;
  const { p0, c1, c2, p3 } = ARC_PATH;
  return {
    x: u * u * u * p0.x + 3 * u * u * t * c1.x + 3 * u * t * t * c2.x + t * t * t * p3.x,
    y: u * u * u * p0.y + 3 * u * u * t * c1.y + 3 * u * t * t * c2.y + t * t * t * p3.y,
  };
}

/** 标题金粉颗粒分布（百分比坐标，相对标题盒）：
    1) 环绕轨道星尘带 70 颗——流光渐变线，头尾渐隐；2) 字面零星 20 颗；3) 沿轨道 5 颗亮四角星 */
const TITLE_DUST: Dust[] = (() => {
  const rnd = mulberry32(20261126);
  const list: Dust[] = [];
  const r2 = (v: number) => Math.round(v * 10) / 10;
  for (let i = 0; i < 70; i++) {
    const t = i / 69;
    const p = cubicAt(t);
    const fade = 0.35 + 0.65 * Math.sin(t * Math.PI); // 头尾渐隐、中段最亮（渐变线）
    list.push({
      x: r2(p.x + (rnd() - 0.5) * 3),
      y: r2(p.y + (rnd() + rnd() + rnd() - 1.5) * 6),
      s: r2((rnd() < 0.14 ? 3.4 : 1.5 + rnd() * 1.7) * (0.7 + 0.3 * fade)),
      delay: r2(rnd() * 4),
      dur: r2(2.4 + rnd() * 2.8),
      bright: t < 0.1 && rnd() < 0.5,
    });
  }
  for (let i = 0; i < 20; i++) {
    list.push({
      x: r2(4 + rnd() * 92),
      y: r2(18 + rnd() * 62),
      s: r2(1.2 + rnd() * 1.6),
      delay: r2(rnd() * 4),
      dur: r2(2.6 + rnd() * 2.4),
    });
  }
  // 亮四角星锚点：直接取轨道曲线上 5 个位置（环绕感的关键亮点）
  for (const t of [0.06, 0.3, 0.55, 0.78, 0.96]) {
    const p = cubicAt(t);
    list.push({ x: r2(p.x), y: r2(p.y), s: 5, delay: r2(rnd() * 3), dur: 3.6, bright: true });
  }
  return list;
})();

/** 光圈周围缓缓上浮的少量细碎星尘：小光点，数量克制（固定种子
    不闪跳，男女共用同一几何分布；只随选中点亮出现） */
type HaloDust = {
  x: number; // 盘内横向位置 %
  b: number; // 起浮高度 %（盘内）
  s: number; // 尺寸 px
  delay: number; // 相位（负延迟错开）
  dur: number; // 上浮周期 s
};

const HALO_DUST: HaloDust[] = (() => {
  const rnd = mulberry32(20261128);
  const r2 = (v: number) => Math.round(v * 10) / 10;
  const list: HaloDust[] = [];
  for (let i = 0; i < 5; i++) {
    list.push({
      x: r2(12 + rnd() * 76),
      b: r2(16 + rnd() * 44),
      s: rnd() < 0.5 ? 2 : 3,
      delay: r2(-rnd() * 5),
      dur: r2(3.8 + rnd() * 1.8),
    });
  }
  return list;
})();
export function MoodSelectScreen({
  onConfirm,
}: {
  onConfirm: (id: MoodCompanionId) => void;
}) {
  const [selected, setSelected] = useState<MoodCompanionId | null>(null);

  const pick = (id: MoodCompanionId) => setSelected(id);

  return (
    <main className={`gender-scene ${selected ? "has-pick" : ""}`}>
      {/* 标题：AI 艺术字（透明通道版）+ 金粉颗粒感：字面颗粒噪点 + 弧线星尘带（流光渐变线）+ 淡金流光 */}
      <h1 className="gender-title">
        <img src="/gender/title-mingyun-v3.webp" alt="命运让我们相遇" />
        {/* 流光渐变线：金色弧线（SVG 二次贝塞尔，与星尘带同曲线），头尾渐隐 */}
        <svg
          className="gender-title-arc"
          viewBox="0 0 343 108"
          preserveAspectRatio="none"
          aria-hidden
        >
          <defs>
            <linearGradient id="genderArcGold" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0.12" stopColor="#b892ff" stopOpacity="0" />
              <stop offset="0.42" stopColor="#d9c5ff" stopOpacity="0.6" />
              <stop offset="0.72" stopColor="#f2ecff" stopOpacity="0.45" />
              <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
            <filter id="genderArcBlur" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="0.7" />
            </filter>
          </defs>
          <path
            d="M 2 62 C 22 -18 78 -50 106 42"
            fill="none"
            stroke="url(#genderArcGold)"
            strokeWidth="1.5"
            filter="url(#genderArcBlur)"
          />
        </svg>
        <span className="gender-title-grain" aria-hidden />
        <span className="gender-title-sweep" aria-hidden />
        <span className="gender-title-dust" aria-hidden>
          {TITLE_DUST.map((d, i) => (
            <i
              key={i}
              style={{
                left: `${d.x}%`,
                top: `${d.y}%`,
                width: `${d.s}px`,
                height: `${d.s}px`,
                animationDelay: `${d.delay}s`,
                animationDuration: `${d.dur}s`,
              }}
              data-bright={d.bright ? "" : undefined}
            />
          ))}
        </span>
      </h1>

      {/* 两个 selectable 人物：整人可点，站在这颗星球上 */}
      {MOOD_COMPANIONS.map((companion) => {
        const active = selected === companion.id;
        const isBoy = companion.id === "warm";
        return (
          <button
            key={companion.id}
            type="button"
            aria-label={isBoy ? "男生" : "女生"}
            aria-pressed={active}
            onClick={() => pick(companion.id)}
            className={`gender-char-btn ${isBoy ? "gender-char-boy" : "gender-char-girl"} ${active ? "is-on" : ""}`}
          >
            {/* 脚下羽化光晕：柔光托在脚下、垫人物底层不盖鞋、垫在多环光圈底下，
                高斯羽化无硬边；选中后点亮并随步频轻微起伏 */}
            <span className="gender-halo" aria-hidden />
            {/* 光圈带起的少量细碎星尘（数量克制，选中后才有） */}
            <span className="gender-halo-dust" aria-hidden>
              {HALO_DUST.map((d, i) => (
                <i
                  key={i}
                  style={{
                    left: `${d.x}%`,
                    bottom: `${d.b}%`,
                    width: `${d.s}px`,
                    height: `${d.s}px`,
                    animationDelay: `${d.delay}s`,
                    animationDuration: `${d.dur}s`,
                  }}
                />
              ))}
            </span>
            {/* 身后呼吸光晕（光幕之上、人物底下） */}
            <span className="gender-aura" aria-hidden />
            {/* 走路序列帧精灵图：一个完整步态周期正向循环（男生 14 帧/1.17s，女生 17 帧/1.42s），
                选中播放/未选静止在第 0 帧 */}
            <span
              className="gender-char"
              style={{
                backgroundImage: `url(${isBoy ? "/gender/boy-walk.webp?v=2" : "/gender/girl-walk.webp?v=2"})`,
              }}
            />
            {/* 环绕人物缓缓上升的光尘 */}
            <span className="gender-motes" aria-hidden>
              <i /><i /><i /><i /><i /><i /><i /><i /><i />
            </span>
            <span className="gender-feet-glow" aria-hidden />
            {/* 脚下星辉光晕：鞋底接触点的柔光呼吸 */}
            <span className="gender-feet-light" aria-hidden />
            {/* 脚下多环光圈：贴脚主环白热管芯 + 外围多层渐淡同心环（参考图样式） */}
            <span className="gender-foot-ring" aria-hidden />
          </button>
        );
      })}

      <button
        type="button"
        className="gender-confirm"
        disabled={!selected}
        onClick={() => {
          if (selected) onConfirm(selected);
        }}
      >
        确认选择
      </button>
    </main>
  );
}
