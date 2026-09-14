"use client";

import { AppShell } from "@/components/layout/AppShell";
import { UnlockGate } from "@/components/vault/UnlockGate";
import { usePathname } from "next/navigation";

export function ClientShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  if (path.startsWith("/s/")) return <>{children}</>;
  return (
    <UnlockGate>
      <AppShell>{children}</AppShell>
    </UnlockGate>
  );
}
