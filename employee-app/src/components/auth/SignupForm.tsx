import React, { useState } from "react";
import { View } from "react-native";
import {
  AuthButton,
  AuthCheckbox,
  AuthDivider,
  AuthField,
  AuthFooterLink,
  AuthHeader,
  AuthHero,
  AuthInlineLink,
  AuthScreen,
  AuthSocialButtons,
  AUTH_GAP,
} from "@/components/auth/AuthKit";

interface Props {
  onSubmit: (data: { email: string; password: string }) => void;
  onSignIn: () => void;
}

// Figma 1:46501 "Onboarding - 1". The right-hand marketing panel becomes a
// compact purple hero above the form on mobile.
export default function SignupForm({ onSubmit, onSignIn }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [termsError, setTermsError] = useState("");

  const handleSubmit = async () => {
    let isValid = true;

    if (!email.trim()) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (!agreeTerms) {
      setTermsError("You must agree to the Terms of Service and Privacy Policy");
      isValid = false;
    } else {
      setTermsError("");
    }

    if (!isValid) return;

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsLoading(false);
    onSubmit({ email: email.trim(), password });
  };

  return (
    <AuthScreen
      hero={
        <AuthHero
          title="Transform Your Salon Business"
          subtitle="One platform — booking, inventory, forms, budgeting & social media — built to simplify and scale"
        />
      }
    >
      <AuthHeader
        title="Sign up"
        subtitle="Everything you need to run your business — in one place."
      />

      <View style={{ gap: AUTH_GAP }}>
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

        <AuthField
          label="Password"
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
      </View>

      <AuthCheckbox
        checked={agreeTerms}
        onToggle={() => {
          setAgreeTerms(!agreeTerms);
          if (termsError) setTermsError("");
        }}
        error={termsError}
      >
        I agree to the <AuthInlineLink>Terms of Service</AuthInlineLink> and{" "}
        <AuthInlineLink>Privacy Policy</AuthInlineLink>.
      </AuthCheckbox>

      <AuthButton label="Create Account" onPress={handleSubmit} loading={isLoading} />

      <AuthDivider label="or sign up with" />

      <AuthSocialButtons />

      <AuthFooterLink
        prompt="Already have an Account ?"
        action="Sign In Now"
        onPress={onSignIn}
      />
    </AuthScreen>
  );
}
