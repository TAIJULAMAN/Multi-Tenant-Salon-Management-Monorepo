import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, fonts, radius, shadows } from "@/constants/figmaTheme";

interface Props {
  title: string;
  onBack?: () => void;
  right?: React.ReactNode;
  showBreadcrumb?: boolean;
  /** Rendered under the title row inside the same card (e.g. the "General Settings" tab). */
  children?: React.ReactNode;
}

/**
 * Figma sub-page title card: purple back chevron + title on the left,
 * "home / Appointments" breadcrumb (pill) on the right. Sits on the #F4F7FB canvas.
 */
export default function CalendarPageHeader({ title, onBack, right, showBreadcrumb = true, children }: Props) {
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    if (onBack) return onBack();
    if (router.canGoBack()) router.back();
    else router.replace("/(drawer)/(tabs)/calendar" as any);
  };

  return (
    <View style={[styles.wrap, { paddingTop: insets.top + 12 }]}>
      <View style={styles.card}>
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={handleBack}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="chevron-back" size={20} color={colors.primary} />
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
          </TouchableOpacity>

          {right ??
            (showBreadcrumb ? (
              <TouchableOpacity
                style={styles.breadcrumb}
                activeOpacity={0.7}
                onPress={() => router.navigate("/(drawer)/(tabs)/calendar" as any)}
              >
                <Ionicons name="home-outline" size={16} color={colors.textSecondary} />
                <Text style={styles.breadcrumbDivider}>/</Text>
                <View style={styles.breadcrumbPill}>
                  <Text style={styles.breadcrumbText}>Appointments</Text>
                </View>
              </TouchableOpacity>
            ) : null)}
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
    paddingBottom: 4,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.card,
    paddingHorizontal: 14,
    paddingVertical: 14,
    ...shadows.card,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flexShrink: 1,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 16,
    lineHeight: 22,
    color: colors.text,
    flexShrink: 1,
  },
  breadcrumb: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  breadcrumbDivider: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.text,
  },
  breadcrumbPill: {
    backgroundColor: colors.primarySoft,
    borderRadius: radius.sm + 2,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  breadcrumbText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.primary,
  },
});
