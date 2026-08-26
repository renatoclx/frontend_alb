"use client";

import { forwardRef, useId } from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";
import { cn } from "@/utils/cn";

interface CheckboxProps {
  label?: string;
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  value?: string;
  onChange?: (checked: boolean) => void;
  className?: string;
}

export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ label, checked, indeterminate, disabled, required, name, value, onChange, className }, ref) => {
    const generatedId = useId();
    const isFilled = checked || indeterminate;

    return (
      <label
        htmlFor={generatedId}
        className={cn(
          "inline-flex items-center gap-2 text-sm text-foreground",
          disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
          className
        )}
      >
        <CheckboxPrimitive.Root
          ref={ref}
          id={generatedId}
          checked={indeterminate && !checked ? "indeterminate" : checked}
          disabled={disabled}
          required={required}
          name={name}
          value={value}
          onCheckedChange={(state) => onChange?.(state === true)}
          className={cn(
            "relative inline-flex size-4.5 shrink-0 items-center justify-center rounded-sm border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed",
            isFilled ? "border-primary bg-primary" : "border-foreground/25 bg-background"
          )}
        >
          <CheckboxPrimitive.Indicator className="flex items-center justify-center text-primary-foreground">
            {!checked && indeterminate ? <Minus className="size-3" /> : <Check className="size-3" />}
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
        {label && <span>{label}</span>}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";
