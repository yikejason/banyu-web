/** @vitest-environment jsdom */
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, test, vi } from "vitest";
import { mapEmotion } from "@/lib/emotion/mapEmotion";
import { formatEmotionLine } from "@/lib/emotion/labels";
import type { EmotionRecord } from "@/lib/emotion/types";

const angry: EmotionRecord = {
  id: "e1",
  createdAt: new Date(2026, 8, 17, 12).toISOString(),
  input: { kind: "angry", intensity: 4 },
  visual: mapEmotion({ kind: "angry", intensity: 4 }),
};

const joy: EmotionRecord = {
  id: "e2",
  createdAt: new Date(2026, 8, 16, 12).toISOString(),
  input: { kind: "joy", intensity: 3 },
  visual: mapEmotion({ kind: "joy", intensity: 3 }),
};

vi.mock("@/lib/emotion/repository", () => ({
  listEmotions: vi.fn(async () => [angry, joy]),
  deleteEmotions: vi.fn(async () => {}),
}));

import { deleteEmotions } from "@/lib/emotion/repository";
import { EmotionTrail } from "./EmotionTrail";

afterEach(() => {
  cleanup();
});

test("lists recent emotion footprints", async () => {
  render(<EmotionTrail />);
  expect(await screen.findByText(formatEmotionLine(angry))).toBeTruthy();
  expect(screen.getByText(formatEmotionLine(joy))).toBeTruthy();
  expect(screen.getByText("仅记录本机情绪选择，不自动上传")).toBeTruthy();
  expect(screen.getByRole("button", { name: "保存本地" })).toBeTruthy();
});

test("选择删除 removes checked footprints", async () => {
  const user = userEvent.setup();
  render(<EmotionTrail />);
  await screen.findByText(formatEmotionLine(angry));
  await user.click(screen.getByRole("button", { name: "选择删除" }));
  await user.click(screen.getByRole("button", { name: formatEmotionLine(angry) }));
  await user.click(screen.getByRole("button", { name: "删除所选" }));
  expect(deleteEmotions).toHaveBeenCalledWith(["e1"]);
});
