import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, radius } from "@/constants/figmaTheme";
import AppointmentDialog, { DialogButton, dialogStyles } from "./AppointmentDialog";
import { DropdownMenu } from "./PopoverMenu";
import { CANCEL_REASONS } from "./appointmentData";

interface CancelAppointmentDialogProps {
  visible: boolean;
  onClose: () => void;
  onSave: (reason: string) => void;
}

/** Figma 1:25926 (dialog) + 1:26361 (reason dropdown open). */
export default function CancelAppointmentDialog({ visible, onClose, onSave }: CancelAppointmentDialogProps) {
  const [reason, setReason] = useState(CANCEL_REASONS[0]);
  const [prevVisible, setPrevVisible] = useState(visible);

  if (visible !== prevVisible) {
    setPrevVisible(visible);
    if (visible) setReason(CANCEL_REASONS[0]);
  }

  return (
    <AppointmentDialog
      visible={visible}
      title="Cancel Appointment"
      subtitle="Are you sure you want to cancel this appointment?"
      onClose={onClose}
      footer={
        <View style={dialogStyles.actionsRight}>
          <DialogButton label="Save" onPress={() => onSave(reason)} />
        </View>
      }
    >
      <View>
        <Text style={dialogStyles.label}>Reason *</Text>
        <DropdownMenu
          matchWidth
          items={CANCEL_REASONS.map((r) => ({ label: r, selected: r === reason, onPress: () => setReason(r) }))}
          renderTrigger={(open) => (
            <TouchableOpacity style={styles.select} onPress={open} activeOpacity={0.7}>
              <Text style={styles.selectText}>{reason}</Text>
              <Ionicons name="chevron-down" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        />
      </View>
    </AppointmentDialog>
  );
}

const styles = StyleSheet.create({
  select: {
    height: 42,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
});
