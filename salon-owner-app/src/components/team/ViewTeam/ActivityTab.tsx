import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Circle } from "react-native-svg";
import CustomBottomSheet from "@/components/ui/CustomBottomSheet";

interface ShiftItem {
  id: string;
  date: string;
  timeRange: string;
  hours: string;
  relativeTime: string;
}

const INITIAL_SHIFTS: ShiftItem[] = [
  { id: "1", date: "Nov 29, 2024", timeRange: "09:00 - 19:00", hours: "10h", relativeTime: "2 hours ago" },
  { id: "2", date: "Oct 30, 2024", timeRange: "09:00 - 19:00", hours: "10h", relativeTime: "2 hours ago" },
  { id: "3", date: "Sep 29, 2024", timeRange: "09:00 - 19:00", hours: "10h", relativeTime: "2 hours ago" },
  { id: "4", date: "Aug 30, 2024", timeRange: "09:00 - 19:00", hours: "10h", relativeTime: "2 hours ago" },
  { id: "5", date: "Jul 29, 2024", timeRange: "09:00 - 19:00", hours: "10h", relativeTime: "2 hours ago" },
];

export default function ActivityTab() {
  const [shifts, setShifts] = useState<ShiftItem[]>(INITIAL_SHIFTS);
  const [isAddShiftOpen, setIsAddShiftOpen] = useState(false);
  const [shiftDate, setShiftDate] = useState("");
  const [shiftStart, setShiftStart] = useState("09:00");
  const [shiftEnd, setShiftEnd] = useState("19:00");
  const [shiftHours, setShiftHours] = useState("10h");

  const handleAddShift = () => {
    if (!shiftDate.trim()) {
      Alert.alert("Error", "Please enter shift date.");
      return;
    }
    const newShift: ShiftItem = {
      id: Date.now().toString(),
      date: shiftDate.trim(),
      timeRange: `${shiftStart} - ${shiftEnd}`,
      hours: shiftHours.trim() || "8h",
      relativeTime: "Just now",
    };
    setShifts([newShift, ...shifts]);
    setIsAddShiftOpen(false);
    setShiftDate("");
    Alert.alert("Success", "New shift logged successfully.");
  };

  return (
    <View style={styles.container}>
      {/* 2 Top Metric Summary Cards */}
      <View style={styles.statsRow}>
        <View style={[styles.statsCard, { backgroundColor: "#EEF2FF", borderColor: "#C7D2FE" }]}>
          <View style={styles.statsHeader}>
            <Ionicons name="calendar" size={14} color="#635BFF" />
            <Text style={styles.statsTitle}>Appointments Done</Text>
          </View>
          <Text style={styles.statsMainValue}>142</Text>
          <Text style={styles.statsSubtitle}>Month of November</Text>
        </View>

        <View style={[styles.statsCard, { backgroundColor: "#ECFDF5", borderColor: "#A7F3D0" }]}>
          <View style={styles.statsHeader}>
            <Ionicons name="cash" size={14} color="#10B981" />
            <Text style={styles.statsTitle}>Total Revenue</Text>
          </View>
          <Text style={styles.statsMainValue}>€ 8,450</Text>
          <Text style={styles.statsSubtitle}>Month of November</Text>
        </View>
      </View>

      {/* Production by Category Card matching Web Dashboard */}
      <View style={styles.card}>
        <View style={styles.cardTitleBlock}>
          <Text style={styles.cardTitle}>Production by Category</Text>
          <Text style={styles.cardSubtitle}>Visual split across salon treatments</Text>
        </View>

        <View style={styles.chartRow}>
          {/* Donut Chart Visual */}
          <View style={styles.donutWrapper}>
            <Svg height="120" width="120" viewBox="0 0 100 100">
              <Circle
                cx="50"
                cy="50"
                r="38"
                stroke="#635BFF"
                strokeWidth="14"
                strokeDasharray="140 240"
                strokeDashoffset="0"
                fill="none"
              />
              <Circle
                cx="50"
                cy="50"
                r="38"
                stroke="#10B981"
                strokeWidth="14"
                strokeDasharray="65 240"
                strokeDashoffset="-140"
                fill="none"
              />
              <Circle
                cx="50"
                cy="50"
                r="38"
                stroke="#F59E0B"
                strokeWidth="14"
                strokeDasharray="35 240"
                strokeDashoffset="-175"
                fill="none"
              />
            </Svg>
            <View style={styles.donutCenter}>
              <Text style={styles.donutTotal}>€ 8.4k</Text>
              <Text style={styles.donutLabel}>Total</Text>
            </View>
          </View>

          {/* Legend */}
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendIndicator, { backgroundColor: "#635BFF" }]} />
              <Text style={styles.legendCategory}>Hair Coloring</Text>
              <Text style={styles.legendPercent}>58%</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendIndicator, { backgroundColor: "#10B981" }]} />
              <Text style={styles.legendCategory}>Cuts & Styling</Text>
              <Text style={styles.legendPercent}>26%</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendIndicator, { backgroundColor: "#F59E0B" }]} />
              <Text style={styles.legendCategory}>Treatments</Text>
              <Text style={styles.legendPercent}>16%</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Recent Shifts Section matching Web Dashboard */}
      <View style={styles.card}>
        <View style={styles.shiftsHeaderRow}>
          <View style={styles.shiftsTitleBlock}>
            <Text style={styles.cardTitle}>Recent Shifts</Text>
            <Text style={styles.cardSubtitle}>Last shifts performed this month</Text>
          </View>
          <View style={styles.shiftsHeaderActions}>
            <TouchableOpacity
              style={styles.exportBtn}
              onPress={() => Alert.alert("Export", "Exported shifts log.")}
              activeOpacity={0.7}
            >
              <Ionicons name="download-outline" size={14} color="#635BFF" style={{ marginRight: 2 }} />
              <Text style={styles.exportBtnText}>Export</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.addShiftBtn}
              onPress={() => setIsAddShiftOpen(true)}
              activeOpacity={0.7}
            >
              <Ionicons name="add" size={14} color="#FFFFFF" style={{ marginRight: 2 }} />
              <Text style={styles.addShiftBtnText}>Add Shift</Text>
            </TouchableOpacity>
          </View>
        </View>

        {shifts.map((item) => (
          <View key={item.id} style={styles.shiftItem}>
            <View style={styles.shiftItemTop}>
              <Text style={styles.shiftDateText}>{item.date}</Text>
              <View style={styles.shiftBadge}>
                <Text style={styles.shiftBadgeText}>{item.hours}</Text>
              </View>
            </View>
            <View style={styles.shiftItemBottom}>
              <Text style={styles.shiftTimeRange}>{item.timeRange}</Text>
              <Text style={styles.shiftRelative}>{item.relativeTime}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Top 5 Most Frequent Customers Card */}
      <View style={styles.card}>
        <View style={styles.cardTitleBlock}>
          <Text style={styles.cardTitle}>Top 5 Most Frequent Customers</Text>
          <Text style={styles.cardSubtitle}>Highest loyalty with this team member</Text>
        </View>

        {[
          { id: "1", name: "Elena Rossi", visits: "24 visits", amount: "€ 1,240", icon: "person" },
          { id: "2", name: "Giulia Ferrari", visits: "19 visits", amount: "€ 980", icon: "person" },
          { id: "3", name: "Marco Bianchi", visits: "15 visits", amount: "€ 820", icon: "person" },
          { id: "4", name: "Francesca Conti", visits: "12 visits", amount: "€ 640", icon: "person" },
          { id: "5", name: "Sofia De Luca", visits: "11 visits", amount: "€ 590", icon: "person" },
        ].map((cust, idx) => (
          <View key={cust.id} style={[styles.clientItem, idx === 4 && { borderBottomWidth: 0 }]}>
            <View style={styles.clientAvatar}>
              <Text style={styles.clientInitial}>{cust.name.charAt(0)}</Text>
            </View>
            <View style={styles.clientInfo}>
              <Text style={styles.clientName}>{cust.name}</Text>
              <Text style={styles.clientVisits}>{cust.visits}</Text>
            </View>
            <Text style={styles.clientAmount}>{cust.amount}</Text>
          </View>
        ))}
      </View>

      {/* Days Worked Other Card */}
      <View style={styles.card}>
        <View style={styles.cardTitleBlock}>
          <Text style={styles.cardTitle}>Days Worked (Other)</Text>
          <Text style={styles.cardSubtitle}>Attendance, sick days and leave breakdown</Text>
        </View>

        <View style={styles.workStatsGrid}>
          <View style={styles.gridItem}>
            <Text style={styles.gridItemLabel}>Total Days Worked</Text>
            <Text style={styles.gridItemValue}>218 days</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridItemLabel}>Vacation Taken</Text>
            <Text style={styles.gridItemValue}>14 days</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridItemLabel}>Sick Leave</Text>
            <Text style={styles.gridItemValue}>3 days</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridItemLabel}>Next Evaluation</Text>
            <Text style={styles.gridItemValue}>Mar 14, 2025</Text>
          </View>
        </View>
      </View>

      {/* Add Shift Sheet using CustomBottomSheet */}
      <CustomBottomSheet
        visible={isAddShiftOpen}
        onClose={() => setIsAddShiftOpen(false)}
        title="Add Shift"
      >
        <View style={styles.sheetFormContainer}>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Shift Date *</Text>
            <TextInput
              style={styles.formInput}
              placeholder="e.g. Dec 02, 2024"
              placeholderTextColor="#94A3B8"
              value={shiftDate}
              onChangeText={setShiftDate}
            />
          </View>

          <View style={styles.formRow}>
            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={styles.formLabel}>Start Time</Text>
              <TextInput
                style={styles.formInput}
                placeholder="09:00"
                placeholderTextColor="#94A3B8"
                value={shiftStart}
                onChangeText={setShiftStart}
              />
            </View>
            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={styles.formLabel}>End Time</Text>
              <TextInput
                style={styles.formInput}
                placeholder="19:00"
                placeholderTextColor="#94A3B8"
                value={shiftEnd}
                onChangeText={setShiftEnd}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Total Hours</Text>
            <TextInput
              style={styles.formInput}
              placeholder="10h"
              placeholderTextColor="#94A3B8"
              value={shiftHours}
              onChangeText={setShiftHours}
            />
          </View>

          <View style={styles.sheetModalActions}>
            <TouchableOpacity
              style={styles.sheetCancelBtn}
              onPress={() => setIsAddShiftOpen(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.sheetCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sheetSaveBtn}
              onPress={handleAddShift}
              activeOpacity={0.85}
            >
              <Text style={styles.sheetSaveText}>Save Shift</Text>
            </TouchableOpacity>
          </View>
        </View>
      </CustomBottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  statsCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  statsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 6,
  },
  statsTitle: {
    fontSize: 12,
    fontFamily: "Manrope_600SemiBold",
    color: "#475569",
  },
  statsMainValue: {
    fontSize: 24,
    fontFamily: "Manrope_800ExtraBold",
    color: "#0F172A",
    marginBottom: 2,
  },
  statsSubtitle: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  cardTitleBlock: {
    marginBottom: 14,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 15,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  cardSubtitle: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    marginTop: 2,
  },
  chartRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: 8,
  },
  donutWrapper: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    width: 120,
    height: 120,
  },
  donutCenter: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  donutTotal: {
    fontSize: 16,
    fontFamily: "Manrope_800ExtraBold",
    color: "#0F172A",
  },
  donutLabel: {
    fontSize: 10,
    fontFamily: "Manrope_600SemiBold",
    color: "#94A3B8",
  },
  legendContainer: {
    gap: 10,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendIndicator: {
    width: 10,
    height: 10,
    borderRadius: 3,
  },
  legendCategory: {
    fontSize: 12,
    fontFamily: "Manrope_500Medium",
    color: "#475569",
    width: 90,
  },
  legendPercent: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  shiftsHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
    gap: 10,
  },
  shiftsTitleBlock: {
    flex: 1,
    marginRight: 6,
  },
  shiftsHeaderActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexShrink: 0,
    marginTop: 2,
  },
  exportBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  exportBtnText: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  addShiftBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#635BFF",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addShiftBtnText: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },
  shiftItem: {
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 8,
  },
  shiftItemTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  shiftDateText: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  shiftBadge: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  shiftBadgeText: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  shiftItemBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  shiftTimeRange: {
    fontSize: 12,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
  },
  shiftRelative: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
  },
  clientItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  clientAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  clientInitial: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  clientVisits: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
  },
  clientAmount: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  workStatsGrid: {
    gap: 12,
  },
  gridItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
    gap: 8,
  },
  gridItemLabel: {
    fontSize: 13,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    flexShrink: 0,
  },
  gridItemValue: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
    flexShrink: 0,
  },
  sheetFormContainer: {
    gap: 14,
    paddingBottom: 8,
  },
  formGroup: {
    gap: 6,
  },
  formRow: {
    flexDirection: "row",
    gap: 10,
  },
  formLabel: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#334155",
  },
  formInput: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    fontFamily: "Manrope_500Medium",
    color: "#1E293B",
    backgroundColor: "#FFFFFF",
  },
  sheetModalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  sheetCancelBtn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  sheetCancelText: {
    fontSize: 13,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  sheetSaveBtn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#635BFF",
    alignItems: "center",
    justifyContent: "center",
  },
  sheetSaveText: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },
});
