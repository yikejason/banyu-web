"use client";

export function TextField({
  label,
  value,
  onChange,
  textarea,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  textarea?: boolean;
  type?: string;
}) {
  const id = label;
  const cls =
    "w-full rounded-md border border-outline bg-transparent px-3 py-3 text-on-surface outline-none focus:border-primary";
  return (
    <label className="flex flex-col gap-2 text-sm text-on-surface-variant">
      {label}
      {textarea ? (
        <textarea
          id={id}
          aria-label={label}
          className={`${cls} min-h-40`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          id={id}
          aria-label={label}
          type={type}
          className={cls}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </label>
  );
}
