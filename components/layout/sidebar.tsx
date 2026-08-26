"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarRange, LayoutDashboard, Package, Tags, Users, X } from "lucide-react";
import { cn } from "@/utils/cn";

interface SidebarProps {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/clientes", label: "Clientes", icon: Users },
  { href: "/categorias", label: "Categorias", icon: Tags },
  { href: "/produtos", label: "Produtos", icon: Package },
  { href: "/locacoes", label: "Locações", icon: CalendarRange },
];

export function Sidebar({ isCollapsed, isMobileOpen, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 flex-col border-r border-foreground/10 bg-sidebar-background transition-[transform,width] duration-300 ease-in-out lg:static lg:flex lg:translate-x-0",
          isCollapsed ? "lg:w-18" : "lg:w-64",
          isMobileOpen ? "flex translate-x-0" : "hidden -translate-x-full lg:flex"
        )}
      >
        <div className="flex h-14 items-center justify-between px-4 lg:hidden">
          <span className="text-sm font-semibold">Menu</span>
          <button onClick={onCloseMobile} aria-label="Fechar menu">
            <X className="size-5" />
          </button>
        </div>
        <nav className="flex flex-col gap-1 p-3">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                onClick={onCloseMobile}
                className={cn(
                  "flex items-center gap-3 rounded-sm px-3 py-2 font-heading text-sm font-bold transition-colors",
                  isCollapsed && "lg:justify-center",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/70 hover:bg-foreground/5 hover:text-foreground"
                )}
              >
                <Icon className="size-5 shrink-0" />
                <span className={cn(isCollapsed && "lg:hidden")}>{label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
