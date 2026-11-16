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
import { PaymentRecord } from "../financeData";

interface PrintReceiptModalProps {
  visible: boolean;
  onClose: () => void;
  payment: PaymentRecord | null;
  onNavigateToReceiptView?: () => void;
}

export default function PrintReceiptModal({
  visible,
  onClose,
  payment,
  onNavigateToReceiptView,
}: PrintReceiptModalProps) {
  const handlePrint = (type: "Bluetooth Thermal" | "AirPrint / PDF" | "Email Client") => {
    Alert.alert("Print Job Queued", `Sending receipt for #${payment?.id} to ${type}...`);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity style={styles.modalCard} activeOpacity={1} onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <View style={styles.iconCircle}>
                <Ionicons name="print-outline" size={18} color="#635BFF" />
              </View>
              <Text style={styles.title}>Print & Share Receipt</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          <View style={styles.body}>
            <View style={styles.receiptTeaser}>
              <Text style={styles.teaserNum}>Receipt #{payment?.id}</Text>
              <Text style={styles.teaserClient}>{payment?.client.name} • {payment?.amount}</Text>
            </View>

            <TouchableOpacity
              style={styles.optionBtn}
              onPress={() => handlePrint("Bluetooth Thermal")}
              activeOpacity={0.7}
            >
              <View style={styles.optionIconBox}>
                <Ionicons name="bluetooth" size={18} color="#0D9488" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.optionTitle}>Thermal POS Printer</Text>
                <Text style={styles.optionSub}>Direct 58mm / 80mm Bluetooth receipt</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionBtn}
              onPress={() => handlePrint("AirPrint / PDF")}
              activeOpacity={0.7}
            >
              <View style={[styles.optionIconBox, { backgroundColor: "#EEF2FF" }]}>
                <Ionicons name="document-text-outline" size={18} color="#635BFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.optionTitle}>AirPrint / Save PDF</Text>
                <Text style={styles.optionSub}>A4 standard certified tax format</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionBtn}
              onPress={() => handlePrint("Email Client")}
              activeOpacity={0.7}
            >
              <View style={[styles.optionIconBox, { backgroundColor: "#FEF3C7" }]}>
                <Ionicons name="mail-outline" size={18} color="#D97706" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.optionTitle}>Send via Email</Text>
                <Text style={styles.optionSub}>Deliver to {payment?.client.email}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
            </TouchableOpacity>

            {onNavigateToReceiptView && (
              <TouchableOpacity
                style={styles.viewFullBtn}
                onPress={() => {
                  onClose();
                  onNavigateToReceiptView();
                }}
                activeOpacity={0.7}
              >
                <Ionicons name="eye-outline" size={16} color="#635BFF" />
                <Text style={styles.viewFullBtnText}>Open Full Receipt Preview</Text>
              </TouchableOpacity>
            )}
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
    gap: 10,
  },
  receiptTeaser: {
    backgroundColor: "#F8FAFC",
    padding: 10,
    borderRadius: 8,
    marginBottom: 4,
  },
  teaserNum: {
    fontSize: 11,
    fontFamily: "Manrope_600SemiBold",
    color: "#94A3B8",
  },
  teaserClient: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  optionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
  },
  optionIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#CCFBF1",
    alignItems: "center",
    justifyContent: "center",
  },
  optionTitle: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  optionSub: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    marginTop: 1,
  },
  viewFullBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    marginTop: 6,
    borderRadius: 8,
    backgroundColor: "#EEF2FF",
  },
  viewFullBtnText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
});
