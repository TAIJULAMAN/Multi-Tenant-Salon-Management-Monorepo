import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import OnboardingLayout from "./OnboardingLayout";

interface Props {
  onNext: () => void;
  onBack: () => void;
  updateData: (data: any) => void;
  data: any;
}

export default function OnboardingStep4({
  onNext,
  onBack,
  updateData,
  data,
}: Props) {
  const [businessDisplayName, setBusinessDisplayName] = useState(
    data.businessDisplayName || data.businessName || ""
  );
  const [brandColor] = useState(data.brandColor || "#7C3AED");
  const [tagline, setTagline] = useState(data.tagline || "");
  const [phone, setPhone] = useState(data.phone || "");
  const [contactEmail, setContactEmail] = useState(
    data.contactEmail || data.email || ""
  );

  const handleContinue = () => {
    updateData({
      businessDisplayName,
      brandColor,
      tagline,
      phone,
      contactEmail,
    });
    onNext();
  };

  return (
    <OnboardingLayout step={4} totalSteps={6}>
      <Text style={styles.title}>Set up your salon branding</Text>
      <Text style={styles.subtitle}>
        Upload your logo and choose a brand color for your dashboard and client
        booking page.
      </Text>

      <View style={styles.form}>
        {/* Logo Upload Box */}
        <Text style={styles.label}>Logo</Text>
        <TouchableOpacity style={styles.uploadContainer} activeOpacity={0.8}>
          <View style={styles.uploadIconCircle}>
            <Ionicons name="cloud-upload-outline" size={22} color="#635BFF" />
          </View>
          <Text style={styles.uploadTitle}>Upload salon logo</Text>
          <Text style={styles.uploadSubtitle}>
            Supported formats: PNG, JPG, SVG
          </Text>
        </TouchableOpacity>

        {/* Business Display Name */}
        <Text style={styles.label}>Business display name</Text>
        <TextInput
          style={styles.input}
          placeholder="Bella Vista Salon"
          placeholderTextColor="#94A3B8"
          value={businessDisplayName}
          onChangeText={setBusinessDisplayName}
        />

        {/* Tagline */}
        <Text style={styles.label}>Tagline (Optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Elevated experience"
          placeholderTextColor="#94A3B8"
          value={tagline}
          onChangeText={setTagline}
        />

        {/* Phone Number */}
        <Text style={styles.label}>Phone number (Optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="(555) 123-4567"
          placeholderTextColor="#94A3B8"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        {/* Contact Email */}
        <Text style={styles.label}>Contact email (Optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="hello@salon.com"
          placeholderTextColor="#94A3B8"
          value={contactEmail}
          onChangeText={setContactEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={onBack}
            activeOpacity={0.7}
          >
            <Text style={styles.backBtnText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.continueBtn}
            onPress={handleContinue}
            activeOpacity={0.85}
          >
            <Text style={styles.continueBtnText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
    lineHeight: 32,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: "Manrope_400Regular",
    color: "#64748B",
    lineHeight: 20,
    marginBottom: 20,
  },
  form: {
    width: "100%",
  },
  label: {
    fontSize: 13,
    fontFamily: "Manrope_600SemiBold",
    color: "#1E293B",
    marginBottom: 6,
  },
  uploadContainer: {
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderStyle: "dashed",
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  uploadIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  uploadTitle: {
    fontSize: 13,
    fontFamily: "Manrope_600SemiBold",
    color: "#635BFF",
    marginBottom: 2,
  },
  uploadSubtitle: {
    fontSize: 11,
    fontFamily: "Manrope_400Regular",
    color: "#94A3B8",
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 14,
    fontFamily: "Manrope_500Medium",
    color: "#1E293B",
    backgroundColor: "#FFFFFF",
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  backBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  backBtnText: {
    fontSize: 14,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  continueBtn: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    backgroundColor: "#635BFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#635BFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  continueBtnText: {
    fontSize: 14,
    fontFamily: "Manrope_600SemiBold",
    color: "#FFFFFF",
  },
});
