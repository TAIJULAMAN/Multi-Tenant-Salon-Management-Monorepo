import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export interface TeamStatCardsProps {
  membersCount?: number;
}

export default function TeamStatCards({ membersCount }: TeamStatCardsProps) {
  const teamStatCardsData = [
    {
      id: 1,
      title: "Revenue per Employee",
      value: "€ 3,450",
      change: "+8% from last month",
      iconName: "trending-up-outline",
      iconColor: "#3B82F6",
      iconBgColor: "#DBEAFE",
      borderColor: "#BFDBFE",
      bgColor: "#F8FAFF",
    },
    {
      id: 2,
      title: "Staff Utilization",
      value: "82%",
      change: "Optimal range",
      iconName: "time-outline",
      iconColor: "#F59E0B",
      iconBgColor: "#FEF3C7",
      borderColor: "#FDE68A",
      bgColor: "#FFFDF7",
    },
    {
      id: 3,
      title: "Commissions Pending",
      value: "€ 1,240",
      change: "To be paid this week",
      iconName: "card-outline",
      iconColor: "#8B5CF6",
      iconBgColor: "#EDE9FE",
      borderColor: "#DDD6FE",
      bgColor: "#FAF8FF",
    },
    {
      id: 4,
      title: "Active Team Members",
      value: membersCount !== undefined ? String(membersCount) : "10",
      change: "All shifts covered",
      iconName: "people-outline",
      iconColor: "#10B981",
      iconBgColor: "#D1FAE5",
      borderColor: "#A7F3D0",
      bgColor: "#F4FDF8",
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {teamStatCardsData.map((stat) => (
          <View
            key={stat.id}
            style={[
              styles.card,
              { backgroundColor: stat.bgColor, borderColor: stat.borderColor },
            ]}
          >
            <View style={styles.topRow}>
              <View
                style={[styles.iconCircle, { backgroundColor: stat.iconBgColor }]}
              >
                <Ionicons
                  name={stat.iconName as any}
                  size={20}
                  color={stat.iconColor}
                />
              </View>
              <Text style={styles.titleText} numberOfLines={2}>
                {stat.title}
              </Text>
            </View>

            <View style={styles.bottomSection}>
              <Text style={styles.valueText}>{stat.value}</Text>
              {stat.change ? (
                <Text style={styles.changeText} numberOfLines={1}>
                  {stat.change}
                </Text>
              ) : null}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  scrollContent: {
    gap: 12,
    paddingRight: 4,
  },
  card: {
    width: 160,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    justifyContent: "space-between",
    minHeight: 115,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  titleText: {
    fontSize: 12,
    fontFamily: "Manrope_600SemiBold",
    color: "#475569",
    flex: 1,
  },
  bottomSection: {
    marginTop: 10,
  },
  valueText: {
    fontSize: 18,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  changeText: {
    fontSize: 10,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    marginTop: 2,
  },
});
