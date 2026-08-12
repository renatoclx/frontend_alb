import type { Cliente, ClienteInput } from "@/types/cliente";

// Dados mockados: ainda não há API de clientes. Volume suficiente para
// a paginação da tela fazer sentido visualmente.
const MOCK_CLIENTES: Cliente[] = [
  { id: "1", nome: "Construtora Horizonte Ltda", telefone: "(11) 3456-7890", email: "contato@horizonte.com.br", documento: "12.345.678/0001-90", dataNascimento: null, endereco: "Av. Paulista, 1000", cidade: "São Paulo", possuiHistorico: true },
  { id: "2", nome: "João Pereira Alves", telefone: "(11) 98765-4321", email: "joao.alves@email.com", documento: "123.456.789-00", dataNascimento: "1988-04-12", endereco: "Rua das Flores, 220", cidade: "São Paulo", possuiHistorico: false },
  { id: "3", nome: "Terraplanagem Silva & Filhos", telefone: "(19) 3322-1100", email: "contato@silvafilhos.com.br", documento: "23.456.789/0001-11", dataNascimento: null, endereco: "Rua Barão de Jundiaí, 45", cidade: "Jundiaí", possuiHistorico: true },
  { id: "4", nome: "Mariana Costa Lima", telefone: "(11) 91234-5678", email: "mariana.lima@email.com", documento: "234.567.890-11", dataNascimento: "1995-09-03", endereco: "Rua Augusta, 512", cidade: "São Paulo", possuiHistorico: false },
  { id: "5", nome: "Engenharia Bravo S.A.", telefone: "(21) 2244-5566", email: "financeiro@bravoeng.com.br", documento: "34.567.890/0001-22", dataNascimento: null, endereco: "Av. Rio Branco, 300", cidade: "Rio de Janeiro", possuiHistorico: false },
  { id: "6", nome: "Carlos Eduardo Santos", telefone: "(19) 99887-6655", email: "carlos.santos@email.com", documento: "345.678.901-22", dataNascimento: "1979-01-20", endereco: "Rua Sete de Setembro, 88", cidade: "Campinas", possuiHistorico: false },
  { id: "7", nome: "Pavimentadora Nova Era", telefone: "(11) 4433-2211", email: "comercial@novaera.com.br", documento: "45.678.901/0001-33", dataNascimento: null, endereco: "Rua Voluntários da Pátria, 640", cidade: "São Paulo", possuiHistorico: false },
  { id: "8", nome: "Fernanda Oliveira Souza", telefone: "(11) 97766-5544", email: "fernanda.souza@email.com", documento: "456.789.012-33", dataNascimento: "1992-11-30", endereco: "Rua Oscar Freire, 120", cidade: "São Paulo", possuiHistorico: false },
  { id: "9", nome: "Construtora Alicerce Forte", telefone: "(13) 3211-9900", email: "contato@alicerceforte.com.br", documento: "56.789.012/0001-44", dataNascimento: null, endereco: "Av. Ana Costa, 210", cidade: "Santos", possuiHistorico: false },
  { id: "10", nome: "Roberto Nunes Barbosa", telefone: "(11) 96655-4433", email: "roberto.barbosa@email.com", documento: "567.890.123-44", dataNascimento: "1983-06-17", endereco: "Rua Vergueiro, 900", cidade: "São Paulo", possuiHistorico: false },
  { id: "11", nome: "Locação e Serviços Del Rey", telefone: "(16) 3344-5522", email: "atendimento@delrey.com.br", documento: "67.890.123/0001-55", dataNascimento: null, endereco: "Av. São Carlos, 1500", cidade: "Ribeirão Preto", possuiHistorico: false },
  { id: "12", nome: "Patrícia Almeida Rocha", telefone: "(11) 95544-3322", email: "patricia.rocha@email.com", documento: "678.901.234-55", dataNascimento: "1990-02-08", endereco: "Rua Haddock Lobo, 75", cidade: "São Paulo", possuiHistorico: false },
];

let nextId = MOCK_CLIENTES.length + 1;

export async function listClientes(): Promise<Cliente[]> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return MOCK_CLIENTES;
}

export async function getCliente(id: string): Promise<Cliente | undefined> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return MOCK_CLIENTES.find((cliente) => cliente.id === id);
}

export async function createCliente(input: ClienteInput): Promise<Cliente> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  const cliente: Cliente = { id: String(nextId++), possuiHistorico: false, ...input };
  MOCK_CLIENTES.push(cliente);
  return cliente;
}

export async function updateCliente(id: string, input: ClienteInput): Promise<Cliente> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  const index = MOCK_CLIENTES.findIndex((cliente) => cliente.id === id);
  if (index === -1) throw new Error("Cliente não encontrado.");
  const updated: Cliente = { ...MOCK_CLIENTES[index], ...input };
  MOCK_CLIENTES[index] = updated;
  return updated;
}

export async function removeCliente(id: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  const cliente = MOCK_CLIENTES.find((item) => item.id === id);
  if (!cliente) throw new Error("Cliente não encontrado.");
  if (cliente.possuiHistorico) {
    throw new Error("Este cliente possui histórico e não pode ser excluído.");
  }
  const index = MOCK_CLIENTES.findIndex((item) => item.id === id);
  MOCK_CLIENTES.splice(index, 1);
}
