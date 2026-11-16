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

// Modular Tab Components matching Web Dashboard
import DocumentsOverviewTab from "@/components/documents/DocumentsOverviewTab";
import ContractsTab from "@/components/documents/ContractsTab";
import EmployeeNoticesTab from "@/components/documents/EmployeeNoticesTab";
import OwnerDocumentsTab from "@/components/documents/OwnerDocumentsTab";
import SalonGlobalHeader from "@/components/ui/SalonGlobalHeader";

type TabType = "Overview" | "Contracts" | "Notices" | "OwnerDocs";

export default function DocumentsScreen() {
  const [activeTab, setActiveTab] = useState<TabType>("Overview");

  const tabItems: { key: TabType; label: string }[] = [
    { key: "Overview", label: "Overview" },
    { key: "Contracts", label: "Contracts" },
    { key: "Notices", label: "Notices" },
    { key: "OwnerDocs", label: "Owner Docs" },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Global Salon Switcher Header */}
      <SalonGlobalHeader title="Documents" />

      {/* Screen Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSubtitle}>Document Archive</Text>
          <Text style={styles.headerTitle}>Legal & Financial Docs</Text>
        </View>
      </View>

      {/* Scrollable Sub Tabs Bar */}
      <View style={styles.subTabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.subTabsContent}
        >
          {tabItems.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.subTabButton, activeTab === tab.key && styles.subTabButtonActive]}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.8}
            >
              <Text style={[styles.subTabText, activeTab === tab.key && styles.subTabTextActive]}>
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
          <DocumentsOverviewTab onNavigateToTab={(tab) => setActiveTab(tab)} />
        )}
        {activeTab === "Contracts" && <ContractsTab />}
        {activeTab === "Notices" && <EmployeeNoticesTab />}
        {activeTab === "OwnerDocs" && <OwnerDocumentsTab />}
      </ScrollView>
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  headerSubtitle: {
    fontSize: 10,
    color: "#6B7280",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#1E293B",
  },
  subTabsContainer: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  subTabsContent: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
    alignItems: "center",
  },
  subTabButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: "#F4F5F7",
  },
  subTabButtonActive: {
    backgroundColor: "#EEECFF",
  },
  subTabText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
  },
  subTabTextActive: {
    color: "#635BFF",
    fontWeight: "700",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
});
