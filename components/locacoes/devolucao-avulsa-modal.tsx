"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Table } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import type { DevolucaoItemInput } from "@/services/locacoes-service";
import type { Locacao } from "@/types/locacao";

interface DevolucaoAvulsaModalProps {
  locacao: Locacao;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: (itens: DevolucaoItemInput[]) => void;
}

// Devolução avulsa em duas etapas: escolher quantas unidades de cada item
// voltam agora e confirmar. Só itens com saldo pendente aparecem.
// Montado só quando há locação selecionada — o estado zera a cada abertura.
export function DevolucaoAvulsaModal({ locacao, isSubmitting, onClose, onConfirm }: DevolucaoAvulsaModalProps) {
  const { notify } = useToast();
  const [quantidades, setQuantidades] = useState<Record<string, string>>({});
  const [isConfirming, setIsConfirming] = useState(false);

  const pendentes = locacao.itens
    .map((item) => ({ ...item, pendente: item.quantidade - item.quantidadeDevolvida }))
    .filter((item) => item.pendente > 0);

  const selecionados = pendentes
    .map((item) => ({ item, quantidade: Number(quantidades[item.id] || 0) }))
    .filter(({ quantidade }) => quantidade > 0);

  function handleAvancar() {
    for (const item of pendentes) {
      const quantidade = Number(quantidades[item.id] || 0);
      if (!Number.isInteger(quantidade) || quantidade < 0) {
        notify("error", `Quantidade inválida para ${item.produto}.`);
        return;
      }
      if (quantidade > item.pendente) {
        notify("error", `${item.produto}: só restam ${item.pendente} unidade(s) a devolver.`);
        return;
      }
    }
    if (selecionados.length === 0) {
      notify("error", "Informe a quantidade de ao menos um item.");
      return;
    }
    setIsConfirming(true);
  }

  function handleConfirmar() {
    onConfirm(selecionados.map(({ item, quantidade }) => ({ itemId: item.id, quantidade })));
  }

  if (isConfirming) {
    return (
      <Modal
        isOpen
        onClose={onClose}
        title="Confirmar devolução avulsa"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsConfirming(false)} disabled={isSubmitting}>
              Voltar
            </Button>
            <Button isLoading={isSubmitting} onClick={handleConfirmar}>
              Confirmar
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-2 text-sm text-foreground/70">
          <p>
            Confirmar a devolução dos itens abaixo para <strong>{locacao.cliente}</strong>? O estoque será
            restabelecido e o Termo de Devolução será gerado.
          </p>
          <ul className="list-disc pl-5">
            {selecionados.map(({ item, quantidade }) => (
              <li key={item.id}>
                {item.produto}: <strong>{quantidade}</strong>
              </li>
            ))}
          </ul>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={`Devolver avulso — ${locacao.cliente}`}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleAvancar}>Devolver</Button>
        </>
      }
    >
      <Table
        columns={[
          { key: "produto", header: "Item", render: (item) => item.produto },
          { key: "quantidade", header: "Locado", render: (item) => item.quantidade },
          { key: "devolvido", header: "Já devolvido", render: (item) => item.quantidadeDevolvida },
          { key: "pendente", header: "Pendente", render: (item) => item.pendente },
          {
            key: "devolver",
            header: "Devolver agora",
            // O label do Input fica só para leitores de tela — o cabeçalho
            // da coluna já identifica o campo visualmente.
            render: (item) => (
              <div className="w-24 [&_label]:sr-only">
                <Input
                  label={`Quantidade a devolver de ${item.produto}`}
                  size="md"
                  type="number"
                  min={0}
                  max={item.pendente}
                  placeholder="0"
                  value={quantidades[item.id] ?? ""}
                  onChange={(event) => setQuantidades((atual) => ({ ...atual, [item.id]: event.target.value }))}
                />
              </div>
            ),
          },
        ]}
        data={pendentes}
        getRowKey={(item) => item.id}
        emptyMessage="Não há itens pendentes de devolução."
      />
    </Modal>
  );
}
