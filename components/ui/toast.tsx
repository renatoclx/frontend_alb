"use client";

import { createContext, ReactNode, useCallback, useState } from "react";
import { CheckCircle2, AlertTriangle, XCircle, X } from "lucide-react";
import { cn } from "@/utils/cn";

export type ToastVariant = "success" | "error" | "warning";

interface ToastItem {
  id: string;
  variant: ToastVariant;
  message: string;
}

interface ToastContextValue {
  notify: (variant: ToastVariant, message: string) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

const variantConfig: Record<ToastVariant, { icon: typeof CheckCircle2; className: string }> = {
  success: { icon: CheckCircle2, className: "border-success/30 text-success" },
  error: { icon: XCircle, className: "border-error/30 text-error" },
  warning: { icon: AlertTriangle, className: "border-warning/30 text-warning" },
};

function ToastCard({ variant, message, onDismiss }: ToastItem & { onDismiss: () => void }) {
  const { icon: Icon, className } = variantConfig[variant];

  return (
    <div
      className={cn(
        "flex w-full max-w-sm items-start gap-3 rounded-lg border bg-background px-4 py-3 text-sm text-foreground shadow-sm",
        className
      )}
      role="status"
    >
      <Icon className="mt-0.5 size-4 shrink-0" />
      <p className="flex-1">{message}</p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Fechar notificação"
        className="text-foreground/40 transition-colors hover:text-foreground"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const notify = useCallback(
    (variant: ToastVariant, message: string) => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { id, variant, message }]);
      setTimeout(() => dismiss(id), 4000);
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <div className="fixed inset-x-0 bottom-4 z-[100] flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:bottom-auto sm:right-4 sm:top-4 sm:items-end">
        {toasts.map((toast) => (
          <ToastCard key={toast.id} {...toast} onDismiss={() => dismiss(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
