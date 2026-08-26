import type { AuthSession } from "@/types/auth";

const STORAGE_KEY = "locobra:auth-session";

// Fonte única de leitura/escrita da sessão no localStorage. Fica fora de
// hooks/use-auth.ts para poder ser usado também pelo utils/api-client.ts
// sem criar dependência circular (api-client -> use-auth -> auth-service ->
// api-client).
export function readStoredSession(): AuthSession | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthSession) : null;
  } catch {
    return null;
  }
}

export function writeStoredSession(session: AuthSession | null): void {
  if (session) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } else {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}

export function getAccessToken(): string | null {
  return readStoredSession()?.accessToken ?? null;
}
