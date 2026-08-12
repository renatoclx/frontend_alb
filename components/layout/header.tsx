"use client";

import { LogOut, Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import type { User } from "@/types/auth";

interface HeaderProps {
  user: User;
  isSidebarCollapsed: boolean;
  onToggleSidebarCollapse: () => void;
  onOpenMobileSidebar: () => void;
  onLogout: () => void;
}

export function Header({
  user,
  isSidebarCollapsed,
  onToggleSidebarCollapse,
  onOpenMobileSidebar,
  onLogout,
}: HeaderProps) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-foreground/10 bg-background px-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="text-foreground/70 hover:text-foreground lg:hidden"
          aria-label="Abrir menu"
        >
          <Menu className="size-5" />
        </button>
        <button
          onClick={onToggleSidebarCollapse}
          className="hidden text-foreground/70 hover:text-foreground lg:block"
          aria-label="Recolher menu"
        >
          {isSidebarCollapsed ? (
            <PanelLeftOpen className="size-5" />
          ) : (
            <PanelLeftClose className="size-5" />
          )}
        </button>
        <span className="text-sm font-semibold">ALB Locações</span>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <span className="hidden text-sm text-foreground/70 sm:inline">
          {user.name}
        </span>
        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 text-sm text-foreground/70 hover:text-error"
          aria-label="Sair"
        >
          <LogOut className="size-4" />
          <span className="hidden sm:inline">Sair</span>
        </button>
      </div>
    </header>
  );
}
