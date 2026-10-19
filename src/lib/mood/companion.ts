import type { EmotionKind } from "@/lib/emotion/types";

export type MoodCompanionId = "warm" | "tender";

export const MOOD_COMPANIONS: {
  id: MoodCompanionId;
  label: string;
  hint: string;
  kind: EmotionKind;
  src: string;
}[] = [
    { id: "warm", label: "", hint: "", kind: "joy", src: "/companions/warm.png" },
    { id: "tender", label: "", hint: "", kind: "tender", src: "/companions/tender.png" },
  ];

const KEY = "banyu-mood-companion";

export function getMoodCompanion(): MoodCompanionId | null {
  if (typeof window === "undefined") return null;
  const value = localStorage.getItem(KEY);
  return value === "warm" || value === "tender" ? value : null;
}

export function setMoodCompanion(id: MoodCompanionId) {
  localStorage.setItem(KEY, id);
}

export function companionById(id: MoodCompanionId) {
  return MOOD_COMPANIONS.find((item) => item.id === id)!;
}
