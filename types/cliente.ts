export interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  documento: string;
  dataNascimento: string | null;
  endereco: string;
  cidade: string;
  possuiHistorico: boolean;
}

export interface ClienteInput {
  nome: string;
  email: string;
  telefone: string;
  documento: string;
  dataNascimento: string | null;
  endereco: string;
  cidade: string;
}
