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

export interface ActionDropdownItem {
  id: string;
  label: string;
  iconName: keyof typeof Ionicons.prototype.props.name;
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
  const dropdownWidth = 230;
  const dropdownEstimatedHeight = items.length * 44 + (title ? 40 : 0) + 16;

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
              const isDelete = item.id === "delete";

              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.itemRow, isDelete && styles.deleteItemRow]}
                  onPress={() => {
                    onClose();
                    setTimeout(() => item.onPress(), 150);
                  }}
                  activeOpacity={0.7}
                >
                  <Ionicons name={item.iconName} size={17} color={item.iconColor} />
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
  dropdownCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingVertical: 6,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
  },
  titleContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    marginBottom: 4,
  },
  titleText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#64748B",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  itemsList: {
    paddingVertical: 2,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  deleteItemRow: {
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    marginTop: 2,
    paddingTop: 10,
  },
  itemLabel: {
    fontSize: 13.5,
    fontFamily: "Manrope_600SemiBold",
    color: "#334155",
  },
});
