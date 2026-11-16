import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PaymentRecord, getPaymentMethodStyle } from "../financeData";

interface EditPaymentModalProps {
  visible: boolean;
  onClose: () => void;
  payment: PaymentRecord | null;
  onSave: (updated: PaymentRecord) => void;
}

export default function EditPaymentModal({
  visible,
  onClose,
  payment,
  onSave,
}: EditPaymentModalProps) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<PaymentRecord["method"]>("Cash");
  const [status, setStatus] = useState<PaymentRecord["status"]>("Fully Paid");
  const [receiptStatus, setReceiptStatus] = useState<PaymentRecord["receiptStatus"]>("Completed");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (payment) {
      setAmount(payment.amount.replace("€", "").trim());
      setMethod(payment.method);
      setStatus(payment.status);
      setReceiptStatus(payment.receiptStatus);
      setNotes(payment.notes || "");
    }
  }, [payment, visible]);

  const handleSave = () => {
    if (!amount.trim() || !payment) {
      Alert.alert("Required", "Please enter a valid amount.");
      return;
    }

    const numAmount = parseFloat(amount.replace(/[^0-9.]/g, "")) || 0;

    onSave({
      ...payment,
      amount: `€ ${numAmount.toFixed(2)}`,
      method,
      status,
      receiptStatus,
      notes: notes.trim(),
    });
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity style={styles.modalCard} activeOpacity={1} onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <View style={styles.iconCircle}>
                <Ionicons name="create-outline" size={18} color="#635BFF" />
              </View>
              <Text style={styles.title}>Edit Payment #{payment?.id}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollBody} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
            <View style={styles.clientBox}>
              <Text style={styles.clientLabel}>Client</Text>
              <Text style={styles.clientName}>{payment?.client.name}</Text>
              <Text style={styles.clientEmail}>{payment?.client.email}</Text>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Amount (€) *</Text>
              <TextInput
                style={styles.input}
                placeholder="120.00"
                placeholderTextColor="#94A3B8"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Payment Method</Text>
              <View style={styles.chipsRow}>
                {(["Cash", "Card Terminal", "Gift Card", "Online Payment"] as const).map((m) => {
                  const isSelected = method === m;
                  const mStyle = getPaymentMethodStyle(m);
                  return (
                    <TouchableOpacity
                      key={m}
                      style={[
                        styles.chip,
                        isSelected && { borderColor: mStyle.text, backgroundColor: mStyle.bg },
                      ]}
                      onPress={() => setMethod(m)}
                    >
                      <Ionicons name={mStyle.icon as any} size={13} color={isSelected ? mStyle.text : "#64748B"} />
                      <Text style={[styles.chipText, isSelected && { color: mStyle.text, fontFamily: "Manrope_700Bold" }]}>
                        {m}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.rowTwoCols}>
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.label}>Payment Status</Text>
                <View style={styles.chipsRowVertical}>
                  {(["Fully Paid", "Half Paid", "Not Paid"] as const).map((st) => (
                    <TouchableOpacity
                      key={st}
                      style={[styles.smallChip, status === st && styles.smallChipActive]}
                      onPress={() => setStatus(st)}
                    >
                      <Text style={[styles.smallChipText, status === st && styles.smallChipTextActive]}>
                        {st}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.label}>Receipt Status</Text>
                <View style={styles.chipsRowVertical}>
                  {(["Completed", "Half Printed", "Not Issued"] as const).map((rc) => (
                    <TouchableOpacity
                      key={rc}
                      style={[styles.smallChip, receiptStatus === rc && styles.smallChipActive]}
                      onPress={() => setReceiptStatus(rc)}
                    >
                      <Text style={[styles.smallChipText, receiptStatus === rc && styles.smallChipTextActive]}>
                        {rc}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Transaction Notes</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Optional notes or references..."
                placeholderTextColor="#94A3B8"
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={2}
              />
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.7}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
              <Text style={styles.saveBtnText}>Update Payment</Text>
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
    maxWidth: 440,
    maxHeight: "85%",
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
  scrollBody: {
    flexGrow: 0,
  },
  bodyContent: {
    padding: 18,
    gap: 12,
  },
  clientBox: {
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  clientLabel: {
    fontSize: 10,
    fontFamily: "Manrope_600SemiBold",
    color: "#94A3B8",
  },
  clientName: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  clientEmail: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
  },
  formGroup: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
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
  rowTwoCols: {
    flexDirection: "row",
    gap: 10,
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  chipsRowVertical: {
    gap: 5,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
  },
  chipText: {
    fontSize: 11,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  smallChip: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
    alignItems: "center",
  },
  smallChipActive: {
    backgroundColor: "#635BFF",
    borderColor: "#635BFF",
  },
  smallChipText: {
    fontSize: 11,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  smallChipTextActive: {
    color: "#FFFFFF",
    fontFamily: "Manrope_700Bold",
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
  saveBtn: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#635BFF",
  },
  saveBtnText: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },
});
