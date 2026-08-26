"use client";

import { useCallback, useSyncExternalStore } from "react";
import { login as loginRequest } from "@/services/auth-service";
import type { AuthSession, LoginCredentials, User } from "@/types/auth";
import { readStoredSession, writeStoredSession } from "@/utils/auth-storage";

// Estado vive fora do React (módulo), não em useState: é o que permite
// múltiplos componentes usarem useAuth() e enxergarem o mesmo usuário
// sem precisar de Context/Provider.
const listeners = new Set<() => void>();
let cachedSession: AuthSession | null = null;
let hasReadStorage = false;

// Contrato exigido pelo useSyncExternalStore: registra um "avise-me
// quando mudar" e devolve a função de cancelamento da inscrição.
function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// Lê o localStorage apenas uma vez (cache em módulo) para que chamadas
// repetidas devolvam a mesma referência: o React usa Object.is nesse
// valor para decidir se precisa re-renderizar.
function getSnapshot(): User | null {
  if (!hasReadStorage) {
    cachedSession = readStoredSession();
    hasReadStorage = true;
  }
  return cachedSession?.user ?? null;
}

// Usado durante a renderização no servidor (Next.js SSR), onde
// localStorage não existe. Sem isso, useSyncExternalStore quebraria no
// servidor.
function getServerSnapshot() {
  return null;
}

// Único ponto que altera o estado de auth: grava no localStorage,
// atualiza o cache e avisa todos os componentes inscritos (listeners)
// para re-renderizarem com o novo valor.
function setStoredSession(session: AuthSession | null) {
  writeStoredSession(session);
  cachedSession = session;
  hasReadStorage = true;
  listeners.forEach((listener) => listener());
}

export function useAuth() {
  const user = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const session = await loginRequest(credentials);
    setStoredSession(session);
    return session.user;
  }, []);

  const logout = useCallback(() => {
    setStoredSession(null);
  }, []);

  return { user, isAuthenticated: !!user, login, logout };
}
