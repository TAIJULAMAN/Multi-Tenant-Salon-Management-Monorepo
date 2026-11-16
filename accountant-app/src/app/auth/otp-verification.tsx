import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import CustomHeader from "@/components/ui/CustomHeader";
import CustomButton from "@/components/ui/CustomButton";

export default function OTPVerificationScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  const email = (params.email as string) || "wil*****@pec.it";
  const fromSignUp = params.fromSignUp === "true";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(45);
  const [isVerified, setIsVerified] = useState(false);

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
    // Only accept numeric inputs
    const cleanText = text.replace(/[^0-9]/g, "");
    const newOtp = [...otp];
    newOtp[index] = cleanText;
    setOtp(newOtp);

    // Auto-focus next input if a digit is entered
    if (cleanText && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Auto-focus previous input on backspace if current is empty
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const isOtpComplete = otp.every((digit) => digit !== "");

  const handleContinue = () => {
    if (fromSignUp) {
      // If we signed up, trigger verified screen overlay first
      setIsVerified(true);
    } else {
      // If we forgot password, navigate to reset password page
      router.push("/auth/reset-password" as any);
    }
  };

  const handleFinishSignUp = () => {
    // Navigate to sign in
    router.replace("/auth/signin" as any);
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
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <CustomHeader title="" showBack={!isVerified} />

      {!isVerified ? (
        // ================== OTP CODE VIEW ==================
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom, 24) },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* App Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require("../../../assets/app/appIcon.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Title & Description */}
          <View style={styles.textContainer}>
            <Text style={styles.title}>Verification OTP sent</Text>
            <Text style={styles.subtitle}>
              We&apos;ve sent a verification code to{" "}
              <Text style={styles.boldEmail}>{email}</Text>{"\n"}Please enter the
              code below to verify your account.
            </Text>
          </View>

          {/* OTP Slots */}
          <Text style={styles.typeLabel}>Type your 6 digits Security code</Text>
          <View style={styles.otpRow}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
                style={styles.otpInput}
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
            <Text style={styles.resendInfoText}>Haven&apos;t got the OTP yet?</Text>
            <TouchableOpacity
              style={[styles.resendBtn, timer > 0 && styles.resendBtnDisabled]}
              onPress={handleResend}
              disabled={timer > 0}
              activeOpacity={0.8}
            >
              <Ionicons
                name="refresh-outline"
                size={14}
                color={timer > 0 ? "#9CA3AF" : "#635BFF"}
                style={styles.resendIcon}
              />
              <Text
                style={[
                  styles.resendText,
                  timer > 0 ? styles.resendTextDisabled : null,
                ]}
              >
                {timer > 0
                  ? `Resend OTP 00:${timer.toString().padStart(2, "0")}`
                  : "Resend OTP"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Bottom Controls */}
          <View style={styles.bottomButtons}>
            <CustomButton
              title="Continue"
              disabled={!isOtpComplete}
              onPress={handleContinue}
              buttonStyle={styles.continueBtn}
            />

            <TouchableOpacity style={styles.helpBtn} activeOpacity={0.7}>
              <Text style={styles.helpText}>Need help?</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        // ================== VERIFICATION DONE VIEW ==================
        <View style={styles.doneContainer}>
          <ScrollView
            contentContainerStyle={styles.doneScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Logo */}
            <View style={styles.logoContainer}>
              <Image
                source={require("../../../assets/app/appIcon.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            {/* Success Details */}
            <View style={styles.textContainer}>
              <Text style={[styles.title, styles.greenText]}>
                Verification Done
              </Text>
              <Text style={styles.subtitle}>
                Your email Verification Complete. Continue to sign in.
              </Text>
            </View>

            {/* Status Badge */}
            <View style={styles.statusBadge}>
              <Ionicons name="checkmark-circle" size={16} color="#10B981" />
              <Text style={styles.statusText}>Status: Verified</Text>
            </View>

            {/* Done Buttons */}
            <View style={[styles.bottomButtons, { marginTop: 40 }]}>
              <CustomButton
                title="Continue"
                onPress={handleFinishSignUp}
                buttonStyle={styles.continueBtn}
              />

              <TouchableOpacity style={styles.helpBtn} activeOpacity={0.7}>
                <Text style={styles.helpText}>Need help?</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      )}
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
  doneContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  doneScrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  logo: {
    width: 64,
    height: 64,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
  },
  greenText: {
    color: "#10B981",
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 16,
  },
  boldEmail: {
    fontWeight: "700",
    color: "#111827",
  },
  typeLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4B5563",
    textAlign: "center",
    marginBottom: 16,
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 24,
  },
  otpInput: {
    width: 48,
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  resendContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginBottom: 36,
  },
  resendInfoText: {
    fontSize: 13,
    color: "#6B7280",
  },
  resendBtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  resendBtnDisabled: {
    opacity: 0.6,
  },
  resendIcon: {
    marginRight: 4,
  },
  resendText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#635BFF",
  },
  resendTextDisabled: {
    color: "#9CA3AF",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ECFDF5",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: "center",
    gap: 6,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#10B981",
  },
  bottomButtons: {
    marginTop: "auto",
    gap: 16,
    alignItems: "center",
  },
  continueBtn: {
    width: "100%",
  },
  helpBtn: {
    padding: 8,
  },
  helpText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#635BFF",
  },
});
