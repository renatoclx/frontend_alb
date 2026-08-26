export interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  documento: string;
  dataNascimento: string | null;
  endereco: string;
  cidade: string;
  cityId: string;
  deletedAt: string | null;
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
