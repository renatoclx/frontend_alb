import { writeStoredSession } from "@/utils/auth-storage";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string | null;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, token } = options;

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    // 401 numa chamada que já tinha token = sessão inválida/expirada (o
    // JWT não tem refresh — ver docs/auth.md do backend). Diferente do 401
    // de credenciais erradas no próprio login, que não envia token nenhum.
    if (response.status === 401 && token) {
      writeStoredSession(null);
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      throw new ApiError("Sessão expirada. Faça login novamente.", 401);
    }

    const message = Array.isArray(data?.message) ? data.message.join(" ") : data?.message;
    throw new ApiError(message || "Erro inesperado ao comunicar com a API.", response.status);
  }

  return data as T;
}

export const apiClient = {
  get: <T>(path: string, token?: string | null) => request<T>(path, { token }),
  post: <T>(path: string, body: unknown, token?: string | null) =>
    request<T>(path, { method: "POST", body, token }),
  patch: <T>(path: string, body: unknown, token?: string | null) =>
    request<T>(path, { method: "PATCH", body, token }),
  delete: <T>(path: string, token?: string | null) => request<T>(path, { method: "DELETE", token }),
};
