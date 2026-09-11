export interface VendaItem {
  id: string;
  produtoId: string;
  produto: string;
  quantidade: number;
  valorUnitario: number;
}

export interface Venda {
  id: string;
  clienteId: string;
  cliente: string;
  clienteDocumento: string;
  clienteTelefone: string;
  cidade: string;
  dataVenda: string;
  valorTotal: number;
  itens: VendaItem[];
}
