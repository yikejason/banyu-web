import type { Metadata } from "next";
import { Noto_Sans_SC } from "next/font/google";
import { ClientShell } from "@/components/layout/ClientShell";
import "./globals.css";

const noto = Noto_Sans_SC({
  subsets: ["latin"],
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
      {/* suppressHydrationWarning：Grammarly 等浏览器插件会在 hydration 前往 body 上注入 data-gr-* 属性，属外部干扰，压制即可 */}
      <body className="min-h-full font-sans" suppressHydrationWarning>
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
