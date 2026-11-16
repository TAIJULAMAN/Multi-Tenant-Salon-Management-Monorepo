import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { setSelectedSalon } from "@/redux/slices/salonSlice";

export default function ViewSalonScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const params = useLocalSearchParams<{
    id?: string;
    name?: string;
    badge?: string;
    ownerName?: string;
    city?: string;
    email?: string;
    plan?: string;
    planPrice?: string;
    paymentStatus?: string;
    nextRenewal?: string;
    referral?: string;
  }>();

  // Fallback / Selected details
  const salonName = params.name || "Beauty Wellness Center";
  const badge = params.badge || "SRL";
  const ownerName = params.ownerName || "Roberto Marini";
  const city = params.city || "Bologna";
  const email = params.email || "roberto@beautywellness.com";
  const plan = params.plan || "Premium";
  const planPrice = params.planPrice || "Annual • €2,000.00 / year";
  const paymentStatus = params.paymentStatus || "In order";
  const nextRenewal = params.nextRenewal || "Dec 01, 2024";
  const referral = params.referral || "30%";

  const handleOpenSalonDashboard = () => {
    dispatch(setSelectedSalon(salonName));
    Alert.alert(
      "Switched Salon",
      `Active salon set to ${salonName}. Redirecting to dashboard...`,
      [
        {
          text: "Open Dashboard",
          onPress: () => router.push("/(drawer)/(tabs)/(dashboard)" as any),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>View Salon</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Salon Header Card */}
        <View style={styles.salonHeroCard}>
          <View style={styles.heroTop}>
            <View style={styles.salonAvatar}>
              <Ionicons name="business" size={26} color="#635BFF" />
            </View>

            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Text style={styles.salonNameHero}>{salonName}</Text>
                <View style={styles.badgePill}>
                  <Text style={styles.badgePillText}>{badge}</Text>
                </View>
              </View>
              <Text style={styles.salonCityHero}>{city}, Italy</Text>
            </View>
          </View>

          {/* Referral Banner */}
          <View style={styles.referralBanner}>
            <Ionicons name="trending-up" size={16} color="#635BFF" />
            <Text style={styles.referralText}>
              Salon Referred by You —{" "}
              <Text style={{ fontWeight: "700" }}>You are earning {referral} on this salon!</Text>
            </Text>
          </View>
        </View>

        {/* Company Information Card */}
        <View style={styles.card}>
          <Text style={styles.sectionHeading}>Company Information</Text>

          <View style={styles.twoColRow}>
            <View style={styles.colHalf}>
              <Text style={styles.fieldLabel}>COMPANY NAME</Text>
              <Text style={styles.fieldValue}>{salonName}</Text>
            </View>

            <View style={styles.colHalf}>
              <Text style={styles.fieldLabel}>VAT NUMBER</Text>
              <Text style={styles.fieldValue}>IT12345678901</Text>
            </View>
          </View>

          <View style={[styles.twoColRow, { marginTop: 14 }]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.fieldLabel}>ADDRESS</Text>
              <Text style={styles.fieldValue}>{city}, Italy</Text>
            </View>
          </View>
        </View>

        {/* Owner Contacts Card */}
        <View style={styles.card}>
          <Text style={styles.sectionHeading}>Owner Contacts</Text>

          <Text style={styles.fieldLabel}>NAME</Text>
          <View style={styles.ownerContactRow}>
            <View style={styles.ownerAvatar}>
              <Text style={{ fontSize: 18 }}>👨‍💼</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.ownerNameText}>{ownerName}</Text>
              <Text style={styles.ownerEmailText}>{email}</Text>
            </View>
          </View>
        </View>

        {/* Subscription Info Card */}
        <View style={styles.card}>
          <Text style={styles.sectionHeading}>Subscription</Text>

          <View style={styles.twoColRow}>
            <View style={styles.colHalf}>
              <Text style={styles.fieldLabel}>PLAN</Text>
              <View style={styles.planBadge}>
                <Text style={styles.planBadgeText}>{plan}</Text>
              </View>
            </View>

            <View style={styles.colHalf}>
              <Text style={styles.fieldLabel}>Billing</Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                <Text style={styles.fieldValue}>Annual</Text>
                <Text style={styles.priceGreenText}>€2,000.00 / year</Text>
              </View>
            </View>
          </View>

          <View style={[styles.twoColRow, { marginTop: 12 }]}>
            <View style={styles.colHalf}>
              <Text style={styles.fieldLabel}>Payment Status</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusBadgeText}>{paymentStatus}</Text>
              </View>
            </View>

            <View style={styles.colHalf}>
              <Text style={styles.fieldLabel}>Next Renewal</Text>
              <Text style={styles.fieldValue}>{nextRenewal}</Text>
            </View>
          </View>
        </View>

        {/* Subscription Earnings / Commission 3 Cards */}
        <View style={styles.card}>
          <Text style={styles.sectionHeading}>Subscription</Text>

          <View style={styles.threeCardsRow}>
            {/* Monthly */}
            <View style={styles.statBox}>
              <Text style={styles.statBoxLabel}>Monthly</Text>
              <Text style={styles.statBoxValue}>€ 50</Text>
            </View>

            {/* Annual */}
            <View style={styles.statBox}>
              <Text style={styles.statBoxLabel}>Annual</Text>
              <Text style={styles.statBoxValue}>€ 600</Text>
            </View>

            {/* Lifetime */}
            <View style={styles.statBox}>
              <Text style={styles.statBoxLabel}>Lifetime</Text>
              <Text style={styles.statBoxValue}>€ 600</Text>
            </View>
          </View>
        </View>

        {/* Connected by Card */}
        <View style={styles.connectedCard}>
          <Text style={styles.connectedLabel}>CONNECTED BY</Text>
          <Text style={styles.connectedDate}>January 9, 2024</Text>
        </View>

        {/* Bottom Button */}
        <View style={styles.bottomActionWrap}>
          <TouchableOpacity
            style={styles.openDashboardBtn}
            onPress={handleOpenSalonDashboard}
            activeOpacity={0.8}
          >
            <Ionicons name="speedometer-outline" size={18} color="#FFFFFF" />
            <Text style={styles.openDashboardBtnText}>Open Salon Dashboard</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F1F5F9",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
  },
  scrollContent: {
    padding: 16,
    gap: 14,
    paddingBottom: 36,
  },
  salonHeroCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  heroTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  salonAvatar: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#EEECFF",
    alignItems: "center",
    justifyContent: "center",
  },
  salonNameHero: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
  },
  badgePill: {
    backgroundColor: "#EEECFF",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgePillText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#635BFF",
  },
  salonCityHero: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  referralBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F4FF",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: "#E0E7FF",
  },
  referralText: {
    fontSize: 11,
    color: "#4F46E5",
    flex: 1,
    lineHeight: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 12,
  },
  twoColRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  colHalf: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#94A3B8",
    textTransform: "uppercase",
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  fieldValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1E293B",
  },
  priceGreenText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#059669",
  },
  ownerContactRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    padding: 10,
    borderRadius: 12,
    marginTop: 6,
    gap: 10,
  },
  ownerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  ownerNameText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1E293B",
  },
  ownerEmailText: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 1,
  },
  planBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  planBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#059669",
  },
  statusBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#059669",
  },
  threeCardsRow: {
    flexDirection: "row",
    gap: 8,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: "center",
  },
  statBoxLabel: {
    fontSize: 10,
    color: "#64748B",
    fontWeight: "500",
    marginBottom: 4,
  },
  statBoxValue: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0284C7",
  },
  connectedCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  connectedLabel: {
    fontSize: 10,
    color: "#94A3B8",
    fontWeight: "700",
    marginBottom: 2,
    textTransform: "uppercase",
  },
  connectedDate: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1E293B",
  },
  bottomActionWrap: {
    marginTop: 6,
  },
  openDashboardBtn: {
    backgroundColor: "#635BFF",
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    width: "100%",
  },
  openDashboardBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});
