import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PaymentRecord, getPaymentMethodStyle } from "../financeData";

interface AddPaymentModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (payment: PaymentRecord) => void;
}

export default function AddPaymentModal({
  visible,
  onClose,
  onSave,
}: AddPaymentModalProps) {
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [teamMemberName, setTeamMemberName] = useState("");
  const [teamMemberEmail, setTeamMemberEmail] = useState("");
  const [method, setMethod] = useState<PaymentRecord["method"]>("Cash");
  const [status, setStatus] = useState<PaymentRecord["status"]>("Fully Paid");
  const [receiptStatus, setReceiptStatus] = useState<PaymentRecord["receiptStatus"]>("Completed");

  const resetForm = () => {
    setClientName("");
    setClientEmail("");
    setTeamMemberName("");
    setTeamMemberEmail("");
    setMethod("Cash");
    setStatus("Fully Paid");
    setReceiptStatus("Completed");
  };

  const handleSave = () => {
    const newPayment: PaymentRecord = {
      id: "#" + Math.floor(Math.random() * 1000).toString().padStart(3, "0"),
      date: new Date().toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      client: {
        name: clientName.trim() || "Maria Rodriguez",
        email: clientEmail.trim() || "maria@example.com",
      },
      teamMember: {
        name: teamMemberName.trim() || "Sarah Smith",
        email: teamMemberEmail.trim() || "sarah@example.com",
      },
      amount: "€ 170.00",
      subtotal: "€ 141.67",
      tax: "€ 28.33",
      method,
      status,
      receiptStatus,
    };

    onSave(newPayment);
    resetForm();
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity
          style={styles.modalCard}
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Add Payment</Text>
            <TouchableOpacity
              onPress={() => {
                resetForm();
                onClose();
              }}
              style={styles.closeBtn}
            >
              <Ionicons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Form Body */}
          <ScrollView
            style={styles.scrollBody}
            contentContainerStyle={styles.bodyContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Row 1: Client Name & Client Email */}
            <View style={styles.formRow}>
              <View style={styles.formCol}>
                <Text style={styles.label}>CLIENT NAME</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Maria Rodriguez"
                  placeholderTextColor="#94A3B8"
                  value={clientName}
                  onChangeText={setClientName}
                />
              </View>

              <View style={styles.formCol}>
                <Text style={styles.label}>CLIENT EMAIL</Text>
                <TextInput
                  style={styles.input}
                  placeholder="maria@example.com"
                  placeholderTextColor="#94A3B8"
                  value={clientEmail}
                  onChangeText={setClientEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Row 2: Team Member Name & Team Member Email */}
            <View style={styles.formRow}>
              <View style={styles.formCol}>
                <Text style={styles.label}>TEAM MEMBER NAME</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Sarah Smith"
                  placeholderTextColor="#94A3B8"
                  value={teamMemberName}
                  onChangeText={setTeamMemberName}
                />
              </View>

              <View style={styles.formCol}>
                <Text style={styles.label}>TEAM MEMBER EMAIL</Text>
                <TextInput
                  style={styles.input}
                  placeholder="sarah@example.com"
                  placeholderTextColor="#94A3B8"
                  value={teamMemberEmail}
                  onChangeText={setTeamMemberEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* METHOD SELECTION CHIPS */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>METHOD</Text>
              <View style={styles.chipsGrid}>
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
                      <Ionicons
                        name={mStyle.icon as any}
                        size={14}
                        color={isSelected ? mStyle.text : "#64748B"}
                      />
                      <Text
                        style={[
                          styles.chipText,
                          isSelected && { color: mStyle.text, fontFamily: "Manrope_700Bold" },
                        ]}
                      >
                        {m}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* STATUS & RECEIPT STATUS ROW */}
            <View style={styles.formRow}>
              {/* Payment Status Selection */}
              <View style={styles.formCol}>
                <Text style={styles.label}>STATUS</Text>
                <View style={styles.verticalChips}>
                  {(["Fully Paid", "Half Paid", "Not Paid"] as const).map((st) => {
                    const isSelected = status === st;
                    return (
                      <TouchableOpacity
                        key={st}
                        style={[
                          styles.smallChip,
                          isSelected && (st === "Fully Paid" ? styles.statusFullyPaid : st === "Half Paid" ? styles.statusHalfPaid : styles.statusNotPaid),
                        ]}
                        onPress={() => setStatus(st)}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.smallChipText,
                            isSelected && styles.smallChipTextActive,
                          ]}
                        >
                          {st}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Receipt Status Selection */}
              <View style={styles.formCol}>
                <Text style={styles.label}>RECEIPT STATUS</Text>
                <View style={styles.verticalChips}>
                  {(["Completed", "Half Printed", "Not Issued"] as const).map((rst) => {
                    const isSelected = receiptStatus === rst;
                    return (
                      <TouchableOpacity
                        key={rst}
                        style={[
                          styles.smallChip,
                          isSelected && styles.receiptStatusActive,
                        ]}
                        onPress={() => setReceiptStatus(rst)}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.smallChipText,
                            isSelected && styles.receiptStatusTextActive,
                          ]}
                        >
                          {rst}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Footer Buttons */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => {
                resetForm();
                onClose();
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.saveBtn}
              onPress={handleSave}
              activeOpacity={0.85}
            >
              <Text style={styles.saveBtnText}>Save Payment</Text>
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
    maxWidth: 520,
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
  title: {
    fontSize: 17,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  closeBtn: {
    padding: 4,
  },
  scrollBody: {
    maxHeight: 520,
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
  chipsGrid: {
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
  verticalChips: {
    gap: 6,
  },
  smallChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
  },
  smallChipText: {
    fontSize: 12,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  smallChipTextActive: {
    color: "#FFFFFF",
    fontFamily: "Manrope_700Bold",
  },
  statusFullyPaid: {
    backgroundColor: "#22C55E",
    borderColor: "#22C55E",
  },
  statusHalfPaid: {
    backgroundColor: "#F59E0B",
    borderColor: "#F59E0B",
  },
  statusNotPaid: {
    backgroundColor: "#EF4444",
    borderColor: "#EF4444",
  },
  receiptStatusActive: {
    backgroundColor: "#EEF2FF",
    borderColor: "#635BFF",
  },
  receiptStatusTextActive: {
    color: "#635BFF",
    fontFamily: "Manrope_700Bold",
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
