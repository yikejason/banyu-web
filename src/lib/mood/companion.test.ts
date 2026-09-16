/** @vitest-environment jsdom */
import { beforeEach, expect, test } from "vitest";
import { companionById, getMoodCompanion, setMoodCompanion } from "./companion";

beforeEach(() => {
  localStorage.clear();
});

test("stores and reads the chosen companion", () => {
  expect(getMoodCompanion()).toBeNull();
  setMoodCompanion("tender");
  expect(getMoodCompanion()).toBe("tender");
  expect(companionById("tender").label).toBe("薄暮");
});
