import React from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import SignupForm from "@/components/auth/SignupForm";
import { colors } from "@/constants/figmaTheme";

// Figma 1:46501 "Onboarding - 1" (Sign up). The desktop marketing panel is
// condensed into a purple hero above the form (see SignupForm).
export default function SignUpScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <SignupForm
        onSubmit={({ email }) =>
          router.push({
            pathname: "/auth/otp-verification",
            params: { email, fromSignUp: "true" },
          } as any)
        }
        onSignIn={() => router.replace("/auth/signin" as any)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.page,
  },
});
