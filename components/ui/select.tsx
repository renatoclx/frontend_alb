"use client";

import { useId } from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

// Mesma escala de tamanho do Input/Button.
const triggerVariants = cva(
  "flex w-full items-center justify-between rounded-sm border border-foreground/15 bg-background px-3 text-left focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50 data-[placeholder]:text-foreground/40",
  {
    variants: {
      size: {
        // `xl` (48px) é a altura padrão de campo em formulários (docs/forms.md).
        xl: "h-12 text-sm",
        lg: "h-10 text-sm",
        md: "h-9 text-sm",
        sm: "h-6 text-xs",
      },
    },
    defaultVariants: {
      size: "lg",
    },
  }
);

interface SelectProps extends VariantProps<typeof triggerVariants> {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export function Select({
  label,
  value,
  onChange,
  options,
  placeholder,
  error,
  size,
  disabled,
  required,
  className,
}: SelectProps) {
  const inputId = useId();

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label id={`${inputId}-label`} className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-error"> *</span>}
      </label>
      <SelectPrimitive.Root value={value} onValueChange={onChange} disabled={disabled}>
        <SelectPrimitive.Trigger
          id={inputId}
          aria-labelledby={`${inputId}-label`}
          className={cn(triggerVariants({ size }), error && "border-error focus:ring-error/50")}
        >
          <SelectPrimitive.Value placeholder={placeholder ?? "Selecione..."} className="truncate" />
          <SelectPrimitive.Icon asChild>
            <ChevronDown className="size-4 shrink-0 text-foreground/50" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            position="popper"
            sideOffset={4}
            // Largura mínima = 2x a altura do campo, regra explícita da
            // imagem de referência.
            style={{ minWidth: "calc(var(--radix-select-trigger-height) * 2)" }}
            className="z-50 max-h-56 w-[var(--radix-select-trigger-width)] overflow-y-auto rounded-sm border border-foreground/10 bg-surface py-1 shadow-sm"
          >
            <SelectPrimitive.Viewport>
              {options.map((option) => (
                <SelectPrimitive.Item
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  className="flex w-full cursor-pointer items-center justify-between px-3 py-2 text-left text-sm text-foreground transition-colors outline-none data-[highlighted]:bg-foreground/5 data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40"
                >
                  <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                  <SelectPrimitive.ItemIndicator>
                    <Check className="size-4" />
                  </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
      {error && <span className="text-xs text-error">{error}</span>}
    </div>
  );
}
