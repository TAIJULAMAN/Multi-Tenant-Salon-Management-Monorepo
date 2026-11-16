import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, radius, shadows } from "@/constants/figmaTheme";
import { Anchor } from "./ui";

interface Props {
  visible: boolean;
  onClose: () => void;
  anchor?: Anchor | null;
  onOpenSettings: (tab: "general" | "notifications") => void;
  onOpenImport: () => void;
  onExportData: () => void;
}

const MENU_W = 200;
const SUB_W = 230;

/**
 * Figma 1:18786 3-dot dropdown: "Settings ›" (submenu: General settings /
 * Notifications & Communication), "Import Appointments", "Export Data".
 * The submenu opens under the Settings row on mobile (no room to the side).
 */
export default function CalendarMenuModal({ visible, onClose, anchor, onOpenSettings, onOpenImport, onExportData }: Props) {
  const { width: sw } = useWindowDimensions();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const close = () => {
    setSettingsOpen(false);
    onClose();
  };
  const run = (fn: () => void) => {
    close();
    fn();
  };

  // Right-align under the ⋮ button, but keep both cards fully on screen.
  const clampLeft = (x: number, w: number) => Math.min(Math.max(12, x), sw - w - 12);
  const top = anchor ? anchor.y + anchor.height + 6 : 120;
  const left = clampLeft(anchor ? anchor.x + anchor.width - MENU_W : sw - MENU_W - 16, MENU_W);
  const subLeft = clampLeft(left + 24, SUB_W);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={close}>
      <Pressable style={StyleSheet.absoluteFill} onPress={close} />
      <View style={[styles.card, { top, left, width: MENU_W }]}>
        <TouchableOpacity
          style={[styles.item, settingsOpen && styles.itemActive]}
          activeOpacity={0.7}
          onPress={() => setSettingsOpen(!settingsOpen)}
        >
          <Text style={styles.itemText}>Settings</Text>
          <Ionicons name={settingsOpen ? "chevron-down" : "chevron-forward"} size={16} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.item} activeOpacity={0.7} onPress={() => run(onOpenImport)}>
          <Text style={styles.itemText}>Import Appointments</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item} activeOpacity={0.7} onPress={() => run(onExportData)}>
          <Text style={styles.itemText}>Export Data</Text>
        </TouchableOpacity>
      </View>

      {settingsOpen && (
        <View style={[styles.card, { top: top + 46, left: subLeft, width: SUB_W }]}>
          <TouchableOpacity style={styles.item} activeOpacity={0.7} onPress={() => run(() => onOpenSettings("general"))}>
            <Text style={styles.itemText}>General settings</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.item}
            activeOpacity={0.7}
            onPress={() => run(() => onOpenSettings("notifications"))}
          >
            <Text style={styles.itemText}>Notifications & Communication</Text>
          </TouchableOpacity>
        </View>
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  card: {
    position: "absolute",
    backgroundColor: colors.white,
    borderRadius: radius.card,
    paddingVertical: 8,
    ...shadows.overlay,
    shadowOpacity: 0.18,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 36,
    paddingHorizontal: 14,
  },
  itemActive: {
    backgroundColor: colors.primaryTint,
  },
  itemText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.text,
  },
});
