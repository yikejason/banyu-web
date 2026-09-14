export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-xl bg-surface-container p-4 ${className}`}>
      {children}
    </section>
  );
}
