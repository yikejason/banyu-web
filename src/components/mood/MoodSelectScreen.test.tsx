/** @vitest-environment jsdom */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { MoodSelectScreen } from "./MoodSelectScreen";

test("确认选择 stays disabled until a companion is picked", async () => {
  const onConfirm = vi.fn();
  const user = userEvent.setup();
  render(<MoodSelectScreen onConfirm={onConfirm} />);

  expect(screen.getByRole("heading", { name: "请选择你的心情小人" })).toBeTruthy();
  const confirm = screen.getByRole("button", { name: "确认选择" }) as HTMLButtonElement;
  expect(confirm.disabled).toBe(true);

  await user.click(screen.getByRole("button", { name: /暖光/ }));
  expect(confirm.disabled).toBe(false);

  await user.click(screen.getByRole("button", { name: "确认选择" }));
  expect(onConfirm).toHaveBeenCalledWith("warm");
});
