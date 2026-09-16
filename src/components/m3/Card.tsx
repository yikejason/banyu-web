export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <section className={`planet-glass p-4 ${className}`}>{children}</section>;
}
