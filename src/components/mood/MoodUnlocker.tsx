"use client";

import { Button } from "@/components/m3/Button";
import { Card } from "@/components/m3/Card";
import {
  loadUnlockedMood,
  PASSCODE_RE,
  saveUnlockedMood,
  verifyMoodPasscode,
  type UnlockedMood,
} from "@/lib/mood/share";
import { useEffect, useRef, useState } from "react";

export function MoodUnlocker({ shareCode }: { shareCode: string }) {
  const [mood, setMood] = useState<UnlockedMood | null>(null);
  const [passcode, setPasscode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const bootstrapped = useRef(false);

  async function verify(code: string) {
    setBusy(true);
    setError("");
    const res = await verifyMoodPasscode(shareCode, code);
    setBusy(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    saveUnlockedMood(shareCode, res.mood);
    setMood(res.mood);
  }

  useEffect(() => {
    if (bootstrapped.current) return;
    bootstrapped.current = true;
    const cached = loadUnlockedMood(shareCode);
    if (cached) {
      setMood(cached);
      return;
    }
    // ?code=6688 一键直达：自动校验，成功后把口令从地址栏抹掉
    const code = new URLSearchParams(window.location.search).get("code");
    if (code && PASSCODE_RE.test(code)) {
      setPasscode(code);
      window.history.replaceState(null, "", window.location.pathname);
      void verify(code);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shareCode]);

  if (mood) {
    return (
      <Card className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span aria-hidden>✨</span>
          <p className="text-sm text-on-surface-variant">对方的心情</p>
        </div>
        <p className="whitespace-pre-wrap text-lg leading-relaxed">{mood.content}</p>
        {mood.createdAt && (
          <p className="text-xs text-on-surface-variant">
            写于 {mood.createdAt.slice(0, 16).replace("T", " ")}
          </p>
        )}
      </Card>
    );
  }

  return (
    <Card className="flex flex-col items-center gap-4 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-container-high text-xl">
        <span aria-hidden>🔒</span>
      </div>
      <div>
        <p className="font-medium">这是一条加密心情</p>
        <p className="mt-1 text-sm text-on-surface-variant">
          请输入分享者告知你的访问口令
        </p>
      </div>
      <form
        className="flex w-full flex-col gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (PASSCODE_RE.test(passcode)) void verify(passcode);
        }}
      >
        <input
          aria-label="访问口令"
          type="password"
          inputMode="numeric"
          autoComplete="off"
          maxLength={6}
          placeholder="口令"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          className="w-full rounded-md border border-outline bg-transparent px-3 py-3 text-center text-lg tracking-widest text-on-surface outline-none focus:border-primary"
        />
        {error && <p className="text-sm text-error">{error}</p>}
        <Button type="submit" variant="filled" disabled={busy || !PASSCODE_RE.test(passcode)}>
          {busy ? "正在解锁…" : "解锁查看"}
        </Button>
      </form>
    </Card>
  );
}
