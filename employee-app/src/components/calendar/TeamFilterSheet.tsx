import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable, ScrollView, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, radius, shadows } from "@/constants/figmaTheme";
import { CURRENT_EMPLOYEE_ID, staffList } from "./data";
import { Anchor, SquareAvatar } from "./ui";

interface Props {
  visible: boolean;
  onClose: () => void;
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  /** Trigger position; the dropdown opens right under it (Figma 1:15219). */
  anchor?: Anchor | null;
}

/** "All Team" dropdown: checkbox + rounded avatar + name per member (Figma View Calendar team dropdown). */
export default function TeamFilterSheet({ visible, onClose, selectedIds, onChange, anchor }: Props) {
  const { width: sw, height: sh } = useWindowDimensions();
  const allSelected = selectedIds.length === staffList.length;

  const toggleAll = () => onChange(allSelected ? [CURRENT_EMPLOYEE_ID] : staffList.map((s) => s.id));

  const toggle = (id: string) => {
    if (selectedIds.includes(id)) {
      const next = selectedIds.filter((x) => x !== id);
      onChange(next.length === 0 ? [CURRENT_EMPLOYEE_ID] : next);
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const width = Math.min(260, sw - 32);
  const top = anchor ? anchor.y + anchor.height + 8 : 160;
  const left = anchor ? Math.max(16, Math.min(sw - width - 16, anchor.x)) : 16;
  const maxHeight = Math.max(200, sh - top - 40);

  const box = (checked: boolean) => (
    <View style={[styles.check, checked && styles.checkOn]}>
      {checked && <Ionicons name="checkmark" size={14} color={colors.white} />}
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      <View style={[styles.card, { top, left, width, maxHeight }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <TouchableOpacity style={styles.row} activeOpacity={0.7} onPress={toggleAll}>
            {box(allSelected)}
            <View style={styles.allIcon}>
              <Ionicons name="people-outline" size={22} color={colors.primary} />
            </View>
            <Text style={styles.name}>All Team</Text>
          </TouchableOpacity>

          {staffList.map((s) => {
            const checked = selectedIds.includes(s.id);
            return (
              <TouchableOpacity key={s.id} style={styles.row} activeOpacity={0.7} onPress={() => toggle(s.id)}>
                {box(checked)}
                <SquareAvatar uri={s.avatar} name={s.name} size={44} bg={s.bgColor} rounded={10} />
                <Text style={styles.name} numberOfLines={1}>
                  {s.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  card: {
    position: "absolute",
    backgroundColor: colors.white,
    borderRadius: radius.card,
    paddingVertical: 6,
    paddingHorizontal: 12,
    ...shadows.overlay,
    shadowOpacity: 0.18,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 6,
  },
  check: {
    width: 22,
    height: 22,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: colors.textMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  checkOn: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  allIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.text,
  },
});
