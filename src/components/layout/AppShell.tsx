"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/", label: "星球" },
  { href: "/journal", label: "日记" },
  { href: "/share/manage", label: "分享" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  return (
    <div className="min-h-dvh flex flex-col md:flex-row bg-surface text-on-surface">
      <aside className="hidden md:flex w-44 flex-col gap-2 p-4 border-r border-outline-variant">
        <p className="px-3 py-2 text-sm text-on-surface-variant">伴语星球</p>
        {ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`h-10 px-3 rounded-xl flex items-center ${
              path === item.href ? "bg-secondary-container bg-surface-container-high text-primary" : ""
            }`}
          >
            {item.label}
          </Link>
        ))}
      </aside>
      <div className="flex-1 pb-20 md:pb-0">{children}</div>
      <nav className="md:hidden fixed bottom-0 inset-x-0 h-16 bg-surface-container flex border-t border-outline-variant">
        {ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex-1 flex items-center justify-center text-sm ${
              path === item.href ? "text-primary" : "text-on-surface-variant"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
