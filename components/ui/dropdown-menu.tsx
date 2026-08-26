"use client";

import { ReactNode } from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { cn } from "@/utils/cn";

interface DropdownMenuItem {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

interface DropdownMenuProps {
  trigger: ReactNode;
  items: DropdownMenuItem[];
  align?: "start" | "end";
}

export function DropdownMenu({ trigger, items, align = "end" }: DropdownMenuProps) {
  return (
    <DropdownMenuPrimitive.Root>
      <DropdownMenuPrimitive.Trigger asChild>{trigger}</DropdownMenuPrimitive.Trigger>
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          align={align}
          sideOffset={4}
          className="z-50 min-w-40 rounded-sm border border-foreground/10 bg-surface py-1 shadow-sm"
        >
          {items.map((item) => (
            <DropdownMenuPrimitive.Item
              key={item.label}
              disabled={item.disabled}
              onSelect={item.onClick}
              className={cn(
                "flex items-center gap-2 px-3 py-2 text-left text-sm text-foreground/80 outline-none transition-colors data-[highlighted]:bg-foreground/5 data-[highlighted]:text-foreground",
                "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40"
              )}
            >
              {item.icon}
              {item.label}
            </DropdownMenuPrimitive.Item>
          ))}
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
}
