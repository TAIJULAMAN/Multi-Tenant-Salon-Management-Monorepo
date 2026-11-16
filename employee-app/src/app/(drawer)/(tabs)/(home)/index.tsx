import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Header from "@/components/Header";
import StatCards from "@/components/dashboard/StatCards";
import PerformanceGoals from "@/components/dashboard/PerformanceGoals";
import AgendaAppointments from "@/components/dashboard/AgendaAppointments";
import AppointmentsChart from "@/components/dashboard/AppointmentsChart";
import {
  LoyalCustomersCard,
  TopServicesCard,
} from "@/components/dashboard/RankingCards";
import NewClientsChart from "@/components/dashboard/NewClientsChart";
import PaymentsPerYearChart from "@/components/dashboard/PaymentsPerYearChart";
import { colors, fonts, radius, shadows } from "@/constants/figmaTheme";

/** Figma 1:32440 – Employee Dashboard. */
export default function DashboardScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 800);
  }, []);

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
          />
        }
      >
        {/* Title bar */}
        <View style={styles.titleBar}>
          <Text style={styles.dashboardTitle}>Dashboard</Text>
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity
              style={styles.refreshBtn}
              onPress={onRefresh}
              disabled={refreshing}
              activeOpacity={0.7}
              accessibilityRole="button"
            >
              <Ionicons name="refresh-outline" size={18} color={colors.text} />
              <Text style={styles.refreshBtnText} numberOfLines={1}>
                Refresh Data
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.viewAllBtn}
              onPress={() =>
                router.push("/(drawer)/(tabs)/calendar/appointments" as any)
              }
              activeOpacity={0.85}
              accessibilityRole="button"
            >
              <Ionicons name="eye-outline" size={18} color={colors.white} />
              <Text style={styles.viewAllBtnText} numberOfLines={1}>
                View All Appointments
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <StatCards />
        <PerformanceGoals />
        <AgendaAppointments />
        <AppointmentsChart />
        <TopServicesCard />
        <LoyalCustomersCard />
        <NewClientsChart />
        <PaymentsPerYearChart />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 40,
  },
  titleBar: {
    backgroundColor: colors.card,
    borderRadius: radius.card,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    gap: 12,
    ...shadows.card,
  },
  dashboardTitle: {
    fontFamily: fonts.semibold,
    fontSize: 18,
    lineHeight: 25,
    color: colors.text,
  },
  actionButtonsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  refreshBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 44,
    paddingHorizontal: 12,
    borderRadius: radius.md,
    backgroundColor: colors.borderLight,
  },
  refreshBtnText: {
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 20,
    color: colors.text,
  },
  viewAllBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 44,
    paddingHorizontal: 12,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    ...shadows.primary,
  },
  viewAllBtnText: {
    flexShrink: 1,
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 20,
    color: colors.white,
  },
});
