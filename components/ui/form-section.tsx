import { ReactNode } from "react";

interface FormSectionProps {
  title: string;
  children: ReactNode;
}

// Agrupamento por seção — obrigatório em formulários com mais de uma seção
// lógica de dados (docs/forms.md). Grid uniforme de 2 colunas.
export function FormSection({ title, children }: FormSectionProps) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="border-b border-border pb-2 text-base font-semibold text-foreground">{title}</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">{children}</div>
    </div>
  );
}
