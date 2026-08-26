import { getAccessToken } from "@/utils/auth-storage";
import type { Cidade } from "@/types/cidade";
import type { PaginatedResult } from "@/types/api";
import { apiClient } from "@/utils/api-client";

interface CityApiModel {
  id: string;
  name: string;
}

// A API não tem busca por nome, só paginação. Cidades praticamente não
// mudam em runtime, então buscamos a lista inteira uma vez (limit alto) e
// cacheamos em memória — o combobox filtra localmente a partir daí.
let cidadesCache: Cidade[] | null = null;

async function getAllCidades(): Promise<Cidade[]> {
  if (cidadesCache) return cidadesCache;
  const token = getAccessToken();
  const result = await apiClient.get<PaginatedResult<CityApiModel>>("/cities?limit=1000", token);
  cidadesCache = result.items.map((city) => ({ id: city.id, nome: city.name }));
  return cidadesCache;
}

export async function searchCidades(query: string): Promise<Cidade[]> {
  const term = query.trim().toLowerCase();
  if (!term) return [];
  const cidades = await getAllCidades();
  return cidades.filter((cidade) => cidade.nome.toLowerCase().includes(term)).slice(0, 8);
}

export async function findCidadeByNome(nome: string): Promise<Cidade | undefined> {
  const term = nome.trim().toLowerCase();
  const cidades = await getAllCidades();
  return cidades.find((cidade) => cidade.nome.toLowerCase() === term);
}

export async function findCidadeById(id: string): Promise<Cidade | undefined> {
  const cidades = await getAllCidades();
  return cidades.find((cidade) => cidade.id === id);
}
