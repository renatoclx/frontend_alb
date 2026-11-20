import { Eye } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";
import { Table } from "@/components/ui/table";
import { Tag } from "@/components/ui/tag";
import type { Movimentacao, MovimentacaoStatus } from "@/types/dashboard";
import { formatDate } from "@/utils/date";
import { locacaoStatusLabel, locacaoStatusVariant, type LocacaoStatusVariant } from "@/utils/locacao-status";
import { formatMoney } from "@/utils/mask";

interface RecentMovementsTableProps {
  data: Movimentacao[];
  onView: (movimentacao: Movimentacao) => void;
}

// Estende os mapas de status de locação com a chave "concluida" (vendas).
const statusLabel: Record<MovimentacaoStatus, string> = {
  ...locacaoStatusLabel,
  concluida: "Concluída",
};

const statusVariant: Record<MovimentacaoStatus, LocacaoStatusVariant> = {
  ...locacaoStatusVariant,
  concluida: "success",
};

export function RecentMovementsTable({ data, onView }: RecentMovementsTableProps) {
  return (
    <Table
      columns={[
        {
          key: "tipo",
          header: "Tipo",
          render: (movimentacao) => (
            <Tag variant={movimentacao.tipo === "venda" ? "info" : "warning"} size="sm">
              {movimentacao.tipo === "venda" ? "Venda" : "Locação"}
            </Tag>
          ),
        },
        { key: "cliente", header: "Cliente", render: (movimentacao) => movimentacao.cliente },
        { key: "valor", header: "Valor", render: (movimentacao) => formatMoney(movimentacao.valor) },
        { key: "data", header: "Data", render: (movimentacao) => formatDate(movimentacao.data) },
        {
          key: "status",
          header: "Status",
          render: (movimentacao) => (
            <Tag variant={statusVariant[movimentacao.status]} size="sm">
              {statusLabel[movimentacao.status]}
            </Tag>
          ),
        },
        {
          key: "acao",
          header: "Ação",
          render: (movimentacao) => (
            <IconButton
              icon={<Eye className="size-4" />}
              label={movimentacao.tipo === "venda" ? "Visualizar venda" : "Visualizar locação"}
              onClick={() => onView(movimentacao)}
            />
          ),
        },
      ]}
      data={data}
      getRowKey={(movimentacao) => `${movimentacao.tipo}-${movimentacao.id}`}
      emptyMessage="Nenhuma movimentação recente."
    />
  );
}
