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
import {
  initialBundles,
  BundleRecord,
  categoryColorMap,
} from "@/components/services/servicesData";
import EditBundleModal from "@/components/services/modals/EditBundleModal";
import DeleteBundleModal from "@/components/services/modals/DeleteBundleModal";

export default function ViewBundleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const foundBundle = initialBundles.find((b) => b.id === id) || initialBundles[0];
  const [bundle, setBundle] = useState<BundleRecord>(foundBundle);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const colorStyle = bundle.categoryStyle || categoryColorMap[bundle.category] || categoryColorMap["Category 1"];

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 12) }]}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color="#1E293B" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Bundle Package</Text>
          <Text style={styles.headerSub}>Inspect bundled services, pricing and specialists</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerActionBtn}
            onPress={() => setIsEditOpen(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="pencil" size={16} color="#635BFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerDeleteBtn}
            onPress={() => setIsDeleteOpen(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="trash-outline" size={16} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.contentScroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Details Card */}
        <View style={styles.detailsCard}>
          <View style={styles.detailsCardTop}>
            <View style={{ flex: 1 }}>
              <Text style={styles.bundleBigName}>{bundle.name}</Text>
              <View style={styles.tagRow}>
                <View
                  style={[
                    styles.categoryBadge,
                    { backgroundColor: colorStyle.bg, borderColor: colorStyle.border },
                  ]}
                >
                  <Text style={[styles.categoryBadgeText, { color: colorStyle.text }]}>
                    {bundle.category}
                  </Text>
                </View>

                {bundle.onlineBooking !== false ? (
                  <View style={styles.onlineBadge}>
                    <View style={styles.onlineDot} />
                    <Text style={styles.onlineBadgeText}>Online Booking Active</Text>
                  </View>
                ) : (
                  <View style={styles.offlineBadge}>
                    <Text style={styles.offlineBadgeText}>Internal Only</Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Metrics Grid */}
          <View style={styles.metricsGrid}>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Total Duration</Text>
              <Text style={styles.metricValue}>{bundle.duration}</Text>
            </View>

            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Combo Price</Text>
              <Text style={[styles.metricValue, { color: "#635BFF" }]}>{bundle.price}</Text>
            </View>

            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Price Type</Text>
              <Text style={styles.metricValue}>{bundle.priceType || "Fixed"}</Text>
            </View>

            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Schedule Type</Text>
              <Text style={styles.metricValue}>{bundle.scheduleType || "Sequential"}</Text>
            </View>
          </View>

          {/* Description */}
          {bundle.description ? (
            <View style={styles.descriptionBox}>
              <Text style={styles.descriptionLabel}>Package Description</Text>
              <Text style={styles.descriptionText}>{bundle.description}</Text>
            </View>
          ) : null}
        </View>

        {/* Included Services Section */}
        <View style={styles.detailsCard}>
          <View style={styles.cardSectionHeader}>
            <Text style={styles.sectionTitle}>
              Included Services ({bundle.services?.length || bundle.relatedServices})
            </Text>
          </View>

          <View style={styles.itemsList}>
            {(bundle.services || [
              { id: "1", name: "Classic Haircut", duration: "45 min", price: "€ 35" },
              { id: "4", name: "Wash & Blow Dry", duration: "30 min", price: "€ 25" },
            ]).map((s, idx) => (
              <View key={idx} style={styles.includedServiceCard}>
                <View style={styles.serviceIconContainer}>
                  <Ionicons name="cut-outline" size={18} color="#635BFF" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemTitle}>{s.name}</Text>
                  <Text style={styles.itemSub}>{s.duration}</Text>
                </View>
                <View style={styles.priceTag}>
                  <Text style={styles.priceTagText}>{s.price}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Assigned Stylists Section */}
        <View style={styles.detailsCard}>
          <View style={styles.cardSectionHeader}>
            <Text style={styles.sectionTitle}>
              Qualified Specialists ({bundle.members?.length || 2})
            </Text>
          </View>

          <View style={styles.itemsList}>
            {(bundle.members || [
              { id: "1", name: "Maria Rodriguez", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" },
              { id: "2", name: "Leslie Alexander", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80" },
            ]).map((member) => (
              <View key={member.id} style={styles.includedMemberCard}>
                <Avatar name={member.name} uri={member.avatar} size={40} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemTitle}>{member.name}</Text>
                  <Text style={styles.itemSub}>Master Specialist</Text>
                </View>
                <View style={styles.activeCheckBadge}>
                  <Ionicons name="checkmark" size={14} color="#16A34A" />
                  <Text style={styles.activeCheckText}>Assigned</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Bottom Actions */}
        <View style={styles.bottomButtonsRow}>
          <TouchableOpacity
            style={styles.editFullBtn}
            onPress={() => setIsEditOpen(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="create-outline" size={18} color="#FFFFFF" />
            <Text style={styles.editFullBtnText}>Edit Bundle</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteFullBtn}
            onPress={() => setIsDeleteOpen(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="trash-outline" size={18} color="#EF4444" />
            <Text style={styles.deleteFullBtnText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Edit Bundle Modal */}
      <EditBundleModal
        visible={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        bundle={bundle}
        onSave={(updated) => {
          setBundle(updated);
          Alert.alert("Success", "Bundle details updated!");
        }}
      />

      {/* Delete Bundle Modal */}
      <DeleteBundleModal
        visible={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        bundleName={bundle.name}
        onConfirm={() => {
          Alert.alert("Deleted", "Bundle package has been deleted.", [
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  backBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
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
  headerActionBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#EEF2FF",
  },
  headerDeleteBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#FEE2E2",
  },
  contentScroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  detailsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
    gap: 16,
  },
  detailsCardTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  bundleBigName: {
    fontSize: 20,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  tagRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 6,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
  },
  onlineBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#16A34A",
  },
  onlineBadgeText: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#16A34A",
  },
  offlineBadge: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  offlineBadgeText: {
    fontSize: 11,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  metricBox: {
    width: "48%",
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    gap: 2,
  },
  metricLabel: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
  },
  metricValue: {
    fontSize: 15,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  descriptionBox: {
    backgroundColor: "#F8FAFC",
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    gap: 4,
  },
  descriptionLabel: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#64748B",
  },
  descriptionText: {
    fontSize: 13,
    fontFamily: "Manrope_500Medium",
    color: "#1E293B",
    lineHeight: 20,
  },
  cardSectionHeader: {
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  itemsList: {
    gap: 8,
  },
  includedServiceCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  serviceIconContainer: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  includedMemberCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  itemTitle: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  itemSub: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    marginTop: 1,
  },
  priceTag: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priceTagText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  activeCheckBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  activeCheckText: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#16A34A",
  },
  bottomButtonsRow: {
    flexDirection: "row",
    gap: 12,
  },
  editFullBtn: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#635BFF",
    paddingVertical: 12,
    borderRadius: 10,
  },
  editFullBtnText: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },
  deleteFullBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#FEE2E2",
    paddingVertical: 12,
    borderRadius: 10,
  },
  deleteFullBtnText: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#EF4444",
  },
});
