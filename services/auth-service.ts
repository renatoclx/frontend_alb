import { apiClient } from "@/utils/api-client";
import { decodeJwtPayload } from "@/utils/jwt";
import type { AuthSession, LoginCredentials, User } from "@/types/auth";

interface LoginResponse {
  accessToken: string;
}

export async function login(credentials: LoginCredentials): Promise<AuthSession> {
  const { accessToken } = await apiClient.post<LoginResponse>("/auth/login", credentials);
  const { sub } = decodeJwtPayload(accessToken);
  const user = await apiClient.get<User>(`/users/${sub}`, accessToken);
  return { user, accessToken };
}

// A API ainda não tem endpoint de recuperação de senha. Mantido como mock
// até o backend implementar — não valida se o e-mail existe na base.
export async function requestPasswordReset(email: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 600));
}
