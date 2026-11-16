import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import LogoIcon from "@/components/ui/LogoIcon";
import CustomInput from "@/components/ui/CustomInput";

export default function ResetPasswordScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

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
    if (!password) return { label: "", color: "#9CA3AF" };
    if (password.length < 6) return { label: "Weak", color: "#EF4444" };
    if (password.length < 10) return { label: "Medium", color: "#F59E0B" };
    return { label: "Strong", color: "#10B981" };
  };

  const strength = getPasswordStrength();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: Math.max(insets.top, 24),
            paddingBottom: Math.max(insets.bottom, 24),
          },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Back Button & Logo Header */}
        <View style={styles.topRow}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color="#1E293B" />
          </TouchableOpacity>
          <View style={styles.logoRow}>
            <LogoIcon width={130} height={35} />
          </View>
        </View>

        {/* Title & Description */}
        <View style={styles.header}>
          <Text style={styles.title}>Set a new password</Text>
          <Text style={styles.subtitle}>
            Create a new password. Ensure it differs from previous ones for
            security.
          </Text>
        </View>

        {/* Inputs */}
        <View style={styles.form}>
          <CustomInput
            label="New Password"
            placeholder="Enter new password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (passwordError) setPasswordError("");
            }}
            error={passwordError}
            isPassword
          />

          <CustomInput
            label="Confirm Password"
            placeholder="Re-enter password"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              if (confirmError) setConfirmError("");
            }}
            error={confirmError}
            isPassword
          />

          {/* Password Strength */}
          {password.length > 0 && (
            <View style={styles.strengthRow}>
              <Text style={styles.strengthLabel}>Password Strength: </Text>
              <Text style={[styles.strengthValue, { color: strength.color }]}>
                {strength.label}
              </Text>
            </View>
          )}

          {/* Reset Button */}
          <TouchableOpacity
            style={[styles.submitBtn, isLoading && styles.submitBtnDisabled]}
            onPress={handleReset}
            disabled={isLoading}
            activeOpacity={0.85}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.submitBtnText}>Reset Password</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  logoRow: {
    alignItems: "flex-start",
  },
  header: {
    marginBottom: 28,
  },
  title: {
    fontSize: 28,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Manrope_400Regular",
    color: "#64748B",
    lineHeight: 22,
  },
  form: {
    width: "100%",
  },
  strengthRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop: -4,
  },
  strengthLabel: {
    fontSize: 12,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
  },
  strengthValue: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
  },
  submitBtn: {
    backgroundColor: "#635BFF",
    borderRadius: 12,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    shadowColor: "#635BFF",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  submitBtnDisabled: {
    opacity: 0.7,
  },
  submitBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Manrope_700Bold",
  },
});
