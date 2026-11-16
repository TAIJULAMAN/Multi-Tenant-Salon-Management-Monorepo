import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  DAILY_PRODUCTION_DATA,
  PRODUCTION_TRENDS_YEARLY,
  PAYMENTS_PER_YEAR_DATA,
} from "./statisticsData";

export default function EmployeesTab() {
  const [teamSelection, setTeamSelection] = useState<"All Team" | "Sarah" | "Michael">("All Team");
  const [productionRange, setProductionRange] = useState<"Monthly" | "Weekly">("Monthly");
  const [trendRange, setTrendRange] = useState<"Yearly" | "Monthly">("Yearly");

  const handleExport = () => {
    Alert.alert("Export", "Employee statistics exported to CSV successfully.");
  };

  const thresholdValue = 2000;

  return (
    <View style={styles.container}>
      {/* Top Filter & Export Bar */}
      <View style={styles.filterBanner}>
        <View style={styles.filterSelector}>
          {(["All Team", "Sarah", "Michael"] as const).map((member) => {
            const active = teamSelection === member;
            return (
              <TouchableOpacity
                key={member}
                style={[styles.filterChip, active && styles.filterChipActive]}
                onPress={() => setTeamSelection(member)}
                activeOpacity={0.7}
              >
                <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
                  {member}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity style={styles.exportBtn} onPress={handleExport} activeOpacity={0.7}>
          <Ionicons name="download-outline" size={15} color="#635BFF" />
          <Text style={styles.exportBtnText}>Export</Text>
        </TouchableOpacity>
      </View>

      {/* SECTION 1: PRODUCTION */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionHeaderTitle}>Production</Text>

        {/* 3 Stat Cards */}
        <View style={styles.statsRow}>
          <View style={styles.statBoxPurple}>
            <View style={styles.statIconHeader}>
              <View style={[styles.statIconBox, { backgroundColor: "#635BFF" }]}>
                <Ionicons name="briefcase" size={16} color="#FFFFFF" />
              </View>
              <Text style={styles.statBoxLabel}>Monthly Turnover</Text>
            </View>
            <Text style={styles.statBoxVal}>€ 8,500</Text>
          </View>

          <View style={styles.statBoxYellow}>
            <View style={styles.statIconHeader}>
              <View style={[styles.statIconBox, { backgroundColor: "#FBBF24" }]}>
                <Ionicons name="radio-button-on" size={16} color="#FFFFFF" />
              </View>
              <Text style={styles.statBoxLabel}>Target Threshold</Text>
            </View>
            <Text style={styles.statBoxVal}>€ 6,400</Text>
          </View>
        </View>

        {/* Performance Goal Achieved Card */}
        <View style={styles.statBoxTeal}>
          <View style={styles.goalAchievedHeader}>
            <View style={styles.statIconHeader}>
              <View style={[styles.statIconBox, { backgroundColor: "#2DD4BF" }]}>
                <Ionicons name="ribbon" size={16} color="#FFFFFF" />
              </View>
              <Text style={styles.statBoxLabel}>Performance</Text>
            </View>
            <View style={styles.goalBadge}>
              <Text style={styles.goalBadgeText}>Goal Achieved</Text>
            </View>
          </View>
          <Text style={styles.statBoxVal}>133%</Text>
        </View>

        {/* Daily Production (Monthly) Bar Chart */}
        <View style={styles.subCard}>
          <View style={styles.subCardHeader}>
            <View>
              <Text style={styles.subCardTitle}>Daily Production</Text>
              <View style={styles.thresholdStatusBadge}>
                <Text style={styles.thresholdStatusText}>Above Threshold: € 12,500</Text>
              </View>
            </View>

            <View style={styles.toggleRow}>
              {(["Monthly", "Weekly"] as const).map((r) => {
                const active = productionRange === r;
                return (
                  <TouchableOpacity
                    key={r}
                    style={[styles.toggleBtn, active && styles.toggleBtnActive]}
                    onPress={() => setProductionRange(r)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.toggleBtnText, active && styles.toggleBtnTextActive]}>
                      {r}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Stacked Bars */}
          <View style={styles.dailyBarsContainer}>
            {DAILY_PRODUCTION_DATA.map((d, idx) => {
              const maxVal = 3000;
              const aboveH = Math.max(8, (d.above / maxVal) * 60);
              const belowH = Math.max(8, (d.below / maxVal) * 40);

              return (
                <View key={idx} style={styles.dailyBarCol}>
                  <View style={styles.dailyBarTrack}>
                    <View style={[styles.barAbove, { height: aboveH }]} />
                    <View style={styles.zeroLine} />
                    <View style={[styles.barBelow, { height: belowH }]} />
                  </View>
                  <Text style={styles.dailyMonthLabel}>{d.month}</Text>
                </View>
              );
            })}
          </View>

          {/* Threshold Calculation Legend */}
          <View style={styles.thresholdLegend}>
            <Text style={styles.thresholdLegendText}>
              • Threshold Calculation: Turnover × 0.2 = € 3,500
            </Text>
            <Text style={styles.thresholdLegendText}>
              • Monthly Salary: € 4,000
            </Text>
          </View>
        </View>

        {/* Production Trends (Yearly) */}
        <View style={styles.subCard}>
          <View style={styles.subCardHeader}>
            <View>
              <Text style={styles.subCardTitle}>Production Trends</Text>
              <Text style={styles.subCardSub}>Threshold: € 2,000</Text>
            </View>

            <View style={styles.toggleRow}>
              {(["Yearly", "Monthly"] as const).map((r) => {
                const active = trendRange === r;
                return (
                  <TouchableOpacity
                    key={r}
                    style={[styles.toggleBtn, active && styles.toggleBtnActive]}
                    onPress={() => setTrendRange(r)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.toggleBtnText, active && styles.toggleBtnTextActive]}>
                      {r}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Trend Bars */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.trendBarsRow}>
              {PRODUCTION_TRENDS_YEARLY.map((item, idx) => {
                const isAbove = item.val >= thresholdValue;
                const barH = Math.max(12, (item.val / 3000) * 100);
                return (
                  <View key={idx} style={styles.trendBarCol}>
                    <Text style={styles.trendValText}>€{Math.round(item.val / 1000)}k</Text>
                    <View style={styles.trendBarTrack}>
                      <View
                        style={[
                          styles.trendBarFill,
                          {
                            height: barH,
                            backgroundColor: isAbove ? "#22C55E" : "#F43F5E",
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.trendMonthLabel}>{item.month}</Text>
                  </View>
                );
              })}
            </View>
          </ScrollView>

          <View style={styles.trendLegendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: "#22C55E" }]} />
              <Text style={styles.legendText}>Above Threshold</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: "#F43F5E" }]} />
              <Text style={styles.legendText}>Below Threshold</Text>
            </View>
          </View>
        </View>

        {/* 2 Detailed Metric Cards */}
        <View style={styles.metricsGrid}>
          {/* Performance Metrics */}
          <View style={styles.metricBlock}>
            <Text style={styles.metricBlockTitle}>Performance Metrics (Last Month)</Text>
            <View style={styles.metricRows}>
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Target Threshold</Text>
                <Text style={styles.metricVal}>€ 1,700</Text>
              </View>
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Monthly Salary</Text>
                <Text style={styles.metricVal}>€ 3,200</Text>
              </View>
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Threshold Calc (20%)</Text>
                <Text style={styles.metricVal}>€ 1,700</Text>
              </View>
              <View style={[styles.metricRow, { borderBottomWidth: 0 }]}>
                <Text style={styles.metricLabel}>Performance Status</Text>
                <View style={styles.goalBadge}>
                  <Text style={styles.goalBadgeText}>Goal Achieved</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Operation Statics */}
          <View style={styles.metricBlock}>
            <Text style={styles.metricBlockTitle}>Operation Statistics</Text>
            <View style={styles.metricRows}>
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Completed Appointments</Text>
                <Text style={styles.metricVal}>38</Text>
              </View>
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Revenue / Appointment</Text>
                <Text style={styles.metricVal}>€ 223.68</Text>
              </View>
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Working Days</Text>
                <Text style={styles.metricVal}>3</Text>
              </View>
              <View style={[styles.metricRow, { borderBottomWidth: 0 }]}>
                <Text style={styles.metricLabel}>Daily Average</Text>
                <Text style={[styles.metricVal, { color: "#22C55E" }]}>€ 2,633.33</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* SECTION 2: REMUNERATION */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionHeaderTitle}>Remuneration</Text>

        {/* 3 Stat Cards */}
        <View style={styles.statsRow}>
          <View style={styles.statBoxPurple}>
            <View style={styles.statIconHeader}>
              <View style={[styles.statIconBox, { backgroundColor: "#635BFF" }]}>
                <Ionicons name="wallet" size={16} color="#FFFFFF" />
              </View>
              <Text style={styles.statBoxLabel}>Last Payslip</Text>
            </View>
            <Text style={styles.statBoxVal}>€ 1,700</Text>
            <Text style={styles.statBoxSub}>Gross: € 4,300.00</Text>
          </View>

          <View style={styles.statBoxTealRem}>
            <View style={styles.statIconHeader}>
              <View style={[styles.statIconBox, { backgroundColor: "#2DD4BF" }]}>
                <Ionicons name="cash" size={16} color="#FFFFFF" />
              </View>
              <Text style={styles.statBoxLabel}>Average Salary</Text>
            </View>
            <Text style={styles.statBoxVal}>€ 2,200</Text>
            <Text style={styles.statBoxSub}>Last 12 months</Text>
          </View>
        </View>

        <View style={styles.statBoxYellowRem}>
          <View style={styles.statIconHeader}>
            <View style={[styles.statIconBox, { backgroundColor: "#FBBF24" }]}>
              <Ionicons name="server" size={16} color="#FFFFFF" />
            </View>
            <Text style={styles.statBoxLabel}>Accumulated TFR</Text>
          </View>
          <Text style={styles.statBoxVal}>€ 5,500</Text>
        </View>

        {/* Payments per Year */}
        <View style={styles.subCard}>
          <Text style={styles.subCardTitle}>Payments per Year</Text>

          <View style={styles.yearBarsContainer}>
            {PAYMENTS_PER_YEAR_DATA.map((p, idx) => {
              const maxVal = 4500;
              const h = Math.max(12, (p.amount / maxVal) * 110);
              return (
                <View key={idx} style={styles.yearBarCol}>
                  <Text style={styles.yearValText}>€{p.amount}</Text>
                  <View style={styles.yearBarTrack}>
                    <View style={[styles.yearBarFill, { height: h }]} />
                  </View>
                  <Text style={styles.yearLabel}>{p.year}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  filterBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 12,
  },
  filterSelector: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    borderRadius: 8,
    padding: 2,
  },
  filterChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  filterChipActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  filterChipText: {
    fontSize: 11,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  filterChipTextActive: {
    color: "#635BFF",
    fontFamily: "Manrope_700Bold",
  },
  exportBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  exportBtnText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
    gap: 14,
  },
  sectionHeaderTitle: {
    fontSize: 16,
    fontFamily: "Manrope_800ExtraBold",
    color: "#1E293B",
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  statBoxPurple: {
    flex: 1,
    backgroundColor: "#F5F3FF",
    borderRadius: 14,
    padding: 14,
    gap: 8,
  },
  statBoxYellow: {
    flex: 1,
    backgroundColor: "#FEFCE8",
    borderRadius: 14,
    padding: 14,
    gap: 8,
  },
  statBoxTeal: {
    backgroundColor: "#F0FDFA",
    borderRadius: 14,
    padding: 14,
    gap: 8,
  },
  statBoxTealRem: {
    flex: 1,
    backgroundColor: "#F0FDFA",
    borderRadius: 14,
    padding: 14,
    gap: 8,
  },
  statBoxYellowRem: {
    backgroundColor: "#FEFCE8",
    borderRadius: 14,
    padding: 14,
    gap: 8,
  },
  statIconHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statIconBox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  statBoxLabel: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  statBoxVal: {
    fontSize: 20,
    fontFamily: "Manrope_800ExtraBold",
    color: "#1E293B",
  },
  statBoxSub: {
    fontSize: 10,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
  },
  goalAchievedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  goalBadge: {
    backgroundColor: "#CCFBF1",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  goalBadgeText: {
    fontSize: 10,
    fontFamily: "Manrope_800ExtraBold",
    color: "#0D9488",
    textTransform: "uppercase",
  },
  subCard: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    padding: 14,
    gap: 12,
    backgroundColor: "#FFFFFF",
  },
  subCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  subCardTitle: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  subCardSub: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
    marginTop: 2,
  },
  thresholdStatusBadge: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  thresholdStatusText: {
    fontSize: 10,
    fontFamily: "Manrope_800ExtraBold",
    color: "#22C55E",
  },
  toggleRow: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    borderRadius: 8,
    padding: 2,
  },
  toggleBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  toggleBtnActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  toggleBtnText: {
    fontSize: 10,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  toggleBtnTextActive: {
    color: "#635BFF",
    fontFamily: "Manrope_700Bold",
  },
  dailyBarsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 140,
  },
  dailyBarCol: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  dailyBarTrack: {
    width: "45%",
    height: 110,
    alignItems: "center",
    justifyContent: "center",
  },
  barAbove: {
    width: "100%",
    backgroundColor: "#2DD4BF",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  zeroLine: {
    width: "100%",
    height: 2,
    backgroundColor: "#E2E8F0",
  },
  barBelow: {
    width: "100%",
    backgroundColor: "#F43F5E",
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  dailyMonthLabel: {
    fontSize: 10,
    fontFamily: "Manrope_600SemiBold",
    color: "#94A3B8",
  },
  thresholdLegend: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    gap: 2,
  },
  thresholdLegendText: {
    fontSize: 10,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
  },
  trendBarsRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-end",
    height: 140,
    paddingBottom: 4,
  },
  trendBarCol: {
    alignItems: "center",
    gap: 4,
  },
  trendValText: {
    fontSize: 9,
    fontFamily: "Manrope_600SemiBold",
    color: "#94A3B8",
  },
  trendBarTrack: {
    width: 24,
    height: 100,
    justifyContent: "flex-end",
    backgroundColor: "#F8FAFC",
    borderRadius: 4,
    overflow: "hidden",
  },
  trendBarFill: {
    width: "100%",
    borderRadius: 4,
  },
  trendMonthLabel: {
    fontSize: 10,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  trendLegendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginTop: 4,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  metricsGrid: {
    gap: 12,
  },
  metricBlock: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    padding: 14,
    backgroundColor: "#FFFFFF",
    gap: 10,
  },
  metricBlockTitle: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  metricRows: {
    gap: 8,
  },
  metricRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  metricLabel: {
    fontSize: 12,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
  },
  metricVal: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  yearBarsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 150,
    paddingTop: 10,
  },
  yearBarCol: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  yearValText: {
    fontSize: 9,
    fontFamily: "Manrope_600SemiBold",
    color: "#94A3B8",
  },
  yearBarTrack: {
    width: "55%",
    height: 110,
    justifyContent: "flex-end",
    backgroundColor: "#F8FAFC",
    borderRadius: 4,
    overflow: "hidden",
  },
  yearBarFill: {
    width: "100%",
    backgroundColor: "#635BFF",
    borderRadius: 4,
  },
  yearLabel: {
    fontSize: 10,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
});
