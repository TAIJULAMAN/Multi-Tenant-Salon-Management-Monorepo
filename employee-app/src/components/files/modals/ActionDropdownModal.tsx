import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, radius, shadows } from "@/constants/figmaTheme";

export interface ActionDropdownItem {
  id: string;
  label: string;
  iconName: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  textColor?: string;
  onPress: () => void;
}

export interface AnchorPosition {
  x: number;
  y: number;
  width?: number;
  height?: number;
}

interface ActionDropdownModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  items: ActionDropdownItem[];
  anchorPosition?: AnchorPosition | null;
}

export default function ActionDropdownModal({
  visible,
  onClose,
  title,
  items,
  anchorPosition,
}: ActionDropdownModalProps) {
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;
  const dropdownWidth = 220;
  const dropdownEstimatedHeight = items.length * 36 + (title ? 40 : 0) + 16;

  let computedStyle: any = {};

  if (anchorPosition) {
    let top = anchorPosition.y + (anchorPosition.height || 0) + 6;
    if (top + dropdownEstimatedHeight > windowHeight - 20) {
      top = Math.max(40, anchorPosition.y - dropdownEstimatedHeight - 4);
    }

    if (anchorPosition.x > windowWidth / 2) {
      const right = Math.max(12, windowWidth - anchorPosition.x - (anchorPosition.width || 0));
      computedStyle = {
        position: "absolute",
        top,
        right,
        width: dropdownWidth,
      };
    } else {
      const left = Math.max(12, anchorPosition.x);
      computedStyle = {
        position: "absolute",
        top,
        left,
        width: dropdownWidth,
      };
    }
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity
        style={[styles.overlay, !anchorPosition && styles.overlayCentered]}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          style={[styles.dropdownCard, computedStyle]}
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          {title ? (
            <View style={styles.titleContainer}>
              <Text style={styles.titleText} numberOfLines={1}>
                {title}
              </Text>
            </View>
          ) : null}

          <View style={styles.itemsList}>
            {items.map((item) => {
              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.itemRow}
                  onPress={() => {
                    onClose();
                    setTimeout(() => item.onPress(), 150);
                  }}
                  activeOpacity={0.7}
                >
                  <Ionicons name={item.iconName} size={16} color={item.iconColor} />
                  <Text
                    style={[
                      styles.itemLabel,
                      item.textColor ? { color: item.textColor } : null,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.12)",
  },
  overlayCentered: {
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  // Figma "dropdown": white r12, 8px vertical padding, overlay shadow
  dropdownCard: {
    backgroundColor: colors.white,
    borderRadius: radius.card,
    paddingVertical: 8,
    minWidth: 180,
    ...shadows.overlay,
  },
  titleContainer: {
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  titleText: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.medium,
    color: colors.textMuted,
  },
  itemsList: {},
  // Figma "option": 4/14 padding (taller here for touch targets), 8px gap
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  itemLabel: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.regular,
    color: colors.text,
  },
});
