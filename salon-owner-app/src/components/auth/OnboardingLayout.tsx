import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LogoIcon from "../ui/LogoIcon";

interface OnboardingLayoutProps {
  step: number;
  totalSteps?: number;
  children: React.ReactNode;
}

export default function OnboardingLayout({
  step,
  totalSteps = 6,
  children,
}: OnboardingLayoutProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../../assets/registration/signup.png")}
        style={styles.bgImage}
        resizeMode="cover"
      >
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={[
              styles.scrollContent,
              {
                paddingTop: Math.max(insets.top + 16, 28),
                paddingBottom: Math.max(insets.bottom + 16, 28),
              },
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Main Onboarding Card */}
            <View style={styles.card}>
              {/* Logo Header */}
              <View style={styles.logoRow}>
                <LogoIcon width={130} height={35} />
              </View>

              {/* Progress Indicator */}
              <View style={styles.progressContainer}>
                <Text style={styles.stepText}>
                  Step {step} of {totalSteps}
                </Text>
                <View style={styles.progressBar}>
                  {Array.from({ length: totalSteps }).map((_, i) => (
                    <View
                      key={i}
                      style={[
                        styles.progressSegment,
                        i < step
                          ? styles.progressSegmentActive
                          : styles.progressSegmentInactive,
                      ]}
                    />
                  ))}
                </View>
              </View>

              {/* Content */}
              {children}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#635BFF",
  },
  bgImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 24,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  logoRow: {
    marginBottom: 5,
  },
  progressContainer: {
    marginBottom: 24,
  },
  stepText: {
    fontSize: 13,
    fontFamily: "Manrope_600SemiBold",
    color: "#1E293B",
    marginBottom: 8,
  },
  progressBar: {
    flexDirection: "row",
    gap: 6,
  },
  progressSegment: {
    flex: 1,
    height: 6,
    borderRadius: 3,
  },
  progressSegmentActive: {
    backgroundColor: "#635BFF",
  },
  progressSegmentInactive: {
    backgroundColor: "#E2E8F0",
  },
});
