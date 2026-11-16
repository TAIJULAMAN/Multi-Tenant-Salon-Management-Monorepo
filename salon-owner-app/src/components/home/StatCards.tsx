import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";

export interface StatItem {
  id: number;
  title: string;
  value: string;
  change?: string;
  iconName: string;
  iconType: "Ionicons" | "MaterialCommunityIcons" | "Feather";
  iconColor: string;
  iconBgColor: string;
  borderColor: string;
  bgColor: string;
}

export const statCardsData: StatItem[] = [
  {
    id: 1,
    title: "Monthly Processed Sales",
    value: "€ 23,850",
    change: "+12.5% from last month",
    iconName: "briefcase-outline",
    iconType: "Ionicons",
    iconColor: "#635BFF",
    iconBgColor: "#EEF2FF",
    borderColor: "#E0E7FF",
    bgColor: "#F8FAFF",
  },
  {
    id: 2,
    title: "Appointments",
    value: "23",
    change: "+18.5% from last month",
    iconName: "calendar-outline",
    iconType: "Ionicons",
    iconColor: "#D97706",
    iconBgColor: "#FEF3C7",
    borderColor: "#FDE68A",
    bgColor: "#FFFDF7",
  },
  {
    id: 3,
    title: "Clients",
    value: "44",
    change: "+10% from last month",
    iconName: "person-outline",
    iconType: "Ionicons",
    iconColor: "#0D9488",
    iconBgColor: "#CCFBF1",
    borderColor: "#99F6E4",
    bgColor: "#F4FDFA",
  },
  {
    id: 4,
    title: "Team Members",
    value: "10",
    change: "Active on floor",
    iconName: "people-outline",
    iconType: "Ionicons",
    iconColor: "#10B981",
    iconBgColor: "#D1FAE5",
    borderColor: "#A7F3D0",
    bgColor: "#F4FDF8",
  },
  {
    id: 5,
    title: "Daily Occupancy Rate",
    value: "78%",
    change: "+5% from last week",
    iconName: "pie-chart-outline",
    iconType: "Ionicons",
    iconColor: "#8B5CF6",
    iconBgColor: "#EDE9FE",
    borderColor: "#DDD6FE",
    bgColor: "#FAF8FF",
  },
  {
    id: 6,
    title: "Average Ticket Size",
    value: "€ 85.50",
    change: "+€ 4.20 from last week",
    iconName: "receipt-outline",
    iconType: "Ionicons",
    iconColor: "#EC4899",
    iconBgColor: "#FCE7F3",
    borderColor: "#FBCFE8",
    bgColor: "#FFF7FA",
  },
  {
    id: 7,
    title: "Total Revenue (Today)",
    value: "€ 2,450",
    change: "+12% from yesterday",
    iconName: "cash-outline",
    iconType: "Ionicons",
    iconColor: "#3B82F6",
    iconBgColor: "#DBEAFE",
    borderColor: "#BFDBFE",
    bgColor: "#F8FAFF",
  },
  {
    id: 8,
    title: "Walk-ins vs Pre-booked",
    value: "15% / 85%",
    change: "Healthy ratio",
    iconName: "swap-horizontal-outline",
    iconType: "Ionicons",
    iconColor: "#F97316",
    iconBgColor: "#FFEDD5",
    borderColor: "#FED7AA",
    bgColor: "#FFFAF5",
  },
];

export default function StatCards() {
  const renderIcon = (stat: StatItem) => {
    if (stat.iconType === "Feather") {
      return <Feather name={stat.iconName as any} size={20} color={stat.iconColor} />;
    }
    if (stat.iconType === "MaterialCommunityIcons") {
      return (
        <MaterialCommunityIcons
          name={stat.iconName as any}
          size={20}
          color={stat.iconColor}
        />
      );
    }
    return <Ionicons name={stat.iconName as any} size={20} color={stat.iconColor} />;
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {statCardsData.map((stat) => (
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
                {renderIcon(stat)}
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
    paddingHorizontal: 16,
    gap: 12,
  },
  card: {
    width: 200,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    justifyContent: "space-between",
    minHeight: 135,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  titleText: {
    flex: 1,
    fontSize: 12,
    fontFamily: "Manrope_600SemiBold",
    color: "#334155",
    lineHeight: 16,
  },
  bottomSection: {
    marginTop: "auto",
  },
  valueText: {
    fontSize: 22,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
    letterSpacing: -0.5,
  },
  changeText: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    marginTop: 2,
  },
});
