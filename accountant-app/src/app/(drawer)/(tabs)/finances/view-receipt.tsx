import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function ViewReceiptScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    code?: string;
    client?: string;
    salon?: string;
    amount?: string;
    date?: string;
    method?: string;
  }>();

  const handleDownloadPDF = () => {
    Alert.alert("Download PDF", "Downloading Italian Fiscal Electronic Invoice PDF...");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* 1. Header Bar with Back Button and Download PDF */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={22} color="#111827" />
          <View>
            <Text style={styles.headerTitle}>Service Receipt</Text>
            <Text style={styles.headerSubtitle}>Italian Fiscal Invoice</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.downloadPdfBtn}
          onPress={handleDownloadPDF}
          activeOpacity={0.8}
        >
          <Ionicons name="download-outline" size={15} color="#635BFF" style={{ marginRight: 6 }} />
          <Text style={styles.downloadPdfBtnText}>Download PDF</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 2. ELECTRONIC INVOICE Card */}
        <View style={styles.card}>
          <Text style={styles.sectionHeaderTitle}>ELECTRONIC INVOICE</Text>

          <View style={styles.twoBoxesRow}>
            <View style={styles.invoiceMetaBox}>
              <Text style={styles.invoiceMetaVal}>{params.code ? `2025-${params.code.replace("#", "").padStart(6, "0")}` : "2025-000123"}</Text>
              <Text style={styles.invoiceMetaLabel}>Receipt No</Text>
            </View>

            <View style={styles.invoiceMetaBox}>
              <Text style={styles.invoiceMetaVal}>11/30/2024</Text>
              <Text style={styles.invoiceMetaLabel}>Date</Text>
            </View>
          </View>
        </View>

        {/* 3. TRANSFEROR/PROVIDER & TRANSFEREE/CLIENT Cards */}
        <View style={styles.card}>
          <Text style={styles.sectionHeaderTitle}>TRANSFEROR/PROVIDER</Text>

          <Text style={styles.partyName}>{params.salon || "Bella Vista Salon"}</Text>
          <Text style={styles.partyAddress}>Via Roma, 123</Text>
          <Text style={styles.partyAddress}>20121 Milan (MI) - Italy</Text>

          <View style={styles.gridDetails}>
            <View style={styles.gridCol}>
              <Text style={styles.fieldLabel}>P.IVA</Text>
              <Text style={styles.fieldVal}>IT12345678901</Text>
            </View>
            <View style={styles.gridCol}>
              <Text style={styles.fieldLabel}>TAX CODE</Text>
              <Text style={styles.fieldVal}>12345678901</Text>
            </View>
          </View>

          <View style={styles.gridDetails}>
            <View style={styles.gridCol}>
              <Text style={styles.fieldLabel}>PEC</Text>
              <Text style={styles.fieldVal}>amministrazione@pec.salonflow.it</Text>
            </View>
            <View style={styles.gridCol}>
              <Text style={styles.fieldLabel}>RECIPIENT CODE</Text>
              <Text style={styles.fieldVal}>XXXXXXX</Text>
            </View>
          </View>

          <View style={styles.gridDetails}>
            <View style={styles.gridCol}>
              <Text style={styles.fieldLabel}>TELEPHONE</Text>
              <Text style={styles.fieldVal}>+39 02 1234567</Text>
            </View>
            <View style={styles.gridCol}>
              <Text style={styles.fieldLabel}>EMAIL</Text>
              <Text style={styles.fieldVal}>fatturazione@salonflow.it</Text>
            </View>
          </View>
        </View>

        {/* TRANSFEREE / CLIENT */}
        <View style={styles.card}>
          <Text style={styles.sectionHeaderTitle}>TRANSFEREE/CLIENT</Text>

          <Text style={styles.partyName}>{params.client || "Maria Rodriguez"}</Text>
          <Text style={styles.partyAddress}>Via Esempio, 456</Text>
          <Text style={styles.partyAddress}>10100 Turin (TO) - Italy</Text>

          <View style={[styles.gridDetails, { marginTop: 10 }]}>
            <View style={styles.gridCol}>
              <Text style={styles.fieldLabel}>TAX CODE</Text>
              <Text style={styles.fieldVal}>98765432109</Text>
            </View>
          </View>
        </View>

        {/* 4. SERVICE DESCRIPTION Card */}
        <View style={styles.card}>
          <Text style={styles.sectionHeaderTitle}>SERVICE DESCRIPTION</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ minWidth: 480 }}>
              {/* Table Header */}
              <View style={styles.tableHeaderRow}>
                <Text style={[styles.thText, { width: 120 }]}>Name</Text>
                <Text style={[styles.thText, { width: 70, textAlign: "center" }]}>Amount</Text>
                <Text style={[styles.thText, { width: 100, textAlign: "right" }]}>Unit Price</Text>
                <Text style={[styles.thText, { width: 80, textAlign: "center" }]}>VAT Rate</Text>
                <Text style={[styles.thText, { width: 100, textAlign: "right" }]}>Total Price</Text>
              </View>

              {/* Table Body */}
              <View style={styles.tableBodyRow}>
                <Text style={[styles.tdText, { width: 120, fontWeight: "600", color: "#111827" }]}>
                  Haircut
                </Text>
                <Text style={[styles.tdText, { width: 70, textAlign: "center" }]}>1</Text>
                <Text style={[styles.tdText, { width: 100, textAlign: "right", color: "#374151" }]}>
                  € 246.08
                </Text>
                <Text style={[styles.tdText, { width: 80, textAlign: "center" }]}>22%</Text>
                <Text style={[styles.tdText, { width: 100, textAlign: "right", fontWeight: "700", color: "#111827" }]}>
                  € 246.08
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>

        {/* 5. VAT SUMMARY & DOCUMENT TOTALS */}
        <View style={styles.card}>
          <Text style={styles.sectionHeaderTitle}>VAT SUMMARY</Text>

          <View style={styles.vatTable}>
            <View style={styles.tableHeaderRow}>
              <Text style={[styles.thText, { flex: 1 }]}>Rate</Text>
              <Text style={[styles.thText, { flex: 1, textAlign: "center" }]}>Taxable</Text>
              <Text style={[styles.thText, { flex: 1, textAlign: "right" }]}>IvA</Text>
            </View>

            <View style={styles.tableBodyRow}>
              <Text style={[styles.tdText, { flex: 1, fontWeight: "600", color: "#111827" }]}>0%</Text>
              <Text style={[styles.tdText, { flex: 1, textAlign: "center" }]}>€ 0</Text>
              <Text style={[styles.tdText, { flex: 1, textAlign: "right" }]}>€ 0</Text>
            </View>
          </View>
        </View>

        {/* DOCUMENT TOTALS */}
        <View style={styles.card}>
          <Text style={styles.sectionHeaderTitle}>DOCUMENT TOTALS</Text>

          <View style={styles.totalsList}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Taxable Amount</Text>
              <Text style={styles.totalVal}>€ {params.amount || "170"}</Text>
            </View>

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total VAT</Text>
              <Text style={styles.totalVal}>€ 0</Text>
            </View>

            <View style={[styles.totalRow, styles.totalRowHighlight]}>
              <Text style={styles.docTotalLabel}>Document Total</Text>
              <Text style={styles.docTotalVal}>€ {params.amount || "170"}</Text>
            </View>
          </View>
        </View>

        {/* 6. PAYMENT METHODS Card */}
        <View style={styles.card}>
          <Text style={styles.sectionHeaderTitle}>PAYMENT METHODS</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ minWidth: 480 }}>
              <View style={styles.tableHeaderRow}>
                <Text style={[styles.thText, { width: 110 }]}>MODE</Text>
                <Text style={[styles.thText, { width: 110 }]}>PAYMENT DATE</Text>
                <Text style={[styles.thText, { width: 100 }]}>DEADLINE</Text>
                <Text style={[styles.thText, { width: 100, textAlign: "right" }]}>AMOUNT PAID</Text>
                <Text style={[styles.thText, { width: 60, textAlign: "center" }]}>STATUS</Text>
              </View>

              <View style={styles.tableBodyRow}>
                <Text style={[styles.tdText, { width: 110, fontWeight: "600", color: "#111827" }]}>
                  {params.method || "Credit Card"}
                </Text>
                <Text style={[styles.tdText, { width: 110 }]}>12/02/2024</Text>
                <Text style={[styles.tdText, { width: 100 }]}>12/14/2024</Text>
                <Text style={[styles.tdText, { width: 100, textAlign: "right", fontWeight: "700" }]}>
                  € {params.amount || "170"}
                </Text>
                <View style={{ width: 60, alignItems: "center" }}>
                  <View style={styles.paidBadge}>
                    <Text style={styles.paidBadgeText}>Paid</Text>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>

        {/* 7. LEGAL NOTES Card */}
        <View style={styles.card}>
          <Text style={styles.sectionHeaderTitle}>LEGAL NOTES</Text>

          <View style={styles.legalNotesList}>
            <View style={styles.legalBulletRow}>
              <Text style={styles.bulletSymbol}>•</Text>
              <Text style={styles.legalBulletText}>
                Invoice issued pursuant to art. 21 of Presidential Decree 26 October 1972, n. 633 and subsequent amendments.
              </Text>
            </View>

            <View style={styles.legalBulletRow}>
              <Text style={styles.bulletSymbol}>•</Text>
              <Text style={styles.legalBulletText}>
                VAT paid by the purchaser pursuant to art. 17, paragraph 6, of Presidential Decree 26 October 1972, n. 633.
              </Text>
            </View>

            <View style={styles.legalBulletRow}>
              <Text style={styles.bulletSymbol}>•</Text>
              <Text style={styles.legalBulletText}>
                Digitally signed electronic document pursuant to Legislative Decree 82/2005.
              </Text>
            </View>

            <View style={styles.legalBulletRow}>
              <Text style={styles.bulletSymbol}>•</Text>
              <Text style={styles.legalBulletText}>
                Replacement storage of documents pursuant to the Ministerial Decree of 17 June 2014.
              </Text>
            </View>

            <View style={styles.legalBulletRow}>
              <Text style={styles.bulletSymbol}>•</Text>
              <Text style={styles.legalBulletText}>
                Competent court: Milan. Applicable law: Italian.
              </Text>
            </View>

            <View style={styles.legalBulletRow}>
              <Text style={styles.bulletSymbol}>•</Text>
              <Text style={styles.legalBulletText}>
                Company subject to the management and coordination of [Holding Company].
              </Text>
            </View>
          </View>
        </View>

        {/* 8. Footer Disclaimer */}
        <View style={styles.footerSection}>
          <Text style={styles.footerText}>
            SalonFlow S.r.l. - Via Roma, 123 - 20121 Milan (MI) - VAT number: IT12345678901
          </Text>
          <Text style={styles.footerText}>
            Share Capital: € 10,000.00 i.v. - REA MI-1234567 - SDI Code: XXXXXXX
          </Text>
          <Text style={styles.footerText}>
            www.salonflow.it - info@salonflow.it - Tel: +39 02 1234567
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
  },
  headerSubtitle: {
    fontSize: 10,
    color: "#6B7280",
  },
  downloadPdfBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEECFF",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  downloadPdfBtnText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#635BFF",
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 14,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  sectionHeaderTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  twoBoxesRow: {
    flexDirection: "row",
    gap: 12,
  },
  invoiceMetaBox: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  invoiceMetaVal: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
  },
  invoiceMetaLabel: {
    fontSize: 10,
    color: "#6B7280",
    marginTop: 2,
    fontWeight: "500",
  },
  partyName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 2,
  },
  partyAddress: {
    fontSize: 11.5,
    color: "#4B5563",
    lineHeight: 16,
  },
  gridDetails: {
    flexDirection: "row",
    marginTop: 12,
    gap: 16,
  },
  gridCol: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 9.5,
    fontWeight: "700",
    color: "#6B7280",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  fieldVal: {
    fontSize: 11.5,
    fontWeight: "600",
    color: "#111827",
  },
  tableHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginBottom: 4,
  },
  thText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#6B7280",
  },
  tableBodyRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  tdText: {
    fontSize: 11,
    color: "#374151",
  },
  vatTable: {
    gap: 2,
  },
  totalsList: {
    gap: 8,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 2,
  },
  totalLabel: {
    fontSize: 11.5,
    color: "#4B5563",
  },
  totalVal: {
    fontSize: 12,
    fontWeight: "600",
    color: "#111827",
  },
  totalRowHighlight: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 8,
    marginTop: 4,
  },
  docTotalLabel: {
    fontSize: 13,
    fontWeight: "800",
    color: "#111827",
  },
  docTotalVal: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
  },
  paidBadge: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  paidBadgeText: {
    fontSize: 9.5,
    fontWeight: "700",
    color: "#16A34A",
  },
  legalNotesList: {
    gap: 8,
  },
  legalBulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
  },
  bulletSymbol: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 16,
  },
  legalBulletText: {
    flex: 1,
    fontSize: 10,
    color: "#6B7280",
    lineHeight: 15,
  },
  footerSection: {
    alignItems: "center",
    paddingVertical: 16,
    gap: 3,
  },
  footerText: {
    fontSize: 9,
    color: "#9CA3AF",
    textAlign: "center",
  },
});
