import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, radius } from "@/constants/figmaTheme";

interface AppointmentDialogProps {
  visible: boolean;
  title?: string;
  subtitle?: string;
  onClose?: () => void;
  /** Shows the "×" in the header (default true when onClose is set). */
  showClose?: boolean;
  /** Right-aligned / split action row under the body */
  footer?: React.ReactNode;
  children?: React.ReactNode;
  /** Center the body content (status popups). */
  centered?: boolean;
}

/**
 * Centered white popup used for every desktop modal of the appointment flows
 * (Add a Note, Cancel Appointment, Set as Repeating, Divide Payment, Online Payment,
 * Gift Card, Printing Receipt, Successful Payment…).
 */
export default function AppointmentDialog({
  visible,
  title,
  subtitle,
  onClose,
  showClose = true,
  footer,
  children,
  centered,
}: AppointmentDialogProps) {
  const closable = !!onClose && showClose;
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose ?? (() => {})}
      statusBarTranslucent
    >
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={styles.overlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={closable ? onClose : undefined} />
          <View style={styles.card}>
            {(title || closable) && (
              <View style={styles.header}>
                <View style={{ flex: 1 }}>
                  {title ? <Text style={styles.title}>{title}</Text> : null}
                  {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
                </View>
                {closable && (
                  <TouchableOpacity onPress={onClose} hitSlop={10} accessibilityLabel="Close">
                    <Ionicons name="close" size={22} color={colors.text} />
                  </TouchableOpacity>
                )}
              </View>
            )}
            <ScrollView
              style={styles.scroll}
              contentContainerStyle={[styles.body, centered && styles.bodyCentered]}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              {children}
            </ScrollView>
            {footer ? <View style={styles.footer}>{footer}</View> : null}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

type Variant = "primary" | "secondary" | "soft" | "outline";

export function DialogButton({
  label,
  onPress,
  variant = "primary",
  disabled,
  icon,
  style,
  textStyle,
}: {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  icon?: React.ComponentProps<typeof Ionicons>["name"];
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}) {
  const v = VARIANTS[disabled ? "disabled" : variant];
  return (
    <TouchableOpacity
      style={[styles.btn, { backgroundColor: v.bg, borderColor: v.border ?? v.bg }, style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      {icon ? <Ionicons name={icon} size={16} color={v.text} /> : null}
      <Text style={[styles.btnText, { color: v.text }, textStyle]}>{label}</Text>
    </TouchableOpacity>
  );
}

const VARIANTS: Record<Variant | "disabled", { bg: string; text: string; border?: string }> = {
  primary: { bg: colors.primary, text: colors.white },
  secondary: { bg: colors.subtleAlt, text: colors.text },
  soft: { bg: colors.primarySoft, text: colors.primary },
  outline: { bg: colors.white, text: colors.primary, border: colors.primary },
  disabled: { bg: colors.subtleAlt, text: colors.textMuted },
};

export const dialogStyles = StyleSheet.create({
  label: {
    fontSize: 14,
    lineHeight: 19,
    fontFamily: fonts.medium,
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    height: 42,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.text,
  },
  inputDisabled: {
    backgroundColor: colors.canvas,
    color: colors.textMuted,
  },
  textArea: {
    minHeight: 152,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    padding: 16,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.regular,
    color: colors.text,
    textAlignVertical: "top",
  },
  actionsRight: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 16,
  },
  actionsSplit: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
});

const styles = StyleSheet.create({
  flex: { flex: 1 },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(41, 52, 61, 0.4)",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 520,
    maxHeight: "90%",
    backgroundColor: colors.white,
    borderRadius: radius.card,
    paddingVertical: 24,
    shadowColor: "#0C0C0D",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.2,
    shadowRadius: 32,
    elevation: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    lineHeight: 25,
    fontFamily: fonts.semibold,
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    marginTop: 4,
  },
  scroll: {
    flexGrow: 0,
  },
  body: {
    paddingHorizontal: 20,
    gap: 16,
  },
  bodyCentered: {
    alignItems: "center",
  },
  footer: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  btn: {
    minHeight: 36,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  btnText: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: fonts.medium,
    textAlign: "center",
  },
});
