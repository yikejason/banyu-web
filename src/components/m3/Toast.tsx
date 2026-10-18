"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type ToastFn = (message: string) => void;

const ToastContext = createContext<ToastFn | null>(null);

export function useToast(): ToastFn {
  const toast = useContext(ToastContext);
  if (!toast) throw new Error("useToast must be used within <ToastProvider>");
  return toast;
}

let nextId = 0;
const AUTO_DISMISS_MS = 2600;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<{ id: number; message: string }[]>([]);
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());

  const toast = useCallback((message: string) => {
    const id = nextId++;
    setToasts((list) => [...list, { id, message }]);
    const timer = setTimeout(() => {
      setToasts((list) => list.filter((item) => item.id !== id));
      timers.current.delete(timer);
    }, AUTO_DISMISS_MS);
    timers.current.add(timer);
  }, []);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 top-4 z-[70] flex flex-col items-center gap-2 px-4"
      >
        {toasts.map((item) => (
          <div
            key={item.id}
            role="status"
            className="m3-toast rounded-full px-5 py-2.5 text-sm"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden
              className="h-4 w-4 shrink-0 text-[#ffe9b8] drop-shadow-[0_0_6px_rgba(255,224,150,0.9)]"
            >
              <path
                d="M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z"
                fill="currentColor"
              />
            </svg>
            {item.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
