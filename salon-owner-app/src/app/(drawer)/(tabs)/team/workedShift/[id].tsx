import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Avatar from "@/components/Avatar";
import AddWorkedShiftModal from "@/components/team/modals/AddWorkedShiftModal";
import EditWorkedShiftModal from "@/components/team/modals/EditWorkedShiftModal";

export interface DailyShiftItem {
  id: string;
  date: string;
  dayOfWeek: string;
  shiftsCount: number;
  timeIn: string;
  timeOut: string;
  hoursWorked: string;
  dailyTotal: string;
}

const INITIAL_DAILY_SHIFTS: DailyShiftItem[] = [
  {
    id: "ds-1",
    date: "Dec 01, 2024",
    dayOfWeek: "Sunday",
    shiftsCount: 1,
    timeIn: "09:00",
    timeOut: "18:00",
    hoursWorked: "8h",
    dailyTotal: "8h",
  },
  {
    id: "ds-2",
    date: "Dec 01, 2024",
    dayOfWeek: "Monday",
    shiftsCount: 1,
    timeIn: "09:00",
    timeOut: "18:00",
    hoursWorked: "8h",
    dailyTotal: "8h",
  },
  {
    id: "ds-3",
    date: "Dec 01, 2024",
    dayOfWeek: "Tuesday",
    shiftsCount: 1,
    timeIn: "09:00",
    timeOut: "18:00",
    hoursWorked: "8h",
    dailyTotal: "8h",
  },
];

export default function MemberWorkedShiftsDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  const memberName = (params.name as string) || "Maria Fernandez";
  const memberAvatar = (params.avatarUrl as string) || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80";
  const memberEmail = (params.email as string) || `${memberName.toLowerCase().replace(/\s+/g, "")}@gmail.com`;
  const initialHours = (params.hours as string) || "165h";
  const initialDays = (params.daysWorked as string) || "21";
  const initialAvg = (params.avgHoursDay as string) || "7.9h";

  // Filter States
  const [selectedMonth, setSelectedMonth] = useState("December");
  const [selectedYear, setSelectedYear] = useState("2024");
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);

  // Daily Shifts List state
  const [dailyShifts, setDailyShifts] = useState<DailyShiftItem[]>(INITIAL_DAILY_SHIFTS);

  // Modals state
  const [isAddShiftOpen, setIsAddShiftOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<DailyShiftItem | null>(null);

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const years = ["2023", "2024", "2025"];

  const handleDeleteShift = (id: string, day: string) => {
    Alert.alert(
      "Delete Shift",
      `Are you sure you want to remove the shift for ${day}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setDailyShifts((prev) => prev.filter((s) => s.id !== id));
          },
        },
      ]
    );
  };

  const handleAddShiftSave = (data: { date: string; timeIn: string; timeOut: string }) => {
    const newShift: DailyShiftItem = {
      id: `ds-${Date.now()}`,
      date: data.date || "Dec 04, 2024",
      dayOfWeek: "Wednesday",
      shiftsCount: 1,
      timeIn: data.timeIn || "09:00",
      timeOut: data.timeOut || "18:00",
      hoursWorked: "8h",
      dailyTotal: "8h",
    };
    setDailyShifts((prev) => [newShift, ...prev]);
  };

  const handleEditShiftSave = (date: string, clockIn: string, clockOut: string) => {
    if (editingShift) {
      setDailyShifts((prev) =>
        prev.map((s) =>
          s.id === editingShift.id
            ? { ...s, date, timeIn: clockIn, timeOut: clockOut }
            : s
        )
      );
      setEditingShift(null);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 16) }]}>
      {/* Top Navigation Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Worked Shifts</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Member Profile Card (Matching Image 2) */}
        <View style={styles.memberCard}>
          <Avatar name={memberName} uri={memberAvatar} size={54} />
          <View style={styles.memberInfo}>
            <Text style={styles.memberName}>{memberName}</Text>
            <Text style={styles.memberEmail}>{memberEmail}</Text>
          </View>
        </View>

        {/* 3 Metric Cards (Matching Image 2) */}
        <View style={styles.statsRow}>
          {/* Total Hours */}
          <View style={[styles.statCard, { backgroundColor: "#EEF2FF" }]}>
            <View style={styles.statHeader}>
              <View style={[styles.statIconBadge, { backgroundColor: "#635BFF" }]}>
                <Ionicons name="time" size={15} color="#FFFFFF" />
              </View>
              <Text style={styles.statLabel}>Total Hours</Text>
            </View>
            <Text style={styles.statNumber}>{initialHours}</Text>
          </View>

          {/* Days Worked */}
          <View style={[styles.statCard, { backgroundColor: "#ECFDF5" }]}>
            <View style={styles.statHeader}>
              <View style={[styles.statIconBadge, { backgroundColor: "#10B981" }]}>
                <Ionicons name="calendar" size={14} color="#FFFFFF" />
              </View>
              <Text style={styles.statLabel}>Days Worked</Text>
            </View>
            <Text style={styles.statNumber}>{initialDays}</Text>
          </View>

          {/* Avg Hour/Day */}
          <View style={[styles.statCard, { backgroundColor: "#F0FDF4" }]}>
            <View style={styles.statHeader}>
              <View style={[styles.statIconBadge, { backgroundColor: "#22C55E" }]}>
                <Ionicons name="pulse" size={14} color="#FFFFFF" />
              </View>
              <Text style={styles.statLabel}>Avg Hour/Day</Text>
            </View>
            <Text style={styles.statNumber}>{initialAvg}</Text>
          </View>
        </View>

        {/* Daily Shifts Section */}
        <View style={styles.sectionCard}>
          {/* Section Header & Filters (Matching Image 2) */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Daily Shifts</Text>

            {/* Filter Pills & Add Button */}
            <View style={styles.filterActionsGroup}>
              {/* Month Dropdown */}
              <TouchableOpacity
                style={styles.dropdownPill}
                onPress={() => setIsMonthDropdownOpen(true)}
                activeOpacity={0.7}
              >
                <Text style={styles.dropdownPillText}>{selectedMonth}</Text>
                <Ionicons name="chevron-down" size={12} color="#64748B" />
              </TouchableOpacity>

              {/* Year Dropdown */}
              <TouchableOpacity
                style={styles.dropdownPill}
                onPress={() => setIsYearDropdownOpen(true)}
                activeOpacity={0.7}
              >
                <Text style={styles.dropdownPillText}>{selectedYear}</Text>
                <Ionicons name="chevron-down" size={12} color="#64748B" />
              </TouchableOpacity>

              {/* Add Shift Button */}
              <TouchableOpacity
                style={styles.addShiftBtn}
                onPress={() => setIsAddShiftOpen(true)}
                activeOpacity={0.8}
              >
                <Ionicons name="add" size={15} color="#FFFFFF" />
                <Text style={styles.addShiftBtnText}>Add Shift</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Custom range button */}
          <TouchableOpacity
            style={styles.customRangePill}
            onPress={() => Alert.alert("Date Range", "Filter by custom date range...")}
            activeOpacity={0.75}
          >
            <Ionicons name="calendar-outline" size={14} color="#64748B" />
            <Text style={styles.customRangeText}>Custom range...</Text>
          </TouchableOpacity>

          {/* Daily Shifts List (Mobile Card Format - Avoiding Table for App) */}
          <View style={styles.shiftsListWrapper}>
            {dailyShifts.map((shift) => (
              <View key={shift.id} style={styles.shiftItemCard}>
                {/* Top: Date, Day of Week, and Actions */}
                <View style={styles.shiftCardTopRow}>
                  <View style={styles.shiftDateBadgeGroup}>
                    <Text style={styles.shiftDateText}>{shift.date}</Text>
                    <View style={styles.dotDivider} />
                    <Text style={styles.shiftDayText}>{shift.dayOfWeek}</Text>
                    <View style={styles.shiftCountPill}>
                      <View style={styles.blueDot} />
                      <Text style={styles.shiftCountText}>{shift.shiftsCount}</Text>
                    </View>
                  </View>

                  {/* Actions: Edit and Delete */}
                  <View style={styles.actionsPillRow}>
                    <TouchableOpacity
                      style={styles.iconActionBtn}
                      onPress={() => setEditingShift(shift)}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="pencil-outline" size={16} color="#64748B" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.iconActionBtn}
                      onPress={() => handleDeleteShift(shift.id, `${shift.dayOfWeek}, ${shift.date}`)}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="trash-outline" size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Metrics Grid */}
                <View style={styles.shiftDetailsGrid}>
                  <View style={styles.detailCol}>
                    <Text style={styles.detailLabel}>Time In</Text>
                    <Text style={styles.detailVal}>{shift.timeIn}</Text>
                  </View>

                  <View style={styles.detailCol}>
                    <Text style={styles.detailLabel}>Time Out</Text>
                    <Text style={styles.detailVal}>{shift.timeOut}</Text>
                  </View>

                  <View style={styles.detailCol}>
                    <Text style={styles.detailLabel}>Hours Worked</Text>
                    <Text style={[styles.detailVal, { color: "#635BFF", fontFamily: "Manrope_700Bold" }]}>
                      {shift.hoursWorked}
                    </Text>
                  </View>

                  <View style={styles.detailCol}>
                    <Text style={styles.detailLabel}>Daily Total</Text>
                    <Text style={[styles.detailVal, { fontFamily: "Manrope_700Bold" }]}>
                      {shift.dailyTotal}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Bottom Summary Bar (Matching Image 2) */}
          <View style={styles.summaryBar}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Days Worked</Text>
              <View style={styles.purplePill}>
                <Text style={styles.purplePillText}>21 Days</Text>
              </View>
            </View>

            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Shifts</Text>
              <View style={styles.purplePill}>
                <Text style={styles.purplePillText}>{dailyShifts.length}</Text>
              </View>
            </View>

            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Monthly Total</Text>
              <View style={styles.purplePill}>
                <Text style={styles.purplePillText}>{initialHours}</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Month Selection Modal */}
      <Modal visible={isMonthDropdownOpen} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsMonthDropdownOpen(false)}
        >
          <View style={styles.dropdownModalContent}>
            <Text style={styles.dropdownModalTitle}>Select Month</Text>
            {months.map((m) => (
              <TouchableOpacity
                key={m}
                style={[styles.dropdownModalItem, selectedMonth === m && styles.dropdownModalItemActive]}
                onPress={() => {
                  setSelectedMonth(m);
                  setIsMonthDropdownOpen(false);
                }}
              >
                <Text style={[styles.dropdownModalItemText, selectedMonth === m && styles.dropdownModalItemTextActive]}>
                  {m}
                </Text>
                {selectedMonth === m && <Ionicons name="checkmark" size={16} color="#635BFF" />}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Year Selection Modal */}
      <Modal visible={isYearDropdownOpen} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsYearDropdownOpen(false)}
        >
          <View style={styles.dropdownModalContent}>
            <Text style={styles.dropdownModalTitle}>Select Year</Text>
            {years.map((y) => (
              <TouchableOpacity
                key={y}
                style={[styles.dropdownModalItem, selectedYear === y && styles.dropdownModalItemActive]}
                onPress={() => {
                  setSelectedYear(y);
                  setIsYearDropdownOpen(false);
                }}
              >
                <Text style={[styles.dropdownModalItemText, selectedYear === y && styles.dropdownModalItemTextActive]}>
                  {y}
                </Text>
                {selectedYear === y && <Ionicons name="checkmark" size={16} color="#635BFF" />}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Add Shift Modal */}
      <AddWorkedShiftModal
        visible={isAddShiftOpen}
        onClose={() => setIsAddShiftOpen(false)}
        onSave={handleAddShiftSave}
      />

      {/* Edit Shift Modal */}
      <EditWorkedShiftModal
        visible={!!editingShift}
        onClose={() => setEditingShift(null)}
        initialData={
          editingShift
            ? {
                memberName,
                date: editingShift.date,
                clockIn: editingShift.timeIn,
                clockOut: editingShift.timeOut,
              }
            : undefined
        }
        onSave={handleEditShiftSave}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 17,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  scrollContent: {
    flex: 1,
    padding: 16,
  },

  // Member Card
  memberCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 14,
  },
  memberInfo: {
    marginLeft: 14,
    flex: 1,
  },
  memberName: {
    fontSize: 17,
    fontFamily: "Manrope_700Bold",
    color: "#0F172A",
  },
  memberEmail: {
    fontSize: 13,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    marginTop: 2,
  },

  // Stat Cards
  statsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  statHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  statIconBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  statLabel: {
    fontSize: 11,
    fontFamily: "Manrope_600SemiBold",
    color: "#475569",
    flexShrink: 1,
  },
  statNumber: {
    fontSize: 18,
    fontFamily: "Manrope_800ExtraBold",
    color: "#0F172A",
  },

  // Section Card
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  filterActionsGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
  },
  dropdownPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#FFFFFF",
  },
  dropdownPillText: {
    fontSize: 12,
    fontFamily: "Manrope_600SemiBold",
    color: "#475569",
  },
  addShiftBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#635BFF",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  addShiftBtnText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },
  customRangePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "#F8FAFC",
    alignSelf: "flex-start",
    marginBottom: 14,
  },
  customRangeText: {
    fontSize: 12,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
  },

  // Shifts List (Card format)
  shiftsListWrapper: {
    gap: 10,
  },
  shiftItemCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 12,
  },
  shiftCardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  shiftDateBadgeGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
  },
  shiftDateText: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  dotDivider: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#CBD5E1",
  },
  shiftDayText: {
    fontSize: 12,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  shiftCountPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  blueDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#635BFF",
  },
  shiftCountText: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  actionsPillRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconActionBtn: {
    padding: 4,
  },

  shiftDetailsGrid: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 10,
  },
  detailCol: {
    alignItems: "flex-start",
  },
  detailLabel: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
    marginBottom: 2,
  },
  detailVal: {
    fontSize: 13,
    fontFamily: "Manrope_600SemiBold",
    color: "#1E293B",
  },

  // Summary Bar
  summaryBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 10,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    padding: 12,
    marginTop: 16,
  },
  summaryItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  summaryLabel: {
    fontSize: 12,
    fontFamily: "Manrope_600SemiBold",
    color: "#475569",
  },
  purplePill: {
    backgroundColor: "#635BFF",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  purplePillText: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },

  // Modal styling
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  dropdownModalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    width: "100%",
    maxWidth: 320,
  },
  dropdownModalTitle: {
    fontSize: 15,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
    marginBottom: 12,
  },
  dropdownModalItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  dropdownModalItemActive: {
    backgroundColor: "#F5F3FF",
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  dropdownModalItemText: {
    fontSize: 13,
    fontFamily: "Manrope_600SemiBold",
    color: "#334155",
  },
  dropdownModalItemTextActive: {
    color: "#635BFF",
    fontFamily: "Manrope_700Bold",
  },
});
