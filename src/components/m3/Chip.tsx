"use client";

export function Chip({
  selected,
  onClick,
  children,
}: {
  selected?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-8 px-4 rounded-lg text-sm ${
        selected
          ? "bg-secondary-container text-on-primary-container bg-primary-container"
          : "border border-outline text-on-surface-variant"
      }`}
    >
      {children}
    </button>
  );
}
