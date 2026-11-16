import React from "react";
import { View, Text, StyleSheet } from "react-native";
import GradientFill from "@/components/GradientFill";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, radius } from "@/constants/figmaTheme";
import { PeriodSummary, formatEuro } from "./statisticsData";
import { StatusBadge } from "./StatsUI";

/** Three KPI tiles (Figma: tinted top → near-white bottom gradient, r=12, 40px rounded icon). */
export default function KpiCards({ summary }: { summary: PeriodSummary }) {
  const goalAchieved = summary.performance >= 100;

  const cards = [
    {
      id: "turnover",
      title: "Monthly Turnover",
      value: formatEuro(summary.monthlyTurnover),
      icon: "wallet-outline" as const,
      iconBg: colors.primary,
      from: "#EEEDFF",
      to: "#FAF9FF",
    },
    {
      id: "threshold",
      title: "Target Threshold",
      value: formatEuro(summary.targetThreshold),
      icon: "cash-outline" as const,
      iconBg: "#F9C309",
      from: "#FEF8E2",
      to: "#FEFEF6",
    },
    {
      id: "performance",
      title: "Performance",
      value: `${summary.performance}%`,
      icon: "bar-chart-outline" as const,
      iconBg: colors.teal,
      from: "#E3F9F7",
      to: "#F7FDFD",
    },
  ];

  return (
    <View style={styles.container}>
      {cards.map((card) => (
        <View key={card.id} style={styles.card}>
          <GradientFill from={card.from} to={card.to} />
          <View style={styles.headerRow}>
            <View style={[styles.iconBox, { backgroundColor: card.iconBg }]}>
              <Ionicons name={card.icon} size={22} color={colors.white} />
            </View>
            <Text style={styles.cardTitle}>{card.title}</Text>
          </View>
          <View style={styles.valueRow}>
            <Text style={styles.value}>{card.value}</Text>
            {card.id === "performance" && (
              <StatusBadge
                label={goalAchieved ? "Goal Achieved" : "Below Goal"}
                variant={goalAchieved ? "goal" : "danger"}
              />
            )}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  card: {
    borderRadius: radius.card,
    overflow: "hidden",
    padding: 24,
    gap: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.medium,
    color: colors.text,
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  value: {
    fontSize: 28,
    lineHeight: 34,
    fontFamily: fonts.semibold,
    color: colors.text,
  },
});
