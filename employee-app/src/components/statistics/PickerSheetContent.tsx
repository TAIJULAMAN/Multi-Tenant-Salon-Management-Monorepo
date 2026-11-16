import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import DatePickerInput from "@/components/ui/DatePickerInput";
import { colors, fonts, radius, shadows } from "@/constants/figmaTheme";

/** Custom date range (From / To) – opened from "Custom Range" → "Select dates" and the Operation Statistics menu. */
export function CustomRangePicker({
  onApply,
}: {
  onApply: (from: string, to: string) => void;
}) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const valid = from.length > 0 && to.length > 0;

  return (
    <View>
      <DatePickerInput label="From" value={from} onChange={setFrom} placeholder="Start date" />
      <DatePickerInput label="To" value={to} onChange={setTo} placeholder="End date" />
      <TouchableOpacity
        style={[styles.applyBtn, valid ? shadows.primary : styles.applyBtnDisabled]}
        disabled={!valid}
        onPress={() => onApply(from, to)}
        activeOpacity={0.85}
      >
        <Text style={styles.applyText}>Apply</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  applyBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  applyBtnDisabled: {
    opacity: 0.5,
  },
  applyText: {
    fontSize: 14,
    lineHeight: 24,
    fontFamily: fonts.medium,
    color: colors.white,
  },
});
