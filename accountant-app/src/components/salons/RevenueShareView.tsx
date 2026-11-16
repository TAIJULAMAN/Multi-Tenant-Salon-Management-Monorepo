import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  RevenueCardData,
  BreakdownData,
  TransactionData,
} from "@/data/salonsData";

interface RevenueShareViewProps {
  revenueCards: RevenueCardData[];
  breakdowns: BreakdownData[];
  transactions: TransactionData[];
  onNavigateToPayouts: () => void;
}

export default function RevenueShareView({
  revenueCards,
  breakdowns,
  transactions,
  onNavigateToPayouts,
}: RevenueShareViewProps) {
  const [periodFilter, setPeriodFilter] = useState("This Month");
  const [activeSubSection, setActiveSubSection] = useState<"Breakdown" | "Transactions">("Breakdown");

  const getCardTheme = (type: RevenueCardData["type"]) => {
    switch (type) {
      case "success":
        return {
          bg: "#ECFDF5",
          border: "#A7F3D0",
          text: "#065F46",
          amount: "#047857",
          icon: "cash-outline" as const,
        };
      case "primary":
        return {
          bg: "#EEECFF",
          border: "#C7D2FE",
          text: "#3730A3",
          amount: "#635BFF",
          icon: "time-outline" as const,
        };
      case "danger":
        return {
          bg: "#FEF2F2",
          border: "#FECACA",
          text: "#991B1B",
          amount: "#DC2626",
          icon: "trophy-outline" as const,
        };
      case "warning":
        return {
          bg: "#FFFBEB",
          border: "#FDE68A",
          text: "#92400E",
          amount: "#D97706",
          icon: "wallet-outline" as const,
        };
    }
  };

  return (
    <View style={styles.container}>
      {/* 2x2 Grid of Revenue KPI Cards */}
      <View style={styles.kpiGrid}>
        {revenueCards.map((kpi, idx) => {
          const theme = getCardTheme(kpi.type);
          return (
            <View
              key={idx}
              style={[
                styles.kpiCard,
                { backgroundColor: theme.bg, borderColor: theme.border },
              ]}
            >
              <View style={styles.kpiHeader}>
                <Text style={[styles.kpiTitle, { color: theme.text }]} numberOfLines={1}>
                  {kpi.title}
                </Text>
                <Ionicons name={theme.icon} size={18} color={theme.amount} />
              </View>
              <Text style={[styles.kpiAmount, { color: theme.amount }]}>
                €{kpi.amount.toLocaleString()}
              </Text>
              <Text style={[styles.kpiDesc, { color: theme.text }]} numberOfLines={1}>
                {kpi.description}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Withdrawable Balance Banner */}
      <View style={styles.payoutBanner}>
        <View style={{ flex: 1 }}>
          <Text style={styles.payoutBannerTitle}>Ready for Payout?</Text>
          <Text style={styles.payoutBannerSubtitle}>
            You have €1,500.00 withdrawable referral balance.
          </Text>
        </View>
        <TouchableOpacity
          style={styles.requestPayoutBtn}
          onPress={onNavigateToPayouts}
          activeOpacity={0.8}
        >
          <Text style={styles.requestPayoutBtnText}>Go to Payouts</Text>
          <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Section Switcher Tabs */}
      <View style={styles.sectionTabsRow}>
        <TouchableOpacity
          style={[
            styles.sectionTab,
            activeSubSection === "Breakdown" && styles.sectionTabActive,
          ]}
          onPress={() => setActiveSubSection("Breakdown")}
          activeOpacity={0.7}
        >
          <Ionicons
            name="pie-chart-outline"
            size={16}
            color={activeSubSection === "Breakdown" ? "#635BFF" : "#6B7280"}
            style={{ marginRight: 6 }}
          />
          <Text
            style={[
              styles.sectionTabText,
              activeSubSection === "Breakdown" && styles.sectionTabTextActive,
            ]}
          >
            Salon Breakdown
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.sectionTab,
            activeSubSection === "Transactions" && styles.sectionTabActive,
          ]}
          onPress={() => setActiveSubSection("Transactions")}
          activeOpacity={0.7}
        >
          <Ionicons
            name="receipt-outline"
            size={16}
            color={activeSubSection === "Transactions" ? "#635BFF" : "#6B7280"}
            style={{ marginRight: 6 }}
          />
          <Text
            style={[
              styles.sectionTabText,
              activeSubSection === "Transactions" && styles.sectionTabTextActive,
            ]}
          >
            Recent Transactions
          </Text>
        </TouchableOpacity>
      </View>

      {/* SUBSECTION 1: Salon Breakdown */}
      {activeSubSection === "Breakdown" && (
        <View style={styles.subSectionContent}>
          {breakdowns.map((item) => (
            <View key={item.id} style={styles.breakdownCard}>
              <View style={styles.breakdownHeader}>
                <View style={styles.avatarWrap}>
                  <Ionicons name="storefront" size={18} color="#635BFF" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.breakdownName}>{item.salonName}</Text>
                  <Text style={styles.breakdownEmail}>{item.email}</Text>
                </View>
                <View style={styles.planPill}>
                  <Text style={styles.planPillText}>{item.plan}</Text>
                </View>
              </View>

              <View style={styles.cardDivider} />

              <View style={styles.breakdownGrid}>
                <View style={styles.gridCol}>
                  <Text style={styles.gridLabel}>Referral Share</Text>
                  <Text style={[styles.gridValue, { color: "#635BFF", fontWeight: "700" }]}>
                    {item.share}
                  </Text>
                </View>
                <View style={styles.gridCol}>
                  <Text style={styles.gridLabel}>Last Payment</Text>
                  <Text style={styles.gridValue}>{item.lastPayment}</Text>
                  <Text style={styles.gridSub}>{item.lastPaymentDate}</Text>
                </View>
                <View style={styles.gridCol}>
                  <Text style={styles.gridLabel}>Next Renewal</Text>
                  <Text style={styles.gridValue}>{item.nextRenewal}</Text>
                  <Text style={styles.gridSub}>{item.nextRenewalDate}</Text>
                </View>
                <View style={styles.gridCol}>
                  <Text style={styles.gridLabel}>Total Lifetime</Text>
                  <Text style={[styles.gridValue, { color: "#10B981" }]}>
                    {item.lifetime}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* SUBSECTION 2: Transactions */}
      {activeSubSection === "Transactions" && (
        <View style={styles.subSectionContent}>
          {transactions.map((tx) => (
            <View key={tx.id} style={styles.txCard}>
              <View style={styles.txHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.txSalonName}>{tx.salonName}</Text>
                  <Text style={styles.txDate}>{tx.date} • {tx.note}</Text>
                </View>
                <View
                  style={[
                    styles.txStatusPill,
                    tx.status === "Paid" ? styles.txStatusPaid : styles.txStatusExpected,
                  ]}
                >
                  <Text
                    style={[
                      styles.txStatusText,
                      tx.status === "Paid"
                        ? styles.txStatusTextPaid
                        : styles.txStatusTextExpected,
                    ]}
                  >
                    {tx.status}
                  </Text>
                </View>
              </View>

              <View style={styles.cardDivider} />

              <View style={styles.txFooter}>
                <View style={styles.txAmountCol}>
                  <Text style={styles.txAmountLabel}>Gross Volume</Text>
                  <Text style={styles.txAmountVal}>{tx.grossAmount}</Text>
                </View>
                <View style={styles.txAmountCol}>
                  <Text style={styles.txAmountLabel}>Your Share</Text>
                  <Text style={[styles.txAmountVal, { color: "#635BFF", fontWeight: "700" }]}>
                    {tx.share}
                  </Text>
                </View>
                <View style={styles.txAmountCol}>
                  <Text style={styles.txAmountLabel}>Cumulative</Text>
                  <Text style={[styles.txAmountVal, { color: "#10B981" }]}>
                    {tx.lifetime}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 32,
  },
  kpiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 14,
  },
  kpiCard: {
    width: "48%",
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
  },
  kpiHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  kpiTitle: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    flex: 1,
    marginRight: 4,
  },
  kpiAmount: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 2,
  },
  kpiDesc: {
    fontSize: 10,
    opacity: 0.8,
  },
  payoutBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111827",
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  payoutBannerTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 2,
  },
  payoutBannerSubtitle: {
    color: "#9CA3AF",
    fontSize: 11,
  },
  requestPayoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#635BFF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 4,
  },
  requestPayoutBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  sectionTabsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
  },
  sectionTab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  sectionTabActive: {
    backgroundColor: "#EEECFF",
    borderColor: "#635BFF",
  },
  sectionTabText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
  },
  sectionTabTextActive: {
    color: "#635BFF",
    fontWeight: "700",
  },
  subSectionContent: {
    gap: 12,
  },
  breakdownCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  breakdownHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarWrap: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#EEECFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  breakdownName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
  },
  breakdownEmail: {
    fontSize: 11,
    color: "#6B7280",
  },
  planPill: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  planPillText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#4B5563",
  },
  cardDivider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginVertical: 10,
  },
  breakdownGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  gridCol: {
    alignItems: "center",
  },
  gridLabel: {
    fontSize: 9,
    color: "#9CA3AF",
    marginBottom: 2,
    textAlign: "center",
  },
  gridValue: {
    fontSize: 11,
    fontWeight: "600",
    color: "#1F2937",
    textAlign: "center",
  },
  gridSub: {
    fontSize: 9,
    color: "#9CA3AF",
    marginTop: 1,
  },
  txCard: {
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
  txHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  txSalonName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
  },
  txDate: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 2,
  },
  txStatusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  txStatusPaid: {
    backgroundColor: "#ECFDF5",
  },
  txStatusExpected: {
    backgroundColor: "#FFFBEB",
  },
  txStatusText: {
    fontSize: 11,
    fontWeight: "700",
  },
  txStatusTextPaid: {
    color: "#10B981",
  },
  txStatusTextExpected: {
    color: "#D97706",
  },
  txFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  txAmountCol: {
    alignItems: "center",
  },
  txAmountLabel: {
    fontSize: 10,
    color: "#9CA3AF",
    marginBottom: 2,
  },
  txAmountVal: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1F2937",
  },
});
