import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  colors,
  fonts,
  radius,
  shadows,
  typography,
} from "@/constants/figmaTheme";

interface PeriodDropdownProps<T extends string> {
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
}

/** "Monthly ▾" dropdown used in the dashboard widget headers (Figma "Btn" 36px, white, border). */
export function PeriodDropdown<T extends string>({
  value,
  options,
  onChange,
}: PeriodDropdownProps<T>) {
  const [open, setOpen] = useState(false);

  return (
    <View style={[styles.dropdownWrapper, open && styles.dropdownWrapperOpen]}>
      <TouchableOpacity
        style={styles.dropdownBtn}
        onPress={() => setOpen((o) => !o)}
        activeOpacity={0.7}
      >
        <Text style={styles.dropdownBtnText}>{value}</Text>
        <Ionicons
          name={open ? "chevron-up" : "chevron-down"}
          size={16}
          color={colors.textDark}
        />
      </TouchableOpacity>

      {open && (
        <View style={styles.dropdownMenu}>
          {options.map((p) => {
            const active = p === value;
            return (
              <TouchableOpacity
                key={p}
                style={styles.dropdownMenuItem}
                onPress={() => {
                  onChange(p);
                  setOpen(false);
                }}
              >
                <Text
                  style={[
                    styles.dropdownMenuText,
                    active && styles.dropdownMenuTextActive,
                  ]}
                >
                  {p}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}

export function OutlineButton({
  title,
  onPress,
}: {
  title: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.outlineBtn}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.outlineBtnText}>{title}</Text>
    </TouchableOpacity>
  );
}

export function ExportDataButton({ onPress }: { onPress: () => void }) {
  return <OutlineButton title="Export Data" onPress={onPress} />;
}

/** Floating chart tooltip (Figma "info" card: white, r=8, soft shadow). */
export const tooltipStyle = StyleSheet.create({
  card: {
    position: "absolute",
    backgroundColor: colors.white,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
    shadowColor: "#AFB6C9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  labelWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 13,
    lineHeight: 18,
    color: colors.text,
  },
  value: {
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textMuted,
  },
});

export const dashboardCardStyle = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.card,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    ...shadows.card,
  },
  headerRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    rowGap: 12,
    columnGap: 8,
    zIndex: 20,
  },
  titleBlock: {
    flexGrow: 1,
    flexShrink: 1,
    minWidth: 130,
  },
  title: {
    ...typography.cardTitle,
    fontFamily: fonts.medium,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textMuted,
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    zIndex: 20,
  },
});

const styles = StyleSheet.create({
  dropdownWrapper: {
    position: "relative",
    zIndex: 20,
  },
  dropdownWrapperOpen: {
    zIndex: 40,
  },
  dropdownBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    height: 36,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    backgroundColor: colors.white,
  },
  dropdownBtnText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textDark,
  },
  dropdownMenu: {
    position: "absolute",
    top: 42,
    right: 0,
    minWidth: 120,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    paddingVertical: 6,
    zIndex: 50,
    ...shadows.overlay,
    shadowOpacity: 0.15,
  },
  dropdownMenuItem: {
    paddingVertical: 4,
    paddingHorizontal: 14,
    minHeight: 28,
    justifyContent: "center",
  },
  dropdownMenuText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.text,
  },
  dropdownMenuTextActive: {
    color: colors.primary,
    fontFamily: fonts.medium,
  },
  outlineBtn: {
    height: 36,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
  },
  outlineBtnText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.primary,
  },
});
