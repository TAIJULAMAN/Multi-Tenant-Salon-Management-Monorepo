import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { signIn } from "@/redux/slices/authSlice";
import { buildEmployeeUser } from "@/components/auth/authData";
import {
  AuthButton,
  AuthCheckbox,
  AuthDivider,
  AuthField,
  AuthFooterLink,
  AuthHeader,
  AuthScreen,
  AuthSocialButtons,
  AUTH_GAP,
  authText,
} from "@/components/auth/AuthKit";

// No dedicated Figma frame — mirrors the Sign up frame (1:46501) visual language.
export default function SignInScreen() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
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

    if (!isValid) return;

    setIsLoading(true);
    // Simulate login API call
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsLoading(false);

    // The root Stack.Protected guard switches to the drawer once authenticated.
    dispatch(signIn(buildEmployeeUser(email)));
  };

  return (
    <AuthScreen>
      <AuthHeader title="Sign in" subtitle="Welcome back! Please enter your details." />

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
          labelAccessory={
            <TouchableOpacity
              onPress={() => router.push("/auth/forgot-password" as any)}
              activeOpacity={0.7}
              accessibilityRole="link"
            >
              <Text style={authText.link}>Forgot Password?</Text>
            </TouchableOpacity>
          }
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (passwordError) setPasswordError("");
          }}
          error={passwordError}
          isPassword
          autoComplete="password"
          textContentType="password"
        />
      </View>

      <AuthCheckbox checked={rememberMe} onToggle={() => setRememberMe(!rememberMe)}>
        Remember me for 30 days
      </AuthCheckbox>

      <AuthButton label="Sign In" onPress={handleLogin} loading={isLoading} />

      <AuthDivider label="or sign in with" />

      <AuthSocialButtons />

      <AuthFooterLink
        prompt="Don't have an Account ?"
        action="Sign Up Now"
        onPress={() => router.push("/auth/signup" as any)}
      />
    </AuthScreen>
  );
}
