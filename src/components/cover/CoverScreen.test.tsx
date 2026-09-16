/** @vitest-environment jsdom */
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { CoverScreen } from "./CoverScreen";

test("cover shows slogan and 开始连接", () => {
  render(<CoverScreen onEnter={() => {}} />);
  expect(screen.getByRole("heading", { name: /于同一颗星球/ })).toBeTruthy();
  expect(screen.getByRole("button", { name: "开始连接" })).toBeTruthy();
  const images = document.querySelectorAll('img[src^="/orbs/"]');
  expect([...images].map((img) => img.getAttribute("src"))).toEqual([
    "/orbs/gold.png",
    "/orbs/blue.png",
    "/orbs/heart.png",
  ]);
});
