import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { WaiverItem } from "../waiversData";

interface SignNowSendToModalProps {
  visible: boolean;
  onClose: () => void;
  waiver: WaiverItem | null;
}

export default function SignNowSendToModal({
  visible,
  onClose,
  waiver,
}: SignNowSendToModalProps) {
  const router = useRouter();
  const [recipientType, setRecipientType] = useState<"Client" | "Employee">("Client");
  const [channel, setChannel] = useState<"Email" | "SMS" | "WhatsApp">("Email");
  const [recipient, setRecipient] = useState("");
  const [customMessage, setCustomMessage] = useState(
    "Please sign this waiver prior to your appointment."
  );

  const handleSignNowDirect = () => {
    onClose();
    router.push({
      pathname: "/(drawer)/waivers/sign" as any,
      params: { waiverId: waiver?.id, waiverName: waiver?.name },
    });
  };

  const handleSend = () => {
    if (!recipient.trim()) {
      Alert.alert("Recipient Required", `Please enter the ${recipientType}'s ${channel === "Email" ? "email" : "phone number"}.`);
      return;
    }

    Alert.alert(
      "Invitation Sent!",
      `Signing invitation for "${waiver?.name}" sent to ${recipient} via ${channel}.`,
      [{ text: "OK", onPress: onClose }]
    );
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity
          style={styles.modalCard}
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <View style={styles.iconCircle}>
                <Ionicons name="send" size={18} color="#635BFF" />
              </View>
              <Text style={styles.title}>Sign Now / Send To</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollBody} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
            {/* Document Info Banner */}
            <View style={styles.waiverBanner}>
              <Ionicons name="document-text" size={18} color="#635BFF" />
              <View style={{ flex: 1 }}>
                <Text style={styles.waiverBannerName} numberOfLines={1}>
                  {waiver?.name}
                </Text>
                <Text style={styles.waiverBannerSub}>Sign directly on device or send remote invitation</Text>
              </View>
            </View>

            {/* Direct In-Person Signing */}
            <TouchableOpacity
              style={styles.signNowDirectBtn}
              onPress={handleSignNowDirect}
              activeOpacity={0.85}
            >
              <View style={styles.signNowLeft}>
                <View style={styles.signNowIconBox}>
                  <Ionicons name="pencil" size={20} color="#FFFFFF" />
                </View>
                <View>
                  <Text style={styles.signNowTitle}>Sign In-Person Now</Text>
                  <Text style={styles.signNowSub}>Hand tablet/device to signer immediately</Text>
                </View>
              </View>
              <Ionicons name="arrow-forward" size={18} color="#635BFF" />
            </TouchableOpacity>

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR SEND REMOTELY</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Recipient Type Switch */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>RECIPIENT TYPE</Text>
              <View style={styles.toggleRow}>
                {(["Client", "Employee"] as const).map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[styles.toggleBtn, recipientType === t && styles.toggleBtnActive]}
                    onPress={() => setRecipientType(t)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.toggleBtnText, recipientType === t && styles.toggleBtnTextActive]}>
                      {t}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Delivery Channel */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>DELIVERY CHANNEL</Text>
              <View style={styles.channelsRow}>
                {(["Email", "SMS", "WhatsApp"] as const).map((ch) => {
                  const isSelected = channel === ch;
                  const icon = ch === "Email" ? "mail" : ch === "SMS" ? "chatbubble" : "logo-whatsapp";
                  const color = ch === "WhatsApp" ? "#25D366" : ch === "Email" ? "#635BFF" : "#F59E0B";

                  return (
                    <TouchableOpacity
                      key={ch}
                      style={[styles.channelChip, isSelected && { borderColor: color, backgroundColor: `${color}15` }]}
                      onPress={() => setChannel(ch)}
                      activeOpacity={0.7}
                    >
                      <Ionicons name={icon as any} size={15} color={isSelected ? color : "#64748B"} />
                      <Text style={[styles.channelText, isSelected && { color, fontFamily: "Manrope_700Bold" }]}>
                        {ch}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Recipient Input */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>
                {channel === "Email" ? "EMAIL ADDRESS *" : "PHONE NUMBER *"}
              </Text>
              <TextInput
                style={styles.input}
                placeholder={channel === "Email" ? "e.g. maria.rodriguez@example.com" : "+39 340 123 4567"}
                placeholderTextColor="#94A3B8"
                value={recipient}
                onChangeText={setRecipient}
                keyboardType={channel === "Email" ? "email-address" : "phone-pad"}
                autoCapitalize="none"
              />
            </View>

            {/* Custom Message */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>PERSONALIZED MESSAGE</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Include a note..."
                placeholderTextColor="#94A3B8"
                value={customMessage}
                onChangeText={setCustomMessage}
                multiline
                numberOfLines={3}
              />
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.7}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sendBtn} onPress={handleSend} activeOpacity={0.85}>
              <Ionicons name="paper-plane" size={15} color="#FFFFFF" style={{ marginRight: 4 }} />
              <Text style={styles.sendBtnText}>Send Invitation</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalCard: {
    width: "100%",
    maxWidth: 500,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 17,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  closeBtn: {
    padding: 4,
  },
  scrollBody: {
    maxHeight: 520,
  },
  bodyContent: {
    padding: 20,
    gap: 14,
  },
  waiverBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  waiverBannerName: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  waiverBannerSub: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
  },
  signNowDirectBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F5F3FF",
    borderWidth: 1.5,
    borderColor: "#C7D2FE",
    borderRadius: 14,
    padding: 14,
  },
  signNowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  signNowIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#635BFF",
    alignItems: "center",
    justifyContent: "center",
  },
  signNowTitle: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  signNowSub: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginVertical: 4,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E2E8F0",
  },
  dividerText: {
    fontSize: 10,
    fontFamily: "Manrope_700Bold",
    color: "#94A3B8",
    letterSpacing: 0.5,
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
  toggleRow: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    borderRadius: 8,
    padding: 3,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
  },
  toggleBtnActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  toggleBtnText: {
    fontSize: 12,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  toggleBtnTextActive: {
    color: "#635BFF",
    fontFamily: "Manrope_700Bold",
  },
  channelsRow: {
    flexDirection: "row",
    gap: 8,
  },
  channelChip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 9,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
  },
  channelText: {
    fontSize: 12,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
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
  textArea: {
    height: 70,
    textAlignVertical: "top",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    backgroundColor: "#FFFFFF",
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtnText: {
    fontSize: 13,
    fontFamily: "Manrope_600SemiBold",
    color: "#475569",
  },
  sendBtn: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 11,
    borderRadius: 8,
    backgroundColor: "#635BFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#635BFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  sendBtnText: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },
});
