"use client";

import { useEffect, useState } from "react";
import { Eye, FileText, MoreVertical, PackageCheck, Plus, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table } from "@/components/ui/table";
import { Tag } from "@/components/ui/tag";
import { Pagination } from "@/components/ui/pagination";
import { RelatorioLocacaoDocument } from "@/components/locacoes/relatorio-locacao-pdf";
import { ReciboPagamentoDocument } from "@/components/locacoes/recibo-pagamento-pdf";
import { useAuth } from "@/hooks/use-auth";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useToast } from "@/hooks/use-toast";
import { devolverLocacao, searchLocacoes } from "@/services/locacoes-service";
import type { Locacao, LocacaoStatus } from "@/types/locacao";
import { daysSince, formatDate } from "@/utils/date";
import {
  locacaoStatusFilterOptions,
  locacaoStatusLabel,
  locacaoStatusVariant,
} from "@/utils/locacao-status";
import { formatMoney } from "@/utils/mask";
import { downloadPdf } from "@/utils/pdf";

const PAGE_SIZE = 8;

export default function LocacoesPage() {
  const { user } = useAuth();
  const { notify } = useToast();
  const [locacoes, setLocacoes] = useState<Locacao[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const debouncedSearch = useDebouncedValue(search);
  const [locacaoToView, setLocacaoToView] = useState<Locacao | null>(null);
  const [locacaoParaDevolver, setLocacaoParaDevolver] = useState<Locacao | null>(null);
  const [isDevolvendo, setIsDevolvendo] = useState(false);

  useEffect(() => {
    let cancelled = false;
    searchLocacoes({
      page,
      limit: PAGE_SIZE,
      search: debouncedSearch,
      status: statusFilter === "todos" ? undefined : (statusFilter as LocacaoStatus),
    })
      .then((result) => {
        if (cancelled) return;
        setLocacoes(result.items);
        setTotal(result.total);
        setIsLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setIsLoading(false);
        notify("error", "Não foi possível carregar as locações.");
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, debouncedSearch, statusFilter, refreshKey]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function reload() {
    setRefreshKey((key) => key + 1);
  }

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleStatusFilterChange(value: string) {
    setStatusFilter(value);
    setPage(1);
  }

  async function handlePrintRelatorio(locacao: Locacao) {
    try {
      await downloadPdf(
        <RelatorioLocacaoDocument locacao={locacao} usuarioNome={user?.name ?? ""} emitidoEm={new Date()} />,
        `relatorio-locacao-${locacao.id}.pdf`
      );
    } catch {
      notify("error", "Não foi possível gerar o relatório.");
    }
  }

  async function handleGerarRecibo(locacao: Locacao) {
    try {
      await downloadPdf(
        <ReciboPagamentoDocument locacao={locacao} emitidoEm={new Date()} />,
        `recibo-pagamento-${locacao.id}.pdf`
      );
    } catch {
      notify("error", "Não foi possível gerar o recibo.");
    }
  }

  async function handleConfirmarDevolucao() {
    if (!locacaoParaDevolver) return;
    setIsDevolvendo(true);
    try {
      await devolverLocacao(locacaoParaDevolver.id);
      notify("success", "Devolução realizada com sucesso.");
      setLocacaoParaDevolver(null);
      reload();
    } catch (error) {
      notify("error", error instanceof Error ? error.message : "Não foi possível realizar a devolução.");
    } finally {
      setIsDevolvendo(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold text-foreground">Locações</h1>
        <Button href="/locacoes/nova" icon={<Plus className="size-4" />}>
          Realizar Locação
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <Input
          label="Pesquisar"
          type="search"
          placeholder="Buscar por nome do cliente..."
          value={search}
          onChange={(event) => handleSearchChange(event.target.value)}
          className="max-w-sm"
        />
        <Select
          label="Status"
          value={statusFilter}
          onChange={handleStatusFilterChange}
          options={locacaoStatusFilterOptions}
          className="max-w-xs"
        />
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: PAGE_SIZE }).map((_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
        </div>
      ) : (
        <Table
          columns={[
            { key: "cliente", header: "Cliente", render: (locacao) => locacao.cliente },
            { key: "cidade", header: "Cidade", render: (locacao) => locacao.cidade || "-" },
            { key: "dataInicio", header: "Data de Início", render: (locacao) => formatDate(locacao.dataInicio) },
            { key: "dataRetorno", header: "Data de Retorno", render: (locacao) => formatDate(locacao.dataRetorno) },
            {
              key: "status",
              header: "Status",
              render: (locacao) => (
                <Tag variant={locacaoStatusVariant[locacao.status]} size="sm">
                  {locacao.status === "atrasada"
                    ? `Em atraso há ${daysSince(locacao.dataRetorno)} dia(s)`
                    : locacaoStatusLabel[locacao.status]}
                </Tag>
              ),
            },
            {
              key: "valorTotal",
              header: "Valor total",
              render: (locacao) => formatMoney(locacao.valorTotal),
            },
            {
              key: "acoes",
              header: "Ação",
              render: (locacao) => (
                <div className="flex items-center gap-1">
                  <IconButton
                    icon={<Eye className="size-4" />}
                    label="Visualizar itens locados"
                    onClick={() => setLocacaoToView(locacao)}
                  />
                  <IconButton
                    icon={<PackageCheck className="size-4" />}
                    label={locacao.status === "devolvida" ? "Locação já devolvida" : "Realizar devolução"}
                    disabled={locacao.status === "devolvida"}
                    onClick={() => setLocacaoParaDevolver(locacao)}
                  />
                  <DropdownMenu
                    trigger={<IconButton icon={<MoreVertical className="size-4" />} label="Mais ações" />}
                    items={[
                      {
                        label: "Imprimir Relatório de Locação",
                        icon: <FileText className="size-4" />,
                        onClick: () => handlePrintRelatorio(locacao),
                      },
                      {
                        label: "Gerar Recibo para pagamento",
                        icon: <Receipt className="size-4" />,
                        onClick: () => handleGerarRecibo(locacao),
                      },
                    ]}
                  />
                </div>
              ),
            },
          ]}
          data={locacoes}
          getRowKey={(locacao) => locacao.id}
          emptyMessage="Nenhuma locação encontrada."
        />
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        totalItems={total}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
      />

      <Modal
        isOpen={!!locacaoToView}
        onClose={() => setLocacaoToView(null)}
        title={locacaoToView ? `Itens locados — ${locacaoToView.cliente}` : ""}
        size="lg"
        footer={
          <Button variant="secondary" onClick={() => setLocacaoToView(null)}>
            Fechar
          </Button>
        }
      >
        {locacaoToView && (
          <div className="flex flex-col gap-4">
            <Table
              columns={[
                { key: "produto", header: "Item", render: (item) => item.produto },
                { key: "quantidade", header: "Quantidade", render: (item) => item.quantidade },
                {
                  key: "valorUnitario",
                  header: "Valor Unitário",
                  render: (item) => formatMoney(item.valorUnitario),
                },
                {
                  key: "valorTotal",
                  header: "Valor Total",
                  render: (item) => formatMoney(item.valorUnitario * item.quantidade),
                },
              ]}
              data={locacaoToView.itens}
              getRowKey={(item) => item.id}
              emptyMessage="Nenhum item nesta locação."
            />
            <p className="text-right text-sm font-semibold text-foreground">
              Total: {formatMoney(locacaoToView.valorTotal)}
            </p>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={!!locacaoParaDevolver}
        onClose={() => setLocacaoParaDevolver(null)}
        title="Confirmar devolução"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setLocacaoParaDevolver(null)}>
              Cancelar
            </Button>
            <Button isLoading={isDevolvendo} onClick={handleConfirmarDevolucao}>
              Confirmar
            </Button>
          </>
        }
      >
        {locacaoParaDevolver && (
          <p className="text-sm text-foreground/70">
            Confirmar a devolução dos itens locados para <strong>{locacaoParaDevolver.cliente}</strong>? O estoque
            será restabelecido.
          </p>
        )}
      </Modal>
    </div>
  );
}
