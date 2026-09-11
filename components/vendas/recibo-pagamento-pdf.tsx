import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { Venda } from "@/types/venda";
import { formatMoney, maskDocumento } from "@/utils/mask";

const styles = StyleSheet.create({
  page: { padding: 24, fontSize: 11, color: "#1F1F1F", fontFamily: "Helvetica" },
  card: {
    borderWidth: 1,
    borderColor: "#E4E4E7",
    borderStyle: "solid",
    borderRadius: 12,
    padding: 24,
  },
  title: { fontSize: 14, fontWeight: "bold", marginBottom: 24, textAlign: "center" },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  label: { color: "#71717A" },
  value: { fontWeight: "bold" },
  total: { fontSize: 16, fontWeight: "bold", marginTop: 16, marginBottom: 40, textAlign: "center" },
  signature: { alignItems: "center", marginBottom: 24 },
  signatureBlank: { height: 32 },
  signatureLine: { width: 200, borderTopWidth: 1, borderTopColor: "#1F1F1F", borderTopStyle: "solid" },
  signatureName: { marginTop: 4, textAlign: "center" },
  emission: { fontSize: 8, color: "#71717A", textAlign: "center" },
});

interface ReciboPagamentoVendaDocumentProps {
  venda: Venda;
  emitidoEm: Date;
}

export function ReciboPagamentoVendaDocument({ venda, emitidoEm }: ReciboPagamentoVendaDocumentProps) {
  const horaEmissao = emitidoEm.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  const dataEmissao = emitidoEm.toLocaleDateString("pt-BR");

  return (
    <Document>
      <Page size="A5" style={styles.page}>
        <View style={styles.card}>
          <Text style={styles.title}>Recibo de Pagamento</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Cliente</Text>
            <Text style={styles.value}>{venda.cliente}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Documento</Text>
            <Text style={styles.value}>{maskDocumento(venda.clienteDocumento)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Cidade</Text>
            <Text style={styles.value}>{venda.cidade}</Text>
          </View>

          <Text style={styles.total}>Valor recebido: {formatMoney(venda.valorTotal)}</Text>

          <View style={styles.signature}>
            <View style={styles.signatureBlank} />
            <View style={styles.signatureLine} />
            <Text style={styles.signatureName}>Assinatura do Recebedor</Text>
          </View>

          <Text style={styles.emission}>
            Emitido em {dataEmissao} às {horaEmissao}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
