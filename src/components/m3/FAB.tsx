"use client";

export function FAB({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed bottom-24 right-4 md:bottom-8 z-20 h-14 px-5 rounded-xl bg-primary-container text-on-primary-container shadow-lg"
    >
      {label}
    </button>
  );
}
