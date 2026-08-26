"use client";

import { forwardRef, useId } from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cn } from "@/utils/cn";

const itemClasses =
  "peer relative inline-flex size-4.5 shrink-0 items-center justify-center rounded-full border border-foreground/25 bg-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed data-[state=checked]:border-[5px] data-[state=checked]:border-primary";

interface RadioProps {
  label?: string;
  checked?: boolean;
  disabled?: boolean;
  name?: string;
  value?: string;
  onChange?: (checked: boolean) => void;
  className?: string;
}

// Radio isolado (fora de um RadioGroup) — usa seu próprio Root de um item só.
export const Radio = forwardRef<HTMLButtonElement, RadioProps>(
  ({ label, checked, disabled, name, value = "on", onChange, className }, ref) => {
    const generatedId = useId();

    return (
      <label
        htmlFor={generatedId}
        className={cn(
          "inline-flex items-center gap-2 text-sm text-foreground",
          disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
          className
        )}
      >
        <RadioGroupPrimitive.Root
          value={checked ? value : ""}
          name={name}
          disabled={disabled}
          onValueChange={(next) => onChange?.(next === value)}
        >
          <RadioGroupPrimitive.Item ref={ref} id={generatedId} value={value} className={itemClasses} />
        </RadioGroupPrimitive.Root>
        {label && <span>{label}</span>}
      </label>
    );
  }
);

Radio.displayName = "Radio";

interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface RadioGroupProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  className?: string;
  optionsWrapperClassName?: string;
}

export function RadioGroup({
  name,
  value,
  onChange,
  options,
  className,
  optionsWrapperClassName,
}: RadioGroupProps) {
  return (
    <RadioGroupPrimitive.Root
      value={value}
      name={name}
      onValueChange={onChange}
      className={cn("flex flex-col gap-2", className)}
    >
      <div className={cn("flex flex-col gap-2", optionsWrapperClassName)}>
        {options.map((option) => (
          <label
            key={option.value}
            className={cn(
              "inline-flex items-center gap-2 text-sm text-foreground",
              option.disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
            )}
          >
            <RadioGroupPrimitive.Item value={option.value} disabled={option.disabled} className={itemClasses} />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </RadioGroupPrimitive.Root>
  );
}

export type { RadioOption };
