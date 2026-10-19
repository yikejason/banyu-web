import { randomUuid } from "@/lib/crypto/uuid";

export const PASSCODE_RE = /^\d{4,6}$/;

export type UnlockedMood = {
  content: string;
  createdAt: string;
};

// 后端业务错误码：COOLDOWN 创建冷却、REDEEMED 已被访问、EXPIRED 已过期、NOT_FOUND 不存在、
// LOCKED/WRONG_PASSCODE 口令相关。旧后端不返回 code，前端按 error 文案兜底展示
export type MoodErrorCode =
  | "COOLDOWN"
  | "REDEEMED"
  | "EXPIRED"
  | "NOT_FOUND"
  | "LOCKED"
  | "WRONG_PASSCODE";

const CLIENT_ID_KEY = "banyu-client-id";

// 项目无账号体系，用设备级匿名标识充当「账号」：首次生成后持久化在 localStorage，
// 后端以它作为 7 天创建冷却的限制主体
export function getClientId(): string {
  let id = localStorage.getItem(CLIENT_ID_KEY);
  if (!id || !/^[A-Za-z0-9_-]{8,64}$/.test(id)) {
    id = randomUuid();
    localStorage.setItem(CLIENT_ID_KEY, id);
  }
  return id;
}

export function randomPasscode(length = 4): string {
  const buf = new Uint32Array(length);
  crypto.getRandomValues(buf);
  return Array.from(buf, (n) => String(n % 10)).join("");
}

export function buildMoodUrl(origin: string, shareCode: string): string {
  return `${origin}/mood/v?c=${shareCode}`;
}

export type MoodQuota = { nextAllowedAt: string | null };

// 查询当前设备的创建配额，仅用于前端展示冷却状态；真正的拦截在后端创建接口。
// 接口不存在（后端未升级）或网络异常时返回 null，前端按「未知」处理，不置灰按钮
export async function fetchMoodQuota(clientId: string): Promise<MoodQuota | null> {
  try {
    const res = await fetch(`/api/moods/quota?clientId=${encodeURIComponent(clientId)}`);
    if (!res.ok) return null;
    const data = (await res.json()) as Partial<MoodQuota>;
    return { nextAllowedAt: typeof data.nextAllowedAt === "string" ? data.nextAllowedAt : null };
  } catch {
    return null;
  }
}

export async function createAnonymousMood(input: {
  clientId: string;
  content: string;
  passcode: string;
  expireHours: number;
}): Promise<
  | { ok: true; shareCode: string; expiresAt?: string; nextAllowedAt?: string }
  | { ok: false; error: string; code?: MoodErrorCode; nextAllowedAt?: string }
> {
  try {
    const res = await fetch("/api/moods/anonymous", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(input),
    });
    const data = (await res.json()) as {
      shareCode?: string;
      expiresAt?: string;
      nextAllowedAt?: string;
      error?: string;
      code?: MoodErrorCode;
    };
    if (!res.ok || !data.shareCode) {
      return {
        ok: false,
        error: data.error ?? "创建失败，请稍后再试",
        code: data.code,
        nextAllowedAt: data.nextAllowedAt,
      };
    }
    return {
      ok: true,
      shareCode: data.shareCode,
      expiresAt: data.expiresAt,
      nextAllowedAt: data.nextAllowedAt,
    };
  } catch {
    return { ok: false, error: "网络异常，请稍后再试" };
  }
}

export async function verifyMoodPasscode(
  shareCode: string,
  passcode: string,
): Promise<
  | { ok: true; mood: UnlockedMood }
  | { ok: false; error: string; code?: MoodErrorCode }
> {
  try {
    const res = await fetch("/api/moods/verify", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ shareCode, passcode }),
    });
    const data = (await res.json()) as Partial<UnlockedMood> & {
      error?: string;
      code?: MoodErrorCode;
    };
    if (!res.ok || typeof data.content !== "string") {
      return { ok: false, error: data.error ?? "验证失败，请稍后再试", code: data.code };
    }
    return { ok: true, mood: { content: data.content, createdAt: data.createdAt ?? "" } };
  } catch {
    return { ok: false, error: "网络异常，请稍后再试" };
  }
}

// 解锁结果缓存在本会话：刷新页面免重输口令，关掉标签页即失效
function cacheKey(shareCode: string) {
  return `mood_unlocked_${shareCode}`;
}

export function loadUnlockedMood(shareCode: string): UnlockedMood | null {
  try {
    const raw = sessionStorage.getItem(cacheKey(shareCode));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<UnlockedMood>;
    if (typeof parsed.content !== "string") return null;
    return { content: parsed.content, createdAt: parsed.createdAt ?? "" };
  } catch {
    return null;
  }
}

export function saveUnlockedMood(shareCode: string, mood: UnlockedMood) {
  try {
    sessionStorage.setItem(cacheKey(shareCode), JSON.stringify(mood));
  } catch {
    // 隐私模式等存储不可用时静默降级：只是刷新后要重输口令
  }
}
