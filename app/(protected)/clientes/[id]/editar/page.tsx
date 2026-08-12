"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ClienteForm } from "@/components/clientes/cliente-form";
import { Skeleton } from "@/components/ui/skeleton";
import { getCliente, updateCliente } from "@/services/clientes-service";
import type { Cliente, ClienteInput } from "@/types/cliente";

export default function EditarClientePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCliente(params.id).then((data) => {
      setCliente(data ?? null);
      setIsLoading(false);
    });
  }, [params.id]);

  async function handleSubmit(input: ClienteInput) {
    await updateCliente(params.id, input);
    router.push("/clientes");
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-foreground">Alterar Cliente</h1>

      {isLoading ? (
        <div className="flex flex-col gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : cliente ? (
        <ClienteForm
          mode="edit"
          initialValues={{
            nome: cliente.nome,
            email: cliente.email,
            telefone: cliente.telefone,
            documento: cliente.documento,
            dataNascimento: cliente.dataNascimento,
            endereco: cliente.endereco,
            cidade: cliente.cidade,
          }}
          onSubmit={handleSubmit}
          submitLabel="Salvar"
        />
      ) : (
        <p className="text-sm text-foreground/60">Cliente não encontrado.</p>
      )}
    </div>
  );
}
