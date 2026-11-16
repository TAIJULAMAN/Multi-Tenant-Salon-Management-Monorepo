import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import GradientFill from "@/components/GradientFill";
import { colors, fonts, radius } from "@/constants/figmaTheme";
import { dashboardStats, type DashboardStat } from "./dashboardData";

function StatCard({ stat }: { stat: DashboardStat }) {
  return (
    <View style={styles.card}>
      <GradientFill from={stat.gradient[0]} to={stat.gradient[1]} />
      <View style={styles.topRow}>
        <View style={[styles.iconBox, { backgroundColor: stat.iconBg }]}>
          <Ionicons name={stat.iconName} size={20} color={colors.white} />
        </View>
        <Text style={styles.titleText} numberOfLines={3}>
          {stat.title}
        </Text>
      </View>

      <View style={styles.bottomSection}>
        <View style={styles.valueRow}>
          <Text style={styles.valueText}>{stat.value}</Text>
          {stat.badge ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText} numberOfLines={1}>
                {stat.badge}
              </Text>
            </View>
          ) : null}
        </View>
        {stat.change ? (
          <Text style={styles.changeText} numberOfLines={1}>
            {stat.change}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

export default function StatCards() {
  return (
    <View style={styles.grid}>
      {dashboardStats.map((stat) => (
        <StatCard key={stat.id} stat={stat} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  card: {
    width: "48.4%",
    minHeight: 150,
    borderRadius: radius.card,
    padding: 14,
    overflow: "hidden",
  },
  topRow: {
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
  titleText: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 13,
    lineHeight: 18,
    color: colors.text,
  },
  bottomSection: {
    marginTop: "auto",
    paddingTop: 14,
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 6,
  },
  valueText: {
    fontFamily: fonts.semibold,
    fontSize: 26,
    lineHeight: 34,
    color: colors.text,
  },
  badge: {
    backgroundColor: colors.green,
    paddingHorizontal: 8,
    height: 24,
    justifyContent: "center",
    borderRadius: radius.md,
  },
  badgeText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    lineHeight: 16,
    color: colors.white,
  },
  changeText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    lineHeight: 16,
    color: colors.text,
    marginTop: 6,
  },
});
