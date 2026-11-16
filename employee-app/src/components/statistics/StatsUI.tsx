import React, { useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle, StyleProp } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, radius, shadows } from "@/constants/figmaTheme";
import { DropdownAnchor, measureDropdownAnchor } from "./StatsDropdown";

/** White widget card (Figma: bg white, r=12, card shadow). `bordered` = outlined variant used by the metrics cards. */
export function StatsCard({
  children,
  style,
  bordered = false,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  bordered?: boolean;
}) {
  return <View style={[styles.card, bordered ? styles.cardBordered : shadows.card, style]}>{children}</View>;
}

/** Figma "dropdown" field: white, 1px #E0E6EB border, r=8, h=36, 12px text + chevron. */
export function DropdownPill({
  label,
  onOpen,
  icon = "chevron-down",
  style,
}: {
  label: string;
  onOpen: (anchor: DropdownAnchor) => void;
  icon?: keyof typeof Ionicons.glyphMap;
  style?: StyleProp<ViewStyle>;
}) {
  const ref = useRef<View>(null);
  return (
    <View ref={ref} collapsable={false} style={style}>
      <TouchableOpacity
        style={styles.pill}
        onPress={() => measureDropdownAnchor(ref, onOpen)}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={label}
      >
        <Text style={styles.pillText} numberOfLines={1}>
          {label}
        </Text>
        <Ionicons name={icon} size={icon === "chevron-down" ? 16 : 18} color={colors.text} />
      </TouchableOpacity>
    </View>
  );
}

export function StatusBadge({
  label,
  variant,
}: {
  label: string;
  variant: "success" | "goal" | "danger";
}) {
  const palette =
    variant === "goal"
      ? { bg: colors.teal, text: colors.white }
      : variant === "success"
      ? { bg: "#EBFBF1", text: colors.green }
      : { bg: colors.pinkSoft, text: colors.pink };
  return (
    <View style={[styles.badge, { backgroundColor: palette.bg }]}>
      <Text style={[styles.badgeText, { color: palette.text }]}>{label}</Text>
    </View>
  );
}

export function TooltipRow({
  label,
  value,
  color = colors.text,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <View style={styles.tooltipRow}>
      <Text style={[styles.tooltipLabel, { color }]}>{label}</Text>
      <Text style={styles.tooltipValue}>{value}</Text>
    </View>
  );
}

export const tooltipStyles = StyleSheet.create({
  box: {
    position: "absolute",
    backgroundColor: colors.white,
    borderRadius: radius.md,
    paddingHorizontal: 10,
    paddingVertical: 8,
    shadowColor: "#AFB6C9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  title: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.medium,
    color: colors.text,
  },
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.card,
    padding: 20,
  },
  cardBordered: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    paddingHorizontal: 15,
    height: 36,
  },
  pillText: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.medium,
    color: colors.text,
    flexShrink: 1,
  },
  badge: {
    height: 24,
    paddingHorizontal: 8,
    borderRadius: radius.pill,
    alignSelf: "flex-start",
    justifyContent: "center",
  },
  badgeText: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.regular,
  },
  tooltipRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 8,
  },
  tooltipLabel: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.medium,
  },
  tooltipValue: {
    fontSize: 10,
    lineHeight: 14,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
});
