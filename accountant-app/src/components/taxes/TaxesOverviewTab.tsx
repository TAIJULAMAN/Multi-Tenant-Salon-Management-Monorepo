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
  TAXES_KPI_CONFIG,
  TAX_OBLIGATIONS_DATA_BY_YEAR,
  AVERAGE_RECEIPT_TREND_DATA_BY_YEAR,
  TAX_OBLIGATIONS_Y_MAX,
  TAX_OBLIGATIONS_Y_TICKS,
  AVERAGE_RECEIPT_Y_MAX,
  AVERAGE_RECEIPT_Y_TICKS,
} from "@/data/taxesData";
import ExportModal from "@/components/modal/ExportModal";

interface TaxesOverviewTabProps {
  onNavigateToTab?: (tab: "Pending" | "History" | "Upload") => void;
}

export default function TaxesOverviewTab({ onNavigateToTab }: TaxesOverviewTabProps) {
  // Chart 1: Tax Obligations State
  const [obligationsYear, setObligationsYear] = useState<"2026" | "2025" | "2024">("2025");
  const [activeObligationIdx, setActiveObligationIdx] = useState<number | null>(null);
  const [obligationsYearModalOpen, setObligationsYearModalOpen] = useState(false);
  const [exportObligationsOpen, setExportObligationsOpen] = useState(false);

  // Chart 2: Average Receipt Trend State
  const [receiptYear, setReceiptYear] = useState<"2026" | "2025" | "2024">("2025");
  const [activeReceiptIdx, setActiveReceiptIdx] = useState<number | null>(null);
  const [receiptYearModalOpen, setReceiptYearModalOpen] = useState(false);
  const [exportReceiptOpen, setExportReceiptOpen] = useState(false);

  const yearOptions = ["2026", "2025", "2024"] as const;

  // Active Data for Tax Obligations
  const obligationsData =
    TAX_OBLIGATIONS_DATA_BY_YEAR[obligationsYear] ||
    TAX_OBLIGATIONS_DATA_BY_YEAR["2025"];

  // Active Data for Average Receipts
  const receiptsData =
    AVERAGE_RECEIPT_TREND_DATA_BY_YEAR[receiptYear] ||
    AVERAGE_RECEIPT_TREND_DATA_BY_YEAR["2025"];

  const totalRevenue = receiptsData.reduce((acc, curr) => acc + curr.revenue, 0);
  const totalTaxes = receiptsData.reduce((acc, curr) => acc + curr.taxes, 0);
  const avgTaxPercent =
    totalRevenue > 0 ? Math.round((totalTaxes / totalRevenue) * 100) : 0;

  return (
    <View style={styles.container}>
      {/* ─────────────────────────────────────────────────────────────
          1. Header Section: Title & Subtitle
         ───────────────────────────────────────────────────────────── */}
      <View style={styles.titleSection}>
        <Text style={styles.mainTitle}>Taxes & Compliance Overview</Text>
        <Text style={styles.mainSubtitle}>
          Overview of your financial approvals, budgets, and compliance warnings.
        </Text>
      </View>

      {/* ─────────────────────────────────────────────────────────────
          2. KPI Cards (2 per row Grid)
         ───────────────────────────────────────────────────────────── */}
      <View style={styles.metricsGrid}>
        {TAXES_KPI_CONFIG.map((card) => (
          <View
            key={card.id}
            style={[styles.metricCard, { backgroundColor: card.bgColor }]}
          >
            <View style={styles.metricHeaderRow}>
              <View style={[styles.metricIconWrap, { backgroundColor: card.iconBg }]}>
                <Ionicons name={card.icon as any} size={16} color="#FFFFFF" />
              </View>
              <Text style={styles.metricCardTitle} numberOfLines={2}>
                {card.title}
              </Text>
            </View>

            <View style={styles.metricValueWrap}>
              <Text style={styles.metricVal}>{card.value}</Text>
              <Text style={styles.metricSub}>{card.subtext}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* ─────────────────────────────────────────────────────────────
          3. Tax Obligations Over Time Chart Card
         ───────────────────────────────────────────────────────────── */}
      <View style={styles.chartCard}>
        <View style={styles.chartCardHeader}>
          <View style={styles.titleWrapper}>
            <Text style={styles.chartTitle}>Tax Obligations Over Time</Text>
            <Text style={styles.chartSubtitle}>Last 12 Months</Text>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.yearDropdownBtn}
              onPress={() => setObligationsYearModalOpen(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.yearDropdownText}>{obligationsYear}</Text>
              <Ionicons name="chevron-down" size={13} color="#64748B" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.exportButton}
              onPress={() => setExportObligationsOpen(true)}
              activeOpacity={0.7}
            >
              <Ionicons name="download-outline" size={14} color="#635BFF" />
              <Text style={styles.exportButtonText}>Export Data</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Chart Canvas */}
        <View style={styles.chartCanvasWrapper}>
          {/* Y-Axis and Grid Lines */}
          <View style={styles.gridContainer}>
            {TAX_OBLIGATIONS_Y_TICKS.map((tick, idx) => (
              <View key={idx} style={styles.gridRow}>
                <Text style={styles.yAxisLabel}>
                  {tick === 0 ? "0" : `${(tick / 1000).toFixed(tick % 1000 !== 0 ? 1 : 0)}k`}
                </Text>
                <View style={styles.gridLine} />
              </View>
            ))}
          </View>

          {/* Interactive Columns & Stepped Fill/Points */}
          <View style={styles.chartColsContainer}>
            {obligationsData.map((item, idx) => {
              const heightRatio = Math.min(Math.max(item.total / TAX_OBLIGATIONS_Y_MAX, 0), 1);
              const isActive = activeObligationIdx === idx;

              return (
                <TouchableOpacity
                  key={idx}
                  style={styles.dataCol}
                  onPress={() => setActiveObligationIdx(isActive ? null : idx)}
                  activeOpacity={0.8}
                >
                  <View style={styles.pointTrack}>
                    <View
                      style={[
                        styles.tealAreaFill,
                        {
                          height: `${heightRatio * 100}%`,
                          backgroundColor: isActive
                            ? "rgba(45, 212, 191, 0.35)"
                            : "rgba(45, 212, 191, 0.12)",
                        },
                      ]}
                    />
                    <View
                      style={[
                        styles.tealPointCircle,
                        {
                          bottom: `${Math.max(heightRatio * 100 - 3, 0)}%`,
                          backgroundColor: isActive ? "#14B8A6" : "#FFFFFF",
                          borderColor: "#14B8A6",
                          borderWidth: isActive ? 3 : 2,
                          transform: [{ scale: isActive ? 1.25 : 1.0 }],
                        },
                      ]}
                    />
                  </View>

                  <Text style={[styles.xAxisLabel, isActive && styles.xAxisLabelActive]}>
                    {item.month}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>

      {/* ─────────────────────────────────────────────────────────────
          4. Average Receipt Trend Chart Card
         ───────────────────────────────────────────────────────────── */}
      <View style={styles.chartCard}>
        <View style={styles.chartCardHeader}>
          <Text style={styles.chartTitle}>Average Receipt Trend</Text>

          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.yearDropdownBtn}
              onPress={() => setReceiptYearModalOpen(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.yearDropdownText}>{receiptYear}</Text>
              <Ionicons name="chevron-down" size={13} color="#64748B" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.exportButton}
              onPress={() => setExportReceiptOpen(true)}
              activeOpacity={0.7}
            >
              <Ionicons name="download-outline" size={14} color="#635BFF" />
              <Text style={styles.exportButtonText}>Export Data</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 3 Metrics Row (Revenue, Taxes, Avg. Tax %) */}
        <View style={styles.summaryStatsRow}>
          {/* Revenue */}
          <View style={styles.summaryStatItem}>
            <View style={[styles.summaryIconBox, { backgroundColor: "rgba(34, 197, 94, 0.12)" }]}>
              <Ionicons name="cash-outline" size={18} color="#22C55E" />
            </View>
            <View>
              <Text style={styles.summaryStatVal}>€ {totalRevenue.toLocaleString()}</Text>
              <Text style={styles.summaryStatLabel}>Revenue</Text>
            </View>
          </View>

          {/* Taxes */}
          <View style={styles.summaryStatItem}>
            <View style={[styles.summaryIconBox, { backgroundColor: "rgba(234, 179, 8, 0.14)" }]}>
              <Ionicons name="briefcase-outline" size={18} color="#EAB308" />
            </View>
            <View>
              <Text style={styles.summaryStatVal}>€ {totalTaxes.toLocaleString()}</Text>
              <Text style={styles.summaryStatLabel}>Taxes</Text>
            </View>
          </View>

          {/* Avg. Tax % */}
          <View style={styles.summaryStatItem}>
            <View style={[styles.summaryIconBox, { backgroundColor: "rgba(99, 91, 255, 0.12)" }]}>
              <Ionicons name="pie-chart-outline" size={18} color="#635BFF" />
            </View>
            <View>
              <Text style={styles.summaryStatVal}>{avgTaxPercent}%</Text>
              <Text style={styles.summaryStatLabel}>Avg. Tax %</Text>
            </View>
          </View>
        </View>

        {/* Dual Bar Chart Canvas */}
        <View style={styles.chartCanvasWrapper}>
          {/* Grid Lines */}
          <View style={styles.gridContainer}>
            {AVERAGE_RECEIPT_Y_TICKS.map((tick, idx) => (
              <View key={idx} style={styles.gridRow}>
                <Text style={styles.yAxisLabel}>
                  {tick === 0 ? "€0" : `€${tick / 1000}k`}
                </Text>
                <View style={styles.gridLine} />
              </View>
            ))}
          </View>

          {/* Dual Bars Per Month */}
          <View style={styles.chartColsContainer}>
            {receiptsData.map((item, idx) => {
              const revRatio = Math.min(Math.max(item.revenue / AVERAGE_RECEIPT_Y_MAX, 0), 1);
              const taxRatio = Math.min(Math.max(item.taxes / AVERAGE_RECEIPT_Y_MAX, 0), 1);
              const isActive = activeReceiptIdx === idx;

              return (
                <TouchableOpacity
                  key={idx}
                  style={styles.dataCol}
                  onPress={() => setActiveReceiptIdx(isActive ? null : idx)}
                  activeOpacity={0.8}
                >
                  <View style={styles.dualBarTrack}>
                    {/* Revenue Bar */}
                    <View
                      style={[
                        styles.barFill,
                        {
                          height: `${Math.max(8, revRatio * 100)}%`,
                          backgroundColor: "#22C55E",
                          marginRight: 2,
                        },
                      ]}
                    />
                    {/* Taxes Bar */}
                    <View
                      style={[
                        styles.barFill,
                        {
                          height: `${Math.max(6, taxRatio * 100)}%`,
                          backgroundColor: "#EAB308",
                        },
                      ]}
                    />
                  </View>

                  <Text style={[styles.xAxisLabel, isActive && styles.xAxisLabelActive]}>
                    {item.month}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Legend */}
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#22C55E" }]} />
            <Text style={styles.legendText}>Revenue</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#EAB308" }]} />
            <Text style={styles.legendText}>Taxes</Text>
          </View>
        </View>
      </View>

      {/* ─────────────────────────────────────────────────────────────
          Year Select Modals
         ───────────────────────────────────────────────────────────── */}
      {/* Year Modal for Obligations */}
      <Modal
        visible={obligationsYearModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setObligationsYearModalOpen(false)}
      >
        <TouchableWithoutFeedback onPress={() => setObligationsYearModalOpen(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.yearPickerCard}>
                <Text style={styles.yearPickerTitle}>Select Year</Text>
                {yearOptions.map((year) => (
                  <TouchableOpacity
                    key={year}
                    style={[
                      styles.yearOption,
                      obligationsYear === year && styles.yearOptionActive,
                    ]}
                    onPress={() => {
                      setObligationsYear(year);
                      setObligationsYearModalOpen(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.yearOptionText,
                        obligationsYear === year && styles.yearOptionTextActive,
                      ]}
                    >
                      {year}
                    </Text>
                    {obligationsYear === year && (
                      <Ionicons name="checkmark" size={18} color="#635BFF" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Year Modal for Receipts */}
      <Modal
        visible={receiptYearModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setReceiptYearModalOpen(false)}
      >
        <TouchableWithoutFeedback onPress={() => setReceiptYearModalOpen(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.yearPickerCard}>
                <Text style={styles.yearPickerTitle}>Select Year</Text>
                {yearOptions.map((year) => (
                  <TouchableOpacity
                    key={year}
                    style={[
                      styles.yearOption,
                      receiptYear === year && styles.yearOptionActive,
                    ]}
                    onPress={() => {
                      setReceiptYear(year);
                      setReceiptYearModalOpen(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.yearOptionText,
                        receiptYear === year && styles.yearOptionTextActive,
                      ]}
                    >
                      {year}
                    </Text>
                    {receiptYear === year && (
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
        isOpen={exportObligationsOpen}
        onClose={() => setExportObligationsOpen(false)}
        title={`Tax Obligations Data - ${obligationsYear}`}
      />
      <ExportModal
        isOpen={exportReceiptOpen}
        onClose={() => setExportReceiptOpen(false)}
        title={`Average Receipt Trend Data - ${receiptYear}`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    paddingBottom: 28,
  },
  titleSection: {
    marginBottom: 4,
  },
  mainTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1E293B",
    letterSpacing: -0.3,
  },
  mainSubtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 3,
    lineHeight: 17,
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
  },
  metricCard: {
    width: "48%",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.03)",
    justifyContent: "space-between",
    minHeight: 125,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  metricHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  metricIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  metricCardTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#334155",
    flex: 1,
    lineHeight: 14,
  },
  metricValueWrap: {
    marginTop: 12,
  },
  metricVal: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1E293B",
    letterSpacing: -0.5,
  },
  metricSub: {
    fontSize: 10,
    fontWeight: "600",
    color: "#475569",
    marginTop: 3,
  },
  chartCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    gap: 16,
  },
  chartCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: 10,
  },
  titleWrapper: {
    flex: 1,
  },
  chartTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
  },
  chartSubtitle: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 2,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  yearDropdownBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  yearDropdownText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#334155",
  },
  exportButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: "#635BFF",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "transparent",
  },
  exportButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#635BFF",
  },
  summaryStatsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 12,
    gap: 6,
  },
  summaryStatItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  summaryIconBox: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  summaryStatVal: {
    fontSize: 11,
    fontWeight: "700",
    color: "#1E293B",
  },
  summaryStatLabel: {
    fontSize: 9,
    fontWeight: "600",
    color: "#94A3B8",
    marginTop: 1,
  },
  chartCanvasWrapper: {
    height: 190,
    position: "relative",
    justifyContent: "flex-end",
  },
  gridContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 22,
    justifyContent: "space-between",
  },
  gridRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  yAxisLabel: {
    width: 34,
    fontSize: 10,
    color: "#94A3B8",
    fontWeight: "500",
    textAlign: "right",
    marginRight: 6,
  },
  gridLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#F1F5F9",
  },
  chartColsContainer: {
    position: "absolute",
    top: 0,
    left: 40,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  dataCol: {
    flex: 1,
    alignItems: "center",
    height: "100%",
    justifyContent: "flex-end",
  },
  pointTrack: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
    position: "relative",
    marginBottom: 4,
  },
  tealAreaFill: {
    width: "75%",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  tealPointCircle: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    alignSelf: "center",
  },
  dualBarTrack: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    marginBottom: 4,
  },
  barFill: {
    width: 5,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  xAxisLabel: {
    fontSize: 9,
    color: "#94A3B8",
    fontWeight: "500",
    height: 16,
    textAlign: "center",
  },
  xAxisLabelActive: {
    color: "#635BFF",
    fontWeight: "700",
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingTop: 4,
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
    fontSize: 11,
    fontWeight: "600",
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
    width: 240,
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
