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
import CustomBottomSheet from "@/components/ui/CustomBottomSheet";

export default function ShiftsTab() {
  const [selectedDate, setSelectedDate] = useState(5); // Default: Thu 5
  const [isMassEdit, setIsMassEdit] = useState(false);
  const [isAddShiftOpen, setIsAddShiftOpen] = useState(false);
  const [isClosedPeriodOpen, setIsClosedPeriodOpen] = useState(false);

  // New shift form state
  const [shiftTime, setShiftTime] = useState("10:00 - 19:00");
  const [shiftRole, setShiftRole] = useState("Styling Station 1");

  // Closed period form state
  const [closedStart, setClosedStart] = useState("Oct 15, 2024");
  const [closedEnd, setClosedEnd] = useState("Oct 16, 2024");
  const [closedReason, setClosedReason] = useState("Staff Training");

  const dates = [
    { dayName: "Mon", dateNum: 2 },
    { dayName: "Tue", dateNum: 3 },
    { dayName: "Wed", dateNum: 4 },
    { dayName: "Thu", dateNum: 5 },
    { dayName: "Fri", dateNum: 6 },
    { dayName: "Sat", dateNum: 7 },
    { dayName: "Sun", dateNum: 8 },
  ];

  const appointments = [
    { time: "08:00", title: "Haircut", duration: "45 Min", price: "€ 170", stylist: "Maria Rodriguez" },
    { time: "09:30", title: "Haircut & Color", duration: "45 Min", price: "€ 170", stylist: "Maria Rodriguez" },
    { time: "11:00", title: "Balayage Full", duration: "60 Min", price: "€ 220", stylist: "Maria Rodriguez" },
    { time: "14:00", title: "Styling & Blowout", duration: "45 Min", price: "€ 90", stylist: "Maria Rodriguez" },
  ];

  const upcomingShifts = [
    { day: "Today, Oct 5", hours: "08:00 - 17:00", duration: "9.0h", label: "Morning Shift" },
    { day: "Friday, Oct 6", hours: "08:00 - 17:00", duration: "9.0h", label: "Morning Start" },
    { day: "Monday, Oct 9", hours: "08:00 - 17:00", duration: "9.0h", label: "Evening Shift" },
  ];

  const handleAddShift = () => {
    setIsAddShiftOpen(false);
    Alert.alert("Success", "New shift added to schedule.");
  };

  const handleAddClosedPeriod = () => {
    setIsClosedPeriodOpen(false);
    Alert.alert("Success", `Closed period registered: ${closedReason}`);
  };

  return (
    <View style={styles.container}>
      {/* Top Header with Actions */}
      <View style={styles.topBarCard}>
        <View>
          <Text style={styles.topBarTitle}>Schedules & Shifts</Text>
          <Text style={styles.topBarSub}>Monthly roster & working hours</Text>
        </View>

        <View style={styles.topActionsRow}>
          <TouchableOpacity
            style={[styles.actionPill, isMassEdit && styles.actionPillActive]}
            onPress={() => setIsMassEdit(!isMassEdit)}
            activeOpacity={0.7}
          >
            <Text style={[styles.actionPillText, isMassEdit && styles.actionPillTextActive]}>
              {isMassEdit ? "Done" : "Edit Shifts"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => {
              Alert.alert("Add Schedule Event", "Choose what to add:", [
                { text: "Add Shift", onPress: () => setIsAddShiftOpen(true) },
                { text: "Closed Period", onPress: () => setIsClosedPeriodOpen(true) },
                { text: "Cancel", style: "cancel" },
              ]);
            }}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={16} color="#FFFFFF" style={{ marginRight: 2 }} />
            <Text style={styles.addBtnText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Calendar Navigation */}
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={18} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.monthText}>October 2024</Text>
        <TouchableOpacity activeOpacity={0.7}>
          <Ionicons name="chevron-forward" size={18} color="#111827" />
        </TouchableOpacity>
      </View>

      {/* Date Selectors */}
      <View style={styles.datePickerRow}>
        {dates.map((d) => {
          const isSelected = d.dateNum === selectedDate;
          return (
            <TouchableOpacity
              key={d.dateNum}
              style={[styles.dateCol, isSelected && styles.dateColSelected]}
              onPress={() => setSelectedDate(d.dateNum)}
              activeOpacity={0.8}
            >
              <Text style={[styles.dayName, isSelected && styles.textSelected]}>
                {d.dayName}
              </Text>
              <Text style={[styles.dateNum, isSelected && styles.textSelected]}>
                {d.dateNum}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Timetable Slots */}
      <View style={styles.timetable}>
        {appointments.map((appt, idx) => (
          <View key={idx} style={styles.timeSlot}>
            <Text style={styles.timeText}>{appt.time}</Text>
            <View style={styles.appointmentCard}>
              <View style={styles.appointmentLeft}>
                <Text style={styles.appointmentTitle}>{appt.title}</Text>
                <Text style={styles.appointmentDetail}>
                  {appt.duration} • {appt.price}
                </Text>
              </View>
              <View style={styles.appointmentRight}>
                <Text style={styles.stylistText}>{appt.stylist}</Text>
                {isMassEdit && (
                  <TouchableOpacity
                    onPress={() => Alert.alert("Remove Slot", "Remove this slot?", [
                      { text: "Cancel", style: "cancel" },
                      { text: "Remove", style: "destructive" },
                    ])}
                    style={{ marginTop: 4 }}
                  >
                    <Ionicons name="trash-outline" size={14} color="#EF4444" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Upcoming Shifts Section */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Upcoming Shifts</Text>
        {upcomingShifts.map((shift, idx) => (
          <View key={idx} style={styles.shiftRow}>
            <View style={styles.shiftLeft}>
              <View style={styles.clockIconContainer}>
                <Ionicons name="time-outline" size={16} color="#635BFF" />
              </View>
              <View>
                <Text style={styles.shiftDay}>{shift.day}</Text>
                <Text style={styles.shiftHours}>{shift.hours}</Text>
              </View>
            </View>
            <View style={styles.shiftRight}>
              <Text style={styles.shiftDuration}>{shift.duration}</Text>
              <Text style={styles.shiftLabel}>{shift.label}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>TOTAL HOURS</Text>
          <Text style={styles.summaryValue}>156.5</Text>
          <Text style={styles.summarySub}>+12% vs last month</Text>
        </View>

        <View style={[styles.summaryCard, { marginRight: 0 }]}>
          <Text style={styles.summaryLabel}>EFFICIENCY</Text>
          <Text style={styles.summaryValue}>94%</Text>
          <Text style={[styles.summarySub, { color: "#10B981" }]}>Top Tier Staff</Text>
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
            <Text style={styles.formLabel}>Hours Range *</Text>
            <TextInput
              style={styles.formInput}
              value={shiftTime}
              onChangeText={setShiftTime}
              placeholder="e.g. 10:00 - 19:00"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Work Station / Notes</Text>
            <TextInput
              style={styles.formInput}
              value={shiftRole}
              onChangeText={setShiftRole}
              placeholder="e.g. Station 2 - Hair Coloring"
              placeholderTextColor="#94A3B8"
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

      {/* Business Closed Period Sheet using CustomBottomSheet */}
      <CustomBottomSheet
        visible={isClosedPeriodOpen}
        onClose={() => setIsClosedPeriodOpen(false)}
        title="Business Closed Period"
      >
        <View style={styles.sheetFormContainer}>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Start Date *</Text>
            <TextInput
              style={styles.formInput}
              value={closedStart}
              onChangeText={setClosedStart}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>End Date *</Text>
            <TextInput
              style={styles.formInput}
              value={closedEnd}
              onChangeText={setClosedEnd}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Reason</Text>
            <TextInput
              style={styles.formInput}
              value={closedReason}
              onChangeText={setClosedReason}
              placeholder="e.g. Salon Renovation / Holiday"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.sheetModalActions}>
            <TouchableOpacity
              style={styles.sheetCancelBtn}
              onPress={() => setIsClosedPeriodOpen(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.sheetCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sheetSaveBtn}
              onPress={handleAddClosedPeriod}
              activeOpacity={0.85}
            >
              <Text style={styles.sheetSaveText}>Save Period</Text>
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
  topBarCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  topBarTitle: {
    fontSize: 16,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  topBarSub: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
    marginTop: 2,
  },
  topActionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  actionPill: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  actionPillActive: {
    backgroundColor: "#EEF2FF",
    borderColor: "#635BFF",
  },
  actionPillText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#475569",
  },
  actionPillTextActive: {
    color: "#635BFF",
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  monthText: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  datePickerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  dateCol: {
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    width: "13%",
  },
  dateColSelected: {
    backgroundColor: "#635BFF",
    borderColor: "#635BFF",
  },
  dayName: {
    fontSize: 10,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    marginBottom: 2,
  },
  dateNum: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  textSelected: {
    color: "#FFFFFF",
  },
  timetable: {
    marginBottom: 16,
  },
  timeSlot: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  timeText: {
    width: 48,
    fontSize: 12,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  appointmentCard: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderLeftWidth: 4,
    borderLeftColor: "#635BFF",
  },
  appointmentLeft: {
    flex: 1,
  },
  appointmentTitle: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
    marginBottom: 2,
  },
  appointmentDetail: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
  },
  appointmentRight: {
    alignItems: "flex-end",
  },
  stylistText: {
    fontSize: 11,
    fontFamily: "Manrope_600SemiBold",
    color: "#635BFF",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
    marginBottom: 14,
  },
  shiftRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  shiftLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  clockIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  shiftDay: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  shiftHours: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    marginTop: 1,
  },
  shiftRight: {
    alignItems: "flex-end",
  },
  shiftDuration: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  shiftLabel: {
    fontSize: 10,
    fontFamily: "Manrope_600SemiBold",
    color: "#635BFF",
    marginTop: 2,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  summaryLabel: {
    fontSize: 9,
    fontFamily: "Manrope_700Bold",
    color: "#94A3B8",
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  summaryValue: {
    fontSize: 22,
    fontFamily: "Manrope_800ExtraBold",
    color: "#1E293B",
    marginBottom: 2,
  },
  summarySub: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
  },
  sheetFormContainer: {
    gap: 14,
    paddingBottom: 8,
  },
  formGroup: {
    gap: 6,
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
