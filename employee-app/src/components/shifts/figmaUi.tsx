// Figma-styled building blocks shared by the Shifts and Remuneration screens.
import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput as RNTextInput,
  Platform,
  StyleProp,
  ViewStyle,
  TextInputProps,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import GradientFill from "@/components/GradientFill";
import DateTimePicker, { DateTimePickerEvent } from "@expo/ui/community/datetime-picker";
import { colors, fonts, radius, shadows } from "@/constants/figmaTheme";
import AnchoredMenu, { MenuAnchor, measureAnchor } from "./AnchoredMenu";
import { parseMDY, toMDY } from "./shiftsData";

/* ------------------------------------------------------------------ */
/* Form fields                                                         */
/* ------------------------------------------------------------------ */

export function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <Text style={styles.label}>
      {label}
      {required ? " *" : ""}
    </Text>
  );
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <Text style={styles.errorText}>{message}</Text>;
}

interface FieldWrapProps {
  label?: string;
  required?: boolean;
  error?: string;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

function FieldWrap({ label, required, error, style, children }: FieldWrapProps) {
  return (
    <View style={[styles.field, style]}>
      {label ? <FieldLabel label={label} required={required} /> : null}
      {children}
      <FieldError message={error} />
    </View>
  );
}

interface SelectFieldProps {
  label?: string;
  required?: boolean;
  placeholder: string;
  value?: string;
  options: string[];
  onSelect: (value: string) => void;
  error?: string;
  style?: StyleProp<ViewStyle>;
}

/** Input box with chevron that opens the Figma dropdown card right under the field. */
export function SelectField({ label, required, placeholder, value, options, onSelect, error, style }: SelectFieldProps) {
  const ref = useRef<View>(null);
  const [anchor, setAnchor] = useState<MenuAnchor | null>(null);
  return (
    <FieldWrap label={label} required={required} error={error} style={style}>
      <TouchableOpacity
        ref={ref}
        style={[styles.input, !!error && styles.inputError]}
        onPress={() => measureAnchor(ref, setAnchor)}
        activeOpacity={0.7}
      >
        <Text style={[styles.inputText, !value && styles.placeholder]} numberOfLines={1}>
          {value || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={18} color={colors.textSecondary} />
      </TouchableOpacity>
      <AnchoredMenu
        visible={!!anchor}
        anchor={anchor}
        options={options.map((o) => ({ key: o, label: o, selected: o === value }))}
        onClose={() => setAnchor(null)}
        onSelect={onSelect}
      />
    </FieldWrap>
  );
}

interface DateFieldProps {
  label?: string;
  required?: boolean;
  placeholder?: string;
  /** MM/DD/YYYY */
  value: string;
  onChange: (value: string) => void;
  error?: string;
  style?: StyleProp<ViewStyle>;
  /** "calendar" = calendar icon on the right (Add Time Off); "chevron" = dropdown look (Add Shift). */
  trailing?: "calendar" | "chevron";
}

export function DateField({
  label,
  required,
  placeholder = "Select date",
  value,
  onChange,
  error,
  style,
  trailing = "calendar",
}: DateFieldProps) {
  const [open, setOpen] = useState(false);
  const handleChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === "android") setOpen(false);
    if (event.type === "set" && date) {
      onChange(toMDY(date));
      if (Platform.OS !== "android") setOpen(false);
    } else if (event.type === "dismissed") {
      setOpen(false);
    }
  };
  return (
    <FieldWrap label={label} required={required} error={error} style={style}>
      <TouchableOpacity style={[styles.input, !!error && styles.inputError]} onPress={() => setOpen(true)} activeOpacity={0.7}>
        <Text style={[styles.inputText, !value && styles.placeholder]} numberOfLines={1}>
          {value || placeholder}
        </Text>
        {trailing === "calendar" ? (
          <Ionicons name="calendar-clear-outline" size={20} color={colors.text} />
        ) : (
          <Ionicons name="chevron-down" size={18} color={colors.textSecondary} />
        )}
      </TouchableOpacity>
      {open && (
        <DateTimePicker
          value={parseMDY(value) ?? new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "inline" : "default"}
          themeVariant="light"
          accentColor={colors.primary}
          onChange={handleChange}
          onDismiss={() => setOpen(false)}
        />
      )}
    </FieldWrap>
  );
}

interface TextFieldProps extends TextInputProps {
  label?: string;
  required?: boolean;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
  multilineHeight?: number;
}

export function TextField({ label, required, error, containerStyle, multilineHeight = 125, multiline, style, ...props }: TextFieldProps) {
  return (
    <FieldWrap label={label} required={required} error={error} style={containerStyle}>
      <RNTextInput
        placeholderTextColor={multiline ? colors.text : colors.textMuted}
        style={[
          styles.input,
          styles.inputText,
          multiline && { height: multilineHeight, paddingTop: 14, textAlignVertical: "top" },
          !!error && styles.inputError,
          style,
        ]}
        multiline={multiline}
        {...props}
      />
    </FieldWrap>
  );
}

export function Checkbox({ checked, label, onPress }: { checked: boolean; label: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.checkRow} onPress={onPress} activeOpacity={0.7} accessibilityRole="checkbox" accessibilityState={{ checked }}>
      <View style={[styles.checkBox, checked && styles.checkBoxOn]}>
        {checked && <Ionicons name="checkmark" size={14} color={colors.white} />}
      </View>
      <Text style={styles.checkLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

export function Radio({ selected, disabled }: { selected: boolean; disabled?: boolean }) {
  return (
    <View style={[styles.radio, selected && styles.radioOn, disabled && styles.radioDisabled]}>
      {selected && <View style={styles.radioDot} />}
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Buttons, pills, cards                                               */
/* ------------------------------------------------------------------ */

export function PrimaryButton({
  label,
  onPress,
  chevron,
  icon,
  btnRef,
  style,
}: {
  label: string;
  onPress: () => void;
  chevron?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  btnRef?: React.RefObject<View | null>;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <TouchableOpacity ref={btnRef} style={[styles.btn, styles.btnPrimary, style]} onPress={onPress} activeOpacity={0.85}>
      {icon && <Ionicons name={icon} size={18} color={colors.white} />}
      <Text style={[styles.btnText, { color: colors.white }]}>{label}</Text>
      {chevron && <Ionicons name="chevron-down" size={16} color={colors.white} />}
    </TouchableOpacity>
  );
}

/** "Export Data" – primarySoft background, primary text, download icon. */
export function SoftButton({ label, onPress, icon = "download-outline", style }: { label: string; onPress: () => void; icon?: keyof typeof Ionicons.glyphMap; style?: StyleProp<ViewStyle> }) {
  return (
    <TouchableOpacity style={[styles.btn, styles.btnSoft, style]} onPress={onPress} activeOpacity={0.8}>
      <Ionicons name={icon} size={18} color={colors.primary} />
      <Text style={[styles.btnText, { color: colors.primary }]}>{label}</Text>
    </TouchableOpacity>
  );
}

/** Small rounded pill (e.g. "Total: 9h", "Time off total: 0h"). `solid` = primary bg + white text. */
export function Pill({ label, solid, style }: { label: string; solid?: boolean; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.pill, solid && styles.pillSolid, style]}>
      <Text style={[styles.pillText, solid && styles.pillTextSolid]}>{label}</Text>
    </View>
  );
}

export function Card({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

/** Figma "title" card: page title on the left, actions on the right, optional filters below. */
export function TitleCard({
  title,
  actions,
  inlineActions,
  children,
}: {
  title: string;
  actions?: React.ReactNode;
  /** Render actions on the title row (only when they fit, e.g. a single button). */
  inlineActions?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <Card style={styles.titleCard}>
      <View style={styles.titleRow}>
        <Text style={styles.pageTitle} numberOfLines={1}>
          {title}
        </Text>
        {inlineActions ? actions : null}
      </View>
      {actions && !inlineActions ? <View style={styles.actionsRow}>{actions}</View> : null}
      {children}
    </Card>
  );
}

export function FilterLabel({ label, icon }: { label: string; icon?: keyof typeof Ionicons.glyphMap }) {
  return (
    <View style={styles.filterLabelRow}>
      <Text style={styles.filterLabel}>{label}</Text>
      {icon && <Ionicons name={icon} size={14} color={colors.textSecondary} />}
    </View>
  );
}

/** Compact 36px filter box (Period month/year, Custom Range). */
export function FilterBox({
  label,
  onPress,
  icon = "chevron-down",
  active,
  boxRef,
  style,
}: {
  label: string;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  active?: boolean;
  boxRef?: React.RefObject<View | null>;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <TouchableOpacity ref={boxRef} style={[styles.filterBox, active && styles.filterBoxActive, style]} onPress={onPress} activeOpacity={0.7}>
      <Text style={[styles.filterBoxText, active && { color: colors.primary }]} numberOfLines={1}>
        {label}
      </Text>
      <Ionicons name={icon} size={icon === "chevron-down" ? 18 : 16} color={active ? colors.primary : colors.text} />
    </TouchableOpacity>
  );
}

export interface StatCardProps {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  gradient: [string, string];
  lines?: string[];
  style?: StyleProp<ViewStyle>;
}

/** Figma gradient stat card: 40px solid icon square + label, big value, optional caption lines. */
export function StatCard({ label, value, icon, color, gradient, lines, style }: StatCardProps) {
  return (
    <View style={[styles.stat, style]}>
      <GradientFill from={gradient[0]} to={gradient[1]} />
      <View style={styles.statHeader}>
        <View style={[styles.statIcon, { backgroundColor: color }]}>
          <Ionicons name={icon} size={22} color={colors.white} />
        </View>
        <Text style={styles.statLabel} numberOfLines={2}>
          {label}
        </Text>
      </View>
      <Text style={styles.statValue}>{value}</Text>
      {lines?.map((l) => (
        <Text key={l} style={styles.statLine}>
          {l}
        </Text>
      ))}
    </View>
  );
}

export const STAT_GRADIENTS = {
  primary: ["#EDECFF", "#F9F9FF"] as [string, string],
  teal: ["#E2F9F8", "#F7FDFD"] as [string, string],
  green: ["#E2F9F8", "#F7FDFD"] as [string, string],
  yellow: ["#FEF7E0", "#FFFDF7"] as [string, string],
};

export const figmaStyles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    gap: 16,
  },
  /** Bordered table container (r=12, border) */
  tableBox: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    overflow: "hidden",
  },
  th: {
    backgroundColor: colors.primaryTint,
  },
  thText: {
    fontFamily: fonts.semibold,
    fontSize: 16,
    lineHeight: 22,
    color: colors.text,
  },
  tdText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.text,
  },
  tdStrong: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    lineHeight: 20,
    color: colors.text,
  },
  rowAlt: {
    backgroundColor: colors.subtle,
  },
});

const styles = StyleSheet.create({
  field: {
    gap: 8,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 19,
    color: colors.text,
  },
  errorText: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: colors.red,
  },
  input: {
    height: 42,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    backgroundColor: colors.white,
    paddingHorizontal: 12,
  },
  inputError: {
    borderColor: colors.red,
  },
  inputText: {
    flexShrink: 1,
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.text,
  },
  placeholder: {
    color: colors.textMuted,
  },
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
  },
  checkBox: {
    width: 20,
    height: 20,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.textSecondary,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
  },
  checkBoxOn: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkLabel: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.text,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.textSecondary,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  radioOn: {
    borderColor: colors.primary,
    borderWidth: 1.5,
  },
  radioDisabled: {
    backgroundColor: colors.border,
    borderColor: colors.border,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  btn: {
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 16,
    borderRadius: radius.md,
  },
  btnPrimary: {
    backgroundColor: colors.primary,
    ...shadows.primary,
  },
  btnSoft: {
    backgroundColor: colors.primarySoft,
  },
  btnText: {
    fontFamily: fonts.medium,
    fontSize: 15,
    lineHeight: 20,
  },
  pill: {
    alignSelf: "flex-start",
    backgroundColor: colors.primarySoft,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  pillSolid: {
    backgroundColor: colors.primary,
  },
  pillText: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: colors.primary,
  },
  pillTextSolid: {
    color: colors.white,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.card,
    ...shadows.card,
  },
  titleCard: {
    padding: 16,
    gap: 14,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  pageTitle: {
    flex: 1,
    fontFamily: fonts.semibold,
    fontSize: 18,
    lineHeight: 25,
    color: colors.text,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 12,
  },
  filterLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  filterLabel: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: colors.textMuted,
  },
  filterBox: {
    height: 36,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.white,
  },
  filterBoxActive: {
    borderColor: colors.primary,
  },
  filterBoxText: {
    flexShrink: 1,
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 18,
    color: colors.text,
  },
  stat: {
    borderRadius: radius.card,
    overflow: "hidden",
    padding: 20,
    gap: 4,
  },
  statHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  statLabel: {
    flexShrink: 1,
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 19,
    color: colors.text,
  },
  statValue: {
    fontFamily: fonts.semibold,
    fontSize: 28,
    lineHeight: 36,
    color: colors.text,
  },
  statLine: {
    fontFamily: fonts.medium,
    fontSize: 12,
    lineHeight: 16,
    color: colors.text,
  },
});
