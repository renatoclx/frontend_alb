import { getAccessToken } from "@/utils/auth-storage";
import type { Categoria } from "@/types/categoria";
import type { PaginatedResult } from "@/types/api";
import { apiClient } from "@/utils/api-client";

interface CategoryApiModel {
  id: string;
  name: string;
  productsCount?: number;
}

function toCategoria(category: CategoryApiModel): Categoria {
  return {
    id: category.id,
    nome: category.name,
    produtosCount: category.productsCount ?? 0,
  };
}

// Lista completa — usada para resolver o nome da categoria em outras telas
// (ex.: listagem de Produtos). A contagem de produtos vem pronta da API.
export async function listCategorias(): Promise<Categoria[]> {
  const token = getAccessToken();
  const result = await apiClient.get<PaginatedResult<CategoryApiModel>>(
    "/categories?limit=1000",
    token
  );
  return result.items.map(toCategoria);
}

export interface CategoriasQuery {
  page: number;
  limit: number;
  search?: string;
}

// Listagem paginada com busca server-side por nome (tela /categorias).
export async function searchCategorias(
  query: CategoriasQuery
): Promise<PaginatedResult<Categoria>> {
  const token = getAccessToken();
  const params = new URLSearchParams({
    page: String(query.page),
    limit: String(query.limit),
  });
  if (query.search?.trim()) params.set("search", query.search.trim());

  const result = await apiClient.get<PaginatedResult<CategoryApiModel>>(
    `/categories?${params.toString()}`,
    token
  );
  return {
    items: result.items.map(toCategoria),
    total: result.total,
    page: result.page,
    limit: result.limit,
  };
}

export async function createCategoria(nome: string): Promise<Categoria> {
  const token = getAccessToken();
  const category = await apiClient.post<CategoryApiModel>("/categories", { name: nome.trim() }, token);
  return { id: category.id, nome: category.name, produtosCount: 0 };
}

export async function removeCategoria(id: string): Promise<void> {
  const token = getAccessToken();
  await apiClient.delete<void>(`/categories/${id}`, token);
}
