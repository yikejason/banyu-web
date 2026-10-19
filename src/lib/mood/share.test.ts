/** @vitest-environment jsdom */
import { afterEach, expect, test, vi } from "vitest";
import {
  buildMoodUrl,
  createAnonymousMood,
  fetchMoodQuota,
  getClientId,
  randomPasscode,
} from "./share";

afterEach(() => {
  vi.unstubAllGlobals();
  localStorage.clear();
});

test("getClientId 首次生成并持久化，之后保持不变", () => {
  const first = getClientId();
  expect(first).toMatch(/^[A-Za-z0-9_-]{8,64}$/);
  expect(getClientId()).toBe(first);
});

test("getClientId 覆盖不合规的存量值", () => {
  localStorage.setItem("banyu-client-id", "short");
  expect(getClientId()).toMatch(/^[A-Za-z0-9_-]{8,64}$/);
  expect(getClientId()).toMatch(/^[A-Za-z0-9_-]{8,64}$/);
});

test("randomPasscode 只含数字且保留前导零", () => {
  for (let i = 0; i < 50; i++) {
    expect(randomPasscode()).toMatch(/^\d{4}$/);
  }
});

test("buildMoodUrl 不暴露口令与正文，只带分享标识", () => {
  expect(buildMoodUrl("https://example.com", "m_abc123")).toBe(
    "https://example.com/mood/v?c=m_abc123",
  );
});

test("fetchMoodQuota 解析冷却时间；接口不可用返回 null（不置灰）", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => new Response(JSON.stringify({ nextAllowedAt: "2026-10-25T00:00:00Z" }), { status: 200 })),
  );
  expect(await fetchMoodQuota("client-12345")).toEqual({ nextAllowedAt: "2026-10-25T00:00:00Z" });

  vi.stubGlobal(
    "fetch",
    vi.fn(async () => new Response("{}", { status: 404 })),
  );
  expect(await fetchMoodQuota("client-12345")).toBeNull();

  vi.stubGlobal(
    "fetch",
    vi.fn(async () => {
      throw new Error("offline");
    }),
  );
  expect(await fetchMoodQuota("client-12345")).toBeNull();
});

test("createAnonymousMood 成功时带回过期与下次可创建时间，并携带 clientId", async () => {
  const fetchMock = vi.fn(async () =>
    new Response(
      JSON.stringify({
        shareCode: "m_code123",
        expiresAt: "2026-10-20T00:00:00Z",
        nextAllowedAt: "2026-10-26T00:00:00Z",
      }),
      { status: 201 },
    ),
  );
  vi.stubGlobal("fetch", fetchMock);

  const res = await createAnonymousMood({
    clientId: "client-12345",
    content: "今晚月色真好",
    passcode: "0123",
    expireHours: 24,
  });

  expect(res).toEqual({
    ok: true,
    shareCode: "m_code123",
    expiresAt: "2026-10-20T00:00:00Z",
    nextAllowedAt: "2026-10-26T00:00:00Z",
  });
  const [, init] = (fetchMock.mock.calls[0] as [string, RequestInit]);
  expect(JSON.parse(init.body as string)).toMatchObject({ clientId: "client-12345", passcode: "0123" });
});

test("createAnonymousMood 冷却拒绝时带回 code 与 nextAllowedAt", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn(
      async () =>
        new Response(
          JSON.stringify({
            code: "COOLDOWN",
            error: "每个账号每 7 天仅可创建一次心境分享",
            nextAllowedAt: "2026-10-26T00:00:00Z",
          }),
          { status: 429 },
        ),
    ),
  );

  const res = await createAnonymousMood({
    clientId: "client-12345",
    content: "再写一条",
    passcode: "1234",
    expireHours: 1,
  });

  expect(res).toEqual({
    ok: false,
    code: "COOLDOWN",
    error: "每个账号每 7 天仅可创建一次心境分享",
    nextAllowedAt: "2026-10-26T00:00:00Z",
  });
});
