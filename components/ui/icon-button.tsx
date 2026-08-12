import { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/utils/cn";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  label: string;
  variant?: "default" | "danger";
  href?: string;
}

export function IconButton({ icon, label, variant = "default", className, href, ...props }: IconButtonProps) {
  const classes = cn(
    "inline-flex size-8 items-center justify-center rounded-lg text-foreground/60 transition-colors hover:bg-foreground/10 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-foreground/60",
    variant === "danger" && "hover:bg-error/10 hover:text-error",
    className
  );

  if (href) {
    return (
      <Link href={href} aria-label={label} title={label} className={classes}>
        {icon}
      </Link>
    );
  }

  return (
    <button type="button" aria-label={label} title={label} className={classes} {...props}>
      {icon}
    </button>
  );
}
