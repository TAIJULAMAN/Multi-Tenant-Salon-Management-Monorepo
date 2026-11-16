import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import TextInput from "@/components/ui/TextInput";
import DropdownSelect from "@/components/ui/DropdownSelect";
import DatePickerInput from "@/components/ui/DatePickerInput";
import CustomSwitch from "@/components/ui/CustomSwitch";

interface AddTimeOffModalProps {
  visible: boolean;
  onClose: () => void;
  onSave?: (data: any) => void;
}

const TIME_OFF_TYPES = [
  "Annual leave",
  "Sick leave",
  "Personal leave",
  "Maternity leave",
  "Paternity leave",
  "Bereavement leave",
  "Other",
];

const REPEAT_FREQUENCIES = [
  { id: "daily", label: "Daily", desc: "Repeat blocks of time a day" },
  { id: "weekly", label: "Weekly", desc: "Repeat on day of every week" },
  { id: "biweekly", label: "Every 2 weeks", desc: "Repeat every 2 weeks on day" },
  { id: "monthly", label: "Monthly", desc: "Repeat on date of every month" },
  { id: "yearly", label: "Yearly", desc: "Repeat on date of every year" },
];

export default function AddTimeOffModal({
  visible,
  onClose,
  onSave,
}: AddTimeOffModalProps) {
  const [type, setType] = useState("Annual leave");
  const [startDate, setStartDate] = useState("12/01/2024");
  const [endDate, setEndDate] = useState("12/05/2024");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [repeat, setRepeat] = useState(false);
  const [frequency, setFrequency] = useState("weekly");

  const handleSave = () => {
    if (onSave) {
      onSave({ type, startDate, endDate, startTime, endTime, repeat, frequency });
    }
    Alert.alert("Success", "Time off added successfully!");
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity style={styles.container} activeOpacity={1} onPress={(e) => e.stopPropagation()}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Add Time Off</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
            <DropdownSelect
              label="Type"
              required
              options={TIME_OFF_TYPES}
              value={type}
              onSelect={setType}
            />

            <View style={styles.row}>
              <View style={styles.halfCol}>
                <DatePickerInput
                  label="Start Date"
                  required
                  value={startDate}
                  onChange={setStartDate}
                />
              </View>
              <View style={styles.halfCol}>
                <DatePickerInput
                  label="End Date"
                  required
                  value={endDate}
                  onChange={setEndDate}
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.halfCol}>
                <TextInput
                  label="Start Time"
                  required
                  placeholder="09:00"
                  value={startTime}
                  onChangeText={setStartTime}
                />
              </View>
              <View style={styles.halfCol}>
                <TextInput
                  label="End Time"
                  required
                  placeholder="17:00"
                  value={endTime}
                  onChangeText={setEndTime}
                />
              </View>
            </View>

            {/* Repeat Switch */}
            <View style={styles.switchRow}>
              <View>
                <Text style={styles.switchLabel}>Repeat</Text>
                <Text style={styles.switchSub}>Repeat this time off schedule</Text>
              </View>
              <CustomSwitch value={repeat} onValueChange={setRepeat} />
            </View>

            {repeat && (
              <View style={styles.repeatBox}>
                <Text style={styles.repeatBoxTitle}>Repeat frequency</Text>
                {REPEAT_FREQUENCIES.map((freq) => {
                  const isSelected = frequency === freq.id;
                  return (
                    <TouchableOpacity
                      key={freq.id}
                      style={styles.freqOption}
                      onPress={() => setFrequency(freq.id)}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.radioCircle, isSelected && styles.radioCircleActive]}>
                        {isSelected && <View style={styles.radioDot} />}
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.freqLabel, isSelected && styles.freqLabelActive]}>
                          {freq.label}
                        </Text>
                        <Text style={styles.freqDesc}>{freq.desc}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </ScrollView>

          {/* Footer Buttons */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.7}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
              <Text style={styles.saveBtnText}>Save Time Off</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  container: {
    width: "100%",
    maxWidth: 420,
    maxHeight: "85%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  closeBtn: {
    padding: 4,
  },
  body: {
    maxHeight: 450,
  },
  bodyContent: {
    padding: 20,
    gap: 4,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  halfCol: {
    flex: 1,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    marginTop: 4,
  },
  switchLabel: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  switchSub: {
    fontSize: 12,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    marginTop: 2,
  },
  repeatBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginTop: 8,
    gap: 10,
  },
  repeatBoxTitle: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
    marginBottom: 4,
  },
  freqOption: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  radioCircleActive: {
    borderColor: "#635BFF",
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#635BFF",
  },
  freqLabel: {
    fontSize: 13,
    fontFamily: "Manrope_600SemiBold",
    color: "#334155",
  },
  freqLabelActive: {
    color: "#635BFF",
    fontFamily: "Manrope_700Bold",
  },
  freqDesc: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
  },
  footer: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
  },
  cancelBtn: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtnText: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#475569",
  },
  saveBtn: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    backgroundColor: "#635BFF",
    alignItems: "center",
    justifyContent: "center",
  },
  saveBtnText: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },
});
