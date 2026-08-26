import { getAccessToken } from "@/utils/auth-storage";
import { listClientes } from "@/services/clientes-service";
import { listProdutos } from "@/services/produtos-service";
import type { Cliente } from "@/types/cliente";
import type { Produto } from "@/types/produto";
import type { Locacao, LocacaoItem, LocacaoStatus } from "@/types/locacao";
import type { PaginatedResult } from "@/types/api";
import { apiClient } from "@/utils/api-client";

interface RentalItemApiModel {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: string;
}

interface RentalApiModel {
  id: string;
  clientId: string;
  total: string;
  startDate: string;
  expectedReturnDate: string;
  returnedAt: string | null;
  status: "ACTIVE" | "RETURNED" | "DELAY";
  items: RentalItemApiModel[];
}

const statusFromApi: Record<RentalApiModel["status"], LocacaoStatus> = {
  ACTIVE: "ativa",
  RETURNED: "devolvida",
  DELAY: "atrasada",
};

function toLocacao(
  rental: RentalApiModel,
  clienteById: Map<string, Cliente>,
  produtoById: Map<string, Produto>
): Locacao {
  const cliente = clienteById.get(rental.clientId);

  const itens: LocacaoItem[] = rental.items.map((item) => ({
    id: item.id,
    produtoId: item.productId,
    produto: produtoById.get(item.productId)?.nome ?? "",
    quantidade: item.quantity,
    valorUnitario: Number(item.unitPrice),
  }));

  return {
    id: rental.id,
    clienteId: rental.clientId,
    cliente: cliente?.nome ?? "",
    clienteDocumento: cliente?.documento ?? "",
    clienteTelefone: cliente?.telefone ?? "",
    cidade: cliente?.cidade ?? "",
    dataInicio: rental.startDate,
    dataRetorno: rental.expectedReturnDate,
    dataDevolucao: rental.returnedAt,
    status: statusFromApi[rental.status],
    valorTotal: Number(rental.total),
    itens,
  };
}

export async function listLocacoes(): Promise<Locacao[]> {
  const token = getAccessToken();
  const [rentalsResult, clientes, produtos] = await Promise.all([
    apiClient.get<PaginatedResult<RentalApiModel>>("/rentals?limit=1000", token),
    listClientes(),
    listProdutos(),
  ]);

  const clienteById = new Map(clientes.map((cliente) => [cliente.id, cliente]));
  const produtoById = new Map(produtos.map((produto) => [produto.id, produto]));

  return rentalsResult.items.map((rental) => toLocacao(rental, clienteById, produtoById));
}
