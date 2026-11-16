import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, radius, shadows } from "@/constants/figmaTheme";

interface FormModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  primaryLabel?: string;
  onPrimary?: () => void;
  primaryDisabled?: boolean;
  /** Optional outlined secondary action shown left of the primary button. */
  secondaryLabel?: string;
  onSecondary?: () => void;
  hideFooter?: boolean;
  /** Custom footer replacing the Save button row. */
  footer?: React.ReactNode;
}

/**
 * Figma modal ("Add Time Off", "Edit … Shift", "Add Shift"): white card r=12, 20px title + close X,
 * no dividers, small right-aligned primary "Save" button.
 */
export default function FormModal({
  visible,
  onClose,
  title,
  children,
  primaryLabel = "Save",
  onPrimary,
  primaryDisabled,
  secondaryLabel,
  onSecondary,
  hideFooter,
  footer,
}: FormModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={styles.overlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.headerTitle} numberOfLines={2}>
                {title}
              </Text>
              <TouchableOpacity onPress={onClose} hitSlop={10} activeOpacity={0.7} accessibilityLabel="Close">
                <Ionicons name="close" size={22} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.body}
              contentContainerStyle={styles.bodyContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {children}

              {footer}
              {!hideFooter && !footer && (
                <View style={styles.footer}>
                  {secondaryLabel ? (
                    <TouchableOpacity style={styles.secondaryBtn} onPress={onSecondary ?? onClose} activeOpacity={0.7}>
                      <Text style={styles.secondaryBtnText}>{secondaryLabel}</Text>
                    </TouchableOpacity>
                  ) : null}
                  <TouchableOpacity
                    style={[styles.saveBtn, primaryDisabled && styles.saveBtnDisabled]}
                    onPress={onPrimary}
                    disabled={primaryDisabled}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.saveBtnText}>{primaryLabel}</Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  container: {
    width: "100%",
    maxWidth: 620,
    maxHeight: "90%",
    backgroundColor: colors.white,
    borderRadius: radius.card,
    overflow: "hidden",
    ...shadows.overlay,
    shadowOpacity: 0.2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 14,
  },
  headerTitle: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 20,
    lineHeight: 27,
    color: colors.text,
  },
  body: {
    flexGrow: 0,
    flexShrink: 1,
  },
  bodyContent: {
    paddingHorizontal: 20,
    paddingBottom: 22,
    gap: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 8,
  },
  secondaryBtn: {
    height: 36,
    paddingHorizontal: 16,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryBtnText: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.text,
  },
  saveBtn: {
    height: 36,
    paddingHorizontal: 16,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  saveBtnDisabled: {
    opacity: 0.5,
  },
  saveBtnText: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.white,
  },
});
