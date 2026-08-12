"use client";

import { ReactNode, useState } from "react";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import type { User } from "@/types/auth";

interface DashboardShellProps {
  user: User;
  onLogout: () => void;
  children: ReactNode;
}

export function DashboardShell({ user, onLogout, children }: DashboardShellProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar
        isCollapsed={isCollapsed}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          user={user}
          isSidebarCollapsed={isCollapsed}
          onToggleSidebarCollapse={() => setIsCollapsed((prev) => !prev)}
          onOpenMobileSidebar={() => setIsMobileOpen(true)}
          onLogout={onLogout}
        />
        <main className="min-w-0 flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
