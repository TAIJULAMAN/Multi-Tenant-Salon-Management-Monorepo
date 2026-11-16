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
import Header from "@/components/Header";
import PerformanceTab from "@/components/statistics/PerformanceTab";
import ClientsTab from "@/components/statistics/ClientsTab";
import EmployeesTab from "@/components/statistics/EmployeesTab";

type StatisticsSubTab = "Performance" | "Clients" | "Employees";

export default function StatisticsScreen() {
  const [activeTab, setActiveTab] = useState<StatisticsSubTab>("Performance");
  const [dateRange, setDateRange] = useState("This Month");
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);

  const handleExport = () => {
    Alert.alert("Export Statistics", `Exporting ${activeTab} statistics report.`);
  };

  return (
    <View style={styles.container}>
      <Header />

      {/* Sub-Tabs Selector matching Web (Performance | Clients | Employees) */}
      <View style={styles.subTabContainer}>
        {(["Performance", "Clients", "Employees"] as const).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.subTabButton, isActive && styles.subTabButtonActive]}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.8}
            >
              <Text style={[styles.subTabText, isActive && styles.subTabTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Screen Title & Action Bar */}
      <View style={styles.titleRow}>
        <Text style={styles.screenTitle}>{activeTab} Statistics</Text>

        <View style={styles.titleActions}>
          <TouchableOpacity
            style={styles.datePickerBtn}
            onPress={() => setDateDropdownOpen(!dateDropdownOpen)}
            activeOpacity={0.7}
          >
            <Ionicons name="calendar-outline" size={14} color="#635BFF" style={{ marginRight: 6 }} />
            <Text style={styles.datePickerText}>{dateRange}</Text>
            <Ionicons name="chevron-down" size={12} color="#94A3B8" style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Date Dropdown Quick Menu */}
      {dateDropdownOpen && (
        <View style={styles.dropdownMenu}>
          {["This Week", "This Month", "Last 30 Days", "This Year"].map((opt) => (
            <TouchableOpacity
              key={opt}
              style={[styles.dropdownItem, dateRange === opt && styles.dropdownItemActive]}
              onPress={() => {
                setDateRange(opt);
                setDateDropdownOpen(false);
              }}
            >
              <Text style={[styles.dropdownItemText, dateRange === opt && styles.dropdownItemTextActive]}>
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Tab Content Body */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "Performance" && <PerformanceTab />}
        {activeTab === "Clients" && <ClientsTab />}
        {activeTab === "Employees" && <EmployeesTab />}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  subTabContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    gap: 8,
  },
  subTabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  subTabButtonActive: {
    backgroundColor: "#635BFF",
    borderColor: "#635BFF",
  },
  subTabText: {
    fontSize: 13,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  subTabTextActive: {
    color: "#FFFFFF",
    fontFamily: "Manrope_700Bold",
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  screenTitle: {
    fontSize: 16,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  titleActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  datePickerBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  datePickerText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  dropdownMenu: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginTop: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    zIndex: 100,
    overflow: "hidden",
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  dropdownItemActive: {
    backgroundColor: "#EEF2FF",
  },
  dropdownItemText: {
    fontSize: 12,
    fontFamily: "Manrope_600SemiBold",
    color: "#475569",
  },
  dropdownItemTextActive: {
    color: "#635BFF",
    fontFamily: "Manrope_700Bold",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
});
