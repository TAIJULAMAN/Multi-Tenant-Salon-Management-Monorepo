import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Header from "@/components/Header";
import Avatar from "@/components/Avatar";
import {
  initialServices,
  initialBundles,
  initialCategories,
  serviceStatCardsData,
  ServiceRecord,
  BundleRecord,
  CategoryRecord,
  categoryColorMap,
} from "@/components/services/servicesData";

// Modals
import AddServicesDropdownModal from "@/components/services/modals/AddServicesDropdownModal";
import AddCategoryModal from "@/components/services/modals/AddCategoryModal";
import EditCategoryModal from "@/components/services/modals/EditCategoryModal";
import DeleteCategoryModal from "@/components/services/modals/DeleteCategoryModal";
import EditServiceModal from "@/components/services/modals/EditServiceModal";
import DeleteServiceModal from "@/components/services/modals/DeleteServiceModal";
import EditBundleModal from "@/components/services/modals/EditBundleModal";
import DeleteBundleModal from "@/components/services/modals/DeleteBundleModal";

type ServiceTab = "Services" | "Bundles" | "Categories" | "Analytics";

export default function ServicesScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ServiceTab>("Services");
  const [refreshing, setRefreshing] = useState(false);

  // Data states
  const [services, setServices] = useState<ServiceRecord[]>(initialServices);
  const [bundles, setBundles] = useState<BundleRecord[]>(initialBundles);
  const [categories, setCategories] = useState<CategoryRecord[]>(initialCategories);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal triggers
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);

  // Edit / Delete states
  const [editingCategory, setEditingCategory] = useState<CategoryRecord | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<CategoryRecord | null>(null);

  const [editingService, setEditingService] = useState<ServiceRecord | null>(null);
  const [deletingService, setDeletingService] = useState<ServiceRecord | null>(null);

  const [editingBundle, setEditingBundle] = useState<BundleRecord | null>(null);
  const [deletingBundle, setDeletingBundle] = useState<BundleRecord | null>(null);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  };

  // Top action selection handler
  const handleSelectAddOption = (option: "add_service" | "add_bundle" | "add_category" | "import_services") => {
    if (option === "add_service") {
      router.push("/(drawer)/services/add" as any);
    } else if (option === "add_bundle") {
      router.push("/(drawer)/services/bundles/add" as any);
    } else if (option === "add_category") {
      setIsAddCategoryOpen(true);
    } else if (option === "import_services") {
      router.push("/(drawer)/services/import" as any);
    }
  };

  // CSV export handler
  const handleExportCSV = () => {
    Alert.alert(
      "Export Data",
      `Exporting ${services.length} services and ${bundles.length} bundles as CSV...`
    );
  };

  // Filtered Services
  const filteredServices = services.filter((s) => {
    const matchesCategory = selectedCategory === "All" || s.category === selectedCategory;
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.description && s.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Filtered Bundles
  const filteredBundles = bundles.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <View style={styles.container}>
      <Header />

      {/* TOP HUB HEADER */}
      <View style={styles.topHubHeader}>
        <View style={styles.hubHeaderContainer}>
          <View style={styles.hubTitleRow}>
            <View style={styles.hubTitleCol}>
              <Text style={styles.hubTitle} numberOfLines={1}>Services</Text>
              <Text style={styles.hubSubtitle} numberOfLines={1}>Manage services, bundles & categories</Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.topActionsRow}>
              <TouchableOpacity
                style={styles.exportBtn}
                onPress={handleExportCSV}
                activeOpacity={0.75}
              >
                <Ionicons name="download-outline" size={14} color="#635BFF" />
                <Text style={styles.exportBtnText}>Export</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.addDropdownBtn}
                onPress={() => setIsAddMenuOpen(true)}
                activeOpacity={0.85}
              >
                <Text style={styles.addDropdownBtnText}>Add</Text>
                <Ionicons name="chevron-down" size={13} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 4 Navigation Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsScroll}
          contentContainerStyle={styles.tabsContainer}
        >
          {(["Services", "Bundles", "Categories", "Analytics"] as ServiceTab[]).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.tabButton, isActive && styles.tabButtonActive]}
                onPress={() => setActiveTab(tab)}
                activeOpacity={0.7}
              >
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* MAIN CONTENT BODY */}
      <ScrollView
        style={styles.contentScroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* ========================================================================= */}
        {/* TAB 1: SERVICES */}
        {/* ========================================================================= */}
        {activeTab === "Services" && (
          <View style={styles.tabSection}>
            {/* Category Filter Chips */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryChipsScroll}
            >
              {["All", "Category 1", "Category 2", "Category 3", "Category 4", "Category 5", "Category 6"].map(
                (cat) => {
                  const isSelected = selectedCategory === cat;
                  return (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.categoryFilterChip,
                        isSelected && styles.categoryFilterChipActive,
                      ]}
                      onPress={() => setSelectedCategory(cat)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.categoryFilterText,
                          isSelected && styles.categoryFilterTextActive,
                        ]}
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  );
                }
              )}
            </ScrollView>

            {/* Search Input Bar */}
            <View style={styles.searchBar}>
              <Ionicons name="search-outline" size={18} color="#94A3B8" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search services..."
                placeholderTextColor="#94A3B8"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <Ionicons name="close-circle" size={16} color="#94A3B8" />
                </TouchableOpacity>
              )}
            </View>

            {/* Services List Count & Import Quick Trigger */}
            <View style={styles.listHeaderRow}>
              <Text style={styles.listCountText}>
                Showing <Text style={{ fontFamily: "Manrope_700Bold", color: "#1E293B" }}>{filteredServices.length}</Text> services
              </Text>
              <TouchableOpacity
                style={styles.importQuickBtn}
                onPress={() => router.push("/(drawer)/services/import" as any)}
                activeOpacity={0.7}
              >
                <Ionicons name="cloud-upload-outline" size={14} color="#635BFF" />
                <Text style={styles.importQuickBtnText}>Import CSV</Text>
              </TouchableOpacity>
            </View>

            {/* Services Cards */}
            <View style={styles.cardsList}>
              {filteredServices.map((service) => {
                const colorStyle = service.categoryStyle || categoryColorMap["Category 1"];

                return (
                  <TouchableOpacity
                    key={service.id}
                    style={styles.serviceCard}
                    onPress={() => router.push(`/(drawer)/services/${service.id}` as any)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.serviceCardTop}>
                      <View style={styles.serviceIconContainer}>
                        <Ionicons
                          name={(service.iconName as any) || "cut-outline"}
                          size={20}
                          color="#635BFF"
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.serviceName}>{service.name}</Text>
                        <View style={styles.categoryBadgeRow}>
                          <View
                            style={[
                              styles.categoryBadge,
                              { backgroundColor: colorStyle.bg, borderColor: colorStyle.border },
                            ]}
                          >
                            <Text style={[styles.categoryBadgeText, { color: colorStyle.text }]}>
                              {service.category}
                            </Text>
                          </View>

                          {service.onlineBooking && (
                            <View style={styles.onlineBadge}>
                              <View style={styles.onlineDot} />
                              <Text style={styles.onlineBadgeText}>Online</Text>
                            </View>
                          )}
                        </View>
                      </View>

                      {/* Action buttons */}
                      <View style={styles.cardActionsRow}>
                        <TouchableOpacity
                          style={styles.actionIconBtn}
                          onPress={() => router.push(`/(drawer)/services/edit/${service.id}` as any)}
                          activeOpacity={0.7}
                        >
                          <Ionicons name="pencil-outline" size={15} color="#475569" />
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.deleteIconBtn}
                          onPress={() => setDeletingService(service)}
                          activeOpacity={0.7}
                        >
                          <Ionicons name="trash-outline" size={15} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* Metrics row */}
                    <View style={styles.serviceMetricsRow}>
                      <View style={styles.metricItem}>
                        <Text style={styles.metricLabel}>Duration</Text>
                        <Text style={styles.metricValue}>{service.duration}</Text>
                      </View>
                      <View style={styles.metricDivider} />
                      <View style={styles.metricItem}>
                        <Text style={styles.metricLabel}>Post-Break</Text>
                        <Text style={styles.metricValue}>{service.postBreak}</Text>
                      </View>
                      <View style={styles.metricDivider} />
                      <View style={styles.metricItem}>
                        <Text style={styles.metricLabel}>Price</Text>
                        <Text style={[styles.metricValue, { color: "#635BFF" }]}>{service.price}</Text>
                      </View>
                      <View style={styles.metricDivider} />
                      <View style={styles.metricItem}>
                        <Text style={styles.metricLabel}>VAT</Text>
                        <Text style={styles.metricValue}>{service.vat}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: BUNDLES */}
        {/* ========================================================================= */}
        {activeTab === "Bundles" && (
          <View style={styles.tabSection}>
            {/* Header Banner */}
            <View style={styles.subBanner}>
              <View style={{ flex: 1 }}>
                <Text style={styles.subBannerTitle}>Bundle Packages</Text>
                <Text style={styles.subBannerSubtitle}>Group multiple services with combined pricing</Text>
              </View>
              <TouchableOpacity
                style={styles.bannerActionBtn}
                onPress={() => router.push("/(drawer)/services/bundles/add" as any)}
                activeOpacity={0.8}
              >
                <Ionicons name="add" size={16} color="#FFFFFF" />
                <Text style={styles.bannerActionBtnText}>Add Bundle</Text>
              </TouchableOpacity>
            </View>

            {/* Bundles List */}
            <View style={styles.cardsList}>
              {filteredBundles.map((bundle) => {
                const colorStyle = bundle.categoryStyle || categoryColorMap["Category 1"];

                return (
                  <TouchableOpacity
                    key={bundle.id}
                    style={styles.bundleCard}
                    onPress={() => router.push(`/(drawer)/services/bundles/${bundle.id}` as any)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.bundleCardTop}>
                      <View style={styles.bundleIconBox}>
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
                          <Text style={styles.bundleServicesCount}>
                            {bundle.services?.length || bundle.relatedServices} Services included
                          </Text>
                        </View>
                      </View>

                      {/* Actions */}
                      <View style={styles.cardActionsRow}>
                        <TouchableOpacity
                          style={styles.actionIconBtn}
                          onPress={() => setEditingBundle(bundle)}
                          activeOpacity={0.7}
                        >
                          <Ionicons name="pencil-outline" size={15} color="#475569" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.deleteIconBtn}
                          onPress={() => setDeletingBundle(bundle)}
                          activeOpacity={0.7}
                        >
                          <Ionicons name="trash-outline" size={15} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* Included services pills */}
                    {bundle.services && bundle.services.length > 0 && (
                      <View style={styles.bundleServicesPillsRow}>
                        {bundle.services.map((s, idx) => (
                          <View key={idx} style={styles.bundleServicePill}>
                            <Ionicons name="checkmark-circle" size={12} color="#635BFF" />
                            <Text style={styles.bundleServicePillText}>{s.name}</Text>
                          </View>
                        ))}
                      </View>
                    )}

                    {/* Bottom stats row */}
                    <View style={styles.bundleBottomRow}>
                      <View style={styles.bundlePriceContainer}>
                        <Text style={styles.bundlePriceLabel}>Package Price</Text>
                        <Text style={styles.bundlePriceVal}>{bundle.price}</Text>
                      </View>
                      <View style={styles.bundleDurationContainer}>
                        <Ionicons name="time-outline" size={14} color="#64748B" />
                        <Text style={styles.bundleDurationText}>{bundle.duration}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: CATEGORIES */}
        {/* ========================================================================= */}
        {activeTab === "Categories" && (
          <View style={styles.tabSection}>
            {/* Header Banner */}
            <View style={styles.subBanner}>
              <View style={{ flex: 1 }}>
                <Text style={styles.subBannerTitle}>Service Categories</Text>
                <Text style={styles.subBannerSubtitle}>Organize your menu into customizable categories</Text>
              </View>
              <TouchableOpacity
                style={styles.bannerActionBtn}
                onPress={() => setIsAddCategoryOpen(true)}
                activeOpacity={0.8}
              >
                <Ionicons name="add" size={16} color="#FFFFFF" />
                <Text style={styles.bannerActionBtnText}>Add Category</Text>
              </TouchableOpacity>
            </View>

            {/* Categories List */}
            <View style={styles.categoriesGrid}>
              {categories.map((category) => {
                const colorStyle = category.categoryStyle || categoryColorMap["Category 1"];

                return (
                  <View key={category.id} style={styles.categoryCard}>
                    <View style={styles.categoryCardHeader}>
                      <View
                        style={[
                          styles.categoryPillBig,
                          { backgroundColor: colorStyle.bg, borderColor: colorStyle.border },
                        ]}
                      >
                        <Text style={[styles.categoryPillBigText, { color: colorStyle.text }]}>
                          {category.name}
                        </Text>
                      </View>

                      <View style={styles.categoryActions}>
                        <TouchableOpacity
                          style={styles.actionIconBtn}
                          onPress={() => setEditingCategory(category)}
                          activeOpacity={0.7}
                        >
                          <Ionicons name="pencil-outline" size={15} color="#475569" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.deleteIconBtn}
                          onPress={() => setDeletingCategory(category)}
                          activeOpacity={0.7}
                        >
                          <Ionicons name="trash-outline" size={15} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                    </View>

                    {category.description ? (
                      <Text style={styles.categoryDesc}>{category.description}</Text>
                    ) : null}

                    <View style={styles.categoryBottomRow}>
                      <Ionicons name="cut-outline" size={14} color="#635BFF" />
                      <Text style={styles.categoryCountText}>
                        <Text style={{ fontFamily: "Manrope_700Bold", color: "#1E293B" }}>
                          {category.relatedServices}
                        </Text>{" "}
                        Related Services
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: ANALYTICS */}
        {/* ========================================================================= */}
        {activeTab === "Analytics" && (
          <View style={styles.tabSection}>
            <Text style={styles.sectionHeading}>Analytics Overview</Text>

            {/* Stat Cards matching Web */}
            <View style={styles.statCardsList}>
              {serviceStatCardsData.map((card) => (
                <View key={card.id} style={styles.analyticsStatCard}>
                  <View style={styles.statCardHeader}>
                    <View style={[styles.statIconBox, { backgroundColor: card.iconBg }]}>
                      <Ionicons name={card.iconName} size={20} color={card.iconColor} />
                    </View>
                    <Text style={styles.statCardTitle}>{card.title}</Text>
                  </View>

                  <Text style={styles.statCardValue}>{card.value}</Text>
                  <Text style={styles.statCardChange}>{card.change}</Text>
                </View>
              ))}
            </View>

            {/* Category Revenue Distribution Card */}
            <View style={styles.chartCard}>
              <View style={styles.chartHeader}>
                <View>
                  <Text style={styles.chartTitle}>Revenue by Category</Text>
                  <Text style={styles.chartSubtitle}>Monthly sales volume per department</Text>
                </View>
                <View style={styles.chartBadge}>
                  <Text style={styles.chartBadgeText}>Top Performer</Text>
                </View>
              </View>

              <View style={styles.categoryBarsContainer}>
                {[
                  { name: "Category 1 (Haircuts)", share: "45%", val: "€ 4,250", color: "#635BFF" },
                  { name: "Category 5 (Balayage & Treatments)", share: "30%", val: "€ 2,840", color: "#EC4899" },
                  { name: "Category 3 (Coloring)", share: "15%", val: "€ 1,420", color: "#22C55E" },
                  { name: "Category 4 (Blowouts & Nails)", share: "10%", val: "€ 950", color: "#EAB308" },
                ].map((item, idx) => (
                  <View key={idx} style={styles.catBarItem}>
                    <View style={styles.catBarLabelRow}>
                      <Text style={styles.catBarName}>{item.name}</Text>
                      <Text style={styles.catBarVal}>{item.val} ({item.share})</Text>
                    </View>
                    <View style={styles.barTrack}>
                      <View
                        style={[
                          styles.barFill,
                          { width: item.share as any, backgroundColor: item.color },
                        ]}
                      />
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* ========================================================================= */}
      {/* ALL MODALS */}
      {/* ========================================================================= */}
      {/* Top Add Options Dropdown */}
      <AddServicesDropdownModal
        visible={isAddMenuOpen}
        onClose={() => setIsAddMenuOpen(false)}
        onSelectOption={handleSelectAddOption}
      />

      {/* Add Category Modal */}
      <AddCategoryModal
        visible={isAddCategoryOpen}
        onClose={() => setIsAddCategoryOpen(false)}
        onSave={(newCat) => {
          setCategories([
            {
              id: `cat_${Date.now()}`,
              name: newCat.name,
              description: newCat.description,
              categoryStyle: newCat.categoryStyle,
              relatedServices: 0,
            },
            ...categories,
          ]);
          Alert.alert("Success", "Category created successfully!");
        }}
      />

      {/* Edit Category Modal */}
      <EditCategoryModal
        visible={!!editingCategory}
        onClose={() => setEditingCategory(null)}
        category={editingCategory}
        onSave={(updated) => {
          setCategories(categories.map((c) => (c.id === updated.id ? updated : c)));
          Alert.alert("Success", "Category updated!");
        }}
      />

      {/* Delete Category Modal */}
      <DeleteCategoryModal
        visible={!!deletingCategory}
        onClose={() => setDeletingCategory(null)}
        categoryName={deletingCategory?.name}
        onConfirm={() => {
          if (deletingCategory) {
            setCategories(categories.filter((c) => c.id !== deletingCategory.id));
            Alert.alert("Deleted", "Category has been removed.");
            setDeletingCategory(null);
          }
        }}
      />

      {/* Edit Service Modal */}
      <EditServiceModal
        visible={!!editingService}
        onClose={() => setEditingService(null)}
        service={editingService}
        onSave={(updated) => {
          setServices(services.map((s) => (s.id === updated.id ? updated : s)));
          Alert.alert("Success", "Service updated!");
        }}
      />

      {/* Delete Service Modal */}
      <DeleteServiceModal
        visible={!!deletingService}
        onClose={() => setDeletingService(null)}
        serviceName={deletingService?.name}
        onConfirm={() => {
          if (deletingService) {
            setServices(services.filter((s) => s.id !== deletingService.id));
            Alert.alert("Deleted", "Service has been removed.");
            setDeletingService(null);
          }
        }}
      />

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
  topHubHeader: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    paddingTop: 10,
  },
  hubHeaderContainer: {
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  hubTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  hubTitleCol: {
    flex: 1,
    paddingRight: 6,
  },
  hubTitle: {
    fontSize: 18,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  hubSubtitle: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    marginTop: 1,
  },
  topActionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexShrink: 0,
  },
  exportBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 10,
    height: 35,
    borderRadius: 8,
  },
  exportBtnText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  addDropdownBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    backgroundColor: "#635BFF",
    paddingHorizontal: 13,
    height: 35,
    borderRadius: 8,
    shadowColor: "#635BFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  addDropdownBtnText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },
  tabsScroll: {
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 16,
  },
  tabButton: {
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabButtonActive: {
    borderBottomColor: "#635BFF",
  },
  tabText: {
    fontSize: 13,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  tabTextActive: {
    color: "#635BFF",
    fontFamily: "Manrope_700Bold",
  },
  contentScroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  tabSection: {
    gap: 14,
  },
  categoryChipsScroll: {
    gap: 8,
    paddingBottom: 2,
  },
  categoryFilterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  categoryFilterChipActive: {
    backgroundColor: "#635BFF",
    borderColor: "#635BFF",
  },
  categoryFilterText: {
    fontSize: 12,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  categoryFilterTextActive: {
    color: "#FFFFFF",
    fontFamily: "Manrope_700Bold",
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
  listHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 2,
  },
  listCountText: {
    fontSize: 12,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
  },
  importQuickBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: "#EEF2FF",
  },
  importQuickBtnText: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  cardsList: {
    gap: 12,
  },
  serviceCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 14,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  serviceCardTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  serviceIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  serviceName: {
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
  onlineBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  onlineDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#16A34A",
  },
  onlineBadgeText: {
    fontSize: 10,
    fontFamily: "Manrope_700Bold",
    color: "#16A34A",
  },
  cardActionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  actionIconBtn: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: "#F1F5F9",
  },
  deleteIconBtn: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: "#FEE2E2",
  },
  serviceMetricsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  metricItem: {
    alignItems: "center",
    flex: 1,
  },
  metricDivider: {
    width: 1,
    height: 18,
    backgroundColor: "#E2E8F0",
  },
  metricLabel: {
    fontSize: 10,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },

  // Bundles styles
  subBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  subBannerTitle: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  subBannerSubtitle: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    marginTop: 1,
  },
  bannerActionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#635BFF",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  bannerActionBtnText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },
  bundleCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 14,
    gap: 12,
  },
  bundleCardTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  bundleIconBox: {
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
  bundleServicesCount: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
  },
  bundleServicesPillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    backgroundColor: "#F8FAFC",
    padding: 10,
    borderRadius: 8,
  },
  bundleServicePill: {
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
  bundleServicePillText: {
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
  bundlePriceContainer: {
    gap: 1,
  },
  bundlePriceLabel: {
    fontSize: 10,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
  },
  bundlePriceVal: {
    fontSize: 15,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  bundleDurationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  bundleDurationText: {
    fontSize: 12,
    fontFamily: "Manrope_600SemiBold",
    color: "#475569",
  },

  // Categories Styles
  categoriesGrid: {
    gap: 10,
  },
  categoryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 14,
    gap: 10,
  },
  categoryCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  categoryPillBig: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  categoryPillBigText: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
  },
  categoryActions: {
    flexDirection: "row",
    gap: 6,
  },
  categoryDesc: {
    fontSize: 12,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    lineHeight: 18,
  },
  categoryBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  categoryCountText: {
    fontSize: 12,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
  },

  // Analytics Styles
  sectionHeading: {
    fontSize: 15,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
    marginBottom: 4,
  },
  statCardsList: {
    gap: 10,
  },
  analyticsStatCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
    gap: 6,
  },
  statCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 4,
  },
  statIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  statCardTitle: {
    fontSize: 13,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  statCardValue: {
    fontSize: 22,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  statCardChange: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#10B981",
  },
  chartCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
    gap: 14,
  },
  chartHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  chartTitle: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  chartSubtitle: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    marginTop: 2,
  },
  chartBadge: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  chartBadgeText: {
    fontSize: 10,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  categoryBarsContainer: {
    gap: 10,
  },
  catBarItem: {
    gap: 4,
  },
  catBarLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  catBarName: {
    fontSize: 12,
    fontFamily: "Manrope_600SemiBold",
    color: "#1E293B",
  },
  catBarVal: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#64748B",
  },
  barTrack: {
    height: 8,
    backgroundColor: "#F1F5F9",
    borderRadius: 4,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 4,
  },
});
