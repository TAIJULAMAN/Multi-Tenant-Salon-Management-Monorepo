// Shared building blocks for the auth flow, modelled on Figma 1:46501
// "Onboarding - 1" (Sign up). Every auth screen uses these so the whole flow
// shares the frame's typography, 44px inputs/buttons, r=8 corners and borders.
import React, { ReactNode, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ImageSourcePropType,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import LogoIcon from "@/components/ui/LogoIcon";
import { colors, fonts, radius } from "@/constants/figmaTheme";

export const authColors = {
  ink: colors.text,
  muted: colors.textMuted,
  primary: colors.primary,
  border: "#E6EBEF",
  checkboxBorder: "#A9B3BB",
  error: colors.red,
  white: colors.white,
} as const;

/** Vertical rhythm between every block in the frame. */
export const AUTH_GAP = 24;

/* ------------------------------------------------------------------ */
/* Screen shell                                                        */
/* ------------------------------------------------------------------ */

interface AuthScreenProps {
  children: ReactNode;
  /** Optional element rendered full-bleed above the form (e.g. marketing header). */
  hero?: ReactNode;
}

export function AuthScreen({ children, hero }: AuthScreenProps) {
  const insets = useSafeAreaInsets();
  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 24) },
          !hero && { paddingTop: Math.max(insets.top, 24) },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {hero}
        <View style={[styles.body, !hero && styles.bodyCentered]}>{children}</View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/** Compact mobile version of the frame's purple marketing panel. */
export function AuthHero({ title, subtitle }: { title: string; subtitle: string }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.hero, { paddingTop: insets.top + 24 }]}>
      <Text style={styles.heroTitle}>{title}</Text>
      <Text style={styles.heroSubtitle}>{subtitle}</Text>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Header: logo + title + subtitle                                     */
/* ------------------------------------------------------------------ */

interface AuthHeaderProps {
  title: string;
  subtitle?: ReactNode;
  onBack?: () => void;
}

export function AuthHeader({ title, subtitle, onBack }: AuthHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.logoRow}>
        {onBack ? (
          <TouchableOpacity
            style={styles.backBtn}
            onPress={onBack}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={18} color={authColors.ink} />
          </TouchableOpacity>
        ) : null}
        <LogoIcon width={130} height={35} />
      </View>
      <View style={styles.headerText}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Input form / Advance Form                                           */
/* ------------------------------------------------------------------ */

interface AuthFieldProps extends TextInputProps {
  label?: string;
  /** Rendered on the right of the label row (e.g. "Forgot Password?"). */
  labelAccessory?: ReactNode;
  error?: string;
  isPassword?: boolean;
}

export function AuthField({
  label,
  labelAccessory,
  error,
  isPassword,
  style,
  onFocus,
  onBlur,
  ...props
}: AuthFieldProps) {
  const [visible, setVisible] = useState(!isPassword);
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.field}>
      {label || labelAccessory ? (
        <View style={styles.labelRow}>
          {label ? <Text style={styles.label}>{label}</Text> : <View />}
          {labelAccessory}
        </View>
      ) : null}
      <View
        style={[
          styles.inputWrapper,
          focused && styles.inputFocused,
          error ? styles.inputError : null,
        ]}
      >
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={authColors.muted}
          secureTextEntry={isPassword && !visible}
          autoCapitalize="none"
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...props}
        />
        {isPassword ? (
          <TouchableOpacity
            onPress={() => setVisible((v) => !v)}
            style={styles.eyeBtn}
            activeOpacity={0.7}
            accessibilityLabel={visible ? "Hide password" : "Show password"}
          >
            <Ionicons
              name={visible ? "eye-outline" : "eye-off-outline"}
              size={18}
              color={authColors.muted}
            />
          </TouchableOpacity>
        ) : null}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Checkbox                                                            */
/* ------------------------------------------------------------------ */

interface AuthCheckboxProps {
  checked: boolean;
  onToggle: () => void;
  children: ReactNode;
  error?: string;
}

export function AuthCheckbox({ checked, onToggle, children, error }: AuthCheckboxProps) {
  return (
    <View>
      <TouchableOpacity
        style={styles.checkboxRow}
        onPress={onToggle}
        activeOpacity={0.8}
        accessibilityRole="checkbox"
        accessibilityState={{ checked }}
      >
        <View
          style={[
            styles.checkbox,
            checked && styles.checkboxChecked,
            error && !checked ? styles.checkboxError : null,
          ]}
        >
          {checked ? <Ionicons name="checkmark" size={14} color={authColors.white} /> : null}
        </View>
        <Text style={styles.checkboxText}>{children}</Text>
      </TouchableOpacity>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Btn                                                                 */
/* ------------------------------------------------------------------ */

interface AuthButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function AuthButton({ label, onPress, loading, disabled, style }: AuthButtonProps) {
  const inactive = loading || disabled;
  return (
    <TouchableOpacity
      style={[styles.button, inactive && styles.buttonDisabled, style]}
      onPress={onPress}
      disabled={inactive}
      activeOpacity={0.85}
      accessibilityRole="button"
    >
      {loading ? (
        <ActivityIndicator color={authColors.white} size="small" />
      ) : (
        <Text style={styles.buttonText}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

/* ------------------------------------------------------------------ */
/* Divider + social buttons                                            */
/* ------------------------------------------------------------------ */

export function AuthDivider({ label }: { label: string }) {
  return (
    <View style={styles.dividerRow}>
      <View style={styles.dividerLine} />
      <Text style={styles.dividerText}>{label}</Text>
      <View style={styles.dividerLine} />
    </View>
  );
}

function SocialButton({
  label,
  icon,
  iconSize,
  onPress,
}: {
  label: string;
  icon: ImageSourcePropType;
  iconSize: number;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.socialBtn}
      activeOpacity={0.8}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Continue with ${label}`}
    >
      <Image
        source={icon}
        style={{ width: iconSize, height: iconSize }}
        resizeMode="contain"
      />
      <Text style={styles.socialText}>{label}</Text>
    </TouchableOpacity>
  );
}

export function AuthSocialButtons() {
  return (
    <View style={styles.socialRow}>
      <SocialButton
        label="Google"
        icon={require("../../../assets/icons/Google.png")}
        iconSize={16}
      />
      <SocialButton
        label="Facebook"
        icon={require("../../../assets/icons/facebook.png")}
        iconSize={20}
      />
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Footer link ("Already have an Account ?  Sign In Now")              */
/* ------------------------------------------------------------------ */

export function AuthFooterLink({
  prompt,
  action,
  onPress,
}: {
  prompt: string;
  action: string;
  onPress: () => void;
}) {
  return (
    <View style={styles.footerRow}>
      <Text style={styles.footerText}>{prompt}</Text>
      <TouchableOpacity onPress={onPress} activeOpacity={0.7} accessibilityRole="link">
        <Text style={styles.footerLink}>{action}</Text>
      </TouchableOpacity>
    </View>
  );
}

/** Inline primary link text (underlined like "Terms of Service"). */
export function AuthInlineLink({ children, onPress }: { children: ReactNode; onPress?: () => void }) {
  return (
    <Text style={styles.inlineLink} onPress={onPress} suppressHighlighting>
      {children}
    </Text>
  );
}

export const authText = StyleSheet.create({
  body: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: authColors.ink,
  },
  strong: {
    fontFamily: fonts.semibold,
    color: authColors.ink,
  },
  muted: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: authColors.muted,
  },
  link: {
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 20,
    color: authColors.primary,
  },
});

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.page,
  },
  scrollContent: {
    flexGrow: 1,
  },
  body: {
    paddingHorizontal: 24,
    paddingTop: 32,
    gap: AUTH_GAP,
  },
  bodyCentered: {
    flexGrow: 1,
    justifyContent: "center",
    paddingTop: 0,
  },

  hero: {
    backgroundColor: authColors.primary,
    paddingHorizontal: 24,
    paddingBottom: 28,
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
  },
  heroTitle: {
    fontFamily: fonts.medium,
    fontSize: 26,
    lineHeight: 34,
    color: authColors.white,
  },
  heroSubtitle: {
    marginTop: 8,
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 22,
    color: authColors.white,
  },

  header: {
    gap: 12,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: authColors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    gap: 6,
  },
  title: {
    fontFamily: fonts.semibold,
    fontSize: 24,
    lineHeight: 32,
    color: authColors.ink,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: authColors.ink,
  },

  field: {
    width: "100%",
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  label: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    lineHeight: 22,
    color: authColors.ink,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    height: 44,
    borderWidth: 1,
    borderColor: authColors.border,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
  },
  inputFocused: {
    borderColor: authColors.primary,
  },
  inputError: {
    borderColor: authColors.error,
  },
  input: {
    flex: 1,
    height: "100%",
    fontFamily: fonts.regular,
    fontSize: 14,
    color: authColors.ink,
  },
  eyeBtn: {
    paddingLeft: 8,
    paddingVertical: 4,
  },
  errorText: {
    marginTop: 4,
    fontFamily: fonts.medium,
    fontSize: 12,
    lineHeight: 16,
    color: authColors.error,
  },

  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: authColors.checkboxBorder,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: authColors.primary,
    borderColor: authColors.primary,
  },
  checkboxError: {
    borderColor: authColors.error,
  },
  checkboxText: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: authColors.ink,
  },
  inlineLink: {
    color: authColors.primary,
    textDecorationLine: "underline",
  },

  button: {
    height: 44,
    borderRadius: radius.md,
    backgroundColor: authColors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 24,
    color: authColors.white,
  },

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    height: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: authColors.border,
  },
  dividerText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: authColors.ink,
  },

  socialRow: {
    flexDirection: "row",
    gap: 16,
  },
  socialBtn: {
    flex: 1,
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: authColors.border,
    borderRadius: radius.md,
    backgroundColor: colors.white,
  },
  socialText: {
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 22,
    color: authColors.ink,
  },

  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    minHeight: 24,
  },
  footerText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: authColors.muted,
  },
  footerLink: {
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 20,
    color: authColors.primary,
  },
});
