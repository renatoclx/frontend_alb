import { getAccessToken } from "@/utils/auth-storage";
import type { Categoria } from "@/types/categoria";
import type { PaginatedResult } from "@/types/api";
import { apiClient } from "@/utils/api-client";

interface CategoryApiModel {
  id: string;
  name: string;
}

interface ProductApiModel {
  id: string;
  categoryId: string;
}

// A API não tem busca por nome nem retorna a quantidade de produtos junto
// da categoria — por isso buscamos tudo (limit alto) e calculamos a
// contagem no cliente, cruzando com a lista de produtos.
export async function listCategorias(): Promise<Categoria[]> {
  const token = getAccessToken();

  const [categoriesResult, productsResult] = await Promise.all([
    apiClient.get<PaginatedResult<CategoryApiModel>>("/categories?limit=1000", token),
    apiClient.get<PaginatedResult<ProductApiModel>>("/products?limit=1000", token),
  ]);

  const countByCategory = new Map<string, number>();
  for (const product of productsResult.items) {
    countByCategory.set(product.categoryId, (countByCategory.get(product.categoryId) ?? 0) + 1);
  }

  return categoriesResult.items.map((category) => ({
    id: category.id,
    nome: category.name,
    produtosCount: countByCategory.get(category.id) ?? 0,
  }));
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
