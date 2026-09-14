import type { Metadata } from "next";
import { Noto_Sans_SC } from "next/font/google";
import { ClientShell } from "@/components/layout/ClientShell";
import "./globals.css";

const noto = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto",
});

export const metadata: Metadata = {
  title: "伴语星球",
  description: "把情绪变成可见的符号，把成长写进只属于自己的加密日记。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className={`${noto.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
