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
  CLIENT_LOYAL_CUSTOMERS,
  AGE_GROUP_DATA,
  VISIT_FREQ_DAILY,
  VISIT_FREQ_WEEKLY,
} from "./statisticsData";

export default function ClientsTab() {
  const [filter, setFilter] = useState<"All Clients" | "VIP Only">("All Clients");
  const [moneyRange, setMoneyRange] = useState<"Last 7 days" | "Last 30 days">("Last 7 days");
  const [freqRange, setFreqRange] = useState<"Daily" | "Weekly">("Daily");

  const is30Days = moneyRange === "Last 30 days";
  const totalMoney = is30Days ? "€ 31,450" : "€ 8,400";
  const moneyPct = is30Days ? "+12%" : "+9%";
  const moneyComp = is30Days ? "vs last month" : "vs last week";

  const chartData7Days = [
    { day: "Sep 1", val: 650 },
    { day: "Sep 2", val: 800 },
    { day: "Sep 3", val: 600 },
    { day: "Sep 4", val: 950 },
    { day: "Sep 5", val: 800 },
    { day: "Sep 6", val: 2400 },
    { day: "Sep 7", val: 2200 },
  ];

  const chartData30Days = [
    { day: "W1", val: 6800 },
    { day: "W2", val: 7900 },
    { day: "W3", val: 8400 },
    { day: "W4", val: 8350 },
  ];

  const currentMoneyData = is30Days ? chartData30Days : chartData7Days;
  const maxMoneyVal = is30Days ? 9000 : 2500;

  const currentFreqData = freqRange === "Daily" ? VISIT_FREQ_DAILY : VISIT_FREQ_WEEKLY;
  const maxFreqVal = freqRange === "Daily" ? 5 : 25;

  const handleExport = () => {
    Alert.alert("Export", "Client statistics exported to CSV successfully.");
  };

  return (
    <View style={styles.container}>
      {/* Top Filter & Export Bar */}
      <View style={styles.filterBanner}>
        <View style={styles.filterSelector}>
          {(["All Clients", "VIP Only"] as const).map((f) => {
            const active = filter === f;
            return (
              <TouchableOpacity
                key={f}
                style={[styles.filterChip, active && styles.filterChipActive]}
                onPress={() => setFilter(f)}
                activeOpacity={0.7}
              >
                <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
                  {f}
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

      {/* 2 Stat Cards Row */}
      <View style={styles.statsRow}>
        <View style={styles.gradientStatCardPurple}>
          <View style={styles.statIconHeader}>
            <View style={[styles.statIconBox, { backgroundColor: "#635BFF" }]}>
              <Ionicons name="wallet" size={18} color="#FFFFFF" />
            </View>
            <Text style={styles.statCardTitle}>Total Money Spent</Text>
          </View>
          <Text style={styles.statCardValue}>€ 4,358</Text>
        </View>

        <View style={styles.gradientStatCardTeal}>
          <View style={styles.statIconHeader}>
            <View style={[styles.statIconBox, { backgroundColor: "#2DD4BF" }]}>
              <Ionicons name="briefcase" size={18} color="#FFFFFF" />
            </View>
            <Text style={styles.statCardTitle}>Avg Spend Per Visit</Text>
          </View>
          <Text style={styles.statCardValue}>€ 258</Text>
        </View>
      </View>

      {/* Money Spent Chart Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.cardTitle}>Money Spent</Text>
            <View style={styles.moneyHeroRow}>
              <Text style={styles.moneyHeroAmount}>{totalMoney}</Text>
              <View style={styles.moneyTrendBadge}>
                <Ionicons name="arrow-up" size={11} color="#22C55E" />
                <Text style={styles.moneyTrendText}>{moneyPct}</Text>
              </View>
              <Text style={styles.moneyTrendComp}>{moneyComp}</Text>
            </View>
          </View>

          <View style={styles.toggleRow}>
            {(["Last 7 days", "Last 30 days"] as const).map((r) => {
              const active = moneyRange === r;
              return (
                <TouchableOpacity
                  key={r}
                  style={[styles.toggleBtn, active && styles.toggleBtnActive]}
                  onPress={() => setMoneyRange(r)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.toggleBtnText, active && styles.toggleBtnTextActive]}>
                    {r === "Last 7 days" ? "7D" : "30D"}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Bar Chart Visualizer */}
        <View style={styles.moneyBarsContainer}>
          {currentMoneyData.map((d, idx) => {
            const h = Math.max(12, (d.val / maxMoneyVal) * 120);
            return (
              <View key={idx} style={styles.moneyBarCol}>
                <Text style={styles.barTopVal}>€{d.val >= 1000 ? `${(d.val / 1000).toFixed(1)}k` : d.val}</Text>
                <View style={styles.moneyBarTrack}>
                  <View style={[styles.moneyBarFill, { height: h }]} />
                </View>
                <Text style={styles.barDayLabel}>{d.day}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Age Group Breakdown Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.cardTitle}>Age Group</Text>
            <Text style={styles.cardSub}>Client demographics distribution</Text>
          </View>
        </View>

        {/* Multi-segment Bar Indicator */}
        <View style={styles.multiSegmentTrack}>
          {AGE_GROUP_DATA.map((ag, idx) => (
            <View
              key={idx}
              style={{
                flex: ag.percentage,
                height: 10,
                backgroundColor: ag.color,
                borderTopLeftRadius: idx === 0 ? 5 : 0,
                borderBottomLeftRadius: idx === 0 ? 5 : 0,
                borderTopRightRadius: idx === AGE_GROUP_DATA.length - 1 ? 5 : 0,
                borderBottomRightRadius: idx === AGE_GROUP_DATA.length - 1 ? 5 : 0,
                marginRight: idx < AGE_GROUP_DATA.length - 1 ? 2 : 0,
              }}
            />
          ))}
        </View>

        {/* Legend Grid */}
        <View style={styles.categoriesGrid}>
          {AGE_GROUP_DATA.map((ag, idx) => (
            <View key={idx} style={styles.categoryBadge}>
              <View style={[styles.catColorDot, { backgroundColor: ag.color }]} />
              <View style={styles.catInfo}>
                <Text style={styles.catName}>{ag.label}</Text>
                <Text style={styles.catAmount}>{ag.percentage}%</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Visit Frequency Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.cardTitle}>Visit Frequency</Text>
            <Text style={styles.cardSub}>Appointment distribution over time</Text>
          </View>

          <View style={styles.toggleRow}>
            {(["Daily", "Weekly"] as const).map((r) => {
              const active = freqRange === r;
              return (
                <TouchableOpacity
                  key={r}
                  style={[styles.toggleBtn, active && styles.toggleBtnActive]}
                  onPress={() => setFreqRange(r)}
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

        {/* Frequency Bars */}
        <View style={styles.freqBarsContainer}>
          {currentFreqData.map((d, idx) => {
            const h = Math.max(12, (d.visits / maxFreqVal) * 110);
            const isPeak = d.visits === maxFreqVal;
            return (
              <View key={idx} style={styles.freqBarCol}>
                <Text style={[styles.freqValText, isPeak && { color: "#635BFF", fontFamily: "Manrope_700Bold" }]}>
                  {d.visits}
                </Text>
                <View style={styles.freqBarTrack}>
                  <View
                    style={[
                      styles.freqBarFill,
                      { height: h, backgroundColor: isPeak ? "#635BFF" : "#E2E8F0" },
                    ]}
                  />
                </View>
                <Text style={[styles.freqDayLabel, isPeak && { color: "#1E293B", fontFamily: "Manrope_700Bold" }]}>
                  {d.label}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Most Loyal Customers Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.cardTitle}>Most Loyal Customers</Text>
            <Text style={styles.cardSub}>Ranked by visits & total spend</Text>
          </View>
        </View>

        <View style={styles.loyalList}>
          {CLIENT_LOYAL_CUSTOMERS.map((c) => (
            <View key={c.id} style={styles.loyalCard}>
              <View style={styles.loyalLeft}>
                <View style={styles.rankBadge}>
                  <Text style={styles.rankBadgeText}>{c.id}</Text>
                </View>
                <View style={styles.loyalInfo}>
                  <Text style={styles.loyalName}>{c.name}</Text>
                  <Text style={styles.loyalLastVisit}>Last Visit: {c.lastVisit}</Text>
                </View>
              </View>

              <View style={styles.loyalRight}>
                <View style={styles.loyalMetric}>
                  <Text style={styles.loyalMetricVal}>{c.appointments}</Text>
                  <Text style={styles.loyalMetricLabel}>Visits</Text>
                </View>
                <View style={styles.loyalMetric}>
                  <Text style={[styles.loyalMetricVal, { color: "#22C55E" }]}>{c.spent}</Text>
                  <Text style={styles.loyalMetricLabel}>Total</Text>
                </View>
              </View>
            </View>
          ))}
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
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  gradientStatCardPurple: {
    flex: 1,
    backgroundColor: "#F5F3FF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EDE9FE",
    padding: 16,
    gap: 12,
  },
  gradientStatCardTeal: {
    flex: 1,
    backgroundColor: "#F0FDFA",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#CCFBF1",
    padding: 16,
    gap: 12,
  },
  statIconHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  statCardTitle: {
    flex: 1,
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  statCardValue: {
    fontSize: 22,
    fontFamily: "Manrope_800ExtraBold",
    color: "#1E293B",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
    gap: 14,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardTitle: {
    fontSize: 15,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  cardSub: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
    marginTop: 2,
  },
  moneyHeroRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 6,
  },
  moneyHeroAmount: {
    fontSize: 20,
    fontFamily: "Manrope_800ExtraBold",
    color: "#1E293B",
  },
  moneyTrendBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 2,
  },
  moneyTrendText: {
    fontSize: 10,
    fontFamily: "Manrope_800ExtraBold",
    color: "#22C55E",
  },
  moneyTrendComp: {
    fontSize: 10,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
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
  moneyBarsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 160,
    paddingTop: 10,
  },
  moneyBarCol: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  barTopVal: {
    fontSize: 9,
    fontFamily: "Manrope_600SemiBold",
    color: "#94A3B8",
  },
  moneyBarTrack: {
    width: "60%",
    height: 120,
    justifyContent: "flex-end",
    backgroundColor: "#F8FAFC",
    borderRadius: 4,
    overflow: "hidden",
  },
  moneyBarFill: {
    width: "100%",
    backgroundColor: "#22C55E",
    borderRadius: 4,
  },
  barDayLabel: {
    fontSize: 10,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
    marginTop: 2,
  },
  multiSegmentTrack: {
    flexDirection: "row",
    height: 10,
    borderRadius: 5,
    overflow: "hidden",
    marginTop: 4,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  catColorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  catInfo: {
    gap: 1,
  },
  catName: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  catAmount: {
    fontSize: 10,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
  },
  freqBarsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 140,
    paddingTop: 10,
  },
  freqBarCol: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  freqValText: {
    fontSize: 10,
    fontFamily: "Manrope_600SemiBold",
    color: "#94A3B8",
  },
  freqBarTrack: {
    width: "50%",
    height: 100,
    justifyContent: "flex-end",
    backgroundColor: "#F8FAFC",
    borderRadius: 4,
    overflow: "hidden",
  },
  freqBarFill: {
    width: "100%",
    borderRadius: 4,
  },
  freqDayLabel: {
    fontSize: 10,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
    marginTop: 2,
  },
  loyalList: {
    gap: 10,
  },
  loyalCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    padding: 12,
  },
  loyalLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#635BFF",
    alignItems: "center",
    justifyContent: "center",
  },
  rankBadgeText: {
    fontSize: 13,
    fontFamily: "Manrope_800ExtraBold",
    color: "#FFFFFF",
  },
  loyalInfo: {
    gap: 2,
    flex: 1,
  },
  loyalName: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  loyalLastVisit: {
    fontSize: 10,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
  },
  loyalRight: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  loyalMetric: {
    alignItems: "flex-end",
  },
  loyalMetricVal: {
    fontSize: 13,
    fontFamily: "Manrope_800ExtraBold",
    color: "#1E293B",
  },
  loyalMetricLabel: {
    fontSize: 9,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
  },
});
