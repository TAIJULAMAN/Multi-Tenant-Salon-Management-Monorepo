import React from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, radius, shadows, typography } from "@/constants/figmaTheme";

/**
 * Centered modal shell matching the Figma Files dialogs
 * (white r12, 24 padding, 24 gap, 18px semibold title, close X, right-aligned Save).
 */
export default function FilesModal({
  visible,
  onClose,
  title,
  children,
  saveLabel = "Save",
  onSave,
  saveDisabled,
  saveTone = "primary",
  secondaryLabel,
  onSecondary,
  maxWidth = 746,
}: {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  saveLabel?: string;
  onSave: () => void;
  saveDisabled?: boolean;
  saveTone?: "primary" | "danger";
  secondaryLabel?: string;
  onSecondary?: () => void;
  maxWidth?: number;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <Pressable style={styles.overlay} onPress={onClose}>
          <Pressable style={[styles.card, { maxWidth }]} onPress={() => {}}>
            <View style={styles.titleRow}>
              <Text style={styles.title} numberOfLines={2}>
                {title}
              </Text>
              <TouchableOpacity onPress={onClose} hitSlop={10} accessibilityLabel="Close">
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.body}>{children}</View>

            <View style={styles.footer}>
              {secondaryLabel ? (
                <TouchableOpacity style={[styles.btn, styles.btnSecondary]} onPress={onSecondary ?? onClose} activeOpacity={0.8}>
                  <Text style={[styles.btnText, { color: colors.text }]}>{secondaryLabel}</Text>
                </TouchableOpacity>
              ) : null}
              <TouchableOpacity
                style={[
                  styles.btn,
                  { backgroundColor: saveTone === "danger" ? colors.pink : colors.primary },
                  saveDisabled && styles.btnDisabled,
                ]}
                onPress={onSave}
                disabled={saveDisabled}
                activeOpacity={0.85}
              >
                <Text style={styles.btnText}>{saveLabel}</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

/** "Modified Input form" — 14px semibold label + 42px bordered input. */
export function ModalInput({
  label,
  icon,
  style,
  ...inputProps
}: TextInputProps & { label?: string; icon?: keyof typeof Ionicons.glyphMap }) {
  return (
    <View style={styles.inputGroup}>
      {label ? <Text style={typography.bodyStrong}>{label}</Text> : null}
      <View style={styles.inputBox}>
        <TextInput
          placeholderTextColor={colors.textMuted}
          style={[styles.input, style]}
          {...inputProps}
        />
        {icon ? <Ionicons name={icon} size={22} color={colors.textMuted} /> : null}
      </View>
    </View>
  );
}

export const modalStyles = StyleSheet.create({
  sectionLabel: typography.bodyStrong,
  personName: typography.bodyStrong,
  personSub: { fontFamily: fonts.regular, fontSize: 12, lineHeight: 16, color: "#999999" },
});

const styles = StyleSheet.create({
  flex: { flex: 1 },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  card: {
    width: "100%",
    maxHeight: "90%",
    backgroundColor: colors.white,
    borderRadius: radius.card,
    padding: 24,
    gap: 24,
    ...shadows.overlay,
  },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  title: { flex: 1, fontFamily: fonts.semibold, fontSize: 18, lineHeight: 25, color: colors.text },
  body: { flexShrink: 1, gap: 24 },
  footer: { flexDirection: "row", justifyContent: "flex-end", gap: 16 },
  btn: {
    borderRadius: radius.md,
    paddingVertical: 10,
    paddingHorizontal: 16,
    minWidth: 60,
    alignItems: "center",
  },
  btnSecondary: { backgroundColor: colors.subtleAlt },
  btnDisabled: { opacity: 0.5 },
  btnText: { fontFamily: fonts.medium, fontSize: 12, lineHeight: 16, color: colors.white, textAlign: "center" },
  inputGroup: { gap: 8 },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    height: 42,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: 12,
    backgroundColor: colors.white,
  },
  input: { flex: 1, ...typography.body, paddingVertical: 0 },
});
