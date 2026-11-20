import type { LocacaoStatus } from "@/types/locacao";

// Rótulos e variantes de Tag do status de locação, compartilhados entre a
// listagem de Locações e a tabela de movimentações do Dashboard.
export const locacaoStatusLabel: Record<LocacaoStatus, string> = {
  ativa: "Ativa",
  devolvida: "Devolvida",
  atrasada: "Em atraso",
  devolucao_parcial: "Devolução parcial",
};

export type LocacaoStatusVariant = "info" | "success" | "error" | "warning";

export const locacaoStatusVariant: Record<LocacaoStatus, LocacaoStatusVariant> = {
  ativa: "info",
  devolvida: "success",
  atrasada: "error",
  devolucao_parcial: "warning",
};

export const locacaoStatusFilterOptions = [
  { value: "todos", label: "Todos os status" },
  { value: "ativa", label: locacaoStatusLabel.ativa },
  { value: "devolucao_parcial", label: locacaoStatusLabel.devolucao_parcial },
  { value: "devolvida", label: locacaoStatusLabel.devolvida },
  { value: "atrasada", label: locacaoStatusLabel.atrasada },
];
