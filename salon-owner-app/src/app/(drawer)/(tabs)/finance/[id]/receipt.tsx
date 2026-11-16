import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { initialPayments } from "@/components/finance/financeData";

export default function ReceiptPrintPreviewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const payment = initialPayments.find((p) => p.id === id) || initialPayments[0];

  const handlePrintThermal = () => {
    Alert.alert("Print Job Started", `Printing 80mm fiscal receipt for #${payment.id} via Bluetooth...`);
  };

  const handleSharePDF = () => {
    Alert.alert("Export PDF", `Generating official fiscal PDF document for #${payment.id}...`);
  };

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 12) }]}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color="#1E293B" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Fiscal Receipt</Text>
          <Text style={styles.headerSub}>Official electronic tax invoice</Text>
        </View>

        <TouchableOpacity
          style={styles.shareIconBtn}
          onPress={handleSharePDF}
          activeOpacity={0.75}
        >
          <Ionicons name="share-outline" size={18} color="#635BFF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.contentScroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Printable Paper Card */}
        <View style={styles.paperReceipt}>
          {/* Top Notch Cutout */}
          <View style={styles.receiptTopHeader}>
            <View style={styles.salonLogoCircle}>
              <Ionicons name="sparkles" size={20} color="#635BFF" />
            </View>
            <Text style={styles.salonName}>GLAMOUR LOUNGE</Text>
            <Text style={styles.salonAddress}>Via Montenapoleone 14, 20121 Milano</Text>
            <Text style={styles.salonTax}>P.IVA: IT098234123 • Tel: +39 02 8934 123</Text>
          </View>

          {/* Dotted Divider */}
          <View style={styles.dottedDivider} />

          {/* Metadata */}
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>DOCUMENT:</Text>
            <Text style={styles.metaValue}>REC-2025-{payment.id}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>DATE & TIME:</Text>
            <Text style={styles.metaValue}>{payment.date}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>CLIENT:</Text>
            <Text style={styles.metaValue}>{payment.client.name.toUpperCase()}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>STYLIST:</Text>
            <Text style={styles.metaValue}>{payment.teamMember.name.toUpperCase()}</Text>
          </View>

          <View style={styles.dottedDivider} />

          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.colHeader, { flex: 2 }]}>DESCRIPTION</Text>
            <Text style={[styles.colHeader, { width: 35, textAlign: "center" }]}>QTY</Text>
            <Text style={[styles.colHeader, { flex: 1, textAlign: "right" }]}>AMOUNT</Text>
          </View>

          {/* Items */}
          {(payment.items || [
            { name: "Balayage Highlights", category: "Coloring", price: "€ 180.00", quantity: 1 },
            { name: "Hydrating Keratin Mask", category: "Treatments", price: "€ 45.00", quantity: 1 },
            { name: "Blow Dry & Finish", category: "Styling", price: "€ 45.00", quantity: 1 },
          ]).map((item, idx) => (
            <View key={idx} style={styles.itemRow}>
              <Text style={[styles.itemName, { flex: 2 }]}>{item.name}</Text>
              <Text style={[styles.itemQty, { width: 35, textAlign: "center" }]}>{item.quantity}</Text>
              <Text style={[styles.itemAmount, { flex: 1, textAlign: "right" }]}>{item.price}</Text>
            </View>
          ))}

          <View style={styles.dottedDivider} />

          {/* Financials Breakdown */}
          <View style={styles.calcRow}>
            <Text style={styles.calcLabel}>SUBTOTAL (EXCL. VAT):</Text>
            <Text style={styles.calcValue}>{payment.subtotal}</Text>
          </View>
          <View style={styles.calcRow}>
            <Text style={styles.calcLabel}>IVA / VAT (22%):</Text>
            <Text style={styles.calcValue}>{payment.tax}</Text>
          </View>

          <View style={[styles.calcRow, styles.grandTotalRow]}>
            <Text style={styles.grandTotalLabel}>TOTAL DUE / PAID:</Text>
            <Text style={styles.grandTotalValue}>{payment.amount}</Text>
          </View>

          <View style={styles.calcRow}>
            <Text style={styles.calcLabel}>PAYMENT TENDER:</Text>
            <Text style={[styles.calcValue, { color: "#635BFF", fontFamily: "Manrope_700Bold" }]}>
              {payment.method.toUpperCase()}
            </Text>
          </View>

          <View style={styles.dottedDivider} />

          {/* Barcode & RT Fiscal Code Simulation */}
          <View style={styles.barcodeSection}>
            <View style={styles.barcodeLines}>
              {Array.from({ length: 32 }).map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.barcodeBar,
                    {
                      width: (i % 3 === 0 ? 3 : i % 2 === 0 ? 2 : 1),
                      marginHorizontal: (i % 4 === 0 ? 2 : 1),
                    },
                  ]}
                />
              ))}
            </View>
            <Text style={styles.barcodeNumber}>*RT-998234123-2025-00{payment.id}*</Text>
            <Text style={styles.thankYouText}>GRAZIE PER LA VISITA!</Text>
            <Text style={styles.fiscalFooter}>Documento Commerciale Online - Agenzia Entrate</Text>
          </View>
        </View>

        {/* Bottom Actions */}
        <View style={styles.actionsBottom}>
          <TouchableOpacity
            style={styles.printThermalBtn}
            onPress={handlePrintThermal}
            activeOpacity={0.85}
          >
            <Ionicons name="bluetooth" size={18} color="#FFFFFF" />
            <Text style={styles.printThermalBtnText}>Print Thermal POS (Bluetooth)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.savePdfBtn}
            onPress={handleSharePDF}
            activeOpacity={0.8}
          >
            <Ionicons name="document-text-outline" size={16} color="#635BFF" />
            <Text style={styles.savePdfBtnText}>Save PDF / Share Document</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F5F9",
  },
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  backBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
  },
  headerTitle: {
    fontSize: 17,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  headerSub: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    marginTop: 1,
  },
  shareIconBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#EEF2FF",
  },
  contentScroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
    alignItems: "center",
  },
  paperReceipt: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  receiptTopHeader: {
    alignItems: "center",
    gap: 3,
    marginBottom: 6,
  },
  salonLogoCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  salonName: {
    fontSize: 16,
    fontFamily: "Manrope_800ExtraBold",
    color: "#1E293B",
    letterSpacing: 1,
  },
  salonAddress: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
  },
  salonTax: {
    fontSize: 10,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
  },
  dottedDivider: {
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    marginVertical: 8,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  metaLabel: {
    fontSize: 11,
    fontFamily: "Manrope_600SemiBold",
    color: "#94A3B8",
  },
  metaValue: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  tableHeader: {
    flexDirection: "row",
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  colHeader: {
    fontSize: 10,
    fontFamily: "Manrope_700Bold",
    color: "#94A3B8",
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  itemName: {
    fontSize: 12,
    fontFamily: "Manrope_600SemiBold",
    color: "#1E293B",
  },
  itemQty: {
    fontSize: 12,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  itemAmount: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  calcRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 2,
  },
  calcLabel: {
    fontSize: 11,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  calcValue: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  grandTotalRow: {
    paddingVertical: 6,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#1E293B",
    marginVertical: 4,
  },
  grandTotalLabel: {
    fontSize: 13,
    fontFamily: "Manrope_800ExtraBold",
    color: "#1E293B",
  },
  grandTotalValue: {
    fontSize: 16,
    fontFamily: "Manrope_800ExtraBold",
    color: "#1E293B",
  },
  barcodeSection: {
    alignItems: "center",
    gap: 4,
    paddingTop: 8,
  },
  barcodeLines: {
    flexDirection: "row",
    height: 38,
    alignItems: "center",
    justifyContent: "center",
  },
  barcodeBar: {
    height: "100%",
    backgroundColor: "#1E293B",
  },
  barcodeNumber: {
    fontSize: 10,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    letterSpacing: 2,
  },
  thankYouText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
    marginTop: 6,
  },
  fiscalFooter: {
    fontSize: 9,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
    textAlign: "center",
  },
  actionsBottom: {
    width: "100%",
    maxWidth: 380,
    gap: 10,
  },
  printThermalBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#0D9488",
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: "#0D9488",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  printThermalBtnText: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },
  savePdfBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#C7D2FE",
    paddingVertical: 12,
    borderRadius: 12,
  },
  savePdfBtnText: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
});
