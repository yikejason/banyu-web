"use client";

import { Button } from "@/components/m3/Button";
import { Card } from "@/components/m3/Card";
import { Chip } from "@/components/m3/Chip";
import { TextField } from "@/components/m3/TextField";
import {
  buildMoodUrl,
  createAnonymousMood,
  PASSCODE_RE,
  randomPasscode,
} from "@/lib/mood/share";
import { useState } from "react";

const EXPIRY_OPTIONS = [
  { hours: 1, label: "1 小时" },
  { hours: 24, label: "24 小时" },
  { hours: 168, label: "7 天" },
];

export function MoodComposer() {
  const [content, setContent] = useState("");
  const [passcode, setPasscode] = useState(() => randomPasscode());
  const [expireHours, setExpireHours] = useState(24);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ url: string; passcode: string } | null>(null);

  const valid = content.trim().length > 0 && PASSCODE_RE.test(passcode);

  async function create() {
    if (!valid || busy) return;
    setBusy(true);
    setError("");
    const res = await createAnonymousMood({
      content: content.trim(),
      passcode,
      expireHours,
    });
    setBusy(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setResult({ url: buildMoodUrl(window.location.origin, res.shareCode), passcode });
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-on-surface-variant">
        链接可以被转发，口令只告诉你想给的人。
      </p>
      <TextField label="此刻的心情" value={content} onChange={setContent} textarea />

      <div className="flex flex-col gap-2 text-sm text-on-surface-variant">
        <span>访问口令（4-6 位数字）</span>
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

      <Button variant="filled" disabled={!valid || busy} onClick={create}>
        {busy ? "正在生成…" : "生成口令链接"}
      </Button>
      {error && <p className="text-sm text-error">{error}</p>}

      {result && (
        <Card className="flex flex-col gap-3">
          <p className="text-sm text-on-surface-variant">把链接和口令一起发给对方</p>
          <p className="break-all text-sm">{result.url}</p>
          <p className="text-center text-2xl tracking-[0.3em]">{result.passcode}</p>
          <div className="flex flex-wrap gap-2">
            <Button variant="tonal" onClick={() => navigator.clipboard.writeText(result.url)}>
              复制链接
            </Button>
            <Button
              variant="tonal"
              onClick={() => navigator.clipboard.writeText(result.passcode)}
            >
              复制口令
            </Button>
            <Button
              variant="outlined"
              onClick={() =>
                navigator.clipboard.writeText(`链接：${result.url}\n口令：${result.passcode}`)
              }
            >
              复制全部
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
