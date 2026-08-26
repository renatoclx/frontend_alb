"use client";

import { cn } from "@/utils/cn";

interface ButtonGroupOption<T extends string> {
  value: T;
  label: string;
}

interface ButtonGroupProps<T extends string> {
  label?: string;
  options: ButtonGroupOption<T>[];
  value: T;
  onChange: (value: T) => void;
  required?: boolean;
  className?: string;
}

export function ButtonGroup<T extends string>({
  label,
  options,
  value,
  onChange,
  required,
  className,
}: ButtonGroupProps<T>) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <span className="text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-error"> *</span>}
        </span>
      )}
      <div role="radiogroup" className="inline-flex h-12 rounded-sm border border-border p-1">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={option.value === value}
            onClick={() => onChange(option.value)}
            className={cn(
              "flex-1 rounded-sm px-4 text-sm font-medium transition-colors",
              option.value === value
                ? "bg-primary text-primary-foreground"
                : "text-foreground/60 hover:text-foreground"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
