"use client";

import { Button } from "@/components/m3/Button";
import { Card } from "@/components/m3/Card";
import { Chip } from "@/components/m3/Chip";
import { Dialog } from "@/components/m3/Dialog";
import { TextField } from "@/components/m3/TextField";
import { useToast } from "@/components/m3/Toast";
import {
  buildMoodUrl,
  createAnonymousMood,
  fetchMoodQuota,
  getClientId,
  PASSCODE_RE,
  randomPasscode,
} from "@/lib/mood/share";
import { useEffect, useState } from "react";

const EXPIRY_OPTIONS = [
  { hours: 1, label: "1 小时" },
  { hours: 24, label: "24 小时" },
  { hours: 168, label: "7 天" },
];

// 仅用于展示；所有时间规则（冷却、过期）都由后端按服务端时间判定
function formatDateTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function MoodComposer() {
  const toast = useToast();
  const [content, setContent] = useState("");
  const [passcode, setPasscode] = useState(() => randomPasscode());
  const [expireHours, setExpireHours] = useState(24);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{
    url: string;
    passcode: string;
    expiresAt?: string;
    nextAllowedAt?: string;
  } | null>(null);
  // 冷却截止时间（ISO）；null = 未冷却或后端不可查（创建仍由后端兜底校验）
  const [cooldownUntil, setCooldownUntil] = useState<string | null>(null);
  const [cooldownOpen, setCooldownOpen] = useState(false);

  // 展示用冷却态：拿到过 nextAllowedAt 即视为冷却中（是否真的仍在冷却由创建时/后端判定）
  const cooling = cooldownUntil !== null;

  // 进入页面即拉取配额：刷新、重开浏览器后冷却状态依然可见
  useEffect(() => {
    let cancelled = false;
    void fetchMoodQuota(getClientId()).then((quota) => {
      if (cancelled || !quota?.nextAllowedAt) return;
      if (new Date(quota.nextAllowedAt).getTime() > Date.now()) {
        setCooldownUntil(quota.nextAllowedAt);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const valid = content.trim().length > 0 && PASSCODE_RE.test(passcode);

  async function create() {
    // 冷却中点击：只弹提示，绝不发创建请求
    //（时间在事件处理器里判定，页面跨着冷却结束点开着也不影响——最终由后端裁决）
    if (cooldownUntil && new Date(cooldownUntil).getTime() > Date.now()) {
      setCooldownOpen(true);
      return;
    }
    if (!valid || busy) return;
    setBusy(true);
    setError("");
    const res = await createAnonymousMood({
      clientId: getClientId(),
      content: content.trim(),
      passcode,
      expireHours,
    });
    setBusy(false);
    if (!res.ok) {
      // 后端判定仍在冷却（并发或绕过前端状态的兜底）：进入冷却态并弹窗
      if (res.code === "COOLDOWN" && res.nextAllowedAt) {
        setCooldownUntil(res.nextAllowedAt);
        setCooldownOpen(true);
        return;
      }
      setError(res.error);
      return;
    }
    if (res.nextAllowedAt) setCooldownUntil(res.nextAllowedAt);
    setResult({
      url: buildMoodUrl(window.location.origin, res.shareCode),
      passcode,
      expiresAt: res.expiresAt,
      nextAllowedAt: res.nextAllowedAt,
    });
  }

  function copy(text: string, label: string) {
    navigator.clipboard
      .writeText(text)
      .then(() => toast(`已复制${label}`))
      .catch(() => toast(`复制${label}失败，请手动复制`));
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-on-surface-variant">
        链接可以被转发，口令仅支持一人访问。
      </p>
      <p className="text-xs text-on-surface-variant">账号每 7 天仅可创建一次心境分享</p>
      <TextField label="此刻的心境能量" value={content} onChange={setContent} textarea />

      <div className="flex flex-col gap-2 text-sm text-on-surface-variant">
        <span>访问口令（4-6 位数字）</span>
        <span>提示：口令仅可访问一次，一旦打开即刻作废，即便他人拿到口令也无法查看。本分享最长保留 7 天，超时自动销毁。本次分享结束后，需等待 7 天才可创建新分享。</span>
        <div className="flex items-center gap-2">
          <input
            aria-label="访问口令"
            inputMode="numeric"
            maxLength={6}
            value={passcode}
            onChange={(e) => setPasscode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            className="w-32 rounded-md border border-outline bg-transparent px-3 py-3 text-center text-lg tracking-widest text-on-surface outline-none focus:border-primary"
          />
          <Button variant="text" onClick={() => setPasscode(randomPasscode())}>
            换一个
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2 text-sm text-on-surface-variant">
        <span>有效期限</span>
        <div className="flex gap-2">
          {EXPIRY_OPTIONS.map((opt) => (
            <Chip key={opt.hours} selected={expireHours === opt.hours} onClick={() => setExpireHours(opt.hours)}>
              {opt.label}
            </Chip>
          ))}
        </div>
      </div>

      <Button
        variant="filled"
        // 冷却中不用真 disabled（会吞掉点击事件），改用 aria-disabled + 置灰样式，
        // 点击弹冷却提示；提交动作在 create() 里被拦下
        aria-disabled={cooling || undefined}
        className={cooling ? "opacity-40" : ""}
        disabled={!cooling && (!valid || busy)}
        onClick={create}
      >
        {busy ? "正在生成…" : "生成口令链接"}
      </Button>
      {cooling && (
        <p className="text-xs text-on-surface-variant">
          冷却中，下一次可创建时间：{formatDateTime(cooldownUntil ?? "")}
        </p>
      )}
      {error && <p className="text-sm text-error">{error}</p>}

      {result && (
        <Card className="flex flex-col gap-3">
          <p className="text-sm text-on-surface-variant">把链接和口令一起发给对方</p>
          <p className="break-all text-sm">{result.url}</p>
          <p className="text-center text-2xl tracking-[0.3em]">{result.passcode}</p>
          {result.expiresAt && (
            <p className="text-xs text-on-surface-variant">
              有效期至 {formatDateTime(result.expiresAt)}，超时未访问自动销毁
            </p>
          )}
          {result.nextAllowedAt && (
            <p className="text-xs text-on-surface-variant">
              下一次可创建时间 {formatDateTime(result.nextAllowedAt)}
            </p>
          )}
          <p className="text-xs text-on-surface-variant">
            口令仅可访问一次：对方首次输入正确口令即解锁并即刻作废，之后任何人都无法查看。
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="tonal" onClick={() => copy(result.url, "链接")}>
              复制链接
            </Button>
            <Button variant="tonal" onClick={() => copy(result.passcode, "口令")}>
              复制口令
            </Button>
            <Button
              variant="outlined"
              onClick={() => copy(`链接：${result.url}\n口令：${result.passcode}`, "全部")}
            >
              复制全部
            </Button>
          </div>
        </Card>
      )}

      <p className="text-xs text-on-surface-variant">
        请私聊单独发送链接与口令，请勿转发至群聊，避免被他人抢先访问。
      </p>

      <Dialog open={cooldownOpen} onClose={() => setCooldownOpen(false)} title="冷却期提示">
        <p className="text-sm text-on-surface-variant">
          你本周已经交付过一段心境，请等待冷却结束，再开启下一次倾诉。
        </p>
        {cooling && (
          <p className="mt-2 text-sm text-on-surface-variant">
            下一次可创建时间：{formatDateTime(cooldownUntil ?? "")}
          </p>
        )}
      </Dialog>
    </div>
  );
}
