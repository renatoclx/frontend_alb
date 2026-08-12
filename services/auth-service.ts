import type { LoginCredentials, User } from "@/types/auth";

const MOCK_USER: User = {
  id: "1",
  name: "Usuário Teste",
  email: "admin@albmaquinas.com.br",
};

const MOCK_PASSWORD = "senha123";

// Mock temporário: simula a latência e o contrato (Promise<User> ou
// erro) de uma chamada de API real. Quando o backend de autenticação
// existir, só esta função muda — hook e páginas continuam iguais.
export async function login(credentials: LoginCredentials): Promise<User> {
  await new Promise((resolve) => setTimeout(resolve, 600));

  if (
    credentials.email !== MOCK_USER.email ||
    credentials.password !== MOCK_PASSWORD
  ) {
    throw new Error("E-mail ou senha inválidos.");
  }

  return MOCK_USER;
}
