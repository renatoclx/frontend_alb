"use client";

import { useEffect, useState } from "react";
import { CalendarClock, DollarSign, ShoppingCart, Users } from "lucide-react";
import { ButtonGroup } from "@/components/ui/button-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { RecentMovementsTable } from "@/components/dashboard/recent-movements-table";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { UpcomingReturnsCard } from "@/components/dashboard/upcoming-returns-card";
import { useToast } from "@/hooks/use-toast";
import {
  getDashboardMetrics,
  getDashboardRevenue,
  getRecentMovements,
  getUpcomingReturns,
  type RevenuePeriodDays,
} from "@/services/dashboard-service";
import type {
  DashboardMetrics,
  Movimentacao,
  ProximaDevolucao,
  RevenuePoint,
} from "@/types/dashboard";
import { formatMoney } from "@/utils/mask";

const revenuePeriodOptions: { value: string; label: string }[] = [
  { value: "7", label: "7d" },
  { value: "30", label: "30d" },
  { value: "90", label: "90d" },
];

export default function DashboardPage() {
  const { notify } = useToast();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [revenue, setRevenue] = useState<RevenuePoint[] | null>(null);
  const [revenueDays, setRevenueDays] = useState<RevenuePeriodDays>(30);
  const [movements, setMovements] = useState<Movimentacao[] | null>(null);
  const [returns, setReturns] = useState<ProximaDevolucao[] | null>(null);

  function handleRevenuePeriodChange(days: RevenuePeriodDays) {
    setRevenueDays(days);
    setRevenue(null);
    getDashboardRevenue(days)
      .then(setRevenue)
      .catch(() => notify("error", "Não foi possível carregar o gráfico de receita."));
  }

  useEffect(() => {
    // Cada seção carrega de forma independente — uma falha não derruba as outras.
    getDashboardMetrics()
      .then(setMetrics)
      .catch(() => notify("error", "Não foi possível carregar os indicadores."));
    getDashboardRevenue(30)
      .then(setRevenue)
      .catch(() => notify("error", "Não foi possível carregar o gráfico de receita."));
    getRecentMovements()
      .then(setMovements)
      .catch(() => notify("error", "Não foi possível carregar as movimentações."));
    getUpcomingReturns()
      .then(setReturns)
      .catch(() => notify("error", "Não foi possível carregar as devoluções."));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>

      {/* Cards: 1 coluna no mobile, 2 no tablet, 4 no desktop (docs/dashboard-layout.md) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics ? (
          <>
            <DashboardCard
              icon={<DollarSign className="size-5" />}
              title="Receita do mês"
              value={formatMoney(metrics.receitaMes)}
              hint="Locações + vendas do mês atual"
            />
            <DashboardCard
              icon={<CalendarClock className="size-5" />}
              title="Locações ativas"
              value={String(metrics.locacoesAtivas)}
              hint="Contratos em andamento"
            />
            <DashboardCard
              icon={<ShoppingCart className="size-5" />}
              title="Vendas do mês"
              value={String(metrics.vendasMes)}
              hint="Vendas realizadas no mês atual"
            />
            <DashboardCard
              icon={<Users className="size-5" />}
              title="Clientes ativos"
              value={String(metrics.clientesAtivos)}
              hint="Com locação ativa ou compra no mês"
            />
          </>
        ) : (
          Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-32 w-full" />
          ))
        )}
      </div>

      <Card className="w-full">
        <CardHeader className="flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Receita</CardTitle>
          <ButtonGroup
            options={revenuePeriodOptions}
            value={String(revenueDays)}
            onChange={(value) => handleRevenuePeriodChange(Number(value) as RevenuePeriodDays)}
          />
        </CardHeader>
        <CardContent className="pt-0">
          {revenue ? <RevenueChart data={revenue} /> : <Skeleton className="h-72 w-full" />}
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Últimas movimentações</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {movements ? (
            <RecentMovementsTable data={movements} />
          ) : (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-11 w-full" />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Próximas devoluções</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {returns ? (
            <UpcomingReturnsCard data={returns} />
          ) : (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-12 w-full" />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
