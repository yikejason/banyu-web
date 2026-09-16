import { Starfield } from "@/components/planet/Starfield";

export function NightScene({
  kicker = "伴语",
  title,
  subtitle,
  children,
  fullScreen,
}: {
  kicker?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  fullScreen?: boolean;
}) {
  return (
    <main
      className={`planet-scene relative isolate ${
        fullScreen ? "flex min-h-dvh flex-col" : "min-h-[calc(100dvh-4rem)] md:min-h-dvh"
      }`}
    >
      <Starfield />
      <div
        className={`relative z-10 mx-auto flex w-full max-w-lg flex-col px-5 pt-8 ${
          fullScreen ? "min-h-dvh justify-center pb-10" : "pb-28 md:pb-10"
        }`}
      >
        <header className="mb-6 text-center">
          <p className="text-[11px] tracking-[0.42em] text-on-surface-variant">{kicker}</p>
          <h1 className="mt-1 text-2xl font-medium">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-on-surface-variant">{subtitle}</p>}
        </header>
        {children}
      </div>
    </main>
  );
}
