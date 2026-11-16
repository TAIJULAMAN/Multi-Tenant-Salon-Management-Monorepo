import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  Dimensions,
  StyleProp,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, radius, shadows } from "@/constants/figmaTheme";

export interface MenuItem {
  label: string;
  onPress: () => void;
  selected?: boolean;
}

interface DropdownMenuProps {
  items: MenuItem[];
  /** Renders the trigger; call `open` to show the menu anchored to it. */
  renderTrigger: (open: () => void) => React.ReactNode;
  /** Stretch the menu to the trigger width (select fields). */
  matchWidth?: boolean;
  /** Align the menu with the trigger's right edge instead of its left edge. */
  alignRight?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** Figma "dropdown" – white card with plain text options anchored under its trigger. */
export function DropdownMenu({ items, renderTrigger, matchWidth, alignRight, style }: DropdownMenuProps) {
  // Callback-ref in state (not useRef) so the trigger can be measured from the open handler.
  const [node, setNode] = useState<View | null>(null);
  const [anchor, setAnchor] = useState<{ x: number; y: number; w: number; h: number } | null>(null);

  const open = () => {
    node?.measureInWindow((x, y, w, h) => setAnchor({ x, y, w, h }));
  };
  const close = () => setAnchor(null);

  const screen = Dimensions.get("window");
  const estHeight = items.length * 36 + 16;
  let position: ViewStyle = {};
  if (anchor) {
    const below = anchor.y + anchor.h + 6;
    const top = below + estHeight > screen.height - 24 ? Math.max(24, anchor.y - estHeight - 6) : below;
    // Right-aligned menus open left-aligned instead when the trigger sits in the left half.
    position = alignRight && anchor.x + anchor.w > screen.width / 2
      ? { top, right: Math.max(12, screen.width - (anchor.x + anchor.w)) }
      : { top, left: Math.max(12, anchor.x) };
    if (matchWidth) position.width = anchor.w;
  }

  return (
    <View ref={setNode} collapsable={false} style={style}>
      {renderTrigger(open)}
      <Modal visible={!!anchor} transparent animationType="fade" onRequestClose={close}>
        <Pressable style={StyleSheet.absoluteFill} onPress={close}>
          <View style={[styles.menu, position]}>
            {items.map((item) => (
              <TouchableOpacity
                key={item.label}
                style={styles.option}
                onPress={() => {
                  close();
                  item.onPress();
                }}
                activeOpacity={0.6}
              >
                <Text style={[styles.optionText, item.selected && styles.optionTextActive]}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

/** "⋮" grey square button that opens a dropdown (View Appointment / Checkout footers). */
export default function PopoverMenu({ items }: { items: MenuItem[] }) {
  return (
    <DropdownMenu
      items={items}
      alignRight
      renderTrigger={(open) => (
        <TouchableOpacity style={styles.moreBtn} onPress={open} activeOpacity={0.7} accessibilityLabel="More actions">
          <Ionicons name="ellipsis-vertical" size={18} color={colors.text} />
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  moreBtn: {
    width: 48,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.subtleAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  menu: {
    position: "absolute",
    minWidth: 120,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    paddingVertical: 8,
    ...shadows.overlay,
    shadowOpacity: 0.18,
  },
  option: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    minHeight: 32,
    justifyContent: "center",
  },
  optionText: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.regular,
    color: colors.text,
  },
  optionTextActive: {
    fontFamily: fonts.semibold,
    color: colors.primary,
  },
});
