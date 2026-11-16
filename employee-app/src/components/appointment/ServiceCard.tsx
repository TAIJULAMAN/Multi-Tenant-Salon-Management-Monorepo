import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, radius } from "@/constants/figmaTheme";
import { AppointmentService, formatDate, formatEuro, getStaff } from "./appointmentData";

interface ServiceCardProps {
  service: AppointmentService;
  date: string; // ISO
  onPressEmployee?: () => void;
  onRemove?: () => void;
}

/**
 * Mobile version of the desktop services table row:
 * Service · Date · Price · Start Time · Duration · Employee (+ trash in edit mode).
 */
export default function ServiceCard({ service, date, onPressEmployee, onRemove }: ServiceCardProps) {
  const employee = getStaff(service.employeeId);

  return (
    <View style={styles.card}>
      <View style={styles.grid}>
        <Cell label="Service" value={service.name} strong />
        <Cell label="Date" value={formatDate(date)} />
        <Cell label="Price" value={formatEuro(service.price)} />
        <Cell label="Start Time" value={service.startTime} />
        <Cell label="Duration" value={`${service.duration} min`} />
      </View>

      <Text style={styles.header}>Employee</Text>
      <View style={styles.employeeRow}>
        <TouchableOpacity
          style={styles.employeeChip}
          onPress={onPressEmployee}
          disabled={!onPressEmployee}
          activeOpacity={0.7}
        >
          <SquareAvatar uri={employee.avatar} size={40} />
          <Text style={styles.employeeText} numberOfLines={1}>
            {employee.name}
          </Text>
          <Ionicons name="chevron-down" size={20} color={colors.text} />
        </TouchableOpacity>
        {onRemove && (
          <TouchableOpacity
            style={styles.trashBtn}
            onPress={onRemove}
            activeOpacity={0.7}
            accessibilityLabel={`Remove ${service.name}`}
          >
            <Ionicons name="trash-outline" size={22} color={colors.pink} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

function Cell({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <View style={styles.cell}>
      <Text style={styles.header}>{label}</Text>
      <Text style={[styles.value, strong && styles.valueStrong]}>{value}</Text>
    </View>
  );
}

export function SquareAvatar({ uri, size = 48 }: { uri?: string; size?: number }) {
  return (
    <Image
      source={uri ? { uri } : undefined}
      style={{ width: size, height: size, borderRadius: radius.md, backgroundColor: colors.pinkSoft }}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    padding: 16,
    backgroundColor: colors.white,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 14,
    marginBottom: 14,
  },
  cell: {
    width: "33.33%",
    paddingRight: 8,
  },
  header: {
    fontSize: 14,
    lineHeight: 19,
    fontFamily: fonts.semibold,
    color: colors.text,
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.regular,
    color: colors.text,
  },
  valueStrong: {
    fontFamily: fonts.semibold,
  },
  employeeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 4,
  },
  employeeChip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.borderLight,
    borderRadius: radius.md,
    padding: 8,
    paddingRight: 12,
  },
  employeeText: {
    flex: 1,
    fontSize: 15,
    fontFamily: fonts.semibold,
    color: colors.text,
  },
  trashBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});
