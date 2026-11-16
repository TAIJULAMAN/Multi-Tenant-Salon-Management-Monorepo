import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  onOpenMenu: () => void;
  onAddAppointment: () => void;
}

export default function AppointmentSubHeader({
  onOpenMenu,
  onAddAppointment,
}: Props) {
  return (
    <View style={styles.subHeaderCard}>
      {/* Left: Title */}
      <Text style={styles.titleText}>Appointments</Text>

      {/* Right: 3-Dot Options Button & "+ Add Appointment" Button */}
      <View style={styles.rightActions}>
        <TouchableOpacity
          style={styles.menuIconBtn}
          activeOpacity={0.7}
          onPress={onOpenMenu}
        >
          <Ionicons name="ellipsis-vertical" size={17} color="#526B7A" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.addBtn}
          activeOpacity={0.8}
          onPress={onAddAppointment}
        >
          <Ionicons name="add" size={18} color="#FFFFFF" />
          <Text style={styles.addBtnText}>Add Appointment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  subHeaderCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EFF4FA",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  titleText: {
    fontFamily: "Manrope_700Bold",
    fontSize: 18,
    color: "#29343D",
    letterSpacing: -0.2,
  },
  rightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  menuIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E6EB",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#635BFF",
    paddingHorizontal: 12,
    height: 36,
    borderRadius: 8,
    gap: 4,
    shadowColor: "#635BFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  addBtnText: {
    fontFamily: "Manrope_700Bold",
    fontSize: 12.5,
    color: "#FFFFFF",
  },
});
