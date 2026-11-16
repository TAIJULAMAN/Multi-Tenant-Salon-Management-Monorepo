import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

// Modular Tab Components matching Web Dashboard
import TaxesOverviewTab from "@/components/taxes/TaxesOverviewTab";
import TaxesPendingTab from "@/components/taxes/TaxesPendingTab";
import TaxesHistoryTab from "@/components/taxes/TaxesHistoryTab";
import NewTaxUploadTab from "@/components/taxes/NewTaxUploadTab";
import SalonGlobalHeader from "@/components/ui/SalonGlobalHeader";
import ExportModal from "@/components/modal/ExportModal";

type TaxTabType = "Overview" | "Pending" | "History" | "Upload";

export default function TaxesScreen() {
  const [activeTab, setActiveTab] = useState<TaxTabType>("Overview");
  const [isExportOpen, setIsExportOpen] = useState(false);

  const tabItems: { key: TaxTabType; label: string }[] = [
    { key: "Overview", label: "Overview" },
    { key: "Pending", label: "Pending" },
    { key: "History", label: "History" },
    { key: "Upload", label: "New Upload" },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Global Salon Switcher Header */}
      <SalonGlobalHeader title="Taxes" />

      {/* Screen Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerSubtitle}>TAX & COMPLIANCE</Text>
          <Text style={styles.headerTitle} numberOfLines={2}>
            Tax Declarations & F24
          </Text>
        </View>

        {/* Export Button */}
        <TouchableOpacity
          style={styles.exportNavBtn}
          onPress={() => setIsExportOpen(true)}
          activeOpacity={0.8}
        >
          <Ionicons
            name="download-outline"
            size={14}
            color="#635BFF"
            style={{ marginRight: 4 }}
          />
          <Text style={styles.exportNavBtnText}>Export</Text>
        </TouchableOpacity>
      </View>

      {/* Sub Tabs Bar */}
      <View style={styles.subTabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingRight: 16 }}
        >
          {tabItems.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.subTabButton,
                activeTab === tab.key && styles.subTabButtonActive,
              ]}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.subTabText,
                  activeTab === tab.key && styles.subTabTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Main Scrollable Content */}
      <ScrollView
        style={{ backgroundColor: "#F9FAFB" }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "Overview" && (
          <TaxesOverviewTab onNavigateToTab={(t) => setActiveTab(t)} />
        )}
        {activeTab === "Pending" && <TaxesPendingTab />}
        {activeTab === "History" && <TaxesHistoryTab />}
        {activeTab === "Upload" && (
          <NewTaxUploadTab onSuccess={() => setActiveTab("Pending")} />
        )}
      </ScrollView>

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        title="Tax Declarations"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    backgroundColor: "#FFFFFF",
    gap: 10,
  },
  headerTitleWrap: {
    flex: 1,
  },
  headerSubtitle: {
    fontSize: 10,
    fontWeight: "700",
    color: "#635BFF",
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1E293B",
    lineHeight: 22,
    letterSpacing: -0.3,
  },
  exportNavBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEECFF",
    borderWidth: 1,
    borderColor: "#E0DEFF",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    flexShrink: 0,
  },
  exportNavBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#635BFF",
  },
  subTabsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  subTabButton: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: "#F8FAFC",
  },
  subTabButtonActive: {
    backgroundColor: "#EEECFF",
  },
  subTabText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
  },
  subTabTextActive: {
    color: "#635BFF",
    fontWeight: "700",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
});
