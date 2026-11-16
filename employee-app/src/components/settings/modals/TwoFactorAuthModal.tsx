import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface TwoFactorAuthModalProps {
  visible: boolean;
  onClose: () => void;
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export default function TwoFactorAuthModal({
  visible,
  onClose,
  isEnabled,
  onToggle,
}: TwoFactorAuthModalProps) {
  const [code, setCode] = useState("");

  const handleConfirm = () => {
    if (!isEnabled && code.length < 6) {
      Alert.alert("Verification Code", "Please enter the 6-digit authentication code.");
      return;
    }
    const nextState = !isEnabled;
    onToggle(nextState);
    Alert.alert(
      nextState ? "2FA Enabled" : "2FA Disabled",
      nextState
        ? "Two-Factor Authentication is now active on your account."
        : "Two-Factor Authentication has been disabled.",
      [{ text: "OK", onPress: onClose }]
    );
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Ionicons
              name={isEnabled ? "shield-outline" : "shield-checkmark-outline"}
              size={26}
              color="#635BFF"
            />
          </View>

          <Text style={styles.title}>
            {isEnabled ? "Disable 2FA" : "Enable Two-Factor Authentication"}
          </Text>

          <Text style={styles.description}>
            {isEnabled
              ? "Are you sure you want to turn off two-factor authentication? Your account will only be protected by your password."
              : "Scan the QR code or link your Google Authenticator app, then enter the 6-digit confirmation code below."}
          </Text>

          {!isEnabled && (
            <View style={styles.codeContainer}>
              <View style={styles.mockQrBox}>
                <Ionicons name="qr-code-outline" size={72} color="#1E293B" />
                <Text style={styles.manualCodeText}>Secret Key: GLAM-PRO-8921-SEC</Text>
              </View>

              <TextInput
                style={styles.codeInput}
                placeholder="Enter 6-digit code"
                placeholderTextColor="#94A3B8"
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
                maxLength={6}
              />
            </View>
          )}

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.7}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.confirmBtn, isEnabled && styles.disableBtn]}
              onPress={handleConfirm}
              activeOpacity={0.85}
            >
              <Text style={styles.confirmBtnText}>
                {isEnabled ? "Disable 2FA" : "Verify & Enable"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 22,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  title: {
    fontSize: 16,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
    marginBottom: 8,
    textAlign: "center",
  },
  description: {
    fontSize: 12.5,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 16,
  },
  codeContainer: {
    width: "100%",
    alignItems: "center",
    gap: 12,
    marginBottom: 18,
  },
  mockQrBox: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    gap: 6,
    width: "100%",
  },
  manualCodeText: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
    letterSpacing: 0.5,
  },
  codeInput: {
    width: "100%",
    height: 44,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 15,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
    backgroundColor: "#F8FAFC",
    textAlign: "center",
    letterSpacing: 4,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
  },
  cancelBtn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtnText: {
    fontSize: 13,
    fontFamily: "Manrope_600SemiBold",
    color: "#475569",
  },
  confirmBtn: {
    flex: 1.4,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#635BFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#635BFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  disableBtn: {
    backgroundColor: "#EF4444",
    shadowColor: "#EF4444",
  },
  confirmBtnText: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },
});
