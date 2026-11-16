import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PaymentRecord } from "../financeData";

interface RefundPaymentModalProps {
  visible: boolean;
  onClose: () => void;
  payment: PaymentRecord | null;
  onConfirmRefund: (refundAmount: string, reason: string) => void;
}

export default function RefundPaymentModal({
  visible,
  onClose,
  payment,
  onConfirmRefund,
}: RefundPaymentModalProps) {
  const [refundAmount, setRefundAmount] = useState("");
  const [refundType, setRefundType] = useState<"Full" | "Partial">("Full");
  const [reason, setReason] = useState("Client dissatisfaction");

  const handleConfirm = () => {
    const finalAmount = refundType === "Full" ? payment?.amount || "€ 0" : `€ ${refundAmount}`;
    onConfirmRefund(finalAmount, reason);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity style={styles.modalCard} activeOpacity={1} onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <View style={styles.iconCircle}>
                <Ionicons name="refresh-outline" size={18} color="#D97706" />
              </View>
              <Text style={styles.title}>Issue Refund</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          <View style={styles.body}>
            <View style={styles.paymentSummaryBox}>
              <Text style={styles.summaryLabel}>Transaction #{payment?.id}</Text>
              <Text style={styles.summaryClient}>{payment?.client.name}</Text>
              <Text style={styles.summaryAmount}>Original Total: {payment?.amount}</Text>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Refund Type</Text>
              <View style={styles.typeRow}>
                {(["Full", "Partial"] as const).map((type) => {
                  const isSelected = refundType === type;
                  return (
                    <TouchableOpacity
                      key={type}
                      style={[styles.typeChip, isSelected && styles.typeChipActive]}
                      onPress={() => setRefundType(type)}
                    >
                      <Text style={[styles.typeChipText, isSelected && styles.typeChipTextActive]}>
                        {type} Refund {type === "Full" ? `(${payment?.amount})` : ""}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {refundType === "Partial" && (
              <View style={styles.formGroup}>
                <Text style={styles.label}>Partial Amount (€) *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 50.00"
                  placeholderTextColor="#94A3B8"
                  value={refundAmount}
                  onChangeText={setRefundAmount}
                  keyboardType="numeric"
                />
              </View>
            )}

            <View style={styles.formGroup}>
              <Text style={styles.label}>Refund Reason</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Reason for refund..."
                placeholderTextColor="#94A3B8"
                value={reason}
                onChangeText={setReason}
                multiline
                numberOfLines={2}
              />
            </View>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.7}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm} activeOpacity={0.85}>
              <Text style={styles.confirmBtnText}>Process Refund</Text>
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
    maxWidth: 420,
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
    backgroundColor: "#FEF3C7",
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
  paymentSummaryBox: {
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 2,
  },
  summaryLabel: {
    fontSize: 10,
    fontFamily: "Manrope_600SemiBold",
    color: "#94A3B8",
  },
  summaryClient: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  summaryAmount: {
    fontSize: 12,
    fontFamily: "Manrope_600SemiBold",
    color: "#635BFF",
    marginTop: 2,
  },
  formGroup: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  typeRow: {
    flexDirection: "row",
    gap: 8,
  },
  typeChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
    alignItems: "center",
  },
  typeChipActive: {
    borderColor: "#D97706",
    backgroundColor: "#FEF3C7",
  },
  typeChipText: {
    fontSize: 11,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  typeChipTextActive: {
    color: "#D97706",
    fontFamily: "Manrope_700Bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    fontFamily: "Manrope_500Medium",
    color: "#1E293B",
    backgroundColor: "#FFFFFF",
  },
  textArea: {
    height: 55,
    textAlignVertical: "top",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    backgroundColor: "#F8FAFC",
  },
  cancelBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  cancelBtnText: {
    fontSize: 13,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  confirmBtn: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#D97706",
  },
  confirmBtnText: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },
});
