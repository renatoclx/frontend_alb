"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Combobox } from "@/components/ui/combobox";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Table } from "@/components/ui/table";
import { RelatorioVendaDocument } from "@/components/vendas/relatorio-venda-pdf";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { searchClientesParaLancamento } from "@/services/clientes-service";
import { createVenda } from "@/services/vendas-service";
import { searchProdutosParaLancamento } from "@/services/produtos-service";
import type { Cliente } from "@/types/cliente";
import type { Produto } from "@/types/produto";
import { formatDate } from "@/utils/date";
import { formatMoney } from "@/utils/mask";
import { downloadPdf } from "@/utils/pdf";

interface ItemInserido {
  produto: Produto;
  quantidade: number;
}

const dataVenda = new Date().toISOString().slice(0, 10);

export default function NovaVendaPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { notify } = useToast();

  // Guardas de corrida — a última busca digitada vence.
  const clienteReqId = useRef(0);
  const itemReqId = useRef(0);

  // Cliente
  const [clienteBusca, setClienteBusca] = useState("");
  const [clienteOpcoes, setClienteOpcoes] = useState<Cliente[]>([]);
  const [clienteEscolhido, setClienteEscolhido] = useState<Cliente | null>(null);
  const [clienteConfirmado, setClienteConfirmado] = useState<Cliente | null>(null);

  // Item em edição
  const [itemBusca, setItemBusca] = useState("");
  const [itemOpcoes, setItemOpcoes] = useState<Produto[]>([]);
  const [itemEscolhido, setItemEscolhido] = useState<Produto | null>(null);
  const [itemQuantidade, setItemQuantidade] = useState("");

  // Itens inseridos
  const [itens, setItens] = useState<ItemInserido[]>([]);
  const [itemPendente, setItemPendente] = useState<ItemInserido | null>(null);
  const [avisoQuantidadeMinima, setAvisoQuantidadeMinima] = useState(false);
  const [itemParaRemover, setItemParaRemover] = useState<number | null>(null);

  const [showConfirmVenda, setShowConfirmVenda] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const valorTotal = itens.reduce((soma, item) => soma + item.quantidade * (item.produto.precoVenda ?? 0), 0);

  async function handleClienteBuscaChange(value: string) {
    setClienteBusca(value);
    setClienteEscolhido(null);
    const reqId = ++clienteReqId.current;
    const encontrados = await searchClientesParaLancamento(value);
    if (reqId !== clienteReqId.current) return;
    setClienteOpcoes(encontrados);
    const termo = value.trim().toLowerCase();
    setClienteEscolhido(encontrados.find((c) => c.nome.toLowerCase() === termo) ?? null);
  }

  function handleClienteSelect(option: { id: string; nome: string }) {
    const cliente = clienteOpcoes.find((item) => item.id === option.id) ?? null;
    setClienteEscolhido(cliente);
    setClienteBusca(cliente?.nome ?? "");
    setClienteOpcoes([]);
  }

  function handleConfirmarCliente() {
    if (!clienteEscolhido) {
      notify("error", "Cliente não encontrado.");
      return;
    }
    setClienteConfirmado(clienteEscolhido);
  }

  async function handleItemBuscaChange(value: string) {
    setItemBusca(value);
    setItemEscolhido(null);
    const reqId = ++itemReqId.current;
    const encontrados = await searchProdutosParaLancamento({ search: value, tipo: "venda" });
    if (reqId !== itemReqId.current) return;
    // Diferente da Locação, produtos abaixo da quantidade mínima continuam
    // listados (a doc de Venda não os exclui); só exige estoque > 0, já
    // garantido pelo backend ao filtrar `includeDeleted=false` + na inserção.
    const elegiveis = encontrados.filter((produto) => produto.quantidade > 0);
    setItemOpcoes(elegiveis);
    const termo = value.trim().toLowerCase();
    setItemEscolhido(elegiveis.find((produto) => produto.nome.toLowerCase() === termo) ?? null);
  }

  function handleItemSelect(option: { id: string; nome: string }) {
    const produto = itemOpcoes.find((item) => item.id === option.id) ?? null;
    setItemEscolhido(produto);
    setItemBusca(produto?.nome ?? "");
    setItemOpcoes([]);
  }

  function handleLimparItem() {
    setItemBusca("");
    setItemEscolhido(null);
    setItemQuantidade("");
  }

  function jaInseridoParaProduto(produtoId: string): number {
    return itens.filter((item) => item.produto.id === produtoId).reduce((soma, item) => soma + item.quantidade, 0);
  }

  function handleInserirItem() {
    if (!itemEscolhido) return;
    const quantidade = Number(itemQuantidade);
    if (!quantidade || quantidade <= 0) {
      notify("error", "Informe uma quantidade maior que zero.");
      return;
    }

    const jaInserido = jaInseridoParaProduto(itemEscolhido.id);
    const disponivel = itemEscolhido.quantidade - jaInserido;
    if (quantidade > disponivel) {
      notify("error", `Quantidade indisponível em estoque (disponível: ${disponivel}).`);
      return;
    }

    const estoqueResultante = disponivel - quantidade;
    setAvisoQuantidadeMinima(estoqueResultante <= itemEscolhido.quantidadeMinima);
    setItemPendente({ produto: itemEscolhido, quantidade });
  }

  function handleConfirmarInsercaoItem() {
    if (!itemPendente) return;
    setItens((prev) => [...prev, itemPendente]);
    setItemPendente(null);
    setAvisoQuantidadeMinima(false);
    handleLimparItem();
  }

  function handleConfirmarRemocao() {
    if (itemParaRemover === null) return;
    setItens((prev) => prev.filter((_, index) => index !== itemParaRemover));
    setItemParaRemover(null);
  }

  async function handleRealizarVenda() {
    if (!clienteConfirmado || itens.length === 0) return;
    setIsSaving(true);
    try {
      const venda = await createVenda({
        clienteId: clienteConfirmado.id,
        itens: itens.map((item) => ({ produtoId: item.produto.id, quantidade: item.quantidade })),
      });

      await downloadPdf(
        <RelatorioVendaDocument venda={venda} usuarioNome={user?.name ?? ""} emitidoEm={new Date()} />,
        `relatorio-venda-${venda.id}.pdf`
      );

      notify("success", "Venda realizada com sucesso.");
      router.push("/vendas");
    } catch (error) {
      notify("error", error instanceof Error ? error.message : "Não foi possível realizar a venda.");
    } finally {
      setIsSaving(false);
      setShowConfirmVenda(false);
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <h1 className="shrink-0 text-2xl font-semibold text-foreground">Realizar Venda</h1>

      <Card className="flex w-full min-h-0 flex-1 flex-col overflow-y-auto">
        <div className="flex min-h-0 flex-1 flex-col">
          <CardContent className="flex w-full flex-1 flex-col gap-8">
            {/* Cliente, Data e Itens ficam lado a lado na primeira linha do
                painel, ocupando a largura total (docs/screens.md). */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-start">
              <div className="flex flex-col gap-4">
                <h2 className="border-b border-border pb-2 text-base font-semibold text-foreground">Cliente</h2>
                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <Combobox
                      label="Buscar Cliente"
                      size="xl"
                      required
                      value={clienteBusca}
                      onChange={handleClienteBuscaChange}
                      onSelect={handleClienteSelect}
                      options={clienteOpcoes}
                      placeholder="Buscar cliente cadastrado..."
                    />
                  </div>
                  <Button
                    type="button"
                    size="xl"
                    disabled={!clienteBusca.trim() || (!!clienteEscolhido && clienteConfirmado?.id === clienteEscolhido.id)}
                    onClick={handleConfirmarCliente}
                  >
                    Confirmar
                  </Button>
                </div>
                {clienteConfirmado && (
                  <p className="text-sm text-success">
                    Cliente confirmado: <strong>{clienteConfirmado.nome}</strong> — {clienteConfirmado.cidade}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-4">
                <h2 className="border-b border-border pb-2 text-base font-semibold text-foreground">
                  Data da Venda
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Data da Venda" size="xl" type="date" value={dataVenda} disabled />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h2 className="border-b border-border pb-2 text-base font-semibold text-foreground">
                  Itens da Venda
                </h2>

                {/* flex-grow, sem wrap: esta coluna é 1/3 do painel, não a
                    largura da viewport. Cada campo precisa da própria div
                    com flex-* — o className do Input/Combobox estiliza o
                    elemento interno, não o item da linha. Busca fica maior
                    (flex-2) que o resto (flex-1). */}
                <div className="flex flex-nowrap items-end gap-3">
                  <div className="flex-2">
                    <Combobox
                      label="Inserir Item"
                      size="xl"
                      value={itemBusca}
                      onChange={handleItemBuscaChange}
                      onSelect={handleItemSelect}
                      options={itemOpcoes}
                      placeholder="Buscar produto de venda..."
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      label="Quantidade"
                      size="xl"
                      type="number"
                      min={1}
                      value={itemQuantidade}
                      onChange={(event) => setItemQuantidade(event.target.value)}
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      label="Preço Unitário"
                      size="xl"
                      value={itemEscolhido ? formatMoney(itemEscolhido.precoVenda ?? 0) : ""}
                      disabled
                    />
                  </div>
                  <Button
                    type="button"
                    size="xl"
                    icon={<Plus className="size-4" />}
                    disabled={!itemEscolhido || !itemQuantidade || !clienteConfirmado}
                    onClick={handleInserirItem}
                  />
                </div>
              </div>
            </div>

            {/* Tabela ocupa a largura total do painel (docs/screens.md) e rola
                internamente — o scroll fica nela, não no painel principal. */}
            <div className="flex w-full flex-1 flex-col gap-4">
              <div className="max-h-72 overflow-y-auto rounded-sm border border-border">
                <Table
                  columns={[
                    { key: "nome", header: "Nome do Equipamento", render: (item: ItemInserido) => item.produto.nome },
                    { key: "quantidade", header: "Quantidade", render: (item: ItemInserido) => item.quantidade },
                    {
                      key: "unitario",
                      header: "Valor Unitário",
                      render: (item: ItemInserido) => formatMoney(item.produto.precoVenda ?? 0),
                    },
                    {
                      key: "total",
                      header: "Valor Total",
                      render: (item: ItemInserido) => formatMoney(item.quantidade * (item.produto.precoVenda ?? 0)),
                    },
                    {
                      key: "acoes",
                      header: "",
                      render: (item: ItemInserido) => (
                        <IconButton
                          icon={<Trash2 className="size-4" />}
                          label="Remover item"
                          variant="danger"
                          onClick={() => setItemParaRemover(itens.indexOf(item))}
                        />
                      ),
                    },
                  ]}
                  data={itens}
                  getRowKey={(item) => item.produto.id}
                  emptyMessage="Nenhum item inserido ainda."
                />
              </div>

              <p className="text-right text-lg font-semibold text-foreground">
                Valor total da Venda: {formatMoney(valorTotal)}
              </p>
            </div>
          </CardContent>

          <CardFooter className="justify-end">
            <Button type="button" size="xl" variant="secondary" href="/vendas">
              Cancelar
            </Button>
            <Button
              type="button"
              size="xl"
              disabled={!clienteConfirmado || itens.length === 0}
              onClick={() => setShowConfirmVenda(true)}
            >
              Realizar Venda
            </Button>
          </CardFooter>
        </div>
      </Card>

      {/* Confirmação de inserção do item */}
      <Modal
        isOpen={!!itemPendente}
        onClose={() => {
          setItemPendente(null);
          setAvisoQuantidadeMinima(false);
        }}
        title="Confirmar inserção do item"
        size="sm"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setItemPendente(null);
                setAvisoQuantidadeMinima(false);
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleConfirmarInsercaoItem}>Inserir</Button>
          </>
        }
      >
        {itemPendente && (
          <div className="flex flex-col gap-3 text-sm text-foreground">
            <p>
              <strong>{itemPendente.produto.nome}</strong> — {itemPendente.quantidade}x{" "}
              {formatMoney(itemPendente.produto.precoVenda ?? 0)} ={" "}
              {formatMoney(itemPendente.quantidade * (itemPendente.produto.precoVenda ?? 0))}
            </p>
            {avisoQuantidadeMinima && (
              <p className="rounded-sm bg-warning/10 p-3 text-warning">
                Essa quantidade vai deixar o estoque deste item na quantidade mínima ou abaixo dela. Confirma a
                inserção mesmo assim?
              </p>
            )}
          </div>
        )}
      </Modal>

      {/* Confirmação de remoção do item */}
      <Modal
        isOpen={itemParaRemover !== null}
        onClose={() => setItemParaRemover(null)}
        title="Remover item"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setItemParaRemover(null)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleConfirmarRemocao}>
              Remover
            </Button>
          </>
        }
      >
        {itemParaRemover !== null && (
          <p className="text-sm text-foreground/70">
            Remover <strong>{itens[itemParaRemover]?.produto.nome}</strong> da venda?
          </p>
        )}
      </Modal>

      {/* Confirmação final da venda */}
      <Modal
        isOpen={showConfirmVenda}
        onClose={() => setShowConfirmVenda(false)}
        title="Confirmar Venda"
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowConfirmVenda(false)}>
              Cancelar
            </Button>
            <Button isLoading={isSaving} onClick={handleRealizarVenda}>
              Confirmar
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4 text-sm">
          <p>
            Cliente: <strong>{clienteConfirmado?.nome}</strong>
          </p>
          <p>Data da Venda: {formatDate(dataVenda)}</p>
          <ul className="flex flex-col gap-1">
            {itens.map((item) => (
              <li key={item.produto.id}>
                {item.quantidade}x {item.produto.nome} —{" "}
                {formatMoney(item.quantidade * (item.produto.precoVenda ?? 0))}
              </li>
            ))}
          </ul>
          <p className="text-right font-semibold">Total: {formatMoney(valorTotal)}</p>
        </div>
      </Modal>
    </div>
  );
}
