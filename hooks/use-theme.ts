"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "alb_locacoes:theme";

type Theme = "light" | "dark";

const listeners = new Set<() => void>();

// A fonte da verdade é a classe "dark" no <html>, não uma variável em
// memória: quem define essa classe primeiro é o script inline no
// app/layout.tsx (roda antes do React hidratar, evitando flash de
// tema errado). Este hook só leem/alteram essa classe.
function getSnapshot(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

// Valor usado na renderização do servidor. Não precisa refletir o
// tema real: o script anti-flash já corrige a classe no cliente antes
// da primeira pintura, e o React resincroniza sozinho após hidratar.
function getServerSnapshot(): Theme {
  return "light";
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// Alterna a classe no <html>, persiste a escolha (para acessos
// futuros) e avisa os componentes inscritos para re-renderizar.
function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  window.localStorage.setItem(STORAGE_KEY, theme);
  listeners.forEach((listener) => listener());
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleTheme = useCallback(() => {
    applyTheme(theme === "dark" ? "light" : "dark");
  }, [theme]);

  return { theme, toggleTheme };
}
