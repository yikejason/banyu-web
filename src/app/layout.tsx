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
        {/* ICP 备案合规：全站固定页脚展示备案号，移动端悬在底部 tab 栏上方 */}
        <footer className="pointer-events-none fixed inset-x-0 bottom-[4.5rem] z-30 flex justify-center md:bottom-2">
          <a
            className="pointer-events-auto text-[10px] tracking-wide text-on-surface-variant opacity-70"
            href="https://beian.miit.gov.cn/"
            target="_blank"
            rel="noreferrer"
          >
            蜀ICP备2026063641号-1
          </a>
        </footer>
      </body>
    </html>
  );
}
