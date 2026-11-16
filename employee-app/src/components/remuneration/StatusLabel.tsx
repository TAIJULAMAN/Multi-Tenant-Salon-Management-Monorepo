import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, fonts, radius } from "@/constants/figmaTheme";
import { PayslipStatus } from "./remunerationData";

/** Figma "label": solid pill – Pending = yellow, Paid = green, white 12px text. */
export default function StatusLabel({ status }: { status: PayslipStatus }) {
  return (
    <View style={[styles.badge, { backgroundColor: status === "Paid" ? colors.green : colors.yellow }]}>
      <Text style={styles.text}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    height: 26,
    paddingHorizontal: 10,
    borderRadius: radius.pill,
    alignSelf: "flex-start",
    justifyContent: "center",
  },
  text: {
    fontFamily: fonts.medium,
    fontSize: 12,
    lineHeight: 16,
    color: colors.white,
  },
});
