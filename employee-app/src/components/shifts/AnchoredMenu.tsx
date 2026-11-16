import React from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity, Pressable, Dimensions, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, radius, shadows } from "@/constants/figmaTheme";

/** Window coordinates of the element the menu hangs from. */
export interface MenuAnchor {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface MenuOption {
  key: string;
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  selected?: boolean;
}

interface AnchoredMenuProps {
  visible: boolean;
  anchor: MenuAnchor | null;
  options: MenuOption[];
  onClose: () => void;
  onSelect: (key: string) => void;
  /** Fixed width; when omitted the menu stretches to the anchor width (dropdown fields). */
  width?: number;
  /** "right" aligns the menu's right edge with the anchor (header buttons), "left" its left edge. */
  align?: "left" | "right";
}

const ITEM_HEIGHT = 36;
const MAX_HEIGHT = 280;

/** Measures a view in window coordinates. */
export const measureAnchor = (ref: React.RefObject<View | null>, cb: (anchor: MenuAnchor) => void) => {
  const node = ref.current;
  if (!node) {
    cb({ x: 16, y: 200, width: 200, height: 40 });
    return;
  }
  node.measureInWindow((x, y, width, height) => cb({ x, y, width, height }));
};

/** Figma dropdown card: white, r=8, overlay shadow, plain 14px rows (Add menu, shift menu, select fields). */
export default function AnchoredMenu({
  visible,
  anchor,
  options,
  onClose,
  onSelect,
  width,
  align = "left",
}: AnchoredMenuProps) {
  const { width: screenW, height: screenH } = Dimensions.get("window");
  const a = anchor ?? { x: 16, y: 200, width: 200, height: 40 };
  const menuW = Math.min(width ?? a.width, screenW - 32);
  const menuH = Math.min(options.length * ITEM_HEIGHT + 16, MAX_HEIGHT);
  let left = align === "right" ? a.x + a.width - menuW : a.x;
  left = Math.max(16, Math.min(left, screenW - menuW - 16));
  let top = a.y + a.height + 6;
  if (top + menuH > screenH - 24) top = Math.max(24, a.y - menuH - 6);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={[styles.card, { width: menuW, top, left, maxHeight: MAX_HEIGHT }]}>
          <ScrollView bounces={false} showsVerticalScrollIndicator={options.length * ITEM_HEIGHT > MAX_HEIGHT}>
            {options.map((opt) => (
              <TouchableOpacity
                key={opt.key}
                style={[styles.optionItem, opt.selected && styles.optionItemSelected]}
                onPress={() => {
                  onClose();
                  onSelect(opt.key);
                }}
                activeOpacity={0.7}
              >
                {opt.icon && <Ionicons name={opt.icon} size={16} color={opt.iconColor ?? colors.text} />}
                <Text style={[styles.optionText, opt.selected && styles.optionTextSelected]} numberOfLines={1}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  card: {
    position: "absolute",
    backgroundColor: colors.white,
    borderRadius: radius.md,
    paddingVertical: 8,
    ...shadows.overlay,
    shadowOpacity: 0.18,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    height: ITEM_HEIGHT,
    paddingHorizontal: 14,
  },
  optionItemSelected: {
    backgroundColor: colors.primaryTint,
  },
  optionText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.text,
    flexShrink: 1,
  },
  optionTextSelected: {
    color: colors.primary,
    fontFamily: fonts.medium,
  },
});
