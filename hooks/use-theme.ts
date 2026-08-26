"use client";

import { useCallback, useLayoutEffect, useSyncExternalStore } from "react";

const STORAGE_KEY = "locobra:theme";

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

// Mesma lógica do script anti-flash em app/layout.tsx — sem persistir
// quando não há preferência salva, pra não "fixar" o tema do SO como
// escolha explícita do usuário.
function resolveTheme(): Theme {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Em dev, o Strict Mode remonta o layout e reseta <html> só aos
  // atributos que o React conhece via JSX, apagando a classe "dark" que
  // o script anti-flash aplicou antes da hidratação (causa do warning de
  // hydration mismatch). Reaplica aqui — no-op em produção, onde a classe
  // já está correta. https://nextjs.org/docs/app/guides/preventing-flash-before-hydration#re-applying-attributes-in-development
  useLayoutEffect(() => {
    document.documentElement.classList.toggle("dark", resolveTheme() === "dark");
    listeners.forEach((listener) => listener());
  }, []);

  const toggleTheme = useCallback(() => {
    applyTheme(theme === "dark" ? "light" : "dark");
  }, [theme]);

  return { theme, toggleTheme };
}
