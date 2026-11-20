import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { CabecalhoEmpresaPdf } from "@/components/pdf/cabecalho-empresa-pdf";
import type { Locacao } from "@/types/locacao";
import { daysSince, formatDate } from "@/utils/date";
import { locacaoStatusLabel } from "@/utils/locacao-status";
import { formatMoney, maskDocumento, maskTelefone } from "@/utils/mask";

const styles = StyleSheet.create({
  page: { flexDirection: "column", padding: 57, fontSize: 10, color: "#1F1F1F", fontFamily: "Helvetica" },
  headerPanel: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E4E4E7",
    borderBottomStyle: "solid",
  },
  // flex: 1 — empurra o rodapé (total e assinatura) pro final da folha.
  bodyPanel: { flex: 1 },
  title: { fontSize: 16, fontWeight: "bold", marginBottom: 12, textAlign: "center" },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  label: { color: "#71717A" },
  value: { fontWeight: "bold" },
  sectionTitle: { fontSize: 11, fontWeight: "bold", marginTop: 16, marginBottom: 6 },
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
  colNome: { width: "36%" },
  colQtd: { width: "12%", textAlign: "right" },
  colPendente: { width: "12%", textAlign: "right", fontWeight: "bold" },
  colValor: { width: "16%", textAlign: "right" },
  colData: { width: "28%" },
  colItens: { width: "72%" },
  empty: { color: "#71717A", paddingVertical: 4 },
  footerPanel: { paddingTop: 16, borderTopWidth: 1, borderTopColor: "#E4E4E7", borderTopStyle: "solid" },
  footerTotal: { fontSize: 12, fontWeight: "bold", textAlign: "right", marginBottom: 32 },
  signature: { alignItems: "center", marginBottom: 24 },
  signatureBlank: { height: 36 },
  signatureLine: { width: 240, borderTopWidth: 1, borderTopColor: "#1F1F1F", borderTopStyle: "solid" },
  signatureName: { marginTop: 4, textAlign: "center" },
  emission: { fontSize: 8, color: "#71717A", textAlign: "center" },
});

interface ExtratoLocacaoDocumentProps {
  locacao: Locacao;
  usuarioNome: string;
  emitidoEm: Date;
}

function formatDateTime(value: string): string {
  const hora = new Date(value).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  return `${formatDate(value)} às ${hora}`;
}

// Situação atual da locação (itens pendentes e devoluções). O Contrato de
// Locação continua imutável — o extrato é o documento que reflete as
// devoluções.
export function ExtratoLocacaoDocument({ locacao, usuarioNome, emitidoEm }: ExtratoLocacaoDocumentProps) {
  const horaEmissao = emitidoEm.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  const status =
    locacao.status === "atrasada"
      ? `Em atraso há ${daysSince(locacao.dataRetorno)} dia(s)`
      : locacaoStatusLabel[locacao.status];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerPanel}>
          <CabecalhoEmpresaPdf />
          <Text style={styles.title}>Extrato da Locação</Text>
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
            <Text style={styles.label}>Data de Devolução Prevista</Text>
            <Text style={styles.value}>{formatDate(locacao.dataRetorno)}</Text>
          </View>
          {locacao.dataDevolucao && (
            <View style={styles.row}>
              <Text style={styles.label}>Encerrada em</Text>
              <Text style={styles.value}>{formatDateTime(locacao.dataDevolucao)}</Text>
            </View>
          )}
          <View style={styles.row}>
            <Text style={styles.label}>Situação</Text>
            <Text style={styles.value}>{status}</Text>
          </View>
        </View>

        <View style={styles.bodyPanel}>
          <View style={styles.tableHeader}>
            <Text style={styles.colNome}>Item</Text>
            <Text style={styles.colQtd}>Locado</Text>
            <Text style={styles.colQtd}>Devolvido</Text>
            <Text style={styles.colPendente}>Pendente</Text>
            <Text style={styles.colValor}>Valor Unitário</Text>
            <Text style={styles.colValor}>Valor Total</Text>
          </View>
          {locacao.itens.map((item) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={styles.colNome}>{item.produto}</Text>
              <Text style={styles.colQtd}>{item.quantidade}</Text>
              <Text style={styles.colQtd}>{item.quantidadeDevolvida}</Text>
              <Text style={styles.colPendente}>{item.quantidade - item.quantidadeDevolvida}</Text>
              <Text style={styles.colValor}>{formatMoney(item.valorUnitario)}</Text>
              <Text style={styles.colValor}>{formatMoney(item.valorUnitario * item.quantidade)}</Text>
            </View>
          ))}

          <Text style={styles.sectionTitle}>Histórico de devoluções</Text>
          <View style={styles.tableHeader}>
            <Text style={styles.colData}>Data</Text>
            <Text style={styles.colItens}>Itens devolvidos</Text>
          </View>
          {locacao.devolucoes.length === 0 && <Text style={styles.empty}>Nenhuma devolução registrada.</Text>}
          {locacao.devolucoes.map((devolucao) => (
            <View key={devolucao.id} style={styles.tableRow}>
              <Text style={styles.colData}>{formatDateTime(devolucao.data)}</Text>
              <Text style={styles.colItens}>
                {devolucao.itens.map((item) => `${item.produto}: ${item.quantidade}`).join("  ·  ")}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.footerPanel}>
          <Text style={styles.footerTotal}>Valor total da Locação: {formatMoney(locacao.valorTotal)}</Text>

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
