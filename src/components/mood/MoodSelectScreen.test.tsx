/** @vitest-environment jsdom */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { MoodSelectScreen } from "./MoodSelectScreen";

test("确认选择 stays disabled until a gender is picked", async () => {
  const onConfirm = vi.fn();
  const user = userEvent.setup();
  render(<MoodSelectScreen onConfirm={onConfirm} />);

  expect(screen.getByRole("heading", { name: "命运让我们相遇" })).toBeTruthy();
  const confirm = screen.getByRole("button", { name: "确认选择" }) as HTMLButtonElement;
  expect(confirm.disabled).toBe(true);

  // 药丸行已移除，点人物选择男生
  await user.click(screen.getByRole("button", { name: "男生" }));
  expect(confirm.disabled).toBe(false);

  await user.click(screen.getByRole("button", { name: "确认选择" }));
  expect(onConfirm).toHaveBeenCalledWith("warm");
});
