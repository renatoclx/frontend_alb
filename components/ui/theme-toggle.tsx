"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/utils/cn";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
      onClick={toggleTheme}
      className="relative inline-flex h-7 w-14 shrink-0 items-center justify-between rounded-full border border-foreground/15 bg-foreground/5 px-1.5 transition-colors"
    >
      <Sun className="size-3.5 text-warning" />
      <Moon className="size-3.5 text-foreground/40" />
      <span
        className={cn(
          "absolute left-1 size-5 rounded-full bg-background shadow-sm transition-transform",
          isDark && "translate-x-7"
        )}
      />
    </button>
  );
}
