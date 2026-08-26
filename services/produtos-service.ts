import { getAccessToken } from "@/utils/auth-storage";
import { listCategorias } from "@/services/categorias-service";
import type { PaginatedResult } from "@/types/api";
import type { Produto, ProdutoInput, ProdutoTipo } from "@/types/produto";
import { ApiError, apiClient } from "@/utils/api-client";

interface ProductApiModel {
  id: string;
  name: string;
  reference: string | null;
  description: string | null;
  type: "SALE" | "RENTAL";
  purchasePrice: string;
  salePrice: string | null;
  rentalPrice: string | null;
  quantity: number;
  minimalQuantity: number;
  categoryId: string;
  deletedAt: string | null;
}

const tipoToApi: Record<ProdutoTipo, ProductApiModel["type"]> = {
  venda: "SALE",
  locacao: "RENTAL",
};

const tipoFromApi: Record<ProductApiModel["type"], ProdutoTipo> = {
  SALE: "venda",
  RENTAL: "locacao",
};

function toProduto(product: ProductApiModel, categoriaNome: string): Produto {
  return {
    id: product.id,
    nome: product.name,
    referencia: product.reference ?? "",
    descricao: product.description ?? "",
    tipo: tipoFromApi[product.type],
    precoCompra: Number(product.purchasePrice),
    precoVenda: product.salePrice !== null ? Number(product.salePrice) : null,
    precoLocacao: product.rentalPrice !== null ? Number(product.rentalPrice) : null,
    quantidade: product.quantity,
    quantidadeMinima: product.minimalQuantity,
    categoriaId: product.categoryId,
    categoria: categoriaNome,
    deletedAt: product.deletedAt,
  };
}

function toPayload(input: ProdutoInput) {
  return {
    name: input.nome,
    reference: input.referencia || undefined,
    description: input.descricao || undefined,
    type: tipoToApi[input.tipo],
    purchasePrice: input.precoCompra,
    salePrice: input.tipo === "venda" ? input.precoVenda : undefined,
    rentalPrice: input.tipo === "locacao" ? input.precoLocacao : undefined,
    quantity: input.quantidade,
    minimalQuantity: input.quantidadeMinima,
    categoryId: input.categoriaId,
  };
}

export async function listProdutos(): Promise<Produto[]> {
  const token = getAccessToken();
  const [productsResult, categorias] = await Promise.all([
    apiClient.get<PaginatedResult<ProductApiModel>>("/products?limit=1000", token),
    listCategorias(),
  ]);

  const nomeByCategoriaId = new Map(categorias.map((categoria) => [categoria.id, categoria.nome]));
  return productsResult.items.map((product) => toProduto(product, nomeByCategoriaId.get(product.categoryId) ?? ""));
}

export async function getProduto(id: string): Promise<Produto | undefined> {
  const token = getAccessToken();
  try {
    const [product, categorias] = await Promise.all([
      apiClient.get<ProductApiModel>(`/products/${id}`, token),
      listCategorias(),
    ]);
    const categoriaNome = categorias.find((categoria) => categoria.id === product.categoryId)?.nome ?? "";
    return toProduto(product, categoriaNome);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return undefined;
    throw error;
  }
}

export async function createProduto(input: ProdutoInput): Promise<void> {
  const token = getAccessToken();
  await apiClient.post<ProductApiModel>("/products", toPayload(input), token);
}

export async function updateProduto(id: string, input: ProdutoInput): Promise<void> {
  const token = getAccessToken();
  await apiClient.patch<ProductApiModel>(`/products/${id}`, toPayload(input), token);
}

export async function removeProduto(id: string): Promise<void> {
  const token = getAccessToken();
  await apiClient.delete<void>(`/products/${id}`, token);
}

export async function restoreProduto(id: string): Promise<void> {
  const token = getAccessToken();
  await apiClient.patch<ProductApiModel>(`/products/${id}/restore`, {}, token);
}
