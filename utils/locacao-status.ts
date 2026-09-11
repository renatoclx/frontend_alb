import type { LocacaoStatus } from "@/types/locacao";

// Rótulos e variantes de Tag do status de locação, compartilhados entre a
// listagem de Locações e a tabela de movimentações do Dashboard.
export const locacaoStatusLabel: Record<LocacaoStatus, string> = {
  ativa: "Ativa",
  devolvida: "Devolvida",
  atrasada: "Em atraso",
};

export const locacaoStatusVariant: Record<LocacaoStatus, "info" | "success" | "error"> = {
  ativa: "info",
  devolvida: "success",
  atrasada: "error",
};

export const locacaoStatusFilterOptions = [
  { value: "todos", label: "Todos os status" },
  { value: "ativa", label: locacaoStatusLabel.ativa },
  { value: "devolvida", label: locacaoStatusLabel.devolvida },
  { value: "atrasada", label: locacaoStatusLabel.atrasada },
];
