import type { Cidade } from "@/types/cidade";

// Dados mockados: ainda não há API de cidades. Representa a tabela de
// cidades já cadastradas, referenciada pelo cadastro de Cliente.
const MOCK_CIDADES: Cidade[] = [
  { id: "1", nome: "São Paulo" },
  { id: "2", nome: "Rio de Janeiro" },
  { id: "3", nome: "Campinas" },
  { id: "4", nome: "Jundiaí" },
  { id: "5", nome: "Santos" },
  { id: "6", nome: "Ribeirão Preto" },
  { id: "7", nome: "Belo Horizonte" },
  { id: "8", nome: "Curitiba" },
  { id: "9", nome: "Porto Alegre" },
  { id: "10", nome: "Salvador" },
  { id: "11", nome: "Recife" },
  { id: "12", nome: "Fortaleza" },
  { id: "13", nome: "Brasília" },
  { id: "14", nome: "Manaus" },
  { id: "15", nome: "Goiânia" },
];

export async function searchCidades(query: string): Promise<Cidade[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const term = query.trim().toLowerCase();
  if (!term) return [];
  return MOCK_CIDADES.filter((cidade) => cidade.nome.toLowerCase().includes(term)).slice(0, 8);
}

export async function findCidadeByNome(nome: string): Promise<Cidade | undefined> {
  const term = nome.trim().toLowerCase();
  return MOCK_CIDADES.find((cidade) => cidade.nome.toLowerCase() === term);
}
