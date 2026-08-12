"use client";

import { useRouter } from "next/navigation";
import { ClienteForm } from "@/components/clientes/cliente-form";
import { createCliente } from "@/services/clientes-service";
import type { ClienteInput } from "@/types/cliente";

export default function NovoClientePage() {
  const router = useRouter();

  async function handleSubmit(input: ClienteInput) {
    await createCliente(input);
    router.push("/clientes");
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-foreground">Novo Cliente</h1>
      <ClienteForm mode="create" onSubmit={handleSubmit} submitLabel="Salvar" />
    </div>
  );
}
