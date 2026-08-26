import { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-pressed",
        secondary:
          "bg-transparent border border-foreground/20 text-foreground hover:border-primary-hover hover:text-primary-hover active:border-primary-pressed active:text-primary-pressed",
        ghost: "bg-transparent text-text-secondary hover:bg-foreground/5 active:bg-foreground/10",
        link: "bg-transparent text-primary hover:text-primary-hover active:text-primary-pressed",
        danger: "bg-error text-error-foreground hover:bg-error-hover active:bg-error-pressed",
      },
      size: {
        // `xl` (48px) existe especificamente pra bater com a altura padrão dos
        // campos de formulário (docs/forms.md) — não é o tamanho padrão do
        // Button fora desse contexto.
        xl: "h-12 px-4 text-sm gap-2",
        lg: "h-10 px-4 text-sm gap-2",
        md: "h-9 px-3 text-sm gap-1.5",
        sm: "h-6 px-2 text-xs gap-1",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "lg",
    },
  }
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  icon?: ReactNode;
  isLoading?: boolean;
  href?: string;
}

export function Button({
  variant,
  size,
  icon,
  isLoading = false,
  disabled,
  className,
  children,
  href,
  ...props
}: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size }), className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        {icon}
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} disabled={disabled || isLoading} {...props}>
      {isLoading ? <Loader2 className="size-4 animate-spin" /> : icon}
      {children}
    </button>
  );
}
