import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import ExportReportModal from "./ExportReportModal";
import {
  ExportDataButton,
  PeriodDropdown,
  dashboardCardStyle as card,
} from "./DashboardControls";
import { loyalCustomers, topServices } from "./dashboardData";
import { colors, fonts, radius } from "@/constants/figmaTheme";

const PERIODS = ["Weekly", "Monthly", "Yearly"] as const;
type RankPeriod = (typeof PERIODS)[number];

function RankBadge({ rank }: { rank: number }) {
  return (
    <View style={styles.rankBadge}>
      <Text style={styles.rankText}>{rank}</Text>
    </View>
  );
}

export function TopServicesCard() {
  const [period, setPeriod] = useState<RankPeriod>("Weekly");
  const [isExportOpen, setIsExportOpen] = useState(false);

  return (
    <View style={card.card}>
      <View style={card.headerRow}>
        <View style={card.titleBlock}>
          <Text style={card.title}>Top 3 Services</Text>
        </View>
        <View style={card.actionsRow}>
          <PeriodDropdown
            value={period}
            options={PERIODS}
            onChange={setPeriod}
          />
          <ExportDataButton onPress={() => setIsExportOpen(true)} />
        </View>
      </View>

      <View style={styles.list}>
        {topServices[period].map((s, i) => (
          <View key={s.id} style={styles.serviceRow}>
            <RankBadge rank={i + 1} />
            <Text style={styles.serviceName} numberOfLines={1}>
              {s.name}
            </Text>
            <View style={styles.metric}>
              <Text style={styles.metricValue}>{s.appointments}</Text>
              <Text style={styles.metricLabel}>Appointments</Text>
            </View>
          </View>
        ))}
      </View>

      <ExportReportModal
        visible={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        defaultTitle="Top Services Report"
      />
    </View>
  );
}

export function LoyalCustomersCard() {
  const [period, setPeriod] = useState<RankPeriod>("Weekly");
  const [isExportOpen, setIsExportOpen] = useState(false);

  return (
    <View style={card.card}>
      <View style={card.headerRow}>
        <View style={card.titleBlock}>
          <Text style={card.title}>Most Loyal Customers</Text>
        </View>
        <View style={card.actionsRow}>
          <PeriodDropdown
            value={period}
            options={PERIODS}
            onChange={setPeriod}
          />
          <ExportDataButton onPress={() => setIsExportOpen(true)} />
        </View>
      </View>

      <View style={styles.list}>
        {loyalCustomers[period].map((c, i) => (
          <View key={c.id} style={styles.customerRow}>
            <View style={styles.customerTop}>
              <RankBadge rank={i + 1} />
              <View style={styles.flex}>
                <Text style={styles.customerName} numberOfLines={1}>
                  {c.name}
                </Text>
                <Text style={styles.lastVisit} numberOfLines={1}>
                  Last Visit: {c.lastVisit}
                </Text>
              </View>
            </View>
            <View style={styles.customerMetrics}>
              <View style={styles.metric}>
                <Text style={styles.metricValue}>{c.appointments}</Text>
                <Text style={styles.metricLabel}>Appointments</Text>
              </View>
              <View style={styles.metric}>
                <Text style={[styles.metricValue, styles.spentValue]}>
                  {c.totalSpent}
                </Text>
                <Text style={styles.metricLabel}>Total Spent</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      <ExportReportModal
        visible={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        defaultTitle="Loyal Customers Report"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  list: {
    gap: 16,
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  rankText: {
    fontFamily: fonts.medium,
    fontSize: 15,
    lineHeight: 20,
    color: colors.white,
  },
  serviceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    minHeight: 97,
    backgroundColor: "#F1F2FE",
    borderRadius: radius.card,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  serviceName: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 15,
    lineHeight: 20,
    color: colors.text,
  },
  metric: {
    alignItems: "center",
  },
  metricValue: {
    fontFamily: fonts.semibold,
    fontSize: 22,
    lineHeight: 26,
    color: colors.text,
  },
  metricLabel: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 19,
    color: colors.textSecondary,
  },
  customerRow: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  customerTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  customerName: {
    fontFamily: fonts.medium,
    fontSize: 16,
    lineHeight: 22,
    color: colors.text,
  },
  lastVisit: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 19,
    color: colors.textSecondary,
  },
  customerMetrics: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 20,
  },
  spentValue: {
    color: colors.green,
  },
});
