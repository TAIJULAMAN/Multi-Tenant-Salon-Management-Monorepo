import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import CustomButton from "@/components/ui/CustomButton";
import { useDispatch } from "react-redux";
import { setAuthState } from "../../redux/slices/authSlice";

const { width, height } = Dimensions.get("window");

export default function SubscriptionIndexScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

  const [billingCycle, setBillingCycle] = useState<"annual" | "monthly">("annual");

  const handleStartTrial = () => {
    dispatch(setAuthState({ isSubscribed: true }));
    router.replace("/" as any);
  };

  return (
    <View style={styles.paywallContainer}>
      {/* Background Image Header */}
      <View style={styles.paywallImageContainer}>
        <Image
          source={require("../../../assets/app/subscription.png")}
          style={styles.paywallImage}
          resizeMode="cover"
        />
        {/* Top Buttons Overlay */}
        <View style={[styles.paywallHeaderRow, { top: Math.max(insets.top, 16) }]}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => router.replace("/" as any)}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={20} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.restoreBtn} activeOpacity={0.7}>
            <Text style={styles.restoreBtnText}>Restore</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Paywall Details */}
      <View style={styles.paywallContent}>
        <Text style={styles.paywallTitle}>Enjoy All Premium Features</Text>

        {/* Bullet Points */}
        <View style={styles.bulletsContainer}>
          <View style={styles.bulletRow}>
            <Ionicons name="checkmark-circle" size={20} color="#635BFF" style={styles.bulletIcon} />
            <Text style={styles.bulletText}>Unlimited Appointments</Text>
          </View>
          <View style={styles.bulletRow}>
            <Ionicons name="checkmark-circle" size={20} color="#635BFF" style={styles.bulletIcon} />
            <Text style={styles.bulletText}>Inventory Alerts</Text>
          </View>
          <View style={styles.bulletRow}>
            <Ionicons name="checkmark-circle" size={20} color="#635BFF" style={styles.bulletIcon} />
            <Text style={styles.bulletText}>Tax & Payroll Reports</Text>
          </View>
        </View>

        {/* Pricing Cards Selection */}
        <View style={styles.billingPlansRow}>
          {/* Annual Plan */}
          <TouchableOpacity
            style={[styles.billingCard, billingCycle === "annual" && styles.billingCardSelected]}
            onPress={() => setBillingCycle("annual")}
            activeOpacity={0.85}
          >
            <View style={styles.billingCardLeft}>
              <View style={[styles.radioCircle, billingCycle === "annual" && styles.radioCircleSelected]}>
                {billingCycle === "annual" && <View style={styles.radioInnerCircle} />}
              </View>
              <Text style={styles.billingPlanLabel}>Annual</Text>
            </View>
            <View style={styles.billingCardRight}>
              <View style={styles.badgeDiscount}>
                <Text style={styles.badgeDiscountText}>50% OFF</Text>
              </View>
              <Text style={styles.billingPriceText}>$899.10/m</Text>
            </View>
          </TouchableOpacity>

          {/* Monthly Plan */}
          <TouchableOpacity
            style={[styles.billingCard, billingCycle === "monthly" && styles.billingCardSelected]}
            onPress={() => setBillingCycle("monthly")}
            activeOpacity={0.85}
          >
            <View style={styles.billingCardLeft}>
              <View style={[styles.radioCircle, billingCycle === "monthly" && styles.radioCircleSelected]}>
                {billingCycle === "monthly" && <View style={styles.radioInnerCircle} />}
              </View>
              <Text style={styles.billingPlanLabel}>Monthly</Text>
            </View>
            <View style={styles.billingCardRight}>
              <Text style={styles.billingPriceText}>$399.99/m</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Trial / Purchase Button */}
        <CustomButton
          title="Start 7 Days Free Trial"
          onPress={handleStartTrial}
          buttonStyle={styles.trialBtn}
        />

        {/* View All Plans Link */}
        <TouchableOpacity
          onPress={() => router.push("/subscription/plans" as any)}
          style={styles.allPlansLink}
          activeOpacity={0.7}
        >
          <Text style={styles.allPlansLinkText}>View All Plans</Text>
        </TouchableOpacity>

        <Text style={styles.cancelText}>Cancel anytime. No commitment.</Text>

        {/* Footer Links */}
        <View style={styles.paywallFooterLinks}>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.footerLinkText}>Terms of Service</Text>
          </TouchableOpacity>
          <Text style={styles.footerLinkDivider}> | </Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.footerLinkText}>Privacy Policy</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  paywallContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  paywallImageContainer: {
    width: width,
    height: height * 0.45,
    position: "relative",
  },
  paywallImage: {
    width: "100%",
    height: "100%",
  },
  paywallHeaderRow: {
    position: "absolute",
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  restoreBtn: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  restoreBtnText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#FFFFFF",
    fontFamily: "System",
  },
  paywallContent: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    paddingHorizontal: 24,
    paddingTop: 24,
    alignItems: "center",
  },
  paywallTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#635BFF",
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "System",
  },
  bulletsContainer: {
    alignSelf: "stretch",
    marginBottom: 24,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  bulletIcon: {
    marginRight: 10,
  },
  bulletText: {
    fontSize: 13,
    color: "#4B5563",
    fontWeight: "500",
    fontFamily: "System",
  },
  billingPlansRow: {
    width: "100%",
    marginBottom: 20,
  },
  billingCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
    marginBottom: 10,
    backgroundColor: "#FFFFFF",
  },
  billingCardSelected: {
    borderColor: "#635BFF",
    backgroundColor: "#EEECFF",
  },
  billingCardLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    backgroundColor: "#FFFFFF",
  },
  radioCircleSelected: {
    borderColor: "#635BFF",
  },
  radioInnerCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#635BFF",
  },
  billingPlanLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    fontFamily: "System",
  },
  billingCardRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  badgeDiscount: {
    backgroundColor: "#EEECFF",
    borderWidth: 1,
    borderColor: "#635BFF",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 8,
  },
  badgeDiscountText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#635BFF",
    fontFamily: "System",
  },
  billingPriceText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1F2937",
    fontFamily: "System",
  },
  trialBtn: {
    marginBottom: 16,
  },
  allPlansLink: {
    paddingVertical: 4,
    marginBottom: 12,
  },
  allPlansLinkText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#635BFF",
    textDecorationLine: "underline",
    fontFamily: "System",
  },
  cancelText: {
    fontSize: 11,
    color: "#9CA3AF",
    marginBottom: 20,
    fontFamily: "System",
  },
  paywallFooterLinks: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerLinkText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#635BFF",
    fontFamily: "System",
  },
  footerLinkDivider: {
    fontSize: 11,
    color: "#D1D5DB",
  },
});
