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
  Path,
  Defs,
  LinearGradient,
  Stop,
  Circle,
  G,
  Line as SvgLine,
} from "react-native-svg";
import ExportReportModal from "./ExportReportModal";

const SCREEN_WIDTH = Dimensions.get("window").width;
const OUTER_MARGIN = 32; // 16 left + 16 right
const CARD_PADDING = 32; // 16 left + 16 right
const CHART_WIDTH = SCREEN_WIDTH - OUTER_MARGIN - CARD_PADDING;

export default function ClientsGrowthChart() {
  const [selectedPeriod, setSelectedPeriod] = useState<"Monthly" | "Weekly" | "Yearly">("Monthly");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [activePoint, setActivePoint] = useState<number | null>(7); // Default August

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  // Dashboard mock data
  const data1 = [260, 250, 190, 180, 175, 120, 95, 100, 140, 150, 140, 125];
  const data2 = [110, 120, 140, 130, 115, 115, 120, 140, 150, 140, 110, 95];

  const minVal = 50;
  const maxVal = 300;
  const chartHeight = 150;
  const stepX = CHART_WIDTH / (months.length - 1);

  // Compute points
  const points1 = data1.map((val, i) => {
    const x = i * stepX;
    const y = chartHeight - ((val - minVal) / (maxVal - minVal)) * chartHeight;
    return { x, y, val, month: months[i] };
  });

  const points2 = data2.map((val, i) => {
    const x = i * stepX;
    const y = chartHeight - ((val - minVal) / (maxVal - minVal)) * chartHeight;
    return { x, y, val, month: months[i] };
  });

  // Bezier curve helper
  const createSmoothPath = (pts: Array<{ x: number; y: number }>) => {
    return pts.reduce((acc, pt, i, arr) => {
      if (i === 0) return `M ${pt.x} ${pt.y}`;
      const prev = arr[i - 1];
      const cx = (prev.x + pt.x) / 2;
      return `${acc} C ${cx} ${prev.y}, ${cx} ${pt.y}, ${pt.x} ${pt.y}`;
    }, "");
  };

  const path1 = createSmoothPath(points1);
  const path2 = createSmoothPath(points2);

  const area1 = `${path1} L ${CHART_WIDTH} ${chartHeight} L 0 ${chartHeight} Z`;

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>New Clients</Text>
          <View style={styles.subRow}>
            <Text style={styles.subtitle}>Last 12 Months</Text>
            <View style={styles.growthBadge}>
              <Text style={styles.growthBadgeText}>+15%</Text>
            </View>
          </View>
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

      {/* Selected Month Tooltip Card */}
      {activePoint !== null && (
        <View style={styles.tooltipCard}>
          <Text style={styles.tooltipMonth}>{months[activePoint]}:</Text>
          <View style={styles.tooltipMetrics}>
            <View style={styles.metricPair}>
              <View style={[styles.dotSmall, { backgroundColor: "#635BFF" }]} />
              <Text style={styles.metricText}>Dataset 1: <Text style={styles.metricVal}>{data1[activePoint]}</Text></Text>
            </View>
            <View style={styles.metricPair}>
              <View style={[styles.dotSmall, { backgroundColor: "#2DD4BF" }]} />
              <Text style={styles.metricText}>Dataset 2: <Text style={styles.metricVal}>{data2[activePoint]}</Text></Text>
            </View>
          </View>
        </View>
      )}

      {/* SVG Multi-Line Chart */}
      <View style={styles.chartWrapper}>
        <Svg width={CHART_WIDTH} height={chartHeight + 20}>
          <Defs>
            <LinearGradient id="clientGrad1" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#635BFF" stopOpacity="0.18" />
              <Stop offset="1" stopColor="#635BFF" stopOpacity="0.0" />
            </LinearGradient>
          </Defs>

          {/* Horizontal grid lines */}
          <SvgLine x1="0" y1="0" x2={CHART_WIDTH} y2="0" stroke="#F1F5F9" strokeWidth="1" />
          <SvgLine x1="0" y1={chartHeight * 0.33} x2={CHART_WIDTH} y2={chartHeight * 0.33} stroke="#F1F5F9" strokeWidth="1" />
          <SvgLine x1="0" y1={chartHeight * 0.66} x2={CHART_WIDTH} y2={chartHeight * 0.66} stroke="#F1F5F9" strokeWidth="1" />
          <SvgLine x1="0" y1={chartHeight} x2={CHART_WIDTH} y2={chartHeight} stroke="#F1F5F9" strokeWidth="1" />

          {/* Fill area for Dataset 1 */}
          <Path d={area1} fill="url(#clientGrad1)" />

          {/* Line 1 - Dataset 1 */}
          <Path
            d={path1}
            fill="none"
            stroke="#635BFF"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Line 2 - Dataset 2 */}
          <Path
            d={path2}
            fill="none"
            stroke="#2DD4BF"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Data Points */}
          {points1.map((pt, idx) => (
            <G key={`d1-${idx}`}>
              <Circle
                cx={pt.x}
                cy={pt.y}
                r={activePoint === idx ? 5 : 2.5}
                fill={activePoint === idx ? "#635BFF" : "#FFFFFF"}
                stroke="#635BFF"
                strokeWidth={activePoint === idx ? 2.5 : 1.5}
                onPress={() => setActivePoint(idx)}
              />
            </G>
          ))}

          {points2.map((pt, idx) => (
            <G key={`d2-${idx}`}>
              <Circle
                cx={pt.x}
                cy={pt.y}
                r={activePoint === idx ? 5 : 2.5}
                fill={activePoint === idx ? "#2DD4BF" : "#FFFFFF"}
                stroke="#2DD4BF"
                strokeWidth={activePoint === idx ? 2.5 : 1.5}
                onPress={() => setActivePoint(idx)}
              />
            </G>
          ))}
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
          <View style={[styles.legendIndicator, { backgroundColor: "#635BFF" }]} />
          <Text style={styles.legendText}>Dataset 1</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendIndicator, { backgroundColor: "#2DD4BF" }]} />
          <Text style={styles.legendText}>Dataset 2</Text>
        </View>
      </View>

      {/* Export Modal */}
      <ExportReportModal
        visible={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        defaultTitle="Clients Growth Report"
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
  subRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
  },
  subtitle: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
  },
  growthBadge: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  growthBadgeText: {
    fontSize: 10,
    fontFamily: "Manrope_700Bold",
    color: "#10B981",
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
  tooltipCard: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
    alignSelf: "flex-start",
  },
  tooltipMonth: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  tooltipMetrics: {
    flexDirection: "row",
    gap: 10,
  },
  metricPair: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dotSmall: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  metricText: {
    fontSize: 10,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
  },
  metricVal: {
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  chartWrapper: {
    marginTop: 4,
  },
  xAxisRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
    marginTop: 6,
  },
  axisLabel: {
    fontSize: 10,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendIndicator: {
    width: 12,
    height: 3,
    borderRadius: 2,
  },
  legendText: {
    fontSize: 11,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
});
