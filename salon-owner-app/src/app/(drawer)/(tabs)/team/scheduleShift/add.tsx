import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Avatar from "@/components/Avatar";
import { teamStore, TeamMember } from "@/components/team/CreateTeam/teamStore";
import { shiftsStore, Shift } from "@/components/team/shiftsStore";
import BottomSheet from "@/components/ui/BottomSheet";

const TIME_OPTIONS = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
  "20:00", "20:30", "21:00", "21:30", "22:00"
];

const DAYS_OF_WEEK = [
  { label: "Mon", offset: 0 },
  { label: "Tue", offset: 1 },
  { label: "Wed", offset: 2 },
  { label: "Thu", offset: 3 },
  { label: "Fri", offset: 4 },
  { label: "Sat", offset: 5 },
  { label: "Sun", offset: 6 },
];

export default function AddShiftScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [members, setMembers] = useState<TeamMember[]>([]);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  
  // Date range and start date of week
  const [weekStart, setWeekStart] = useState<Date>(new Date(2024, 7, 11)); // Aug 11, 2024
  
  // Form fields
  const [startTime, setStartTime] = useState<string>("10:00");
  const [endTime, setEndTime] = useState<string>("19:00");
  const [isRecurring, setIsRecurring] = useState<boolean>(true); // default as Left image (Recurring)
  const [repeatWeeks, setRepeatWeeks] = useState<string>("2"); // default "2" for Recurring
  const [selectedDays, setSelectedDays] = useState<string[]>([
    "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
  ]); // default for Recurring

  // Picker modals
  const [showMemberPicker, setShowMemberPicker] = useState<boolean>(false);
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);
  const [timePickerTarget, setTimePickerTarget] = useState<"start" | "end" | null>(null);

  useEffect(() => {
    const storeMembers = teamStore.getMembers();
    setMembers(storeMembers);
    if (storeMembers.length > 0) {
      setSelectedMember(storeMembers[0]);
    }
  }, []);

  // Format Date Range: e.g. "Aug 11 - Aug 17, 2024"
  const getWeekRangeString = () => {
    const start = new Date(weekStart);
    const end = new Date(weekStart);
    end.setDate(start.getDate() + 6);

    const formatMonthDay = (date: Date) => {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return `${months[date.getMonth()]} ${date.getDate()}`;
    };

    return `${formatMonthDay(start)} - ${formatMonthDay(end)}, ${start.getFullYear()}`;
  };

  const handlePrevWeek = () => {
    const prev = new Date(weekStart);
    prev.setDate(prev.getDate() - 7);
    setWeekStart(prev);
  };

  const handleNextWeek = () => {
    const next = new Date(weekStart);
    next.setDate(next.getDate() + 7);
    setWeekStart(next);
  };

  // Change selection behavior based on once / recurring toggle
  const handleRepetitionChange = (recurring: boolean) => {
    setIsRecurring(recurring);
    if (recurring) {
      setRepeatWeeks("2");
      setSelectedDays(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]);
    } else {
      setRepeatWeeks("0");
      setSelectedDays(["Mon", "Sat"]); // default for Once
    }
  };

  // Toggle Day Selection
  const toggleDaySelection = (dayLabel: string) => {
    if (selectedDays.includes(dayLabel)) {
      setSelectedDays(selectedDays.filter((d) => d !== dayLabel));
    } else {
      setSelectedDays([...selectedDays, dayLabel]);
    }
  };

  // Confirm / Create Shift
  const handleConfirm = () => {
    if (!selectedMember) {
      Alert.alert("Error", "Please select a staff member.");
      return;
    }

    if (selectedDays.length === 0) {
      Alert.alert("Error", "Please select at least one day of the week.");
      return;
    }

    const durationH = () => {
      const [startH, startM] = startTime.split(":").map(Number);
      const [endH, endM] = endTime.split(":").map(Number);
      let totalMinutes = (endH * 60 + endM) - (startH * 60 + startM);
      if (totalMinutes < 0) totalMinutes += 24 * 60;
      return totalMinutes / 60;
    };

    const hours = durationH();
    const multiplier = isRecurring ? Math.max(1, parseInt(repeatWeeks) || 1) : 1;
    const weeklyTotalStr = `${(hours * selectedDays.length * multiplier).toFixed(0)}h`;

    const weeksCount = isRecurring ? (parseInt(repeatWeeks) || 1) : 1;

    // Create shifts for each selected day & repeat for each week
    for (let w = 0; w < weeksCount; w++) {
      selectedDays.forEach((dayLabel) => {
        const dayOffset = DAYS_OF_WEEK.find((d) => d.label === dayLabel)?.offset || 0;
        const shiftDate = new Date(weekStart);
        shiftDate.setDate(shiftDate.getDate() + dayOffset + (w * 7));

        const year = shiftDate.getFullYear();
        const month = String(shiftDate.getMonth() + 1).padStart(2, "0");
        const dateNum = String(shiftDate.getDate()).padStart(2, "0");
        const dateStr = `${year}-${month}-${dateNum}`;

        shiftsStore.addShift({
          memberName: selectedMember.name,
          memberRole: selectedMember.role,
          avatar: selectedMember.avatarUrl || (selectedMember as any).avatar,
          dateStr: dateStr,
          startTime: startTime,
          endTime: endTime,
          weeklyTotal: weeklyTotalStr,
          isRecurring: isRecurring,
          repeatWeeks: weeksCount,
          selectedDays: selectedDays,
        });
      });
    }

    Alert.alert("Success", "Shifts scheduled successfully!", [
      { text: "OK", onPress: () => router.back() }
    ]);
  };

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 15) }]}>
      {/* Header bar */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Shift</Text>
        <View style={styles.headerRight}>
          {selectedMember && (
            <Avatar name={selectedMember.name} uri={selectedMember.avatarUrl || (selectedMember as any).avatar} size={28} />
          )}
        </View>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Staff Selector */}
        <View style={styles.formField}>
          <TouchableOpacity
            style={styles.selectStaffButton}
            onPress={() => setShowMemberPicker(true)}
            activeOpacity={0.7}
          >
            <View style={styles.staffInfo}>
              {selectedMember ? (
                <>
                  <Avatar name={selectedMember.name} uri={selectedMember.avatarUrl || (selectedMember as any).avatar} size={36} />
                  <View style={styles.staffTextGroup}>
                    <Text style={styles.staffName}>{selectedMember.name}</Text>
                    <Text style={styles.staffRole}>{selectedMember.role}</Text>
                  </View>
                </>
              ) : (
                <Text style={styles.placeholderText}>Select team member...</Text>
              )}
            </View>
            <Ionicons name="chevron-down" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Date Selector Row */}
        <View style={styles.dateSelectorContainer}>
          <TouchableOpacity style={styles.arrowButton} onPress={handlePrevWeek} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={18} color="#6B7280" />
          </TouchableOpacity>
          <View style={styles.dateDisplay}>
            <Ionicons name="calendar-outline" size={16} color="#635BFF" style={{ marginRight: 6 }} />
            <Text style={styles.dateRangeText}>{getWeekRangeString()}</Text>
          </View>
          <TouchableOpacity style={styles.arrowButton} onPress={handleNextWeek} activeOpacity={0.7}>
            <Ionicons name="chevron-forward" size={18} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Repetition Toggle */}
        <View style={styles.segmentContainer}>
          <TouchableOpacity
            style={[styles.segmentBtn, !isRecurring && styles.segmentBtnActive]}
            onPress={() => handleRepetitionChange(false)}
            activeOpacity={0.8}
          >
            <Text style={[styles.segmentBtnText, !isRecurring && styles.segmentBtnTextActive]}>
              Once
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.segmentBtn, isRecurring && styles.segmentBtnActive]}
            onPress={() => handleRepetitionChange(true)}
            activeOpacity={0.8}
          >
            <Text style={[styles.segmentBtnText, isRecurring && styles.segmentBtnTextActive]}>
              Recurring
            </Text>
          </TouchableOpacity>
        </View>

        {/* Repeat Every Section (shown if Recurring) */}
        {isRecurring && (
          <View style={styles.recurringOptions}>
            <Text style={styles.fieldLabel}>Repeat every</Text>
            <View style={styles.repeatInputRow}>
              <TextInput
                style={styles.repeatInput}
                keyboardType="numeric"
                value={repeatWeeks}
                onChangeText={setRepeatWeeks}
                placeholder="1"
              />
              <Text style={styles.repeatUnitText}>weeks</Text>
            </View>
          </View>
        )}

        {/* Days of Week Selector */}
        <View style={styles.daysSelectorContainer}>
          <Text style={styles.fieldLabel}>Select days</Text>
          <View style={styles.daysRow}>
            {DAYS_OF_WEEK.map((day) => {
              const isSelected = selectedDays.includes(day.label);
              return (
                <TouchableOpacity
                  key={day.label}
                  style={[styles.dayChip, isSelected && styles.dayChipSelected]}
                  onPress={() => toggleDaySelection(day.label)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.dayChipText, isSelected && styles.dayChipTextSelected]}>
                    {day.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Time Selector Row */}
        <View style={styles.timeSection}>
          <View style={styles.timeField}>
            <Text style={styles.fieldLabel}>Start Time</Text>
            <TouchableOpacity
              style={styles.timePickerButton}
              onPress={() => {
                setTimePickerTarget("start");
                setShowTimePicker(true);
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.timePickerText}>{startTime}</Text>
              <Ionicons name="time-outline" size={16} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.timeField}>
            <Text style={styles.fieldLabel}>End Time</Text>
            <TouchableOpacity
              style={styles.timePickerButton}
              onPress={() => {
                setTimePickerTarget("end");
                setShowTimePicker(true);
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.timePickerText}>{endTime}</Text>
              <Ionicons name="time-outline" size={16} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Confirm / Action Button */}
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm} activeOpacity={0.85}>
          <Text style={styles.confirmButtonText}>Schedule Shift</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Team Member Picker Modal */}
      <Modal visible={showMemberPicker} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowMemberPicker(false)}
        >
          <View style={styles.pickerModalContent}>
            <View style={styles.pickerModalHeader}>
              <Text style={styles.pickerModalTitle}>Select Team Member</Text>
              <TouchableOpacity onPress={() => setShowMemberPicker(false)}>
                <Ionicons name="close" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={members}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.memberPickerItem}
                  onPress={() => {
                    setSelectedMember(item);
                    setShowMemberPicker(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Avatar name={item.name} uri={item.avatarUrl || (item as any).avatar} size={36} />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.memberPickerName}>{item.name}</Text>
                    <Text style={styles.memberPickerRole}>{item.role}</Text>
                  </View>
                  {selectedMember?.id === item.id && (
                    <Ionicons name="checkmark-circle" size={20} color="#635BFF" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Time Picker Modal */}
      <Modal visible={showTimePicker} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowTimePicker(false)}
        >
          <View style={styles.pickerModalContent}>
            <View style={styles.pickerModalHeader}>
              <Text style={styles.pickerModalTitle}>
                Select {timePickerTarget === "start" ? "Start" : "End"} Time
              </Text>
              <TouchableOpacity onPress={() => setShowTimePicker(false)}>
                <Ionicons name="close" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={TIME_OPTIONS}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.timeOptionItem}
                  onPress={() => {
                    if (timePickerTarget === "start") setStartTime(item);
                    if (timePickerTarget === "end") setEndTime(item);
                    setShowTimePicker(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.timeOptionText,
                      (timePickerTarget === "start" ? startTime : endTime) === item &&
                        styles.timeOptionTextActive,
                    ]}
                  >
                    {item}
                  </Text>
                  {(timePickerTarget === "start" ? startTime : endTime) === item && (
                    <Ionicons name="checkmark" size={18} color="#635BFF" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Manrope_700Bold",
    color: "#111827",
  },
  headerRight: {
    width: 32,
    alignItems: "flex-end",
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  formField: {
    marginBottom: 4,
  },
  selectStaffButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  staffInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  staffTextGroup: {},
  staffName: {
    fontSize: 14,
    fontFamily: "Manrope_600SemiBold",
    color: "#1F2937",
  },
  staffRole: {
    fontSize: 12,
    fontFamily: "Manrope_500Medium",
    color: "#6B7280",
  },
  placeholderText: {
    fontSize: 14,
    fontFamily: "Manrope_500Medium",
    color: "#9CA3AF",
  },
  dateSelectorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  arrowButton: {
    padding: 4,
  },
  dateDisplay: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateRangeText: {
    fontSize: 14,
    fontFamily: "Manrope_600SemiBold",
    color: "#1F2937",
  },
  segmentContainer: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    padding: 3,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 8,
  },
  segmentBtnActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentBtnText: {
    fontSize: 13,
    fontFamily: "Manrope_600SemiBold",
    color: "#6B7280",
  },
  segmentBtnTextActive: {
    color: "#635BFF",
  },
  recurringOptions: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  fieldLabel: {
    fontSize: 13,
    fontFamily: "Manrope_600SemiBold",
    color: "#374151",
    marginBottom: 8,
  },
  repeatInputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  repeatInput: {
    width: 60,
    height: 38,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    textAlign: "center",
    fontSize: 14,
    fontFamily: "Manrope_600SemiBold",
    color: "#1F2937",
    backgroundColor: "#F9FAFB",
  },
  repeatUnitText: {
    fontSize: 14,
    fontFamily: "Manrope_500Medium",
    color: "#4B5563",
  },
  daysSelectorContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  daysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dayChip: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  dayChipSelected: {
    backgroundColor: "#635BFF",
  },
  dayChipText: {
    fontSize: 12,
    fontFamily: "Manrope_600SemiBold",
    color: "#6B7280",
  },
  dayChipTextSelected: {
    color: "#FFFFFF",
  },
  timeSection: {
    flexDirection: "row",
    gap: 12,
  },
  timeField: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  timePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#F9FAFB",
  },
  timePickerText: {
    fontSize: 14,
    fontFamily: "Manrope_600SemiBold",
    color: "#1F2937",
  },
  confirmButton: {
    backgroundColor: "#635BFF",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#635BFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmButtonText: {
    fontSize: 15,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  pickerModalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    width: "100%",
    maxHeight: 400,
    padding: 16,
  },
  pickerModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  pickerModalTitle: {
    fontSize: 16,
    fontFamily: "Manrope_700Bold",
    color: "#111827",
  },
  memberPickerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  memberPickerName: {
    fontSize: 14,
    fontFamily: "Manrope_600SemiBold",
    color: "#1F2937",
  },
  memberPickerRole: {
    fontSize: 12,
    fontFamily: "Manrope_500Medium",
    color: "#6B7280",
  },
  timeOptionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  timeOptionText: {
    fontSize: 14,
    fontFamily: "Manrope_600SemiBold",
    color: "#374151",
  },
  timeOptionTextActive: {
    color: "#635BFF",
    fontFamily: "Manrope_700Bold",
  },
});
