"use client";

import { AppShell } from "@/components/layout/AppShell";
import { CoverGate } from "@/components/cover/CoverGate";
import { usePathname } from "next/navigation";

export function ClientShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  // /mood/ 是给分享接收者看的公开页，绕过封面门与应用壳
  if (path.startsWith("/mood/")) return <>{children}</>;
  return (
    <CoverGate>
      <AppShell>{children}</AppShell>
    </CoverGate>
  );
}
