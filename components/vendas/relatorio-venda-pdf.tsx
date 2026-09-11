import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { Venda } from "@/types/venda";
import { formatDate } from "@/utils/date";
import { formatMoney, maskDocumento, maskTelefone } from "@/utils/mask";

const styles = StyleSheet.create({
  page: { flexDirection: "column", padding: 32, fontSize: 10, color: "#1F1F1F", fontFamily: "Helvetica" },
  headerPanel: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E4E4E7",
    borderBottomStyle: "solid",
  },
  // flex: 1 — o corpo ocupa todo o espaço sobrando na folha, empurrando o
  // rodapé pro final da página (docs/screens.md: "fixar o rodapé no final
  // da folha A4, deixando o espaço maior para os itens locados").
  bodyPanel: { flex: 1 },
  title: { fontSize: 16, fontWeight: "bold", marginBottom: 12, textAlign: "center" },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  label: { color: "#71717A" },
  value: { fontWeight: "bold" },
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
  footerTotal: { fontSize: 12, fontWeight: "bold", textAlign: "right", marginBottom: 32 },
  signature: { alignItems: "center", marginBottom: 24 },
  signatureBlank: { height: 36 },
  signatureLine: { width: 240, borderTopWidth: 1, borderTopColor: "#1F1F1F", borderTopStyle: "solid" },
  signatureName: { marginTop: 4, textAlign: "center" },
  emission: { fontSize: 8, color: "#71717A", textAlign: "center" },
});

interface RelatorioVendaDocumentProps {
  venda: Venda;
  usuarioNome: string;
  emitidoEm: Date;
}

export function RelatorioVendaDocument({ venda, usuarioNome, emitidoEm }: RelatorioVendaDocumentProps) {
  const horaEmissao = emitidoEm.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerPanel}>
          <Text style={styles.title}>Documento de Venda de Equipamentos</Text>
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
          <View style={styles.row}>
            <Text style={styles.label}>Telefone</Text>
            <Text style={styles.value}>{maskTelefone(venda.clienteTelefone)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Data da Venda</Text>
            <Text style={styles.value}>{formatDate(venda.dataVenda)}</Text>
          </View>
        </View>

        <View style={styles.bodyPanel}>
          <View style={styles.tableHeader}>
            <Text style={styles.colNome}>Item</Text>
            <Text style={styles.colQtd}>Quantidade</Text>
            <Text style={styles.colUnit}>Valor Unitário</Text>
            <Text style={styles.colTotal}>Valor Total</Text>
          </View>
          {venda.itens.map((item) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={styles.colNome}>{item.produto}</Text>
              <Text style={styles.colQtd}>{item.quantidade}</Text>
              <Text style={styles.colUnit}>{formatMoney(item.valorUnitario)}</Text>
              <Text style={styles.colTotal}>{formatMoney(item.valorUnitario * item.quantidade)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.footerPanel}>
          <Text style={styles.footerTotal}>Valor total da Venda: {formatMoney(venda.valorTotal)}</Text>

          <View style={styles.signature}>
            <View style={styles.signatureBlank} />
            <View style={styles.signatureLine} />
            <Text style={styles.signatureName}>{venda.cliente}</Text>
          </View>

          <Text style={styles.emission}>
            Emitido em {formatDate(emitidoEm.toISOString())} às {horaEmissao} por {usuarioNome}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
