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

export default function OnboardingStep5({
  onNext,
  onBack,
  updateData,
  data,
}: Props) {
  const [subdomain, setSubdomain] = useState(data.subdomain || "");
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  const handleCheckAvailability = () => {
    if (subdomain.trim().length > 2) {
      setIsAvailable(true);
    } else {
      setIsAvailable(false);
    }
  };

  const handleConfirm = () => {
    if (subdomain.trim()) {
      updateData({ subdomain: subdomain.trim().toLowerCase() });
      onNext();
    }
  };

  return (
    <OnboardingLayout step={5} totalSteps={6}>
      <Text style={styles.title}>Set up your salon website address</Text>
      <Text style={styles.subtitle}>
        Your clients will use this link to view your salon page and book
        appointments.
      </Text>

      <View style={styles.form}>
        <Text style={styles.label}>Choose your subdomain</Text>

        <View style={styles.subdomainRow}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.subdomainInput}
              placeholder="bellavista"
              placeholderTextColor="#94A3B8"
              value={subdomain}
              onChangeText={(text) => {
                setSubdomain(text);
                setIsAvailable(null);
              }}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <View style={styles.suffixBadge}>
              <Text style={styles.suffixText}>.platform.com</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.checkBtn}
            onPress={handleCheckAvailability}
            activeOpacity={0.8}
          >
            <Text style={styles.checkBtnText}>Check</Text>
          </TouchableOpacity>
        </View>

        {/* Availability Status */}
        {isAvailable === true && (
          <View style={styles.statusRow}>
            <Ionicons name="checkmark-circle" size={16} color="#10B981" />
            <Text style={styles.statusSuccess}>This subdomain is available.</Text>
          </View>
        )}
        {isAvailable === false && (
          <View style={styles.statusRow}>
            <Ionicons name="close-circle" size={16} color="#EF4444" />
            <Text style={styles.statusError}>
              This subdomain is unavailable. Please try another.
            </Text>
          </View>
        )}

        {/* Public URL Box */}
        <View style={styles.urlCard}>
          <Text style={styles.urlLabel}>Your public URL will be:</Text>
          <Text style={styles.urlValue}>
            https://{subdomain.trim().toLowerCase() || "your-salon"}.platform.com
          </Text>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={onBack}
            activeOpacity={0.7}
          >
            <Text style={styles.backBtnText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.continueBtn,
              (!subdomain.trim() || isAvailable === false) &&
                styles.continueBtnDisabled,
            ]}
            onPress={handleConfirm}
            disabled={!subdomain.trim() || isAvailable === false}
            activeOpacity={0.85}
          >
            <Text style={styles.continueBtnText}>Confirm Subdomain</Text>
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
    marginBottom: 24,
  },
  form: {
    width: "100%",
  },
  label: {
    fontSize: 13,
    fontFamily: "Manrope_600SemiBold",
    color: "#1E293B",
    marginBottom: 8,
  },
  subdomainRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    height: 48,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
  },
  subdomainInput: {
    flex: 1,
    paddingHorizontal: 14,
    fontSize: 14,
    fontFamily: "Manrope_500Medium",
    color: "#1E293B",
  },
  suffixBadge: {
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 10,
    justifyContent: "center",
    borderLeftWidth: 1,
    borderLeftColor: "#E2E8F0",
  },
  suffixText: {
    fontSize: 12,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
  },
  checkBtn: {
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: "#EEF2F6",
    alignItems: "center",
    justifyContent: "center",
  },
  checkBtnText: {
    fontSize: 13,
    fontFamily: "Manrope_600SemiBold",
    color: "#635BFF",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 16,
  },
  statusSuccess: {
    fontSize: 12,
    fontFamily: "Manrope_600SemiBold",
    color: "#10B981",
  },
  statusError: {
    fontSize: 12,
    fontFamily: "Manrope_600SemiBold",
    color: "#EF4444",
  },
  urlCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 28,
  },
  urlLabel: {
    fontSize: 11,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
    marginBottom: 4,
  },
  urlValue: {
    fontSize: 13,
    fontFamily: "Manrope_600SemiBold",
    color: "#635BFF",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
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
  continueBtnDisabled: {
    opacity: 0.5,
  },
  continueBtnText: {
    fontSize: 14,
    fontFamily: "Manrope_600SemiBold",
    color: "#FFFFFF",
  },
});
