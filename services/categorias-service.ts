import type { Categoria } from "@/types/categoria";

// Dados mockados: ainda não há API de categorias.
const MOCK_CATEGORIAS: Categoria[] = [
  { id: "1", nome: "Andaimes", produtosCount: 8 },
  { id: "2", nome: "Betoneiras", produtosCount: 3 },
  { id: "3", nome: "Compactadores", produtosCount: 0 },
  { id: "4", nome: "Ferramentas Elétricas", produtosCount: 12 },
  { id: "5", nome: "Geradores", produtosCount: 0 },
  { id: "6", nome: "Escoras e Formas", produtosCount: 5 },
];

let nextId = MOCK_CATEGORIAS.length + 1;

export async function listCategorias(): Promise<Categoria[]> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return MOCK_CATEGORIAS;
}

function assertNomeDisponivel(nome: string) {
  const term = nome.trim().toLowerCase();
  const exists = MOCK_CATEGORIAS.some((categoria) => categoria.nome.toLowerCase() === term);
  if (exists) {
    throw new Error("Já existe uma categoria com este nome.");
  }
}

export async function createCategoria(nome: string): Promise<Categoria> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  assertNomeDisponivel(nome);
  const categoria: Categoria = { id: String(nextId++), nome: nome.trim(), produtosCount: 0 };
  MOCK_CATEGORIAS.push(categoria);
  return categoria;
}

export async function removeCategoria(id: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  const categoria = MOCK_CATEGORIAS.find((item) => item.id === id);
  if (!categoria) throw new Error("Categoria não encontrada.");
  if (categoria.produtosCount > 0) {
    throw new Error("Não é possível excluir uma categoria com produtos cadastrados.");
  }
  const index = MOCK_CATEGORIAS.findIndex((item) => item.id === id);
  MOCK_CATEGORIAS.splice(index, 1);
}
