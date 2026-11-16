import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { useDispatch } from "react-redux";
import { useRouter } from "expo-router";
import { setAuthState } from "../../redux/slices/authSlice";

interface Props {
  data: any;
}

export default function OnboardingStep6({ data }: Props) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 2800; // ~2.8 seconds
    const interval = 40;
    const totalSteps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const newProgress = Math.min(
        Math.round((currentStep / totalSteps) * 100),
        100
      );
      setProgress(newProgress);

      if (currentStep >= totalSteps) {
        clearInterval(timer);

        setTimeout(() => {
          // Dispatch auth state so user is logged in directly into the app
          dispatch(
            setAuthState({
              isAuthenticated: true,
              isSubscribed: true,
              user: {
                email: data.email,
                businessName: data.businessName,
                businessType: data.businessType,
                goals: data.goals,
                businessDisplayName: data.businessDisplayName,
                brandColor: data.brandColor,
                tagline: data.tagline,
                phone: data.phone,
                contactEmail: data.contactEmail,
                subdomain: data.subdomain,
              },
            })
          );
          router.replace("/(drawer)/(tabs)" as any);
        }, 400);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [dispatch, router, data]);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../../assets/registration/signup.png")}
        style={styles.bgImage}
        resizeMode="cover"
      >
        <View style={styles.contentWrapper}>
          <View style={styles.card}>
            <Text style={styles.title}>Preparing your salon workspace</Text>
            <Text style={styles.subtitle}>
              We're creating your dashboard, branding, and client booking website.
            </Text>

            <View style={styles.progressContainer}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>INITIALIZATION PROGRESS</Text>
                <Text style={styles.progressValue}>{progress}%</Text>
              </View>

              <View style={styles.progressBarTrack}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${progress}%` },
                  ]}
                />
              </View>

              <Text style={styles.quote}>
                Step into the future of salon management.
              </Text>
            </View>
          </View>
        </View>
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
  contentWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  card: {
    width: "100%",
    maxWidth: 440,
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    paddingVertical: 36,
    paddingHorizontal: 24,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
    textAlign: "center",
    marginBottom: 10,
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Manrope_400Regular",
    color: "#64748B",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  progressContainer: {
    width: "100%",
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#64748B",
    letterSpacing: 0.5,
  },
  progressValue: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  progressBarTrack: {
    width: "100%",
    height: 10,
    backgroundColor: "#E0E7FF",
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 20,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#635BFF",
    borderRadius: 5,
  },
  quote: {
    fontSize: 12,
    fontFamily: "Manrope_500Medium",
    fontStyle: "italic",
    color: "#64748B",
    textAlign: "center",
  },
});
