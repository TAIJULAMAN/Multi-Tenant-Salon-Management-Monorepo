import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  PaymentSaleItem,
  INITIAL_PAYMENTS_DATA,
} from "@/data/financesData";
import CustomModal from "@/components/ui/CustomModal";
import CustomButton from "@/components/ui/CustomButton";

const REFUND_REASONS = [
  "Client cancelled service related to payment",
  "Incorrect amount",
  "Duplicate transaction",
  "Client's request",
  "Other",
];

const REFUND_GIVERS = [
  "Maria Rodriguez",
  "Sofia Bianchi",
  "Lucia Moretti",
  "Elena Romano",
  "Clara Santi",
];

export default function FinancesPaymentsTab() {
  const router = useRouter();
  const [payments, setPayments] = useState<PaymentSaleItem[]>(INITIAL_PAYMENTS_DATA);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMethodFilter, setSelectedMethodFilter] = useState("All Methods");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("All Status");
  const [currentPage, setCurrentPage] = useState<1 | 2>(1);

  // 3-dots actions menu state
  const [activeActionMenuPaymentId, setActiveActionMenuPaymentId] = useState<string | null>(null);

  // Refund Modal state
  const [refundModalPayment, setRefundModalPayment] = useState<PaymentSaleItem | null>(null);
  const [refundAmount, setRefundAmount] = useState("170");
  const [refundGivenBy, setRefundGivenBy] = useState("Maria Rodriguez");
  const [refundReason, setRefundReason] = useState("");
  const [showReasonDropdown, setShowReasonDropdown] = useState(false);
  const [showGiverDropdown, setShowGiverDropdown] = useState(false);

  // Filtered payments
  const filteredPayments = payments.filter((item) => {
    const matchesSearch =
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.clientEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.salon.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.teamMember.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesMethod =
      selectedMethodFilter === "All Methods" || item.method === selectedMethodFilter;

    const matchesStatus =
      selectedStatusFilter === "All Status" || item.status === selectedStatusFilter;

    return matchesSearch && matchesMethod && matchesStatus;
  });

  // Paginated items
  const PAGE_SIZE = 5;
  const totalPages = Math.ceil(filteredPayments.length / PAGE_SIZE) || 1;
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const currentPayments = filteredPayments.slice(startIndex, startIndex + PAGE_SIZE);

  const getMethodBadgeStyle = (method: PaymentSaleItem["method"]) => {
    switch (method) {
      case "Cash":
        return { bg: "#DCFCE7", text: "#16A34A" };
      case "Card Terminal":
        return { bg: "#E0F2FE", text: "#0284C7" };
      case "Gift Card":
        return { bg: "#F3E8FF", text: "#9333EA" };
      case "Online Payment":
        return { bg: "#FEF3C7", text: "#D97706" };
      default:
        return { bg: "#F3F4F6", text: "#4B5563" };
    }
  };

  const getStatusBadgeStyle = (status: PaymentSaleItem["status"]) => {
    switch (status) {
      case "Fully Paid":
        return { bg: "#10B981", text: "#FFFFFF" };
      case "Half Paid":
        return { bg: "#F59E0B", text: "#FFFFFF" };
      case "Not Paid":
        return { bg: "#EF4444", text: "#FFFFFF" };
      default:
        return { bg: "#6B7280", text: "#FFFFFF" };
    }
  };

  const getReceiptIssueBadgeStyle = (issue: PaymentSaleItem["receiptIssue"]) => {
    switch (issue) {
      case "Completed":
        return { border: "#10B981", text: "#10B981", bg: "#ECFDF5" };
      case "Half Printed":
        return { border: "#F59E0B", text: "#F59E0B", bg: "#FFFBEB" };
      case "Not Issued":
        return { border: "#EF4444", text: "#EF4444", bg: "#FEF2F2" };
      default:
        return { border: "#9CA3AF", text: "#9CA3AF", bg: "#F9FAFB" };
    }
  };

  const handleOpenRefundModal = (item: PaymentSaleItem) => {
    setActiveActionMenuPaymentId(null);
    setRefundModalPayment(item);
    setRefundAmount(item.amount.toString());
    setRefundGivenBy(item.teamMember || "Maria Rodriguez");
    setRefundReason("");
    setShowReasonDropdown(false);
    setShowGiverDropdown(false);
  };

  const handleProcessRefund = () => {
    if (!refundReason) {
      Alert.alert("Required", "Please choose a reason for refund.");
      return;
    }
    const refundVal = parseFloat(refundAmount) || 0;
    if (refundVal <= 0 || (refundModalPayment && refundVal > refundModalPayment.amount)) {
      Alert.alert("Invalid Amount", `Please enter a valid amount up to € ${refundModalPayment?.amount}.`);
      return;
    }

    Alert.alert(
      "Refund Successful",
      `Refund of € ${refundVal.toFixed(2)} processed for ${refundModalPayment?.id}. Reason: ${refundReason}`
    );
    setRefundModalPayment(null);
  };

  const handlePrintReceipt = (item: PaymentSaleItem) => {
    setActiveActionMenuPaymentId(null);
    router.push({
      pathname: "/(drawer)/(tabs)/finances/view-receipt",
      params: {
        code: item.id,
        client: item.clientName,
        salon: item.salon,
        amount: item.amount.toString(),
        date: item.paymentDate,
        method: item.method,
      },
    } as any);
  };

  const handleViewDetails = (item: PaymentSaleItem) => {
    setActiveActionMenuPaymentId(null);
    const idToPass = item.id.replace("#", "");
    router.push(`/(drawer)/(tabs)/finances/sale/${idToPass}` as any);
  };

  return (
    <View style={styles.container}>
      {/* Dimmed backdrop to close active 3-dots action menu */}
      {activeActionMenuPaymentId !== null && (
        <TouchableOpacity
          style={styles.actionBackdrop}
          onPress={() => setActiveActionMenuPaymentId(null)}
          activeOpacity={1}
        />
      )}

      {/* 1. Header Card with White BG and Action Buttons */}
      <View style={styles.headerCard}>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>Payments Log</Text>
          <Text style={styles.headerSubtitle}>
            Overview of POS registers, client transactions, and refunds
          </Text>
        </View>

        {/* Action Buttons: Import Receipts & Set Automations */}
        <View style={styles.headerButtonsRow}>
          <TouchableOpacity
            style={styles.importReceiptsBtn}
            onPress={() => router.push("/(drawer)/(tabs)/finances/import-payments" as any)}
            activeOpacity={0.8}
          >
            <Text style={styles.importReceiptsBtnText}>Import Receipts</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.setAutomationsBtn}
            onPress={() => router.push("/(drawer)/(tabs)/finances/automations" as any)}
            activeOpacity={0.8}
          >
            <Text style={styles.setAutomationsBtnText}>Set Automations</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. Search Bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={16} color="#9CA3AF" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by ID, client, employee, salon..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={(txt) => {
            setSearchQuery(txt);
            setCurrentPage(1);
          }}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={16} color="#9CA3AF" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* 3. Payment Cards List */}
      <View style={styles.cardsList}>
        {filteredPayments.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="receipt-outline" size={36} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>No payments found</Text>
            <Text style={styles.emptySubtitle}>
              Try adjusting your search criteria.
            </Text>
          </View>
        ) : (
          currentPayments.map((item, itemIdx) => {
            const isMenuOpen = activeActionMenuPaymentId === item.id;
            const methodSty = getMethodBadgeStyle(item.method);
            const statusSty = getStatusBadgeStyle(item.status);
            const receiptSty = getReceiptIssueBadgeStyle(item.receiptIssue);
            const cardZIndex = isMenuOpen ? 300 : currentPayments.length - itemIdx;

            return (
              <View
                key={item.id}
                style={[styles.paymentCard, { zIndex: cardZIndex }]}
              >
                {/* Card Header: Salon, ID & Payment Date on left, Amount on right */}
                <View style={styles.cardHeaderRow}>
                  <View style={styles.cardHeaderLeft}>
                    <View style={styles.salonIconBadge}>
                      <Ionicons name="sparkles" size={13} color="#FFFFFF" />
                    </View>
                    <View>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                        <Text style={styles.cardIdText}>{item.id}</Text>
                        <Text style={styles.cardSalonText}>{item.salon}</Text>
                      </View>
                      <Text style={styles.cardDateText}>{item.paymentDate}</Text>
                    </View>
                  </View>

                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={styles.cardAmountText}>
                      € {item.amount.toFixed(2)}
                    </Text>
                  </View>
                </View>

                {/* Badges Row: Method, Status, Receipt Issue */}
                <View style={styles.cardBadgesRow}>
                  <View style={[styles.badgePill, { backgroundColor: methodSty.bg }]}>
                    <Text style={[styles.badgePillText, { color: methodSty.text }]}>
                      {item.method}
                    </Text>
                  </View>

                  <View style={[styles.badgePill, { backgroundColor: statusSty.bg }]}>
                    <Text style={[styles.badgePillText, { color: statusSty.text }]}>
                      {item.status}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.badgePill,
                      {
                        backgroundColor: receiptSty.bg,
                        borderWidth: 1,
                        borderColor: receiptSty.border,
                      },
                    ]}
                  >
                    <Text style={[styles.badgePillText, { color: receiptSty.text }]}>
                      {item.receiptIssue}
                    </Text>
                  </View>
                </View>

                {/* Client & Team Member Details */}
                <View style={styles.cardDetailsBox}>
                  {/* Client Info */}
                  <View style={styles.personDetailRow}>
                    <View style={[styles.personAvatarBox, { backgroundColor: "#FDF2F8" }]}>
                      <Ionicons name="person" size={13} color="#DB2777" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.personLabel}>Client</Text>
                      <Text style={styles.personName}>{item.clientName}</Text>
                      <Text style={styles.personEmail}>{item.clientEmail}</Text>
                    </View>
                  </View>

                  {/* Team Member Info */}
                  <View style={styles.personDetailRow}>
                    <View style={[styles.personAvatarBox, { backgroundColor: "#ECFDF5" }]}>
                      <Ionicons name="shield-checkmark" size={13} color="#059669" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.personLabel}>Team Member</Text>
                      <Text style={styles.personName}>{item.teamMember}</Text>
                      <Text style={styles.personEmail}>{item.teamMemberEmail || item.clientEmail}</Text>
                    </View>
                  </View>
                </View>

                {/* Bottom Row: Quick Action Buttons & 3-Dot More Actions Menu */}
                <View style={styles.cardActionsRow}>
                  {/* Left Side: View & Refund Quick Actions */}
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    {/* View Details */}
                    <TouchableOpacity
                      style={[styles.actionIconBtn, { backgroundColor: "#EEECFF" }]}
                      onPress={() => handleViewDetails(item)}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="eye-outline" size={16} color="#635BFF" />
                    </TouchableOpacity>

                    {/* Refund */}
                    <TouchableOpacity
                      style={[styles.actionIconBtn, { backgroundColor: "#FEF2F2" }]}
                      onPress={() => handleOpenRefundModal(item)}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="refresh-outline" size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>

                  {/* Right Side: 3-Dots Button with Popover Menu below it */}
                  <View style={{ position: "relative", zIndex: 400 }}>
                    <TouchableOpacity
                      style={[
                        styles.actionIconBtn,
                        { backgroundColor: isMenuOpen ? "#EEECFF" : "#F3F4F6" },
                      ]}
                      onPress={() => {
                        setActiveActionMenuPaymentId(isMenuOpen ? null : item.id);
                      }}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name="ellipsis-horizontal"
                        size={16}
                        color={isMenuOpen ? "#635BFF" : "#4B5563"}
                      />
                    </TouchableOpacity>

                    {/* Popover Dropdown below 3-dots */}
                    {isMenuOpen && (
                      <View style={styles.actionPopoverMenu}>
                        <TouchableOpacity
                          style={styles.actionMenuItem}
                          onPress={() => handleViewDetails(item)}
                          activeOpacity={0.7}
                        >
                          <Ionicons name="eye-outline" size={15} color="#4B5563" style={{ marginRight: 8 }} />
                          <Text style={styles.actionMenuText}>View Details</Text>
                        </TouchableOpacity>

                        <View style={styles.actionMenuDivider} />

                        <TouchableOpacity
                          style={styles.actionMenuItem}
                          onPress={() => handleOpenRefundModal(item)}
                          activeOpacity={0.7}
                        >
                          <Ionicons name="refresh-outline" size={15} color="#EF4444" style={{ marginRight: 8 }} />
                          <Text style={[styles.actionMenuText, { color: "#EF4444" }]}>Refund</Text>
                        </TouchableOpacity>

                        <View style={styles.actionMenuDivider} />

                        <TouchableOpacity
                          style={styles.actionMenuItem}
                          onPress={() => handlePrintReceipt(item)}
                          activeOpacity={0.7}
                        >
                          <Ionicons name="print-outline" size={15} color="#4B5563" style={{ marginRight: 8 }} />
                          <Text style={styles.actionMenuText}>Print Receipt</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            );
          })
        )}
      </View>

      {/* 4. Pagination Footer */}
      <View style={styles.paginationCard}>
        <Text style={styles.paginationText}>
          Showing {startIndex + 1} to{" "}
          {Math.min(startIndex + PAGE_SIZE, filteredPayments.length)} of{" "}
          {filteredPayments.length} payments
        </Text>

        <View style={styles.paginationControls}>
          <TouchableOpacity
            style={[styles.pageBtn, currentPage === 1 && styles.pageBtnDisabled]}
            onPress={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={12} color={currentPage === 1 ? "#9CA3AF" : "#374151"} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.pageNumBtn, currentPage === 1 && styles.pageNumBtnActive]}
            onPress={() => setCurrentPage(1)}
            activeOpacity={0.7}
          >
            <Text style={[styles.pageNumText, currentPage === 1 && styles.pageNumTextActive]}>1</Text>
          </TouchableOpacity>

          {totalPages > 1 && (
            <TouchableOpacity
              style={[styles.pageNumBtn, currentPage === 2 && styles.pageNumBtnActive]}
              onPress={() => setCurrentPage(2)}
              activeOpacity={0.7}
            >
              <Text style={[styles.pageNumText, currentPage === 2 && styles.pageNumTextActive]}>2</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.pageBtn, currentPage === totalPages && styles.pageBtnDisabled]}
            onPress={() => setCurrentPage(2)}
            disabled={currentPage === totalPages}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-forward" size={12} color={currentPage === totalPages ? "#9CA3AF" : "#374151"} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ─── REFUND MODAL ────────────────────────────────────────────── */}
      <CustomModal
        visible={refundModalPayment !== null}
        onClose={() => setRefundModalPayment(null)}
        title="Refund"
      >
        <View style={{ gap: 14 }}>
          {/* Subtitle with ID and Date */}
          <Text style={styles.modalSubtitle}>
            ID: {refundModalPayment?.id} • {refundModalPayment?.paymentDate}
          </Text>

          {/* 1. Same Payment Method (Disabled) */}
          <View>
            <Text style={styles.modalFieldLabel}>Same Payment Method *</Text>
            <View style={styles.disabledInput}>
              <Text style={styles.disabledInputText}>{refundModalPayment?.method}</Text>
              <Ionicons name="lock-closed-outline" size={14} color="#9CA3AF" />
            </View>
          </View>

          {/* 2. Refund Amount Input */}
          <View>
            <Text style={styles.modalFieldLabel}>
              Refund Amount (Max € {refundModalPayment?.amount || 170}) *
            </Text>
            <View style={styles.amountInputRow}>
              <Text style={styles.euroPrefix}>€</Text>
              <TextInput
                style={styles.amountTextInput}
                value={refundAmount}
                onChangeText={setRefundAmount}
                keyboardType="numeric"
                placeholder="170"
              />
            </View>
          </View>

          {/* 3. Refund Given By */}
          <View style={{ position: "relative", zIndex: 10 }}>
            <Text style={styles.modalFieldLabel}>
              {refundModalPayment?.method || "Card Terminal"} Refund Given By *
            </Text>
            <TouchableOpacity
              style={styles.modalPickerButton}
              onPress={() => {
                setShowGiverDropdown(!showGiverDropdown);
                setShowReasonDropdown(false);
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.modalPickerValue}>{refundGivenBy}</Text>
              <Ionicons
                name={showGiverDropdown ? "chevron-up" : "chevron-down"}
                size={14}
                color="#6B7280"
              />
            </TouchableOpacity>

            {showGiverDropdown && (
              <View style={styles.modalDropdownList}>
                {REFUND_GIVERS.map((giver) => (
                  <TouchableOpacity
                    key={giver}
                    style={styles.modalDropdownOption}
                    onPress={() => {
                      setRefundGivenBy(giver);
                      setShowGiverDropdown(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.modalDropdownOptionText,
                        giver === refundGivenBy && { color: "#635BFF", fontWeight: "700" },
                      ]}
                    >
                      {giver}
                    </Text>
                    {giver === refundGivenBy && (
                      <Ionicons name="checkmark" size={14} color="#635BFF" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* 4. Reason for Refund */}
          <View style={{ position: "relative", zIndex: 5 }}>
            <Text style={styles.modalFieldLabel}>Reason for Refund *</Text>
            <TouchableOpacity
              style={[
                styles.modalPickerButton,
                !refundReason && { borderColor: "#E5E7EB" },
              ]}
              onPress={() => {
                setShowReasonDropdown(!showReasonDropdown);
                setShowGiverDropdown(false);
              }}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.modalPickerValue,
                  !refundReason && { color: "#9CA3AF" },
                ]}
                numberOfLines={1}
              >
                {refundReason || "Choose a reason for refund"}
              </Text>
              <Ionicons
                name={showReasonDropdown ? "chevron-up" : "chevron-down"}
                size={14}
                color="#6B7280"
              />
            </TouchableOpacity>

            {showReasonDropdown && (
              <View style={styles.modalDropdownList}>
                {REFUND_REASONS.map((reason) => (
                  <TouchableOpacity
                    key={reason}
                    style={styles.modalDropdownOption}
                    onPress={() => {
                      setRefundReason(reason);
                      setShowReasonDropdown(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.modalDropdownOptionText,
                        reason === refundReason && { color: "#635BFF", fontWeight: "700" },
                      ]}
                    >
                      {reason}
                    </Text>
                    {reason === refundReason && (
                      <Ionicons name="checkmark" size={14} color="#635BFF" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.modalActionButtonsRow}>
            <TouchableOpacity
              style={styles.modalCancelBtn}
              onPress={() => setRefundModalPayment(null)}
              activeOpacity={0.7}
            >
              <Text style={styles.modalCancelBtnText}>Cancel</Text>
            </TouchableOpacity>

            <CustomButton
              title={`Refund € ${refundAmount || "0"}`}
              onPress={handleProcessRefund}
              style={{ flex: 1.5 }}
            />
          </View>
        </View>
      </CustomModal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    position: "relative",
  },
  actionBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 150,
    backgroundColor: "transparent",
  },
  headerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 12,
  },
  headerTitleWrap: {
    gap: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },
  headerSubtitle: {
    fontSize: 11,
    color: "#6B7280",
  },
  headerButtonsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  importReceiptsBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1.2,
    borderColor: "#635BFF",
    backgroundColor: "#FFFFFF",
  },
  importReceiptsBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#635BFF",
  },
  setAutomationsBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#EEECFF",
  },
  setAutomationsBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#635BFF",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  searchInput: {
    flex: 1,
    fontSize: 12.5,
    color: "#111827",
  },
  cardsList: {
    gap: 10,
  },
  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 26,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#374151",
    marginTop: 10,
  },
  emptySubtitle: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 2,
  },
  paymentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
    gap: 10,
    position: "relative",
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  salonIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#8B5CF6",
    alignItems: "center",
    justifyContent: "center",
  },
  cardIdText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#635BFF",
  },
  cardSalonText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
  },
  cardDateText: {
    fontSize: 10.5,
    color: "#6B7280",
    marginTop: 1,
  },
  cardAmountText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
  },
  cardBadgesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 6,
  },
  badgePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgePillText: {
    fontSize: 10,
    fontWeight: "700",
  },
  cardDetailsBox: {
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    padding: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  personDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  personAvatarBox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  personLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: "#9CA3AF",
    textTransform: "uppercase",
  },
  personName: {
    fontSize: 11.5,
    fontWeight: "700",
    color: "#111827",
  },
  personEmail: {
    fontSize: 10,
    color: "#6B7280",
  },
  cardActionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 2,
  },
  actionIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  actionPopoverMenu: {
    position: "absolute",
    bottom: 38,
    right: 0,
    width: 140,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 999,
    paddingVertical: 4,
  },
  actionMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  actionMenuText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#374151",
  },
  actionMenuDivider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginHorizontal: 8,
  },
  paginationCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  paginationText: {
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "500",
  },
  paginationControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  pageBtn: {
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  pageBtnDisabled: {
    opacity: 0.4,
  },
  pageNumBtn: {
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  pageNumBtnActive: {
    backgroundColor: "#635BFF",
  },
  pageNumText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#374151",
  },
  pageNumTextActive: {
    color: "#FFFFFF",
  },
  modalSubtitle: {
    fontSize: 11.5,
    color: "#6B7280",
    fontWeight: "500",
    marginTop: -4,
  },
  modalFieldLabel: {
    fontSize: 10.5,
    fontWeight: "700",
    color: "#4B5563",
    marginBottom: 4,
  },
  disabledInput: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  disabledInputText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "600",
  },
  amountInputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    paddingHorizontal: 10,
  },
  euroPrefix: {
    fontSize: 13,
    fontWeight: "700",
    color: "#4B5563",
    marginRight: 6,
  },
  amountTextInput: {
    flex: 1,
    fontSize: 13,
    color: "#111827",
    paddingVertical: 8,
    fontWeight: "600",
  },
  modalPickerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  modalPickerValue: {
    fontSize: 12,
    color: "#111827",
    fontWeight: "500",
  },
  modalDropdownList: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
    zIndex: 999,
  },
  modalDropdownOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  modalDropdownOptionText: {
    fontSize: 11.5,
    color: "#374151",
  },
  modalActionButtonsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 8,
  },
  modalCancelBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 11,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  modalCancelBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4B5563",
  },
});
