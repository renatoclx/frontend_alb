"use client";

import { useEffect, useState } from "react";
import { Eye, FileText, MoreVertical, Plus, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Skeleton } from "@/components/ui/skeleton";
import { Table } from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import { RelatorioVendaDocument } from "@/components/vendas/relatorio-venda-pdf";
import { ReciboPagamentoVendaDocument } from "@/components/vendas/recibo-pagamento-pdf";
import { useAuth } from "@/hooks/use-auth";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useToast } from "@/hooks/use-toast";
import { searchVendas } from "@/services/vendas-service";
import type { Venda } from "@/types/venda";
import { formatDate } from "@/utils/date";
import { formatMoney } from "@/utils/mask";
import { downloadPdf } from "@/utils/pdf";

const PAGE_SIZE = 8;

export default function VendasPage() {
  const { user } = useAuth();
  const { notify } = useToast();
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [clienteSearch, setClienteSearch] = useState("");
  const [produtoSearch, setProdutoSearch] = useState("");
  const [page, setPage] = useState(1);
  const debouncedClienteSearch = useDebouncedValue(clienteSearch);
  const debouncedProdutoSearch = useDebouncedValue(produtoSearch);
  const [vendaToView, setVendaToView] = useState<Venda | null>(null);

  useEffect(() => {
    let cancelled = false;
    searchVendas({
      page,
      limit: PAGE_SIZE,
      clienteSearch: debouncedClienteSearch,
      produtoSearch: debouncedProdutoSearch,
    })
      .then((result) => {
        if (cancelled) return;
        setVendas(result.items);
        setTotal(result.total);
        setIsLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setIsLoading(false);
        notify("error", "Não foi possível carregar as vendas.");
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, debouncedClienteSearch, debouncedProdutoSearch]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function handleClienteSearchChange(value: string) {
    setClienteSearch(value);
    setPage(1);
  }

  function handleProdutoSearchChange(value: string) {
    setProdutoSearch(value);
    setPage(1);
  }

  async function handlePrintRelatorio(venda: Venda) {
    try {
      await downloadPdf(
        <RelatorioVendaDocument venda={venda} usuarioNome={user?.name ?? ""} emitidoEm={new Date()} />,
        `relatorio-venda-${venda.id}.pdf`
      );
    } catch {
      notify("error", "Não foi possível gerar o relatório.");
    }
  }

  async function handleGerarRecibo(venda: Venda) {
    try {
      await downloadPdf(
        <ReciboPagamentoVendaDocument venda={venda} emitidoEm={new Date()} />,
        `recibo-pagamento-${venda.id}.pdf`
      );
    } catch {
      notify("error", "Não foi possível gerar o recibo.");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold text-foreground">Vendas</h1>
        <Button href="/vendas/nova" icon={<Plus className="size-4" />}>
          Realizar Venda
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <Input
          label="Nome do Cliente"
          type="search"
          placeholder="Buscar por nome do cliente..."
          value={clienteSearch}
          onChange={(event) => handleClienteSearchChange(event.target.value)}
          className="max-w-sm"
        />
        <Input
          label="Nome do Produto"
          type="search"
          placeholder="Buscar por nome do produto..."
          value={produtoSearch}
          onChange={(event) => handleProdutoSearchChange(event.target.value)}
          className="max-w-sm"
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
            { key: "cliente", header: "Cliente", render: (venda) => venda.cliente },
            { key: "cidade", header: "Cidade", render: (venda) => venda.cidade || "-" },
            { key: "dataVenda", header: "Data de Venda", render: (venda) => formatDate(venda.dataVenda) },
            {
              key: "valorTotal",
              header: "Valor total",
              render: (venda) => formatMoney(venda.valorTotal),
            },
            {
              key: "acoes",
              header: "Ação",
              render: (venda) => (
                <div className="flex items-center gap-1">
                  <IconButton
                    icon={<Eye className="size-4" />}
                    label="Visualizar itens vendidos"
                    onClick={() => setVendaToView(venda)}
                  />
                  <DropdownMenu
                    trigger={<IconButton icon={<MoreVertical className="size-4" />} label="Mais ações" />}
                    items={[
                      {
                        label: "Imprimir Relatório de Venda",
                        icon: <FileText className="size-4" />,
                        onClick: () => handlePrintRelatorio(venda),
                      },
                      {
                        label: "Gerar Recibo para Pagamento",
                        icon: <Receipt className="size-4" />,
                        onClick: () => handleGerarRecibo(venda),
                      },
                    ]}
                  />
                </div>
              ),
            },
          ]}
          data={vendas}
          getRowKey={(venda) => venda.id}
          emptyMessage="Nenhuma venda encontrada."
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
        isOpen={!!vendaToView}
        onClose={() => setVendaToView(null)}
        title={vendaToView ? `Itens vendidos — ${vendaToView.cliente}` : ""}
        size="lg"
        footer={
          <Button variant="secondary" onClick={() => setVendaToView(null)}>
            Fechar
          </Button>
        }
      >
        {vendaToView && (
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
              data={vendaToView.itens}
              getRowKey={(item) => item.id}
              emptyMessage="Nenhum item nesta venda."
            />
            <p className="text-right text-sm font-semibold text-foreground">
              Total: {formatMoney(vendaToView.valorTotal)}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}
