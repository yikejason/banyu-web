"use client";

export function FAB({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-14 rounded-full bg-primary px-5 text-on-primary shadow-[0_8px_28px_rgba(167,120,255,0.45)]"
    >
      {label}
    </button>
  );
}
