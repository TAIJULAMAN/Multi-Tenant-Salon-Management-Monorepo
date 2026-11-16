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
import { WebGiftCardRecord } from "../financeData";

interface ViewGiftCardModalProps {
  visible: boolean;
  onClose: () => void;
  giftCard: WebGiftCardRecord | null;
}

export default function ViewGiftCardModal({
  visible,
  onClose,
  giftCard,
}: ViewGiftCardModalProps) {
  if (!giftCard) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity style={styles.modalCard} activeOpacity={1} onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <View style={styles.iconCircle}>
                <Ionicons name="gift-outline" size={18} color="#635BFF" />
              </View>
              <Text style={styles.title}>Gift Card Voucher</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          <View style={styles.body}>
            {/* Voucher Card Mockup */}
            <View style={styles.voucherCard}>
              <View style={styles.voucherTop}>
                <Text style={styles.voucherName}>Gift Card {giftCard.id}</Text>
                <View style={styles.statusRow}>
                  {giftCard.status === "Used" ? (
                    <View style={styles.usedBadge}>
                      <Text style={styles.usedBadgeText}>Used</Text>
                    </View>
                  ) : (
                    <>
                      <View style={styles.noUsedBadge}>
                        <Text style={styles.noUsedBadgeText}>No-Used</Text>
                      </View>
                      {giftCard.subStatus && (
                        <View
                          style={[
                            styles.subStatusBadge,
                            giftCard.subStatus === "Active"
                              ? styles.subStatusActive
                              : styles.subStatusExpired,
                          ]}
                        >
                          <Text
                            style={[
                              styles.subStatusText,
                              giftCard.subStatus === "Active"
                                ? { color: "#16A34A" }
                                : { color: "#EF4444" },
                            ]}
                          >
                            {giftCard.subStatus}
                          </Text>
                        </View>
                      )}
                    </>
                  )}
                </View>
              </View>

              <Text style={styles.voucherCode}>{giftCard.id}-VOUCHER</Text>

              <View style={styles.voucherBottom}>
                <View>
                  <Text style={styles.voucherLabel}>Voucher Value</Text>
                  <Text style={styles.voucherBalance}>€ {giftCard.amount}</Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={styles.voucherLabel}>Usage Limit</Text>
                  <Text style={styles.voucherOriginal}>{giftCard.usageLimit} time(s)</Text>
                </View>
              </View>
            </View>

            {/* Info rows */}
            <View style={styles.infoList}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Date of Issue</Text>
                <Text style={styles.infoVal}>{giftCard.issueDate}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Date of Expiration</Text>
                <Text style={styles.infoVal}>{giftCard.expirationDate}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Eligible Services</Text>
                <Text style={styles.infoVal}>{giftCard.eligibleServices}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Salon</Text>
                <Text style={styles.infoVal}>{giftCard.salonName || "CEU HAREM ACCONCIATURE"}</Text>
              </View>
            </View>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.shareBtn}
              onPress={() => {
                Alert.alert("Share Code", `Voucher code ${giftCard.id} copied to clipboard.`);
                onClose();
              }}
              activeOpacity={0.85}
            >
              <Ionicons name="copy-outline" size={16} color="#FFFFFF" />
              <Text style={styles.shareBtnText}>Copy Voucher Code</Text>
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
  voucherCard: {
    backgroundColor: "#635BFF",
    borderRadius: 14,
    padding: 16,
    gap: 12,
    shadowColor: "#635BFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  voucherTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  voucherName: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },
  statusRow: {
    flexDirection: "row",
    gap: 4,
  },
  usedBadge: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  usedBadgeText: {
    fontSize: 10,
    fontFamily: "Manrope_700Bold",
    color: "#16A34A",
  },
  noUsedBadge: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  noUsedBadgeText: {
    fontSize: 10,
    fontFamily: "Manrope_700Bold",
    color: "#D97706",
  },
  subStatusBadge: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
    borderWidth: 1,
  },
  subStatusActive: {
    borderColor: "#22C55E",
  },
  subStatusExpired: {
    borderColor: "#EF4444",
  },
  subStatusText: {
    fontSize: 9,
    fontFamily: "Manrope_700Bold",
  },
  voucherCode: {
    fontSize: 18,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
    letterSpacing: 2,
    textAlign: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingVertical: 6,
    borderRadius: 8,
  },
  voucherBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  voucherLabel: {
    fontSize: 10,
    fontFamily: "Manrope_500Medium",
    color: "#E0E7FF",
  },
  voucherBalance: {
    fontSize: 18,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },
  voucherOriginal: {
    fontSize: 13,
    fontFamily: "Manrope_600SemiBold",
    color: "#E0E7FF",
  },
  infoList: {
    gap: 8,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  infoLabel: {
    fontSize: 12,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
  },
  infoVal: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  footer: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    backgroundColor: "#F8FAFC",
  },
  shareBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#635BFF",
    paddingVertical: 10,
    borderRadius: 8,
  },
  shareBtnText: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },
});
