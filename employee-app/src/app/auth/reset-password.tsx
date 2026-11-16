import React, { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import {
  AuthButton,
  AuthField,
  AuthHeader,
  AuthScreen,
  AUTH_GAP,
  authColors,
  authText,
} from "@/components/auth/AuthKit";
import { colors, fonts } from "@/constants/figmaTheme";

// No dedicated Figma frame — mirrors the Sign up frame (1:46501) visual language.
export default function ResetPasswordScreen() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async () => {
    let isValid = true;

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (!confirmPassword) {
      setConfirmError("Confirm Password is required");
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmError("Passwords do not match");
      isValid = false;
    } else {
      setConfirmError("");
    }

    if (!isValid) return;

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsLoading(false);

    Alert.alert(
      "Password Reset",
      "Your password has been reset successfully. Please sign in with your new credentials.",
      [
        {
          text: "Sign In",
          onPress: () => router.replace("/auth/signin" as any),
        },
      ]
    );
  };

  const getPasswordStrength = () => {
    if (!password) return { label: "", color: authColors.muted, level: 0 };
    if (password.length < 6) return { label: "Weak", color: colors.red, level: 1 };
    if (password.length < 10) return { label: "Medium", color: "#FFAE1F", level: 2 };
    return { label: "Strong", color: colors.green, level: 3 };
  };

  const strength = getPasswordStrength();

  return (
    <AuthScreen>
      <AuthHeader
        title="Set a new password"
        subtitle="Create a new password. Ensure it differs from previous ones for security."
        onBack={() => router.back()}
      />

      <View style={{ gap: AUTH_GAP }}>
        <View>
          <AuthField
            label="New Password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (passwordError) setPasswordError("");
            }}
            error={passwordError}
            isPassword
            autoComplete="new-password"
            textContentType="newPassword"
          />
          {password.length > 0 ? (
            <View style={styles.strength}>
              <View style={styles.strengthBars}>
                {[1, 2, 3].map((i) => (
                  <View
                    key={i}
                    style={[
                      styles.strengthBar,
                      i <= strength.level && { backgroundColor: strength.color },
                    ]}
                  />
                ))}
              </View>
              <Text style={authText.muted}>
                Password Strength:{" "}
                <Text style={[styles.strengthValue, { color: strength.color }]}>
                  {strength.label}
                </Text>
              </Text>
            </View>
          ) : null}
        </View>

        <AuthField
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            if (confirmError) setConfirmError("");
          }}
          error={confirmError}
          isPassword
          autoComplete="new-password"
          textContentType="newPassword"
        />
      </View>

      <AuthButton label="Reset Password" onPress={handleReset} loading={isLoading} />
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  strength: {
    marginTop: 8,
    gap: 6,
  },
  strengthBars: {
    flexDirection: "row",
    gap: 6,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: authColors.border,
  },
  strengthValue: {
    fontFamily: fonts.semibold,
  },
});
