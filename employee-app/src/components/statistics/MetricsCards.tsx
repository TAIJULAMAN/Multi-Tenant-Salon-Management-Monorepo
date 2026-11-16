import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, fonts } from "@/constants/figmaTheme";
import { MetricRow } from "./statisticsData";
import { DropdownPill, StatsCard, StatusBadge } from "./StatsUI";
import { DropdownAnchor } from "./StatsDropdown";

function Rows({ rows }: { rows: MetricRow[] }) {
  return (
    <View style={styles.rows}>
      {rows.map((r) => (
        <View key={r.label} style={styles.row}>
          <Text style={styles.rowLabel}>{r.label}</Text>
          <Text style={styles.rowValue}>{r.value}</Text>
        </View>
      ))}
    </View>
  );
}

export function PerformanceMetricsCard({
  periodLabel,
  rows,
  goalAchieved,
  onOpenPeriod,
}: {
  periodLabel: string;
  rows: MetricRow[];
  goalAchieved: boolean;
  onOpenPeriod: (anchor: DropdownAnchor) => void;
}) {
  return (
    <StatsCard bordered style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.cardTitle}>Performance Metrics (Last Month)</Text>
        <DropdownPill label={periodLabel} onOpen={onOpenPeriod} />
      </View>
      <Rows rows={rows} />
      <View style={styles.divider} />
      <View style={styles.row}>
        <Text style={styles.rowLabel}>Performance Status</Text>
        <StatusBadge
          label={goalAchieved ? "Goal Achieved" : "Below Goal"}
          variant={goalAchieved ? "goal" : "danger"}
        />
      </View>
    </StatsCard>
  );
}

export function OperationStatsCard({
  periodLabel,
  rows,
  performanceStatus,
  onOpenPeriod,
}: {
  periodLabel: string;
  rows: MetricRow[];
  performanceStatus: string;
  onOpenPeriod: (anchor: DropdownAnchor) => void;
}) {
  return (
    <StatsCard bordered style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.cardTitle}>Operation Statistics</Text>
        <DropdownPill label={periodLabel} onOpen={onOpenPeriod} />
      </View>
      <Rows rows={rows} />
      <View style={styles.divider} />
      <View style={styles.row}>
        <Text style={styles.rowLabel}>Performance Status</Text>
        <Text style={styles.rowValue}>{performanceStatus}</Text>
      </View>
    </StatsCard>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 24,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 16,
  },
  cardTitle: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
    fontFamily: fonts.medium,
    color: colors.text,
  },
  rows: {
    gap: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    gap: 12,
  },
  rowLabel: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
    fontFamily: fonts.medium,
    color: colors.text,
  },
  rowValue: {
    fontSize: 18,
    lineHeight: 25,
    fontFamily: fonts.semibold,
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginTop: 16,
    marginBottom: 16,
  },
});
