import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomBottomSheet from "@/components/ui/CustomBottomSheet";
import { colors, fonts, radius } from "@/constants/figmaTheme";
import { SquareAvatar } from "./ServiceCard";

export interface SheetOption {
  value: string;
  label: string;
  subtitle?: string;
  avatar?: string;
}

interface OptionSheetProps {
  visible: boolean;
  title: string;
  options: SheetOption[];
  selected?: string;
  onSelect: (value: string) => void;
  onClose: () => void;
}

/** Single-choice list inside a bottom sheet (status, employee, reason pickers). */
export default function OptionSheet({
  visible,
  title,
  options,
  selected,
  onSelect,
  onClose,
}: OptionSheetProps) {
  return (
    <CustomBottomSheet visible={visible} onClose={onClose} title={title}>
      <View style={styles.list}>
        {options.map((opt) => {
          const isSelected = opt.value === selected;
          return (
            <TouchableOpacity
              key={opt.value}
              style={[styles.row, isSelected && styles.rowActive]}
              onPress={() => {
                onSelect(opt.value);
                onClose();
              }}
              activeOpacity={0.7}
            >
              {opt.avatar !== undefined && <SquareAvatar uri={opt.avatar} size={36} />}
              <View style={{ flex: 1, marginLeft: opt.avatar !== undefined ? 12 : 0 }}>
                <Text style={[styles.label, isSelected && styles.labelActive]}>{opt.label}</Text>
                {opt.subtitle ? <Text style={styles.subtitle}>{opt.subtitle}</Text> : null}
              </View>
              <Ionicons
                name={isSelected ? "checkmark-circle" : "ellipse-outline"}
                size={22}
                color={isSelected ? colors.primary : colors.border}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </CustomBottomSheet>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  rowActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryTint,
  },
  label: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.text,
  },
  labelActive: {
    fontFamily: fonts.semibold,
    color: colors.primary,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    marginTop: 1,
  },
});
