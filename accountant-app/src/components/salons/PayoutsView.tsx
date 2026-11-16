import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PayoutData } from "@/data/salonsData";
import CustomButton from "@/components/ui/CustomButton";
import ViewPayoutBottomSheet from "./ViewPayoutBottomSheet";

interface PayoutsViewProps {
  payouts: PayoutData[];
  availableBalance: number;
  onOpenRequestModal: () => void;
}

export default function PayoutsView({
  payouts,
  availableBalance,
  onOpenRequestModal,
}: PayoutsViewProps) {
  const [statusFilter, setStatusFilter] = useState<"All" | "Paid" | "Pending">("All");
  const [selectedPayout, setSelectedPayout] = useState<PayoutData | null>(null);

  const filteredPayouts = payouts.filter((p) => {
    if (statusFilter === "All") return true;
    return p.status === statusFilter;
  });

  const totalPaid = payouts
    .filter((p) => p.status === "Paid")
    .reduce((acc, curr) => acc + parseFloat(curr.amount.replace("€", "").replace(",", "").trim()), 0);

  const totalPending = payouts
    .filter((p) => p.status === "Pending")
    .reduce((acc, curr) => acc + parseFloat(curr.amount.replace("€", "").replace(",", "").trim()), 0);

  return (
    <View style={styles.container}>
      {/* Payouts Overview Summary Card */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryTopRow}>
          <View>
            <Text style={styles.summaryLabel}>Available Balance</Text>
            <Text style={styles.summaryAmount}>
              €{availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </Text>
          </View>
          <CustomButton
            title="Request Payout"
            onPress={onOpenRequestModal}
            size="medium"
            icon={<Ionicons name="card-outline" size={16} color="#FFFFFF" />}
            style={styles.requestBtn}
          />
        </View>

        <View style={styles.summaryDivider} />

        <View style={styles.summaryStatsRow}>
          <View style={styles.statCol}>
            <Text style={styles.statLabel}>Total Paid Out</Text>
            <Text style={styles.statValuePaid}>
              €{totalPaid.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCol}>
            <Text style={styles.statLabel}>Pending Review</Text>
            <Text style={styles.statValuePending}>
              €{totalPending.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </Text>
          </View>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {(["All", "Paid", "Pending"] as const).map((st) => (
          <TouchableOpacity
            key={st}
            style={[styles.filterChip, statusFilter === st && styles.filterChipActive]}
            onPress={() => setStatusFilter(st)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.filterChipText,
                statusFilter === st && styles.filterChipTextActive,
              ]}
            >
              {st}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Payouts List */}
      {filteredPayouts.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="wallet-outline" size={48} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>No Payouts Recorded</Text>
          <Text style={styles.emptyDesc}>No payout transactions match your filter.</Text>
        </View>
      ) : (
        <View style={styles.payoutsList}>
          {filteredPayouts.map((p) => {
            const isPaid = p.status === "Paid";
            return (
              <TouchableOpacity
                key={p.id}
                style={styles.payoutCard}
                onPress={() => setSelectedPayout(p)}
                activeOpacity={0.8}
              >
                <View style={styles.payoutCardHeader}>
                  <View style={styles.headerLeft}>
                    <View
                      style={[
                        styles.iconWrap,
                        isPaid ? styles.iconWrapPaid : styles.iconWrapPending,
                      ]}
                    >
                      <Ionicons
                        name={isPaid ? "checkmark-done" : "hourglass-outline"}
                        size={18}
                        color={isPaid ? "#10B981" : "#F59E0B"}
                      />
                    </View>
                    <View>
                      <Text style={styles.invoiceNo}>{p.invoiceNo}</Text>
                      <Text style={styles.requestDate}>{p.requestDate}</Text>
                    </View>
                  </View>

                  <Text style={styles.payoutAmount}>{p.amount}</Text>
                </View>

                <View style={styles.cardDivider} />

                <View style={styles.payoutCardFooter}>
                  <View style={styles.footerCol}>
                    <Text style={styles.footerLabel}>Payment Date</Text>
                    <Text style={styles.footerValue}>{p.paymentDate}</Text>
                  </View>
                  <View style={styles.footerCol}>
                    <Text style={styles.footerLabel}>Status</Text>
                    <View
                      style={[
                        styles.statusPill,
                        isPaid ? styles.statusPillPaid : styles.statusPillPending,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          isPaid ? styles.statusTextPaid : styles.statusTextPending,
                        ]}
                      >
                        {p.status}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Rich Payout Details Bottom Sheet matching web */}
      <ViewPayoutBottomSheet
        visible={!!selectedPayout}
        onClose={() => setSelectedPayout(null)}
        payout={selectedPayout}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 32,
  },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  summaryTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 2,
  },
  summaryAmount: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
  },
  requestBtn: {
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    width: 200
  },
  summaryDivider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginVertical: 12,
  },
  summaryStatsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  statCol: {
    alignItems: "center",
  },
  statLabel: {
    fontSize: 11,
    color: "#9CA3AF",
    marginBottom: 2,
  },
  statValuePaid: {
    fontSize: 14,
    fontWeight: "700",
    color: "#10B981",
  },
  statValuePending: {
    fontSize: 14,
    fontWeight: "700",
    color: "#F59E0B",
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: "#E5E7EB",
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  filterChipActive: {
    backgroundColor: "#635BFF",
    borderColor: "#635BFF",
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4B5563",
  },
  filterChipTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  payoutsList: {
    gap: 12,
  },
  payoutCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  payoutCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  iconWrapPaid: {
    backgroundColor: "#ECFDF5",
  },
  iconWrapPending: {
    backgroundColor: "#FFFBEB",
  },
  invoiceNo: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
  },
  requestDate: {
    fontSize: 11,
    color: "#6B7280",
  },
  payoutAmount: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
  },
  cardDivider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginVertical: 10,
  },
  payoutCardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerCol: {
    alignItems: "flex-start",
  },
  footerLabel: {
    fontSize: 10,
    color: "#9CA3AF",
    marginBottom: 2,
  },
  footerValue: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusPillPaid: {
    backgroundColor: "#ECFDF5",
  },
  statusPillPending: {
    backgroundColor: "#FFFBEB",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
  },
  statusTextPaid: {
    color: "#10B981",
  },
  statusTextPending: {
    color: "#D97706",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#374151",
    marginTop: 10,
  },
  emptyDesc: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 4,
  },
});
