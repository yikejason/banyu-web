/** @vitest-environment jsdom */
import { act, cleanup, render, screen } from "@testing-library/react";
import { useEffect } from "react";
import { afterEach, expect, test, vi } from "vitest";
import { ToastProvider, useToast } from "./Toast";

function Probe({ onReady }: { onReady: (toast: (message: string) => void) => void }) {
  const toast = useToast();
  useEffect(() => {
    onReady(toast);
  }, [toast, onReady]);
  return null;
}

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

test("toast appears on trigger and auto-dismisses", () => {
  vi.useFakeTimers();
  let toast!: (message: string) => void;
  render(
    <ToastProvider>
      <Probe onReady={(t) => (toast = t)} />
    </ToastProvider>,
  );

  expect(screen.queryByRole("status")).toBeNull();

  act(() => {
    toast("已保存到本地");
  });
  expect(screen.getByRole("status").textContent).toBe("已保存到本地");

  act(() => {
    vi.advanceTimersByTime(3000);
  });
  expect(screen.queryByRole("status")).toBeNull();
});

test("useToast outside ToastProvider throws", () => {
  expect(() => render(<Probe onReady={() => {}} />)).toThrow(/ToastProvider/);
});
