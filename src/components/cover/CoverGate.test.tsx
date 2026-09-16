/** @vitest-environment jsdom */
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, expect, test, vi } from "vitest";

vi.mock("@/lib/storage/vault", () => ({
  ensureDeviceVault: vi.fn(async () => {}),
}));

import { CoverGate } from "./CoverGate";

beforeEach(() => {
  sessionStorage.clear();
  localStorage.clear();
});

afterEach(() => {
  cleanup();
});

test("开始连接 opens mood select instead of the app", async () => {
  const user = userEvent.setup();
  render(
    <CoverGate>
      <p>inside</p>
    </CoverGate>,
  );

  await user.click(await screen.findByRole("button", { name: "开始连接" }));
  expect(await screen.findByRole("heading", { name: "请选择你的心情小人" })).toBeTruthy();
  expect(screen.queryByText("inside")).toBeNull();
});

test("confirming a companion leaves the gate and shows the app", async () => {
  const user = userEvent.setup();
  render(
    <CoverGate>
      <p>inside</p>
    </CoverGate>,
  );

  await user.click(await screen.findByRole("button", { name: "开始连接" }));
  await user.click(await screen.findByRole("button", { name: /暖光/ }));
  await user.click(screen.getByRole("button", { name: "确认选择" }));
  expect(await screen.findByText("inside")).toBeTruthy();
});
