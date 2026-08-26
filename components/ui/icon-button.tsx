import { ButtonHTMLAttributes, ReactNode, forwardRef } from "react";
import Link from "next/link";
import { cn } from "@/utils/cn";

type IconButtonVariant = "default" | "primary" | "secondary" | "warning" | "danger";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  label: string;
  variant?: IconButtonVariant;
  href?: string;
}

const variantClasses: Record<IconButtonVariant, string> = {
  default:
    "border-transparent text-foreground/60 hover:bg-foreground/10 active:bg-foreground/20 hover:text-foreground",
  primary: "border-primary/40 text-primary hover:bg-primary/10 active:bg-primary/20",
  secondary: "border-secondary/40 text-secondary hover:bg-secondary/10 active:bg-secondary/20",
  warning: "border-warning/40 text-warning hover:bg-warning/10 active:bg-warning/20",
  danger: "border-error/40 text-error hover:bg-error/10 active:bg-error/20",
};

// forwardRef: necessário pro Radix (DropdownMenu/Tooltip etc.) conseguir
// ancorar o overlay quando um IconButton é usado como trigger.
export const IconButton = forwardRef<HTMLButtonElement | HTMLAnchorElement, IconButtonProps>(
  ({ icon, label, variant = "default", className, href, ...props }, ref) => {
    const classes = cn(
      "inline-flex size-8 items-center justify-center rounded-full border transition-colors disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent",
      variantClasses[variant],
      className
    );

    if (href) {
      return (
        <Link href={href} ref={ref as never} aria-label={label} title={label} className={classes}>
          {icon}
        </Link>
      );
    }

    return (
      <button
        ref={ref as never}
        type="button"
        aria-label={label}
        title={label}
        className={classes}
        {...props}
      >
        {icon}
      </button>
    );
  }
);

IconButton.displayName = "IconButton";
