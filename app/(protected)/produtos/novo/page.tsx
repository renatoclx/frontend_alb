"use client";

import { useRouter } from "next/navigation";
import { ProdutoForm } from "@/components/produtos/produto-form";
import { createProduto } from "@/services/produtos-service";
import type { ProdutoInput } from "@/types/produto";

export default function NovoProdutoPage() {
  const router = useRouter();

  async function handleSubmit(input: ProdutoInput) {
    await createProduto(input);
    router.push("/produtos");
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <h1 className="shrink-0 text-2xl font-semibold text-foreground">Novo Produto</h1>
      <ProdutoForm mode="create" onSubmit={handleSubmit} submitLabel="Salvar" />
    </div>
  );
}
