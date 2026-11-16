import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, radius, shadows } from "@/constants/figmaTheme";
import { PICKER_MONTHS, MONTHS, YEARS } from "./statisticsData";

export interface DropdownAnchor {
  x: number;
  y: number;
  width: number;
  height: number;
}

const SCREEN_MARGIN = 16;
const GAP = 8;

/** Measures the trigger in window coordinates so the menu can open right under it (as in Figma). */
export function measureDropdownAnchor(
  ref: React.RefObject<View | null>,
  cb: (anchor: DropdownAnchor) => void
) {
  const node = ref.current;
  if (!node) return;
  node.measureInWindow((x, y, width, height) => cb({ x, y, width, height }));
}

/**
 * Floating dropdown card (Figma: white, r=12, overlay shadow, no backdrop dim),
 * right-aligned to its trigger and opened below it — or above when there is no room.
 */
export function DropdownPopover({
  visible,
  anchor,
  width,
  onClose,
  children,
}: {
  visible: boolean;
  anchor: DropdownAnchor | null;
  width: number;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const { width: screenW, height: screenH } = Dimensions.get("window");
  const cardWidth = Math.min(width, screenW - SCREEN_MARGIN * 2);

  let left = SCREEN_MARGIN;
  let top: number | undefined;
  let bottom: number | undefined;
  let maxHeight = screenH * 0.6;

  if (anchor) {
    left = anchor.x + anchor.width - cardWidth;
    left = Math.min(Math.max(SCREEN_MARGIN, left), screenW - SCREEN_MARGIN - cardWidth);
    const spaceBelow = screenH - (anchor.y + anchor.height + GAP) - 24;
    const spaceAbove = anchor.y - GAP - 48;
    if (spaceBelow >= 260 || spaceBelow >= spaceAbove) {
      top = anchor.y + anchor.height + GAP;
      maxHeight = spaceBelow;
    } else {
      bottom = screenH - anchor.y + GAP;
      maxHeight = spaceAbove;
    }
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Close menu" />
      <View style={[styles.card, { width: cardWidth, left, top, bottom, maxHeight }]}>
        {children}
      </View>
    </Modal>
  );
}

/** Figma "option" row: 14px regular text, active row tinted #EFF4FA. */
export function DropdownOption({
  label,
  active,
  chevron,
  onPress,
}: {
  label: string;
  active?: boolean;
  chevron?: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.option, active && styles.optionActive]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="menuitem"
      accessibilityState={{ selected: !!active }}
    >
      <Text style={styles.optionText}>{label}</Text>
      {chevron && <Ionicons name="chevron-forward" size={16} color={colors.text} />}
    </TouchableOpacity>
  );
}

export function DropdownOptionList({
  options,
  value,
  onSelect,
  chevron,
}: {
  options: readonly string[];
  value?: string;
  onSelect: (option: string) => void;
  chevron?: boolean;
}) {
  return (
    <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
      {options.map((opt) => (
        <DropdownOption
          key={opt}
          label={opt}
          active={opt === value}
          chevron={chevron}
          onPress={() => onSelect(opt)}
        />
      ))}
    </ScrollView>
  );
}

/**
 * Month picker panel from Figma 1:35342:
 * ‹ 2020 2021 [2022] 2023 2024 › year strip, divider, then January…December.
 */
export function MonthPickerPanel({
  initialYear,
  selectedMonth,
  onSelect,
}: {
  initialYear: string;
  selectedMonth?: string;
  onSelect: (month: string, year: string) => void;
}) {
  const VISIBLE = 5;
  const maxOffset = Math.max(0, YEARS.length - VISIBLE);
  const [year, setYear] = useState(initialYear);
  const [offset, setOffset] = useState(() =>
    Math.min(maxOffset, Math.max(0, YEARS.indexOf(initialYear) - (VISIBLE - 1)))
  );
  const visibleYears = YEARS.slice(offset, offset + VISIBLE);

  return (
    <View style={styles.panel}>
      <View style={styles.yearStrip}>
        <TouchableOpacity
          disabled={offset === 0}
          onPress={() => setOffset(offset - 1)}
          hitSlop={10}
          accessibilityLabel="Previous years"
        >
          <Ionicons name="chevron-back" size={16} color={offset === 0 ? colors.border : colors.text} />
        </TouchableOpacity>
        {visibleYears.map((y) => {
          const active = y === year;
          return (
            <TouchableOpacity
              key={y}
              style={[styles.yearChip, active && styles.yearChipActive]}
              onPress={() => setYear(y)}
              accessibilityState={{ selected: active }}
            >
              <Text style={styles.yearText}>{y}</Text>
            </TouchableOpacity>
          );
        })}
        <TouchableOpacity
          disabled={offset >= maxOffset}
          onPress={() => setOffset(offset + 1)}
          hitSlop={10}
          accessibilityLabel="Next years"
        >
          <Ionicons
            name="chevron-forward"
            size={16}
            color={offset >= maxOffset ? colors.border : colors.text}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.panelDivider} />
      <ScrollView bounces={false} showsVerticalScrollIndicator={false} style={styles.monthList}>
        {PICKER_MONTHS.map((label, i) => (
          <DropdownOption
            key={label}
            label={label}
            active={MONTHS[i] === selectedMonth}
            onPress={() => onSelect(MONTHS[i], year)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    position: "absolute",
    backgroundColor: colors.white,
    borderRadius: radius.card,
    padding: 8,
    overflow: "visible",
    ...shadows.overlay,
    shadowOpacity: 0.25,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 36,
    paddingHorizontal: 14,
    borderRadius: radius.sm,
  },
  optionActive: {
    backgroundColor: colors.borderLight,
  },
  optionText: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.regular,
    color: colors.text,
  },
  panel: {
    paddingHorizontal: 8,
    paddingTop: 8,
    flexShrink: 1,
  },
  yearStrip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  yearChip: {
    height: 28,
    paddingHorizontal: 8,
    borderRadius: radius.md,
    justifyContent: "center",
  },
  yearChipActive: {
    backgroundColor: colors.primarySoft,
  },
  yearText: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.regular,
    color: colors.text,
  },
  panelDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginTop: 8,
    marginBottom: 8,
  },
  monthList: {
    marginHorizontal: -8,
    flexShrink: 1,
  },
});
