"use client";

import { Button } from "@/components/m3/Button";
import { TextField } from "@/components/m3/TextField";
import {
  createVault,
  isVaultInitialized,
  unlockVault,
} from "@/lib/storage/vault";
import { isUnlocked } from "@/lib/storage/session";
import { useEffect, useState } from "react";

export function UnlockGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [open, setOpen] = useState(false);
  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    isVaultInitialized().then((v) => {
      setInitialized(v);
      setOpen(isUnlocked());
      setReady(true);
    });
  }, []);

  if (!ready) {
    return <main className="p-8 text-on-surface-variant">正在打开星球…</main>;
  }

  if (open) return <>{children}</>;

  async function submit() {
    setError("");
    try {
      if (!initialized) {
        if (pass.length < 8) throw new Error("口令至少 8 位");
        if (pass !== pass2) throw new Error("两次口令不一致");
        await createVault(pass);
      } else {
        await unlockVault(pass);
      }
      setOpen(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "无法解锁");
    }
  }

  return (
    <main className="min-h-dvh flex flex-col items-center justify-center px-6 gap-6">
      <h1 className="text-3xl font-medium">伴语星球</h1>
      <p className="max-w-sm text-center text-on-surface-variant text-sm leading-6">
        {initialized
          ? "口令只留在这台设备，用于解开本地日记。"
          : "口令只留在这台设备，用于解开本地日记。我们无法帮你找回。"}
      </p>
      <div className="w-full max-w-sm flex flex-col gap-4">
        <TextField
          label={initialized ? "口令" : "设置口令"}
          value={pass}
          onChange={setPass}
          type="password"
        />
        {!initialized && (
          <TextField label="再次确认" value={pass2} onChange={setPass2} type="password" />
        )}
        {error && <p className="text-sm text-error">{error}</p>}
        <Button variant="filled" onClick={submit}>
          {initialized ? "进入" : "创建本地金库"}
        </Button>
      </div>
    </main>
  );
}
