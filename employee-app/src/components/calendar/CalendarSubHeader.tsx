import React, { useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { colors, fonts, radius, shadows } from "@/constants/figmaTheme";
import { Anchor, measureAnchor } from "./ui";

/** "calendar" = Calendar View, "list" = Table View. ("team" kept for the legacy route.) */
export type CalendarSection = "calendar" | "list" | "team";

interface Props {
  active: CalendarSection;
  title?: string;
  onOpenMenu: (anchor: Anchor) => void;
  onAddAppointment: () => void;
  /** Extra rows inside the title card (Table View: Status chips + search). */
  children?: React.ReactNode;
}

const VIEWS: { key: "calendar" | "list"; label: string; route: string }[] = [
  { key: "calendar", label: "Calendar View", route: "/(drawer)/(tabs)/calendar" },
  { key: "list", label: "Table View", route: "/(drawer)/(tabs)/calendar/appointments" },
];

/** Figma "Appointments" title card: Calendar View / Table View, 3-dot options and "+ Add Appointment". */
export default function CalendarSubHeader({ active, title = "Appointments", onOpenMenu, onAddAppointment, children }: Props) {
  const menuRef = useRef<View>(null);
  const current = active === "team" ? "list" : active;

  const goTo = (key: "calendar" | "list", route: string) => {
    if (key === current) return;
    if (key === "calendar") {
      if (router.canGoBack()) router.back();
      else router.replace(route as any);
      return;
    }
    router.push(route as any);
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.card}>
        <View style={styles.titleRow}>
          <Text style={styles.titleText} numberOfLines={1}>
            {title}
          </Text>
          <View style={styles.rightActions}>
            <View ref={menuRef} collapsable={false}>
              <TouchableOpacity style={styles.menuIconBtn} activeOpacity={0.7} onPress={() => measureAnchor(menuRef.current, onOpenMenu)}>
                <Ionicons name="ellipsis-vertical" size={18} color={colors.text} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.addBtn} activeOpacity={0.85} onPress={onAddAppointment}>
              <Ionicons name="add" size={18} color={colors.white} />
              <Text style={styles.addBtnText}>Add Appointment</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.viewToggle}>
          {VIEWS.map((v, i) => {
            const isActive = v.key === current;
            return (
              <TouchableOpacity
                key={v.key}
                style={[styles.viewToggleBtn, i > 0 && styles.toggleDivider, isActive && styles.viewToggleBtnActive]}
                onPress={() => goTo(v.key, v.route)}
                activeOpacity={0.7}
              >
                <Text style={[styles.viewToggleText, isActive && styles.viewToggleTextActive]}>{v.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.canvas,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.card,
    padding: 14,
    gap: 12,
    ...shadows.card,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  titleText: {
    fontFamily: fonts.bold,
    fontSize: 16,
    lineHeight: 22,
    color: colors.text,
    flexShrink: 1,
  },
  rightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  viewToggle: {
    flexDirection: "row",
    height: 40,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  viewToggleBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  toggleDivider: {
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
  },
  viewToggleBtnActive: {
    backgroundColor: colors.primarySoft,
  },
  viewToggleText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.text,
  },
  viewToggleTextActive: {
    color: colors.primary,
  },
  menuIconBtn: {
    width: 44,
    height: 40,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.borderLight,
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    height: 40,
    borderRadius: radius.md,
    gap: 6,
  },
  addBtnText: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.white,
  },
});
