import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function WaiverInvitationScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 0) }]}>
      {/* Background Purple Header */}
      <View style={styles.purpleBanner}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.brandRow}>
          <Image
            source={require("../../../../assets/app/transparentIcon.png")}
            style={styles.brandIcon}
            resizeMode="contain"
          />
          <Text style={styles.brandTitle}>GlamPro Salon</Text>
        </View>
      </View>

      {/* Main Overlapping Card Container */}
      <ScrollView
        style={styles.scrollBody}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.invitationCard}>
          {/* Subheader Banner */}
          <View style={styles.cardHeaderBanner}>
            <Text style={styles.cardHeaderTitle}>Invitation to Sign</Text>
          </View>

          {/* Body */}
          <View style={styles.cardBody}>
            <View style={styles.greetingBlock}>
              <Text style={styles.greetingTitle}>Hello, Elena!</Text>
              <Text style={styles.greetingSub}>
                You've been invited by your stylist at <Text style={styles.boldText}>GlamPro Salon</Text> to review and sign your service consultation waiver before your appointment.
              </Text>
            </View>

            <View style={styles.actionBlock}>
              <TouchableOpacity
                style={styles.completeBtn}
                onPress={() => router.push("/(drawer)/waivers/sign" as any)}
                activeOpacity={0.85}
              >
                <Text style={styles.completeBtnText}>Complete & Sign Waiver</Text>
                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.signoffBlock}>
              <Text style={styles.signoffSub}>Best regards,</Text>
              <Text style={styles.signoffTeam}>The GlamPro Team</Text>
            </View>
          </View>

          {/* Footer Social Channel Links */}
          <View style={styles.cardFooter}>
            <TouchableOpacity style={styles.socialCircle} activeOpacity={0.7}>
              <Ionicons name="logo-instagram" size={18} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialCircle} activeOpacity={0.7}>
              <Ionicons name="logo-whatsapp" size={18} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialCircle} activeOpacity={0.7}>
              <Ionicons name="logo-youtube" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  purpleBanner: {
    backgroundColor: "#635BFF",
    height: 180,
    paddingHorizontal: 16,
    paddingTop: 16,
    alignItems: "center",
  },
  backBtn: {
    alignSelf: "flex-start",
    padding: 8,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginBottom: 8,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  brandIcon: {
    width: 28,
    height: 28,
    tintColor: "#FFFFFF",
  },
  brandTitle: {
    fontSize: 22,
    fontFamily: "Manrope_800ExtraBold",
    color: "#FFFFFF",
  },
  scrollBody: {
    flex: 1,
    marginTop: -50,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  invitationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  cardHeaderBanner: {
    backgroundColor: "#EEF2FF",
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E7FF",
  },
  cardHeaderTitle: {
    fontSize: 18,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  cardBody: {
    padding: 24,
    gap: 20,
  },
  greetingBlock: {
    gap: 8,
  },
  greetingTitle: {
    fontSize: 20,
    fontFamily: "Manrope_800ExtraBold",
    color: "#1E293B",
  },
  greetingSub: {
    fontSize: 13,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    lineHeight: 20,
  },
  boldText: {
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  actionBlock: {
    paddingTop: 8,
  },
  completeBtn: {
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
  completeBtnText: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },
  signoffBlock: {
    gap: 2,
    paddingTop: 8,
  },
  signoffSub: {
    fontSize: 12,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
  },
  signoffTeam: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  cardFooter: {
    backgroundColor: "#EEF2FF",
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: "#E0E7FF",
  },
  socialCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#635BFF",
    alignItems: "center",
    justifyContent: "center",
  },
});
