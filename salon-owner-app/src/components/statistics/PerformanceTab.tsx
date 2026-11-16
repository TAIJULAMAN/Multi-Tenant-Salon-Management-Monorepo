import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  PERFORMANCE_STAT_CARDS,
  SERVICE_REVENUE_PAGE_1,
  SERVICE_REVENUE_PAGE_2,
  CATEGORY_DONUT_DATA,
  MONTHLY_COSTS_VS_SALARIES,
} from "./statisticsData";

export default function PerformanceTab() {
  const [servicePage, setServicePage] = useState(1);
  const [radarComparison, setRadarComparison] = useState<"Top Stylists" | "Locations">("Top Stylists");
  const [selectedMonthIdx, setSelectedMonthIdx] = useState(0);

  const activeServices = servicePage === 1 ? SERVICE_REVENUE_PAGE_1 : SERVICE_REVENUE_PAGE_2;

  const radarData = radarComparison === "Top Stylists"
    ? [
        { label: "Speed", val1: 90, val2: 75 },
        { label: "Client Retention", val1: 85, val2: 90 },
        { label: "Upselling", val1: 95, val2: 70 },
        { label: "Retail Sales", val1: 80, val2: 85 },
        { label: "Punctuality", val1: 70, val2: 95 },
        { label: "Satisfaction", val1: 95, val2: 85 },
      ]
    : [
        { label: "Speed", val1: 85, val2: 80 },
        { label: "Client Retention", val1: 80, val2: 85 },
        { label: "Upselling", val1: 90, val2: 75 },
        { label: "Retail Sales", val1: 75, val2: 90 },
        { label: "Punctuality", val1: 85, val2: 80 },
        { label: "Satisfaction", val1: 90, val2: 85 },
      ];

  const entity1 = radarComparison === "Top Stylists" ? "Sarah J." : "Downtown Branch";
  const entity2 = radarComparison === "Top Stylists" ? "Michael T." : "Uptown Branch";

  return (
    <View style={styles.container}>
      {/* 6 Stat Cards Grid */}
      <View style={styles.statsGrid}>
        {PERFORMANCE_STAT_CARDS.map((stat) => (
          <View key={stat.id} style={styles.statCard}>
            <View style={styles.statHeader}>
              <View style={[styles.iconCircle, { backgroundColor: stat.iconBg }]}>
                <Ionicons name={stat.icon as any} size={18} color={stat.iconColor} />
              </View>
              <Text style={styles.statTitle}>{stat.title}</Text>
            </View>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statChange}>{stat.change}</Text>
          </View>
        ))}
      </View>

      {/* Service Revenue Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.cardTitle}>Service Revenue</Text>
            <Text style={styles.cardSub}>Top revenue generating services</Text>
          </View>
          <View style={styles.paginationRow}>
            <TouchableOpacity
              style={[styles.pageBtn, servicePage === 1 && styles.pageBtnActive]}
              onPress={() => setServicePage(1)}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-back" size={14} color={servicePage === 1 ? "#635BFF" : "#94A3B8"} />
            </TouchableOpacity>
            <Text style={styles.pageIndicatorText}>{servicePage} / 2</Text>
            <TouchableOpacity
              style={[styles.pageBtn, servicePage === 2 && styles.pageBtnActive]}
              onPress={() => setServicePage(2)}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-forward" size={14} color={servicePage === 2 ? "#635BFF" : "#94A3B8"} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.servicesList}>
          {activeServices.map((srv, idx) => {
            const pct = Math.round((srv.value / srv.max) * 100);
            return (
              <View key={idx} style={styles.serviceItem}>
                <View style={styles.serviceItemHeader}>
                  <Text style={styles.serviceName}>{srv.name}</Text>
                  <Text style={styles.serviceVal}>€ {srv.value.toLocaleString()}</Text>
                </View>
                <View style={styles.progressBarTrack}>
                  <View
                    style={[
                      styles.progressBarFill,
                      { width: `${pct}%`, backgroundColor: srv.color },
                    ]}
                  />
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {/* Category Revenue Distribution Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.cardTitle}>Category Distribution</Text>
            <Text style={styles.cardSub}>Revenue contribution by department</Text>
          </View>
        </View>

        {/* Multi-segment Bar Indicator */}
        <View style={styles.multiSegmentTrack}>
          {CATEGORY_DONUT_DATA.map((cat, idx) => (
            <View
              key={idx}
              style={{
                flex: cat.value,
                height: 10,
                backgroundColor: cat.color,
                borderTopLeftRadius: idx === 0 ? 5 : 0,
                borderBottomLeftRadius: idx === 0 ? 5 : 0,
                borderTopRightRadius: idx === CATEGORY_DONUT_DATA.length - 1 ? 5 : 0,
                borderBottomRightRadius: idx === CATEGORY_DONUT_DATA.length - 1 ? 5 : 0,
                marginRight: idx < CATEGORY_DONUT_DATA.length - 1 ? 2 : 0,
              }}
            />
          ))}
        </View>

        {/* Category Legend Pills */}
        <View style={styles.categoriesGrid}>
          {CATEGORY_DONUT_DATA.map((cat, idx) => (
            <View key={idx} style={styles.categoryBadge}>
              <View style={[styles.catColorDot, { backgroundColor: cat.color }]} />
              <View style={styles.catInfo}>
                <Text style={styles.catName}>{cat.name}</Text>
                <Text style={styles.catAmount}>€ {cat.value} ({cat.percentage})</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Costs vs Salaries Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.cardTitle}>Costs vs Salaries</Text>
            <Text style={styles.cardSub}>Monthly expenditure breakdown</Text>
          </View>
        </View>

        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#14B8A6" }]} />
            <Text style={styles.legendText}>Salaries</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#635BFF" }]} />
            <Text style={styles.legendText}>Costs</Text>
          </View>
        </View>

        {/* Scrollable Monthly Visualizer */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.monthlyScroll}>
          <View style={styles.monthlyBarsRow}>
            {MONTHLY_COSTS_VS_SALARIES.map((item, idx) => {
              const isSelected = selectedMonthIdx === idx;
              const maxVal = 3500;
              const salariesH = Math.max(12, (item.salaries / maxVal) * 110);
              const costsH = Math.max(12, (item.costs / maxVal) * 110);

              return (
                <TouchableOpacity
                  key={idx}
                  style={[styles.monthColumn, isSelected && styles.monthColumnSelected]}
                  onPress={() => setSelectedMonthIdx(idx)}
                  activeOpacity={0.7}
                >
                  <View style={styles.barGroup}>
                    <View style={[styles.bar, { height: costsH, backgroundColor: "#635BFF" }]} />
                    <View style={[styles.bar, { height: salariesH, backgroundColor: "#14B8A6" }]} />
                  </View>
                  <Text style={[styles.monthLabel, isSelected && styles.monthLabelSelected]}>
                    {item.month}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {/* Selected Month Callout */}
        <View style={styles.selectedMonthSummary}>
          <Text style={styles.summaryMonthName}>
            {MONTHLY_COSTS_VS_SALARIES[selectedMonthIdx].month} Overview
          </Text>
          <View style={styles.summaryStatsRow}>
            <View style={styles.summaryStat}>
              <Text style={styles.summaryLabel}>Salaries</Text>
              <Text style={[styles.summaryVal, { color: "#14B8A6" }]}>
                € {MONTHLY_COSTS_VS_SALARIES[selectedMonthIdx].salaries}
              </Text>
            </View>
            <View style={styles.summaryStat}>
              <Text style={styles.summaryLabel}>Costs</Text>
              <Text style={[styles.summaryVal, { color: "#635BFF" }]}>
                € {MONTHLY_COSTS_VS_SALARIES[selectedMonthIdx].costs}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Performance Radar Metric Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.cardTitle}>Performance Radar</Text>
            <Text style={styles.cardSub}>Multidimensional KPI comparison</Text>
          </View>

          <View style={styles.toggleRow}>
            {(["Top Stylists", "Locations"] as const).map((t) => {
              const active = radarComparison === t;
              return (
                <TouchableOpacity
                  key={t}
                  style={[styles.toggleBtn, active && styles.toggleBtnActive]}
                  onPress={() => setRadarComparison(t)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.toggleBtnText, active && styles.toggleBtnTextActive]}>
                    {t}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Legend */}
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#635BFF" }]} />
            <Text style={styles.legendText}>{entity1}</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#10B981" }]} />
            <Text style={styles.legendText}>{entity2}</Text>
          </View>
        </View>

        {/* KPI Comparative Bars */}
        <View style={styles.radarMetricsList}>
          {radarData.map((item, idx) => (
            <View key={idx} style={styles.radarMetricItem}>
              <Text style={styles.radarMetricLabel}>{item.label}</Text>
              <View style={styles.radarBarsContainer}>
                {/* Val 1 */}
                <View style={styles.radarBarWrapper}>
                  <View style={[styles.radarBarFill, { width: `${item.val1}%`, backgroundColor: "#635BFF" }]} />
                  <Text style={styles.radarValText}>{item.val1}%</Text>
                </View>
                {/* Val 2 */}
                <View style={styles.radarBarWrapper}>
                  <View style={[styles.radarBarFill, { width: `${item.val2}%`, backgroundColor: "#10B981" }]} />
                  <Text style={styles.radarValText}>{item.val2}%</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Client Status Flow Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.cardTitle}>Client Status Flow</Text>
            <Text style={styles.cardSub}>Journey of 1,000 newly acquired clients over 6 months</Text>
          </View>
        </View>

        {/* Funnel Steps */}
        <View style={styles.flowContainer}>
          {/* Node 1: New Clients */}
          <View style={styles.flowCard}>
            <View style={[styles.flowIconCircle, { backgroundColor: "#EEF2FF" }]}>
              <Ionicons name="people" size={20} color="#635BFF" />
            </View>
            <Text style={styles.flowNodeTitle}>New Clients</Text>
            <Text style={[styles.flowNodeCount, { color: "#635BFF" }]}>1,000</Text>
            <Text style={styles.flowNodeSub}>100% Acquired</Text>
          </View>

          <View style={styles.flowConnector}>
            <Ionicons name="arrow-down" size={18} color="#94A3B8" />
          </View>

          {/* Node 2: Returning & Churned */}
          <View style={styles.flowSplitRow}>
            <View style={[styles.flowCard, { flex: 1, borderColor: "#D1FAE5" }]}>
              <View style={[styles.flowIconCircle, { backgroundColor: "#D1FAE5" }]}>
                <Ionicons name="repeat" size={20} color="#10B981" />
              </View>
              <Text style={styles.flowNodeTitle}>Returning</Text>
              <Text style={[styles.flowNodeCount, { color: "#10B981" }]}>650</Text>
              <Text style={styles.flowNodeSub}>65% Retained</Text>
            </View>

            <View style={[styles.flowCard, { flex: 1, borderColor: "#FEE2E2" }]}>
              <View style={[styles.flowIconCircle, { backgroundColor: "#FEE2E2" }]}>
                <Ionicons name="person-remove" size={20} color="#EF4444" />
              </View>
              <Text style={styles.flowNodeTitle}>Churned</Text>
              <Text style={[styles.flowNodeCount, { color: "#EF4444" }]}>350</Text>
              <Text style={styles.flowNodeSub}>35% Drop-off</Text>
            </View>
          </View>

          <View style={styles.flowConnector}>
            <Ionicons name="arrow-down" size={18} color="#94A3B8" />
          </View>

          {/* Node 3: VIP Status */}
          <View style={[styles.flowCard, { borderColor: "#FEF3C7" }]}>
            <View style={[styles.flowIconCircle, { backgroundColor: "#FEF3C7" }]}>
              <Ionicons name="star" size={20} color="#F59E0B" />
            </View>
            <Text style={styles.flowNodeTitle}>VIP Status</Text>
            <Text style={[styles.flowNodeCount, { color: "#F59E0B" }]}>120</Text>
            <Text style={styles.flowNodeSub}>12% of Total</Text>
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
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 14,
    justifyContent: "space-between",
  },
  statHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  statTitle: {
    flex: 1,
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  statValue: {
    fontSize: 18,
    fontFamily: "Manrope_800ExtraBold",
    color: "#1E293B",
    marginBottom: 4,
  },
  statChange: {
    fontSize: 10,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
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
  paginationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  pageBtn: {
    padding: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
  },
  pageBtnActive: {
    backgroundColor: "#EEF2FF",
    borderColor: "#C7D2FE",
  },
  pageIndicatorText: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#64748B",
  },
  servicesList: {
    gap: 12,
  },
  serviceItem: {
    gap: 4,
  },
  serviceItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  serviceName: {
    fontSize: 12,
    fontFamily: "Manrope_600SemiBold",
    color: "#1E293B",
  },
  serviceVal: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  progressBarTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#F1F5F9",
    overflow: "hidden",
  },
  progressBarFill: {
    height: 8,
    borderRadius: 4,
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
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
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
  monthlyScroll: {
    marginTop: 6,
  },
  monthlyBarsRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-end",
    height: 140,
    paddingBottom: 4,
  },
  monthColumn: {
    alignItems: "center",
    padding: 6,
    borderRadius: 8,
  },
  monthColumnSelected: {
    backgroundColor: "#F1F5F9",
  },
  barGroup: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 3,
    height: 110,
  },
  bar: {
    width: 8,
    borderRadius: 4,
  },
  monthLabel: {
    fontSize: 10,
    fontFamily: "Manrope_600SemiBold",
    color: "#94A3B8",
    marginTop: 6,
  },
  monthLabelSelected: {
    color: "#1E293B",
    fontFamily: "Manrope_700Bold",
  },
  selectedMonthSummary: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 8,
  },
  summaryMonthName: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  summaryStatsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  summaryStat: {
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 10,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
  },
  summaryVal: {
    fontSize: 15,
    fontFamily: "Manrope_800ExtraBold",
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
  radarMetricsList: {
    gap: 10,
  },
  radarMetricItem: {
    gap: 4,
  },
  radarMetricLabel: {
    fontSize: 11,
    fontFamily: "Manrope_600SemiBold",
    color: "#1E293B",
  },
  radarBarsContainer: {
    gap: 4,
  },
  radarBarWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  radarBarFill: {
    height: 6,
    borderRadius: 3,
  },
  radarValText: {
    fontSize: 10,
    fontFamily: "Manrope_700Bold",
    color: "#64748B",
  },
  flowContainer: {
    alignItems: "center",
    gap: 8,
  },
  flowCard: {
    width: "100%",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
    gap: 4,
  },
  flowIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  flowNodeTitle: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  flowNodeCount: {
    fontSize: 18,
    fontFamily: "Manrope_800ExtraBold",
  },
  flowNodeSub: {
    fontSize: 10,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
  },
  flowConnector: {
    paddingVertical: 2,
  },
  flowSplitRow: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
  },
});
