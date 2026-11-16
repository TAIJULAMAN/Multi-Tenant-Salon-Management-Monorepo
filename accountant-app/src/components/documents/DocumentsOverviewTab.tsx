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
  OVERVIEW_METRIC_CARDS,
  DOC_TYPE_DATA_MAP,
  NOTICES_DATA_MAP,
  CONTRACTS_DISTRIBUTION_DATA_MAP,
} from "@/data/documentsData";

interface DocumentsOverviewTabProps {
  onNavigateToTab: (tab: "Contracts" | "Notices" | "OwnerDocs") => void;
}

export default function DocumentsOverviewTab({ onNavigateToTab }: DocumentsOverviewTabProps) {
  const [docTypeFilter, setDocTypeFilter] = useState<"Daily" | "Weekly" | "Monthly">("Daily");
  const [noticesFilter, setNoticesFilter] = useState<"Daily" | "Weekly" | "Monthly">("Daily");
  const [contractsFilter, setContractsFilter] = useState<"Daily" | "Weekly" | "Monthly">("Daily");

  // Dropdown states
  const [docTypeDropdownOpen, setDocTypeDropdownOpen] = useState(false);
  const [noticesDropdownOpen, setNoticesDropdownOpen] = useState(false);
  const [contractsDropdownOpen, setContractsDropdownOpen] = useState(false);

  const filterOptions: ("Daily" | "Weekly" | "Monthly")[] = ["Daily", "Weekly", "Monthly"];

  const currentDocTypeData = DOC_TYPE_DATA_MAP[docTypeFilter] || DOC_TYPE_DATA_MAP.Daily;
  const currentNoticesData = NOTICES_DATA_MAP[noticesFilter] || NOTICES_DATA_MAP.Daily;
  const currentContractsData =
    CONTRACTS_DISTRIBUTION_DATA_MAP[contractsFilter] || CONTRACTS_DISTRIBUTION_DATA_MAP.Daily;

  const closeAllDropdowns = () => {
    if (docTypeDropdownOpen) setDocTypeDropdownOpen(false);
    if (noticesDropdownOpen) setNoticesDropdownOpen(false);
    if (contractsDropdownOpen) setContractsDropdownOpen(false);
  };

  return (
    <TouchableWithoutFeedback onPress={closeAllDropdowns}>
      <View style={styles.container}>
        {/* 1. Four Metric KPI Cards (2x2 Grid, Direct Card Link) */}
        <View style={styles.metricsGrid}>
          {OVERVIEW_METRIC_CARDS.map((card) => (
            <TouchableOpacity
              key={card.id}
              style={[styles.metricCard, { backgroundColor: card.bgColor }]}
              onPress={() => onNavigateToTab(card.targetTab as "Contracts" | "Notices" | "OwnerDocs")}
              activeOpacity={0.8}
            >
              {/* Icon and Title */}
              <View style={styles.metricTopRow}>
                <View style={[styles.iconBox, { backgroundColor: card.iconBg }]}>
                  <Ionicons name={card.icon as any} size={16} color="#FFFFFF" />
                </View>
                <Text style={styles.metricCardTitle} numberOfLines={1}>
                  {card.title}
                </Text>
              </View>

              {/* Big Metric Value & Navigation Hint */}
              <View style={styles.metricBottomRow}>
                <Text style={styles.metricCardValue}>{card.value}</Text>
                <View style={styles.arrowCircle}>
                  <Ionicons name="arrow-forward" size={12} color="#64748B" />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* 2. Document Type Distribution Donut Card */}
        <View style={[styles.chartCard, { zIndex: 1000 }]}>
          <View style={styles.chartHeaderRow}>
            <Text style={styles.chartTitle}>Document Type Distribution</Text>

            {/* Filter Dropdown */}
            <View style={styles.dropdownWrap}>
              <TouchableOpacity
                style={styles.filterBtn}
                onPress={() => {
                  setNoticesDropdownOpen(false);
                  setContractsDropdownOpen(false);
                  setDocTypeDropdownOpen(!docTypeDropdownOpen);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.filterBtnText}>{docTypeFilter}</Text>
                <Ionicons
                  name={docTypeDropdownOpen ? "chevron-up" : "chevron-down"}
                  size={13}
                  color="#64748B"
                />
              </TouchableOpacity>

              {docTypeDropdownOpen && (
                <View style={styles.popoverMenu}>
                  {filterOptions.map((opt) => (
                    <TouchableOpacity
                      key={opt}
                      style={[
                        styles.popoverItem,
                        docTypeFilter === opt && styles.popoverItemActive,
                      ]}
                      onPress={() => {
                        setDocTypeFilter(opt);
                        setDocTypeDropdownOpen(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.popoverItemText,
                          docTypeFilter === opt && styles.popoverItemTextActive,
                        ]}
                      >
                        {opt}
                      </Text>
                      {docTypeFilter === opt && (
                        <Ionicons name="checkmark" size={14} color="#635BFF" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* Donut Visualization Ring */}
          <View style={styles.donutContainer}>
            <View style={styles.donutOuterRing}>
              {/* 4 Multi-Color Quadrant Arcs */}
              <View style={[styles.donutQuadrant, styles.quadTopRight, { backgroundColor: "#FACC15" }]} />
              <View style={[styles.donutQuadrant, styles.quadBottomRight, { backgroundColor: "#22C55E" }]} />
              <View style={[styles.donutQuadrant, styles.quadBottomLeft, { backgroundColor: "#06B6D4" }]} />
              <View style={[styles.donutQuadrant, styles.quadTopLeft, { backgroundColor: "#8B5CF6" }]} />

              {/* Inner Cutout with Center Text */}
              <View style={styles.donutCenterCutout}>
                <Text style={styles.donutCenterValue}>{currentDocTypeData.total}</Text>
              </View>
            </View>
          </View>

          {/* Bottom Legend */}
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: "#FACC15" }]} />
              <Text style={styles.legendText}>Notices</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: "#22C55E" }]} />
              <Text style={styles.legendText}>Contracts</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: "#06B6D4" }]} />
              <Text style={styles.legendText}>Receipts</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: "#8B5CF6" }]} />
              <Text style={styles.legendText}>Others</Text>
            </View>
          </View>
        </View>

        {/* 3. Employee Notices Distribution Donut Card */}
        <View style={[styles.chartCard, { zIndex: 900 }]}>
          <View style={styles.chartHeaderRow}>
            <Text style={styles.chartTitle}>Employee Notices Distribution</Text>

            {/* Filter Dropdown */}
            <View style={styles.dropdownWrap}>
              <TouchableOpacity
                style={styles.filterBtn}
                onPress={() => {
                  setDocTypeDropdownOpen(false);
                  setContractsDropdownOpen(false);
                  setNoticesDropdownOpen(!noticesDropdownOpen);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.filterBtnText}>{noticesFilter}</Text>
                <Ionicons
                  name={noticesDropdownOpen ? "chevron-up" : "chevron-down"}
                  size={13}
                  color="#64748B"
                />
              </TouchableOpacity>

              {noticesDropdownOpen && (
                <View style={styles.popoverMenu}>
                  {filterOptions.map((opt) => (
                    <TouchableOpacity
                      key={opt}
                      style={[
                        styles.popoverItem,
                        noticesFilter === opt && styles.popoverItemActive,
                      ]}
                      onPress={() => {
                        setNoticesFilter(opt);
                        setNoticesDropdownOpen(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.popoverItemText,
                          noticesFilter === opt && styles.popoverItemTextActive,
                        ]}
                      >
                        {opt}
                      </Text>
                      {noticesFilter === opt && (
                        <Ionicons name="checkmark" size={14} color="#635BFF" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* Donut Visualization Ring (2 Segments) */}
          <View style={styles.donutContainer}>
            <View style={styles.donutOuterRing}>
              {/* Right: Unread (Yellow), Left: Read (Green) */}
              <View style={[styles.donutQuadrant, styles.quadTopRight, { backgroundColor: "#FACC15" }]} />
              <View style={[styles.donutQuadrant, styles.quadBottomRight, { backgroundColor: "#FACC15" }]} />
              <View style={[styles.donutQuadrant, styles.quadTopLeft, { backgroundColor: "#22C55E" }]} />
              <View style={[styles.donutQuadrant, styles.quadBottomLeft, { backgroundColor: "#22C55E" }]} />

              {/* Inner Cutout with Center Text */}
              <View style={styles.donutCenterCutout}>
                <Text style={styles.donutCenterValue}>{currentNoticesData.total}</Text>
              </View>
            </View>
          </View>

          {/* Bottom Legend */}
          <View style={[styles.legendRow, { justifyContent: "center", gap: 24 }]}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: "#FACC15" }]} />
              <Text style={styles.legendText}>Unread</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: "#22C55E" }]} />
              <Text style={styles.legendText}>Read</Text>
            </View>
          </View>
        </View>

        {/* 4. Contracts Distribution Bar Chart Card */}
        <View style={[styles.chartCard, { zIndex: 800 }]}>
          <View style={styles.chartHeaderRow}>
            <Text style={styles.chartTitle}>Contracts Distribution</Text>

            {/* Filter Dropdown */}
            <View style={styles.dropdownWrap}>
              <TouchableOpacity
                style={styles.filterBtn}
                onPress={() => {
                  setDocTypeDropdownOpen(false);
                  setNoticesDropdownOpen(false);
                  setContractsDropdownOpen(!contractsDropdownOpen);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.filterBtnText}>{contractsFilter}</Text>
                <Ionicons
                  name={contractsDropdownOpen ? "chevron-up" : "chevron-down"}
                  size={13}
                  color="#64748B"
                />
              </TouchableOpacity>

              {contractsDropdownOpen && (
                <View style={styles.popoverMenu}>
                  {filterOptions.map((opt) => (
                    <TouchableOpacity
                      key={opt}
                      style={[
                        styles.popoverItem,
                        contractsFilter === opt && styles.popoverItemActive,
                      ]}
                      onPress={() => {
                        setContractsFilter(opt);
                        setContractsDropdownOpen(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.popoverItemText,
                          contractsFilter === opt && styles.popoverItemTextActive,
                        ]}
                      >
                        {opt}
                      </Text>
                      {contractsFilter === opt && (
                        <Ionicons name="checkmark" size={14} color="#635BFF" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* Bar Chart Container */}
          <View style={styles.barChartWrapper}>
            {/* Y-Axis Ticks */}
            <View style={styles.yAxisCol}>
              {[35, 30, 25, 20, 15, 10, 5, 0].map((tick) => (
                <Text key={tick} style={styles.yAxisTickText}>
                  {contractsFilter === "Daily"
                    ? tick
                    : contractsFilter === "Weekly"
                    ? Math.round(tick * 2)
                    : Math.round(tick * 5.14)}
                </Text>
              ))}
            </View>

            {/* Bars Area with Background Tracks */}
            <View style={styles.barsArea}>
              {/* Horizontal Grid lines */}
              <View style={styles.gridLinesContainer}>
                {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <View key={i} style={styles.gridLine} />
                ))}
              </View>

              {/* 3 Grouped Pillar Bars */}
              <View style={styles.pillarsRow}>
                {/* 1. Active Contracts */}
                <View style={styles.pillarGroup}>
                  <View style={styles.pillarTrack}>
                    <View
                      style={[
                        styles.pillarFill,
                        {
                          height: `${Math.min(
                            100,
                            (currentContractsData.active / currentContractsData.max) * 100
                          )}%`,
                          backgroundColor: "#22C55E",
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.pillarLabel}>Active{"\n"}Contracts</Text>
                </View>

                {/* 2. Expiring Soon */}
                <View style={styles.pillarGroup}>
                  <View style={styles.pillarTrack}>
                    <View
                      style={[
                        styles.pillarFill,
                        {
                          height: `${Math.min(
                            100,
                            (currentContractsData.expiring / currentContractsData.max) * 100
                          )}%`,
                          backgroundColor: "#FACC15",
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.pillarLabel}>Expiring{"\n"}Soon</Text>
                </View>

                {/* 3. Expired */}
                <View style={styles.pillarGroup}>
                  <View style={styles.pillarTrack}>
                    <View
                      style={[
                        styles.pillarFill,
                        {
                          height: `${Math.min(
                            100,
                            (currentContractsData.expired / currentContractsData.max) * 100
                          )}%`,
                          backgroundColor: "#F43F5E",
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.pillarLabel}>Expired</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    paddingBottom: 32,
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
    minHeight: 110,
  },
  metricTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconBox: {
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
  },
  metricBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  metricCardValue: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1E293B",
  },
  arrowCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  chartCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
    gap: 16,
    position: "relative",
  },
  chartHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chartTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1E293B",
    flex: 1,
    marginRight: 8,
  },
  dropdownWrap: {
    position: "relative",
  },
  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 32,
    minWidth: 88,
    justifyContent: "space-between",
  },
  filterBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
  },
  popoverMenu: {
    position: "absolute",
    top: 36,
    right: 0,
    width: 110,
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
    zIndex: 99999,
  },
  popoverItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  popoverItemActive: {
    backgroundColor: "#F4F3FF",
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
  donutContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  donutOuterRing: {
    width: 160,
    height: 160,
    borderRadius: 80,
    position: "relative",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  donutQuadrant: {
    position: "absolute",
    width: 80,
    height: 80,
  },
  quadTopLeft: {
    top: 0,
    left: 0,
    borderTopLeftRadius: 80,
  },
  quadTopRight: {
    top: 0,
    right: 0,
    borderTopRightRadius: 80,
  },
  quadBottomRight: {
    bottom: 0,
    right: 0,
    borderBottomRightRadius: 80,
  },
  quadBottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomLeftRadius: 80,
  },
  donutCenterCutout: {
    width: 132,
    height: 132,
    borderRadius: 66,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  donutCenterValue: {
    fontSize: 26,
    fontWeight: "700",
    color: "#334155",
  },
  legendRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    gap: 8,
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
    fontWeight: "500",
    color: "#64748B",
  },
  barChartWrapper: {
    flexDirection: "row",
    height: 200,
    paddingTop: 8,
  },
  yAxisCol: {
    width: 28,
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingRight: 6,
    paddingBottom: 36,
  },
  yAxisTickText: {
    fontSize: 10,
    fontWeight: "500",
    color: "#94A3B8",
  },
  barsArea: {
    flex: 1,
    position: "relative",
  },
  gridLinesContainer: {
    position: "absolute",
    top: 0,
    bottom: 36,
    left: 0,
    right: 0,
    justifyContent: "space-between",
  },
  gridLine: {
    height: 1,
    backgroundColor: "#F1F5F9",
  },
  pillarsRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    paddingBottom: 36,
    zIndex: 2,
  },
  pillarGroup: {
    alignItems: "center",
    width: 54,
  },
  pillarTrack: {
    width: 44,
    height: 140,
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    overflow: "hidden",
    justifyContent: "flex-end",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  pillarFill: {
    width: "100%",
    borderRadius: 10,
  },
  pillarLabel: {
    position: "absolute",
    bottom: -32,
    fontSize: 10,
    fontWeight: "600",
    color: "#64748B",
    textAlign: "center",
    lineHeight: 12,
  },
});
