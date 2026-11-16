import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, radius } from "@/constants/figmaTheme";
import AppointmentDialog, { DialogButton, dialogStyles } from "../AppointmentDialog";
import { PAYMENT_METHODS, PaymentMethod, formatEuro } from "../appointmentData";

interface DividePaymentSheetProps {
  visible: boolean;
  amountDue: number;
  methods: PaymentMethod[]; // 2+ of Cash / Card Terminal / Online Payment
  onClose: () => void;
  onConfirm: (split: Partial<Record<PaymentMethod, number>>) => void;
}

const parse = (v: string) => parseFloat(v.replace(",", ".")) || 0;
const round2 = (n: number) => Math.round(n * 100) / 100;

export const METHOD_TINT: Record<PaymentMethod, { bg: string; fg: string }> = {
  Cash: { bg: "#E6F8EC", fg: colors.green },
  "Card Terminal": { bg: colors.tealSoft, fg: colors.teal },
  "Online Payment": { bg: "#EAF4FF", fg: colors.blue },
  "Gift Card": { bg: colors.primarySoft, fg: colors.primary },
};

/** Figma 1:27390 – "Divide Payment" (Two options column). */
export default function DividePaymentSheet({ visible, amountDue, methods, onClose, onConfirm }: DividePaymentSheetProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [prevVisible, setPrevVisible] = useState(visible);

  // Pre-fill an even split every time the dialog opens.
  if (visible !== prevVisible) {
    setPrevVisible(visible);
    if (visible && methods.length > 0) {
      const share = round2(amountDue / methods.length);
      const next: Record<string, string> = {};
      methods.forEach((m, i) => {
        next[m] = String(i === methods.length - 1 ? round2(amountDue - share * (methods.length - 1)) : share);
      });
      setValues(next);
    }
  }

  const allocated = round2(methods.reduce((acc, m) => acc + parse(values[m] ?? ""), 0));
  const diff = round2(amountDue - allocated);
  const isValid = diff === 0 && methods.every((m) => parse(values[m] ?? "") > 0);

  return (
    <AppointmentDialog
      visible={visible}
      title="Divide Payment"
      onClose={onClose}
      footer={
        <View style={dialogStyles.actionsRight}>
          <DialogButton label="Cancel" variant="secondary" onPress={onClose} />
          <DialogButton
            label="Confirm Payment"
            disabled={!isValid}
            onPress={() => onConfirm(Object.fromEntries(methods.map((m) => [m, parse(values[m] ?? "")])))}
          />
        </View>
      }
    >
      <View>
        <Text style={dialogStyles.label}>Total Amount</Text>
        <View style={[styles.amountBox, styles.amountBoxDisabled]}>
          <Text style={styles.disabledText}>{formatEuro(amountDue)}</Text>
        </View>
      </View>

      <View style={styles.grid}>
        {methods.map((m) => {
          const meta = PAYMENT_METHODS.find((p) => p.id === m)!;
          const tint = METHOD_TINT[m];
          return (
            <View key={m} style={styles.methodCard}>
              <View style={styles.methodHeader}>
                <View style={[styles.methodIcon, { backgroundColor: tint.bg }]}>
                  <Ionicons name={meta.icon as any} size={20} color={tint.fg} />
                </View>
                <Text style={styles.methodName}>{m}</Text>
              </View>
              <View style={styles.amountBox}>
                <Text style={styles.euro}>€</Text>
                <TextInput
                  style={styles.amountInput}
                  keyboardType="decimal-pad"
                  value={values[m] ?? ""}
                  onChangeText={(v) => setValues((prev) => ({ ...prev, [m]: v }))}
                  placeholder="0"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
            </View>
          );
        })}
      </View>

      {diff !== 0 && (
        <Text style={styles.error}>
          {diff > 0 ? `${formatEuro(diff)} still to be allocated` : `${formatEuro(-diff)} over the total amount`}
        </Text>
      )}
    </AppointmentDialog>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  methodCard: {
    flexGrow: 1,
    flexBasis: 200,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    padding: 16,
    gap: 12,
    backgroundColor: colors.white,
  },
  methodHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  methodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  methodName: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.text,
  },
  amountBox: {
    flexDirection: "row",
    alignItems: "center",
    height: 42,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    paddingHorizontal: 12,
  },
  amountBoxDisabled: {
    backgroundColor: colors.canvas,
  },
  disabledText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
  euro: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.text,
    marginRight: 4,
  },
  amountInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.text,
  },
  error: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.red,
  },
});
