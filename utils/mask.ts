export function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

// Máscara monetária: trata os dígitos digitados como centavos (padrão dos
// apps BR — "500" vira "5,00"), sem o prefixo "R$" (fica no ícone/adorno do
// campo, não no valor).
export function maskMoney(value: string): string {
  const digits = onlyDigits(value);
  if (!digits) return "";

  const cents = parseInt(digits, 10);
  const [intPart, decPart] = (cents / 100).toFixed(2).split(".");
  const withThousands = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${withThousands},${decPart}`;
}

// Converte o texto mascarado (ex.: "1.234,56") de volta para número.
export function parseMoney(value: string): number {
  const digits = onlyDigits(value);
  if (!digits) return 0;
  return parseInt(digits, 10) / 100;
}

// Exibição de um valor numérico já salvo (ex.: em listagens).
export function formatMoney(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// Formato muda sozinho conforme a quantidade de dígitos: até 10 dígitos vira
// fixo (##) ####-####, 11 dígitos vira celular (##) #####-####.
export function maskTelefone(value: string): string {
  const digits = onlyDigits(value).slice(0, 11);
  if (digits.length === 0) return "";

  const ddd = digits.slice(0, 2);
  const isCelular = digits.length > 10;
  const localDigits = digits.slice(2);
  const splitAt = isCelular ? 5 : 4;
  const localFirst = localDigits.slice(0, splitAt);
  const localSecond = localDigits.slice(splitAt);

  let result = `(${ddd}`;
  if (digits.length > 2) result += `) ${localFirst}`;
  if (localSecond) result += `-${localSecond}`;
  return result;
}

// Formato muda sozinho conforme a quantidade de dígitos: até 11 vira CPF
// (###.###.###-##), a partir do 12º dígito vira CNPJ (##.###.###/####-##).
export function maskDocumento(value: string): string {
  const digits = onlyDigits(value).slice(0, 14);

  if (digits.length <= 11) {
    return digits
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }

  return digits
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
}
