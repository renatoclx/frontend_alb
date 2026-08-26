import { HTMLAttributes } from "react";
import { cn } from "@/utils/cn";

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-sm bg-foreground/10", className)}
      {...props}
    />
  );
}
