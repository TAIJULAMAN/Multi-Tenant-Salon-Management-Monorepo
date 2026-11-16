import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Avatar from "@/components/Avatar";
import Checkbox from "@/components/ui/Checkbox";
import {
  initialServices,
  mockMembers,
  ServiceRecord,
  categoryColorMap,
} from "@/components/services/servicesData";
import DeleteServiceModal from "@/components/services/modals/DeleteServiceModal";

export default function ViewServiceScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const foundService =
    initialServices.find((s) => s.id === id) || initialServices[0];
  const [service, setService] = useState<ServiceRecord>(foundService);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const assignedStaff = mockMembers.filter((m) =>
    service.assignedMembers ? service.assignedMembers.includes(m.id) : true
  );

  const colorStyle =
    service.categoryStyle ||
    categoryColorMap[service.category] ||
    categoryColorMap["Category 1"];

  const toggleOnlineBooking = () => {
    setService((prev) => ({
      ...prev,
      onlineBooking: prev.onlineBooking === false ? true : false,
    }));
  };

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 12) }]}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.headerIconBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color="#1E293B" />
        </TouchableOpacity>

        <View style={{ flex: 1, paddingHorizontal: 4 }}>
          <Text style={styles.headerTitle}>Service Details</Text>
          <Text style={styles.headerSub}>Overview & Configuration</Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.editHeaderBtn}
            onPress={() =>
              router.push(`/(drawer)/services/edit/${service.id}` as any)
            }
            activeOpacity={0.7}
          >
            <Ionicons name="pencil" size={16} color="#635BFF" />
            <Text style={styles.editHeaderBtnText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteHeaderBtn}
            onPress={() => setIsDeleteOpen(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="trash-outline" size={17} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.contentScroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Service Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroCardHeader}>
            <View style={styles.serviceIconWrap}>
              <Ionicons
                name={(service.iconName as any) || "cut-outline"}
                size={28}
                color="#635BFF"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.serviceNameText}>{service.name}</Text>
              <View style={styles.badgesRow}>
                <View
                  style={[
                    styles.categoryPill,
                    {
                      backgroundColor: colorStyle.bg,
                      borderColor: colorStyle.border,
                    },
                  ]}
                >
                  <Text
                    style={[styles.categoryPillText, { color: colorStyle.text }]}
                  >
                    {service.category}
                  </Text>
                </View>

                {service.onlineBooking !== false ? (
                  <View style={styles.onlinePill}>
                    <View style={styles.onlineDot} />
                    <Text style={styles.onlinePillText}>Online Booking Active</Text>
                  </View>
                ) : (
                  <View style={styles.offlinePill}>
                    <Text style={styles.offlinePillText}>Internal Only</Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Online Booking Interactive Toggle Bar */}
          <TouchableOpacity
            style={styles.onlineToggleBar}
            onPress={toggleOnlineBooking}
            activeOpacity={0.8}
          >
            <View style={styles.onlineToggleLeft}>
              <View style={styles.globeIconCircle}>
                <Ionicons name="globe-outline" size={18} color="#635BFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.onlineToggleTitle}>Online Bookings</Text>
                <Text style={styles.onlineToggleSub}>
                  {service.onlineBooking !== false
                    ? "Available for direct online client bookings"
                    : "Hidden from client online booking portal"}
                </Text>
              </View>
            </View>
            <Checkbox
              checked={service.onlineBooking !== false}
              onPress={toggleOnlineBooking}
              color="#635BFF"
            />
          </TouchableOpacity>
        </View>

        {/* Key Metrics Grid */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeaderTitle}>Pricing & Timing</Text>
          <View style={styles.metricsGrid}>
            {/* Duration */}
            <View style={styles.metricCard}>
              <View style={[styles.metricIconWrap, { backgroundColor: "#EEF2FF" }]}>
                <Ionicons name="time-outline" size={18} color="#635BFF" />
              </View>
              <Text style={styles.metricCardLabel}>Duration</Text>
              <Text style={styles.metricCardValue}>{service.duration}</Text>
            </View>

            {/* Post-Break */}
            <View style={styles.metricCard}>
              <View style={[styles.metricIconWrap, { backgroundColor: "#FEF3C7" }]}>
                <Ionicons name="cafe-outline" size={18} color="#D97706" />
              </View>
              <Text style={styles.metricCardLabel}>Post-Break</Text>
              <Text style={styles.metricCardValue}>{service.postBreak}</Text>
            </View>

            {/* Price */}
            <View style={styles.metricCard}>
              <View style={[styles.metricIconWrap, { backgroundColor: "#DCFCE7" }]}>
                <Ionicons name="pricetag-outline" size={18} color="#16A34A" />
              </View>
              <Text style={styles.metricCardLabel}>Price</Text>
              <Text style={[styles.metricCardValue, { color: "#635BFF" }]}>
                {service.price}
              </Text>
            </View>

            {/* VAT */}
            <View style={styles.metricCard}>
              <View style={[styles.metricIconWrap, { backgroundColor: "#F3E8FF" }]}>
                <Ionicons name="receipt-outline" size={18} color="#9333EA" />
              </View>
              <Text style={styles.metricCardLabel}>VAT Included</Text>
              <Text style={styles.metricCardValue}>{service.vat}</Text>
            </View>
          </View>
        </View>

        {/* Description Card */}
        {service.description ? (
          <View style={styles.sectionCard}>
            <View style={styles.sectionCardHeader}>
              <View style={styles.sectionHeaderIconWrap}>
                <Ionicons
                  name="document-text-outline"
                  size={16}
                  color="#635BFF"
                />
              </View>
              <Text style={styles.sectionCardTitle}>Description</Text>
            </View>
            <Text style={styles.descriptionText}>{service.description}</Text>
          </View>
        ) : null}

        {/* Assigned Staff Members */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionCardHeader}>
            <View style={styles.sectionHeaderIconWrap}>
              <Ionicons name="people-outline" size={16} color="#635BFF" />
            </View>
            <Text style={styles.sectionCardTitle}>
              Assigned Staff Members
            </Text>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{assignedStaff.length}</Text>
            </View>
          </View>

          <View style={styles.staffGrid}>
            {assignedStaff.map((staff) => (
              <View key={staff.id} style={styles.staffCard}>
                <Avatar name={staff.name} uri={staff.avatar} size={44} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.staffNameText}>{staff.name}</Text>
                  <Text style={styles.staffRoleText}>{staff.role}</Text>
                </View>
                <View style={styles.assignedPill}>
                  <Ionicons name="checkmark-circle" size={15} color="#16A34A" />
                  <Text style={styles.assignedPillText}>Assigned</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Delete Service Modal */}
      <DeleteServiceModal
        visible={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        serviceName={service.name}
        onConfirm={() => {
          Alert.alert("Deleted", "Service has been deleted.", [
            { text: "OK", onPress: () => router.back() },
          ]);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  headerIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  headerSub: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    marginTop: 1,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  editHeaderBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#EEF2FF",
  },
  editHeaderBtnText: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  deleteHeaderBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
  },
  contentScroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
    gap: 16,
  },
  heroCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#64748B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    gap: 16,
  },
  heroCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  serviceIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: "#EEF2FF",
    borderWidth: 1.5,
    borderColor: "#E0E7FF",
    alignItems: "center",
    justifyContent: "center",
  },
  serviceNameText: {
    fontSize: 19,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  badgesRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 6,
    flexWrap: "wrap",
  },
  categoryPill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  categoryPillText: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
  },
  onlinePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 12,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#16A34A",
  },
  onlinePillText: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#16A34A",
  },
  offlinePill: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 12,
  },
  offlinePillText: {
    fontSize: 11,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  onlineToggleBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  onlineToggleLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
    paddingRight: 8,
  },
  globeIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  onlineToggleTitle: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  onlineToggleSub: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    marginTop: 1,
  },
  sectionContainer: {
    gap: 10,
  },
  sectionHeaderTitle: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#475569",
    paddingHorizontal: 2,
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  metricCard: {
    width: "48.5%",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#64748B",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
    gap: 6,
  },
  metricIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  metricCardLabel: {
    fontSize: 11,
    fontFamily: "Manrope_600SemiBold",
    color: "#94A3B8",
  },
  metricCardValue: {
    fontSize: 16,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#64748B",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
    gap: 12,
  },
  sectionCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingBottom: 4,
  },
  sectionHeaderIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 7,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  sectionCardTitle: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
    flex: 1,
  },
  countBadge: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  countBadgeText: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#64748B",
  },
  descriptionText: {
    fontSize: 13,
    fontFamily: "Manrope_500Medium",
    color: "#334155",
    lineHeight: 21,
  },
  staffGrid: {
    gap: 10,
  },
  staffCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  staffNameText: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  staffRoleText: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    marginTop: 2,
  },
  assignedPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  assignedPillText: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#16A34A",
  },
});
