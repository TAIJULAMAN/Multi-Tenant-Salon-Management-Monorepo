import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import TextInput from "@/components/ui/TextInput";
import DatePickerInput from "@/components/ui/DatePickerInput";

interface EditWorkedShiftModalProps {
  visible: boolean;
  onClose: () => void;
  initialData?: {
    memberName?: string;
    date: string;
    clockIn: string;
    clockOut: string;
  };
  onSave?: (date: string, clockIn: string, clockOut: string) => void;
}

export default function EditWorkedShiftModal({
  visible,
  onClose,
  initialData,
  onSave,
}: EditWorkedShiftModalProps) {
  const [date, setDate] = useState(initialData?.date || "12/01/2024");
  const [clockIn, setClockIn] = useState(initialData?.clockIn || "09:00");
  const [clockOut, setClockOut] = useState(initialData?.clockOut || "18:00");

  useEffect(() => {
    if (initialData && visible) {
      setDate(initialData.date);
      setClockIn(initialData.clockIn);
      setClockOut(initialData.clockOut);
    }
  }, [initialData, visible]);

  const handleSave = () => {
    if (onSave) {
      onSave(date, clockIn, clockOut);
    }
    Alert.alert("Success", "Worked shift updated successfully!");
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity style={styles.container} activeOpacity={1} onPress={(e) => e.stopPropagation()}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Edit Worked Shift</Text>
              <Text style={styles.headerSub}>{initialData?.memberName || "Team Member"}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <View style={styles.body}>
            <DatePickerInput
              label="Date"
              required
              value={date}
              onChange={setDate}
            />

            <View style={styles.row}>
              <View style={styles.halfCol}>
                <TextInput
                  label="Clock In"
                  required
                  placeholder="09:00"
                  value={clockIn}
                  onChangeText={setClockIn}
                />
              </View>
              <View style={styles.halfCol}>
                <TextInput
                  label="Clock Out"
                  required
                  placeholder="18:00"
                  value={clockOut}
                  onChangeText={setClockOut}
                />
              </View>
            </View>
          </View>

          {/* Footer Buttons */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.7}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
              <Text style={styles.saveBtnText}>Save Changes</Text>
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
    maxWidth: 380,
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
  headerSub: {
    fontSize: 12,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    marginTop: 2,
  },
  closeBtn: {
    padding: 4,
  },
  body: {
    padding: 20,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  halfCol: {
    flex: 1,
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
