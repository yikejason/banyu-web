"use client";

import { AppShell } from "@/components/layout/AppShell";
import { CoverGate } from "@/components/cover/CoverGate";
import { usePathname } from "next/navigation";

export function ClientShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  if (path.startsWith("/s/")) return <>{children}</>;
  return (
    <CoverGate>
      <AppShell>{children}</AppShell>
    </CoverGate>
  );
}
