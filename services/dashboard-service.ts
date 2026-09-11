import { getAccessToken } from "@/utils/auth-storage";
import { apiClient } from "@/utils/api-client";
import type { LocacaoStatus } from "@/types/locacao";
import type {
  DashboardMetrics,
  Movimentacao,
  MovimentacaoStatus,
  ProximaDevolucao,
  RevenuePoint,
} from "@/types/dashboard";

interface MetricsApiModel {
  monthRevenue: number;
  activeRentals: number;
  monthSales: number;
  activeClients: number;
}

interface RevenuePointApiModel {
  date: string;
  rentals: number;
  sales: number;
  total: number;
}

interface MovementApiModel {
  id: string;
  type: "RENTAL" | "SALE";
  client: string;
  total: number;
  date: string;
  status: "ACTIVE" | "RETURNED" | "DELAY" | "CONCLUDED";
}

interface UpcomingReturnApiModel {
  id: string;
  client: string;
  expectedReturnDate: string;
  status: "ACTIVE" | "RETURNED" | "DELAY";
  daysOverdue: number;
}

const rentalStatusFromApi: Record<"ACTIVE" | "RETURNED" | "DELAY", LocacaoStatus> = {
  ACTIVE: "ativa",
  RETURNED: "devolvida",
  DELAY: "atrasada",
};

const movementStatusFromApi: Record<MovementApiModel["status"], MovimentacaoStatus> = {
  ...rentalStatusFromApi,
  CONCLUDED: "concluida",
};

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const data = await apiClient.get<MetricsApiModel>("/dashboard/metrics", getAccessToken());
  return {
    receitaMes: data.monthRevenue,
    locacoesAtivas: data.activeRentals,
    vendasMes: data.monthSales,
    clientesAtivos: data.activeClients,
  };
}

export type RevenuePeriodDays = 7 | 30 | 90;

export async function getDashboardRevenue(days: RevenuePeriodDays = 30): Promise<RevenuePoint[]> {
  const data = await apiClient.get<RevenuePointApiModel[]>(
    `/dashboard/revenue?days=${days}`,
    getAccessToken()
  );
  return data.map((point) => ({
    data: point.date,
    locacoes: point.rentals,
    vendas: point.sales,
    total: point.total,
  }));
}

export async function getRecentMovements(): Promise<Movimentacao[]> {
  const data = await apiClient.get<MovementApiModel[]>("/dashboard/recent-movements", getAccessToken());
  return data.map((movement) => ({
    id: movement.id,
    tipo: movement.type === "SALE" ? "venda" : "locacao",
    cliente: movement.client,
    valor: movement.total,
    data: movement.date,
    status: movementStatusFromApi[movement.status],
  }));
}

export async function getUpcomingReturns(): Promise<ProximaDevolucao[]> {
  const data = await apiClient.get<UpcomingReturnApiModel[]>(
    "/dashboard/upcoming-returns",
    getAccessToken()
  );
  return data.map((item) => ({
    id: item.id,
    cliente: item.client,
    dataPrevista: item.expectedReturnDate,
    status: rentalStatusFromApi[item.status],
    diasAtraso: item.daysOverdue,
  }));
}
