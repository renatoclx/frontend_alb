export type ProdutoTipo = "venda" | "locacao";

export interface Produto {
  id: string;
  nome: string;
  referencia: string;
  descricao: string;
  tipo: ProdutoTipo;
  precoCompra: number;
  precoVenda: number | null;
  precoLocacao: number | null;
  quantidade: number;
  quantidadeMinima: number;
  categoriaId: string;
  categoria: string;
  deletedAt: string | null;
}

export interface ProdutoInput {
  nome: string;
  referencia: string;
  descricao: string;
  tipo: ProdutoTipo;
  precoCompra: number;
  precoVenda: number | null;
  precoLocacao: number | null;
  quantidade: number;
  quantidadeMinima: number;
  categoriaId: string;
}
