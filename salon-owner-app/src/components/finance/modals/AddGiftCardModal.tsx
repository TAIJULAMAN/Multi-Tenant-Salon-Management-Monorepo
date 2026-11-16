import React, { useState } from "react";
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
import { WebGiftCardRecord } from "../financeData";

interface AddGiftCardModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (giftCard: WebGiftCardRecord) => void;
}

export default function AddGiftCardModal({ visible, onClose, onSave }: AddGiftCardModalProps) {
  const [name, setName] = useState("VIP Holiday Gift Card");
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [amount, setAmount] = useState("100.00");
  const [usageLimit, setUsageLimit] = useState("1 Time");
  const [eligibleServices, setEligibleServices] = useState("All Services");
  const [expirationMonths, setExpirationMonths] = useState("6 Months");

  const handleSave = () => {
    if (!name.trim() || !recipientName.trim() || !amount.trim()) {
      Alert.alert("Required", "Please provide gift card title, recipient name, and amount.");
      return;
    }

    const num = parseFloat(amount.replace(/[^0-9.]/g, "")) || 0;
    const randomCode = name.toUpperCase().replace(/\s+/g, "-").slice(0, 10) + "-" + Math.floor(100 + Math.random() * 900);

    const newCard: WebGiftCardRecord = {
      id: `#${Math.floor(1000 + Math.random() * 9000)}`,
      issueDate: "Today",
      expirationDate: "In " + expirationMonths,
      amount: num,
      eligibleServices,
      usageLimit: parseInt(usageLimit) || 1,
      status: "No-Used",
      subStatus: "Active",
      receiverName: recipientName.trim(),
    };

    onSave(newCard);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity style={styles.modalCard} activeOpacity={1} onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <View style={styles.iconCircle}>
                <Ionicons name="gift-outline" size={18} color="#635BFF" />
              </View>
              <Text style={styles.title}>Issue Gift Card</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollBody} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Gift Card Title *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Birthday Treat Voucher"
                placeholderTextColor="#94A3B8"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.rowTwoCols}>
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.label}>Recipient Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Recipient Name"
                  placeholderTextColor="#94A3B8"
                  value={recipientName}
                  onChangeText={setRecipientName}
                />
              </View>
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.label}>Initial Value (€) *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="100.00"
                  placeholderTextColor="#94A3B8"
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Recipient Email</Text>
              <TextInput
                style={styles.input}
                placeholder="recipient@example.com"
                placeholderTextColor="#94A3B8"
                value={recipientEmail}
                onChangeText={setRecipientEmail}
              />
            </View>

            <View style={styles.rowTwoCols}>
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.label}>Usage Limit</Text>
                <TextInput
                  style={styles.input}
                  value={usageLimit}
                  onChangeText={setUsageLimit}
                />
              </View>
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.label}>Validity Period</Text>
                <TextInput
                  style={styles.input}
                  value={expirationMonths}
                  onChangeText={setExpirationMonths}
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Eligible Services</Text>
              <TextInput
                style={styles.input}
                value={eligibleServices}
                onChangeText={setEligibleServices}
              />
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.7}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
              <Text style={styles.saveBtnText}>Generate Gift Card</Text>
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
  rowTwoCols: {
    flexDirection: "row",
    gap: 10,
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
