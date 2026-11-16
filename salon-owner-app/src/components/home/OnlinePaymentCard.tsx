import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Path } from "react-native-svg";
import { useRouter } from "expo-router";

export default function OnlinePaymentCard() {
  const router = useRouter();

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Online Payment</Text>
          <Text style={styles.subtitle}>Last check on 25 february</Text>
        </View>
        <TouchableOpacity
          style={styles.viewBtn}
          onPress={() => router.push("/payments")}
          activeOpacity={0.7}
        >
          <Text style={styles.viewBtnText}>View Payments</Text>
        </TouchableOpacity>
      </View>

      {/* Semicircular Donut Section */}
      <View style={styles.chartContainer}>
        <Svg width={200} height={110} viewBox="0 0 200 110">
          {/* Left Arch (To Confirm - Purple) */}
          <Path
            d="M 20 100 A 80 80 0 0 1 100 20"
            fill="none"
            stroke="#635BFF"
            strokeWidth={18}
            strokeLinecap="round"
          />
          {/* Right Arch (Overdue - Rose) */}
          <Path
            d="M 100 20 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#F43F5E"
            strokeWidth={18}
            strokeLinecap="round"
          />
        </Svg>

        <View style={styles.chartTextWrapper}>
          <Text style={styles.totalNumber}>8</Text>
          <Text style={styles.chartSubtext}>Payment management</Text>
        </View>
      </View>

      {/* Footer Indicators */}
      <View style={styles.footerRow}>
        {/* To Confirm */}
        <View style={styles.indicatorItem}>
          <View style={[styles.indicatorIcon, { backgroundColor: "#E0E7FF" }]}>
            <Ionicons name="hourglass-outline" size={18} color="#635BFF" />
          </View>
          <View>
            <Text style={styles.indicatorCount}>4 payments</Text>
            <Text style={styles.indicatorLabel}>To Confirm</Text>
          </View>
        </View>

        {/* Overdue */}
        <View style={styles.indicatorItem}>
          <View style={[styles.indicatorIcon, { backgroundColor: "#FFE4E6" }]}>
            <Ionicons name="time-outline" size={18} color="#F43F5E" />
          </View>
          <View>
            <Text style={styles.indicatorCount}>4 payments</Text>
            <Text style={styles.indicatorLabel}>Overdue</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  subtitle: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
    marginTop: 2,
  },
  viewBtn: {
    borderWidth: 1,
    borderColor: "#635BFF",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#FFFFFF",
  },
  viewBtnText: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  chartContainer: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginVertical: 10,
  },
  chartTextWrapper: {
    position: "absolute",
    bottom: 2,
    alignItems: "center",
  },
  totalNumber: {
    fontSize: 32,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
    lineHeight: 36,
  },
  chartSubtext: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  indicatorItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  indicatorIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  indicatorCount: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  indicatorLabel: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
  },
});
