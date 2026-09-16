/** @vitest-environment jsdom */
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { JournalSky } from "./JournalSky";
import type { JournalEntry } from "@/lib/journal/types";

const entry: JournalEntry = {
  id: "j1",
  createdAt: "2026-09-16T12:00:00.000Z",
  updatedAt: "2026-09-16T12:00:00.000Z",
  title: "今晚",
  body: "说不清",
};

test("journal entries appear as named stars that open the entry", () => {
  render(<JournalSky items={[entry]} />);
  const star = screen.getByRole("link", { name: "今晚" });
  expect(star.getAttribute("href")).toBe("/journal/j1");
});
