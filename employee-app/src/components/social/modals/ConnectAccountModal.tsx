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
import { colors, radius } from "@/constants/figmaTheme";
import { SocialAccount } from "../socialData";

interface ConnectAccountModalProps {
  visible: boolean;
  onClose: () => void;
  account: SocialAccount | null;
  onConnect: (accountId: string, handle: string) => void;
}

export default function ConnectAccountModal({
  visible,
  onClose,
  account,
  onConnect,
}: ConnectAccountModalProps) {
  const [handle, setHandle] = useState("");

  if (!account) return null;

  const handleConfirm = () => {
    if (!handle.trim()) {
      Alert.alert("Input Required", `Please enter your ${account.name} handle or page name.`);
      return;
    }

    const formattedHandle = handle.trim().startsWith("@") ? handle.trim() : `@${handle.trim()}`;
    onConnect(account.id, formattedHandle);
    setHandle("");
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={[styles.iconCircle, { backgroundColor: `${account.brandColor}15` }]}>
            <Ionicons name={account.iconName as any} size={28} color={account.brandColor} />
          </View>

          <Text style={styles.title}>Connect {account.name}</Text>

          <Text style={styles.description}>
            Link your professional {account.name} account to see your analytics and reuse your media library when posting your work.
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Account Username / Page Name</Text>
            <TextInput
              style={styles.input}
              placeholder={`e.g. ${account.name.toLowerCase()}studio`}
              placeholderTextColor={colors.textMuted}
              value={handle}
              onChangeText={setHandle}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.7}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.connectBtn}
              onPress={handleConfirm}
              activeOpacity={0.85}
            >
              <Text style={styles.connectBtnText}>Authorize & Link</Text>
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
    backgroundColor: colors.white,
    borderRadius: radius.card,
    padding: 22,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  iconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  title: {
    fontSize: 17,
    fontFamily: "Manrope_700Bold",
    color: colors.text,
    marginBottom: 8,
    textAlign: "center",
  },
  description: {
    fontSize: 12.5,
    fontFamily: "Manrope_500Medium",
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 18,
  },
  inputGroup: {
    width: "100%",
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: colors.textSecondary,
    marginBottom: 6,
  },
  input: {
    width: "100%",
    height: 44,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 13.5,
    fontFamily: "Manrope_500Medium",
    color: colors.text,
    backgroundColor: colors.subtle,
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
    backgroundColor: colors.subtleAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtnText: {
    fontSize: 13,
    fontFamily: "Manrope_600SemiBold",
    color: colors.textSecondary,
  },
  connectBtn: {
    flex: 1.4,
    height: 44,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  connectBtnText: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: colors.white,
  },
});
