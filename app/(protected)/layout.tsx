"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { useAuth } from "@/hooks/use-auth";
import { useHasMounted } from "@/hooks/use-has-mounted";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  // Em um reload completo, a primeira renderização no cliente ainda usa o
  // valor do servidor (usuário nulo) até o React confirmar o valor real do
  // localStorage. "hasMounted" evita agir (redirecionar) nesse instante
  // transitório, que faria a guarda mandar erroneamente para /login mesmo
  // com sessão válida.
  const hasMounted = useHasMounted();

  useEffect(() => {
    if (hasMounted && !isAuthenticated) {
      router.replace("/login");
    }
  }, [hasMounted, isAuthenticated, router]);

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  if (!hasMounted || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-foreground/60">
        Carregando...
      </div>
    );
  }

  return (
    <DashboardShell user={user} onLogout={handleLogout}>
      {children}
    </DashboardShell>
  );
}
