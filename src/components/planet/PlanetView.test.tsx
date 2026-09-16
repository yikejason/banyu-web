/** @vitest-environment jsdom */
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { mapEmotion } from "@/lib/emotion/mapEmotion";
import { PlanetView } from "./PlanetView";

test("history traces appear as named orbit lights", () => {
  render(
    <PlanetView
      visual={mapEmotion({ intensity: 3, kind: "calm" })}
      traces={[{ id: "a", hue: 48, label: "暖光" }]}
    />,
  );

  expect(screen.getByRole("button", { name: "暖光" })).toBeTruthy();
  expect(screen.getByText("静海")).toBeTruthy();
});

test("mood companion stands on the planet", () => {
  render(
    <PlanetView
      visual={mapEmotion({ intensity: 3, kind: "joy" })}
      figureSrc="/companions/warm.png"
      figureLabel="暖光"
    />,
  );

  expect(screen.getByRole("img", { name: "暖光" })).toBeTruthy();
});
