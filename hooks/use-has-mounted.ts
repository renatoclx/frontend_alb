"use client";

import { useSyncExternalStore } from "react";

// Truque padrão para saber se já passamos da hidratação: getSnapshot não
// lê nada externo (sempre true), então não há corrida com o momento em
// que o React resolve o valor — diferente de um useState+useEffect, que
// só reflete a mudança depois de um ciclo extra de efeito.
function subscribe() {
  return () => {};
}

function getSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

export function useHasMounted() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
