import React from "react";
import { StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import { colors, fonts, radius } from "@/constants/figmaTheme";

/**
 * Mobile replacement for a wide table row: one bordered card per record.
 * Layout: optional `leading` (checkbox / avatar) + title/subtitle + `trailing` (badge / menu),
 * then label/value `fields` in a 2-column grid, then an optional `footer` (action buttons).
 */
export interface RecordField {
  label: string;
  value: React.ReactNode;
  /** Span both grid columns (long text such as notes or emails). */
  full?: boolean;
}

interface RecordCardProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  fields?: RecordField[];
  footer?: React.ReactNode;
  children?: React.ReactNode;
  onPress?: () => void;
  selected?: boolean;
  style?: StyleProp<ViewStyle>;
}

export default function RecordCard({
  title,
  subtitle,
  leading,
  trailing,
  fields,
  footer,
  children,
  onPress,
  selected,
  style,
}: RecordCardProps) {
  const body = (
    <>
      <View style={styles.header}>
        {leading}
        <View style={styles.headerText}>
          {typeof title === "string" ? (
            <Text style={styles.title} numberOfLines={2}>
              {title}
            </Text>
          ) : (
            title
          )}
          {subtitle != null &&
            (typeof subtitle === "string" ? (
              <Text style={styles.subtitle} numberOfLines={2}>
                {subtitle}
              </Text>
            ) : (
              subtitle
            ))}
        </View>
        {trailing}
      </View>

      {fields && fields.length > 0 && (
        <View style={styles.grid}>
          {fields.map((f) => (
            <View key={f.label} style={[styles.field, f.full && styles.fieldFull]}>
              <Text style={styles.label}>{f.label}</Text>
              {typeof f.value === "string" || typeof f.value === "number" ? (
                <Text style={styles.value}>{f.value}</Text>
              ) : (
                f.value
              )}
            </View>
          ))}
        </View>
      )}

      {children}
      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </>
  );

  const cardStyle = [styles.card, selected && styles.cardSelected, style];
  return onPress ? (
    <TouchableOpacity style={cardStyle} onPress={onPress} activeOpacity={0.8}>
      {body}
    </TouchableOpacity>
  ) : (
    <View style={cardStyle}>{body}</View>
  );
}

/** Vertical stack of RecordCards with consistent spacing. */
export function RecordList({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.list, style]}>{children}</View>;
}

export const recordCardStyles = StyleSheet.create({
  label: { fontFamily: fonts.regular, fontSize: 12, lineHeight: 16, color: colors.textMuted },
  value: { fontFamily: fonts.medium, fontSize: 14, lineHeight: 20, color: colors.text },
});

const styles = StyleSheet.create({
  list: { gap: 12 },
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    backgroundColor: colors.white,
    padding: 14,
    gap: 12,
  },
  cardSelected: { borderColor: colors.primary, backgroundColor: colors.primaryTint },
  header: { flexDirection: "row", alignItems: "center", gap: 10 },
  headerText: { flex: 1, gap: 2 },
  title: { fontFamily: fonts.semibold, fontSize: 15, lineHeight: 21, color: colors.text },
  subtitle: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 18, color: colors.textMuted },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 10,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  field: { width: "50%", paddingRight: 8, gap: 2 },
  fieldFull: { width: "100%" },
  label: recordCardStyles.label,
  value: recordCardStyles.value,
  footer: { flexDirection: "row", justifyContent: "flex-end", gap: 10 },
});
