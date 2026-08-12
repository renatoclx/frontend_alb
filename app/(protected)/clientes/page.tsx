"use client";

import { useEffect, useMemo, useState } from "react";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Table } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { listClientes, removeCliente } from "@/services/clientes-service";
import type { Cliente } from "@/types/cliente";

const PAGE_SIZE = 5;

export default function ClientesPage() {
  const { notify } = useToast();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [clienteToView, setClienteToView] = useState<Cliente | null>(null);
  const [clienteToDelete, setClienteToDelete] = useState<Cliente | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadClientes();
  }, []);

  function loadClientes() {
    setIsLoading(true);
    listClientes().then((data) => {
      setClientes(data);
      setIsLoading(false);
    });
  }

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return clientes;
    return clientes.filter((cliente) => cliente.nome.toLowerCase().includes(term));
  }, [clientes, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  async function handleConfirmDelete() {
    if (!clienteToDelete) return;
    setIsDeleting(true);
    try {
      await removeCliente(clienteToDelete.id);
      notify("success", "Cliente excluído com sucesso.");
      setClienteToDelete(null);
      loadClientes();
    } catch (error) {
      notify("error", error instanceof Error ? error.message : "Não foi possível excluir o cliente.");
    } finally {
      setIsDeleting(false);
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
            { key: "telefone", header: "Telefone", render: (cliente) => cliente.telefone },
            { key: "endereco", header: "Endereço", render: (cliente) => cliente.endereco },
            { key: "cidade", header: "Cidade", render: (cliente) => cliente.cidade },
            {
              key: "acoes",
              header: "Ação",
              render: (cliente) => (
                <div className="flex items-center gap-1">
                  <IconButton
                    icon={<Eye className="size-4" />}
                    label="Visualizar"
                    onClick={() => setClienteToView(cliente)}
                  />
                  <IconButton
                    icon={<Pencil className="size-4" />}
                    label="Alterar"
                    href={`/clientes/${cliente.id}/editar`}
                  />
                  <IconButton
                    icon={<Trash2 className="size-4" />}
                    label="Excluir"
                    variant="danger"
                    onClick={() => setClienteToDelete(cliente)}
                  />
                </div>
              ),
            },
          ]}
          data={paginated}
          getRowKey={(cliente) => cliente.id}
          emptyMessage="Nenhum cliente encontrado."
        />
      )}

      <Pagination page={currentPage} totalPages={totalPages} onPageChange={setPage} />

      <Modal
        isOpen={!!clienteToView}
        onClose={() => setClienteToView(null)}
        title={clienteToView ? `Cliente: ${clienteToView.nome}` : ""}
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
              <dd className="text-foreground">{clienteToView.telefone}</dd>
            </div>
            <div>
              <dt className="text-foreground/50">Documento</dt>
              <dd className="text-foreground">{clienteToView.documento}</dd>
            </div>
            <div>
              <dt className="text-foreground/50">Data de Nascimento</dt>
              <dd className="text-foreground">{clienteToView.dataNascimento ?? "-"}</dd>
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
