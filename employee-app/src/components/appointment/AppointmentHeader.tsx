import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { colors, fonts, radius, shadows } from "@/constants/figmaTheme";
import { APPOINTMENTS_ROUTE } from "./appointmentData";

interface AppointmentHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  /** Replaces the default "⌂ / Appointments" breadcrumb */
  right?: React.ReactNode;
  /** Hide the back chevron (Reschedule frame has none) */
  hideBack?: boolean;
}

/** White title bar used by every appointment screen (Figma "title" frame). */
export default function AppointmentHeader({ title, subtitle, onBack, right, hideBack }: AppointmentHeaderProps) {
  const router = useRouter();

  return (
    <View style={styles.header}>
      {!hideBack && (
        <TouchableOpacity
          style={styles.backBtn}
          onPress={onBack ?? (() => router.back())}
          activeOpacity={0.7}
          accessibilityLabel="Go back"
          hitSlop={8}
        >
          <Ionicons name="chevron-back" size={20} color={colors.primary} />
        </TouchableOpacity>
      )}
      <View style={styles.titleWrap}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {right ?? <Breadcrumb onPress={() => router.navigate(APPOINTMENTS_ROUTE as any)} />}
    </View>
  );
}

export function Breadcrumb({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.breadcrumb} onPress={onPress} activeOpacity={0.7}>
      <Ionicons name="home-outline" size={16} color={colors.textSecondary} />
      <Text style={styles.slash}>/</Text>
      <View style={styles.crumbPill}>
        <Text style={styles.crumbText}>Appointments</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 56,
    backgroundColor: colors.card,
    borderRadius: radius.card,
    ...shadows.card,
  },
  backBtn: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  titleWrap: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: fonts.semibold,
    color: colors.text,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
  breadcrumb: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  slash: {
    fontSize: 14,
    fontFamily: fonts.semibold,
    color: colors.text,
  },
  crumbPill: {
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  crumbText: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.primary,
  },
});
