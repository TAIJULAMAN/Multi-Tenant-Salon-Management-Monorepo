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

// Modular Subtab Components matching Web Dashboard budgeting/*
import FinancesOverviewTab from "@/components/finances/FinancesOverviewTab";
import FinancesIncomeTab from "@/components/finances/FinancesIncomeTab";
import FinancesExpenseTab from "@/components/finances/FinancesExpenseTab";
import FinancesPaymentsTab from "@/components/finances/FinancesPaymentsTab";
import FinancesReceiptsTab from "@/components/finances/FinancesReceiptsTab";
import SalonGlobalHeader from "@/components/ui/SalonGlobalHeader";

type FinanceTabType = "Overview" | "Expenses" | "Income" | "Payments" | "Receipts";

const FINANCE_TABS: { key: FinanceTabType; label: string }[] = [
  { key: "Overview", label: "Overview" },
  { key: "Expenses", label: "Expense Management" },
  { key: "Income", label: "Income & Revenue" },
  { key: "Payments", label: "Payments" },
  { key: "Receipts", label: "Receipts" },
];

export default function FinancesScreen() {
  const [activeTab, setActiveTab] = useState<FinanceTabType>("Payments");

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Global Salon Switcher Header */}
      <SalonGlobalHeader title="Finances" />

      {/* 5 Subtabs Navigation Bar matching web */}
      <View style={styles.subtabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.subtabsScroll}
        >
          {FINANCE_TABS.map((tab) => {
            const isActive = activeTab === tab.key;

            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.subtabBtn, isActive && styles.subtabBtnActive]}
                onPress={() => setActiveTab(tab.key)}
                activeOpacity={0.8}
              >
                <Text
                  style={[styles.subtabText, isActive && styles.subtabTextActive]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Tab Screen Content */}
      <ScrollView
        style={{ backgroundColor: "#F9FAFB" }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "Overview" && (
          <FinancesOverviewTab onNavigateToTab={(tab) => setActiveTab(tab)} />
        )}
        {activeTab === "Income" && <FinancesIncomeTab />}
        {activeTab === "Expenses" && <FinancesExpenseTab />}
        {activeTab === "Payments" && <FinancesPaymentsTab />}
        {activeTab === "Receipts" && <FinancesReceiptsTab />}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  subtabsContainer: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    paddingVertical: 10,
  },
  subtabsScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  subtabBtn: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#F4F5F7",
  },
  subtabBtnActive: {
    backgroundColor: "#635BFF",
  },
  subtabText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
  },
  subtabTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 40,
  },
});
