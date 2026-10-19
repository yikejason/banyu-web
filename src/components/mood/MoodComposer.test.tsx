/** @vitest-environment jsdom */
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { ToastProvider } from "@/components/m3/Toast";
import { MoodComposer } from "./MoodComposer";
import * as share from "@/lib/mood/share";

// vitest 未开 globals，testing-library 不会自动卸载组件，需要手动清理
afterEach(cleanup);

vi.mock("@/lib/mood/share", async (importOriginal) => {
  const actual = await importOriginal<typeof share>();
  return {
    ...actual,
    fetchMoodQuota: vi.fn(),
    createAnonymousMood: vi.fn(),
  };
});

const inOneHour = () => new Date(Date.now() + 3600_000).toISOString();

function renderComposer() {
  return render(
    <ToastProvider>
      <MoodComposer />
    </ToastProvider>,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(share.fetchMoodQuota).mockResolvedValue({ nextAllowedAt: null });
  vi.mocked(share.createAnonymousMood).mockReset();
  localStorage.clear();
});

test("未冷却时可以创建：提交 clientId，成功后展示过期时间与下次可创建时间", async () => {
  vi.mocked(share.createAnonymousMood).mockResolvedValue({
    ok: true,
    shareCode: "m_code123",
    expiresAt: inOneHour(),
    nextAllowedAt: new Date(Date.now() + 7 * 24 * 3600_000).toISOString(),
  });
  const user = userEvent.setup();
  renderComposer();

  await user.type(screen.getByLabelText("此刻的心境能量"), "今晚月色真好");
  await user.click(screen.getByRole("button", { name: "生成口令链接" }));

  await waitFor(() => {
    expect(share.createAnonymousMood).toHaveBeenCalledTimes(1);
  });
  const arg = vi.mocked(share.createAnonymousMood).mock.calls[0][0];
  expect(arg).toMatchObject({ content: "今晚月色真好", expireHours: 24 });
  expect(arg.clientId).toMatch(/^[A-Za-z0-9_-]{8,64}$/);
  expect(arg.passcode).toMatch(/^\d{4}$/);

  expect(await screen.findByText(/m_code123/)).toBeTruthy();
  expect(screen.getByText(/有效期至/)).toBeTruthy();
  // 成功后立即进入冷却：结果卡与按钮下方都会给出下次可创建时间
  expect(screen.getAllByText(/下一次可创建时间/).length).toBeGreaterThan(0);
  expect(
    screen.getByText(/请私聊单独发送链接与口令，请勿转发至群聊/),
  ).toBeTruthy();
});

test("冷却中：按钮置灰不可提交，点击弹出冷却提示与下次可创建时间", async () => {
  vi.mocked(share.fetchMoodQuota).mockResolvedValue({ nextAllowedAt: inOneHour() });
  const user = userEvent.setup();
  renderComposer();
  await waitFor(() => {
    expect(screen.getByRole("button", { name: "生成口令链接" }).getAttribute("aria-disabled")).toBe("true");
  });

  await user.type(screen.getByLabelText("此刻的心境能量"), "还想再写一条");
  await user.click(screen.getByRole("button", { name: "生成口令链接" }));

  expect(
    screen.getByText("你本周已经交付过一段心境，请等待冷却结束，再开启下一次倾诉。"),
  ).toBeTruthy();
  expect(screen.getByText(/冷却中，下一次可创建时间/)).toBeTruthy();
  expect(screen.getByText(/^下一次可创建时间：/)).toBeTruthy();
  expect(share.createAnonymousMood).not.toHaveBeenCalled();

  await user.click(screen.getByRole("button", { name: "关闭" }));
  expect(screen.queryByText(/冷却期提示/)).toBeNull();
});

test("后端返回 COOLDOWN 时进入冷却态并弹窗（不依赖前端初始判断）", async () => {
  vi.mocked(share.createAnonymousMood).mockResolvedValue({
    ok: false,
    code: "COOLDOWN",
    error: "每个账号每 7 天仅可创建一次心境分享",
    nextAllowedAt: inOneHour(),
  });
  const user = userEvent.setup();
  renderComposer();

  await user.type(screen.getByLabelText("此刻的心境能量"), "尝试创建");
  await user.click(screen.getByRole("button", { name: "生成口令链接" }));

  expect(
    await screen.findByText("你本周已经交付过一段心境，请等待冷却结束，再开启下一次倾诉。"),
  ).toBeTruthy();
  expect(
    screen.getByRole("button", { name: "生成口令链接" }).getAttribute("aria-disabled"),
  ).toBe("true");
});

test("换一个只刷新口令，不发任何请求、不消耗创建额度", async () => {
  const user = userEvent.setup();
  renderComposer();
  const input = screen.getByLabelText("访问口令") as HTMLInputElement;
  const first = input.value;
  expect(first).toMatch(/^\d{4}$/);

  await user.click(screen.getByRole("button", { name: "换一个" }));

  expect(input.value).toMatch(/^\d{4}$/);
  // fetchMoodQuota 只在挂载时调用一次，创建接口从未被调用
  expect(share.fetchMoodQuota).toHaveBeenCalledTimes(1);
  expect(share.createAnonymousMood).not.toHaveBeenCalled();
});
