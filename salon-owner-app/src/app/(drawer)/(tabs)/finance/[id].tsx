import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Avatar from "@/components/Avatar";
import {
  initialPayments,
  PaymentRecord,
  getPaymentMethodStyle,
  getPaymentStatusStyle,
  getReceiptStatusStyle,
} from "@/components/finance/financeData";

// Modals
import EditPaymentModal from "@/components/finance/modals/EditPaymentModal";
import DeletePaymentModal from "@/components/finance/modals/DeletePaymentModal";
import RefundPaymentModal from "@/components/finance/modals/RefundPaymentModal";
import PrintReceiptModal from "@/components/finance/modals/PrintReceiptModal";

export default function ViewPaymentScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const foundPayment = initialPayments.find((p) => p.id === id) || initialPayments[0];
  const [payment, setPayment] = useState<PaymentRecord>(foundPayment);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isRefundOpen, setIsRefundOpen] = useState(false);
  const [isPrintOpen, setIsPrintOpen] = useState(false);

  const mStyle = getPaymentMethodStyle(payment.method);
  const sStyle = getPaymentStatusStyle(payment.status);
  const rStyle = getReceiptStatusStyle(payment.receiptStatus);

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 12) }]}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color="#1E293B" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Transaction #{payment.id}</Text>
          <Text style={styles.headerSub}>{payment.date}</Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerActionBtn}
            onPress={() => setIsPrintOpen(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="print-outline" size={16} color="#635BFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerActionBtn}
            onPress={() => setIsEditOpen(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="pencil" size={16} color="#475569" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerDeleteBtn}
            onPress={() => setIsDeleteOpen(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="trash-outline" size={16} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.contentScroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Banner Card */}
        <View style={styles.bannerCard}>
          <Text style={styles.bannerAmountLabel}>Total Transaction Amount</Text>
          <Text style={styles.bannerAmountVal}>{payment.amount}</Text>

          <View style={styles.badgesRow}>
            <View style={[styles.methodBadge, { backgroundColor: mStyle.bg }]}>
              <Ionicons name={mStyle.icon as any} size={13} color={mStyle.text} />
              <Text style={[styles.methodBadgeText, { color: mStyle.text }]}>{payment.method}</Text>
            </View>

            <View style={[styles.statusBadge, { backgroundColor: sStyle.bg }]}>
              <Text style={styles.statusBadgeText}>{payment.status}</Text>
            </View>

            <View style={[styles.receiptBadge, { backgroundColor: rStyle.bg, borderColor: rStyle.border }]}>
              <Text style={[styles.receiptBadgeText, { color: rStyle.text }]}>Receipt: {payment.receiptStatus}</Text>
            </View>
          </View>
        </View>

        {/* Client & Stylist Overview */}
        <View style={styles.cardSection}>
          <Text style={styles.sectionTitle}>Client & Staff</Text>

          {/* Client Row */}
          <View style={styles.participantItem}>
            <Avatar name={payment.client.name} uri={payment.client.avatar} size={42} />
            <View style={{ flex: 1 }}>
              <Text style={styles.participantRole}>Client</Text>
              <Text style={styles.participantName}>{payment.client.name}</Text>
              <Text style={styles.participantContact}>{payment.client.email} • {payment.client.phone}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Staff Row */}
          <View style={styles.participantItem}>
            <Avatar name={payment.teamMember.name} uri={payment.teamMember.avatar} size={42} />
            <View style={{ flex: 1 }}>
              <Text style={styles.participantRole}>Staff Stylist</Text>
              <Text style={styles.participantName}>{payment.teamMember.name}</Text>
              <Text style={styles.participantContact}>{payment.teamMember.role} • {payment.teamMember.email}</Text>
            </View>
          </View>
        </View>

        {/* Breakdown Items Card */}
        <View style={styles.cardSection}>
          <Text style={styles.sectionTitle}>Purchased Services & Items</Text>

          <View style={styles.itemsList}>
            {(payment.items || [
              { name: "Salon Service", category: "Haircare", price: payment.amount, quantity: 1 },
            ]).map((item, idx) => (
              <View key={idx} style={styles.lineItemRow}>
                <View style={styles.itemIconBox}>
                  <Ionicons name="cut-outline" size={16} color="#635BFF" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.lineItemName}>{item.name}</Text>
                  <Text style={styles.lineItemCat}>{item.category} (Qty: {item.quantity})</Text>
                </View>
                <Text style={styles.lineItemPrice}>{item.price}</Text>
              </View>
            ))}
          </View>

          <View style={styles.totalsContainer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalValue}>{payment.subtotal}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tax / VAT (20%)</Text>
              <Text style={styles.totalValue}>{payment.tax}</Text>
            </View>
            <View style={[styles.totalRow, styles.totalRowGrand]}>
              <Text style={styles.totalGrandLabel}>Total Paid</Text>
              <Text style={styles.totalGrandValue}>{payment.amount}</Text>
            </View>
          </View>
        </View>

        {/* Transaction Notes */}
        {payment.notes ? (
          <View style={styles.cardSection}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text style={styles.notesText}>{payment.notes}</Text>
          </View>
        ) : null}

        {/* Bottom Actions */}
        <View style={styles.footerButtonsCol}>
          <TouchableOpacity
            style={styles.fullReceiptBtn}
            onPress={() => router.push(`/(drawer)/(tabs)/finance/${payment.id}/receipt` as any)}
            activeOpacity={0.85}
          >
            <Ionicons name="receipt-outline" size={18} color="#FFFFFF" />
            <Text style={styles.fullReceiptBtnText}>View & Print Full Receipt</Text>
          </TouchableOpacity>

          <View style={styles.footerSecondaryRow}>
            <TouchableOpacity
              style={styles.refundBtn}
              onPress={() => setIsRefundOpen(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="refresh-outline" size={16} color="#D97706" />
              <Text style={styles.refundBtnText}>Issue Refund</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => setIsEditOpen(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="create-outline" size={16} color="#475569" />
              <Text style={styles.editBtnText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Edit Modal */}
      <EditPaymentModal
        visible={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        payment={payment}
        onSave={(updated) => {
          setPayment(updated);
          Alert.alert("Success", "Payment updated!");
        }}
      />

      {/* Delete Modal */}
      <DeletePaymentModal
        visible={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        paymentId={payment.id}
        amount={payment.amount}
        onConfirm={() => {
          Alert.alert("Deleted", "Payment record deleted.", [
            { text: "OK", onPress: () => router.back() },
          ]);
        }}
      />

      {/* Refund Modal */}
      <RefundPaymentModal
        visible={isRefundOpen}
        onClose={() => setIsRefundOpen(false)}
        payment={payment}
        onConfirmRefund={(refAmount, reason) => {
          setPayment({
            ...payment,
            status: "Not Paid",
            notes: `Refunded ${refAmount}: ${reason}`,
          });
          Alert.alert("Refund Complete", `Refund of ${refAmount} was processed.`);
        }}
      />

      {/* Print Receipt Modal */}
      <PrintReceiptModal
        visible={isPrintOpen}
        onClose={() => setIsPrintOpen(false)}
        payment={payment}
        onNavigateToReceiptView={() => router.push(`/(drawer)/(tabs)/finance/${payment.id}/receipt` as any)}
      />
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
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  backBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
  },
  headerTitle: {
    fontSize: 17,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  headerSub: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    marginTop: 1,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerActionBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#EEF2FF",
  },
  headerDeleteBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#FEE2E2",
  },
  contentScroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  bannerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 18,
    alignItems: "center",
    gap: 6,
  },
  bannerAmountLabel: {
    fontSize: 11,
    fontFamily: "Manrope_600SemiBold",
    color: "#94A3B8",
  },
  bannerAmountVal: {
    fontSize: 28,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  badgesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 6,
    marginTop: 6,
  },
  methodBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  methodBadgeText: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },
  receiptBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  receiptBadgeText: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
  },
  cardSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  participantItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  participantRole: {
    fontSize: 10,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
    textTransform: "uppercase",
  },
  participantName: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
    marginTop: 1,
  },
  participantContact: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    marginTop: 1,
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
  },
  itemsList: {
    gap: 8,
  },
  lineItemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#F8FAFC",
    padding: 10,
    borderRadius: 8,
  },
  itemIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  lineItemName: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  lineItemCat: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    marginTop: 1,
  },
  lineItemPrice: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  totalsContainer: {
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingTop: 10,
    gap: 6,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 12,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
  },
  totalValue: {
    fontSize: 12,
    fontFamily: "Manrope_600SemiBold",
    color: "#1E293B",
  },
  totalRowGrand: {
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  totalGrandLabel: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  totalGrandValue: {
    fontSize: 16,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  notesText: {
    fontSize: 13,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    lineHeight: 19,
  },
  footerButtonsCol: {
    gap: 10,
  },
  fullReceiptBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#635BFF",
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: "#635BFF",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  fullReceiptBtnText: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },
  footerSecondaryRow: {
    flexDirection: "row",
    gap: 10,
  },
  refundBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#FEF3C7",
    paddingVertical: 12,
    borderRadius: 10,
  },
  refundBtnText: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#D97706",
  },
  editBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingVertical: 12,
    borderRadius: 10,
  },
  editBtnText: {
    fontSize: 13,
    fontFamily: "Manrope_600SemiBold",
    color: "#475569",
  },
});
