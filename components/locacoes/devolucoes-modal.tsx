"use client";

import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import type { Locacao, LocacaoDevolucao } from "@/types/locacao";
import { formatDate } from "@/utils/date";

interface DevolucoesModalProps {
  locacao: Locacao | null;
  onClose: () => void;
  onImprimirTermo: (locacao: Locacao, devolucao: LocacaoDevolucao) => void;
}

// Histórico de devoluções (avulsas e total) de uma locação, com a
// reimpressão do Termo de Devolução de cada uma.
export function DevolucoesModal({ locacao, onClose, onImprimirTermo }: DevolucoesModalProps) {
  return (
    <Modal
      isOpen={!!locacao}
      onClose={onClose}
      title={locacao ? `Devoluções — ${locacao.cliente}` : ""}
      size="lg"
      footer={
        <Button variant="secondary" onClick={onClose}>
          Fechar
        </Button>
      }
    >
      {locacao && locacao.devolucoes.length === 0 && (
        <p className="py-6 text-center text-sm text-foreground/50">Nenhuma devolução registrada.</p>
      )}
      {locacao && locacao.devolucoes.length > 0 && (
        <ul className="flex flex-col divide-y divide-border">
          {locacao.devolucoes.map((devolucao) => (
            <li key={devolucao.id} className="flex items-start justify-between gap-4 py-3">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-foreground">
                  {formatDate(devolucao.data)} às{" "}
                  {new Date(devolucao.data).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                </span>
                <ul className="text-sm text-foreground/70">
                  {devolucao.itens.map((item) => (
                    <li key={item.itemId}>
                      {item.produto}: <strong>{item.quantidade}</strong>
                    </li>
                  ))}
                </ul>
              </div>
              <Button
                variant="secondary"
                size="md"
                icon={<FileText className="size-4" />}
                onClick={() => onImprimirTermo(locacao, devolucao)}
              >
                Imprimir Termo
              </Button>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
}
