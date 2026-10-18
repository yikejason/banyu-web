"use client";

import { AppShell } from "@/components/layout/AppShell";
import { CoverGate } from "@/components/cover/CoverGate";
import { ToastProvider } from "@/components/m3/Toast";
import { usePathname } from "next/navigation";

export function ClientShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  // /mood/ 是给分享接收者看的公开页，绕过封面门与应用壳
  const content =
    path.startsWith("/mood/") ? (
      <>{children}</>
    ) : (
      <CoverGate>
        <AppShell>{children}</AppShell>
      </CoverGate>
    );
  return <ToastProvider>{content}</ToastProvider>;
}
