import { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "link" | "danger";
type ButtonSize = "lg" | "md" | "sm";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  isLoading?: boolean;
  href?: string;
}

const sizeClasses: Record<ButtonSize, string> = {
  lg: "h-10 px-4 text-sm gap-2",
  md: "h-9 px-3 text-sm gap-1.5",
  sm: "h-6 px-2 text-xs gap-1",
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-pressed",
  secondary:
    "bg-transparent border border-foreground/20 text-foreground hover:border-primary-hover hover:text-primary-hover active:border-primary-pressed active:text-primary-pressed",
  ghost: "bg-transparent text-text-secondary hover:bg-foreground/5 active:bg-foreground/10",
  link: "bg-transparent text-primary hover:text-primary-hover active:text-primary-pressed",
  danger: "bg-error text-error-foreground hover:bg-error-hover active:bg-error-pressed",
};

export function Button({
  variant = "primary",
  size = "lg",
  icon,
  isLoading = false,
  disabled,
  className,
  children,
  href,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
    sizeClasses[size],
    variantClasses[variant],
    className
  );

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
