"use client";

import { useEffect, useState } from "react";
import { Eye, MoreVertical, Pencil, Plus, RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Table } from "@/components/ui/table";
import { Tag } from "@/components/ui/tag";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useToast } from "@/hooks/use-toast";
import { removeProduto, restoreProduto, searchProdutos } from "@/services/produtos-service";
import type { Produto } from "@/types/produto";
import { cn } from "@/utils/cn";
import { formatMoney } from "@/utils/mask";

const PAGE_SIZE = 8;

export default function ProdutosPage() {
  const { notify } = useToast();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const debouncedSearch = useDebouncedValue(search);
  const [produtoToView, setProdutoToView] = useState<Produto | null>(null);
  const [produtoToDelete, setProdutoToDelete] = useState<Produto | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    searchProdutos({ page, limit: PAGE_SIZE, search: debouncedSearch })
      .then((result) => {
        if (cancelled) return;
        setProdutos(result.items);
        setTotal(result.total);
        setIsLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setIsLoading(false);
        notify("error", "Não foi possível carregar os produtos.");
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, debouncedSearch, refreshKey]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function reload() {
    setRefreshKey((key) => key + 1);
  }

  async function handleConfirmDelete() {
    if (!produtoToDelete) return;
    setIsDeleting(true);
    try {
      await removeProduto(produtoToDelete.id);
      notify("success", "Produto excluído com sucesso.");
      setProdutoToDelete(null);
      reload();
    } catch (error) {
      notify("error", error instanceof Error ? error.message : "Não foi possível excluir o produto.");
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleRestore(produto: Produto) {
    try {
      await restoreProduto(produto.id);
      notify("success", "Produto reativado com sucesso.");
      reload();
    } catch (error) {
      notify("error", error instanceof Error ? error.message : "Não foi possível reativar o produto.");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold text-foreground">Produtos</h1>
        <Button href="/produtos/novo" icon={<Plus className="size-4" />}>
          Novo Produto
        </Button>
      </div>

      <Input
        label="Pesquisar"
        type="search"
        placeholder="Buscar por nome..."
        value={search}
        onChange={(event) => handleSearchChange(event.target.value)}
        className="max-w-sm"
      />

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: PAGE_SIZE }).map((_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
        </div>
      ) : (
        <Table
          columns={[
            { key: "nome", header: "Nome", render: (produto) => produto.nome },
            { key: "referencia", header: "Referência", render: (produto) => produto.referencia || "-" },
            {
              key: "precoVenda",
              header: "Preço de Venda",
              render: (produto) => (produto.precoVenda !== null ? formatMoney(produto.precoVenda) : "-"),
            },
            {
              key: "precoLocacao",
              header: "Preço de Locação",
              render: (produto) => (produto.precoLocacao !== null ? formatMoney(produto.precoLocacao) : "-"),
            },
            {
              key: "quantidade",
              header: "Quantidade",
              render: (produto) => (
                <span className={cn(produto.quantidade < produto.quantidadeMinima && "font-medium text-error")}>
                  {produto.quantidade}
                </span>
              ),
            },
            { key: "categoria", header: "Categoria", render: (produto) => produto.categoria || "-" },
            {
              key: "status",
              header: "Status",
              render: (produto) => (
                <Tag variant={produto.deletedAt ? "error" : "success"} size="sm">
                  {produto.deletedAt ? "Inativo" : "Ativo"}
                </Tag>
              ),
            },
            {
              key: "acoes",
              header: "Ação",
              render: (produto) => (
                <div className="flex items-center gap-1">
                  <IconButton
                    icon={<Pencil className="size-4" />}
                    label={produto.deletedAt ? "Produto inativo — não é possível alterar" : "Alterar"}
                    href={produto.deletedAt ? undefined : `/produtos/${produto.id}/editar`}
                    disabled={!!produto.deletedAt}
                  />
                  <DropdownMenu
                    trigger={<IconButton icon={<MoreVertical className="size-4" />} label="Mais ações" />}
                    items={[
                      {
                        label: "Visualizar",
                        icon: <Eye className="size-4" />,
                        onClick: () => setProdutoToView(produto),
                      },
                      {
                        label: "Excluir",
                        icon: <Trash2 className="size-4" />,
                        onClick: () => setProdutoToDelete(produto),
                        disabled: !!produto.deletedAt,
                      },
                      ...(produto.deletedAt
                        ? [
                            {
                              label: "Reativar",
                              icon: <RotateCcw className="size-4" />,
                              onClick: () => handleRestore(produto),
                            },
                          ]
                        : []),
                    ]}
                  />
                </div>
              ),
            },
          ]}
          data={produtos}
          getRowKey={(produto) => produto.id}
          emptyMessage="Nenhum produto encontrado."
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
        isOpen={!!produtoToView}
        onClose={() => setProdutoToView(null)}
        title={produtoToView ? `Produto: ${produtoToView.nome}` : ""}
        size="md"
        footer={
          <Button variant="secondary" onClick={() => setProdutoToView(null)}>
            Fechar
          </Button>
        }
      >
        {produtoToView && (
          <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-foreground/50">Nome</dt>
              <dd className="text-foreground">{produtoToView.nome}</dd>
            </div>
            <div>
              <dt className="text-foreground/50">Referência</dt>
              <dd className="text-foreground">{produtoToView.referencia || "-"}</dd>
            </div>
            <div>
              <dt className="text-foreground/50">Tipo</dt>
              <dd className="text-foreground">{produtoToView.tipo === "venda" ? "Venda" : "Locação"}</dd>
            </div>
            <div>
              <dt className="text-foreground/50">Categoria</dt>
              <dd className="text-foreground">{produtoToView.categoria || "-"}</dd>
            </div>
            <div>
              <dt className="text-foreground/50">Preço de Compra</dt>
              <dd className="text-foreground">{formatMoney(produtoToView.precoCompra)}</dd>
            </div>
            <div>
              <dt className="text-foreground/50">
                {produtoToView.tipo === "venda" ? "Preço de Venda" : "Preço de Locação"}
              </dt>
              <dd className="text-foreground">
                {formatMoney(
                  (produtoToView.tipo === "venda" ? produtoToView.precoVenda : produtoToView.precoLocacao) ?? 0
                )}
              </dd>
            </div>
            <div>
              <dt className="text-foreground/50">Quantidade</dt>
              <dd className={cn("text-foreground", produtoToView.quantidade < produtoToView.quantidadeMinima && "font-medium text-error")}>
                {produtoToView.quantidade}
              </dd>
            </div>
            <div>
              <dt className="text-foreground/50">Quantidade Mínima</dt>
              <dd className="text-foreground">{produtoToView.quantidadeMinima}</dd>
            </div>
            {produtoToView.descricao && (
              <div className="sm:col-span-2">
                <dt className="text-foreground/50">Descrição</dt>
                <dd className="text-foreground">{produtoToView.descricao}</dd>
              </div>
            )}
          </dl>
        )}
      </Modal>

      <Modal
        isOpen={!!produtoToDelete}
        onClose={() => setProdutoToDelete(null)}
        title="Excluir produto"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setProdutoToDelete(null)}>
              Cancelar
            </Button>
            <Button variant="danger" isLoading={isDeleting} onClick={handleConfirmDelete}>
              Excluir
            </Button>
          </>
        }
      >
        {produtoToDelete && (
          <p className="text-sm text-foreground/70">
            Tem certeza que deseja excluir o produto <strong>{produtoToDelete.nome}</strong>? Esta ação não
            poderá ser desfeita.
          </p>
        )}
      </Modal>
    </div>
  );
}
