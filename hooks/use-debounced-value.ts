"use client";

import { useEffect, useState } from "react";

// Retorna `value` com atraso de `delayMs` — usado nos campos de busca das
// listagens pra não disparar uma requisição a cada tecla.
export function useDebouncedValue<T>(value: T, delayMs = 350): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(id);
  }, [value, delayMs]);

  return debounced;
}
