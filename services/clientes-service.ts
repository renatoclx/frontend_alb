import { getAccessToken } from "@/utils/auth-storage";
import { findCidadeById, findCidadeByNome } from "@/services/cidades-service";
import type { Cliente, ClienteInput } from "@/types/cliente";
import type { PaginatedResult } from "@/types/api";
import { ApiError, apiClient } from "@/utils/api-client";

interface ClientApiModel {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  birthDate: string | null;
  document: string;
  address: string;
  cityId: string;
  deletedAt: string | null;
}

async function toCliente(client: ClientApiModel): Promise<Cliente> {
  const cidade = await findCidadeById(client.cityId);
  return {
    id: client.id,
    nome: client.name,
    email: client.email ?? "",
    telefone: client.phone,
    documento: client.document,
    dataNascimento: client.birthDate ? client.birthDate.slice(0, 10) : null,
    endereco: client.address,
    cidade: cidade?.nome ?? "",
    cityId: client.cityId,
    deletedAt: client.deletedAt,
  };
}

async function resolveCityId(nomeCidade: string): Promise<string> {
  const cidade = await findCidadeByNome(nomeCidade);
  if (!cidade) {
    throw new Error("Cidade não encontrada. Selecione uma cidade cadastrada.");
  }
  return cidade.id;
}

export async function listClientes(): Promise<Cliente[]> {
  const token = getAccessToken();
  const result = await apiClient.get<PaginatedResult<ClientApiModel>>("/clients?limit=1000", token);
  return Promise.all(result.items.map(toCliente));
}

export async function getCliente(id: string): Promise<Cliente | undefined> {
  const token = getAccessToken();
  try {
    const client = await apiClient.get<ClientApiModel>(`/clients/${id}`, token);
    return await toCliente(client);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return undefined;
    throw error;
  }
}

export async function createCliente(input: ClienteInput): Promise<Cliente> {
  const token = getAccessToken();
  const cityId = await resolveCityId(input.cidade);
  const client = await apiClient.post<ClientApiModel>(
    "/clients",
    {
      name: input.nome,
      email: input.email || undefined,
      phone: input.telefone,
      birthDate: input.dataNascimento || undefined,
      document: input.documento,
      address: input.endereco,
      cityId,
    },
    token
  );
  return toCliente(client);
}

// birthDate não entra aqui de propósito: a API não permite alterar a data
// de nascimento depois do cadastro (ver docs/business-rules.md do backend).
export async function updateCliente(id: string, input: ClienteInput): Promise<Cliente> {
  const token = getAccessToken();
  const cityId = await resolveCityId(input.cidade);
  const client = await apiClient.patch<ClientApiModel>(
    `/clients/${id}`,
    {
      name: input.nome,
      email: input.email || undefined,
      phone: input.telefone,
      document: input.documento,
      address: input.endereco,
      cityId,
    },
    token
  );
  return toCliente(client);
}

export async function removeCliente(id: string): Promise<void> {
  const token = getAccessToken();
  await apiClient.delete<void>(`/clients/${id}`, token);
}

export async function restoreCliente(id: string): Promise<Cliente> {
  const token = getAccessToken();
  const client = await apiClient.patch<ClientApiModel>(`/clients/${id}/restore`, {}, token);
  return toCliente(client);
}
