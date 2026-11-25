"use client";

import { MOOD_COMPANIONS, type MoodCompanionId } from "@/lib/mood/companion";
import { useState } from "react";

/** 性别选择页：参考成品图——两人站在星球上，♂/♀ 药丸 + 光连线 + 圆形确认按钮 */
export function MoodSelectScreen({
  onConfirm,
}: {
  onConfirm: (id: MoodCompanionId) => void;
}) {
  const [selected, setSelected] = useState<MoodCompanionId | null>(null);

  const pick = (id: MoodCompanionId) => setSelected(id);

  return (
    <main className={`gender-scene ${selected ? "has-pick" : ""}`}>
      <h1 className="gender-title">命运让我们相逢于此</h1>

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
            {/* 走路序列帧精灵图：一个完整步态周期正向循环（男生 14 帧/1.17s，女生 17 帧/1.42s），
                选中播放/未选静止在第 0 帧 */}
            <span
              className="gender-char"
              style={{
                backgroundImage: `url(${isBoy ? "/gender/boy-walk.webp" : "/gender/girl-walk.webp"})`,
              }}
            />
            <span className="gender-feet-glow" aria-hidden />
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
