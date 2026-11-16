import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  PAYROLL_MONTHS,
  PAYROLL_BASE_BY_SALON,
  EXPENSE_CATEGORIES,
  EXPENSE_BUDGET_BY_SALON,
  ExpenseBudgetItem,
} from "@/data/dashboardData";
import ExportModal from "@/components/modal/ExportModal";

interface DashboardChartsProps {
  selectedSalon: string;
}

const Y_MAX = 60000;
const Y_TICKS = [60000, 45000, 30000, 15000, 0];

export default function DashboardCharts({ selectedSalon }: DashboardChartsProps) {
  // Payroll chart state
  const [payrollYear, setPayrollYear] = useState<"2026" | "2025" | "2024">("2025");
  const [activePayrollIndex, setActivePayrollIndex] = useState<number | null>(null);
  const [payrollYearModalOpen, setPayrollYearModalOpen] = useState(false);
  const [exportPayrollOpen, setExportPayrollOpen] = useState(false);

  // Expense vs Budget chart state
  const [expenseYear, setExpenseYear] = useState<"2026" | "2025" | "2024">("2025");
  const [activeExpenseIndex, setActiveExpenseIndex] = useState<number | null>(null);
  const [expenseYearModalOpen, setExpenseYearModalOpen] = useState(false);
  const [exportExpenseOpen, setExportExpenseOpen] = useState(false);

  // Payroll calculations
  const yearFactors: Record<string, number> = {
    "2026": 1.2,
    "2025": 1.0,
    "2024": 0.8,
  };

  const pFactor = yearFactors[payrollYear] ?? 1.0;
  const rawPayroll =
    PAYROLL_BASE_BY_SALON[selectedSalon] || PAYROLL_BASE_BY_SALON["All Salons"];
  const scaledPayroll = rawPayroll.map((v) => Math.round(v * pFactor));

  // Expense calculations
  const expenseYearFactors: Record<string, number> = {
    "2026": 1.15,
    "2025": 1.0,
    "2024": 0.85,
  };

  const eFactor = expenseYearFactors[expenseYear] ?? 1.0;
  const rawExpenseBudget =
    EXPENSE_BUDGET_BY_SALON[selectedSalon] || EXPENSE_BUDGET_BY_SALON["All Salons"];
  const scaledExpenseBudget: ExpenseBudgetItem[] = rawExpenseBudget.map((item) => ({
    category: item.category,
    budget: Math.round(item.budget * eFactor),
    expense: Math.round(item.expense * eFactor),
  }));

  return (
    <View style={styles.container}>
      {/* ─────────────────────────────────────────────────────────────
          1. PAYROLL OVER TIME (Monthly Payroll)
         ───────────────────────────────────────────────────────────── */}
      <View style={styles.card}>
        {/* Header with separate title and actions rows for comfortable spacing */}
        <View style={styles.cardHeader}>
          <View style={styles.titleWrap}>
            <Text style={styles.cardTitle}>Payroll Over Time</Text>
            <Text style={styles.cardSubtitle}>Last 12 Months</Text>
          </View>

          <View style={styles.headerActions}>
            {/* Year Selector Dropdown */}
            <TouchableOpacity
              style={styles.yearSelectButton}
              onPress={() => setPayrollYearModalOpen(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.yearSelectText}>{payrollYear}</Text>
              <Ionicons name="chevron-down" size={14} color="#64748B" />
            </TouchableOpacity>

            {/* Export Button */}
            <TouchableOpacity
              style={styles.exportButton}
              onPress={() => setExportPayrollOpen(true)}
              activeOpacity={0.7}
            >
              <Ionicons name="download-outline" size={14} color="#635BFF" />
              <Text style={styles.exportButtonText}>Export Data</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Chart Area */}
        <View style={styles.chartWrapper}>
          {/* Grid & Chart Canvas */}
          <View style={styles.canvasContainer}>
            {/* Y-Axis and Grid Lines */}
            <View style={styles.gridLayer}>
              {Y_TICKS.map((tick, idx) => (
                <View key={idx} style={styles.gridRow}>
                  <Text style={styles.yAxisLabel}>
                    {tick === 0 ? "0" : `${tick / 1000}k`}
                  </Text>
                  <View style={styles.gridLine} />
                </View>
              ))}
            </View>

            {/* Data Columns Layer */}
            <View style={styles.dataColsLayer}>
              {scaledPayroll.map((val, idx) => {
                const heightRatio = Math.min(Math.max(val / Y_MAX, 0), 1);
                const isActive = activePayrollIndex === idx;

                return (
                  <TouchableOpacity
                    key={idx}
                    style={styles.dataCol}
                    onPress={() => setActivePayrollIndex(isActive ? null : idx)}
                    activeOpacity={0.8}
                  >
                    {/* Stepped fill & line point */}
                    <View style={styles.pointTrack}>
                      <View
                        style={[
                          styles.areaSteppedFill,
                          {
                            height: `${heightRatio * 100}%`,
                            backgroundColor: isActive
                              ? "rgba(12, 166, 120, 0.25)"
                              : "rgba(12, 166, 120, 0.08)",
                          },
                        ]}
                      />
                      <View
                        style={[
                          styles.pointCircle,
                          {
                            bottom: `${Math.max(heightRatio * 100 - 3, 0)}%`,
                            backgroundColor: isActive ? "#0CA678" : "#FFFFFF",
                            borderColor: "#0CA678",
                            borderWidth: isActive ? 3 : 2,
                            transform: [{ scale: isActive ? 1.25 : 1.0 }],
                          },
                        ]}
                      />
                    </View>

                    {/* Month Label */}
                    <Text
                      style={[
                        styles.xAxisLabel,
                        isActive && styles.xAxisLabelActive,
                      ]}
                    >
                      {PAYROLL_MONTHS[idx]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </View>

      {/* ─────────────────────────────────────────────────────────────
          2. EXPENSE VS BUDGET
         ───────────────────────────────────────────────────────────── */}
      <View style={styles.card}>
        {/* Header with separate title and actions rows for comfortable spacing */}
        <View style={styles.cardHeader}>
          <View style={styles.titleWrap}>
            <Text style={styles.cardTitle}>Expense vs Budget</Text>
            <Text style={styles.cardSubtitle}>Last 12 Months</Text>
          </View>

          <View style={styles.headerActions}>
            {/* Year Selector Dropdown */}
            <TouchableOpacity
              style={styles.yearSelectButton}
              onPress={() => setExpenseYearModalOpen(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.yearSelectText}>{expenseYear}</Text>
              <Ionicons name="chevron-down" size={14} color="#64748B" />
            </TouchableOpacity>

            {/* Export Button */}
            <TouchableOpacity
              style={styles.exportButton}
              onPress={() => setExportExpenseOpen(true)}
              activeOpacity={0.7}
            >
              <Ionicons name="download-outline" size={14} color="#635BFF" />
              <Text style={styles.exportButtonText}>Export Data</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Chart Area */}
        <View style={styles.chartWrapper}>
          {/* Grid & Chart Canvas */}
          <View style={styles.canvasContainer}>
            {/* Y-Axis and Grid Lines */}
            <View style={styles.gridLayer}>
              {Y_TICKS.map((tick, idx) => (
                <View key={idx} style={styles.gridRow}>
                  <Text style={styles.yAxisLabel}>
                    {tick === 0 ? "0" : `${tick / 1000}k`}
                  </Text>
                  <View style={styles.gridLine} />
                </View>
              ))}
            </View>

            {/* Bars Layer */}
            <View style={styles.expenseColsLayer}>
              {scaledExpenseBudget.map((item, idx) => {
                const budgetHeight = Math.min(Math.max((item.budget / Y_MAX) * 100, 2), 100);
                const expenseHeight = Math.min(Math.max((item.expense / Y_MAX) * 100, 2), 100);
                const isSelected = activeExpenseIndex === idx;

                return (
                  <TouchableOpacity
                    key={idx}
                    style={styles.expenseCategoryCol}
                    onPress={() =>
                      setActiveExpenseIndex(activeExpenseIndex === idx ? null : idx)
                    }
                    activeOpacity={0.8}
                  >
                    {/* Dual Vertical Bars */}
                    <View style={styles.barsGroup}>
                      {/* Budget Bar */}
                      <View
                        style={[
                          styles.barItem,
                          {
                            height: `${budgetHeight}%`,
                            backgroundColor: isSelected ? "#4F46E5" : "#5C60F5",
                          },
                        ]}
                      />
                      {/* Expense Bar */}
                      <View
                        style={[
                          styles.barItem,
                          {
                            height: `${expenseHeight}%`,
                            backgroundColor: isSelected ? "#DB2777" : "#E64980",
                          },
                        ]}
                      />
                    </View>

                    {/* Category Label */}
                    <Text
                      style={[
                        styles.expenseCategoryLabel,
                        isSelected && styles.expenseCategoryLabelActive,
                      ]}
                      numberOfLines={1}
                    >
                      {item.category}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Legend */}
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: "#5C60F5" }]} />
              <Text style={styles.legendText}>Budget</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: "#E64980" }]} />
              <Text style={styles.legendText}>Expense</Text>
            </View>
          </View>
        </View>
      </View>

      {/* ─────────────────────────────────────────────────────────────
          Year Selector Modals
         ───────────────────────────────────────────────────────────── */}
      {/* Payroll Year Picker Modal */}
      <Modal
        visible={payrollYearModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setPayrollYearModalOpen(false)}
      >
        <TouchableWithoutFeedback onPress={() => setPayrollYearModalOpen(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.yearPickerCard}>
                <Text style={styles.yearPickerTitle}>Select Year</Text>
                {(["2026", "2025", "2024"] as const).map((yr) => (
                  <TouchableOpacity
                    key={yr}
                    style={[
                      styles.yearOption,
                      payrollYear === yr && styles.yearOptionActive,
                    ]}
                    onPress={() => {
                      setPayrollYear(yr);
                      setPayrollYearModalOpen(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.yearOptionText,
                        payrollYear === yr && styles.yearOptionTextActive,
                      ]}
                    >
                      {yr}
                    </Text>
                    {payrollYear === yr && (
                      <Ionicons name="checkmark" size={18} color="#635BFF" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Expense Year Picker Modal */}
      <Modal
        visible={expenseYearModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setExpenseYearModalOpen(false)}
      >
        <TouchableWithoutFeedback onPress={() => setExpenseYearModalOpen(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.yearPickerCard}>
                <Text style={styles.yearPickerTitle}>Select Year</Text>
                {(["2026", "2025", "2024"] as const).map((yr) => (
                  <TouchableOpacity
                    key={yr}
                    style={[
                      styles.yearOption,
                      expenseYear === yr && styles.yearOptionActive,
                    ]}
                    onPress={() => {
                      setExpenseYear(yr);
                      setExpenseYearModalOpen(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.yearOptionText,
                        expenseYear === yr && styles.yearOptionTextActive,
                      ]}
                    >
                      {yr}
                    </Text>
                    {expenseYear === yr && (
                      <Ionicons name="checkmark" size={18} color="#635BFF" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Export Modals */}
      <ExportModal
        isOpen={exportPayrollOpen}
        onClose={() => setExportPayrollOpen(false)}
        title="Payroll Over Time Analytics"
      />
      <ExportModal
        isOpen={exportExpenseOpen}
        onClose={() => setExportExpenseOpen(false)}
        title="Expense vs Budget Analytics"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    marginBottom: 16,
    gap: 12,
  },
  titleWrap: {
    gap: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
    letterSpacing: -0.2,
  },
  cardSubtitle: {
    fontSize: 12,
    fontWeight: "500",
    color: "#94A3B8",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  yearSelectButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: "#FFFFFF",
  },
  yearSelectText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#334155",
  },
  exportButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "#635BFF",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: "transparent",
  },
  exportButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#635BFF",
  },
  chartWrapper: {
    position: "relative",
    paddingTop: 10,
  },
  canvasContainer: {
    height: 180,
    position: "relative",
    justifyContent: "flex-end",
  },
  gridLayer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 24,
    justifyContent: "space-between",
  },
  gridRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 16,
  },
  yAxisLabel: {
    width: 32,
    fontSize: 10,
    fontWeight: "600",
    color: "#94A3B8",
    textAlign: "right",
    marginRight: 8,
  },
  gridLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#F1F5F9",
  },
  dataColsLayer: {
    position: "absolute",
    top: 0,
    left: 40,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dataCol: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "flex-end",
    position: "relative",
  },
  pointTrack: {
    width: "100%",
    height: 156,
    position: "relative",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  areaSteppedFill: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  pointCircle: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    zIndex: 2,
  },
  xAxisLabel: {
    fontSize: 9,
    fontWeight: "600",
    color: "#94A3B8",
    marginTop: 6,
    height: 18,
  },
  xAxisLabelActive: {
    color: "#334155",
    fontWeight: "700",
  },
  expenseColsLayer: {
    position: "absolute",
    top: 0,
    left: 40,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
  },
  expenseCategoryCol: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: 4,
  },
  barsGroup: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 4,
    height: 156,
  },
  barItem: {
    width: 10,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    minHeight: 4,
  },
  expenseCategoryLabel: {
    fontSize: 9,
    fontWeight: "600",
    color: "#94A3B8",
    marginTop: 6,
    height: 18,
    textAlign: "center",
  },
  expenseCategoryLabelActive: {
    color: "#334155",
    fontWeight: "700",
  },
  legendRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    marginTop: 12,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#64748B",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  yearPickerCard: {
    width: 220,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  yearPickerTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 12,
  },
  yearOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  yearOptionActive: {
    backgroundColor: "#F4F3FF",
  },
  yearOptionText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
  },
  yearOptionTextActive: {
    color: "#635BFF",
    fontWeight: "700",
  },
});
