import type { ReactElement } from "react";
import { pdf } from "@react-pdf/renderer";

// Gera o blob do documento e dispara o download no navegador via um link
// temporário — usado pelas ações "Imprimir Relatório"/"Gerar Recibo" da
// listagem de Locações (docs/screens.md).
export async function downloadPdf(document: ReactElement, filename: string): Promise<void> {
  const blob = await pdf(document).toBlob();
  const url = URL.createObjectURL(blob);
  const link = window.document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
