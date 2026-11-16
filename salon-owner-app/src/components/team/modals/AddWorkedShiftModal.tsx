import React, { useState } from "react";
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
import DropdownSelect from "@/components/ui/DropdownSelect";
import DatePickerInput from "@/components/ui/DatePickerInput";

interface AddWorkedShiftModalProps {
  visible: boolean;
  onClose: () => void;
  onSave?: (data: any) => void;
}

const MEMBERS = [
  "Maria Rodriguez",
  "Sarah Jenkins",
  "Elena Rostova",
  "Marco Bianchi",
  "Alessandro Rossi",
];

export default function AddWorkedShiftModal({
  visible,
  onClose,
  onSave,
}: AddWorkedShiftModalProps) {
  const [member, setMember] = useState("Maria Rodriguez");
  const [date, setDate] = useState("12/01/2024");
  const [timeIn, setTimeIn] = useState("09:00");
  const [timeOut, setTimeOut] = useState("18:00");

  const handleSave = () => {
    if (onSave) {
      onSave({ member, date, timeIn, timeOut });
    }
    Alert.alert("Success", "Worked shift recorded successfully!");
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity style={styles.container} activeOpacity={1} onPress={(e) => e.stopPropagation()}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Add Shift</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <View style={styles.body}>
            <DropdownSelect
              label="Team Member"
              required
              options={MEMBERS}
              value={member}
              onSelect={setMember}
            />

            <DatePickerInput
              label="Date"
              required
              value={date}
              onChange={setDate}
            />

            <View style={styles.row}>
              <View style={styles.halfCol}>
                <TextInput
                  label="Time In"
                  required
                  placeholder="09:00"
                  value={timeIn}
                  onChangeText={setTimeIn}
                />
              </View>
              <View style={styles.halfCol}>
                <TextInput
                  label="Time Out"
                  required
                  placeholder="18:00"
                  value={timeOut}
                  onChangeText={setTimeOut}
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
              <Text style={styles.saveBtnText}>Add Shift</Text>
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
    maxWidth: 400,
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
