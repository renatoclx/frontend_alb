import { InputHTMLAttributes, ReactNode, forwardRef, useId } from "react";
import { X } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";

// Mesma escala de tamanho do Button/Tag. O `lg` mantém text-sm (não
// text-base) por decisão já tomada no Button — o Figma indica text-base,
// mas o tamanho anterior ficou melhor visualmente e evita mudar a aparência
// dos formulários já existentes.
const inputVariants = cva(
  "w-full rounded-sm border border-foreground/15 bg-background px-3 placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50",
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

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  label: string;
  error?: string;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  clearable?: boolean;
  onClear?: () => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      size,
      startAdornment,
      endAdornment,
      clearable,
      onClear,
      id,
      className,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const showClear = clearable && !endAdornment && Boolean(props.value) && !!onClear;

    return (
      <div className="flex flex-col gap-2">
        <label htmlFor={inputId} className="text-sm font-medium text-foreground">
          {label}
          {props.required && <span className="text-error"> *</span>}
        </label>
        <div className="relative">
          {startAdornment && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-foreground/40">
              {startAdornment}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              inputVariants({ size }),
              Boolean(startAdornment) && "pl-9",
              (Boolean(endAdornment) || showClear) && "pr-9",
              error && "border-error focus:ring-error/50",
              className
            )}
            {...props}
          />
          {endAdornment && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">{endAdornment}</div>
          )}
          {showClear && (
            <button
              type="button"
              onClick={onClear}
              aria-label="Limpar campo"
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-foreground/40 hover:text-foreground/70"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
        {error && <span className="text-xs text-error">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";
