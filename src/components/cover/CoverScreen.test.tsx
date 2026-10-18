/** @vitest-environment jsdom */
import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { CoverScreen } from "./CoverScreen";

test("cover shows welcome slogan and 开始连接", () => {
  render(<CoverScreen onEnter={() => {}} />);
  expect(screen.getByRole("heading", { name: /欢迎来到/ })).toBeTruthy();
  expect(screen.getByText("伴语星球")).toBeTruthy();
  expect(screen.getByText("在这里，每一句话都有回响")).toBeTruthy();
  expect(screen.getByRole("button", { name: "开始连接" })).toBeTruthy();
});

test("cover renders decorative layers without duplicate-key warnings", () => {
  const errors: string[] = [];
  const spy = vi.spyOn(console, "error").mockImplementation((...args) => {
    errors.push(args.join(" "));
  });
  render(<CoverScreen onEnter={() => {}} />);
  spy.mockRestore();
  expect(errors.filter((e) => e.includes("same key"))).toEqual([]);
});
