import { TextareaHTMLAttributes, forwardRef, useId } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";

// Mesma escala de tamanho do Input/Button.
const textareaVariants = cva(
  "w-full resize-y rounded-sm border border-foreground/15 bg-background px-3 py-2 placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        // `xl` = altura mínima de 120px exigida em docs/forms.md.
        xl: "min-h-[120px] text-sm",
        lg: "min-h-24 text-sm",
        md: "min-h-20 text-sm",
        sm: "min-h-16 text-xs",
      },
    },
    defaultVariants: {
      size: "lg",
    },
  }
);

interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size">,
    VariantProps<typeof textareaVariants> {
  label: string;
  error?: string;
  showCount?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, size, showCount, id, className, maxLength, value, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const currentLength = typeof value === "string" ? value.length : 0;

    return (
      <div className="flex flex-col gap-2">
        <label htmlFor={inputId} className="text-sm font-medium text-foreground">
          {label}
          {props.required && <span className="text-error"> *</span>}
        </label>
        <div className="relative">
          <textarea
            id={inputId}
            ref={ref}
            value={value}
            maxLength={maxLength}
            className={cn(
              textareaVariants({ size }),
              Boolean(showCount && maxLength) && "pb-6",
              error && "border-error focus:ring-error/50",
              className
            )}
            {...props}
          />
          {showCount && maxLength && (
            <span className="pointer-events-none absolute bottom-2 right-3 text-xs text-foreground/40">
              {currentLength}/{maxLength}
            </span>
          )}
        </div>
        {error && <span className="text-xs text-error">{error}</span>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
