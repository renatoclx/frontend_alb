"use client";

import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "@/utils/cn";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  showText?: boolean;
  disabled?: boolean;
  className?: string;
}

// Trilho de 20px de altura com 2px de inset pro thumb — medidas exatas da
// imagem de referência.
export function Switch({ checked, onChange, label, showText, disabled, className }: SwitchProps) {
  return (
    <label
      className={cn(
        "inline-flex items-center gap-2 text-sm text-foreground",
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
        className
      )}
    >
      <SwitchPrimitive.Root
        checked={checked}
        onCheckedChange={onChange}
        disabled={disabled}
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
          checked ? "bg-primary" : "bg-foreground/20"
        )}
      >
        {showText && (
          <span
            className={cn(
              "pointer-events-none absolute text-[9px] font-semibold uppercase text-primary-foreground",
              checked ? "left-1.5" : "right-1.5 text-foreground/50"
            )}
          >
            {checked ? "On" : "Off"}
          </span>
        )}
        <SwitchPrimitive.Thumb
          className={cn(
            "inline-block size-4 translate-x-0.5 rounded-full bg-background shadow-sm transition-transform",
            checked && "translate-x-[18px]"
          )}
        />
      </SwitchPrimitive.Root>
      {label && <span>{label}</span>}
    </label>
  );
}
