import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, radius } from "@/constants/figmaTheme";
import AppointmentDialog, { DialogButton, dialogStyles } from "../AppointmentDialog";
import { SquareAvatar } from "../ServiceCard";
import { AppointmentClient } from "../appointmentData";

export interface OnlineContact {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface OnlinePaymentSheetProps {
  visible: boolean;
  client: AppointmentClient;
  onClose: () => void;
  onSend: (contact: OnlineContact) => void;
}

const splitName = (name: string) => {
  const [first, ...rest] = name.trim().split(" ");
  return { first: first ?? "", last: rest.join(" ") };
};

/**
 * Figma 1:29742 (client details read-only, pencil to edit) →
 * 1:27565 (fields editable) – "Send invitation to pay".
 */
export default function OnlinePaymentSheet({ visible, client, onClose, onSend }: OnlinePaymentSheetProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<OnlineContact>({ firstName: "", lastName: "", email: "", phone: "" });
  const [prevVisible, setPrevVisible] = useState(visible);

  if (visible !== prevVisible) {
    setPrevVisible(visible);
    if (visible) {
      const { first, last } = splitName(client.name);
      setIsEditing(false);
      setForm({ firstName: first, lastName: last, email: client.email, phone: client.phone });
    }
  }

  const set = (key: keyof OnlineContact) => (v: string) => setForm((f) => ({ ...f, [key]: v }));
  const isValid =
    !!form.firstName.trim() &&
    !!form.lastName.trim() &&
    /\S+@\S+\.\S+/.test(form.email) &&
    form.phone.replace(/\D/g, "").length >= 8;

  const field = (label: string, key: keyof OnlineContact, extra?: Partial<React.ComponentProps<typeof TextInput>>) => (
    <View style={styles.field}>
      <Text style={dialogStyles.label}>{label} *</Text>
      <TextInput
        style={[dialogStyles.input, !isEditing && dialogStyles.inputDisabled]}
        value={form[key]}
        editable={isEditing}
        onChangeText={set(key)}
        placeholderTextColor={colors.textMuted}
        {...extra}
      />
    </View>
  );

  return (
    <AppointmentDialog
      visible={visible}
      title="Online Payment"
      onClose={onClose}
      footer={
        <View style={dialogStyles.actionsRight}>
          <DialogButton label="Send invitation to pay" disabled={!isValid} onPress={() => onSend(form)} />
        </View>
      }
    >
      <View style={styles.box}>
        <View style={styles.clientRow}>
          <SquareAvatar uri={client.avatar} size={48} />
          <Text style={styles.clientName} numberOfLines={1}>
            {`${form.firstName} ${form.lastName}`.trim()}
          </Text>
          {!isEditing && (
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => setIsEditing(true)}
              activeOpacity={0.7}
              accessibilityLabel="Edit client details"
            >
              <Ionicons name="pencil-outline" size={16} color={colors.teal} />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.grid}>
          {field("First Name", "firstName")}
          {field("Last Name", "lastName")}
          {field("E-mail", "email", { keyboardType: "email-address", autoCapitalize: "none" })}
          {field("Phone", "phone", { keyboardType: "phone-pad" })}
        </View>
      </View>
    </AppointmentDialog>
  );
}

const styles = StyleSheet.create({
  box: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    padding: 16,
    gap: 16,
  },
  clientRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  clientName: {
    flex: 1,
    fontSize: 15,
    fontFamily: fonts.medium,
    color: colors.text,
  },
  editBtn: {
    width: 48,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.borderLight,
    alignItems: "center",
    justifyContent: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  field: {
    flexGrow: 1,
    flexBasis: 200,
  },
});
