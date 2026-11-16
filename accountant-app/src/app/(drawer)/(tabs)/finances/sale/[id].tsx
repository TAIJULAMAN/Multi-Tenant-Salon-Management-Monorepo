import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { INITIAL_PAYMENTS_DATA, PaymentSaleItem } from "@/data/financesData";

export default function ViewSaleScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  // Find payment item by ID or default to #000
  const searchId = id ? (id.startsWith("#") ? id : `#${id}`) : "#000";
  const payment: PaymentSaleItem =
    INITIAL_PAYMENTS_DATA.find((p) => p.id === searchId) || INITIAL_PAYMENTS_DATA[0];

  const [isCashReceiptPrinted, setIsCashReceiptPrinted] = useState(true);
  const [isOnlineReceiptPrinted, setIsOnlineReceiptPrinted] = useState(false);

  const handlePrintOnlineReceipt = () => {
    setIsOnlineReceiptPrinted(true);
    Alert.alert("Print Receipt", "Receipt transmission received and queued to fiscal RT printer.");
  };

  const handleNavigateToReceipt = () => {
    router.push({
      pathname: "/(drawer)/(tabs)/finances/view-receipt",
      params: {
        code: payment.id,
        client: payment.clientName,
        salon: payment.salon,
        amount: payment.amount.toString(),
        date: payment.paymentDate,
        method: payment.method,
      },
    } as any);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top Header Bar with Back and Breadcrumbs */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={20} color="#111827" />
          <Text style={styles.headerTitle}>View Sale</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.breadcrumbBadge}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="home-outline" size={12} color="#635BFF" />
          <Text style={styles.breadcrumbSlash}>/</Text>
          <Text style={styles.breadcrumbText}>Payments</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Section: Basic Details Card */}
        <View style={styles.card}>
          <Text style={styles.sectionHeaderTitle}>Basic Details</Text>

          {/* Salon Branch */}
          <View style={styles.fieldBlock}>
            <Text style={styles.fieldLabel}>SALON</Text>
            <View style={styles.salonRow}>
              <View style={styles.salonLogoBadge}>
                <Ionicons name="sparkles" size={15} color="#FFFFFF" />
              </View>
              <Text style={styles.salonNameText}>{payment.salon}</Text>
            </View>
          </View>

          {/* 2-Column Meta Grid */}
          <View style={styles.twoColGrid}>
            <View style={styles.gridCol}>
              <Text style={styles.fieldLabel}>ID</Text>
              <Text style={styles.fieldValStrong}>{payment.id}</Text>
            </View>

            <View style={styles.gridCol}>
              <Text style={styles.fieldLabel}>PAYMENT DATE</Text>
              <Text style={styles.fieldVal}>{payment.paymentDate}</Text>
            </View>

            <View style={styles.gridCol}>
              <Text style={styles.fieldLabel}>METHOD</Text>
              <View style={[styles.methodBadge, { backgroundColor: "#DCFCE7" }]}>
                <Text style={[styles.methodBadgeText, { color: "#16A34A" }]}>
                  {payment.method}
                </Text>
              </View>
            </View>

            <View style={styles.gridCol}>
              <Text style={styles.fieldLabel}>PAYMENT STATUS</Text>
              <View style={[styles.statusBadge, { backgroundColor: "#10B981" }]}>
                <Text style={styles.statusBadgeText}>{payment.status}</Text>
              </View>
            </View>

            <View style={[styles.gridCol, { width: "100%" }]}>
              <Text style={styles.fieldLabel}>RECEIPT ISSUE</Text>
              <View style={styles.receiptIssuePill}>
                <Text style={styles.receiptIssuePillText}>Half Printed</Text>
              </View>
            </View>

            <View style={styles.gridCol}>
              <Text style={styles.fieldLabel}>CLIENT</Text>
              <View style={styles.personRow}>
                <View style={[styles.personAvatar, { backgroundColor: "#FDF2F8" }]}>
                  <Ionicons name="person" size={14} color="#DB2777" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.personName}>{payment.clientName}</Text>
                  <Text style={styles.personEmail}>maria@beautysalon.com</Text>
                </View>
              </View>
            </View>

            <View style={styles.gridCol}>
              <Text style={styles.fieldLabel}>RECEIPT ISSUED BY</Text>
              <View style={styles.personRow}>
                <View style={[styles.personAvatar, { backgroundColor: "#ECFDF5" }]}>
                  <Ionicons name="shield-checkmark" size={14} color="#059669" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.personName}>{payment.teamMember}</Text>
                  <Text style={styles.personEmail}>maria@beautysalon.com</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Top Section Right: Activity Card */}
        <View style={styles.card}>
          <Text style={styles.sectionHeaderTitle}>Activity</Text>

          <View style={styles.activityTimeline}>
            {/* Activity Item 1 */}
            <View style={styles.activityItem}>
              <View style={styles.activityDotCol}>
                <View style={[styles.activityCircleHollow, { borderColor: "#EF4444" }]} />
                <View style={styles.activityLine} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTimeHeader}>TODAY, 14:34</Text>
                <Text style={styles.activityTitle}>€ 10 refunded by cash</Text>
                <Text style={styles.activitySub}>Completed by {payment.teamMember}</Text>
              </View>
            </View>

            {/* Activity Item 2 */}
            <View style={styles.activityItem}>
              <View style={styles.activityDotCol}>
                <View style={[styles.activityCircleHollow, { borderColor: "#635BFF" }]} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTimeHeader}>TODAY, 14:34</Text>
                <Text style={styles.activityTitle}>Sale #1 created</Text>
                <Text style={styles.activitySub}>Completed by {payment.teamMember}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Middle Section: Sale Details Card */}
        <View style={styles.card}>
          <View style={{ marginBottom: 12 }}>
            <Text style={styles.saleHeaderTitle}>Sale {payment.id}</Text>
            <Text style={styles.saleHeaderDate}>{payment.paymentDate}</Text>
          </View>

          {/* Service Line Table */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ minWidth: 540 }}>
              <View style={styles.saleTableHeaderRow}>
                <Text style={[styles.sthText, { width: 100 }]}>SERVICE</Text>
                <Text style={[styles.sthText, { width: 120 }]}>EMPLOYEE</Text>
                <Text style={[styles.sthText, { width: 90 }]}>START TIME</Text>
                <Text style={[styles.sthText, { width: 100 }]}>DATE</Text>
                <Text style={[styles.sthText, { width: 80 }]}>DURATION</Text>
                <Text style={[styles.sthText, { width: 50, textAlign: "right" }]}>PRICE</Text>
              </View>

              <View style={styles.saleTableRow}>
                <Text style={[styles.stdText, { width: 100, fontWeight: "600" }]}>
                  {payment.service || "Haircut"}
                </Text>
                <Text style={[styles.stdText, { width: 120 }]}>{payment.teamMember}</Text>
                <Text style={[styles.stdText, { width: 90 }]}>{payment.startTime || "12:00"}</Text>
                <Text style={[styles.stdText, { width: 100 }]}>5 Aug 2025</Text>
                <Text style={[styles.stdText, { width: 80 }]}>{payment.duration || "15 min"}</Text>
                <Text style={[styles.stdText, { width: 50, textAlign: "right", fontWeight: "700" }]}>
                  € {payment.amount}
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Order Summary Box */}
          <View style={styles.orderSummarySection}>
            <Text style={styles.orderSummaryHeader}>Order Summary</Text>

            <View style={styles.summaryLineRow}>
              <Text style={styles.summaryLineLabel}>Subtotal</Text>
              <Text style={styles.summaryLineVal}>€ {payment.amount}</Text>
            </View>

            <View style={[styles.summaryLineRow, { borderBottomWidth: 1, borderBottomColor: "#F3F4F6", paddingBottom: 6 }]}>
              <Text style={[styles.summaryLineLabel, { fontWeight: "700", color: "#111827" }]}>Total</Text>
              <Text style={[styles.summaryLineVal, { fontWeight: "700", color: "#111827" }]}>€ {payment.amount}</Text>
            </View>

            <View style={[styles.summaryLineRow, { paddingTop: 6 }]}>
              <View>
                <Text style={styles.summaryLineLabel}>Paid with Cash</Text>
                <Text style={styles.summaryLineDate}>5 Aug 2025, 12:30</Text>
              </View>
              <Text style={styles.summaryLineVal}>€ {payment.paidCash ?? 10}</Text>
            </View>

            <View style={[styles.summaryLineRow, { borderTopWidth: 1, borderTopColor: "#F3F4F6", paddingTop: 8 }]}>
              <Text style={[styles.summaryLineLabel, { fontWeight: "700", color: "#111827" }]}>Balance</Text>
              <Text style={[styles.summaryLineVal, { fontWeight: "800", color: "#111827" }]}>
                € {payment.balance ?? 160}
              </Text>
            </View>
          </View>

          {/* Receipt Status Controls */}
          <View style={styles.receiptStatusSection}>
            <Text style={styles.orderSummaryHeader}>Receipt Status</Text>

            {/* Cash Receipt Row */}
            <View style={styles.receiptActionRow}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Text style={styles.receiptMethodName}>Cash</Text>
                <View style={[styles.receiptPillTag, { backgroundColor: "#DCFCE7" }]}>
                  <Text style={[styles.receiptPillTagText, { color: "#16A34A" }]}>Printed</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.viewReceiptOutlineBtn}
                onPress={handleNavigateToReceipt}
                activeOpacity={0.7}
              >
                <Ionicons name="eye-outline" size={13} color="#635BFF" style={{ marginRight: 4 }} />
                <Text style={styles.viewReceiptOutlineBtnText}>View Receipt</Text>
              </TouchableOpacity>
            </View>

            {/* Online Payment Receipt Row */}
            <View style={styles.receiptActionRow}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Text style={styles.receiptMethodName}>Online payment</Text>
                <View
                  style={[
                    styles.receiptPillTag,
                    { backgroundColor: isOnlineReceiptPrinted ? "#DCFCE7" : "#FEF3C7" },
                  ]}
                >
                  <Text
                    style={[
                      styles.receiptPillTagText,
                      { color: isOnlineReceiptPrinted ? "#16A34A" : "#D97706" },
                    ]}
                  >
                    {isOnlineReceiptPrinted ? "Printed" : "Not printed"}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.printReceiptFilledBtn}
                onPress={handlePrintOnlineReceipt}
                activeOpacity={0.7}
              >
                <Ionicons name="print-outline" size={13} color="#FFFFFF" style={{ marginRight: 4 }} />
                <Text style={styles.printReceiptFilledBtnText}>
                  {isOnlineReceiptPrinted ? "Reprint" : "Print Receipt"}
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.testNoteText}>(Test: Print Receipt - Received)</Text>
          </View>
        </View>

        {/* Bottom Section: Refund #1 Card */}
        <View style={styles.card}>
          <View style={{ marginBottom: 12 }}>
            <Text style={styles.saleHeaderTitle}>Refund #1</Text>
            <Text style={styles.saleHeaderDate}>5 Aug 2025, 12:30</Text>
          </View>

          <View style={styles.refundDetailsBox}>
            <View style={styles.summaryLineRow}>
              <Text style={styles.summaryLineLabel}>Accidental Charge</Text>
              <Text style={styles.summaryLineVal}>€ 170</Text>
            </View>

            <View style={styles.summaryLineRow}>
              <Text style={styles.summaryLineLabel}>Refund Amount</Text>
              <Text style={[styles.summaryLineVal, { color: "#EF4444" }]}>- € 10</Text>
            </View>

            <View style={[styles.summaryLineRow, { borderTopWidth: 1, borderTopColor: "#F3F4F6", paddingTop: 6 }]}>
              <Text style={styles.summaryLineLabel}>Subtotal</Text>
              <Text style={[styles.summaryLineVal, { color: "#EF4444" }]}>- € 10</Text>
            </View>

            <View style={styles.summaryLineRow}>
              <Text style={[styles.summaryLineLabel, { fontWeight: "700", color: "#111827" }]}>Total</Text>
              <Text style={[styles.summaryLineVal, { fontWeight: "700", color: "#EF4444" }]}>- € 10</Text>
            </View>

            <View style={[styles.summaryLineRow, { borderTopWidth: 1, borderTopColor: "#F3F4F6", paddingTop: 6 }]}>
              <Text style={styles.summaryLineLabel}>Refunded with Cash</Text>
              <Text style={[styles.summaryLineVal, { color: "#EF4444" }]}>- € 10</Text>
            </View>

            <View style={styles.summaryLineRow}>
              <Text style={styles.summaryLineLabel}>Refund Amount</Text>
              <Text style={[styles.summaryLineVal, { color: "#EF4444" }]}>- € 10</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
  },
  breadcrumbBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEECFF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  breadcrumbSlash: {
    fontSize: 11,
    color: "#635BFF",
  },
  breadcrumbText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#635BFF",
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 14,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  sectionHeaderTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 12,
  },
  fieldBlock: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#6B7280",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  salonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 2,
  },
  salonLogoBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#8B5CF6",
    alignItems: "center",
    justifyContent: "center",
  },
  salonNameText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#111827",
  },
  twoColGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 14,
  },
  gridCol: {
    width: "48%",
  },
  fieldValStrong: {
    fontSize: 14,
    fontWeight: "800",
    color: "#111827",
  },
  fieldVal: {
    fontSize: 12.5,
    fontWeight: "500",
    color: "#111827",
  },
  methodBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  methodBadgeText: {
    fontSize: 10,
    fontWeight: "700",
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  receiptIssuePill: {
    alignSelf: "flex-start",
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F59E0B",
  },
  receiptIssuePillText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#F59E0B",
  },
  personRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 2,
  },
  personAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  personName: {
    fontSize: 11.5,
    fontWeight: "700",
    color: "#111827",
  },
  personEmail: {
    fontSize: 9.5,
    color: "#6B7280",
  },
  activityTimeline: {
    gap: 12,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  activityDotCol: {
    width: 20,
    alignItems: "center",
    marginRight: 8,
    paddingTop: 2,
  },
  activityCircleHollow: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    backgroundColor: "#FFFFFF",
  },
  activityLine: {
    width: 1.5,
    height: 34,
    backgroundColor: "#E5E7EB",
    marginTop: 2,
  },
  activityContent: {
    flex: 1,
  },
  activityTimeHeader: {
    fontSize: 9.5,
    fontWeight: "700",
    color: "#9CA3AF",
    letterSpacing: 0.3,
  },
  activityTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#111827",
    marginTop: 1,
  },
  activitySub: {
    fontSize: 10,
    color: "#6B7280",
    marginTop: 1,
  },
  saleHeaderTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#111827",
  },
  saleHeaderDate: {
    fontSize: 10.5,
    color: "#6B7280",
    marginTop: 1,
  },
  saleTableHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  sthText: {
    fontSize: 9.5,
    fontWeight: "700",
    color: "#6B7280",
  },
  saleTableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  stdText: {
    fontSize: 11,
    color: "#111827",
  },
  orderSummarySection: {
    marginTop: 14,
    gap: 6,
  },
  orderSummaryHeader: {
    fontSize: 12,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 4,
  },
  summaryLineRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 2,
  },
  summaryLineLabel: {
    fontSize: 11,
    color: "#4B5563",
  },
  summaryLineDate: {
    fontSize: 9,
    color: "#9CA3AF",
  },
  summaryLineVal: {
    fontSize: 11.5,
    fontWeight: "600",
    color: "#111827",
  },
  receiptStatusSection: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 12,
    gap: 10,
  },
  receiptActionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  receiptMethodName: {
    fontSize: 11.5,
    fontWeight: "600",
    color: "#111827",
  },
  receiptPillTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  receiptPillTagText: {
    fontSize: 9.5,
    fontWeight: "700",
  },
  viewReceiptOutlineBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#635BFF",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  viewReceiptOutlineBtnText: {
    fontSize: 10.5,
    fontWeight: "700",
    color: "#635BFF",
  },
  printReceiptFilledBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#635BFF",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  printReceiptFilledBtnText: {
    fontSize: 10.5,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  testNoteText: {
    fontSize: 9.5,
    color: "#9CA3AF",
    marginTop: 2,
  },
  refundDetailsBox: {
    gap: 6,
  },
});
