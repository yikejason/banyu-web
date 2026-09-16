"use client";

export function FAB({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed bottom-24 right-4 md:bottom-8 z-20 h-14 px-5 rounded-full bg-primary text-on-primary shadow-[0_8px_28px_rgba(167,120,255,0.45)]"
    >
      {label}
    </button>
  );
}
