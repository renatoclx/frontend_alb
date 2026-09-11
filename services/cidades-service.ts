import { getAccessToken } from "@/utils/auth-storage";
import type { Cidade } from "@/types/cidade";
import type { PaginatedResult } from "@/types/api";
import { apiClient } from "@/utils/api-client";

interface CityApiModel {
  id: string;
  name: string;
}

function toCidade(city: CityApiModel): Cidade {
  return { id: city.id, nome: city.name };
}

// Busca por nome (combobox de cidade no cadastro/alteração de cliente).
export async function searchCidades(query: string): Promise<Cidade[]> {
  const term = query.trim();
  if (!term) return [];
  const token = getAccessToken();
  const params = new URLSearchParams({ limit: "8", search: term });
  const result = await apiClient.get<PaginatedResult<CityApiModel>>(
    `/cities?${params.toString()}`,
    token
  );
  return result.items.map(toCidade);
}

// Valida se a cidade digitada existe (create/update de cliente).
export async function findCidadeByNome(nome: string): Promise<Cidade | undefined> {
  const term = nome.trim().toLowerCase();
  if (!term) return undefined;
  const cidades = await searchCidades(nome);
  return cidades.find((cidade) => cidade.nome.toLowerCase() === term);
}
