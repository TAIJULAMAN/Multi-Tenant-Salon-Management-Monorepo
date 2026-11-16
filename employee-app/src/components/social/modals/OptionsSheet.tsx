import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomBottomSheet from "@/components/ui/CustomBottomSheet";
import { colors, fonts, radius } from "@/constants/figmaTheme";

export interface SheetOption {
  label: string;
  icon?: React.ReactNode;
  destructive?: boolean;
  subtitle?: string;
}

export interface OptionsSheetConfig {
  title: string;
  options: SheetOption[];
  value?: string;
  onSelect: (label: string) => void;
  footer?: { label: string; onPress: () => void };
}

interface OptionsSheetProps {
  config: OptionsSheetConfig | null;
  onClose: () => void;
}

/** Generic single-select / action list rendered in a bottom sheet (salon-owner pattern). */
export default function OptionsSheet({ config, onClose }: OptionsSheetProps) {
  return (
    <CustomBottomSheet visible={!!config} onClose={onClose} title={config?.title}>
      <View style={styles.list}>
        {config?.options.map((o) => {
          const selected = config.value === o.label;
          return (
            <TouchableOpacity
              key={o.label}
              style={[styles.item, selected && styles.itemActive]}
              onPress={() => {
                config.onSelect(o.label);
                onClose();
              }}
              activeOpacity={0.7}
            >
              <View style={styles.itemLeft}>
                {o.icon}
                <View>
                  <Text
                    style={[
                      styles.itemText,
                      selected && styles.itemTextActive,
                      o.destructive && styles.itemTextDanger,
                    ]}
                  >
                    {o.label}
                  </Text>
                  {o.subtitle ? <Text style={styles.itemSub}>{o.subtitle}</Text> : null}
                </View>
              </View>
              {selected && <Ionicons name="checkmark" size={18} color={colors.primary} />}
            </TouchableOpacity>
          );
        })}
        {config?.footer && (
          <TouchableOpacity
            style={styles.footer}
            onPress={() => {
              const f = config.footer;
              onClose();
              f?.onPress();
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="settings-outline" size={16} color={colors.primary} />
            <Text style={styles.footerText}>{config.footer.label}</Text>
          </TouchableOpacity>
        )}
      </View>
    </CustomBottomSheet>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 4,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 13,
    borderRadius: radius.md,
  },
  itemActive: {
    backgroundColor: colors.primaryTint,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  itemText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.text,
  },
  itemTextActive: {
    color: colors.primary,
    fontFamily: fonts.semibold,
  },
  itemTextDanger: {
    color: colors.pink,
  },
  itemSub: {
    fontSize: 11.5,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    marginTop: 1,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 8,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerText: {
    fontSize: 13.5,
    fontFamily: fonts.semibold,
    color: colors.primary,
  },
});
