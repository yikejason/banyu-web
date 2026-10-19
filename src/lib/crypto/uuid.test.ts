import { expect, test } from "vitest";
import { randomUuid } from "./uuid";

const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

test("randomUuid 产出合法 v4 格式", () => {
  for (let i = 0; i < 20; i++) {
    expect(randomUuid()).toMatch(UUID_V4);
  }
});

test("randomUuid 在 crypto.randomUUID 缺失（HTTP + IP 非安全上下文）时回退可用", () => {
  const proto = Object.getPrototypeOf(crypto);
  const desc = Object.getOwnPropertyDescriptor(proto, "randomUUID");
  Object.defineProperty(proto, "randomUUID", { ...desc, value: undefined });
  try {
    expect(randomUuid()).toMatch(UUID_V4);
    expect(randomUuid()).not.toBe(randomUuid());
  } finally {
    Object.defineProperty(proto, "randomUUID", desc);
  }
});
