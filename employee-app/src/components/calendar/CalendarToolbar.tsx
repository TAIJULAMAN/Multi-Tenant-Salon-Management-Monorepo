import React, { useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, radius } from "@/constants/figmaTheme";
import { CalendarViewMode, StaffMember } from "./types";
import { staffList } from "./data";
import { Anchor, SquareAvatar, measureAnchor } from "./ui";

interface Props {
  selectedStaffIds: string[];
  onOpenTeamFilter: (anchor: Anchor) => void;
  onOpenSearch?: () => void;
  dateLabel: string;
  onPrev: () => void;
  onNext: () => void;
  viewMode: CalendarViewMode;
  onChangeViewMode: (mode: CalendarViewMode) => void;
  onToggleFullscreen?: () => void;
  fullscreenActive?: boolean;
}

// Figma order: Month | Week | Day
const MODES: { key: CalendarViewMode; label: string }[] = [
  { key: "month", label: "Month" },
  { key: "week", label: "Week" },
  { key: "day", label: "Day" },
];

export function teamFilterLabel(ids: string[]): { label: string; member?: StaffMember } {
  if (ids.length === 0 || ids.length === staffList.length) return { label: "All Team" };
  if (ids.length === 1) {
    const member = staffList.find((s) => s.id === ids[0]);
    return { label: member?.name ?? "All Team", member };
  }
  return { label: `${ids.length} Members` };
}

/**
 * Calendar "title" bar (Figma): team dropdown (+ member search), event nav
 * (‹ date ›), Month/Week/Day time nav and the expand (full screen) button.
 * Two rows on mobile.
 */
export default function CalendarToolbar({
  selectedStaffIds,
  onOpenTeamFilter,
  onOpenSearch,
  dateLabel,
  onPrev,
  onNext,
  viewMode,
  onChangeViewMode,
  onToggleFullscreen,
  fullscreenActive,
}: Props) {
  const { label, member } = teamFilterLabel(selectedStaffIds);
  const teamRef = useRef<View>(null);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.leftGroup}>
          <View ref={teamRef} collapsable={false} style={{ flexShrink: 1 }}>
            <TouchableOpacity style={styles.teamBtn} onPress={() => measureAnchor(teamRef.current, onOpenTeamFilter)} activeOpacity={0.7}>
              {member ? (
                <SquareAvatar uri={member.avatar} name={member.name} size={24} bg={member.bgColor} rounded={6} />
              ) : (
                <View style={styles.teamIcon}>
                  <Ionicons name="people-outline" size={14} color={colors.primary} />
                </View>
              )}
              <Text style={styles.teamBtnText} numberOfLines={1}>
                {label}
              </Text>
              <Ionicons name="chevron-down" size={16} color={colors.text} />
            </TouchableOpacity>
          </View>

          {onOpenSearch && (
            <TouchableOpacity style={styles.iconBtn} onPress={onOpenSearch} activeOpacity={0.7}>
              <Ionicons name="search-outline" size={18} color={colors.text} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.segmented}>
          {MODES.map((m, i) => {
            const active = viewMode === m.key;
            return (
              <TouchableOpacity
                key={m.key}
                style={[styles.segmentBtn, i > 0 && styles.segmentDivider, active && styles.segmentBtnActive]}
                onPress={() => onChangeViewMode(m.key)}
                activeOpacity={0.7}
              >
                <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{m.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.dateNav}>
          <TouchableOpacity style={styles.navArrowBtn} onPress={onPrev} hitSlop={6}>
            <Ionicons name="chevron-back" size={16} color={colors.primary} />
          </TouchableOpacity>
          <View style={styles.dateLabelWrap}>
            <Text style={styles.dateNavText} numberOfLines={1}>
              {dateLabel}
            </Text>
          </View>
          <TouchableOpacity style={styles.navArrowBtn} onPress={onNext} hitSlop={6}>
            <Ionicons name="chevron-forward" size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {onToggleFullscreen && (
          <TouchableOpacity
            style={[styles.expandBtn, fullscreenActive && styles.expandBtnActive]}
            onPress={onToggleFullscreen}
            activeOpacity={0.7}
          >
            <Ionicons name="scan-outline" size={20} color={fullscreenActive ? colors.white : colors.text} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  leftGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexShrink: 1,
  },
  teamBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    height: 40,
    paddingHorizontal: 10,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    maxWidth: 170,
  },
  teamIcon: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  teamBtnText: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.text,
    flexShrink: 1,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
  },
  dateNav: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    height: 40,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    overflow: "hidden",
  },
  navArrowBtn: {
    width: 42,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  dateLabelWrap: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 6,
  },
  dateNavText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.primary,
  },
  segmented: {
    flexDirection: "row",
    height: 40,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    backgroundColor: colors.white,
  },
  segmentBtn: {
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  segmentDivider: {
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
  },
  segmentBtnActive: {
    backgroundColor: colors.primarySoft,
    borderLeftColor: colors.primarySoft,
  },
  segmentText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textSecondary,
  },
  segmentTextActive: {
    color: colors.textDark,
    fontFamily: fonts.medium,
  },
  expandBtn: {
    width: 44,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.borderLight,
    alignItems: "center",
    justifyContent: "center",
  },
  expandBtnActive: {
    backgroundColor: colors.text,
  },
});
