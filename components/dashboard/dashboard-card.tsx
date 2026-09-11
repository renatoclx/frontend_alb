import { ReactNode } from "react";
import { Card } from "@/components/ui/card";

interface DashboardCardProps {
  icon: ReactNode;
  title: string;
  value: string;
  hint?: string;
}

export function DashboardCard({ icon, title, value, hint }: DashboardCardProps) {
  return (
    <Card className="flex flex-col gap-3 p-5">
      <div className="flex items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-lg bg-foreground/5 text-foreground/70">
          {icon}
        </span>
        <p className="text-sm font-medium text-foreground/60">{title}</p>
      </div>
      <p className="text-2xl font-semibold text-foreground">{value}</p>
      {hint && <p className="text-xs text-foreground/50">{hint}</p>}
    </Card>
  );
}
