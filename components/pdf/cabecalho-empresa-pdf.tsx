import { Image, Path, StyleSheet, Svg, Text, View } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  box: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 0.75,
    borderColor: "#A1A1AA",
    borderStyle: "solid",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  logo: { width: 120 },
  contatos: { alignItems: "flex-end" },
  telefoneLinha: { flexDirection: "row", alignItems: "center", marginBottom: 2 },
  whatsapp: { width: 10, height: 11, marginRight: 4 },
  telefone: { fontSize: 12, fontWeight: "bold" },
  info: { fontSize: 10, marginTop: 2 },
  cnpj: { fontSize: 8, color: "#71717A", marginTop: 2 },
});

// Ícone do WhatsApp (Font Awesome Free "whatsapp", licença CC BY 4.0 —
// mesmo ícone usado na landing page via react-icons), desenhado como SVG
// porque o PDF não usa a biblioteca de ícones do app.
const WHATSAPP_PATH =
  "M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z";

const TELEFONES = ["(17) 99134-1177", "(17) 99141-4452"];

// Cabeçalho com a identidade da empresa, compartilhado pelos relatórios A4
// de Locação e Venda (modelo do talão físico de contrato). O logo é PNG
// porque o <Image> do @react-pdf/renderer não renderiza arquivos SVG.
export function CabecalhoEmpresaPdf() {
  return (
    <View style={styles.box}>
      {/* eslint-disable-next-line jsx-a11y/alt-text -- Image do react-pdf não aceita alt */}
      <Image style={styles.logo} src={`${window.location.origin}/images/logo-alb.png`} />
      <View style={styles.contatos}>
        {TELEFONES.map((telefone) => (
          <View key={telefone} style={styles.telefoneLinha}>
            <Svg viewBox="0 0 448 512" style={styles.whatsapp}>
              <Path d={WHATSAPP_PATH} fill="#1F1F1F" />
            </Svg>
            <Text style={styles.telefone}>{telefone}</Text>
          </View>
        ))}
        <Text style={styles.info}>Mendonça - SP</Text>
        <Text style={styles.cnpj}>CNPJ: 53.675.321/0001-52</Text>
      </View>
    </View>
  );
}
