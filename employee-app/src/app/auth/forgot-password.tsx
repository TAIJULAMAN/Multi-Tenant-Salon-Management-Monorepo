import React, { useState } from "react";
import { useRouter } from "expo-router";
import {
  AuthButton,
  AuthField,
  AuthFooterLink,
  AuthHeader,
  AuthScreen,
} from "@/components/auth/AuthKit";

// No dedicated Figma frame — mirrors the Sign up frame (1:46501) visual language.
export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async () => {
    if (!email.trim()) {
      setEmailError("Email is required");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    setEmailError("");

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsLoading(false);

    router.push({
      pathname: "/auth/otp-verification",
      params: { email, fromSignUp: "false" },
    } as any);
  };

  return (
    <AuthScreen>
      <AuthHeader
        title="Forgot Password"
        subtitle="Please enter your Email Address to reset the password."
        onBack={() => router.back()}
      />

      <AuthField
        label="Email Address"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          if (emailError) setEmailError("");
        }}
        error={emailError}
        keyboardType="email-address"
        autoComplete="email"
        textContentType="emailAddress"
      />

      <AuthButton label="Continue" onPress={handleReset} loading={isLoading} />

      <AuthFooterLink
        prompt="Remember your password?"
        action="Sign In Now"
        onPress={() => router.back()}
      />
    </AuthScreen>
  );
}
