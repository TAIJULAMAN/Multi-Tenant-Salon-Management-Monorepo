import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { DASHBOARD_SALONS } from "@/data/dashboardData";

interface DashboardSalonOverviewProps {
  selectedSalon: string;
  onSelectSalon: (salonName: string) => void;
}

export default function DashboardSalonOverview({
  selectedSalon,
  onSelectSalon,
}: DashboardSalonOverviewProps) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Salon Overview</Text>
        <TouchableOpacity
          style={styles.viewAllButton}
          onPress={() => router.push("/salons" as any)}
          activeOpacity={0.7}
        >
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      {/* Salons List */}
      <View style={styles.salonList}>
        {DASHBOARD_SALONS.map((salon, index) => {
          const isOverBudget = salon.status === "Over Budget";
          const isSelected = selectedSalon === salon.name;

          return (
            <TouchableOpacity
              key={`${salon.id}-${index}`}
              style={[
                styles.salonCard,
                isSelected && styles.salonCardSelected,
              ]}
              onPress={() => onSelectSalon(salon.name)}
              activeOpacity={0.8}
            >
              {/* Salon Brand Row: Store Icon + Name + Status Badge */}
              <View style={styles.cardMainRow}>
                {/* Left: Store Icon & Name */}
                <View style={styles.salonBrand}>
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: salon.iconBg },
                    ]}
                  >
                    <Ionicons
                      name="storefront-outline"
                      size={20}
                      color={salon.iconColor}
                    />
                  </View>
                  <Text style={styles.salonName} numberOfLines={1}>
                    {salon.name}
                  </Text>
                </View>

                {/* Right: Status Badge */}
                <View
                  style={[
                    styles.statusBadge,
                    isOverBudget ? styles.badgeOverBudget : styles.badgeOnTrack,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      isOverBudget ? styles.textOverBudget : styles.textOnTrack,
                    ]}
                  >
                    {salon.status}
                  </Text>
                </View>
              </View>

              {/* Stats Columns Row */}
              <View style={styles.statsRow}>
                {/* Column 1: Pending Salaries */}
                <View style={styles.statCol}>
                  <Text style={styles.statNumber}>{salon.pendingSalaries}</Text>
                  <Text style={styles.statLabel}>Pending Salaries</Text>
                </View>

                <View style={styles.statDivider} />

                {/* Column 2: Pending Taxes */}
                <View style={styles.statCol}>
                  <Text style={styles.statNumber}>{salon.pendingTaxes}</Text>
                  <Text style={styles.statLabel}>Pending Taxes</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
    letterSpacing: -0.2,
  },
  viewAllButton: {
    borderWidth: 1,
    borderColor: "#635BFF",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: "transparent",
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#635BFF",
  },
  salonList: {
    gap: 12,
  },
  salonCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  salonCardSelected: {
    borderColor: "#635BFF",
    backgroundColor: "#FDFCFF",
  },
  cardMainRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  salonBrand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
    marginRight: 8,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  salonName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E293B",
    letterSpacing: -0.2,
    flexShrink: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeOverBudget: {
    backgroundColor: "#FFE8EC",
  },
  badgeOnTrack: {
    backgroundColor: "#E2F9F0",
  },
  statusText: {
    fontSize: 10,
    fontWeight: "700",
  },
  textOverBudget: {
    color: "#FF4B72",
  },
  textOnTrack: {
    color: "#20C997",
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  statCol: {
    flex: 1,
    alignItems: "center",
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: "#E2E8F0",
  },
  statNumber: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E293B",
  },
  statLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#94A3B8",
    marginTop: 2,
  },
});
