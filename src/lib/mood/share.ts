export const PASSCODE_RE = /^\d{4,6}$/;

export type UnlockedMood = {
  content: string;
  createdAt: string;
};

export function randomPasscode(length = 4): string {
  const buf = new Uint32Array(length);
  crypto.getRandomValues(buf);
  return Array.from(buf, (n) => String(n % 10)).join("");
}

export function buildMoodUrl(origin: string, shareCode: string): string {
  return `${origin}/mood/v?c=${shareCode}`;
}

export async function createAnonymousMood(input: {
  content: string;
  passcode: string;
  expireHours: number;
}): Promise<{ ok: true; shareCode: string } | { ok: false; error: string }> {
  try {
    const res = await fetch("/api/moods/anonymous", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(input),
    });
    const data = (await res.json()) as { shareCode?: string; error?: string };
    if (!res.ok || !data.shareCode) {
      return { ok: false, error: data.error ?? "创建失败，请稍后再试" };
    }
    return { ok: true, shareCode: data.shareCode };
  } catch {
    return { ok: false, error: "网络异常，请稍后再试" };
  }
}

export async function verifyMoodPasscode(
  shareCode: string,
  passcode: string,
): Promise<{ ok: true; mood: UnlockedMood } | { ok: false; error: string }> {
  try {
    const res = await fetch("/api/moods/verify", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ shareCode, passcode }),
    });
    const data = (await res.json()) as Partial<UnlockedMood> & { error?: string };
    if (!res.ok || typeof data.content !== "string") {
      return { ok: false, error: data.error ?? "验证失败，请稍后再试" };
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
