import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  DAILY_SPENDING_TRENDS,
  SALON_EXPENSES_BREAKDOWN,
  PAYMENT_METHODS_DISTRIBUTION,
  MACRO_CATEGORIES_EXPENSES,
  CATEGORIES_EXPENSES_BAR,
  SUPPLIER_EXPENSES_DATA,
  LATEST_FINANCE_TRANSACTIONS,
} from "@/data/financesData";

interface FinancesOverviewTabProps {
  onNavigateToTab?: (tab: "Income" | "Expenses" | "Payments" | "Receipts") => void;
}

export default function FinancesOverviewTab({ onNavigateToTab }: FinancesOverviewTabProps) {
  const [showWarning, setShowWarning] = useState(true);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Dropdown filter selections
  const [paymentsMonth, setPaymentsMonth] = useState("February");
  const [spendingTimeframe, setSpendingTimeframe] = useState("Daily");
  const [salonTimeframe, setSalonTimeframe] = useState("Daily");
  const [paymentMethodTimeframe, setPaymentMethodTimeframe] = useState("Daily");
  const [macroTimeframe, setMacroTimeframe] = useState("Daily");
  const [categoryFilter, setCategoryFilter] = useState("Products");
  const [supplierTimeframe, setSupplierTimeframe] = useState("Daily");

  const handleExport = (type: "PDF" | "CSV") => {
    setIsExportOpen(false);
    Alert.alert(
      "Export Report",
      `${type} report for Budgeting & Finances has been generated and downloaded.`
    );
  };

  const handlePayableAction = (actionName: string) => {
    Alert.alert("Upcoming Payment", `${actionName} action executed.`);
  };

  return (
    <View style={styles.container}>
      {/* 1. Header with Title & Export Dropdown */}
      <View style={styles.overviewHeaderRow}>
        <Text style={styles.overviewMainTitle}>Overview</Text>

        <View style={{ position: "relative", zIndex: 50 }}>
          <TouchableOpacity
            style={styles.exportReportBtn}
            onPress={() => setIsExportOpen(!isExportOpen)}
            activeOpacity={0.8}
          >
            <Text style={styles.exportReportBtnText}>Export Report</Text>
            <Ionicons
              name={isExportOpen ? "chevron-up" : "chevron-down"}
              size={14}
              color="#635BFF"
              style={{ marginLeft: 4 }}
            />
          </TouchableOpacity>

          {/* Export Floating Popover */}
          {isExportOpen && (
            <View style={styles.exportDropdownMenu}>
              <TouchableOpacity
                style={styles.exportOptionItem}
                onPress={() => handleExport("PDF")}
                activeOpacity={0.7}
              >
                <Ionicons name="document-text-outline" size={15} color="#EF4444" style={{ marginRight: 8 }} />
                <Text style={styles.exportOptionText}>PDF</Text>
              </TouchableOpacity>
              <View style={styles.exportDivider} />
              <TouchableOpacity
                style={styles.exportOptionItem}
                onPress={() => handleExport("CSV")}
                activeOpacity={0.7}
              >
                <Ionicons name="grid-outline" size={15} color="#10B981" style={{ marginRight: 8 }} />
                <Text style={styles.exportOptionText}>CSV</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* 2. Warning Banner */}
      {showWarning && (
        <View style={styles.warningBanner}>
          <Ionicons name="warning" size={18} color="#D97706" style={{ marginRight: 8, marginTop: 1 }} />
          <Text style={styles.warningBannerText}>
            <Text style={{ fontWeight: "700" }}>Warning — </Text>
            At Salon &quot;Glamour Beauty&quot; you are about to exceed 85% of your budget.
          </Text>
          <TouchableOpacity onPress={() => setShowWarning(false)} style={{ padding: 4 }}>
            <Ionicons name="close" size={16} color="#B45309" />
          </TouchableOpacity>
        </View>
      )}

      {/* 3. 4 Top KPI Cards Grid */}
      <View style={styles.kpiGrid}>
        {/* Card 1: Total Monthly Expenses */}
        <View style={[styles.kpiCard, { backgroundColor: "#F5F3FF", borderColor: "#DDD6FE" }]}>
          <View style={styles.kpiTopRow}>
            <View style={[styles.kpiIconWrap, { backgroundColor: "#EDE9FE" }]}>
              <Ionicons name="document-text-outline" size={18} color="#7C3AED" />
            </View>
            <Text style={styles.kpiTitleText}>Total Monthly Expenses</Text>
          </View>
          <Text style={styles.kpiMainValue}>€ 23,850</Text>
          <View style={styles.kpiTrendRow}>
            <Ionicons name="arrow-up" size={12} color="#10B981" />
            <Text style={[styles.kpiTrendVal, { color: "#10B981" }]}>+12.5%</Text>
            <Text style={styles.kpiTrendSub}>from last month</Text>
          </View>
        </View>

        {/* Card 2: Highest Expense of the Month */}
        <View style={[styles.kpiCard, { backgroundColor: "#FDF2F8", borderColor: "#FBCFE8" }]}>
          <View style={styles.kpiTopRow}>
            <View style={[styles.kpiIconWrap, { backgroundColor: "#FCE7F3" }]}>
              <Ionicons name="trending-up-outline" size={18} color="#DB2777" />
            </View>
            <Text style={styles.kpiTitleText}>Highest Expense of the Month</Text>
          </View>
          <Text style={styles.kpiMainValue}>€ 5,535.52</Text>
          <Text style={styles.kpiSubCaption}>Products - HR - Glamour Beauty</Text>
        </View>

        {/* Card 3: Total Number of Transactions */}
        <View style={[styles.kpiCard, { backgroundColor: "#F0FDFA", borderColor: "#CCFBF1" }]}>
          <View style={styles.kpiTopRow}>
            <View style={[styles.kpiIconWrap, { backgroundColor: "#CCFBF1" }]}>
              <Ionicons name="card-outline" size={18} color="#0D9488" />
            </View>
            <Text style={styles.kpiTitleText}>Total Number of Transactions</Text>
          </View>
          <Text style={styles.kpiMainValue}>23</Text>
          <View style={styles.kpiTrendRow}>
            <Ionicons name="arrow-up" size={12} color="#10B981" />
            <Text style={[styles.kpiTrendVal, { color: "#10B981" }]}>+10.5%</Text>
            <Text style={styles.kpiTrendSub}>from last month</Text>
          </View>
        </View>

        {/* Card 4: Average Daily Spending */}
        <View style={[styles.kpiCard, { backgroundColor: "#FFFBEB", borderColor: "#FEF3C7" }]}>
          <View style={styles.kpiTopRow}>
            <View style={[styles.kpiIconWrap, { backgroundColor: "#FEF3C7" }]}>
              <Ionicons name="logo-euro" size={18} color="#D97706" />
            </View>
            <Text style={styles.kpiTitleText}>Average Daily Spending</Text>
          </View>
          <Text style={styles.kpiMainValue}>€ 435</Text>
          <View style={styles.kpiTrendRow}>
            <Ionicons name="arrow-down" size={12} color="#EF4444" />
            <Text style={[styles.kpiTrendVal, { color: "#EF4444" }]}>-10%</Text>
            <Text style={styles.kpiTrendSub}>from last month</Text>
          </View>
        </View>
      </View>

      {/* 4. Second Row: Total Monthly Expenses Donut & Upcoming Payments */}
      <View style={styles.sectionRow}>
        {/* Total Monthly Expenses (Donut) */}
        <View style={styles.dashboardCard}>
          <Text style={styles.cardHeaderTitle}>Total Monthly Expenses</Text>

          <View style={styles.donutWithFigureRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.donutBigFigure}>€ 23,850</Text>
              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                <Ionicons name="arrow-up" size={13} color="#10B981" style={{ marginRight: 2 }} />
                <Text style={styles.donutTrendText}>+12.5% (last month)</Text>
              </View>
            </View>

            {/* Stylized Donut Ring */}
            <View style={styles.donutContainer}>
              <View style={[styles.donutSegment, { borderColor: "#635BFF", transform: [{ rotate: "0deg" }] }]} />
              <View style={[styles.donutSegment, { borderColor: "#10B981", transform: [{ rotate: "65deg" }] }]} />
              <View style={[styles.donutSegment, { borderColor: "#F59E0B", transform: [{ rotate: "140deg" }] }]} />
              <View style={[styles.donutSegment, { borderColor: "#EC4899", transform: [{ rotate: "205deg" }] }]} />
              <View style={[styles.donutSegment, { borderColor: "#06B6D4", transform: [{ rotate: "270deg" }] }]} />
              <View style={styles.donutHole} />
            </View>
          </View>

          {/* Legend Items */}
          <View style={styles.legendWrapRow}>
            {MACRO_CATEGORIES_EXPENSES.map((cat, idx) => (
              <View key={idx} style={styles.legendChip}>
                <View style={[styles.legendChipDot, { backgroundColor: cat.color }]} />
                <Text style={styles.legendChipText}>{cat.category}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Upcoming Payments */}
        <View style={styles.dashboardCard}>
          <View style={styles.cardHeaderWithFilter}>
            <Text style={styles.cardHeaderTitle}>Upcoming Payments</Text>
            <TouchableOpacity
              style={styles.dropdownPill}
              onPress={() => Alert.alert("Month Filter", "Select Month")}
              activeOpacity={0.7}
            >
              <Text style={styles.dropdownPillText}>{paymentsMonth}</Text>
              <Ionicons name="chevron-down" size={12} color="#6B7280" style={{ marginLeft: 4 }} />
            </TouchableOpacity>
          </View>

          {/* 3 Payment Rows */}
          <View style={{ gap: 10, marginTop: 4 }}>
            {[1, 2, 3].map((num) => (
              <View key={num} style={styles.upcomingPaymentItem}>
                {/* Yellow left accent bar */}
                <View style={styles.yellowLeftBar} />

                <View style={styles.bellIconBox}>
                  <Ionicons name="notifications-outline" size={16} color="#D97706" />
                </View>

                <View style={{ flex: 1, marginHorizontal: 8 }}>
                  <Text style={styles.paymentVendorName}>Wella</Text>
                  <Text style={styles.paymentVendorSub}>Products • Glamour...</Text>
                </View>

                <View style={styles.paymentAmountBadge}>
                  <Text style={styles.paymentAmountBadgeText}>€ 435</Text>
                </View>

                <Text style={styles.paymentDateText}>03/02/2025</Text>

                <View style={styles.paymentActionsGroup}>
                  <TouchableOpacity
                    onPress={() => handlePayableAction("View Invoice")}
                    style={styles.paymentIconBtn}
                  >
                    <Ionicons name="eye-outline" size={15} color="#635BFF" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handlePayableAction("Mark Authorized")}
                    style={[styles.paymentIconBtn, { backgroundColor: "#DCFCE7" }]}
                  >
                    <Ionicons name="checkmark" size={14} color="#16A34A" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* 5. Third Row: Daily Spending Trends */}
      <View style={styles.dashboardCard}>
        <View style={styles.cardHeaderWithFilter}>
          <Text style={styles.cardHeaderTitle}>Daily Spending Trends</Text>
          <TouchableOpacity
            style={styles.dropdownPill}
            onPress={() => Alert.alert("Timeframe", "Select Timeframe")}
            activeOpacity={0.7}
          >
            <Text style={styles.dropdownPillText}>{spendingTimeframe}</Text>
            <Ionicons name="chevron-down" size={12} color="#6B7280" style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        </View>

        {/* Daily Bar Chart */}
        <View style={styles.barChartContainer}>
          {/* Y Axis */}
          <View style={styles.yAxisCol}>
            {["€ 7k", "€ 6k", "€ 5k", "€ 4k", "€ 3k", "€ 2k", "€ 1k", "€ 0"].map((y) => (
              <Text key={y} style={styles.yAxisLabel}>{y}</Text>
            ))}
          </View>

          {/* Bars Column */}
          <View style={styles.barsArea}>
            {/* Grid lines */}
            <View style={styles.gridLinesContainer}>
              {[1, 2, 3, 4, 5, 6, 7].map((line) => (
                <View key={line} style={styles.horizontalGridLine} />
              ))}
            </View>

            <View style={styles.barColumnsRow}>
              {DAILY_SPENDING_TRENDS.map((pt, idx) => {
                const isHighlight = pt.day === "Wed";
                const barHeightPct = (pt.amount / 7000) * 100;

                return (
                  <View key={idx} style={styles.singleBarCol}>
                    <View style={styles.barTrack}>
                      <View
                        style={[
                          styles.barFill,
                          {
                            height: `${barHeightPct}%`,
                            backgroundColor: isHighlight ? "#635BFF" : "#EEECFF",
                          },
                        ]}
                      />
                    </View>
                    <Text style={[styles.xAxisLabel, isHighlight && styles.xAxisLabelHighlight]}>
                      {pt.day}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </View>

      {/* 6. Fourth Row: Salon Expenses & Payment Methods */}
      <View style={styles.sectionRow}>
        {/* Salon Expenses */}
        <View style={styles.dashboardCard}>
          <View style={styles.cardHeaderWithFilter}>
            <Text style={styles.cardHeaderTitle}>Salon Expenses</Text>
            <TouchableOpacity
              style={styles.dropdownPill}
              onPress={() => Alert.alert("Timeframe", "Select Timeframe")}
              activeOpacity={0.7}
            >
              <Text style={styles.dropdownPillText}>{salonTimeframe}</Text>
              <Ionicons name="chevron-down" size={12} color="#6B7280" style={{ marginLeft: 4 }} />
            </TouchableOpacity>
          </View>

          <View style={styles.barChartContainerSmall}>
            <View style={styles.barColumnsRow}>
              {SALON_EXPENSES_BREAKDOWN.map((s, idx) => {
                const heightPct = (s.amount / 5000) * 100;
                return (
                  <View key={idx} style={styles.singleBarCol}>
                    <View style={styles.barTrackSmall}>
                      <View
                        style={[
                          styles.barFill,
                          {
                            height: `${heightPct}%`,
                            backgroundColor: "#635BFF",
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.xAxisLabelSmall}>{s.salonName}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        {/* Payment Methods (Donut with $597,468 Total) */}
        <View style={styles.dashboardCard}>
          <View style={styles.cardHeaderWithFilter}>
            <Text style={styles.cardHeaderTitle}>Payment Methods</Text>
            <TouchableOpacity
              style={styles.dropdownPill}
              onPress={() => Alert.alert("Timeframe", "Select Timeframe")}
              activeOpacity={0.7}
            >
              <Text style={styles.dropdownPillText}>{paymentMethodTimeframe}</Text>
              <Ionicons name="chevron-down" size={12} color="#6B7280" style={{ marginLeft: 4 }} />
            </TouchableOpacity>
          </View>

          <View style={styles.centeredDonutWrap}>
            <View style={styles.largeDonutContainer}>
              <View style={[styles.largeDonutSegment, { borderColor: "#8B5CF6", transform: [{ rotate: "0deg" }] }]} />
              <View style={[styles.largeDonutSegment, { borderColor: "#22C55E", transform: [{ rotate: "90deg" }] }]} />
              <View style={[styles.largeDonutSegment, { borderColor: "#3B82F6", transform: [{ rotate: "180deg" }] }]} />
              <View style={[styles.largeDonutSegment, { borderColor: "#F59E0B", transform: [{ rotate: "270deg" }] }]} />
              <View style={styles.largeDonutHole}>
                <Text style={styles.largeDonutTotalText}>$597,468</Text>
                <Text style={styles.largeDonutSubText}>Total</Text>
              </View>
            </View>
          </View>

          {/* Payment Method Legends */}
          <View style={styles.legendWrapRow}>
            {PAYMENT_METHODS_DISTRIBUTION.map((pm, idx) => (
              <View key={idx} style={styles.legendChip}>
                <View style={[styles.legendChipDot, { backgroundColor: pm.color }]} />
                <Text style={styles.legendChipText}>{pm.method}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* 7. Fifth Row: Expenses per Macro-categories & Expenses per Categories */}
      <View style={styles.sectionRow}>
        {/* Macro Categories Donut */}
        <View style={styles.dashboardCard}>
          <View style={styles.cardHeaderWithFilter}>
            <Text style={styles.cardHeaderTitle}>Expenses per Macro-categories</Text>
            <TouchableOpacity
              style={styles.dropdownPill}
              onPress={() => Alert.alert("Timeframe", "Select Timeframe")}
              activeOpacity={0.7}
            >
              <Text style={styles.dropdownPillText}>{macroTimeframe}</Text>
              <Ionicons name="chevron-down" size={12} color="#6B7280" style={{ marginLeft: 4 }} />
            </TouchableOpacity>
          </View>

          <View style={styles.centeredDonutWrap}>
            <View style={styles.donutContainer}>
              <View style={[styles.donutSegment, { borderColor: "#635BFF", transform: [{ rotate: "0deg" }] }]} />
              <View style={[styles.donutSegment, { borderColor: "#10B981", transform: [{ rotate: "60deg" }] }]} />
              <View style={[styles.donutSegment, { borderColor: "#F59E0B", transform: [{ rotate: "120deg" }] }]} />
              <View style={[styles.donutSegment, { borderColor: "#EC4899", transform: [{ rotate: "180deg" }] }]} />
              <View style={[styles.donutSegment, { borderColor: "#8B5CF6", transform: [{ rotate: "240deg" }] }]} />
              <View style={[styles.donutSegment, { borderColor: "#06B6D4", transform: [{ rotate: "300deg" }] }]} />
              <View style={styles.donutHole} />
            </View>
          </View>

          {/* Legends */}
          <View style={styles.legendWrapRow}>
            {MACRO_CATEGORIES_EXPENSES.map((cat, idx) => (
              <View key={idx} style={styles.legendChip}>
                <View style={[styles.legendChipDot, { backgroundColor: cat.color }]} />
                <Text style={styles.legendChipText}>{cat.category}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Expenses per Categories */}
        <View style={styles.dashboardCard}>
          <View style={styles.cardHeaderWithFilter}>
            <Text style={styles.cardHeaderTitle}>Expenses per Categories</Text>
            <TouchableOpacity
              style={styles.dropdownPill}
              onPress={() => Alert.alert("Category Filter", "Select Category")}
              activeOpacity={0.7}
            >
              <Text style={styles.dropdownPillText}>{categoryFilter}</Text>
              <Ionicons name="chevron-down" size={12} color="#6B7280" style={{ marginLeft: 4 }} />
            </TouchableOpacity>
          </View>

          <View style={styles.barChartContainerSmall}>
            <View style={styles.yAxisColSmall}>
              {["1.4k", "1.2k", "1.0k", "0.8k", "0.6k", "0.4k", "0.2k", "0.0k"].map((y) => (
                <Text key={y} style={styles.yAxisLabelSmall}>{y}</Text>
              ))}
            </View>

            <View style={styles.barsArea}>
              <View style={styles.barColumnsRow}>
                {CATEGORIES_EXPENSES_BAR.map((cat, idx) => {
                  const heightPct = (cat.amount / 1400) * 100;
                  return (
                    <View key={idx} style={styles.singleBarCol}>
                      <View style={styles.barTrackSmall}>
                        <View
                          style={[
                            styles.barFill,
                            {
                              height: `${heightPct}%`,
                              backgroundColor: "#635BFF",
                            },
                          ]}
                        />
                      </View>
                      <Text style={styles.xAxisLabelSmall}>{cat.category}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* 8. Sixth Row: Expenses per Supplier */}
      <View style={styles.dashboardCard}>
        <View style={styles.cardHeaderWithFilter}>
          <Text style={styles.cardHeaderTitle}>Expenses per Supplier</Text>
          <TouchableOpacity
            style={styles.dropdownPill}
            onPress={() => Alert.alert("Timeframe", "Select Timeframe")}
            activeOpacity={0.7}
          >
            <Text style={styles.dropdownPillText}>{supplierTimeframe}</Text>
            <Ionicons name="chevron-down" size={12} color="#6B7280" style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        </View>

        <View style={styles.barChartContainer}>
          <View style={styles.yAxisCol}>
            {["€ 2k", "€ 1.8k", "€ 1.6k", "€ 1.4k", "€ 1.2k", "€ 1k", "€ 0.8k", "€ 0.6k", "€ 0.4k", "€ 0.2k", "€ 0k"].map((y) => (
              <Text key={y} style={styles.yAxisLabel}>{y}</Text>
            ))}
          </View>

          <View style={styles.barsArea}>
            <View style={styles.barColumnsRow}>
              {SUPPLIER_EXPENSES_DATA.map((sp, idx) => {
                const heightPct = (sp.amount / 2000) * 100;
                return (
                  <View key={idx} style={styles.singleBarCol}>
                    <View style={styles.barTrack}>
                      <View
                        style={[
                          styles.barFill,
                          {
                            height: `${heightPct}%`,
                            backgroundColor: "#635BFF",
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.xAxisLabelSmall}>{sp.supplier}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </View>

      {/* 9. Seventh Row: Latest Transactions */}
      <View style={styles.dashboardCard}>
        <View style={styles.cardHeaderWithFilter}>
          <Text style={styles.cardHeaderTitle}>Latest Transactions</Text>
          <Text style={styles.transactionCountText}>{LATEST_FINANCE_TRANSACTIONS.length} transactions</Text>
        </View>

        {/* Transaction Cards List */}
        <View style={styles.transactionCardList}>
          {LATEST_FINANCE_TRANSACTIONS.map((tx) => {
            const macroBg =
              tx.macroCategory === "Internet"
                ? "#ECFEFF"
                : tx.macroCategory === "HR"
                ? "#F5F3FF"
                : tx.macroCategory === "Consumables"
                ? "#EFF6FF"
                : "#EEECFF";

            const macroText =
              tx.macroCategory === "Internet"
                ? "#0891B2"
                : tx.macroCategory === "HR"
                ? "#7C3AED"
                : tx.macroCategory === "Consumables"
                ? "#2563EB"
                : "#635BFF";

            return (
              <View key={tx.id} style={styles.transactionCard}>
                {/* Header: Avatar, Salon Name, Date and Cost */}
                <View style={styles.txCardHeader}>
                  <View style={styles.txSalonInfo}>
                    <View style={styles.txAvatarBox}>
                      <Text style={{ fontSize: 16 }}>{tx.avatarEmoji}</Text>
                    </View>
                    <View>
                      <Text style={styles.txSalonName}>{tx.salon}</Text>
                      <Text style={styles.txDate}>{tx.date}</Text>
                    </View>
                  </View>
                  <Text style={styles.txCost}>{tx.cost}</Text>
                </View>

                {/* Supplier Row */}
                <View style={styles.txSupplierRow}>
                  <Text style={styles.txSupplierLabel}>Supplier:</Text>
                  <Text style={styles.txSupplierName}>{tx.supplier}</Text>
                </View>

                {/* Badges: Macro, Category, Payment */}
                <View style={styles.txBadgesRow}>
                  <View style={[styles.macroBadge, { backgroundColor: macroBg }]}>
                    <Text style={[styles.macroBadgeText, { color: macroText }]}>
                      {tx.macroCategory}
                    </Text>
                  </View>

                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryBadgeText}>{tx.category}</Text>
                  </View>

                  <View
                    style={[
                      styles.paymentMethodBadge,
                      {
                        backgroundColor:
                          tx.paymentMethod === "Cash" ? "#DCFCE7" : "#EFF6FF",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.paymentMethodBadgeText,
                        {
                          color:
                            tx.paymentMethod === "Cash" ? "#16A34A" : "#2563EB",
                        },
                      ]}
                    >
                      {tx.paymentMethod}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    paddingBottom: 40,
  },
  overviewHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  overviewMainTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
  },
  exportReportBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  exportReportBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#374151",
  },
  exportDropdownMenu: {
    position: "absolute",
    top: 38,
    right: 0,
    width: 120,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 99,
  },
  exportOptionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  exportOptionText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
  },
  exportDivider: {
    height: 1,
    backgroundColor: "#F3F4F6",
  },
  warningBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF9C3",
    borderWidth: 1,
    borderColor: "#FDE047",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  warningBannerText: {
    flex: 1,
    fontSize: 12,
    color: "#854D0E",
    lineHeight: 18,
  },
  kpiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
  },
  kpiCard: {
    width: "48.5%",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
  },
  kpiTopRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  kpiIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  kpiTitleText: {
    flex: 1,
    fontSize: 11,
    fontWeight: "700",
    color: "#374151",
  },
  kpiMainValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 4,
  },
  kpiTrendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  kpiTrendVal: {
    fontSize: 11,
    fontWeight: "700",
  },
  kpiTrendSub: {
    fontSize: 10,
    color: "#6B7280",
  },
  kpiSubCaption: {
    fontSize: 10,
    color: "#6B7280",
    fontWeight: "500",
  },
  sectionRow: {
    gap: 16,
  },
  dashboardCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  cardHeaderTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
  cardHeaderWithFilter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  dropdownPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  dropdownPillText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#4B5563",
  },
  donutWithFigureRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 14,
  },
  donutBigFigure: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
  },
  donutTrendText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#10B981",
  },
  donutContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 12,
    borderColor: "#EEECFF",
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  donutSegment: {
    position: "absolute",
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 12,
    borderColor: "transparent",
    borderTopColor: "#635BFF",
  },
  donutHole: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: "#FFFFFF",
  },
  centeredDonutWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 14,
  },
  largeDonutContainer: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 16,
    borderColor: "#F3F4F6",
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  largeDonutSegment: {
    position: "absolute",
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 16,
    borderColor: "transparent",
    borderTopColor: "#635BFF",
  },
  largeDonutHole: {
    width: 98,
    height: 98,
    borderRadius: 49,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  largeDonutTotalText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
  },
  largeDonutSubText: {
    fontSize: 10,
    color: "#6B7280",
  },
  legendWrapRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  legendChip: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 6,
  },
  legendChipDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  legendChipText: {
    fontSize: 10,
    color: "#4B5563",
    fontWeight: "500",
  },
  upcomingPaymentItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    position: "relative",
    overflow: "hidden",
  },
  yellowLeftBar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: "#F59E0B",
  },
  bellIconBox: {
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: "#FEF3C7",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 4,
  },
  paymentVendorName: {
    fontSize: 12,
    fontWeight: "700",
    color: "#111827",
  },
  paymentVendorSub: {
    fontSize: 10,
    color: "#6B7280",
  },
  paymentAmountBadge: {
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 8,
  },
  paymentAmountBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#DC2626",
  },
  paymentDateText: {
    fontSize: 10,
    color: "#6B7280",
    marginRight: 8,
  },
  paymentActionsGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  paymentIconBtn: {
    padding: 5,
    borderRadius: 6,
    backgroundColor: "#EEECFF",
  },
  barChartContainer: {
    flexDirection: "row",
    height: 190,
    marginTop: 10,
  },
  barChartContainerSmall: {
    flexDirection: "row",
    height: 150,
    marginTop: 8,
  },
  yAxisCol: {
    height: 150,
    justifyContent: "space-between",
    paddingRight: 8,
    width: 45,
  },
  yAxisColSmall: {
    height: 110,
    justifyContent: "space-between",
    paddingRight: 6,
    width: 35,
  },
  yAxisLabel: {
    fontSize: 9,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  yAxisLabelSmall: {
    fontSize: 8,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  barsArea: {
    flex: 1,
    height: "100%",
    position: "relative",
  },
  gridLinesContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 150,
    justifyContent: "space-between",
  },
  horizontalGridLine: {
    height: 1,
    backgroundColor: "#F3F4F6",
  },
  barColumnsRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
  },
  singleBarCol: {
    alignItems: "center",
    flex: 1,
    height: "100%",
    justifyContent: "flex-end",
  },
  barTrack: {
    width: 14,
    height: 150,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  barTrackSmall: {
    width: 12,
    height: 110,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  barFill: {
    width: "100%",
    borderRadius: 4,
  },
  xAxisLabel: {
    fontSize: 10,
    color: "#6B7280",
    marginTop: 6,
    height: 16,
    textAlign: "center",
  },
  xAxisLabelHighlight: {
    color: "#635BFF",
    fontWeight: "700",
  },
  xAxisLabelSmall: {
    fontSize: 9,
    color: "#6B7280",
    marginTop: 4,
    height: 16,
    textAlign: "center",
  },
  transactionCountText: {
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "600",
  },
  transactionCardList: {
    gap: 10,
  },
  transactionCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  txCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  txSalonInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  txAvatarBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  txSalonName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
  },
  txDate: {
    fontSize: 10,
    color: "#6B7280",
    fontWeight: "500",
    marginTop: 1,
  },
  txCost: {
    fontSize: 14,
    fontWeight: "800",
    color: "#111827",
  },
  txSupplierRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 6,
  },
  txSupplierLabel: {
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "500",
  },
  txSupplierName: {
    fontSize: 11,
    fontWeight: "600",
    color: "#374151",
  },
  txBadgesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    alignItems: "center",
  },
  macroBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  macroBadgeText: {
    fontSize: 10,
    fontWeight: "700",
  },
  categoryBadge: {
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#10B981",
  },
  paymentMethodBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  paymentMethodBadgeText: {
    fontSize: 10,
    fontWeight: "700",
  },
});
