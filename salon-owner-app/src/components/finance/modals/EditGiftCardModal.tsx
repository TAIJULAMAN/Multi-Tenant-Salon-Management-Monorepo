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
import { WebGiftCardRecord } from "../financeData";

interface EditGiftCardModalProps {
  visible: boolean;
  onClose: () => void;
  giftCard: WebGiftCardRecord | null;
  onSave: (updated: WebGiftCardRecord) => void;
}

export default function EditGiftCardModal({
  visible,
  onClose,
  giftCard,
  onSave,
}: EditGiftCardModalProps) {
  const [amount, setAmount] = useState("");
  const [usageLimit, setUsageLimit] = useState("1");
  const [expirationDate, setExpirationDate] = useState("");
  const [eligibleServices, setEligibleServices] = useState("All");
  const [status, setStatus] = useState<WebGiftCardRecord["status"]>("No-Used");
  const [subStatus, setSubStatus] = useState<"Active" | "Expired">("Active");

  useEffect(() => {
    if (giftCard) {
      setAmount(giftCard.amount.toString());
      setUsageLimit(giftCard.usageLimit.toString());
      setExpirationDate(giftCard.expirationDate);
      setEligibleServices(giftCard.eligibleServices);
      setStatus(giftCard.status);
      setSubStatus(giftCard.subStatus || "Active");
    }
  }, [giftCard, visible]);

  const handleSave = () => {
    if (!amount.trim() || !giftCard) {
      Alert.alert("Required", "Please provide amount.");
      return;
    }

    onSave({
      ...giftCard,
      amount: Number(amount) || giftCard.amount,
      usageLimit: Number(usageLimit) || 1,
      expirationDate: expirationDate.trim() || giftCard.expirationDate,
      eligibleServices,
      status,
      subStatus: status === "No-Used" ? subStatus : undefined,
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
              <Text style={styles.title}>Edit Gift Card</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollBody} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
            <View style={styles.codeBox}>
              <Text style={styles.codeLabel}>Voucher ID</Text>
              <Text style={styles.codeVal}>{giftCard?.id}</Text>
            </View>

            <View style={styles.formRow}>
              <View style={styles.formCol}>
                <Text style={styles.label}>AMOUNT (€) *</Text>
                <TextInput
                  style={styles.input}
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="170"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.formCol}>
                <Text style={styles.label}>USAGE LIMIT</Text>
                <TextInput
                  style={styles.input}
                  value={usageLimit}
                  onChangeText={setUsageLimit}
                  placeholder="1"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.formRow}>
              <View style={styles.formCol}>
                <Text style={styles.label}>EXPIRATION DATE</Text>
                <TextInput
                  style={styles.input}
                  value={expirationDate}
                  onChangeText={setExpirationDate}
                  placeholder="8 Aug 2025"
                />
              </View>

              <View style={styles.formCol}>
                <Text style={styles.label}>ELIGIBLE SERVICES</Text>
                <TextInput
                  style={styles.input}
                  value={eligibleServices}
                  onChangeText={setEligibleServices}
                  placeholder="All"
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>STATUS</Text>
              <View style={styles.chipsRow}>
                {(["Used", "No-Used"] as const).map((st) => {
                  const isSelected = status === st;
                  return (
                    <TouchableOpacity
                      key={st}
                      style={[styles.statusChip, isSelected && styles.statusChipActive]}
                      onPress={() => setStatus(st)}
                    >
                      <Text style={[styles.statusChipText, isSelected && styles.statusChipTextActive]}>
                        {st}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {status === "No-Used" && (
              <View style={styles.formGroup}>
                <Text style={styles.label}>SUB STATUS</Text>
                <View style={styles.chipsRow}>
                  {(["Active", "Expired"] as const).map((sub) => {
                    const isSelected = subStatus === sub;
                    return (
                      <TouchableOpacity
                        key={sub}
                        style={[styles.statusChip, isSelected && styles.statusChipActive]}
                        onPress={() => setSubStatus(sub)}
                      >
                        <Text style={[styles.statusChipText, isSelected && styles.statusChipTextActive]}>
                          {sub}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.7}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
              <Text style={styles.saveBtnText}>Save Gift Card</Text>
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
  codeBox: {
    backgroundColor: "#F8FAFC",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  codeLabel: {
    fontSize: 10,
    fontFamily: "Manrope_600SemiBold",
    color: "#94A3B8",
  },
  codeVal: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
    marginTop: 1,
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
    textTransform: "uppercase",
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
  chipsRow: {
    flexDirection: "row",
    gap: 8,
  },
  statusChip: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
    alignItems: "center",
  },
  statusChipActive: {
    backgroundColor: "#635BFF",
    borderColor: "#635BFF",
  },
  statusChipText: {
    fontSize: 11,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  statusChipTextActive: {
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
