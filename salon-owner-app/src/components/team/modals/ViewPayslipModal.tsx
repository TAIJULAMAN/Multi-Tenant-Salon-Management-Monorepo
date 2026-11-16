import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Avatar from "@/components/Avatar";

export interface SalaryRecord {
  id: string;
  name: string;
  uploader?: string;
  avatarBg?: string;
  avatarUrl?: string;
  role: string;
  netAmount: string;
  month?: string;
  date: string;
  status: "pending" | "paid" | "Approved" | "Under Review" | "Paid";
  grossSalary?: string;
  netSalary?: string;
  trfMonthly?: string;
  cumulativeTrf?: string;
  iban?: string;
}

interface ViewPayslipModalProps {
  visible: boolean;
  onClose: () => void;
  record: SalaryRecord | any | null;
}

export default function ViewPayslipModal({
  visible,
  onClose,
  record,
}: ViewPayslipModalProps) {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!record) return null;

  const handleDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
    Alert.alert(
      "Payslip Downloaded",
      `Payslip PDF for ${record.name} (${record.month || "December 2024"}) has been saved.`
    );
  };

  const handlePrint = () => {
    Alert.alert("Print Document", `Sending payslip for ${record.name} to connected printer...`);
  };

  const isApproved = record.status === "Approved";
  const isPaid = record.status === "paid" || record.status === "Paid";
  const statusLabel = isApproved ? "Approved" : isPaid ? "Paid" : "Under Review";

  const docNumber = `PS-${(record.id || "1").replace(/[^0-9]/g, "").padStart(4, "0") || "0001"}`;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        {/* Backdrop Tap to Close */}
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        {/* Modal Container */}
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Payslip Details</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <Ionicons name="close" size={22} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Scrollable Content */}
          <ScrollView
            style={styles.body}
            contentContainerStyle={styles.bodyContent}
            showsVerticalScrollIndicator={true}
            bounces={true}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled={true}
          >
            {/* Salon / Employer Header Card */}
            <View style={styles.salonCard}>
              <View style={styles.salonInfoRow}>
                <View style={styles.salonIconBox}>
                  <Ionicons name="business" size={22} color="#635BFF" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.salonName}>Harem Salon Milano</Text>
                  <Text style={styles.salonAddress}>
                    Via Roma, 123 · 20121 Milan (MI) · P.IVA IT12345678901
                  </Text>
                </View>
              </View>

              <View style={styles.salonMetaRight}>
                <View
                  style={[
                    styles.statusBadge,
                    isApproved
                      ? styles.statusBadgeApproved
                      : isPaid
                      ? styles.statusBadgePaid
                      : styles.statusBadgeReview,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusBadgeText,
                      isApproved
                        ? styles.statusTextApproved
                        : isPaid
                        ? styles.statusTextPaid
                        : styles.statusTextReview,
                    ]}
                  >
                    {statusLabel}
                  </Text>
                </View>
                <Text style={styles.docNumberText}>Doc No: {docNumber}</Text>
              </View>
            </View>

            {/* Employee Info Card */}
            <View style={styles.infoCard}>
              <View style={styles.cardHeaderRow}>
                <Ionicons name="person-outline" size={15} color="#635BFF" />
                <Text style={styles.cardHeaderTitle}>EMPLOYEE INFO</Text>
              </View>

              <View style={styles.employeeDetailsRow}>
                <Avatar
                  name={record.name}
                  uri={record.avatarUrl || record.avatar}
                  size={42}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.employeeName}>{record.name}</Text>
                  <View style={styles.roleAndUploaderRow}>
                    <View style={styles.roleTag}>
                      <Text style={styles.roleTagText}>{record.role || "Staff"}</Text>
                    </View>
                    <Text style={styles.uploaderText}>
                      Uploaded by: {record.uploader || record.uploadedBy || "Mario Rossi"}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.cardDivider} />

              <View style={styles.ibanRow}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <Ionicons name="card-outline" size={15} color="#94A3B8" />
                  <Text style={styles.ibanLabel}>IBAN:</Text>
                </View>
                <Text style={styles.ibanValue}>{record.iban || "IT60 X054 ******** 123"}</Text>
              </View>
            </View>

            {/* Reference Period Card */}
            <View style={styles.infoCard}>
              <View style={styles.cardHeaderRow}>
                <Ionicons name="calendar-outline" size={15} color="#635BFF" />
                <Text style={styles.cardHeaderTitle}>REFERENCE PERIOD</Text>
              </View>

              <View>
                <Text style={styles.periodMonth}>{record.month || "December 2024"}</Text>
                <Text style={styles.periodDate}>Payment Date: {record.date || "Dec 01, 2024"}</Text>
              </View>

              <View style={styles.cardDivider} />

              <View style={styles.payableRow}>
                <Text style={styles.payableLabel}>Net Payable Amount:</Text>
                <Text style={styles.payableAmount}>{record.netAmount || "€ 3,200.00"}</Text>
              </View>
            </View>

            {/* Remuneration Breakdown Card */}
            <View style={styles.breakdownCard}>
              <View style={styles.breakdownHeader}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <Ionicons name="document-text-outline" size={16} color="#635BFF" />
                  <Text style={styles.breakdownTitle}>Remuneration Breakdown</Text>
                </View>
                <Text style={styles.currencyText}>Currency: EUR (€)</Text>
              </View>

              <View style={styles.breakdownTable}>
                {/* Gross Salary */}
                <View style={styles.tableRow}>
                  <Text style={styles.tableRowLabelBold}>Gross Salary (Retribuzione Lorda)</Text>
                  <Text style={styles.tableRowValueBold}>{record.grossSalary || "€ 3,200.00"}</Text>
                </View>

                {/* Social Security */}
                <View style={[styles.tableRow, styles.tableRowSub]}>
                  <Text style={styles.tableRowLabelSub}>Social Security Withholdings (INPS 9.19%)</Text>
                  <Text style={styles.tableRowValueRed}>- € 294.00</Text>
                </View>

                {/* Tax Withholdings */}
                <View style={[styles.tableRow, styles.tableRowSub]}>
                  <Text style={styles.tableRowLabelSub}>Tax Withholdings (IRPEF)</Text>
                  <Text style={styles.tableRowValueRed}>- € 306.00</Text>
                </View>

                {/* Net Monthly Salary */}
                <View style={[styles.tableRow, styles.tableRowNet]}>
                  <Text style={styles.tableRowLabelNet}>Net Monthly Salary (Netto del Mese)</Text>
                  <Text style={styles.tableRowValueNet}>
                    {record.netAmount || record.netSalary || "€ 3,200.00"}
                  </Text>
                </View>

                {/* TFR Accrued */}
                <View style={styles.tableRow}>
                  <Text style={styles.tableRowLabel}>TFR Accrued This Month (TRF Mensile)</Text>
                  <Text style={styles.tableRowValue}>{record.trfMonthly || "€ 600.00"}</Text>
                </View>

                {/* Cumulative TFR */}
                <View style={[styles.tableRow, { borderBottomWidth: 0 }]}>
                  <Text style={styles.tableRowLabel}>Cumulative TFR to Date (TFR Accantonato)</Text>
                  <Text style={styles.tableRowValuePurple}>
                    {record.cumulativeTrf || "€ 3,800.00"}
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Footer Actions */}
          <View style={styles.footer}>
            <View style={styles.footerLeftBtns}>
              <TouchableOpacity
                style={styles.downloadBtn}
                onPress={handleDownload}
                activeOpacity={0.85}
              >
                <Ionicons
                  name={downloadSuccess ? "checkmark-circle" : "download-outline"}
                  size={16}
                  color={downloadSuccess ? "#16A34A" : "#635BFF"}
                />
                <Text style={[styles.downloadBtnText, downloadSuccess && { color: "#16A34A" }]}>
                  {downloadSuccess ? "Downloaded" : "Download PDF"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.printBtn} onPress={handlePrint} activeOpacity={0.8}>
                <Ionicons name="print-outline" size={16} color="#475569" />
                <Text style={styles.printBtnText}>Print</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.closeBtnFooter} onPress={onClose} activeOpacity={0.8}>
              <Text style={styles.closeBtnFooterText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  container: {
    width: "100%",
    maxWidth: 480,
    maxHeight: "88%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    display: "flex",
    flexDirection: "column",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
  },
  headerTitle: {
    fontSize: 17,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  closeBtn: {
    padding: 4,
  },
  body: {
    flexGrow: 1,
    flexShrink: 1,
  },
  bodyContent: {
    padding: 18,
    paddingBottom: 24,
    gap: 14,
  },

  // Salon Card
  salonCard: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },
  salonInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  salonIconBox: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  salonName: {
    fontSize: 15,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  salonAddress: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    marginTop: 2,
    lineHeight: 16,
  },
  salonMetaRight: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  docNumberText: {
    fontSize: 11,
    fontFamily: "Manrope_600SemiBold",
    color: "#94A3B8",
  },

  // Status Badges
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
  },
  statusBadgeApproved: {
    backgroundColor: "#DCFCE7",
    borderColor: "rgba(22, 163, 74, 0.2)",
  },
  statusTextApproved: {
    color: "#16A34A",
  },
  statusBadgePaid: {
    backgroundColor: "#DCFCE7",
    borderColor: "rgba(22, 163, 74, 0.2)",
  },
  statusTextPaid: {
    color: "#16A34A",
  },
  statusBadgeReview: {
    backgroundColor: "#FEF9C3",
    borderColor: "rgba(202, 138, 4, 0.2)",
  },
  statusTextReview: {
    color: "#CA8A04",
  },
  statusBadgeText: {
    fontSize: 10,
    fontFamily: "Manrope_700Bold",
  },

  // Info Cards (Employee & Period)
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  cardHeaderTitle: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
    letterSpacing: 0.5,
  },
  employeeDetailsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  employeeName: {
    fontSize: 15,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  roleAndUploaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 3,
    flexWrap: "wrap",
  },
  roleTag: {
    backgroundColor: "#FEF9C3",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  roleTagText: {
    fontSize: 10,
    fontFamily: "Manrope_700Bold",
    color: "#CA8A04",
  },
  uploaderText: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
  },
  cardDivider: {
    height: 1,
    backgroundColor: "#F1F5F9",
  },
  ibanRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ibanLabel: {
    fontSize: 12,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  ibanValue: {
    fontSize: 12,
    fontFamily: "Manrope_600SemiBold",
    color: "#1E293B",
  },

  // Period
  periodMonth: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  periodDate: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    marginTop: 2,
  },
  payableRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  payableLabel: {
    fontSize: 13,
    fontFamily: "Manrope_600SemiBold",
    color: "#1E293B",
  },
  payableAmount: {
    fontSize: 17,
    fontFamily: "Manrope_700Bold",
    color: "#10B981",
  },

  // Breakdown Card
  breakdownCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    overflow: "hidden",
  },
  breakdownHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  breakdownTitle: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  currencyText: {
    fontSize: 10,
    fontFamily: "Manrope_600SemiBold",
    color: "#94A3B8",
  },
  breakdownTable: {
    paddingHorizontal: 14,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  tableRowSub: {
    paddingLeft: 12,
  },
  tableRowNet: {
    backgroundColor: "#F0FDF4",
    marginHorizontal: -14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#DCFCE7",
  },
  tableRowLabel: {
    fontSize: 12,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
  },
  tableRowLabelBold: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  tableRowLabelSub: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
  },
  tableRowLabelNet: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#16A34A",
  },
  tableRowValue: {
    fontSize: 12,
    fontFamily: "Manrope_600SemiBold",
    color: "#1E293B",
  },
  tableRowValueBold: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  tableRowValueRed: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#EF4444",
  },
  tableRowValueNet: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#16A34A",
  },
  tableRowValuePurple: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },

  // Footer Actions
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
  },
  footerLeftBtns: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  downloadBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#EEF2FF",
    borderWidth: 1,
    borderColor: "#E0E7FF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  downloadBtnText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  printBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  printBtnText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#475569",
  },
  closeBtnFooter: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
  },
  closeBtnFooterText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#475569",
  },
});
