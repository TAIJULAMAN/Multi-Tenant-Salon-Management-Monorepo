import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import LogoIcon from "@/components/ui/LogoIcon";

export default function OTPVerificationScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  const email = (params.email as string) || "user@example.com";
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(45);
  const [isLoading, setIsLoading] = useState(false);

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
          <Text style={styles.title}>Verification Code</Text>
          <Text style={styles.subtitle}>
            We've sent a 6-digit code to{" "}
            <Text style={styles.boldEmail}>{email}</Text>. Please enter it below.
          </Text>
        </View>

        {/* OTP Slots */}
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
                digit ? styles.otpInputFilled : null,
              ]}
              keyboardType="numeric"
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleChangeText(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              textAlign="center"
            />
          ))}
        </View>

        {/* Resend Link */}
        <View style={styles.resendContainer}>
          <Text style={styles.resendInfoText}>Haven't got the code yet?</Text>
          <TouchableOpacity
            style={[styles.resendBtn, timer > 0 && styles.resendBtnDisabled]}
            onPress={handleResend}
            disabled={timer > 0}
            activeOpacity={0.8}
          >
            <Ionicons
              name="refresh-outline"
              size={14}
              color={timer > 0 ? "#94A3B8" : "#635BFF"}
              style={styles.resendIcon}
            />
            <Text
              style={[
                styles.resendText,
                timer > 0 ? styles.resendTextDisabled : null,
              ]}
            >
              {timer > 0
                ? `Resend Code 00:${timer.toString().padStart(2, "0")}`
                : "Resend Code"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={[
            styles.submitBtn,
            (!isOtpComplete || isLoading) && styles.submitBtnDisabled,
          ]}
          onPress={handleContinue}
          disabled={!isOtpComplete || isLoading}
          activeOpacity={0.85}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.submitBtnText}>Verify & Continue</Text>
          )}
        </TouchableOpacity>
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
  boldEmail: {
    fontFamily: "Manrope_600SemiBold",
    color: "#1E293B",
  },
  typeLabel: {
    fontSize: 13,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
    marginBottom: 14,
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  otpInput: {
    width: "14%",
    aspectRatio: 1,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    fontSize: 20,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
    backgroundColor: "#F8FAFC",
  },
  otpInputFilled: {
    borderColor: "#635BFF",
    backgroundColor: "#FFFFFF",
  },
  resendContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  resendInfoText: {
    fontSize: 12,
    fontFamily: "Manrope_400Regular",
    color: "#64748B",
    marginBottom: 8,
  },
  resendBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  resendBtnDisabled: {
    backgroundColor: "#F1F5F9",
  },
  resendIcon: {
    marginRight: 6,
  },
  resendText: {
    fontSize: 13,
    fontFamily: "Manrope_600SemiBold",
    color: "#635BFF",
  },
  resendTextDisabled: {
    color: "#94A3B8",
  },
  submitBtn: {
    backgroundColor: "#635BFF",
    borderRadius: 12,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#635BFF",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Manrope_700Bold",
  },
});
