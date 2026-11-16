import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable } from "react-native";
import { colors, fonts, radius, shadows } from "@/constants/figmaTheme";
import { CalAppointment } from "./types";
import { formatNumericDate, getStaffById } from "./data";
import { SquareAvatar, StatusBadge, ui } from "./ui";

interface Props {
  appointment: CalAppointment | null;
  onClose: () => void;
  onViewDetails: (appt: CalAppointment) => void;
}

/** Quick-look card (Figma 1:15219 widget over a calendar label): Date, Time, Service, Price, Duration, Employee. */
export default function AppointmentPreviewSheet({ appointment, onClose, onViewDetails }: Props) {
  const appt = appointment;
  if (!appt) return null;
  const staff = getStaffById(appt.staffId);

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.card}>
          <View style={styles.topRow}>
            <SquareAvatar uri={appt.clientAvatar} name={appt.clientName} size={48} rounded={24} bg={colors.pinkSoft} />
            <Text style={styles.clientName} numberOfLines={1}>
              {appt.clientName}
            </Text>
            <StatusBadge status={appt.status} />
          </View>

          <View style={styles.grid}>
            <Info label="Date" value={formatNumericDate(appt.date)} />
            <Info label="Time" value={`${appt.startTime} - ${appt.endTime}`} />
            <Info label="Service" value={appt.service} />
            <Info label="Price" value={appt.price} />
            <Info label="Duration" value={appt.duration} />
            <View style={styles.cell}>
              <Text style={styles.label}>Employee</Text>
              <View style={styles.employeeRow}>
                <SquareAvatar uri={staff.avatar} name={staff.name} size={24} bg={staff.bgColor} rounded={6} />
                <Text style={styles.value} numberOfLines={1}>
                  {staff.name}
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={[ui.primaryBtn, { marginTop: 18 }]}
            activeOpacity={0.85}
            onPress={() => {
              onClose();
              onViewDetails(appt);
            }}
          >
            <Text style={ui.primaryBtnText}>View Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.cell}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(41, 52, 61, 0.25)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.card,
    padding: 20,
    ...shadows.overlay,
    shadowOpacity: 0.2,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  clientName: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 16,
    color: colors.text,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 18,
    rowGap: 14,
  },
  cell: {
    width: "50%",
    paddingRight: 8,
  },
  label: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 2,
  },
  value: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.text,
    flexShrink: 1,
  },
  employeeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
