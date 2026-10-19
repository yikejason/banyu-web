export type DollId = "liujin" | "feiyan" | "jingchuan";

export const DOLL_OPTIONS: {
  id: DollId;
  label: string;
  hint: string;
  src: string;
  ring: string;
}[] = [
    { id: "liujin", label: "澄光", hint: "（常态）", src: "/dolls/liujin.png", ring: "#a89cff" },
    { id: "feiyan", label: "蓝漠", hint: "（忧伤）", src: "/dolls/feiyan.png", ring: "#7ec8ff" },
    { id: "jingchuan", label: "赤焰", hint: "（愤怒）", src: "/dolls/jingchuan.png", ring: "#ffb38a" },
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
