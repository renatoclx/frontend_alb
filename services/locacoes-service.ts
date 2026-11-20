import { getAccessToken } from "@/utils/auth-storage";
import type { Locacao, LocacaoDevolucao, LocacaoItem, LocacaoStatus } from "@/types/locacao";
import type { PaginatedResult } from "@/types/api";
import { apiClient } from "@/utils/api-client";

interface RentalItemApiModel {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: string;
  product?: { name: string };
}

interface RentalReturnApiModel {
  id: string;
  returnedAt: string;
  items: { rentalItemId: string; quantity: number }[];
}

interface RentalApiModel {
  id: string;
  clientId: string;
  total: string;
  startDate: string;
  expectedReturnDate: string;
  returnedAt: string | null;
  status: "ACTIVE" | "RETURNED" | "DELAY" | "PARTIALLY_RETURNED";
  items: RentalItemApiModel[];
  returns?: RentalReturnApiModel[];
  client?: {
    name: string;
    document: string;
    phone: string;
    city: { name: string } | null;
  };
}

const statusFromApi: Record<RentalApiModel["status"], LocacaoStatus> = {
  ACTIVE: "ativa",
  RETURNED: "devolvida",
  DELAY: "atrasada",
  PARTIALLY_RETURNED: "devolucao_parcial",
};

// Filtro de status usado na listagem — bate com o `?status=` do backend.
export type LocacaoStatusFilter = LocacaoStatus;

function toLocacao(rental: RentalApiModel): Locacao {
  const returns = rental.returns ?? [];
  const nomePorItem = new Map(rental.items.map((item) => [item.id, item.product?.name ?? ""]));

  const devolvidoPorItem = new Map<string, number>();
  for (const rentalReturn of returns) {
    for (const item of rentalReturn.items) {
      devolvidoPorItem.set(item.rentalItemId, (devolvidoPorItem.get(item.rentalItemId) ?? 0) + item.quantity);
    }
  }

  const itens: LocacaoItem[] = rental.items.map((item) => ({
    id: item.id,
    produtoId: item.productId,
    produto: item.product?.name ?? "",
    quantidade: item.quantity,
    quantidadeDevolvida: devolvidoPorItem.get(item.id) ?? 0,
    valorUnitario: Number(item.unitPrice),
  }));

  const devolucoes: LocacaoDevolucao[] = returns.map((rentalReturn) => ({
    id: rentalReturn.id,
    data: rentalReturn.returnedAt,
    itens: rentalReturn.items.map((item) => ({
      itemId: item.rentalItemId,
      produto: nomePorItem.get(item.rentalItemId) ?? "",
      quantidade: item.quantity,
    })),
  }));

  return {
    id: rental.id,
    clienteId: rental.clientId,
    cliente: rental.client?.name ?? "",
    clienteDocumento: rental.client?.document ?? "",
    clienteTelefone: rental.client?.phone ?? "",
    cidade: rental.client?.city?.name ?? "",
    dataInicio: rental.startDate,
    dataRetorno: rental.expectedReturnDate,
    dataDevolucao: rental.returnedAt,
    status: statusFromApi[rental.status],
    valorTotal: Number(rental.total),
    itens,
    devolucoes,
  };
}

export interface LocacoesQuery {
  page: number;
  limit: number;
  search?: string;
  status?: LocacaoStatusFilter;
}

export async function searchLocacoes(
  query: LocacoesQuery
): Promise<PaginatedResult<Locacao>> {
  const token = getAccessToken();
  const params = new URLSearchParams({
    page: String(query.page),
    limit: String(query.limit),
  });
  if (query.search?.trim()) params.set("search", query.search.trim());
  if (query.status) params.set("status", query.status);

  const result = await apiClient.get<PaginatedResult<RentalApiModel>>(
    `/rentals?${params.toString()}`,
    token
  );
  return {
    items: result.items.map(toLocacao),
    total: result.total,
    page: result.page,
    limit: result.limit,
  };
}

export interface LocacaoInput {
  clienteId: string;
  dataRetorno: string;
  itens: { produtoId: string; quantidade: number }[];
}

// Preço unitário e data de início não são enviados: a API sempre usa o
// rentalPrice do produto e a data/hora do servidor no momento da criação
// (não existe campo pra sobrescrever nenhum dos dois — ver docs/forms.md).
export async function createLocacao(input: LocacaoInput): Promise<Locacao> {
  const token = getAccessToken();
  const rental = await apiClient.post<RentalApiModel>(
    "/rentals",
    {
      clientId: input.clienteId,
      expectedReturnDate: input.dataRetorno,
      items: input.itens.map((item) => ({ productId: item.produtoId, quantity: item.quantidade })),
    },
    token
  );
  return toLocacao(rental);
}

// Devolve tudo o que ainda falta (após eventuais devoluções avulsas), muda o
// status para DEVOLVIDA e restaura o estoque — tudo feito pela API numa
// transação única (docs/screens.md, Locação > Listagem).
export async function devolverLocacao(id: string): Promise<Locacao> {
  const token = getAccessToken();
  const rental = await apiClient.patch<RentalApiModel>(`/rentals/${id}/return`, {}, token);
  return toLocacao(rental);
}

export interface DevolucaoItemInput {
  itemId: string;
  quantidade: number;
}

// Devolução avulsa: só os itens/quantidades informados voltam ao estoque. A
// API muda o status para DEVOLUÇÃO PARCIAL (ou DEVOLVIDA, se não sobrar nada).
export async function devolverItensLocacao(id: string, itens: DevolucaoItemInput[]): Promise<Locacao> {
  const token = getAccessToken();
  const rental = await apiClient.post<RentalApiModel>(
    `/rentals/${id}/returns`,
    { items: itens.map((item) => ({ rentalItemId: item.itemId, quantity: item.quantidade })) },
    token
  );
  return toLocacao(rental);
}

// Locação atualizada (itens, devoluções e status) — usada no detalhe das
// Últimas movimentações do Dashboard.
export async function getLocacao(id: string): Promise<Locacao> {
  const token = getAccessToken();
  const rental = await apiClient.get<RentalApiModel>(`/rentals/${id}`, token);
  return toLocacao(rental);
}
