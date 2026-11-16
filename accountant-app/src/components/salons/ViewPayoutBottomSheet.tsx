import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PayoutData } from "@/data/salonsData";
import CustomModal from "@/components/ui/CustomModal";
import CustomButton from "@/components/ui/CustomButton";

interface ViewPayoutBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  payout: PayoutData | null;
}

export default function ViewPayoutBottomSheet({
  visible,
  onClose,
  payout,
}: ViewPayoutBottomSheetProps) {
  if (!payout) return null;

  const isPaid = payout.status === "Paid";

  const handlePreviewInvoice = () => {
    Alert.alert("Invoice Preview", `Displaying PDF for invoice ${payout.invoiceNo}`);
  };

  const handleDownloadInvoice = () => {
    Alert.alert("Download Started", `Downloading PDF invoice ${payout.invoiceNo}...`);
  };

  return (
    <CustomModal visible={visible} onClose={onClose} title="View Request Details">
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContainer}>
        {/* Top Status & Amount Banner matching web ViewPayoutModal */}
        <View style={styles.statusBanner}>
          <View style={styles.statusBannerLeft}>
            <View
              style={[
                styles.statusIconBox,
                { backgroundColor: isPaid ? "#10B981" : "#F59E0B" },
              ]}
            >
              <Ionicons
                name={isPaid ? "checkmark-circle" : "hourglass"}
                size={22}
                color="#FFFFFF"
              />
            </View>
            <View>
              <Text style={styles.statusBannerSub}>Status</Text>
              <Text style={styles.statusBannerTitle}>{payout.status}</Text>
            </View>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.statusBannerSub}>Payout Amount</Text>
            <Text style={styles.statusBannerAmount}>{payout.amount}</Text>
          </View>
        </View>

        {/* Referral Alert Banner */}
        <View style={styles.referralBanner}>
          <Ionicons name="trending-up" size={16} color="#10B981" style={{ marginRight: 8 }} />
          <Text style={styles.referralText}>
            Salon Referred by You — You are earning referral revenue share!
          </Text>
        </View>

        {/* Information Request Box */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Information Request</Text>
          <View style={styles.infoBox}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Requested Date</Text>
              <Text style={styles.infoValue}>{payout.requestDate}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Invoice Number</Text>
              <Text style={styles.infoValue}>{payout.invoiceNo}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Settlement Date</Text>
              <Text
                style={[
                  styles.infoValue,
                  { color: isPaid ? "#10B981" : "#D97706", fontWeight: "700" },
                ]}
              >
                {payout.paymentDate !== "-" ? payout.paymentDate : "Pending Approval"}
              </Text>
            </View>
            {payout.note ? (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Notes</Text>
                <Text style={styles.infoValue}>{payout.note}</Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* Payment Account Data */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Destination Data</Text>
          <View style={styles.infoBox}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>IBAN</Text>
              <Text style={[styles.infoValue, { fontFamily: "monospace" }]}>
                IT60X0542811101000000123456
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Account Beneficiary</Text>
              <Text style={styles.infoValue}>Mario Accountant S.r.l.</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Bank Name</Text>
              <Text style={styles.infoValue}>Intesa Sanpaolo</Text>
            </View>
          </View>
        </View>

        {/* Attached Tax Invoice File */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Attached Invoice</Text>
          <View style={styles.invoiceFileCard}>
            <View style={styles.invoiceFileLeft}>
              <View style={styles.fileIconWrap}>
                <Ionicons name="document-text" size={24} color="#635BFF" />
              </View>
              <View>
                <Text style={styles.fileName}>{payout.invoiceNo}.pdf</Text>
                <Text style={styles.fileMeta}>4.2 MB • Verified Electronic Invoice</Text>
              </View>
            </View>

            <View style={styles.fileActions}>
              <TouchableOpacity
                style={styles.fileActionBtn}
                onPress={handlePreviewInvoice}
                activeOpacity={0.7}
              >
                <Ionicons name="eye-outline" size={16} color="#635BFF" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.fileActionBtn}
                onPress={handleDownloadInvoice}
                activeOpacity={0.7}
              >
                <Ionicons name="download-outline" size={16} color="#635BFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={{ marginTop: 12, marginBottom: 8 }}>
          <CustomButton title="Close" onPress={onClose} variant="primary" />
        </View>
      </ScrollView>
    </CustomModal>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    maxHeight: 520,
  },
  statusBanner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F0FDFB",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#99F6E4",
    marginBottom: 14,
  },
  statusBannerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  statusIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  statusBannerSub: {
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "500",
  },
  statusBannerTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
    marginTop: 2,
  },
  statusBannerAmount: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
    marginTop: 2,
  },
  referralBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFDF5",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  referralText: {
    flex: 1,
    fontSize: 11,
    fontWeight: "700",
    color: "#065F46",
  },
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4B5563",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  infoBox: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 12,
    color: "#6B7280",
  },
  infoValue: {
    fontSize: 12,
    fontWeight: "600",
    color: "#111827",
  },
  invoiceFileCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  invoiceFileLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  fileIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#EEECFF",
    alignItems: "center",
    justifyContent: "center",
  },
  fileName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#635BFF",
  },
  fileMeta: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 2,
  },
  fileActions: {
    flexDirection: "row",
    gap: 6,
  },
  fileActionBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: "#EEECFF",
    alignItems: "center",
    justifyContent: "center",
  },
});
