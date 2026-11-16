import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Svg, {
  Rect,
  Line as SvgLine,
} from "react-native-svg";
import ExportReportModal from "./ExportReportModal";

const SCREEN_WIDTH = Dimensions.get("window").width;
const CARD_PADDING = 32; // 16 left + 16 right
const OUTER_MARGIN = 32; // 16 left + 16 right
const CHART_WIDTH = SCREEN_WIDTH - OUTER_MARGIN - CARD_PADDING;

export default function AppointmentsChart() {
  const [selectedPeriod, setSelectedPeriod] = useState<"Monthly" | "Weekly" | "Yearly">("Monthly");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [activeMonthIdx, setActiveMonthIdx] = useState<number | null>(2); // Default Mar (highest)

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const completedData = [70, 56, 80, 58, 28, 28, 28, 28, 28, 28, 28, 28];
  const cancelledData = [28, 36, 48, 26, 48, 48, 48, 48, 48, 48, 48, 48];

  const maxVal = 100;
  const chartHeight = 150;
  const groupWidth = CHART_WIDTH / months.length;
  const barWidth = Math.max(groupWidth * 0.32, 5);

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Appointments</Text>
          <Text style={styles.subtitle}>Last 12 Months</Text>
        </View>

        <View style={styles.actionsRow}>
          {/* Period Dropdown */}
          <View style={styles.dropdownWrapper}>
            <TouchableOpacity
              style={styles.dropdownBtn}
              onPress={() => setIsDropdownOpen(!isDropdownOpen)}
              activeOpacity={0.7}
            >
              <Text style={styles.dropdownBtnText}>{selectedPeriod}</Text>
              <Ionicons
                name={isDropdownOpen ? "chevron-up" : "chevron-down"}
                size={12}
                color="#64748B"
              />
            </TouchableOpacity>

            {isDropdownOpen && (
              <View style={styles.dropdownMenu}>
                {(["Monthly", "Weekly", "Yearly"] as const).map((p) => (
                  <TouchableOpacity
                    key={p}
                    style={[
                      styles.dropdownMenuItem,
                      selectedPeriod === p && styles.dropdownMenuItemActive,
                    ]}
                    onPress={() => {
                      setSelectedPeriod(p);
                      setIsDropdownOpen(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.dropdownMenuText,
                        selectedPeriod === p && styles.dropdownMenuTextActive,
                      ]}
                    >
                      {p}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Export Data Button */}
          <TouchableOpacity
            style={styles.exportBtn}
            onPress={() => setIsExportOpen(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.exportBtnText}>Export Data</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Interactive Tooltip Card */}
      {activeMonthIdx !== null && (
        <View style={styles.tooltipCard}>
          <View style={styles.tooltipHeader}>
            <Text style={styles.tooltipMonth}>
              {months[activeMonthIdx]} 2025
            </Text>
            <Text style={styles.tooltipTotal}>
              Total: {completedData[activeMonthIdx] + cancelledData[activeMonthIdx]}
            </Text>
          </View>
          <View style={styles.tooltipDetailsRow}>
            <View style={styles.tooltipBadgeItem}>
              <View style={[styles.tooltipDot, { backgroundColor: "#635BFF" }]} />
              <Text style={styles.tooltipLabel}>Completed:</Text>
              <Text style={styles.tooltipValueIndigo}>
                {completedData[activeMonthIdx]}
              </Text>
            </View>
            <View style={styles.tooltipBadgeItem}>
              <View style={[styles.tooltipDot, { backgroundColor: "#F43F5E" }]} />
              <Text style={styles.tooltipLabel}>Cancelled:</Text>
              <Text style={styles.tooltipValueRose}>
                {cancelledData[activeMonthIdx]}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* SVG Bar Chart */}
      <View style={styles.chartWrapper}>
        <Svg width={CHART_WIDTH} height={chartHeight + 10}>
          {/* Grid lines */}
          <SvgLine x1="0" y1="0" x2={CHART_WIDTH} y2="0" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4,4" />
          <SvgLine x1="0" y1={chartHeight * 0.33} x2={CHART_WIDTH} y2={chartHeight * 0.33} stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4,4" />
          <SvgLine x1="0" y1={chartHeight * 0.66} x2={CHART_WIDTH} y2={chartHeight * 0.66} stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4,4" />
          <SvgLine x1="0" y1={chartHeight} x2={CHART_WIDTH} y2={chartHeight} stroke="#F1F5F9" strokeWidth="1" />

          {/* Bars */}
          {months.map((m, idx) => {
            const groupX = idx * groupWidth;
            const completedH = (completedData[idx] / maxVal) * chartHeight;
            const cancelledH = (cancelledData[idx] / maxVal) * chartHeight;

            const x1 = groupX + (groupWidth - (barWidth * 2 + 2)) / 2;
            const x2 = x1 + barWidth + 2;

            const isSelected = activeMonthIdx === idx;

            return (
              <React.Fragment key={m}>
                {/* Completed Bar (Indigo) */}
                <Rect
                  x={x1}
                  y={chartHeight - completedH}
                  width={barWidth}
                  height={completedH}
                  fill="#635BFF"
                  rx={3}
                  opacity={isSelected ? 1 : 0.85}
                  onPress={() => setActiveMonthIdx(idx)}
                />
                {/* Cancelled Bar (Rose) */}
                <Rect
                  x={x2}
                  y={chartHeight - cancelledH}
                  width={barWidth}
                  height={cancelledH}
                  fill="#F43F5E"
                  rx={3}
                  opacity={isSelected ? 1 : 0.85}
                  onPress={() => setActiveMonthIdx(idx)}
                />
              </React.Fragment>
            );
          })}
        </Svg>

        {/* X-Axis labels */}
        <View style={styles.xAxisRow}>
          {["Jan", "Mar", "May", "Jul", "Sep", "Nov"].map((m) => (
            <Text key={m} style={styles.axisLabel}>
              {m}
            </Text>
          ))}
        </View>
      </View>

      {/* Legend */}
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#635BFF" }]} />
          <Text style={styles.legendText}>Completed</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#F43F5E" }]} />
          <Text style={styles.legendText}>Cancelled</Text>
        </View>
      </View>

      {/* Export Modal */}
      <ExportReportModal
        visible={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        defaultTitle="Appointments Report"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  subtitle: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dropdownWrapper: {
    position: "relative",
    zIndex: 20,
  },
  dropdownBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 6,
    backgroundColor: "#F8FAFC",
  },
  dropdownBtnText: {
    fontSize: 11,
    fontFamily: "Manrope_600SemiBold",
    color: "#1E293B",
  },
  dropdownMenu: {
    position: "absolute",
    top: 34,
    right: 0,
    width: 100,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 30,
    padding: 4,
  },
  dropdownMenuItem: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  dropdownMenuItemActive: {
    backgroundColor: "#EEF2FF",
  },
  dropdownMenuText: {
    fontSize: 11,
    fontFamily: "Manrope_600SemiBold",
    color: "#475569",
  },
  dropdownMenuTextActive: {
    color: "#635BFF",
    fontFamily: "Manrope_700Bold",
  },
  exportBtn: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 6,
    backgroundColor: "#FFFFFF",
  },
  exportBtnText: {
    fontSize: 11,
    fontFamily: "Manrope_600SemiBold",
    color: "#475569",
  },
  tooltipCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  tooltipHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  tooltipMonth: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  tooltipTotal: {
    fontSize: 10,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  tooltipDetailsRow: {
    flexDirection: "row",
    gap: 14,
  },
  tooltipBadgeItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  tooltipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  tooltipLabel: {
    fontSize: 10,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
  },
  tooltipValueIndigo: {
    fontSize: 10,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  tooltipValueRose: {
    fontSize: 10,
    fontFamily: "Manrope_700Bold",
    color: "#F43F5E",
  },
  chartWrapper: {
    position: "relative",
    marginTop: 4,
  },
  xAxisRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  axisLabel: {
    fontSize: 10,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
  },
  legendRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
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
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
  },
});
