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
import SalariesOverviewTab from "@/components/salaries/SalariesOverviewTab";
import SalariesPendingTab from "@/components/salaries/SalariesPendingTab";
import SalariesHistoryTab from "@/components/salaries/SalariesHistoryTab";
import NewSalaryUploadTab from "@/components/salaries/NewSalaryUploadTab";
import SalonGlobalHeader from "@/components/ui/SalonGlobalHeader";

type SalaryTabType = "Overview" | "Pending" | "History" | "Upload";

export default function SalariesScreen() {
  const [activeTab, setActiveTab] = useState<SalaryTabType>("Overview");

  // Removed "New Upload" tab since we have the dedicated "Upload PDF" button in the header
  const tabItems: { key: "Overview" | "Pending" | "History"; label: string }[] = [
    { key: "Overview", label: "Overview" },
    { key: "Pending", label: "Pending" },
    { key: "History", label: "History" },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Global Salon Switcher Header */}
      <SalonGlobalHeader title="Salaries" />

      {/* Screen Title & Upload Action Bar */}
      <View style={styles.header}>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerSubtitle}>PAYROLL & HR COMPLIANCE</Text>
          <Text style={styles.headerTitle} numberOfLines={2}>
            Staff Salaries & Cedolini
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.uploadNavBtn,
            activeTab === "Upload" && styles.uploadNavBtnActive,
          ]}
          onPress={() => setActiveTab(activeTab === "Upload" ? "Overview" : "Upload")}
          activeOpacity={0.8}
        >
          <Ionicons
            name={activeTab === "Upload" ? "close" : "cloud-upload-outline"}
            size={15}
            color="#FFFFFF"
            style={{ marginRight: 5 }}
          />
          <Text style={styles.uploadNavBtnText}>
            {activeTab === "Upload" ? "Close" : "Upload PDF"}
          </Text>
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
          <SalariesOverviewTab onNavigateToTab={(t) => setActiveTab(t)} />
        )}
        {activeTab === "Pending" && <SalariesPendingTab />}
        {activeTab === "History" && <SalariesHistoryTab />}
        {activeTab === "Upload" && (
          <NewSalaryUploadTab onSuccess={() => setActiveTab("Pending")} />
        )}
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
  uploadNavBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#635BFF",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    flexShrink: 0,
  },
  uploadNavBtnActive: {
    backgroundColor: "#475569",
  },
  uploadNavBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
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
