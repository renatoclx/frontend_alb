"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Combobox } from "@/components/ui/combobox";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Table } from "@/components/ui/table";
import { RelatorioLocacaoDocument } from "@/components/locacoes/relatorio-locacao-pdf";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { listClientes } from "@/services/clientes-service";
import { createLocacao } from "@/services/locacoes-service";
import { listProdutos } from "@/services/produtos-service";
import type { Cliente } from "@/types/cliente";
import type { Produto } from "@/types/produto";
import { formatDate } from "@/utils/date";
import { formatMoney } from "@/utils/mask";
import { downloadPdf } from "@/utils/pdf";

interface ItemInserido {
  produto: Produto;
  quantidade: number;
}

const dataInicio = new Date().toISOString().slice(0, 10);

function amanha(): string {
  const data = new Date();
  data.setDate(data.getDate() + 1);
  return data.toISOString().slice(0, 10);
}

export default function NovaLocacaoPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { notify } = useToast();

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);

  // Cliente
  const [clienteBusca, setClienteBusca] = useState("");
  const [clienteOpcoes, setClienteOpcoes] = useState<Cliente[]>([]);
  const [clienteEscolhido, setClienteEscolhido] = useState<Cliente | null>(null);
  const [clienteConfirmado, setClienteConfirmado] = useState<Cliente | null>(null);

  // Datas
  const [dataRetorno, setDataRetorno] = useState("");

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

  const [showConfirmLocacao, setShowConfirmLocacao] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    listClientes().then(setClientes);
    listProdutos().then(setProdutos);
  }, []);

  const valorTotal = itens.reduce((soma, item) => soma + item.quantidade * (item.produto.precoLocacao ?? 0), 0);

  function handleClienteBuscaChange(value: string) {
    setClienteBusca(value);
    setClienteEscolhido(null);
    const termo = value.trim().toLowerCase();
    setClienteOpcoes(
      termo
        ? clientes
            .filter((cliente) => !cliente.deletedAt && cliente.nome.toLowerCase().includes(termo))
            .slice(0, 20)
        : []
    );
  }

  function handleClienteSelect(option: { id: string; nome: string }) {
    const cliente = clientes.find((item) => item.id === option.id) ?? null;
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

  function handleItemBuscaChange(value: string) {
    setItemBusca(value);
    setItemEscolhido(null);
    const termo = value.trim().toLowerCase();
    setItemOpcoes(
      termo
        ? produtos
            .filter(
              (produto) =>
                produto.tipo === "locacao" &&
                !produto.deletedAt &&
                produto.quantidade >= produto.quantidadeMinima &&
                produto.nome.toLowerCase().includes(termo)
            )
            .slice(0, 20)
        : []
    );
  }

  function handleItemSelect(option: { id: string; nome: string }) {
    const produto = produtos.find((item) => item.id === option.id) ?? null;
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

  function handleDataRetornoBlur() {
    if (dataRetorno && dataRetorno < dataInicio) {
      notify("error", "A data de devolução não pode ser anterior à data de início.");
    }
  }

  async function handleRealizarLocacao() {
    if (!clienteConfirmado || itens.length === 0) return;
    setIsSaving(true);
    try {
      const locacao = await createLocacao({
        clienteId: clienteConfirmado.id,
        dataRetorno,
        itens: itens.map((item) => ({ produtoId: item.produto.id, quantidade: item.quantidade })),
      });

      await downloadPdf(
        <RelatorioLocacaoDocument locacao={locacao} usuarioNome={user?.name ?? ""} emitidoEm={new Date()} />,
        `relatorio-locacao-${locacao.id}.pdf`
      );

      notify("success", "Locação realizada com sucesso.");
      router.push("/locacoes");
    } catch (error) {
      notify("error", error instanceof Error ? error.message : "Não foi possível realizar a locação.");
    } finally {
      setIsSaving(false);
      setShowConfirmLocacao(false);
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <h1 className="shrink-0 text-2xl font-semibold text-foreground">Realizar Locação</h1>

      <Card className="flex w-full min-h-0 flex-1 flex-col overflow-y-auto">
        <div className="flex min-h-0 flex-1 flex-col">
          <CardContent className="flex w-full flex-1 flex-col gap-8">
            {/* Cliente, Datas e Itens ficam lado a lado na primeira linha do
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
                  Datas da Locação
                </h2>
                {/* grid, não flex: o className do Input estiliza o <input>
                    interno, não a div que é o item da linha — grid garante
                    que cada campo ocupe metade da linha de verdade. */}
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Data de Início" size="xl" type="date" value={dataInicio} disabled />
                  <Input
                    label="Data de Devolução"
                    size="xl"
                    type="date"
                    required
                    min={amanha()}
                    value={dataRetorno}
                    onChange={(event) => setDataRetorno(event.target.value)}
                    onBlur={handleDataRetornoBlur}
                    disabled={!clienteConfirmado}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h2 className="border-b border-border pb-2 text-base font-semibold text-foreground">
                  Itens da Locação
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
                      placeholder="Buscar produto de locação..."
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
                      value={itemEscolhido ? formatMoney(itemEscolhido.precoLocacao ?? 0) : ""}
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
                      render: (item: ItemInserido) => formatMoney(item.produto.precoLocacao ?? 0),
                    },
                    {
                      key: "total",
                      header: "Valor Total",
                      render: (item: ItemInserido) => formatMoney(item.quantidade * (item.produto.precoLocacao ?? 0)),
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
                Valor total da Locação: {formatMoney(valorTotal)}
              </p>
            </div>
          </CardContent>

          <CardFooter className="justify-end">
            <Button type="button" size="xl" variant="secondary" href="/locacoes">
              Cancelar
            </Button>
            <Button
              type="button"
              size="xl"
              disabled={!clienteConfirmado || itens.length === 0 || !dataRetorno}
              onClick={() => setShowConfirmLocacao(true)}
            >
              Realizar Locação
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
              {formatMoney(itemPendente.produto.precoLocacao ?? 0)} ={" "}
              {formatMoney(itemPendente.quantidade * (itemPendente.produto.precoLocacao ?? 0))}
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
            Remover <strong>{itens[itemParaRemover]?.produto.nome}</strong> da locação?
          </p>
        )}
      </Modal>

      {/* Confirmação final da locação */}
      <Modal
        isOpen={showConfirmLocacao}
        onClose={() => setShowConfirmLocacao(false)}
        title="Confirmar Locação"
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowConfirmLocacao(false)}>
              Cancelar
            </Button>
            <Button isLoading={isSaving} onClick={handleRealizarLocacao}>
              Confirmar
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4 text-sm">
          <p>
            Cliente: <strong>{clienteConfirmado?.nome}</strong>
          </p>
          <p>Data de Devolução: {formatDate(dataRetorno)}</p>
          <ul className="flex flex-col gap-1">
            {itens.map((item) => (
              <li key={item.produto.id}>
                {item.quantidade}x {item.produto.nome} —{" "}
                {formatMoney(item.quantidade * (item.produto.precoLocacao ?? 0))}
              </li>
            ))}
          </ul>
          <p className="text-right font-semibold">Total: {formatMoney(valorTotal)}</p>
        </div>
      </Modal>
    </div>
  );
}
