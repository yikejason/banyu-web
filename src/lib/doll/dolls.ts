export type DollId = "liujin" | "feiyan" | "jingchuan";

export const DOLL_OPTIONS: {
  id: DollId;
  label: string;
  hint: string;
  src: string;
}[] = [
  { id: "liujin", label: "鎏金", hint: "珍贵、温存", src: "/dolls/liujin.png" },
  { id: "feiyan", label: "绯焰", hint: "小脾气、和好", src: "/dolls/feiyan.png" },
  { id: "jingchuan", label: "静川", hint: "低落、想念", src: "/dolls/jingchuan.png" },
];

const KEY = "banyu-doll";

export function getDoll(): DollId | null {
  if (typeof window === "undefined") return null;
  const value = localStorage.getItem(KEY);
  return DOLL_OPTIONS.some((doll) => doll.id === value) ? (value as DollId) : null;
}

export function setDoll(id: DollId) {
  localStorage.setItem(KEY, id);
}

export function dollById(id: DollId) {
  return DOLL_OPTIONS.find((doll) => doll.id === id)!;
}
