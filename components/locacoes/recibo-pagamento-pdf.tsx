import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { CabecalhoEmpresaPdf } from "@/components/pdf/cabecalho-empresa-pdf";
import type { Locacao } from "@/types/locacao";
import { formatDate } from "@/utils/date";
import { formatMoney, maskDocumento, maskTelefone } from "@/utils/mask";

// Mesmo padrão visual do Contrato de Locação (A4): cabeçalho da empresa,
// dados do cliente, itens, valor recebido e assinatura no rodapé.
const styles = StyleSheet.create({
  page: { flexDirection: "column", padding: 57, fontSize: 10, color: "#1F1F1F", fontFamily: "Helvetica" },
  headerPanel: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E4E4E7",
    borderBottomStyle: "solid",
  },
  // flex: 1 — empurra o rodapé (valor e assinatura) pro final da folha.
  bodyPanel: { flex: 1 },
  title: { fontSize: 16, fontWeight: "bold", marginBottom: 12, textAlign: "center" },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  label: { color: "#71717A" },
  value: { fontWeight: "bold" },
  declaracao: { marginBottom: 12, lineHeight: 1.2 },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#1F1F1F",
    borderBottomStyle: "solid",
    paddingBottom: 4,
    marginBottom: 4,
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: "#E4E4E7",
    borderBottomStyle: "solid",
  },
  colNome: { width: "40%" },
  colQtd: { width: "20%", textAlign: "right" },
  colUnit: { width: "20%", textAlign: "right" },
  colTotal: { width: "20%", textAlign: "right" },
  footerPanel: { paddingTop: 16, borderTopWidth: 1, borderTopColor: "#E4E4E7", borderTopStyle: "solid" },
  total: { fontSize: 16, fontWeight: "bold", textAlign: "center", marginBottom: 32 },
  signature: { alignItems: "center", marginBottom: 24 },
  signatureBlank: { height: 36 },
  signatureLine: { width: 240, borderTopWidth: 1, borderTopColor: "#1F1F1F", borderTopStyle: "solid" },
  signatureName: { marginTop: 4, textAlign: "center" },
  emission: { fontSize: 8, color: "#71717A", textAlign: "center" },
});

interface ReciboPagamentoDocumentProps {
  locacao: Locacao;
  emitidoEm: Date;
}

export function ReciboPagamentoDocument({ locacao, emitidoEm }: ReciboPagamentoDocumentProps) {
  const horaEmissao = emitidoEm.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerPanel}>
          <CabecalhoEmpresaPdf />
          <Text style={styles.title}>Recibo de Pagamento</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Cliente</Text>
            <Text style={styles.value}>{locacao.cliente}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Documento</Text>
            <Text style={styles.value}>{maskDocumento(locacao.clienteDocumento)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Cidade</Text>
            <Text style={styles.value}>{locacao.cidade}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Telefone</Text>
            <Text style={styles.value}>{maskTelefone(locacao.clienteTelefone)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Data de Início</Text>
            <Text style={styles.value}>{formatDate(locacao.dataInicio)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Data de Devolução</Text>
            <Text style={styles.value}>{formatDate(locacao.dataRetorno)}</Text>
          </View>
        </View>

        <View style={styles.bodyPanel}>
          <Text style={styles.declaracao}>
            Recebemos de {locacao.cliente} a importância de {formatMoney(locacao.valorTotal)}, referente à locação dos
            equipamentos abaixo.
          </Text>
          <View style={styles.tableHeader}>
            <Text style={styles.colNome}>Item</Text>
            <Text style={styles.colQtd}>Quantidade</Text>
            <Text style={styles.colUnit}>Valor Unitário</Text>
            <Text style={styles.colTotal}>Valor Total</Text>
          </View>
          {locacao.itens.map((item) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={styles.colNome}>{item.produto}</Text>
              <Text style={styles.colQtd}>{item.quantidade}</Text>
              <Text style={styles.colUnit}>{formatMoney(item.valorUnitario)}</Text>
              <Text style={styles.colTotal}>{formatMoney(item.valorUnitario * item.quantidade)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.footerPanel}>
          <Text style={styles.total}>Valor recebido: {formatMoney(locacao.valorTotal)}</Text>

          <View style={styles.signature}>
            <View style={styles.signatureBlank} />
            <View style={styles.signatureLine} />
            <Text style={styles.signatureName}>Assinatura do Recebedor</Text>
          </View>

          <Text style={styles.emission}>
            Emitido em {formatDate(emitidoEm.toISOString())} às {horaEmissao}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
