export type LocacaoStatus = "ativa" | "devolvida" | "atrasada";

export interface LocacaoItem {
  id: string;
  produtoId: string;
  produto: string;
  quantidade: number;
  valorUnitario: number;
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
}
