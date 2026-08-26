// Formata uma data ISO (yyyy-MM-dd ou yyyy-MM-ddTHH:mm:ss...) para exibição
// no padrão dd/MM/yyyy. Não afeta inserção — o <input type="date"> continua
// usando o formato ISO nativamente, isso é só para texto exibido em tela.
export function formatDate(value: string | null | undefined): string {
  if (!value) return "-";
  const [year, month, day] = value.slice(0, 10).split("-");
  if (!year || !month || !day) return value;
  return `${day}/${month}/${year}`;
}

// Dias corridos entre uma data ISO passada e agora, arredondado pra cima —
// usado na tag "EM ATRASO HÁ XX DIA(S)" (docs/screens.md, Locação).
export function daysSince(value: string): number {
  const elapsedMs = Date.now() - new Date(value).getTime();
  return Math.max(1, Math.ceil(elapsedMs / (1000 * 60 * 60 * 24)));
}
