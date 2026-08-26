import { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";

const tagVariants = cva("inline-flex items-center justify-center rounded-full font-bold uppercase tracking-wide", {
  variants: {
    variant: {
      success: "bg-success/15 text-success",
      error: "bg-error/15 text-error",
      warning: "bg-warning/15 text-warning",
      info: "bg-info/15 text-info",
    },
    size: {
      lg: "h-10 px-6 text-base",
      md: "h-9 px-3 text-sm",
      sm: "h-6 px-3 text-xs",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

interface TagProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof tagVariants> {
  variant: NonNullable<VariantProps<typeof tagVariants>["variant"]>;
}

export function Tag({ variant, size, className, ...props }: TagProps) {
  return <span className={cn(tagVariants({ variant, size }), className)} {...props} />;
}
