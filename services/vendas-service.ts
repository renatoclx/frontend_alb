import { getAccessToken } from "@/utils/auth-storage";
import type { Venda, VendaItem } from "@/types/venda";
import type { PaginatedResult } from "@/types/api";
import { apiClient } from "@/utils/api-client";

interface SaleItemApiModel {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: string;
  product?: { name: string };
}

interface SaleApiModel {
  id: string;
  clientId: string;
  total: string;
  createdAt: string;
  items: SaleItemApiModel[];
  client?: {
    name: string;
    document: string;
    phone: string;
    city: { name: string } | null;
  };
}

function toVenda(sale: SaleApiModel): Venda {
  const itens: VendaItem[] = sale.items.map((item) => ({
    id: item.id,
    produtoId: item.productId,
    produto: item.product?.name ?? "",
    quantidade: item.quantity,
    valorUnitario: Number(item.unitPrice),
  }));

  return {
    id: sale.id,
    clienteId: sale.clientId,
    cliente: sale.client?.name ?? "",
    clienteDocumento: sale.client?.document ?? "",
    clienteTelefone: sale.client?.phone ?? "",
    cidade: sale.client?.city?.name ?? "",
    dataVenda: sale.createdAt,
    valorTotal: Number(sale.total),
    itens,
  };
}

export interface VendasQuery {
  page: number;
  limit: number;
  clienteSearch?: string;
  produtoSearch?: string;
}

export async function searchVendas(
  query: VendasQuery
): Promise<PaginatedResult<Venda>> {
  const token = getAccessToken();
  const params = new URLSearchParams({
    page: String(query.page),
    limit: String(query.limit),
  });
  if (query.clienteSearch?.trim()) params.set("search", query.clienteSearch.trim());
  if (query.produtoSearch?.trim()) params.set("productSearch", query.produtoSearch.trim());

  const result = await apiClient.get<PaginatedResult<SaleApiModel>>(
    `/sales?${params.toString()}`,
    token
  );
  return {
    items: result.items.map(toVenda),
    total: result.total,
    page: result.page,
    limit: result.limit,
  };
}

export interface VendaInput {
  clienteId: string;
  itens: { produtoId: string; quantidade: number }[];
}

// Preço unitário e data da venda não são enviados: a API sempre usa o
// salePrice do produto e a data/hora do servidor no momento da criação
// (CreateSaleDto só aceita clientId + items) — ver docs/screens.md, Vendas.
export async function createVenda(input: VendaInput): Promise<Venda> {
  const token = getAccessToken();
  const sale = await apiClient.post<SaleApiModel>(
    "/sales",
    {
      clientId: input.clienteId,
      items: input.itens.map((item) => ({ productId: item.produtoId, quantity: item.quantidade })),
    },
    token
  );
  return toVenda(sale);
}
