import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Avatar from "@/components/Avatar";
import ViewPayslipModal from "@/components/team/modals/ViewPayslipModal";
import {
  initialPendingSalaries,
  initialApprovedSalaries,
  initialSalaryHistoryGroups,
  SalaryRecord,
  SalaryMonthGroup,
} from "@/components/team/teamData";

export default function SalariesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [activeTab, setActiveTab] = useState<"Pending Approval" | "Payment History">("Pending Approval");
  const [pendingSalaries, setPendingSalaries] = useState<SalaryRecord[]>(initialPendingSalaries);
  const [approvedSalaries, setApprovedSalaries] = useState<SalaryRecord[]>(initialApprovedSalaries);
  const [salaryHistoryGroups, setSalaryHistoryGroups] = useState<SalaryMonthGroup[]>(initialSalaryHistoryGroups);
  const [expandedSalaryIds, setExpandedSalaryIds] = useState<string[]>(["1", "h1"]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewingPayslip, setViewingPayslip] = useState<SalaryRecord | null>(null);

  const toggleSalaryRow = (id: string) => {
    if (expandedSalaryIds.includes(id)) {
      setExpandedSalaryIds(expandedSalaryIds.filter((item) => item !== id));
    } else {
      setExpandedSalaryIds([...expandedSalaryIds, id]);
    }
  };

  const handleApproveSalary = (id: string) => {
    const record = pendingSalaries.find((s) => s.id === id);
    if (record) {
      setPendingSalaries((prev) => prev.filter((s) => s.id !== id));
      setApprovedSalaries((prev) => [...prev, { ...record, status: "Approved" }]);
      Alert.alert("Approved", `Salary for ${record.name} is now approved and ready for payment.`);
    }
  };

  const handleRejectSalary = (id: string) => {
    const record = pendingSalaries.find((s) => s.id === id);
    if (record) {
      setPendingSalaries((prev) => prev.filter((s) => s.id !== id));
      Alert.alert("Rejected", `Salary review for ${record.name} rejected.`);
    }
  };

  const handleApprovalAll = () => {
    if (pendingSalaries.length === 0) return;
    Alert.alert(
      "Approval All",
      `Approve all ${pendingSalaries.length} pending salaries and move them to Ready for Payment?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Approve All",
          onPress: () => {
            const approvedList = pendingSalaries.map((s) => ({
              ...s,
              status: "Approved" as const,
            }));
            setApprovedSalaries((prev) => [...prev, ...approvedList]);
            setPendingSalaries([]);
            Alert.alert("Success", `All ${approvedList.length} salaries have been approved.`);
          },
        },
      ]
    );
  };

  const handleReapprovalAll = () => {
    Alert.alert(
      "Reapproval All",
      `Send re-approval notification for all ${pendingSalaries.length} pending salaries?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: () => {
            Alert.alert("Reapproval Requested", "All records have been notified for re-review.");
          },
        },
      ]
    );
  };

  const handlePayNow = (record: SalaryRecord) => {
    Alert.alert(
      "Revolut Payment",
      `Process net payout of ${record.netAmount} to ${record.name} via Revolut?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Pay Now",
          onPress: () => {
            setApprovedSalaries((prev) => prev.filter((s) => s.id !== record.id));
            setSalaryHistoryGroups((prev) =>
              prev.map((g) => {
                if (g.month === "December 2024") {
                  return {
                    ...g,
                    paymentsCount: g.paymentsCount + 1,
                    records: [{ ...record, status: "Paid", month: "December 2024" }, ...g.records],
                  };
                }
                return g;
              })
            );
            Alert.alert("Payment Successful", `Transfer of ${record.netAmount} to ${record.name} was completed.`);
          },
        },
      ]
    );
  };

  const handleMarkAsPaid = (record: SalaryRecord) => {
    setApprovedSalaries((prev) => prev.filter((s) => s.id !== record.id));
    setSalaryHistoryGroups((prev) =>
      prev.map((g) => {
        if (g.month === "December 2024") {
          return {
            ...g,
            paymentsCount: g.paymentsCount + 1,
            records: [{ ...record, status: "Paid", month: "December 2024" }, ...g.records],
          };
        }
        return g;
      })
    );
    Alert.alert("Marked as Paid", `Salary for ${record.name} has been archived in Payment History.`);
  };

  const pendingTotalFormatted = `€ ${(pendingSalaries.length * 3200).toLocaleString("en-US", {
    minimumFractionDigits: 2,
  })}`;
  const approvedTotalFormatted = `€ ${(approvedSalaries.length * 3200).toLocaleString("en-US", {
    minimumFractionDigits: 2,
  })}`;
  const historyTotalPayments = salaryHistoryGroups.reduce((acc, g) => acc + g.records.length, 0);

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 15) }]}>
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={22} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Salaries</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => Alert.alert("Download Report", "Downloading salary report for December 2024 (PDF)...")}
            activeOpacity={0.7}
          >
            <Ionicons name="download-outline" size={20} color="#635BFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs Menu */}
      <View style={styles.tabsWrapper}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "Pending Approval" && styles.tabButtonActive]}
          onPress={() => setActiveTab("Pending Approval")}
          activeOpacity={0.75}
        >
          <Text style={[styles.tabButtonText, activeTab === "Pending Approval" && styles.tabButtonTextActive]}>
            Pending Approval ({pendingSalaries.length})
          </Text>
          {activeTab === "Pending Approval" && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === "Payment History" && styles.tabButtonActive]}
          onPress={() => setActiveTab("Payment History")}
          activeOpacity={0.75}
        >
          <Text style={[styles.tabButtonText, activeTab === "Payment History" && styles.tabButtonTextActive]}>
            Payment History ({historyTotalPayments})
          </Text>
          {activeTab === "Payment History" && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        contentContainerStyle={styles.scrollList}
        showsVerticalScrollIndicator={false}
      >
        {/* TAB 1: PENDING APPROVAL */}
        {activeTab === "Pending Approval" && (
          <View style={{ gap: 16 }}>
            {/* SECTION 1: PENDING REVIEW */}
            <View style={styles.salarySectionCard}>
              <View style={styles.salarySectionHeader}>
                <Text style={styles.salarySectionTitle}>Pending Review</Text>

                <View style={styles.pendingReviewControlsRow}>
                  <View style={styles.salarySearchInputBox}>
                    <Ionicons name="search" size={15} color="#94A3B8" />
                    <TextInput
                      style={styles.salarySearchInput}
                      placeholder="Search..."
                      placeholderTextColor="#94A3B8"
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                    />
                  </View>

                  <View style={styles.bulkButtonsRow}>
                    <TouchableOpacity
                      style={styles.reapprovalBtn}
                      onPress={handleReapprovalAll}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.reapprovalBtnText}>
                        Reapproval All ({pendingSalaries.length})
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.approvalAllBtn}
                      onPress={handleApprovalAll}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.approvalAllBtnText}>
                        Approval All ({pendingSalaries.length})
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* List of Pending Review records */}
              <View style={styles.salaryListContainer}>
                {pendingSalaries
                  .filter((s) =>
                    s.name.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((salary) => {
                    const isExpanded = expandedSalaryIds.includes(salary.id);
                    return (
                      <View key={salary.id} style={styles.salaryRecordItem}>
                        <View style={styles.salaryCardHeader}>
                          <Avatar name={salary.name} uri={salary.avatarUrl} size={38} />
                          <View style={{ flex: 1, marginLeft: 10 }}>
                            <Text style={styles.salaryCardName}>{salary.name}</Text>
                            <Text style={styles.salaryCardUploader}>
                              Uploaded by: {salary.uploader}
                            </Text>
                          </View>
                          <View style={styles.salaryCardRolePill}>
                            <Text style={styles.salaryCardRoleText}>{salary.role}</Text>
                          </View>
                        </View>

                        {/* Amount & Status Row */}
                        <View style={styles.salaryCardAmountRow}>
                          <View>
                            <Text style={styles.salaryCardAmount}>{salary.netAmount}</Text>
                            <Text style={styles.salaryCardMetaText}>
                              {salary.month} · {salary.date}
                            </Text>
                          </View>
                          <View style={styles.statusBadgeReview}>
                            <Text style={styles.statusTextReview}>Under Review</Text>
                          </View>
                        </View>

                        {/* Actions Row */}
                        <View style={styles.salaryCardActionsRow}>
                          <TouchableOpacity
                            style={styles.expandChevronBtn}
                            onPress={() => toggleSalaryRow(salary.id)}
                            activeOpacity={0.7}
                          >
                            <Ionicons
                              name={isExpanded ? "chevron-up" : "chevron-down"}
                              size={15}
                              color="#635BFF"
                            />
                            <Text style={styles.expandChevronText}>
                              {isExpanded ? "Hide" : "Details"}
                            </Text>
                          </TouchableOpacity>

                          <View style={styles.actionButtonsFlexRow}>
                            <TouchableOpacity
                              style={styles.approveCardBtn}
                              onPress={() => handleApproveSalary(salary.id)}
                              activeOpacity={0.8}
                            >
                              <Ionicons name="checkmark" size={14} color="#0D9488" />
                              <Text style={styles.approveCardBtnText}>Approve</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                              style={styles.rejectCardBtn}
                              onPress={() => handleRejectSalary(salary.id)}
                              activeOpacity={0.8}
                            >
                              <Ionicons name="close" size={14} color="#F43F5E" />
                              <Text style={styles.rejectCardBtnText}>Reject</Text>
                            </TouchableOpacity>
                          </View>
                        </View>

                        {/* Expanded Breakdown Drawer */}
                        {isExpanded && (
                          <View style={styles.salaryExpandedBox}>
                            <View style={styles.breakdownGrid}>
                              <View style={styles.breakdownItem}>
                                <Text style={styles.breakdownLabel}>GROSS SALARY</Text>
                                <Text style={styles.breakdownVal}>{salary.grossSalary}</Text>
                              </View>
                              <View style={styles.breakdownItem}>
                                <Text style={styles.breakdownLabel}>NET SALARY</Text>
                                <Text style={styles.breakdownVal}>{salary.netSalary}</Text>
                              </View>
                              <View style={styles.breakdownItem}>
                                <Text style={styles.breakdownLabel}>TRF (MONTHLY)</Text>
                                <Text style={styles.breakdownVal}>{salary.trfMonthly}</Text>
                              </View>
                              <View style={styles.breakdownItem}>
                                <Text style={styles.breakdownLabel}>CUMULATIVE TRF</Text>
                                <Text style={styles.breakdownVal}>{salary.cumulativeTrf}</Text>
                              </View>
                              <View style={[styles.breakdownItem, { width: "100%" }]}>
                                <Text style={styles.breakdownLabel}>IBAN</Text>
                                <Text style={styles.breakdownValMono}>{salary.iban}</Text>
                              </View>
                            </View>

                            <TouchableOpacity style={styles.viewPayslipPillBtn}
                                onPress={() => setViewingPayslip(salary)}
                                activeOpacity={0.8}
                              >
                                <Ionicons name="eye-outline" size={14} color="#635BFF" />
                                <Text style={styles.viewPayslipPillBtnText}>View Payslip</Text>
                              </TouchableOpacity>
                              </View>
                            )}
                          </View>
                    );
                  })}

                {pendingSalaries.length === 0 && (
                  <View style={styles.emptyContainer}>
                    <Ionicons name="checkmark-circle-outline" size={36} color="#10B981" />
                    <Text style={styles.emptyTitle}>All caught up!</Text>
                    <Text style={styles.emptyDesc}>
                      There are no pending salaries awaiting your review.
                    </Text>
                  </View>
                )}
              </View>

              {/* Section Total Banner */}
              <View style={styles.salarySectionFooter}>
                <Text style={styles.sectionFooterTotalLabel}>Total Amount</Text>
                <View style={styles.purplePillBadge}>
                  <Text style={styles.purplePillBadgeText}>{pendingTotalFormatted}</Text>
                </View>
              </View>
            </View>

            {/* SECTION 2: APPROVED AND READY FOR PAYMENT */}
            <View style={styles.salarySectionCard}>
              <View style={styles.salarySectionHeader}>
                <Text style={styles.salarySectionTitle}>
                  Approved and Ready for Payment
                </Text>
              </View>

              <View style={styles.salaryListContainer}>
                {approvedSalaries.map((salary) => {
                  const isExpanded = expandedSalaryIds.includes(salary.id);
                  return (
                    <View key={salary.id} style={styles.salaryRecordItem}>
                      <View style={styles.salaryCardHeader}>
                        <Avatar name={salary.name} uri={salary.avatarUrl} size={38} />
                        <View style={{ flex: 1, marginLeft: 10 }}>
                          <Text style={styles.salaryCardName}>{salary.name}</Text>
                          <Text style={styles.salaryCardUploader}>
                            Uploaded by: {salary.uploader}
                          </Text>
                        </View>
                        <View style={styles.salaryCardRolePill}>
                          <Text style={styles.salaryCardRoleText}>{salary.role}</Text>
                        </View>
                      </View>

                      {/* Amount & Status Row */}
                      <View style={styles.salaryCardAmountRow}>
                        <View>
                          <Text style={styles.salaryCardAmount}>{salary.netAmount}</Text>
                          <Text style={styles.salaryCardMetaText}>{salary.date}</Text>
                        </View>
                        <View style={styles.statusBadgeApproved}>
                          <Text style={styles.statusTextApproved}>Approved</Text>
                        </View>
                      </View>

                      {/* Actions Row */}
                      <View style={styles.salaryCardActionsRow}>
                        <TouchableOpacity
                          style={styles.expandChevronBtn}
                          onPress={() => toggleSalaryRow(salary.id)}
                          activeOpacity={0.7}
                        >
                          <Ionicons
                            name={isExpanded ? "chevron-up" : "chevron-down"}
                            size={15}
                            color="#635BFF"
                          />
                          <Text style={styles.expandChevronText}>
                            {isExpanded ? "Hide" : "Details"}
                          </Text>
                        </TouchableOpacity>

                        <View style={styles.actionButtonsFlexRow}>
                          <TouchableOpacity
                            style={styles.payNowBtn}
                            onPress={() => handlePayNow(salary)}
                            activeOpacity={0.8}
                          >
                            <Ionicons name="flash-outline" size={13} color="#FFFFFF" />
                            <Text style={styles.payNowBtnText}>Pay Now</Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={styles.markAsPaidBtn}
                            onPress={() => handleMarkAsPaid(salary)}
                            activeOpacity={0.8}
                          >
                            <Ionicons name="checkmark-done-outline" size={14} color="#FFFFFF" />
                            <Text style={styles.markAsPaidBtnText}>Mark as Paid</Text>
                          </TouchableOpacity>
                        </View>
                      </View>

                      {/* Expanded Breakdown Drawer */}
                      {isExpanded && (
                        <View style={styles.salaryExpandedBox}>
                          <View style={styles.breakdownGrid}>
                            <View style={styles.breakdownItem}>
                              <Text style={styles.breakdownLabel}>GROSS SALARY</Text>
                              <Text style={styles.breakdownVal}>{salary.grossSalary}</Text>
                            </View>
                            <View style={styles.breakdownItem}>
                              <Text style={styles.breakdownLabel}>NET SALARY</Text>
                              <Text style={styles.breakdownVal}>{salary.netSalary}</Text>
                            </View>
                            <View style={styles.breakdownItem}>
                              <Text style={styles.breakdownLabel}>TRF (MONTHLY)</Text>
                              <Text style={styles.breakdownVal}>{salary.trfMonthly}</Text>
                            </View>
                            <View style={styles.breakdownItem}>
                              <Text style={styles.breakdownLabel}>CUMULATIVE TRF</Text>
                              <Text style={styles.breakdownVal}>{salary.cumulativeTrf}</Text>
                            </View>
                            <View style={[styles.breakdownItem, { width: "100%" }]}>
                              <Text style={styles.breakdownLabel}>IBAN</Text>
                              <Text style={styles.breakdownValMono}>{salary.iban}</Text>
                            </View>
                          </View>

                          <TouchableOpacity style={styles.viewPayslipPillBtn}
                              onPress={() => setViewingPayslip(salary)}
                              activeOpacity={0.8}
                            >
                              <Ionicons name="eye-outline" size={14} color="#635BFF" />
                              <Text style={styles.viewPayslipPillBtnText}>View Payslip</Text>
                            </TouchableOpacity>
                              </View>
                            )}
                          </View>
                  );
                })}

                {approvedSalaries.length === 0 && (
                  <View style={styles.emptyContainer}>
                    <Ionicons name="file-tray-outline" size={36} color="#94A3B8" />
                    <Text style={styles.emptyTitle}>No Approved Items</Text>
                    <Text style={styles.emptyDesc}>
                      Approve salaries in the Pending Review section to make them ready for payment.
                    </Text>
                  </View>
                )}
              </View>

              {/* Section Total Banner */}
              <View style={styles.salarySectionFooter}>
                <Text style={styles.sectionFooterTotalLabel}>Total Amount</Text>
                <View style={styles.purplePillBadge}>
                  <Text style={styles.purplePillBadgeText}>{approvedTotalFormatted}</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* TAB 2: PAYMENT HISTORY GROUPED BY MONTH */}
        {activeTab === "Payment History" && (
          <View style={{ gap: 18 }}>
            {salaryHistoryGroups.map((monthGroup) => (
              <View key={monthGroup.month} style={styles.salarySectionCard}>
                {/* Month Group Header */}
                <View style={styles.monthHeaderRow}>
                  <Text style={styles.monthTitleText}>{monthGroup.month}</Text>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={styles.monthTotalAmountText}>{monthGroup.totalAmount}</Text>
                    <Text style={styles.monthPaymentsCountText}>
                      {monthGroup.paymentsCount} Payments
                    </Text>
                  </View>
                </View>

                {/* Month Payments List */}
                <View style={styles.salaryListContainer}>
                  {monthGroup.records.map((salary) => {
                    const uid = `${monthGroup.month}-${salary.id}`;
                    const isExpanded = expandedSalaryIds.includes(uid);
                    return (
                      <View key={uid} style={styles.salaryRecordItem}>
                        <View style={styles.salaryCardHeader}>
                          <Avatar name={salary.name} uri={salary.avatarUrl} size={38} />
                          <View style={{ flex: 1, marginLeft: 10 }}>
                            <Text style={styles.salaryCardName}>{salary.name}</Text>
                            <Text style={styles.salaryCardUploader}>
                              Uploaded by: {salary.uploader}
                            </Text>
                          </View>
                          <View style={styles.salaryCardRolePill}>
                            <Text style={styles.salaryCardRoleText}>{salary.role}</Text>
                          </View>
                        </View>

                        {/* Amount & Status Row */}
                        <View style={styles.salaryCardAmountRow}>
                          <View>
                            <Text style={styles.salaryCardAmount}>{salary.netAmount}</Text>
                            <Text style={styles.salaryCardMetaText}>
                              {salary.month || monthGroup.month} · {salary.date}
                            </Text>
                          </View>
                          <View style={styles.statusBadgeApproved}>
                          <Text style={styles.statusTextApproved}>Paid</Text>
                        </View>
                        </View>

                        {/* Actions Row */}
                        <View style={styles.salaryCardActionsRow}>
                          <TouchableOpacity
                            style={styles.expandChevronBtn}
                            onPress={() => toggleSalaryRow(uid)}
                            activeOpacity={0.7}
                          >
                            <Ionicons
                              name={isExpanded ? "chevron-up" : "chevron-down"}
                              size={15}
                              color="#635BFF"
                            />
                            <Text style={styles.expandChevronText}>
                              {isExpanded ? "Hide" : "Details"}
                            </Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={styles.viewPayslipHistoryBtn}
                            onPress={() => setViewingPayslip(salary)}
                            activeOpacity={0.8}
                          >
                            <Ionicons name="eye-outline" size={14} color="#635BFF" />
                            <Text style={styles.viewPayslipHistoryBtnText}>View Payslip</Text>
                          </TouchableOpacity>
                        </View>

                        {/* Expanded Drawer */}
                        {isExpanded && (
                          <View style={styles.salaryExpandedBox}>
                            <View style={styles.breakdownGrid}>
                              <View style={styles.breakdownItem}>
                                <Text style={styles.breakdownLabel}>GROSS SALARY</Text>
                                <Text style={styles.breakdownVal}>{salary.grossSalary}</Text>
                              </View>
                              <View style={styles.breakdownItem}>
                                <Text style={styles.breakdownLabel}>NET SALARY</Text>
                                <Text style={styles.breakdownVal}>{salary.netSalary}</Text>
                              </View>
                              <View style={styles.breakdownItem}>
                                <Text style={styles.breakdownLabel}>TRF (MONTHLY)</Text>
                                <Text style={styles.breakdownVal}>{salary.trfMonthly}</Text>
                              </View>
                              <View style={styles.breakdownItem}>
                                <Text style={styles.breakdownLabel}>CUMULATIVE TRF</Text>
                                <Text style={styles.breakdownVal}>{salary.cumulativeTrf}</Text>
                              </View>
                              <View style={[styles.breakdownItem, { width: "100%" }]}>
                                <Text style={styles.breakdownLabel}>IBAN</Text>
                                <Text style={styles.breakdownValMono}>{salary.iban}</Text>
                              </View>
                            </View>

                            <TouchableOpacity style={styles.viewPayslipPillBtn}
                                onPress={() => setViewingPayslip(salary)}
                                activeOpacity={0.8}
                              >
                                <Ionicons name="eye-outline" size={14} color="#635BFF" />
                                <Text style={styles.viewPayslipPillBtnText}>View Payslip</Text>
                              </TouchableOpacity>
                              </View>
                            )}
                          </View>
                    );
                  })}
                </View>

                {/* Month Summary Footer */}
                <View style={styles.monthFooterRow}>
                  <View style={styles.monthFooterItem}>
                    <Text style={styles.monthFooterLabel}>Month Total</Text>
                    <View style={styles.purplePillBadge}>
                      <Text style={styles.purplePillBadgeText}>{monthGroup.totalAmount}</Text>
                    </View>
                  </View>

                  <View style={styles.monthFooterItem}>
                    <Text style={styles.monthFooterLabel}>Average Salary</Text>
                    <View style={styles.purplePillBadge}>
                      <Text style={styles.purplePillBadgeText}>{monthGroup.averageSalary}</Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* View Payslip Modal */}
      <ViewPayslipModal
        visible={!!viewingPayslip}
        record={viewingPayslip}
        onClose={() => setViewingPayslip(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    height: 52,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  headerTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 16,
    color: "#1E293B",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 6,
  },
  tabsWrapper: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 16,
  },
  tabButton: {
    paddingVertical: 12,
    position: "relative",
  },
  tabButtonActive: {},
  tabButtonText: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 13,
    color: "#64748B",
  },
  tabButtonTextActive: {
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  activeTabIndicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 2.5,
    backgroundColor: "#635BFF",
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  scrollList: {
    padding: 16,
    paddingBottom: 40,
  },

  // Salary Section Cards
  salarySectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  salarySectionHeader: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    gap: 10,
  },
  salarySectionTitle: {
    fontSize: 15,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  pendingReviewControlsRow: {
    gap: 10,
  },
  salarySearchInputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 36,
  },
  salarySearchInput: {
    flex: 1,
    marginLeft: 6,
    fontSize: 13,
    fontFamily: "Manrope_500Medium",
    color: "#1E293B",
    paddingVertical: 0,
  },
  bulkButtonsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  reapprovalBtn: {
    flex: 1,
    backgroundColor: "#FCE7F3",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  reapprovalBtnText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#F43F5E",
  },
  approvalAllBtn: {
    flex: 1,
    backgroundColor: "#14B8A6",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  approvalAllBtnText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },

  // Salary Item Card
  salaryListContainer: {
    padding: 12,
    gap: 10,
  },
  salaryRecordItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 12,
    gap: 8,
  },
  salaryCardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  salaryCardName: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  salaryCardUploader: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
    marginTop: 2,
  },
  salaryCardRolePill: {
    backgroundColor: "#FEF9C3",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  salaryCardRoleText: {
    fontSize: 10,
    fontFamily: "Manrope_700Bold",
    color: "#CA8A04",
  },
  salaryCardAmountRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 8,
    paddingBottom: 4,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  salaryCardAmount: {
    fontSize: 15,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  salaryCardMetaText: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    marginTop: 2,
  },
  statusBadgeReview: {
    backgroundColor: "#FEF9C3",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(202, 138, 4, 0.2)",
  },
  statusTextReview: {
    fontSize: 10,
    fontFamily: "Manrope_700Bold",
    color: "#CA8A04",
  },
  statusBadgeApproved: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(22, 163, 74, 0.2)",
  },
  statusTextApproved: {
    fontSize: 10,
    fontFamily: "Manrope_700Bold",
    color: "#16A34A",
  },
  salaryCardActionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F8FAFC",
  },
  expandChevronBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: "#EEF2FF",
  },
  expandChevronText: {
    fontSize: 11,
    fontFamily: "Manrope_600SemiBold",
    color: "#635BFF",
  },
  actionButtonsFlexRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  approveCardBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    backgroundColor: "#CCFBF1",
    paddingVertical: 7,
    borderRadius: 8,
  },
  approveCardBtnText: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#0D9488",
  },
  rejectCardBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    backgroundColor: "#FCE7F3",
    paddingVertical: 7,
    borderRadius: 8,
  },
  rejectCardBtnText: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#F43F5E",
  },
  payNowBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    backgroundColor: "#14B8A6",
    paddingVertical: 8,
    borderRadius: 8,
  },
  payNowBtnText: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },
  markAsPaidBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    backgroundColor: "#635BFF",
    paddingVertical: 8,
    borderRadius: 8,
  },
  markAsPaidBtnText: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },
  viewPayslipHistoryBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    backgroundColor: "#EEF2FF",
    borderWidth: 1,
    borderColor: "#E0E7FF",
    paddingVertical: 7,
    borderRadius: 8,
  },
  viewPayslipHistoryBtnText: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  viewPayslipPillBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#EEF2FF",
    borderWidth: 1,
    borderColor: "#E0E7FF",
    paddingVertical: 8,
    borderRadius: 8,
    width: "100%",
    marginTop: 10,
  },
  viewPayslipPillBtnText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  salaryExpandedBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    padding: 12,
    marginTop: 4,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  breakdownGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  breakdownItem: {
    width: "47%",
  },
  breakdownLabel: {
    fontSize: 10,
    fontFamily: "Manrope_700Bold",
    color: "#94A3B8",
    textTransform: "uppercase",
  },
  breakdownVal: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
    marginTop: 2,
  },
  breakdownValMono: {
    fontSize: 12,
    fontFamily: "Manrope_600SemiBold",
    color: "#1E293B",
    marginTop: 2,
  },
  salarySectionFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  sectionFooterTotalLabel: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  purplePillBadge: {
    backgroundColor: "#635BFF",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  purplePillBadgeText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },

  // Month Groups for Payment History
  monthHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  monthTitleText: {
    fontSize: 15,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  monthTotalAmountText: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  monthPaymentsCountText: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
    marginTop: 1,
  },
  monthFooterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    gap: 8,
  },
  monthFooterItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  monthFooterLabel: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  emptyContainer: {
    paddingVertical: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#475569",
    marginTop: 8,
  },
  emptyDesc: {
    fontSize: 12,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
    marginTop: 2,
    textAlign: "center",
    paddingHorizontal: 20,
  },
});
