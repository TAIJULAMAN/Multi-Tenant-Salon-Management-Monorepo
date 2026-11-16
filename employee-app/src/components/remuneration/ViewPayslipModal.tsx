import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Avatar from "@/components/Avatar";
import FormModal from "@/components/shifts/FormModal";
import { ME } from "@/components/shifts/shiftsData";
import { EMPLOYEE_IBAN, EMPLOYER, Payslip, formatEuroExact } from "./remunerationData";
import StatusLabel from "./StatusLabel";

interface ViewPayslipModalProps {
  visible: boolean;
  onClose: () => void;
  payslip: Payslip | null;
}

export default function ViewPayslipModal({ visible, onClose, payslip }: ViewPayslipModalProps) {
  const [downloaded, setDownloaded] = useState(false);
  if (!payslip) return null;

  const docNumber = `PS-${payslip.dateISO.replace(/-/g, "").slice(0, 6)}`;

  const handleDownload = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
    Alert.alert("Payslip Downloaded", `Payslip PDF for ${payslip.month} has been saved.`);
  };

  const handlePrint = () => {
    Alert.alert("Print Document", `Sending your ${payslip.month} payslip to the connected printer...`);
  };

  const rows: { label: string; value: string; kind?: "bold" | "sub" | "net" | "purple" }[] = [
    { label: "Gross Salary (Retribuzione Lorda)", value: formatEuroExact(payslip.gross), kind: "bold" },
    { label: "Social Security Withholdings (INPS)", value: `- ${formatEuroExact(payslip.socialSecurity)}`, kind: "sub" },
    { label: "Tax Withholdings (IRPEF)", value: `- ${formatEuroExact(payslip.taxes)}`, kind: "sub" },
    { label: "Net Monthly Salary (Netto del Mese)", value: formatEuroExact(payslip.net), kind: "net" },
    { label: "Contributions", value: formatEuroExact(payslip.contributions) },
    { label: "TFR Accrued This Month", value: formatEuroExact(payslip.tfr), kind: "purple" },
  ];

  return (
    <FormModal
      visible={visible}
      onClose={onClose}
      title="Payslip Details"
      footer={
        <View style={styles.footer}>
          <TouchableOpacity style={styles.downloadBtn} onPress={handleDownload} activeOpacity={0.85}>
            <Ionicons
              name={downloaded ? "checkmark-circle" : "download-outline"}
              size={16}
              color={downloaded ? "#16A34A" : "#635BFF"}
            />
            <Text style={[styles.downloadBtnText, downloaded && styles.downloadedText]}>
              {downloaded ? "Downloaded" : "Download PDF"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.printBtn} onPress={handlePrint} activeOpacity={0.8}>
            <Ionicons name="print-outline" size={16} color="#475569" />
          </TouchableOpacity>
          <View style={styles.flex} />
          <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.8}>
            <Text style={styles.closeBtnText}>Close</Text>
          </TouchableOpacity>
        </View>
      }
    >
      {/* Employer */}
      <View style={styles.salonCard}>
        <View style={styles.salonInfoRow}>
          <View style={styles.salonIconBox}>
            <Ionicons name="business" size={20} color="#635BFF" />
          </View>
          <View style={styles.flex}>
            <Text style={styles.salonName}>{EMPLOYER.name}</Text>
            <Text style={styles.salonAddress}>{EMPLOYER.address}</Text>
          </View>
        </View>
        <View style={styles.salonMetaRow}>
          <StatusLabel status={payslip.status} />
          <Text style={styles.docNumberText}>Doc No: {docNumber}</Text>
        </View>
      </View>

      {/* Employee */}
      <View style={styles.infoCard}>
        <View style={styles.cardHeaderRow}>
          <Ionicons name="person-outline" size={14} color="#635BFF" />
          <Text style={styles.cardHeaderTitle}>EMPLOYEE INFO</Text>
        </View>
        <View style={styles.employeeRow}>
          <Avatar name={ME.name} uri={ME.avatarUrl} size={40} />
          <View style={styles.flex}>
            <Text style={styles.employeeName}>{ME.name}</Text>
            <Text style={styles.employeeRole}>{ME.role}</Text>
          </View>
        </View>
        <View style={styles.cardDivider} />
        <View style={styles.spaceRow}>
          <View style={styles.ibanLabelRow}>
            <Ionicons name="card-outline" size={14} color="#94A3B8" />
            <Text style={styles.mutedLabel}>IBAN:</Text>
          </View>
          <Text style={styles.ibanValue}>{EMPLOYEE_IBAN}</Text>
        </View>
      </View>

      {/* Period */}
      <View style={styles.infoCard}>
        <View style={styles.cardHeaderRow}>
          <Ionicons name="calendar-outline" size={14} color="#635BFF" />
          <Text style={styles.cardHeaderTitle}>REFERENCE PERIOD</Text>
        </View>
        <Text style={styles.periodMonth}>{payslip.month}</Text>
        <Text style={styles.periodDate}>Payment Date: {payslip.date}</Text>
        <View style={styles.cardDivider} />
        <View style={styles.spaceRow}>
          <Text style={styles.payableLabel}>Net Payable Amount:</Text>
          <Text style={styles.payableAmount}>{formatEuroExact(payslip.net)}</Text>
        </View>
      </View>

      {/* Breakdown */}
      <View style={styles.breakdownCard}>
        <View style={styles.breakdownHeader}>
          <View style={styles.ibanLabelRow}>
            <Ionicons name="document-text-outline" size={15} color="#635BFF" />
            <Text style={styles.breakdownTitle}>Remuneration Breakdown</Text>
          </View>
          <Text style={styles.currencyText}>EUR (€)</Text>
        </View>
        {rows.map((row, i) => (
          <View
            key={row.label}
            style={[
              styles.tableRow,
              row.kind === "net" && styles.tableRowNet,
              i === rows.length - 1 && styles.tableRowLast,
            ]}
          >
            <Text
              style={[
                styles.tableLabel,
                row.kind === "bold" && styles.tableLabelBold,
                row.kind === "sub" && styles.tableLabelSub,
                row.kind === "net" && styles.tableLabelNet,
              ]}
            >
              {row.label}
            </Text>
            <Text
              style={[
                styles.tableValue,
                row.kind === "sub" && styles.tableValueRed,
                row.kind === "net" && styles.tableValueNet,
                row.kind === "purple" && styles.tableValuePurple,
              ]}
            >
              {row.value}
            </Text>
          </View>
        ))}
      </View>
    </FormModal>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  salonCard: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 14,
    gap: 10,
    marginBottom: 12,
  },
  salonInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  salonIconBox: {
    width: 40,
    height: 40,
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
  salonMetaRow: {
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
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 14,
    gap: 8,
    marginBottom: 12,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  cardHeaderTitle: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#64748B",
    letterSpacing: 0.5,
  },
  employeeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  employeeName: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  employeeRole: {
    fontSize: 12,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    marginTop: 1,
  },
  cardDivider: {
    height: 1,
    backgroundColor: "#F1F5F9",
  },
  spaceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ibanLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  mutedLabel: {
    fontSize: 12,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  ibanValue: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  periodMonth: {
    fontSize: 16,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  periodDate: {
    fontSize: 12,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
  },
  payableLabel: {
    fontSize: 13,
    fontFamily: "Manrope_600SemiBold",
    color: "#475569",
  },
  payableAmount: {
    fontSize: 18,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  breakdownCard: {
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
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  currencyText: {
    fontSize: 11,
    fontFamily: "Manrope_600SemiBold",
    color: "#94A3B8",
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  tableRowNet: {
    backgroundColor: "#F5F3FF",
  },
  tableRowLast: {
    borderBottomWidth: 0,
  },
  tableLabel: {
    flex: 1,
    fontSize: 12,
    fontFamily: "Manrope_500Medium",
    color: "#475569",
  },
  tableLabelBold: {
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  tableLabelSub: {
    paddingLeft: 10,
    color: "#64748B",
  },
  tableLabelNet: {
    fontFamily: "Manrope_700Bold",
    color: "#4338CA",
  },
  tableValue: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  tableValueRed: {
    color: "#EF4444",
    fontFamily: "Manrope_600SemiBold",
  },
  tableValueNet: {
    color: "#4338CA",
  },
  tableValuePurple: {
    color: "#635BFF",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  downloadBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#EEF2FF",
  },
  downloadBtnText: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  downloadedText: {
    color: "#16A34A",
  },
  printBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  closeBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#635BFF",
  },
  closeBtnText: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },
});
