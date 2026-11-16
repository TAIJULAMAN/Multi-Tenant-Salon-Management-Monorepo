import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  initialBundles,
  BundleRecord,
  categoryColorMap,
} from "@/components/services/servicesData";
import EditBundleModal from "@/components/services/modals/EditBundleModal";
import DeleteBundleModal from "@/components/services/modals/DeleteBundleModal";

export default function BundlesListScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [bundles, setBundles] = useState<BundleRecord[]>(initialBundles);
  const [search, setSearch] = useState("");

  const [editingBundle, setEditingBundle] = useState<BundleRecord | null>(null);
  const [deletingBundle, setDeletingBundle] = useState<BundleRecord | null>(null);

  const filtered = bundles.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleExportCSV = () => {
    Alert.alert("Export Data", `Exporting ${bundles.length} bundle packages as CSV...`);
  };

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
          <Text style={styles.headerTitle}>Bundle Packages</Text>
          <Text style={styles.headerSub}>Manage packaged services and combo offers</Text>
        </View>

        <TouchableOpacity
          style={styles.exportBtn}
          onPress={handleExportCSV}
          activeOpacity={0.75}
        >
          <Ionicons name="download-outline" size={14} color="#635BFF" />
          <Text style={styles.exportBtnText}>Export</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.contentScroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Sub-banner with Add button */}
        <View style={styles.bannerCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>Combo Packages</Text>
            <Text style={styles.bannerSub}>Group multiple services at special package rates</Text>
          </View>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => router.push("/(drawer)/services/bundles/add" as any)}
            activeOpacity={0.85}
          >
            <Ionicons name="add" size={16} color="#FFFFFF" />
            <Text style={styles.addBtnText}>Add Bundle</Text>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search bundles..."
            placeholderTextColor="#94A3B8"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Bundles List */}
        <View style={styles.bundlesList}>
          {filtered.map((bundle) => {
            const colorStyle = bundle.categoryStyle || categoryColorMap["Category 1"];

            return (
              <TouchableOpacity
                key={bundle.id}
                style={styles.bundleCard}
                onPress={() => router.push(`/(drawer)/services/bundles/${bundle.id}` as any)}
                activeOpacity={0.8}
              >
                <View style={styles.bundleTopRow}>
                  <View style={styles.bundleIconCircle}>
                    <Ionicons name="cube-outline" size={20} color="#0D9488" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.bundleName}>{bundle.name}</Text>
                    <View style={styles.categoryBadgeRow}>
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
                      <Text style={styles.relatedCountText}>
                        {bundle.services?.length || bundle.relatedServices} Services included
                      </Text>
                    </View>
                  </View>

                  <View style={styles.actionsRow}>
                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() => setEditingBundle(bundle)}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="pencil-outline" size={15} color="#475569" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteBtn}
                      onPress={() => setDeletingBundle(bundle)}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="trash-outline" size={15} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Included Services pills */}
                {bundle.services && bundle.services.length > 0 && (
                  <View style={styles.pillsBox}>
                    {bundle.services.map((s, idx) => (
                      <View key={idx} style={styles.servicePill}>
                        <Ionicons name="checkmark-circle" size={12} color="#635BFF" />
                        <Text style={styles.servicePillText}>{s.name}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Bottom Row */}
                <View style={styles.bundleBottomRow}>
                  <View>
                    <Text style={styles.priceLabel}>Package Price</Text>
                    <Text style={styles.priceValue}>{bundle.price}</Text>
                  </View>
                  <View style={styles.durationBadge}>
                    <Ionicons name="time-outline" size={14} color="#64748B" />
                    <Text style={styles.durationText}>{bundle.duration}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Edit Bundle Modal */}
      <EditBundleModal
        visible={!!editingBundle}
        onClose={() => setEditingBundle(null)}
        bundle={editingBundle}
        onSave={(updated) => {
          setBundles(bundles.map((b) => (b.id === updated.id ? updated : b)));
          Alert.alert("Success", "Bundle package updated!");
        }}
      />

      {/* Delete Bundle Modal */}
      <DeleteBundleModal
        visible={!!deletingBundle}
        onClose={() => setDeletingBundle(null)}
        bundleName={deletingBundle?.name}
        onConfirm={() => {
          if (deletingBundle) {
            setBundles(bundles.filter((b) => b.id !== deletingBundle.id));
            Alert.alert("Deleted", "Bundle package has been removed.");
            setDeletingBundle(null);
          }
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
  exportBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 10,
    height: 34,
    borderRadius: 8,
  },
  exportBtnText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  contentScroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 14,
  },
  bannerCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  bannerTitle: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  bannerSub: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    marginTop: 1,
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#635BFF",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  addBtnText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    height: 42,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Manrope_500Medium",
    color: "#1E293B",
  },
  bundlesList: {
    gap: 12,
  },
  bundleCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 14,
    gap: 12,
  },
  bundleTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  bundleIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#CCFBF1",
    alignItems: "center",
    justifyContent: "center",
  },
  bundleName: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  categoryBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontFamily: "Manrope_700Bold",
  },
  relatedCountText: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  actionBtn: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: "#F1F5F9",
  },
  deleteBtn: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: "#FEE2E2",
  },
  pillsBox: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    backgroundColor: "#F8FAFC",
    padding: 10,
    borderRadius: 8,
  },
  servicePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  servicePillText: {
    fontSize: 11,
    fontFamily: "Manrope_600SemiBold",
    color: "#1E293B",
  },
  bundleBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  priceLabel: {
    fontSize: 10,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
  },
  priceValue: {
    fontSize: 15,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  durationBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  durationText: {
    fontSize: 12,
    fontFamily: "Manrope_600SemiBold",
    color: "#475569",
  },
});
