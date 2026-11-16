import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  PanResponder,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

export default function SignWaiverScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  const waiverName = (params.waiverName as string) || "General Service Consent & Liability Release";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // SVG Touch signature path state
  const [paths, setPaths] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState<string>("");

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt) => {
      const { locationX, locationY } = evt.nativeEvent;
      setCurrentPath(`M ${locationX} ${locationY}`);
    },
    onPanResponderMove: (evt) => {
      const { locationX, locationY } = evt.nativeEvent;
      setCurrentPath((prev) => `${prev} L ${locationX} ${locationY}`);
    },
    onPanResponderRelease: () => {
      if (currentPath) {
        setPaths([...paths, currentPath]);
        setCurrentPath("");
      }
    },
  });

  const handleClearSignature = () => {
    setPaths([]);
    setCurrentPath("");
  };

  const handleCompleteSigning = () => {
    if (!fullName.trim() || !email.trim()) {
      Alert.alert("Required Information", "Please enter your full name and email address.");
      return;
    }

    if (paths.length === 0 && !currentPath) {
      Alert.alert("Signature Required", "Please draw your signature in the signature box.");
      return;
    }

    if (!agreedToTerms) {
      Alert.alert("Agreement Required", "Please confirm that you have read and agreed to the waiver terms.");
      return;
    }

    Alert.alert(
      "Waiver Signed Successfully!",
      `Thank you, ${fullName}. A copy of your signed document has been sent to ${email}.`,
      [{ text: "Done", onPress: () => router.back() }]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 12) }]}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={20} color="#635BFF" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Sign Waiver</Text>
          <Text style={styles.headerSubtitle} numberOfLines={1}>
            {waiverName}
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.contentScroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Document Overview Card */}
        <View style={styles.waiverCard}>
          <View style={styles.waiverCardHeader}>
            <View style={styles.iconCircle}>
              <Ionicons name="shield-checkmark" size={20} color="#635BFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.waiverTitle}>{waiverName}</Text>
              <Text style={styles.waiverMeta}>Issued by GlamPro Salon • Verified Document</Text>
            </View>
          </View>

          <Text style={styles.waiverTermsText}>
            By signing below, I acknowledge that I have disclosed all relevant medical history, allergies, and contraindications. I consent to receiving salon services and release the salon and its certified staff from liability for unforeseen allergic reactions or post-treatment sensitivities provided standard professional care is exercised.
          </Text>
        </View>

        {/* Form Fields */}
        <View style={styles.formCard}>
          <Text style={styles.formCardTitle}>Signer Details</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>FULL LEGAL NAME *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Maria Rodriguez"
              placeholderTextColor="#94A3B8"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>EMAIL ADDRESS *</Text>
            <TextInput
              style={styles.input}
              placeholder="maria@example.com"
              placeholderTextColor="#94A3B8"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>PHONE NUMBER</Text>
            <TextInput
              style={styles.input}
              placeholder="+39 340 123 4567"
              placeholderTextColor="#94A3B8"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Digital Signature Drawing Pad */}
        <View style={styles.formCard}>
          <View style={styles.sigHeaderRow}>
            <View>
              <Text style={styles.formCardTitle}>Digital Signature *</Text>
              <Text style={styles.sigSub}>Draw your signature using your finger</Text>
            </View>

            <TouchableOpacity style={styles.clearBtn} onPress={handleClearSignature} activeOpacity={0.7}>
              <Ionicons name="refresh-outline" size={14} color="#EF4444" />
              <Text style={styles.clearBtnText}>Clear</Text>
            </TouchableOpacity>
          </View>

          {/* Touch Canvas */}
          <View style={styles.canvasContainer} {...panResponder.panHandlers}>
            <Svg style={StyleSheet.absoluteFill}>
              {paths.map((p, idx) => (
                <Path
                  key={idx}
                  d={p}
                  stroke="#1E293B"
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              ))}
              {currentPath ? (
                <Path
                  d={currentPath}
                  stroke="#635BFF"
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              ) : null}
            </Svg>

            {paths.length === 0 && !currentPath && (
              <View style={styles.canvasPlaceholder}>
                <Ionicons name="pencil-outline" size={24} color="#CBD5E1" />
                <Text style={styles.canvasPlaceholderText}>Sign inside this box</Text>
              </View>
            )}
          </View>

          <View style={styles.sigFooterRow}>
            <Text style={styles.sigTimestamp}>
              Signed on: {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </Text>
            <Text style={styles.sigCert}>Encrypted 256-bit SSL</Text>
          </View>
        </View>

        {/* Agreement Checkbox */}
        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => setAgreedToTerms(!agreedToTerms)}
          activeOpacity={0.8}
        >
          <Ionicons
            name={agreedToTerms ? "checkbox" : "square-outline"}
            size={22}
            color={agreedToTerms ? "#635BFF" : "#CBD5E1"}
          />
          <Text style={styles.checkboxText}>
            I confirm that the information provided is accurate and I agree to the terms of this liability waiver.
          </Text>
        </TouchableOpacity>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitBtn, (!agreedToTerms || !fullName.trim()) && styles.submitBtnDisabled]}
          onPress={handleCompleteSigning}
          activeOpacity={0.85}
        >
          <Ionicons name="shield-checkmark-outline" size={18} color="#FFFFFF" />
          <Text style={styles.submitBtnText}>Sign & Complete Waiver</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    gap: 12,
  },
  backBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: "#EEF2FF",
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  headerSubtitle: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
  },
  contentScroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  waiverCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
    gap: 12,
  },
  waiverCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  waiverTitle: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  waiverMeta: {
    fontSize: 10,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
  },
  waiverTermsText: {
    fontSize: 12,
    fontFamily: "Manrope_500Medium",
    color: "#475569",
    lineHeight: 18,
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
    gap: 14,
  },
  formCardTitle: {
    fontSize: 15,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  formGroup: {
    gap: 6,
  },
  label: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#64748B",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    fontFamily: "Manrope_600SemiBold",
    color: "#1E293B",
    backgroundColor: "#FFFFFF",
  },
  sigHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  sigSub: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
    marginTop: 2,
  },
  clearBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FEF2F2",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  clearBtnText: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#EF4444",
  },
  canvasContainer: {
    height: 160,
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    borderStyle: "dashed",
    overflow: "hidden",
    position: "relative",
  },
  canvasPlaceholder: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  canvasPlaceholderText: {
    fontSize: 12,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
  },
  sigFooterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sigTimestamp: {
    fontSize: 10,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
  },
  sigCert: {
    fontSize: 10,
    fontFamily: "Manrope_700Bold",
    color: "#10B981",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 14,
  },
  checkboxText: {
    flex: 1,
    fontSize: 12,
    fontFamily: "Manrope_500Medium",
    color: "#475569",
    lineHeight: 18,
  },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#635BFF",
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: "#635BFF",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  submitBtnDisabled: {
    backgroundColor: "#CBD5E1",
    shadowOpacity: 0,
  },
  submitBtnText: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },
});
