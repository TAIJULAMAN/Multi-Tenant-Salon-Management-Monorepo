import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Svg, {
  Path,
  Defs,
  LinearGradient,
  Stop,
  Circle,
  G,
} from "react-native-svg";
import ExportReportModal from "./ExportReportModal";

const SCREEN_WIDTH = Dimensions.get("window").width;
const OUTER_MARGIN = 32; // 16 left + 16 right
const CARD_PADDING = 32; // 16 left + 16 right
const CHART_WIDTH = SCREEN_WIDTH - OUTER_MARGIN - CARD_PADDING;

// 1. REVENUE TREND CHART
export function RevenueTrendChart() {
  const [selectedPeriod, setSelectedPeriod] = useState<"Monthly" | "Weekly" | "Yearly">("Monthly");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [activePoint, setActivePoint] = useState<number | null>(7); // Aug default

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const values = [32, 35, 38, 38, 32, 33, 35, 41, 38, 45, 50, 55];
  const minVal = 20;
  const maxVal = 60;

  const height = 150;
  const stepX = CHART_WIDTH / (values.length - 1);

  // Generate SVG path points
  const points = values.map((val, i) => {
    const x = i * stepX;
    const y = height - ((val - minVal) / (maxVal - minVal)) * height;
    return { x, y, val, month: months[i] };
  });

  // Create smooth bezier curve path
  const linePath = points.reduce((acc, pt, i, arr) => {
    if (i === 0) return `M ${pt.x} ${pt.y}`;
    const prev = arr[i - 1];
    const cx = (prev.x + pt.x) / 2;
    return `${acc} C ${cx} ${prev.y}, ${cx} ${pt.y}, ${pt.x} ${pt.y}`;
  }, "");

  // Closed area path for gradient fill
  const areaPath = `${linePath} L ${CHART_WIDTH} ${height} L 0 ${height} Z`;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Revenue Trend</Text>
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

      {/* Value highlight banner */}
      {activePoint !== null && (
        <View style={styles.highlightBanner}>
          <Text style={styles.highlightMonth}>{points[activePoint].month}:</Text>
          <Text style={styles.highlightValue}>€ {points[activePoint].val}K</Text>
        </View>
      )}

      {/* SVG Line Chart */}
      <View style={styles.svgContainer}>
        <Svg width={CHART_WIDTH} height={height + 20}>
          <Defs>
            <LinearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#2DD4BF" stopOpacity="0.25" />
              <Stop offset="1" stopColor="#2DD4BF" stopOpacity="0.0" />
            </LinearGradient>
          </Defs>

          {/* Grid lines */}
          <Path d={`M 0 0 L ${CHART_WIDTH} 0`} stroke="#F1F5F9" strokeWidth="1" />
          <Path d={`M 0 ${height / 2} L ${CHART_WIDTH} ${height / 2}`} stroke="#F1F5F9" strokeWidth="1" />
          <Path d={`M 0 ${height} L ${CHART_WIDTH} ${height}`} stroke="#F1F5F9" strokeWidth="1" />

          {/* Gradient Fill */}
          <Path d={areaPath} fill="url(#revenueGrad)" />

          {/* Stroke Line */}
          <Path d={linePath} fill="none" stroke="#2DD4BF" strokeWidth="3" strokeLinecap="round" />

          {/* Data Points */}
          {points.map((pt, idx) => (
            <G key={idx}>
              <Circle
                cx={pt.x}
                cy={pt.y}
                r={activePoint === idx ? 6 : 3}
                fill={activePoint === idx ? "#2DD4BF" : "#FFFFFF"}
                stroke="#2DD4BF"
                strokeWidth={activePoint === idx ? 2.5 : 1.5}
                onPress={() => setActivePoint(idx)}
              />
            </G>
          ))}
        </Svg>

        {/* X-Axis Labels */}
        <View style={styles.xAxisRow}>
          {["Jan", "Mar", "May", "Jul", "Sep", "Nov"].map((lbl) => (
            <Text key={lbl} style={styles.axisLabel}>
              {lbl}
            </Text>
          ))}
        </View>
      </View>

      {/* Export Report Modal */}
      <ExportReportModal
        visible={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        defaultTitle="Revenue Trend Report"
      />
    </View>
  );
}

// 2. PEAK HOURS HEATMAP
export function PeakHoursHeatmap() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const hours = ["9a", "11a", "1p", "3p", "5p", "7p"];

  const heatmapData = [
    [2, 4, 3, 2, 5, 4], // Mon
    [1, 5, 4, 2, 6, 4], // Tue
    [3, 4, 4, 3, 5, 5], // Wed
    [2, 5, 5, 2, 6, 5], // Thu
    [3, 6, 5, 4, 8, 9], // Fri
    [6, 9, 8, 7, 8, 8], // Sat
    [5, 8, 7, 5, 6, 5], // Sun
  ];

  const getColor = (val: number) => {
    if (val <= 2) return "#F8FAFC";
    if (val <= 4) return "#E0E7FF";
    if (val <= 6) return "#A5B4FC";
    if (val <= 7) return "#818CF8";
    return "#635BFF"; // Peak
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Peak Hours Heatmap</Text>
          <Text style={styles.subtitle}>Average salon capacity</Text>
        </View>
        <TouchableOpacity
          onPress={() =>
            Alert.alert(
              "Peak Insight",
              "Fridays & Saturdays from 5p to 7p have the highest customer capacity (80-90%)."
            )
          }
          style={styles.infoBtn}
        >
          <Ionicons name="information-circle-outline" size={18} color="#635BFF" />
        </TouchableOpacity>
      </View>

      {/* Grid Container */}
      <View style={styles.heatmapGrid}>
        {/* Hours Header */}
        <View style={styles.heatmapHeaderRow}>
          <View style={styles.dayLabelBox} />
          {hours.map((h) => (
            <Text key={h} style={styles.hourLabel}>
              {h}
            </Text>
          ))}
        </View>

        {/* Day Rows */}
        {days.map((day, i) => (
          <View key={day} style={styles.heatmapRow}>
            <Text style={styles.dayLabel}>{day}</Text>
            {heatmapData[i].map((val, j) => (
              <View
                key={j}
                style={[
                  styles.heatmapCell,
                  { backgroundColor: getColor(val) },
                ]}
              />
            ))}
          </View>
        ))}
      </View>

      {/* Scale Legend */}
      <View style={styles.heatmapLegend}>
        <Text style={styles.legendText}>Quiet</Text>
        <View style={styles.legendBars}>
          <View style={[styles.legendBox, { backgroundColor: "#F8FAFC" }]} />
          <View style={[styles.legendBox, { backgroundColor: "#E0E7FF" }]} />
          <View style={[styles.legendBox, { backgroundColor: "#A5B4FC" }]} />
          <View style={[styles.legendBox, { backgroundColor: "#818CF8" }]} />
          <View style={[styles.legendBox, { backgroundColor: "#635BFF" }]} />
        </View>
        <Text style={styles.legendText}>Peak</Text>
      </View>
    </View>
  );
}

// 3. REVENUE BY CATEGORY BREAKDOWN
export function RevenueSplitChart() {
  const categories = [
    { label: "Hair Services", percent: 45, color: "#635BFF" },
    { label: "Nail Services", percent: 20, color: "#2DD4BF" },
    { label: "Spa & Massage", percent: 15, color: "#F8C209" },
    { label: "Retail Products", percent: 20, color: "#EC4899" },
  ];

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Revenue by Category</Text>
          <Text style={styles.subtitle}>Services vs Products breakdown</Text>
        </View>
      </View>

      {/* Multi-segment Bar representation */}
      <View style={styles.donutHeader}>
        <Text style={styles.donutTotal}>€ 42,000</Text>
        <Text style={styles.donutLabel}>Total Revenue This Month</Text>
      </View>

      <View style={styles.segmentedBar}>
        {categories.map((cat) => (
          <View
            key={cat.label}
            style={{
              flex: cat.percent,
              height: 12,
              backgroundColor: cat.color,
            }}
          />
        ))}
      </View>

      {/* Legend Grid */}
      <View style={styles.categoryGrid}>
        {categories.map((cat) => (
          <View key={cat.label} style={styles.categoryItem}>
            <View style={[styles.categoryDot, { backgroundColor: cat.color }]} />
            <View>
              <Text style={styles.categoryName}>{cat.label}</Text>
              <Text style={styles.categoryPercent}>{cat.percent}%</Text>
            </View>
          </View>
        ))}
      </View>
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
    marginBottom: 14,
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
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 30,
    paddingVertical: 4,
  },
  dropdownMenuItem: {
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  dropdownMenuItemActive: {
    backgroundColor: "#F1F5F9",
  },
  dropdownMenuText: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
  },
  dropdownMenuTextActive: {
    color: "#635BFF",
    fontFamily: "Manrope_700Bold",
  },
  exportBtn: {
    borderWidth: 1,
    borderColor: "#635BFF",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#FFFFFF",
  },
  exportBtnText: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  highlightBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F0FDFA",
    borderWidth: 1,
    borderColor: "#CCFBF1",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  highlightMonth: {
    fontSize: 11,
    fontFamily: "Manrope_600SemiBold",
    color: "#0D9488",
  },
  highlightValue: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#0F766E",
  },
  svgContainer: {
    marginTop: 6,
  },
  xAxisRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
    paddingHorizontal: 4,
  },
  axisLabel: {
    fontSize: 10,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
  },
  infoBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  heatmapGrid: {
    marginTop: 8,
    gap: 4,
  },
  heatmapHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  dayLabelBox: {
    width: 34,
  },
  hourLabel: {
    flex: 1,
    textAlign: "center",
    fontSize: 10,
    fontFamily: "Manrope_600SemiBold",
    color: "#94A3B8",
  },
  heatmapRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dayLabel: {
    width: 30,
    fontSize: 10,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  heatmapCell: {
    flex: 1,
    height: 18,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: "#E2E8F0",
  },
  heatmapLegend: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 6,
    marginTop: 12,
  },
  legendBars: {
    flexDirection: "row",
    gap: 3,
  },
  legendBox: {
    width: 12,
    height: 12,
    borderRadius: 3,
    borderWidth: 0.5,
    borderColor: "#E2E8F0",
  },
  legendText: {
    fontSize: 10,
    fontFamily: "Manrope_600SemiBold",
    color: "#94A3B8",
  },
  donutHeader: {
    alignItems: "center",
    marginVertical: 12,
  },
  donutTotal: {
    fontSize: 24,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  donutLabel: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    marginTop: 2,
  },
  segmentedBar: {
    flexDirection: "row",
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 16,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  categoryItem: {
    width: "47%",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  categoryDot: {
    width: 10,
    height: 10,
    borderRadius: 3,
  },
  categoryName: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
  },
  categoryPercent: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
});
