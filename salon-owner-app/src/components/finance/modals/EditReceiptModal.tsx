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
import { ReceiptRecord, getPaymentMethodStyle } from "../financeData";

interface EditReceiptModalProps {
  visible: boolean;
  onClose: () => void;
  receipt: ReceiptRecord | null;
  onSave: (updated: ReceiptRecord) => void;
}

export default function EditReceiptModal({
  visible,
  onClose,
  receipt,
  onSave,
}: EditReceiptModalProps) {
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<ReceiptRecord["method"]>("Cash");
  const [status, setStatus] = useState<ReceiptRecord["status"]>("Completed");

  useEffect(() => {
    if (receipt) {
      setClientName(receipt.client.name);
      setClientEmail(receipt.client.email);
      setAmount(receipt.amount.replace("€", "").trim());
      setMethod(receipt.method);
      setStatus(receipt.status);
    }
  }, [receipt, visible]);

  const handleSave = () => {
    if (!amount.trim() || !receipt) {
      Alert.alert("Required", "Please enter a valid amount.");
      return;
    }

    const num = parseFloat(amount.replace(/[^0-9.]/g, "")) || 0;
    onSave({
      ...receipt,
      client: {
        ...receipt.client,
        name: clientName.trim() || receipt.client.name,
        email: clientEmail.trim() || receipt.client.email,
      },
      amount: `€ ${num.toFixed(2)}`,
      method,
      status,
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
              <Text style={styles.title}>Edit {receipt?.receiptNumber}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollBody} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
            <View style={styles.formRow}>
              <View style={styles.formCol}>
                <Text style={styles.label}>CLIENT NAME</Text>
                <TextInput
                  style={styles.input}
                  value={clientName}
                  onChangeText={setClientName}
                />
              </View>

              <View style={styles.formCol}>
                <Text style={styles.label}>CLIENT EMAIL</Text>
                <TextInput
                  style={styles.input}
                  value={clientEmail}
                  onChangeText={setClientEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>AMOUNT (€) *</Text>
              <TextInput
                style={styles.input}
                placeholder="150.00"
                placeholderTextColor="#94A3B8"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>PAYMENT METHOD</Text>
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
                      activeOpacity={0.7}
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

            <View style={styles.formGroup}>
              <Text style={styles.label}>STATUS</Text>
              <View style={styles.chipsRow}>
                {(["Completed", "Half Printed", "Not Issued"] as const).map((st) => {
                  const isSelected = status === st;
                  return (
                    <TouchableOpacity
                      key={st}
                      style={[
                        styles.statusChip,
                        isSelected && (st === "Completed" ? styles.statusCompleted : st === "Half Printed" ? styles.statusHalf : styles.statusNotIssued),
                      ]}
                      onPress={() => setStatus(st)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.statusChipText, isSelected && styles.statusChipTextActive]}>
                        {st}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.7}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
              <Text style={styles.saveBtnText}>Save Changes</Text>
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
    maxWidth: 480,
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
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
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
    fontSize: 17,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  closeBtn: {
    padding: 4,
  },
  scrollBody: {
    maxHeight: 480,
  },
  bodyContent: {
    padding: 20,
    gap: 16,
  },
  formRow: {
    flexDirection: "row",
    gap: 12,
  },
  formCol: {
    flex: 1,
    gap: 6,
  },
  formGroup: {
    gap: 6,
  },
  label: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#64748B",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    fontFamily: "Manrope_600SemiBold",
    color: "#1E293B",
    backgroundColor: "#FFFFFF",
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
  },
  chipText: {
    fontSize: 12,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  statusChip: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
  },
  statusChipText: {
    fontSize: 12,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  statusChipTextActive: {
    color: "#FFFFFF",
    fontFamily: "Manrope_700Bold",
  },
  statusCompleted: {
    backgroundColor: "#22C55E",
    borderColor: "#22C55E",
  },
  statusHalf: {
    backgroundColor: "#F59E0B",
    borderColor: "#F59E0B",
  },
  statusNotIssued: {
    backgroundColor: "#EF4444",
    borderColor: "#EF4444",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    backgroundColor: "#FFFFFF",
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtnText: {
    fontSize: 13,
    fontFamily: "Manrope_600SemiBold",
    color: "#475569",
  },
  saveBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 8,
    backgroundColor: "#635BFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#635BFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  saveBtnText: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },
});
