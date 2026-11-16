import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { setSelectedSalon } from "@/redux/slices/salonSlice";

// Modular Dashboard Components matching Web Dashboard
import DashboardKPICards from "@/components/dashboard/DashboardKPICards";
import DashboardRecentActivity from "@/components/dashboard/DashboardRecentActivity";
import DashboardSalonOverview from "@/components/dashboard/DashboardSalonOverview";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import SalonGlobalHeader from "@/components/ui/SalonGlobalHeader";

export default function DashboardScreen() {
  const dispatch = useDispatch();
  const selectedSalon = useSelector(
    (state: RootState) => state.salon.selectedSalon
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Screen Top Header with Global Salon Switcher */}
      <SalonGlobalHeader title="Active View" />

      {/* Main Dashboard Scrollable Content */}
      <ScrollView
        style={{ backgroundColor: "#F9FAFB" }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Dashboard Header Greeting Banner matching Web Dashboard */}
        <View style={styles.welcomeBanner}>
          <Text style={styles.bannerTitle}>Dashboard</Text>
          <Text style={styles.bannerSubtitle}>
            Overview of your financial approvals, budgets, and compliance warnings.
          </Text>
        </View>

        {/* 1. KPI Cards */}
        <DashboardKPICards selectedSalon={selectedSalon} />

        {/* 2. Recent Activity & Alerts */}
        <DashboardRecentActivity selectedSalon={selectedSalon} />

        {/* 3. Salon Overview */}
        <DashboardSalonOverview
          selectedSalon={selectedSalon}
          onSelectSalon={(name) => dispatch(setSelectedSalon(name))}
        />

        {/* 4. Financial Charts */}
        <DashboardCharts selectedSalon={selectedSalon} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 16,
  },
  welcomeBanner: {
    marginBottom: 4,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
  },
  bannerSubtitle: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
});
