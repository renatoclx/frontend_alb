import { Table } from "@/components/ui/table";
import { Tag } from "@/components/ui/tag";
import type { Movimentacao, MovimentacaoStatus } from "@/types/dashboard";
import { formatDate } from "@/utils/date";
import { locacaoStatusLabel, locacaoStatusVariant } from "@/utils/locacao-status";
import { formatMoney } from "@/utils/mask";

interface RecentMovementsTableProps {
  data: Movimentacao[];
}

// Estende os mapas de status de locação com a chave "concluida" (vendas).
const statusLabel: Record<MovimentacaoStatus, string> = {
  ...locacaoStatusLabel,
  concluida: "Concluída",
};

const statusVariant: Record<MovimentacaoStatus, "info" | "success" | "error"> = {
  ...locacaoStatusVariant,
  concluida: "success",
};

export function RecentMovementsTable({ data }: RecentMovementsTableProps) {
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
      ]}
      data={data}
      getRowKey={(movimentacao) => `${movimentacao.tipo}-${movimentacao.id}`}
      emptyMessage="Nenhuma movimentação recente."
    />
  );
}
