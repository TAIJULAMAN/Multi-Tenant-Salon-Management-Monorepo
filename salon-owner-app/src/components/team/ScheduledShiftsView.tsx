import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Avatar from "@/components/Avatar";
import { MatrixScheduledShift } from "./teamData";

export interface ScheduledShiftsViewProps {
  matrixShifts: MatrixScheduledShift[];
  onExport: () => void;
  onAdd: (position?: { top: number; right: number }) => void;
  onEditShift: (
    member: MatrixScheduledShift,
    dayKey: "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat",
    currentVal?: string | null
  ) => void;
}

const DAYS: {
  key: "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat";
  dayLabel: string;
  dateNum: string;
  fullName: string;
}[] = [
  { key: "sun", dayLabel: "Sun", dateNum: "11", fullName: "Sunday, 11 Aug" },
  { key: "mon", dayLabel: "Mon", dateNum: "12", fullName: "Monday, 12 Aug" },
  { key: "tue", dayLabel: "Tue", dateNum: "13", fullName: "Tuesday, 13 Aug" },
  { key: "wed", dayLabel: "Wed", dateNum: "14", fullName: "Wednesday, 14 Aug" },
  { key: "thu", dayLabel: "Thu", dateNum: "15", fullName: "Thursday, 15 Aug" },
  { key: "fri", dayLabel: "Fri", dateNum: "16", fullName: "Friday, 16 Aug" },
  { key: "sat", dayLabel: "Sat", dateNum: "17", fullName: "Saturday, 17 Aug" },
];

const WEEKS = [
  "August 4 – August 10",
  "August 11 – August 17",
  "August 18 – August 24",
];

export default function ScheduledShiftsView({
  matrixShifts,
  onExport,
  onAdd,
  onEditShift,
}: ScheduledShiftsViewProps) {
  const addBtnRef = useRef<any>(null);
  const [weekIndex, setWeekIndex] = useState(1);

  const handleAddPress = () => {
    if (addBtnRef.current?.measureInWindow) {
      addBtnRef.current.measureInWindow(
        (_x: number, y: number, _width: number, height: number) => {
          onAdd({ top: y + height + 6, right: 16 });
        }
      );
    } else {
      onAdd({ top: 240, right: 16 });
    }
  };
  const [selectedDayKey, setSelectedDayKey] = useState<
    "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat"
  >("sun");

  const currentDayInfo = DAYS.find((d) => d.key === selectedDayKey) || DAYS[0];

  // Count scheduled staff for selected day
  const workingCount = matrixShifts.filter((m) => {
    const shift = m.shifts[selectedDayKey];
    return shift && shift !== "Closed";
  }).length;

  return (
    <View style={styles.cardContainer}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <Text style={styles.cardTitle}>Scheduled Shifts</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.exportBtn}
            onPress={onExport}
            activeOpacity={0.8}
          >
            <Ionicons name="download-outline" size={13} color="#635BFF" />
            <Text style={styles.exportBtnText}>Export</Text>
          </TouchableOpacity>

          <TouchableOpacity
            ref={addBtnRef}
            style={styles.addBtn}
            onPress={handleAddPress}
            activeOpacity={0.85}
          >
            <Text style={styles.addBtnText}>Add</Text>
            <Ionicons name="chevron-down" size={12} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Week Navigator */}
      <View style={styles.weekNavRow}>
        <TouchableOpacity
          onPress={() => setWeekIndex((prev) => Math.max(0, prev - 1))}
          disabled={weekIndex === 0}
          style={[styles.weekNavArrow, weekIndex === 0 && { opacity: 0.3 }]}
        >
          <Ionicons name="chevron-back" size={16} color="#475569" />
        </TouchableOpacity>

        <Text style={styles.weekNavText}>{WEEKS[weekIndex]}</Text>

        <TouchableOpacity
          onPress={() => setWeekIndex((prev) => Math.min(WEEKS.length - 1, prev + 1))}
          disabled={weekIndex === WEEKS.length - 1}
          style={[styles.weekNavArrow, weekIndex === WEEKS.length - 1 && { opacity: 0.3 }]}
        >
          <Ionicons name="chevron-forward" size={16} color="#475569" />
        </TouchableOpacity>
      </View>

      {/* Horizontal Day Chips Selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.daysScrollList}
      >
        {DAYS.map((d) => {
          const isSelected = selectedDayKey === d.key;
          return (
            <TouchableOpacity
              key={d.key}
              style={[styles.dayChip, isSelected && styles.dayChipActive]}
              onPress={() => setSelectedDayKey(d.key)}
              activeOpacity={0.75}
            >
              <Text style={[styles.dayChipLabel, isSelected && styles.dayChipLabelActive]}>
                {d.dayLabel}
              </Text>
              <Text style={[styles.dayChipNum, isSelected && styles.dayChipNumActive]}>
                {d.dateNum}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Active Day Banner */}
      <View style={styles.dayBanner}>
        <View style={styles.dayBannerLeft}>
          <Ionicons name="time-outline" size={15} color="#635BFF" />
          <Text style={styles.dayBannerTitle}>{currentDayInfo.fullName}</Text>
        </View>
        <View style={styles.dayBannerBadge}>
          <Text style={styles.dayBannerBadgeText}>{workingCount} Scheduled</Text>
        </View>
      </View>

      {/* Staff Cards List for Selected Day */}
      <View style={styles.cardsList}>
        {matrixShifts.map((member) => {
          const shiftVal = member.shifts[selectedDayKey];
          const isClosed = shiftVal === "Closed";
          const isOff = !shiftVal;

          return (
            <View key={member.id} style={styles.dayStaffCard}>
              {/* Staff Info */}
              <View style={styles.dayStaffLeft}>
                <Avatar name={member.name} uri={member.avatarUrl} size={40} />
                <View style={{ marginLeft: 10, flex: 1 }}>
                  <Text style={styles.staffName} numberOfLines={1}>
                    {member.name}
                  </Text>
                  <Text style={styles.staffWeeklyTotal}>
                    Weekly: {member.weeklyTotal}
                  </Text>
                </View>
              </View>

              {/* Shift Badge & Edit Action */}
              <View style={styles.dayStaffRight}>
                {isClosed ? (
                  <View style={styles.closedPill}>
                    <Text style={styles.closedPillText}>Salon Closed</Text>
                  </View>
                ) : isOff ? (
                  <TouchableOpacity
                    style={styles.offPill}
                    onPress={() => onEditShift(member, selectedDayKey, "09:00 - 17:00")}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.offPillText}>Day Off</Text>
                    <Ionicons name="add" size={12} color="#94A3B8" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.shiftTimeBadge}
                    onPress={() => onEditShift(member, selectedDayKey, shiftVal)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="time" size={12} color="#635BFF" />
                    <Text style={styles.shiftTimeBadgeText}>{shiftVal}</Text>
                    <Ionicons name="pencil" size={11} color="#635BFF" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 17,
    fontFamily: "Manrope_700Bold",
    color: "#0F172A",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  exportBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  exportBtnText: {
    fontSize: 12,
    fontFamily: "Manrope_600SemiBold",
    color: "#635BFF",
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#635BFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addBtnText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },

  // Week Nav
  weekNavRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 14,
  },
  weekNavArrow: {
    padding: 4,
  },
  weekNavText: {
    fontSize: 13,
    fontFamily: "Manrope_600SemiBold",
    color: "#334155",
  },

  // Days Scroll
  daysScrollList: {
    flexDirection: "row",
    gap: 8,
    paddingBottom: 12,
  },
  dayChip: {
    alignItems: "center",
    justifyContent: "center",
    width: 48,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  dayChipActive: {
    backgroundColor: "#635BFF",
    borderColor: "#635BFF",
  },
  dayChipLabel: {
    fontSize: 11,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
    marginBottom: 2,
  },
  dayChipLabelActive: {
    color: "#E0E7FF",
  },
  dayChipNum: {
    fontSize: 14,
    fontFamily: "Manrope_800ExtraBold",
    color: "#1E293B",
  },
  dayChipNumActive: {
    color: "#FFFFFF",
  },

  // Day Banner
  dayBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    marginBottom: 8,
  },
  dayBannerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dayBannerTitle: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  dayBannerBadge: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  dayBannerBadgeText: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },

  // Cards List
  cardsList: {
    gap: 8,
  },
  dayStaffCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  dayStaffLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  staffName: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#0F172A",
  },
  staffWeeklyTotal: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    marginTop: 1,
  },
  dayStaffRight: {
    alignItems: "flex-end",
  },
  shiftTimeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#EEF2FF",
    borderWidth: 1,
    borderColor: "#C7D2FE",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  shiftTimeBadgeText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#4338CA",
  },
  closedPill: {
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderStyle: "dashed",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  closedPillText: {
    fontSize: 11,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  offPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
  },
  offPillText: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
  },
});
