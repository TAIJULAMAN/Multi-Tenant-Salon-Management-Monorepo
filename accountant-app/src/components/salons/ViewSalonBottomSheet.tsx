import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { setSelectedSalon } from "@/redux/slices/salonSlice";
import { SalonInfo } from "@/data/salonsData";
import CustomModal from "@/components/ui/CustomModal";
import CustomButton from "@/components/ui/CustomButton";

interface ViewSalonBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  salon: SalonInfo | null;
}

export default function ViewSalonBottomSheet({
  visible,
  onClose,
  salon,
}: ViewSalonBottomSheetProps) {
  const router = useRouter();
  const dispatch = useDispatch();

  if (!salon) return null;

  const handleContactOwner = () => {
    Alert.alert("Contact Salon", `Email drafted to: ${salon.email}`);
  };

  const handleOpenSalonDashboard = () => {
    dispatch(setSelectedSalon(salon.name));
    onClose();
    router.push("/(drawer)/(tabs)/(dashboard)" as any);
  };

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "SRL":
      case "SRLS":
        return { bg: "#EEECFF", text: "#635BFF" };
      case "SPA":
        return { bg: "#ECFDF5", text: "#10B981" };
      case "SNC":
      case "SAS":
        return { bg: "#FEF3C7", text: "#D97706" };
      default:
        return { bg: "#F3F4F6", text: "#4B5563" };
    }
  };

  const badgeColors = getBadgeColor(salon.badge);

  return (
    <CustomModal visible={visible} onClose={onClose} title="Salon Details">
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContainer}>
        {/* Salon Header Card */}
        <View style={styles.headerCard}>
          <View style={styles.salonAvatar}>
            <Ionicons name="storefront" size={26} color="#635BFF" />
          </View>
          <View style={styles.headerInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.salonName}>{salon.name}</Text>
              <View style={[styles.badgeWrap, { backgroundColor: badgeColors.bg }]}>
                <Text style={[styles.badgeText, { color: badgeColors.text }]}>
                  {salon.badge}
                </Text>
              </View>
            </View>
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={14} color="#6B7280" />
              <Text style={styles.locationText}>{salon.city}, Italy</Text>
            </View>
          </View>
        </View>

        {/* Referral Commission Banner matching web CustomAlert */}
        <View style={styles.referralBanner}>
          <Ionicons name="trending-up" size={16} color="#10B981" style={{ marginRight: 8 }} />
          <Text style={styles.referralText}>
            Salon Referred by You — You are earning {salon.referral} on this salon!
          </Text>
        </View>

        {/* Section: Company Legal & Fiscal Information matching web */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Company & Fiscal Information</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Company Legal Name</Text>
              <Text style={styles.infoValue}>
                {salon.name} {salon.badge !== "Ind." ? salon.badge : ""}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Partita IVA / VAT</Text>
              <Text style={styles.infoValue}>IT09876543211</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Codice Destinatario (SDI)</Text>
              <Text style={styles.infoValue}>M5UXCR1</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>PEC Email</Text>
              <Text style={styles.infoValue}>
                {salon.name.toLowerCase().replace(/[^a-z0-9]/g, "")}@pec.it
              </Text>
            </View>
          </View>
        </View>

        {/* Section: Owner & Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Owner Contacts</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Owner Full Name</Text>
              <Text style={styles.infoValue}>{salon.ownerName}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Direct Email</Text>
              <Text style={styles.infoValue}>{salon.email}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone Number</Text>
              <Text style={styles.infoValue}>+39 06 6987 6543</Text>
            </View>
          </View>
        </View>

        {/* Section: Subscription & Plan */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Subscription & Financials</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Plan Tier</Text>
              <View style={styles.planBadge}>
                <Text style={styles.planText}>{salon.plan}</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Subscription Fee</Text>
              <Text style={styles.infoValue}>{salon.planPrice}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Payment Status</Text>
              <View
                style={[
                  styles.statusPill,
                  salon.paymentStatus === "In order"
                    ? styles.statusInOrder
                    : styles.statusLate,
                ]}
              >
                <Ionicons
                  name={
                    salon.paymentStatus === "In order"
                      ? "checkmark-circle"
                      : "alert-circle"
                  }
                  size={12}
                  color={salon.paymentStatus === "In order" ? "#10B981" : "#EF4444"}
                  style={{ marginRight: 4 }}
                />
                <Text
                  style={[
                    styles.statusText,
                    salon.paymentStatus === "In order"
                      ? styles.statusTextInOrder
                      : styles.statusTextLate,
                  ]}
                >
                  {salon.paymentStatus}
                </Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Next Renewal</Text>
              <Text style={styles.infoValue}>{salon.nextRenewal}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Commission to Date</Text>
              <Text style={[styles.infoValue, { color: "#635BFF", fontWeight: "700" }]}>
                €1,450.00
              </Text>
            </View>
          </View>
        </View>

        {/* Connected Date Badge */}
        <View style={styles.connectedCard}>
          <Text style={styles.connectedLabel}>Connected by</Text>
          <Text style={styles.connectedDate}>January 9, 2024</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <CustomButton
            title="Open Salon Dashboard"
            onPress={handleOpenSalonDashboard}
            variant="primary"
            style={styles.openDashboardBtn}
            icon={<Ionicons name="apps-outline" size={16} color="#FFFFFF" />}
          />
          <CustomButton
            title="Contact Owner"
            onPress={handleContactOwner}
            variant="outline"
            style={styles.contactBtn}
            icon={<Ionicons name="mail-outline" size={16} color="#111827" />}
          />
        </View>
      </ScrollView>
    </CustomModal>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    maxHeight: 520,
  },
  headerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  salonAvatar: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#EEECFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  salonName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    flexShrink: 1,
  },
  badgeWrap: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  locationText: {
    fontSize: 12,
    color: "#6B7280",
  },
  referralBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginBottom: 16,
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
  infoGrid: {
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
  planBadge: {
    backgroundColor: "#EEECFF",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  planText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#635BFF",
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusInOrder: {
    backgroundColor: "#ECFDF5",
  },
  statusLate: {
    backgroundColor: "#FEF2F2",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
  },
  statusTextInOrder: {
    color: "#10B981",
  },
  statusTextLate: {
    color: "#EF4444",
  },
  connectedCard: {
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  connectedLabel: {
    fontSize: 10,
    color: "#6B7280",
    marginBottom: 2,
  },
  connectedDate: {
    fontSize: 12,
    fontWeight: "700",
    color: "#111827",
  },
  actionRow: {
    gap: 8,
    marginTop: 4,
    marginBottom: 10,
  },
  openDashboardBtn: {
    width: "100%",
  },
  contactBtn: {
    width: "100%",
  },
});
