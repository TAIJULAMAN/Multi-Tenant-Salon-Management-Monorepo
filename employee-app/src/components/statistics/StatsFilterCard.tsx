import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, radius, typography } from "@/constants/figmaTheme";
import { DropdownPill, StatsCard } from "./StatsUI";
import { DropdownAnchor } from "./StatsDropdown";

interface StatsFilterCardProps {
  month: string;
  year: string;
  customRange: string | null;
  onOpenMonth: (anchor: DropdownAnchor) => void;
  onOpenYear: (anchor: DropdownAnchor) => void;
  onPressCustomRange: () => void;
  onExport: () => void;
}

/** Figma "title" card: Statistics + Export Data, Period (month / year) and Custom Range. */
export default function StatsFilterCard({
  month,
  year,
  customRange,
  onOpenMonth,
  onOpenYear,
  onPressCustomRange,
  onExport,
}: StatsFilterCardProps) {
  return (
    <StatsCard>
      <View style={styles.titleRow}>
        <Text style={styles.title}>Statistics</Text>
        <TouchableOpacity style={styles.exportBtn} onPress={onExport} activeOpacity={0.8}>
          <Ionicons name="download-outline" size={18} color={colors.primary} />
          <Text style={styles.exportText}>Export Data</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filtersRow}>
        <View style={styles.periodGroup}>
          <Text style={styles.filterLabel}>Period</Text>
          <View style={styles.periodPills}>
            <DropdownPill label={month} onOpen={onOpenMonth} style={{ flex: 150 }} />
            <DropdownPill label={year} onOpen={onOpenYear} style={{ flex: 85 }} />
          </View>
        </View>

        <View style={styles.customGroup}>
          <Text style={styles.filterLabel}>Custom Range</Text>
          <DropdownPill
            label={customRange ?? "Select dates"}
            onOpen={onPressCustomRange}
            icon="calendar-clear-outline"
          />
        </View>
      </View>
    </StatsCard>
  );
}

const styles = StyleSheet.create({
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  title: {
    ...typography.sectionTitle,
    fontFamily: fonts.semibold,
  },
  exportBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 16,
    height: 44,
    borderRadius: radius.md,
  },
  exportText: {
    ...typography.button,
    color: colors.primary,
  },
  filtersRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: 16,
    rowGap: 12,
  },
  periodGroup: {
    flexGrow: 1,
    flexBasis: 220,
  },
  periodPills: {
    flexDirection: "row",
    gap: 8,
  },
  customGroup: {
    flexGrow: 1,
    flexBasis: 150,
  },
  filterLabel: {
    ...typography.caption,
    marginBottom: 8,
  },
});
