import { Tag } from "@/components/ui/tag";
import type { ProximaDevolucao } from "@/types/dashboard";
import { formatDate } from "@/utils/date";

interface UpcomingReturnsCardProps {
  data: ProximaDevolucao[];
}

export function UpcomingReturnsCard({ data }: UpcomingReturnsCardProps) {
  if (data.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-foreground/50">
        Nenhuma devolução prevista.
      </p>
    );
  }

  return (
    <ul className="flex flex-col divide-y divide-border">
      {data.map((devolucao) => (
        <li key={devolucao.id} className="flex items-center justify-between gap-3 py-3">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground">{devolucao.cliente}</span>
            <span className="text-xs text-foreground/50">
              Prevista para {formatDate(devolucao.dataPrevista)}
            </span>
          </div>
          {devolucao.status === "atrasada" ? (
            <Tag variant="error" size="sm">
              Em atraso há {devolucao.diasAtraso} dia(s)
            </Tag>
          ) : (
            <Tag variant="info" size="sm">
              No prazo
            </Tag>
          )}
        </li>
      ))}
    </ul>
  );
}
