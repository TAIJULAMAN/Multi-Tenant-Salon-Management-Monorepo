import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  SALARIES_KPI_CONFIG,
  SALARY_PAYROLL_MONTHS,
  SALARY_EXPENDITURES_BY_YEAR,
  SALARY_DISTRIBUTION_BRACKETS,
  SALARY_DISTRIBUTION_COUNTS_BY_YEAR,
  EXPENDITURES_Y_MAX,
  EXPENDITURES_Y_TICKS,
  DISTRIBUTION_Y_MAX,
  DISTRIBUTION_Y_TICKS,
  RECENTLY_DECLINED_SALARIES,
} from "@/data/salariesData";
import ExportModal from "@/components/modal/ExportModal";

interface SalariesOverviewTabProps {
  onNavigateToTab: (tab: "Pending" | "History" | "Upload") => void;
}

const YEAR_OPTIONS = ["2026", "2025", "2024"] as const;

export default function SalariesOverviewTab({ onNavigateToTab }: SalariesOverviewTabProps) {
  // Monthly Salary Expenditures state
  const [expendituresYear, setExpendituresYear] = useState<"2026" | "2025" | "2024">("2025");
  const [activeExpIndex, setActiveExpIndex] = useState<number | null>(null);
  const [expDropdownOpen, setExpDropdownOpen] = useState(false);
  const [exportExpOpen, setExportExpOpen] = useState(false);

  // Salary Distribution state
  const [distYear, setDistYear] = useState<"2026" | "2025" | "2024">("2025");
  const [activeDistIndex, setActiveDistIndex] = useState<number | null>(null);
  const [distDropdownOpen, setDistDropdownOpen] = useState(false);
  const [exportDistOpen, setExportDistOpen] = useState(false);

  // Data lookups
  const expendituresData =
    SALARY_EXPENDITURES_BY_YEAR[expendituresYear] || SALARY_EXPENDITURES_BY_YEAR["2025"];
  const distributionData =
    SALARY_DISTRIBUTION_COUNTS_BY_YEAR[distYear] || SALARY_DISTRIBUTION_COUNTS_BY_YEAR["2025"];

  const closeDropdowns = () => {
    if (expDropdownOpen) setExpDropdownOpen(false);
    if (distDropdownOpen) setDistDropdownOpen(false);
  };

  return (
    <TouchableWithoutFeedback onPress={closeDropdowns}>
      <View style={styles.container}>
        {/* 4 KPI Cards */}
        <View style={styles.metricsGrid}>
          {SALARIES_KPI_CONFIG.map((card) => (
            <View
              key={card.id}
              style={[styles.metricCard, { backgroundColor: card.bgColor }]}
            >
              <View style={styles.metricHeaderRow}>
                <View style={[styles.metricIconWrap, { backgroundColor: card.iconBg }]}>
                  <Ionicons name={card.icon as any} size={16} color="#FFFFFF" />
                </View>
                <Text style={styles.metricTitle} numberOfLines={2}>
                  {card.title}
                </Text>
              </View>

              <View style={styles.metricValueWrap}>
                <Text style={styles.metricVal}>{card.value}</Text>
                <Text style={styles.metricSub}>{card.subtext}</Text>
                {card.change ? (
                  <Text style={styles.changeText}>{card.change}</Text>
                ) : null}
              </View>
            </View>
          ))}
        </View>

        {/* ─────────────────────────────────────────────────────────────
            1. MONTHLY SALARY EXPENDITURES (Line / Stepped-Area Chart)
           ───────────────────────────────────────────────────────────── */}
        <View style={[styles.card, expDropdownOpen && { zIndex: 1000 }]}>
          {/* Header with Title and Action Buttons in one row */}
          <View style={styles.cardHeader}>
            <View style={styles.titleWrap}>
              <Text style={styles.cardTitle}>Monthly Salary Expenditures</Text>
              <Text style={styles.cardSubtitle}>Last 12 Months</Text>
            </View>

            <View style={styles.headerActions}>
              {/* Year Dropdown with Anchored Popover Menu */}
              <View style={styles.dropdownWrap}>
                <TouchableOpacity
                  style={styles.yearSelectButton}
                  onPress={() => {
                    setDistDropdownOpen(false);
                    setExpDropdownOpen(!expDropdownOpen);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.yearSelectText}>{expendituresYear}</Text>
                  <Ionicons
                    name={expDropdownOpen ? "chevron-up" : "chevron-down"}
                    size={13}
                    color="#64748B"
                  />
                </TouchableOpacity>

                {/* Popover Dropdown below button */}
                {expDropdownOpen && (
                  <View style={styles.popoverMenu}>
                    {YEAR_OPTIONS.map((yr) => (
                      <TouchableOpacity
                        key={yr}
                        style={[
                          styles.popoverItem,
                          expendituresYear === yr && styles.popoverItemActive,
                        ]}
                        onPress={() => {
                          setExpendituresYear(yr);
                          setExpDropdownOpen(false);
                        }}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.popoverItemText,
                            expendituresYear === yr && styles.popoverItemTextActive,
                          ]}
                        >
                          {yr}
                        </Text>
                        {expendituresYear === yr && (
                          <Ionicons name="checkmark" size={14} color="#635BFF" />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Export Button */}
              <TouchableOpacity
                style={styles.exportButton}
                onPress={() => {
                  closeDropdowns();
                  setExportExpOpen(true);
                }}
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
                {EXPENDITURES_Y_TICKS.map((tick, idx) => (
                  <View key={idx} style={styles.gridRow}>
                    <Text style={styles.yAxisLabel}>
                      {tick === 0 ? "0" : `${(tick / 1000).toFixed(tick % 1000 !== 0 ? 1 : 0)}k`}
                    </Text>
                    <View style={styles.gridLine} />
                  </View>
                ))}
              </View>

              {/* Data Columns Layer */}
              <View style={styles.dataColsLayer}>
                {expendituresData.map((val, idx) => {
                  const heightRatio = Math.min(Math.max(val / EXPENDITURES_Y_MAX, 0), 1);
                  const isActive = activeExpIndex === idx;

                  return (
                    <TouchableOpacity
                      key={idx}
                      style={styles.dataCol}
                      onPress={() => setActiveExpIndex(isActive ? null : idx)}
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
                        {SALARY_PAYROLL_MONTHS[idx]}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>
        </View>

        {/* ─────────────────────────────────────────────────────────────
            2. SALARY DISTRIBUTION (Vertical Bar Chart)
           ───────────────────────────────────────────────────────────── */}
        <View style={[styles.card, distDropdownOpen && { zIndex: 1000 }]}>
          {/* Header with Title and Action Buttons in one row */}
          <View style={styles.cardHeader}>
            <View style={styles.titleWrap}>
              <Text style={styles.cardTitle}>Salary Distribution</Text>
              <Text style={styles.cardSubtitle}>Across All Staff Brackets</Text>
            </View>

            <View style={styles.headerActions}>
              {/* Year Dropdown with Anchored Popover Menu */}
              <View style={styles.dropdownWrap}>
                <TouchableOpacity
                  style={styles.yearSelectButton}
                  onPress={() => {
                    setExpDropdownOpen(false);
                    setDistDropdownOpen(!distDropdownOpen);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.yearSelectText}>{distYear}</Text>
                  <Ionicons
                    name={distDropdownOpen ? "chevron-up" : "chevron-down"}
                    size={13}
                    color="#64748B"
                  />
                </TouchableOpacity>

                {/* Popover Dropdown below button */}
                {distDropdownOpen && (
                  <View style={styles.popoverMenu}>
                    {YEAR_OPTIONS.map((yr) => (
                      <TouchableOpacity
                        key={yr}
                        style={[
                          styles.popoverItem,
                          distYear === yr && styles.popoverItemActive,
                        ]}
                        onPress={() => {
                          setDistYear(yr);
                          setDistDropdownOpen(false);
                        }}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.popoverItemText,
                            distYear === yr && styles.popoverItemTextActive,
                          ]}
                        >
                          {yr}
                        </Text>
                        {distYear === yr && (
                          <Ionicons name="checkmark" size={14} color="#635BFF" />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Export Button */}
              <TouchableOpacity
                style={styles.exportButton}
                onPress={() => {
                  closeDropdowns();
                  setExportDistOpen(true);
                }}
                activeOpacity={0.7}
              >
                <Ionicons name="download-outline" size={14} color="#635BFF" />
                <Text style={styles.exportButtonText}>Export Data</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Chart Area */}
          <View style={styles.chartWrapper}>
            <View style={styles.canvasContainer}>
              {/* Y-Axis and Grid Lines */}
              <View style={styles.gridLayer}>
                {DISTRIBUTION_Y_TICKS.map((tick, idx) => (
                  <View key={idx} style={styles.gridRow}>
                    <Text style={styles.yAxisLabel}>{tick}</Text>
                    <View style={styles.gridLine} />
                  </View>
                ))}
              </View>

              {/* Distribution Vertical Bars */}
              <View style={styles.dataColsLayer}>
                {distributionData.map((count, idx) => {
                  const heightRatio = Math.min(Math.max(count / DISTRIBUTION_Y_MAX, 0), 1);
                  const isActive = activeDistIndex === idx;

                  return (
                    <TouchableOpacity
                      key={idx}
                      style={styles.dataCol}
                      onPress={() => setActiveDistIndex(isActive ? null : idx)}
                      activeOpacity={0.8}
                    >
                      {/* Vertical Bar Fill */}
                      <View style={styles.barTrack}>
                        <View
                          style={[
                            styles.barFill,
                            {
                              height: `${Math.max(heightRatio * 100, 8)}%`,
                              backgroundColor: isActive ? "#4F46E5" : "#635BFF",
                              opacity: isActive ? 1 : 0.88,
                            },
                          ]}
                        />
                      </View>

                      {/* Bracket Label */}
                      <Text
                        style={[
                          styles.xAxisLabel,
                          isActive && styles.xAxisLabelActive,
                        ]}
                      >
                        {SALARY_DISTRIBUTION_BRACKETS[idx]}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>
        </View>

        {/* ─────────────────────────────────────────────────────────────
            3. RECENTLY DECLINED / REJECTED SALARIES
           ───────────────────────────────────────────────────────────── */}
        <View style={styles.card}>
          <View style={styles.declinedHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Declined by Salon</Text>
              <Text style={styles.cardSubtitle}>
                Salaries rejected by salon owner requiring accountant review & correction
              </Text>
            </View>
            <View style={styles.declinedBadge}>
              <Text style={styles.declinedBadgeText}>
                {RECENTLY_DECLINED_SALARIES.length} Needs Action
              </Text>
            </View>
          </View>

          <View style={styles.declinedList}>
            {RECENTLY_DECLINED_SALARIES.map((item) => (
              <View key={item.id} style={styles.declinedItem}>
                <View style={styles.declinedTop}>
                  <View style={styles.employeeInfo}>
                    <Text style={styles.employeeName}>{item.name}</Text>
                    <Text style={styles.employeeRole}>{item.salon} • {item.empId}</Text>
                  </View>
                  <Text style={styles.declinedAmount}>€{item.net.toLocaleString()}</Text>
                </View>

                <View style={styles.reasonBox}>
                  <Ionicons name="alert-circle-outline" size={14} color="#EF4444" />
                  <Text style={styles.reasonText}>
                    <Text style={{ fontWeight: "700" }}>Reason: </Text>
                    {item.reason}
                  </Text>
                </View>

                <View style={styles.declinedActions}>
                  <Text style={styles.declinedDate}>Declined: {item.declinedDate}</Text>
                  <TouchableOpacity
                    style={styles.fixUploadBtn}
                    onPress={() => onNavigateToTab("Upload")}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="refresh-outline" size={13} color="#635BFF" />
                    <Text style={styles.fixUploadBtnText}>Upload Corrected</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Export Modals */}
        <ExportModal
          isOpen={exportExpOpen}
          onClose={() => setExportExpOpen(false)}
          title="Monthly Salary Expenditures Analytics"
        />
        <ExportModal
          isOpen={exportDistOpen}
          onClose={() => setExportDistOpen(false)}
          title="Salary Distribution Analytics"
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    paddingBottom: 28,
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
    flexShrink: 0,
  },
  metricTitle: {
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
  changeText: {
    fontSize: 10,
    fontWeight: "500",
    color: "#64748B",
    marginTop: 1,
  },
  card: {
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
    position: "relative",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  titleWrap: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E293B",
  },
  cardSubtitle: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 1,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dropdownWrap: {
    position: "relative",
    zIndex: 1001,
  },
  yearSelectButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 8,
    height: 32,
  },
  yearSelectText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#334155",
  },
  popoverMenu: {
    position: "absolute",
    top: 36,
    left: 0,
    width: 96,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
    paddingVertical: 4,
    zIndex: 1002,
  },
  popoverItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 7,
    paddingHorizontal: 10,
  },
  popoverItemActive: {
    backgroundColor: "#EEECFF",
  },
  popoverItemText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#475569",
  },
  popoverItemTextActive: {
    color: "#635BFF",
    fontWeight: "700",
  },
  exportButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: "#635BFF",
    borderRadius: 8,
    paddingHorizontal: 8,
    height: 32,
    backgroundColor: "transparent",
  },
  exportButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#635BFF",
  },
  chartWrapper: {
    marginTop: 4,
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
  },
  yAxisLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#94A3B8",
    width: 32,
    textAlign: "right",
    marginRight: 6,
  },
  gridLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#F1F5F9",
  },
  dataColsLayer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingLeft: 38,
    height: "100%",
  },
  dataCol: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    height: "100%",
    paddingBottom: 2,
  },
  pointTrack: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
    position: "relative",
    marginBottom: 4,
  },
  areaSteppedFill: {
    width: "70%",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  pointCircle: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  barTrack: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 4,
  },
  barFill: {
    width: 14,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  xAxisLabel: {
    fontSize: 9,
    fontWeight: "600",
    color: "#94A3B8",
    textAlign: "center",
    height: 18,
    marginTop: 4,
  },
  xAxisLabelActive: {
    color: "#4F46E5",
    fontWeight: "800",
  },
  declinedHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
  },
  declinedBadge: {
    backgroundColor: "#FEF2F2",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#FEE2E2",
  },
  declinedBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#DC2626",
  },
  declinedList: {
    gap: 12,
  },
  declinedItem: {
    backgroundColor: "#FAFAFA",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  declinedTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  employeeInfo: {
    flex: 1,
  },
  employeeName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1F2937",
  },
  employeeRole: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 1,
  },
  declinedAmount: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1F2937",
  },
  reasonBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    padding: 8,
    borderRadius: 6,
    gap: 6,
    marginBottom: 8,
  },
  reasonText: {
    fontSize: 11,
    color: "#DC2626",
    flex: 1,
  },
  declinedActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  declinedDate: {
    fontSize: 11,
    color: "#9CA3AF",
  },
  fixUploadBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: "#EEECFF",
  },
  fixUploadBtnText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#635BFF",
  },
});
