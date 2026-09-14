"use client";

export function Dialog({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[color:color-mix(in_srgb,black_40%,transparent)] p-4">
      <div className="w-full max-w-md rounded-xl bg-surface-container-high p-6 text-on-surface shadow-xl">
        <h2 className="text-xl font-medium mb-4">{title}</h2>
        {children}
        <div className="mt-4 flex justify-end">
          <button type="button" className="text-primary text-sm" onClick={onClose}>
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}
