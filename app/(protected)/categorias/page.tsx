"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Table } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { createCategoria, listCategorias, removeCategoria } from "@/services/categorias-service";
import type { Categoria } from "@/types/categoria";

const PAGE_SIZE = 8;

export default function CategoriasPage() {
  const { notify } = useToast();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [nome, setNome] = useState("");
  const [nomeError, setNomeError] = useState<string | undefined>();
  const [isSaving, setIsSaving] = useState(false);
  const [categoriaToDelete, setCategoriaToDelete] = useState<Categoria | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadCategorias();
  }, []);

  function loadCategorias() {
    setIsLoading(true);
    listCategorias().then((data) => {
      setCategorias(data);
      setIsLoading(false);
    });
  }

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return categorias;
    return categorias.filter((categoria) => categoria.nome.toLowerCase().includes(term));
  }, [categorias, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function openCreateModal() {
    setNome("");
    setNomeError(undefined);
    setIsCreateModalOpen(true);
  }

  function closeModal() {
    setIsCreateModalOpen(false);
  }

  async function handleSave() {
    if (!nome.trim()) {
      setNomeError("Informe o nome.");
      return;
    }
    setIsSaving(true);
    try {
      await createCategoria(nome);
      notify("success", "Categoria cadastrada com sucesso.");
      closeModal();
      loadCategorias();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível salvar a categoria.";
      setNomeError(message);
      notify("error", message);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleConfirmDelete() {
    if (!categoriaToDelete) return;
    setIsDeleting(true);
    try {
      await removeCategoria(categoriaToDelete.id);
      notify("success", "Categoria excluída com sucesso.");
      setCategoriaToDelete(null);
      loadCategorias();
    } catch (error) {
      notify("error", error instanceof Error ? error.message : "Não foi possível excluir a categoria.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold text-foreground">Categorias</h1>
        <Button icon={<Plus className="size-4" />} onClick={openCreateModal}>
          Nova Categoria
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
            { key: "nome", header: "Nome", render: (categoria) => categoria.nome },
            {
              key: "produtos",
              header: "Qtd. de Produtos",
              render: (categoria) => categoria.produtosCount,
            },
            {
              key: "acoes",
              header: "Ação",
              render: (categoria) => (
                <div className="flex items-center gap-1">
                  <IconButton
                    icon={<Trash2 className="size-4" />}
                    label={
                      categoria.produtosCount > 0
                        ? "Não é possível excluir: categoria possui produtos cadastrados"
                        : "Excluir"
                    }
                    disabled={categoria.produtosCount > 0}
                    onClick={() => setCategoriaToDelete(categoria)}
                  />
                </div>
              ),
            },
          ]}
          data={paginated}
          getRowKey={(categoria) => categoria.id}
          emptyMessage="Nenhuma categoria encontrada."
        />
      )}

      <Pagination
        page={currentPage}
        totalPages={totalPages}
        totalItems={filtered.length}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
      />

      <Modal
        isOpen={isCreateModalOpen}
        onClose={closeModal}
        title="Nova Categoria"
        size="sm"
        footer={
          <>
            <Button size="xl" variant="secondary" onClick={closeModal}>
              Cancelar
            </Button>
            <Button size="xl" isLoading={isSaving} onClick={handleSave}>
              Salvar
            </Button>
          </>
        }
      >
        <Input
          label="Nome"
          size="xl"
          required
          value={nome}
          onChange={(event) => setNome(event.target.value)}
          error={nomeError}
        />
      </Modal>

      <Modal
        isOpen={!!categoriaToDelete}
        onClose={() => setCategoriaToDelete(null)}
        title="Excluir categoria"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setCategoriaToDelete(null)}>
              Cancelar
            </Button>
            <Button variant="danger" isLoading={isDeleting} onClick={handleConfirmDelete}>
              Excluir
            </Button>
          </>
        }
      >
        {categoriaToDelete && (
          <p className="text-sm text-foreground/70">
            Tem certeza que deseja excluir a categoria <strong>{categoriaToDelete.nome}</strong>? Esta ação
            não poderá ser desfeita.
          </p>
        )}
      </Modal>
    </div>
  );
}
