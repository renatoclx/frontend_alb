"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProdutoForm } from "@/components/produtos/produto-form";
import { Skeleton } from "@/components/ui/skeleton";
import { getProduto, updateProduto } from "@/services/produtos-service";
import type { Produto, ProdutoInput } from "@/types/produto";

export default function EditarProdutoPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [produto, setProduto] = useState<Produto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getProduto(params.id).then((data) => {
      setProduto(data ?? null);
      setIsLoading(false);
    });
  }, [params.id]);

  async function handleSubmit(input: ProdutoInput) {
    await updateProduto(params.id, input);
    router.push("/produtos");
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <h1 className="shrink-0 text-2xl font-semibold text-foreground">Alterar Produto</h1>

      {isLoading ? (
        <div className="flex flex-col gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : produto ? (
        <ProdutoForm
          mode="edit"
          initialValues={{
            nome: produto.nome,
            referencia: produto.referencia,
            descricao: produto.descricao,
            tipo: produto.tipo,
            precoCompra: produto.precoCompra,
            precoVenda: produto.precoVenda,
            precoLocacao: produto.precoLocacao,
            quantidade: produto.quantidade,
            quantidadeMinima: produto.quantidadeMinima,
            categoriaId: produto.categoriaId,
          }}
          onSubmit={handleSubmit}
          submitLabel="Salvar"
        />
      ) : (
        <p className="text-sm text-foreground/60">Produto não encontrado.</p>
      )}
    </div>
  );
}
