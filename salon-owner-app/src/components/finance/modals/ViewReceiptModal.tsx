import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ReceiptRecord, getReceiptStatusStyle, getPaymentMethodStyle } from "../financeData";

interface ViewReceiptModalProps {
  visible: boolean;
  onClose: () => void;
  receipt: ReceiptRecord | null;
  onPrint?: () => void;
}

export default function ViewReceiptModal({
  visible,
  onClose,
  receipt,
  onPrint,
}: ViewReceiptModalProps) {
  if (!receipt) return null;

  const rcStyle = getReceiptStatusStyle(receipt.status);
  const mStyle = getPaymentMethodStyle(receipt.method);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity style={styles.modalCard} activeOpacity={1} onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <View style={styles.iconCircle}>
                <Ionicons name="receipt-outline" size={18} color="#635BFF" />
              </View>
              <Text style={styles.title}>{receipt.receiptNumber}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          <View style={styles.body}>
            {/* Amount Banner */}
            <View style={styles.amountBanner}>
              <Text style={styles.amountLabel}>Total Amount</Text>
              <Text style={styles.amountVal}>{receipt.amount}</Text>
              <View style={[styles.statusPill, { backgroundColor: rcStyle.bg, borderColor: rcStyle.border }]}>
                <Text style={[styles.statusPillText, { color: rcStyle.text }]}>{receipt.status}</Text>
              </View>
            </View>

            {/* Receipt Details */}
            <View style={styles.detailsList}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Client Name</Text>
                <Text style={styles.detailValue}>{receipt.client.name}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Client Email</Text>
                <Text style={styles.detailValue}>{receipt.client.email}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Payment Method</Text>
                <View style={[styles.methodBadge, { backgroundColor: mStyle.bg }]}>
                  <Text style={[styles.methodBadgeText, { color: mStyle.text }]}>{receipt.method}</Text>
                </View>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Date & Time</Text>
                <Text style={styles.detailValue}>{receipt.date}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Tax ID / VAT</Text>
                <Text style={styles.detailValue}>{receipt.taxId}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Payment ID</Text>
                <Text style={styles.detailValue}>#{receipt.paymentId}</Text>
              </View>
            </View>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.printBtn}
              onPress={() => {
                onClose();
                if (onPrint) onPrint();
                else Alert.alert("Print", `Printing ${receipt.receiptNumber}...`);
              }}
              activeOpacity={0.85}
            >
              <Ionicons name="print-outline" size={16} color="#FFFFFF" />
              <Text style={styles.printBtnText}>Print Receipt</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
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
  modalCard: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  closeBtn: {
    padding: 4,
  },
  body: {
    padding: 18,
    gap: 14,
  },
  amountBanner: {
    backgroundColor: "#F8FAFC",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  amountLabel: {
    fontSize: 11,
    fontFamily: "Manrope_600SemiBold",
    color: "#94A3B8",
  },
  amountVal: {
    fontSize: 24,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 4,
  },
  statusPillText: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
  },
  detailsList: {
    gap: 10,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  detailLabel: {
    fontSize: 12,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
  },
  detailValue: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  methodBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  methodBadgeText: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
  },
  footer: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    backgroundColor: "#F8FAFC",
  },
  printBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#635BFF",
    paddingVertical: 10,
    borderRadius: 8,
  },
  printBtnText: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },
});
