"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Skeleton } from "@/components/ui/skeleton";
import { Table } from "@/components/ui/table";
import { Tag } from "@/components/ui/tag";
import { useToast } from "@/hooks/use-toast";
import { getLocacao } from "@/services/locacoes-service";
import { getVenda } from "@/services/vendas-service";
import type { Movimentacao } from "@/types/dashboard";
import type { Locacao } from "@/types/locacao";
import type { Venda } from "@/types/venda";
import { daysSince, formatDate } from "@/utils/date";
import { locacaoStatusLabel, locacaoStatusVariant } from "@/utils/locacao-status";
import { formatMoney, maskDocumento, maskTelefone } from "@/utils/mask";

// Só o necessário para buscar e titular o detalhe — atende tanto as Últimas
// movimentações quanto as Próximas devoluções (sempre locações).
export type MovimentacaoSelecionada = Pick<Movimentacao, "id" | "tipo" | "cliente">;

interface MovimentacaoDetalhesModalProps {
  movimentacao: MovimentacaoSelecionada;
  onClose: () => void;
}

type Detalhe = { tipo: "locacao"; locacao: Locacao } | { tipo: "venda"; venda: Venda };

// Detalhe (somente leitura) de uma movimentação do Dashboard. Busca a
// locação/venda pelo id ao abrir, para refletir a situação atual (ex.:
// devoluções feitas depois do carregamento do Dashboard). Montado só quando
// há movimentação selecionada — o estado zera a cada abertura.
export function MovimentacaoDetalhesModal({ movimentacao, onClose }: MovimentacaoDetalhesModalProps) {
  const { notify } = useToast();
  const [detalhe, setDetalhe] = useState<Detalhe | null>(null);

  useEffect(() => {
    let cancelled = false;
    const request: Promise<Detalhe> =
      movimentacao.tipo === "locacao"
        ? getLocacao(movimentacao.id).then((locacao) => ({ tipo: "locacao", locacao }))
        : getVenda(movimentacao.id).then((venda) => ({ tipo: "venda", venda }));
    request
      .then((result) => {
        if (!cancelled) setDetalhe(result);
      })
      .catch(() => {
        if (cancelled) return;
        notify("error", "Não foi possível carregar os detalhes da movimentação.");
        onClose();
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movimentacao.id, movimentacao.tipo]);

  const titulo = `${movimentacao.tipo === "venda" ? "Venda" : "Locação"} — ${movimentacao.cliente}`;

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={titulo}
      size="lg"
      footer={
        <Button variant="secondary" onClick={onClose}>
          Fechar
        </Button>
      }
    >
      {!detalhe && (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-8 w-full" />
          ))}
        </div>
      )}
      {detalhe?.tipo === "locacao" && <LocacaoDetalhes locacao={detalhe.locacao} />}
      {detalhe?.tipo === "venda" && <VendaDetalhes venda={detalhe.venda} />}
    </Modal>
  );
}

function Campo({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs text-foreground/50">{label}</span>
      <span className="text-sm font-medium text-foreground">{children}</span>
    </div>
  );
}

function ClienteCampos({
  documento,
  cidade,
  telefone,
}: {
  documento: string;
  cidade: string;
  telefone: string;
}) {
  return (
    <>
      <Campo label="Documento">{maskDocumento(documento) || "-"}</Campo>
      <Campo label="Cidade">{cidade || "-"}</Campo>
      <Campo label="Telefone">{maskTelefone(telefone) || "-"}</Campo>
    </>
  );
}

function LocacaoDetalhes({ locacao }: { locacao: Locacao }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <ClienteCampos
          documento={locacao.clienteDocumento}
          cidade={locacao.cidade}
          telefone={locacao.clienteTelefone}
        />
        <Campo label="Data de Início">{formatDate(locacao.dataInicio)}</Campo>
        <Campo label="Data de Retorno">{formatDate(locacao.dataRetorno)}</Campo>
        {locacao.dataDevolucao && <Campo label="Devolvida em">{formatDate(locacao.dataDevolucao)}</Campo>}
        <Campo label="Status">
          <Tag variant={locacaoStatusVariant[locacao.status]} size="sm">
            {locacao.status === "atrasada"
              ? `Em atraso há ${daysSince(locacao.dataRetorno)} dia(s)`
              : locacaoStatusLabel[locacao.status]}
          </Tag>
        </Campo>
      </div>

      <Table
        columns={[
          { key: "produto", header: "Item", render: (item) => item.produto },
          { key: "locado", header: "Locado", render: (item) => item.quantidade },
          { key: "devolvido", header: "Devolvido", render: (item) => item.quantidadeDevolvida },
          { key: "pendente", header: "Pendente", render: (item) => item.quantidade - item.quantidadeDevolvida },
          { key: "valorUnitario", header: "Valor Unitário", render: (item) => formatMoney(item.valorUnitario) },
          {
            key: "valorTotal",
            header: "Valor Total",
            render: (item) => formatMoney(item.valorUnitario * item.quantidade),
          },
        ]}
        data={locacao.itens}
        getRowKey={(item) => item.id}
        emptyMessage="Nenhum item nesta locação."
      />
      <p className="text-right text-sm font-semibold text-foreground">Total: {formatMoney(locacao.valorTotal)}</p>

      {locacao.devolucoes.length > 0 && (
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-foreground">Devoluções</h3>
          <ul className="flex flex-col divide-y divide-border rounded-sm border border-border">
            {locacao.devolucoes.map((devolucao) => (
              <li key={devolucao.id} className="flex flex-col gap-1 px-3 py-2">
                <span className="text-sm font-medium text-foreground">
                  {formatDate(devolucao.data)} às{" "}
                  {new Date(devolucao.data).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                </span>
                <span className="text-sm text-foreground/70">
                  {devolucao.itens.map((item) => `${item.produto}: ${item.quantidade}`).join(" · ")}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function VendaDetalhes({ venda }: { venda: Venda }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <ClienteCampos documento={venda.clienteDocumento} cidade={venda.cidade} telefone={venda.clienteTelefone} />
        <Campo label="Data da Venda">{formatDate(venda.dataVenda)}</Campo>
      </div>

      <Table
        columns={[
          { key: "produto", header: "Item", render: (item) => item.produto },
          { key: "quantidade", header: "Quantidade", render: (item) => item.quantidade },
          { key: "valorUnitario", header: "Valor Unitário", render: (item) => formatMoney(item.valorUnitario) },
          {
            key: "valorTotal",
            header: "Valor Total",
            render: (item) => formatMoney(item.valorUnitario * item.quantidade),
          },
        ]}
        data={venda.itens}
        getRowKey={(item) => item.id}
        emptyMessage="Nenhum item nesta venda."
      />
      <p className="text-right text-sm font-semibold text-foreground">Total: {formatMoney(venda.valorTotal)}</p>
    </div>
  );
}
