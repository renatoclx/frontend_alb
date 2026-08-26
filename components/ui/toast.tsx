"use client";

import { createContext, ReactNode, useCallback, useMemo } from "react";
import { Toaster, toast } from "sonner";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

export type ToastVariant = "success" | "error" | "warning";

interface ToastContextValue {
  notify: (variant: ToastVariant, message: string) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

// Tema do sonner via CSS variables (API oficial da lib) em vez de recriar a
// estrutura interna com `unstyled` — evita brigar com o posicionamento que o
// próprio componente já resolve (ícone, título e botão de fechar alinhados).
const toastThemeVars = {
  "--normal-bg": "var(--background)",
  "--normal-border": "var(--border)",
  "--normal-text": "var(--foreground)",
  "--success-bg": "var(--background)",
  "--success-border": "var(--success)",
  "--success-text": "var(--success)",
  "--error-bg": "var(--background)",
  "--error-border": "var(--error)",
  "--error-text": "var(--error)",
  "--warning-bg": "var(--background)",
  "--warning-border": "var(--warning)",
  "--warning-text": "var(--warning)",
  "--border-radius": "var(--radius-md)",
} as React.CSSProperties;

export function ToastProvider({ children }: { children: ReactNode }) {
  const notify = useCallback((variant: ToastVariant, message: string) => {
    toast[variant](message);
  }, []);

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toaster
        position="top-right"
        duration={4000}
        closeButton
        style={toastThemeVars}
        icons={{
          success: <CheckCircle2 className="size-4" />,
          error: <XCircle className="size-4" />,
          warning: <AlertTriangle className="size-4" />,
        }}
        toastOptions={{
          classNames: {
            toast: "shadow-sm text-sm",
          },
        }}
      />
    </ToastContext.Provider>
  );
}
