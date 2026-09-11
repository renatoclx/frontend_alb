import type { LocacaoStatus } from "@/types/locacao";

export interface DashboardMetrics {
  receitaMes: number;
  locacoesAtivas: number;
  vendasMes: number;
  clientesAtivos: number;
}

export interface RevenuePoint {
  data: string; // YYYY-MM-DD
  locacoes: number;
  vendas: number;
  total: number;
}

export type MovimentacaoTipo = "locacao" | "venda";
// Vendas não têm status — usam "concluida".
export type MovimentacaoStatus = LocacaoStatus | "concluida";

export interface Movimentacao {
  id: string;
  tipo: MovimentacaoTipo;
  cliente: string;
  valor: number;
  data: string;
  status: MovimentacaoStatus;
}

export interface ProximaDevolucao {
  id: string;
  cliente: string;
  dataPrevista: string;
  status: LocacaoStatus;
  diasAtraso: number;
}
