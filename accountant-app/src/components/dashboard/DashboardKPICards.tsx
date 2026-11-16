import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { KPI_DATA_BY_SALON } from "@/data/dashboardData";

interface DashboardKPICardsProps {
  selectedSalon: string;
}

export default function DashboardKPICards({ selectedSalon }: DashboardKPICardsProps) {
  const router = useRouter();
  const kpis = KPI_DATA_BY_SALON[selectedSalon] || KPI_DATA_BY_SALON["All Salons"];

  const handleCardPress = (title: string) => {
    if (title.includes("Salaries")) {
      router.push("/(drawer)/(tabs)/salaries" as any);
    } else if (title.includes("Taxes")) {
      router.push("/(drawer)/(tabs)/taxes" as any);
    } else if (title.includes("Deadlines") || title.includes("Warnings")) {
      router.push("/(drawer)/(tabs)/documents" as any);
    }
  };

  return (
    <View style={styles.container}>
      {kpis.map((card, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.kpiCard, { backgroundColor: card.bgColor }]}
          onPress={() => handleCardPress(card.title)}
          activeOpacity={0.8}
        >
          {/* Top Row: Icon + Title */}
          <View style={styles.topRow}>
            <View style={[styles.iconWrap, { backgroundColor: card.iconBg }]}>
              <Ionicons name={card.icon as any} size={16} color={card.iconColor} />
            </View>
            <Text style={styles.cardTitle} numberOfLines={2}>
              {card.title}
            </Text>
          </View>

          {/* Metric Value & Subtext */}
          <View style={styles.metricValueWrap}>
            <Text style={styles.cardVal}>{card.value}</Text>
            <Text style={styles.cardSubtext} numberOfLines={1}>
              {card.subtext}
            </Text>
            {card.change ? (
              <Text style={styles.changeText} numberOfLines={1}>
                {card.change}
              </Text>
            ) : null}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
  },
  kpiCard: {
    width: "48%",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.03)",
    justifyContent: "space-between",
    minHeight: 125,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#334155",
    flex: 1,
    lineHeight: 14,
  },
  metricValueWrap: {
    marginTop: 12,
  },
  cardVal: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1E293B",
    letterSpacing: -0.5,
  },
  cardSubtext: {
    fontSize: 10,
    fontWeight: "600",
    color: "#475569",
    marginTop: 3,
  },
  changeText: {
    fontSize: 10,
    fontWeight: "500",
    color: "#64748B",
    marginTop: 1,
  },
});
