import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useDispatch } from "react-redux";
import { signIn } from "@/redux/slices/authSlice";
import { buildEmployeeUser } from "@/components/auth/authData";
import {
  AuthButton,
  AuthHeader,
  AuthScreen,
  authColors,
  authText,
} from "@/components/auth/AuthKit";
import { colors, fonts, radius } from "@/constants/figmaTheme";

// No dedicated Figma frame — mirrors the Sign up frame (1:46501) visual language.
export default function OTPVerificationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const dispatch = useDispatch();
  const email = (params.email as string) || "user@example.com";
  const fromSignUp = params.fromSignUp === "true";
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(45);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChangeText = (text: string, index: number) => {
    const cleanText = text.replace(/[^0-9]/g, "");
    const newOtp = [...otp];
    newOtp[index] = cleanText;
    setOtp(newOtp);

    if (cleanText && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const isOtpComplete = otp.every((digit) => digit !== "");

  const handleContinue = async () => {
    if (!isOtpComplete) return;

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsLoading(false);

    if (fromSignUp) {
      // New account verified: sign in; the root guard then shows the drawer.
      dispatch(signIn(buildEmployeeUser(email)));
      return;
    }

    router.push({
      pathname: "/auth/reset-password",
      params: { email },
    } as any);
  };

  const handleResend = () => {
    if (timer === 0) {
      setTimer(45);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    }
  };

  return (
    <AuthScreen>
      <AuthHeader
        title="Verification Code"
        subtitle={
          <>
            We&apos;ve sent a 6-digit code to{" "}
            <Text style={authText.strong}>{email}</Text>. Please enter it below.
          </>
        }
        onBack={() => router.back()}
      />

      <View>
        <Text style={styles.typeLabel}>Type your 6 digits security code</Text>
        <View style={styles.otpRow}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                inputRefs.current[index] = ref;
              }}
              style={[
                styles.otpInput,
                (digit || focusedIndex === index) && styles.otpInputActive,
              ]}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleChangeText(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              onFocus={() => setFocusedIndex(index)}
              onBlur={() => setFocusedIndex((i) => (i === index ? null : i))}
              textAlign="center"
              accessibilityLabel={`Digit ${index + 1}`}
            />
          ))}
        </View>
      </View>

      <AuthButton
        label="Verify & Continue"
        onPress={handleContinue}
        loading={isLoading}
        disabled={!isOtpComplete}
      />

      <View style={styles.resendRow}>
        <Text style={authText.muted}>Haven&apos;t got the code yet?</Text>
        <TouchableOpacity
          onPress={handleResend}
          disabled={timer > 0}
          activeOpacity={0.7}
          accessibilityRole="button"
        >
          <Text style={timer > 0 ? authText.muted : authText.link}>
            {timer > 0
              ? `Resend Code 00:${timer.toString().padStart(2, "0")}`
              : "Resend Code"}
          </Text>
        </TouchableOpacity>
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  typeLabel: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    lineHeight: 22,
    color: authColors.ink,
    marginBottom: 5,
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  otpInput: {
    flex: 1,
    height: 48,
    maxWidth: 56,
    borderWidth: 1,
    borderColor: authColors.border,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    fontFamily: fonts.semibold,
    fontSize: 18,
    color: authColors.ink,
  },
  otpInputActive: {
    borderColor: authColors.primary,
  },
  resendRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
});
