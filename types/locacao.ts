export type LocacaoStatus = "ativa" | "devolvida" | "atrasada" | "devolucao_parcial";

export interface LocacaoItem {
  id: string;
  produtoId: string;
  produto: string;
  quantidade: number;
  // Soma do que já voltou nas devoluções (parciais ou total).
  quantidadeDevolvida: number;
  valorUnitario: number;
}

export interface LocacaoDevolucaoItem {
  itemId: string;
  produto: string;
  quantidade: number;
}

// Uma devolução (avulsa ou total) registrada para a locação.
export interface LocacaoDevolucao {
  id: string;
  data: string;
  itens: LocacaoDevolucaoItem[];
}

export interface Locacao {
  id: string;
  clienteId: string;
  cliente: string;
  clienteDocumento: string;
  clienteTelefone: string;
  cidade: string;
  dataInicio: string;
  dataRetorno: string;
  dataDevolucao: string | null;
  status: LocacaoStatus;
  valorTotal: number;
  itens: LocacaoItem[];
  devolucoes: LocacaoDevolucao[];
}
