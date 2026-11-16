import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export type ScheduledAddOption = "shift" | "time_off" | "blocked_time" | "closed_period";

interface AddOptionsDropdownModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectOption: (option: ScheduledAddOption) => void;
  top?: number;
  right?: number;
}

export default function AddOptionsDropdownModal({
  visible,
  onClose,
  onSelectOption,
  top = 240,
  right = 16,
}: AddOptionsDropdownModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={[styles.dropdownCard, { marginTop: top, marginRight: right }]}>
          {/* 1. Add Shift */}
          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => {
              onClose();
              onSelectOption("shift");
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="time-outline" size={17} color="#635BFF" style={styles.optionIcon} />
            <Text style={styles.optionText}>Add Shift</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* 2. Add Time Off */}
          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => {
              onClose();
              onSelectOption("time_off");
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="calendar-outline" size={17} color="#0EA5E9" style={styles.optionIcon} />
            <Text style={styles.optionText}>Add Time Off</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* 3. Add Blocked Time */}
          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => {
              onClose();
              onSelectOption("blocked_time");
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="lock-closed-outline" size={17} color="#F59E0B" style={styles.optionIcon} />
            <Text style={styles.optionText}>Add Blocked Time</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* 4. Business Closed Period */}
          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => {
              onClose();
              onSelectOption("closed_period");
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="business-outline" size={17} color="#EF4444" style={styles.optionIcon} />
            <Text style={styles.optionText}>Business Closed Period</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },
  dropdownCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 6,
    width: 235,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  optionIcon: {
    width: 20,
    textAlign: "center",
  },
  optionText: {
    fontSize: 14,
    fontFamily: "Manrope_600SemiBold",
    color: "#1E293B",
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginHorizontal: 12,
  },
});
