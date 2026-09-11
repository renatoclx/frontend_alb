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
import { removeCliente, restoreCliente, searchClientes } from "@/services/clientes-service";
import type { Cliente } from "@/types/cliente";
import { formatDate } from "@/utils/date";
import { maskDocumento, maskTelefone } from "@/utils/mask";

const PAGE_SIZE = 8;

export default function ClientesPage() {
  const { notify } = useToast();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const debouncedSearch = useDebouncedValue(search);
  const [clienteToView, setClienteToView] = useState<Cliente | null>(null);
  const [clienteToDelete, setClienteToDelete] = useState<Cliente | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    searchClientes({ page, limit: PAGE_SIZE, search: debouncedSearch })
      .then((result) => {
        if (cancelled) return;
        setClientes(result.items);
        setTotal(result.total);
        setIsLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setIsLoading(false);
        notify("error", "Não foi possível carregar os clientes.");
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
    if (!clienteToDelete) return;
    setIsDeleting(true);
    try {
      await removeCliente(clienteToDelete.id);
      notify("success", "Cliente excluído com sucesso.");
      setClienteToDelete(null);
      reload();
    } catch (error) {
      notify("error", error instanceof Error ? error.message : "Não foi possível excluir o cliente.");
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleRestore(cliente: Cliente) {
    try {
      await restoreCliente(cliente.id);
      notify("success", "Cliente reativado com sucesso.");
      reload();
    } catch (error) {
      notify("error", error instanceof Error ? error.message : "Não foi possível reativar o cliente.");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold text-foreground">Clientes</h1>
        <Button href="/clientes/novo" icon={<Plus className="size-4" />}>
          Novo Cliente
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
            { key: "nome", header: "Nome", render: (cliente) => cliente.nome },
            { key: "email", header: "E-mail", render: (cliente) => cliente.email || "-" },
            { key: "telefone", header: "Telefone", render: (cliente) => maskTelefone(cliente.telefone) },
            { key: "endereco", header: "Endereço", render: (cliente) => cliente.endereco },
            { key: "cidade", header: "Cidade", render: (cliente) => cliente.cidade },
            {
              key: "status",
              header: "Status",
              render: (cliente) => (
                <Tag variant={cliente.deletedAt ? "error" : "success"} size="sm">
                  {cliente.deletedAt ? "Inativo" : "Ativo"}
                </Tag>
              ),
            },
            {
              key: "acoes",
              header: "Ação",
              render: (cliente) => (
                <div className="flex items-center gap-1">
                  <IconButton
                    icon={<Pencil className="size-4" />}
                    label={cliente.deletedAt ? "Cliente inativo — não é possível alterar" : "Alterar"}
                    href={cliente.deletedAt ? undefined : `/clientes/${cliente.id}/editar`}
                    disabled={!!cliente.deletedAt}
                  />
                  <DropdownMenu
                    trigger={
                      <IconButton
                        icon={<MoreVertical className="size-4" />}
                        label="Mais ações"
                      />
                    }
                    items={[
                      {
                        label: "Visualizar",
                        icon: <Eye className="size-4" />,
                        onClick: () => setClienteToView(cliente),
                      },
                      {
                        label: "Excluir",
                        icon: <Trash2 className="size-4" />,
                        onClick: () => setClienteToDelete(cliente),
                        disabled: !!cliente.deletedAt,
                      },
                      ...(cliente.deletedAt
                        ? [
                            {
                              label: "Reativar",
                              icon: <RotateCcw className="size-4" />,
                              onClick: () => handleRestore(cliente),
                            },
                          ]
                        : []),
                    ]}
                  />
                </div>
              ),
            },
          ]}
          data={clientes}
          getRowKey={(cliente) => cliente.id}
          emptyMessage="Nenhum cliente encontrado."
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
        isOpen={!!clienteToView}
        onClose={() => setClienteToView(null)}
        title={clienteToView ? `Cliente: ${clienteToView.nome}` : ""}
        size="md"
        footer={
          <Button variant="secondary" onClick={() => setClienteToView(null)}>
            Fechar
          </Button>
        }
      >
        {clienteToView && (
          <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-foreground/50">Nome</dt>
              <dd className="text-foreground">{clienteToView.nome}</dd>
            </div>
            <div>
              <dt className="text-foreground/50">E-mail</dt>
              <dd className="text-foreground">{clienteToView.email || "-"}</dd>
            </div>
            <div>
              <dt className="text-foreground/50">Telefone</dt>
              <dd className="text-foreground">{maskTelefone(clienteToView.telefone)}</dd>
            </div>
            <div>
              <dt className="text-foreground/50">Documento</dt>
              <dd className="text-foreground">{maskDocumento(clienteToView.documento)}</dd>
            </div>
            <div>
              <dt className="text-foreground/50">Data de Nascimento</dt>
              <dd className="text-foreground">{formatDate(clienteToView.dataNascimento)}</dd>
            </div>
            <div>
              <dt className="text-foreground/50">Endereço</dt>
              <dd className="text-foreground">{clienteToView.endereco}</dd>
            </div>
            <div>
              <dt className="text-foreground/50">Cidade</dt>
              <dd className="text-foreground">{clienteToView.cidade}</dd>
            </div>
          </dl>
        )}
      </Modal>

      <Modal
        isOpen={!!clienteToDelete}
        onClose={() => setClienteToDelete(null)}
        title="Excluir cliente"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setClienteToDelete(null)}>
              Cancelar
            </Button>
            <Button variant="danger" isLoading={isDeleting} onClick={handleConfirmDelete}>
              Excluir
            </Button>
          </>
        }
      >
        {clienteToDelete && (
          <p className="text-sm text-foreground/70">
            Tem certeza que deseja excluir o cliente <strong>{clienteToDelete.nome}</strong>? Esta ação
            não poderá ser desfeita.
          </p>
        )}
      </Modal>
    </div>
  );
}
