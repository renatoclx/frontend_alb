import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { CabecalhoEmpresaPdf } from "@/components/pdf/cabecalho-empresa-pdf";
import type { Locacao, LocacaoDevolucao } from "@/types/locacao";
import { formatDate } from "@/utils/date";
import { maskDocumento, maskTelefone } from "@/utils/mask";

const styles = StyleSheet.create({
  page: { flexDirection: "column", padding: 57, fontSize: 10, color: "#1F1F1F", fontFamily: "Helvetica" },
  headerPanel: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E4E4E7",
    borderBottomStyle: "solid",
  },
  // flex: 1 — empurra o rodapé (assinatura) pro final da folha, como no
  // Contrato de Locação.
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
  colNome: { width: "70%" },
  colQtd: { width: "30%", textAlign: "right" },
  footerPanel: { paddingTop: 16, borderTopWidth: 1, borderTopColor: "#E4E4E7", borderTopStyle: "solid" },
  signature: { alignItems: "center", marginBottom: 24 },
  signatureBlank: { height: 36 },
  signatureLine: { width: 240, borderTopWidth: 1, borderTopColor: "#1F1F1F", borderTopStyle: "solid" },
  signatureName: { marginTop: 4, textAlign: "center" },
  emission: { fontSize: 8, color: "#71717A", textAlign: "center" },
});

interface TermoDevolucaoDocumentProps {
  locacao: Locacao;
  devolucao: LocacaoDevolucao;
  usuarioNome: string;
  emitidoEm: Date;
}

// Termo em que o cliente confirma a devolução dos itens de UMA devolução
// (avulsa ou total). O Contrato de Locação não muda com as devoluções.
export function TermoDevolucaoDocument({ locacao, devolucao, usuarioNome, emitidoEm }: TermoDevolucaoDocumentProps) {
  const horaEmissao = emitidoEm.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  const horaDevolucao = new Date(devolucao.data).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerPanel}>
          <CabecalhoEmpresaPdf />
          <Text style={styles.title}>Termo de Devolução de Equipamentos</Text>
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
            <Text style={styles.label}>Data de Início da Locação</Text>
            <Text style={styles.value}>{formatDate(locacao.dataInicio)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Data da Devolução</Text>
            <Text style={styles.value}>
              {formatDate(devolucao.data)} às {horaDevolucao}
            </Text>
          </View>
        </View>

        <View style={styles.bodyPanel}>
          <Text style={styles.declaracao}>
            Declaro que devolvi à ALB Locações os equipamentos abaixo, nas quantidades indicadas, referentes à locação
            iniciada em {formatDate(locacao.dataInicio)}.
          </Text>
          <View style={styles.tableHeader}>
            <Text style={styles.colNome}>Item</Text>
            <Text style={styles.colQtd}>Quantidade devolvida</Text>
          </View>
          {devolucao.itens.map((item) => (
            <View key={item.itemId} style={styles.tableRow}>
              <Text style={styles.colNome}>{item.produto}</Text>
              <Text style={styles.colQtd}>{item.quantidade}</Text>
            </View>
          ))}
        </View>

        <View style={styles.footerPanel}>
          <View style={styles.signature}>
            <View style={styles.signatureBlank} />
            <View style={styles.signatureLine} />
            <Text style={styles.signatureName}>{locacao.cliente}</Text>
          </View>

          <Text style={styles.emission}>
            Emitido em {formatDate(emitidoEm.toISOString())} às {horaEmissao} por {usuarioNome}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
