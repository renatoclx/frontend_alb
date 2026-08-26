"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/utils/cn";

type TabsSize = "default" | "sm";
type TabsAlign = "left" | "center";

interface TabItem {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  size?: TabsSize;
  align?: TabsAlign;
  bordered?: boolean;
  className?: string;
}

const sizeClasses: Record<TabsSize, string> = {
  default: "h-[42px] text-sm",
  sm: "h-[38px] text-xs",
};

export function Tabs({
  tabs,
  activeTab,
  onChange,
  size = "default",
  align = "left",
  bordered = false,
  className,
}: TabsProps) {
  return (
    <TabsPrimitive.Root value={activeTab} onValueChange={onChange}>
      <TabsPrimitive.List
        className={cn(
          "flex items-center gap-8",
          align === "center" && "justify-center",
          bordered && "border-b border-foreground/10",
          className
        )}
      >
        {tabs.map((tab) => (
          <TabsPrimitive.Trigger
            key={tab.id}
            value={tab.id}
            className={cn(
              "group relative flex items-center font-medium text-foreground/60 transition-colors hover:text-foreground focus-visible:outline-none data-[state=active]:text-primary",
              sizeClasses[size]
            )}
          >
            {tab.label}
            <span className="absolute inset-x-0 -bottom-px h-0.5 scale-x-0 rounded-full bg-primary transition-transform group-data-[state=active]:scale-x-100" />
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>
    </TabsPrimitive.Root>
  );
}
