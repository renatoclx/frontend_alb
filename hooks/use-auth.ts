"use client";

import { useCallback, useSyncExternalStore } from "react";
import { login as loginRequest } from "@/services/auth-service";
import type { LoginCredentials, User } from "@/types/auth";

const STORAGE_KEY = "alb_locacoes:auth-user";

// Estado vive fora do React (módulo), não em useState: é o que permite
// múltiplos componentes usarem useAuth() e enxergarem o mesmo usuário
// sem precisar de Context/Provider.
const listeners = new Set<() => void>();
let cachedUser: User | null = null;
let hasReadStorage = false;

// localStorage só existe no navegador; o try/catch cobre acesso em
// modo privado/bloqueado, onde a leitura pode lançar erro.
function readStoredUser(): User | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

// Contrato exigido pelo useSyncExternalStore: registra um "avise-me
// quando mudar" e devolve a função de cancelamento da inscrição.
function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// Lê o localStorage apenas uma vez (cache em módulo) para que chamadas
// repetidas devolvam a mesma referência: o React usa Object.is nesse
// valor para decidir se precisa re-renderizar.
function getSnapshot() {
  if (!hasReadStorage) {
    cachedUser = readStoredUser();
    hasReadStorage = true;
  }
  return cachedUser;
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
function setStoredUser(user: User | null) {
  if (user) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } else {
    window.localStorage.removeItem(STORAGE_KEY);
  }
  cachedUser = user;
  hasReadStorage = true;
  listeners.forEach((listener) => listener());
}

// Hook de autenticação mock. Usa useSyncExternalStore em vez de
// useState + useEffect porque o valor inicial vem de uma fonte externa
// ao React (localStorage): chamar setState dentro de um efeito no
// mount causa re-render em cascata (alerta do eslint-plugin-react-hooks)
// e ainda arrisca inconsistência entre a renderização do servidor e a
// do cliente. useSyncExternalStore resolve os dois problemas.
export function useAuth() {
  const user = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const loggedUser = await loginRequest(credentials);
    setStoredUser(loggedUser);
    return loggedUser;
  }, []);

  const logout = useCallback(() => {
    setStoredUser(null);
  }, []);

  return { user, isAuthenticated: !!user, login, logout };
}
