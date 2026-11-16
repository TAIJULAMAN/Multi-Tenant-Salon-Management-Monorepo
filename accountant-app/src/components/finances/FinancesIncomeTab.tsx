import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  LayoutChangeEvent,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@expo/ui/community/datetime-picker";
import CustomModal from "@/components/ui/CustomModal";
import CustomButton from "@/components/ui/CustomButton";

const SCREEN_WIDTH = Dimensions.get("window").width;

// Filter Options
const DATE_OPTIONS = ["All", "04 Oct 2025", "Today", "This Week", "This Month", "This Year", "Custom Date..."];
const EMPLOYEE_OPTIONS = ["All", "Maria R.", "Sofia B.", "Lucia M.", "Elena P.", "Clara S."];
const SERVICE_OPTIONS = [
  "All",
  "Service 1",
  "Service 2",
  "Service 3",
  "Service 4",
  "Service 5",
  "Service 6",
  "Service 7",
];
const PAYMENT_METHOD_OPTIONS = ["All", "Cash", "Credit Card", "Online Payment", "Card Terminal"];

// 5 Cashier Closure Records from Reference Mockup
interface ClosureRow {
  id: string;
  date: string;
  taxClosure: number;
  platformReceipts: number;
  difference: number;
  status: "Regular" | "Irregular";
}

const CLOSURE_RECORDS: ClosureRow[] = [
  {
    id: "cl-1",
    date: "04 Oct 2025",
    taxClosure: 278,
    platformReceipts: 278,
    difference: 0,
    status: "Regular",
  },
  {
    id: "cl-2",
    date: "04 Oct 2025",
    taxClosure: 278,
    platformReceipts: 278,
    difference: 0,
    status: "Regular",
  },
  {
    id: "cl-3",
    date: "04 Oct 2025",
    taxClosure: 278,
    platformReceipts: 278,
    difference: 0,
    status: "Regular",
  },
  {
    id: "cl-4",
    date: "04 Oct 2025",
    taxClosure: 278,
    platformReceipts: 278,
    difference: 0,
    status: "Regular",
  },
  {
    id: "cl-5",
    date: "04 Oct 2025",
    taxClosure: 278,
    platformReceipts: 278,
    difference: 25.0,
    status: "Irregular",
  },
];

// Employee Performance Data
const EMPLOYEE_BARS = [
  { name: "Maria R.", orders: 230, max: 400 },
  { name: "Sofia B.", orders: 160, max: 400 },
  { name: "Lucia M.", orders: 280, max: 400 },
  { name: "Elena P.", orders: 180, max: 400 },
  { name: "Clara S.", orders: 50, max: 400 },
];

// 12 Months Trend Data (values in €)
const MONTHS_TREND_DATA = [
  { month: "Jan", val: 1500 },
  { month: "Feb", val: 1850 },
  { month: "Mar", val: 2050 },
  { month: "Apr", val: 2200 },
  { month: "May", val: 2500 },
  { month: "Jun", val: 3000 },
  { month: "Jul", val: 3500 }, // Peak Jul
  { month: "Aug", val: 3100 },
  { month: "Sep", val: 2900 },
  { month: "Oct", val: 2750 },
  { month: "Nov", val: 2550 },
  { month: "Dec", val: 2350 },
];

// Services Legend Colors
const SERVICE_LEGEND = [
  { name: "Service 1", color: "#3B82F6", rotate: "0deg" },
  { name: "Service 2", color: "#1E3A8A", rotate: "50deg" },
  { name: "Service 3", color: "#F59E0B", rotate: "105deg" },
  { name: "Service 4", color: "#10B981", rotate: "160deg" },
  { name: "Service 5", color: "#EC4899", rotate: "215deg" },
  { name: "Service-6", color: "#059669", rotate: "270deg" },
  { name: "Service 7", color: "#1E293B", rotate: "315deg" },
];

type ActiveFilterKey = "date" | "employee" | "service" | "method" | null;
type BottomSubTab = "closures" | "receipts" | "payments";

export default function FinancesIncomeTab() {
  // Filter States
  const [selectedDate, setSelectedDate] = useState("All");
  const [selectedEmployee, setSelectedEmployee] = useState("All");
  const [selectedService, setSelectedService] = useState("All");
  const [selectedMethod, setSelectedMethod] = useState("All");

  // In-place dropdown open state
  const [activePicker, setActivePicker] = useState<ActiveFilterKey>(null);

  // Expo UI DatePicker state
  const [showNativeDatePicker, setShowNativeDatePicker] = useState(false);
  const [pickerDate, setPickerDate] = useState<Date>(new Date(2025, 9, 4));

  // Dynamic width for chart canvas
  const [trendAreaWidth, setTrendAreaWidth] = useState(
    Math.max(240, SCREEN_WIDTH - 32 - 32 - 42)
  );

  // Bottom Sub-tabs
  const [bottomTab, setBottomTab] = useState<BottomSubTab>("closures");
  const [selectedClosure, setSelectedClosure] = useState<ClosureRow | null>(null);

  // Detail Modal States
  const [showRevenueModal, setShowRevenueModal] = useState(false);
  const [showAverageModal, setShowAverageModal] = useState(false);

  const hasActiveFilters =
    selectedDate !== "All" ||
    selectedEmployee !== "All" ||
    selectedService !== "All" ||
    selectedMethod !== "All";

  const handleResetFilters = () => {
    setSelectedDate("All");
    setSelectedEmployee("All");
    setSelectedService("All");
    setSelectedMethod("All");
    setActivePicker(null);
    setShowNativeDatePicker(false);
  };

  const FILTER_CONFIGS: {
    id: ActiveFilterKey;
    label: string;
    value: string;
    options: string[];
    onChange: (val: string) => void;
  }[] = [
    {
      id: "date",
      label: "Date",
      value: selectedDate,
      options: DATE_OPTIONS,
      onChange: (val) => {
        if (val === "Custom Date...") {
          setActivePicker(null);
          setShowNativeDatePicker(true);
        } else {
          setSelectedDate(val);
          setActivePicker(null);
        }
      },
    },
    {
      id: "employee",
      label: "Employee",
      value: selectedEmployee,
      options: EMPLOYEE_OPTIONS,
      onChange: (val) => {
        setSelectedEmployee(val);
        setActivePicker(null);
      },
    },
    {
      id: "service",
      label: "Services",
      value: selectedService,
      options: SERVICE_OPTIONS,
      onChange: (val) => {
        setSelectedService(val);
        setActivePicker(null);
      },
    },
    {
      id: "method",
      label: "Payment Method",
      value: selectedMethod,
      options: PAYMENT_METHOD_OPTIONS,
      onChange: (val) => {
        setSelectedMethod(val);
        setActivePicker(null);
      },
    },
  ];

  // Trend Chart coordinate calculations
  const chartHeight = 120;
  const minVal = 1300;
  const maxVal = 3700;
  const padX = 8;
  const usableWidth = Math.max(100, trendAreaWidth - padX * 2);
  const stepX = usableWidth / (MONTHS_TREND_DATA.length - 1);

  const chartPoints = MONTHS_TREND_DATA.map((item, i) => {
    const x = padX + i * stepX;
    const yPct = (item.val - minVal) / (maxVal - minVal);
    const y = chartHeight - yPct * chartHeight;
    return { ...item, x, y, yPct };
  });

  // Calculate connected line segments between points
  const lineSegments = chartPoints.slice(0, -1).map((p1, i) => {
    const p2 = chartPoints[i + 1];
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    const midX = (p1.x + p2.x) / 2;
    const midY = (p1.y + p2.y) / 2;
    return {
      id: `${p1.month}-${p2.month}`,
      length,
      angle,
      midX,
      midY,
    };
  });

  return (
    <View style={styles.container}>
      {/* Invisible backdrop when dropdown is open to allow easy tap-away dismissal */}
      {activePicker !== null && (
        <TouchableOpacity
          style={styles.dropdownBackdrop}
          onPress={() => setActivePicker(null)}
          activeOpacity={1}
        />
      )}

      {/* 1. Header Card with Title & Filters in 2x2 Grid */}
      <View
        style={[
          styles.card,
          styles.filtersCard,
          activePicker !== null && styles.filtersCardActive,
        ]}
      >
        <View style={styles.headerTopRow}>
          <Text style={styles.headerTitle}>Income & Revenue</Text>
          {hasActiveFilters && (
            <TouchableOpacity onPress={handleResetFilters} style={styles.resetBtn}>
              <Ionicons name="refresh" size={11} color="#635BFF" style={{ marginRight: 3 }} />
              <Text style={styles.resetBtnText}>Reset</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.filtersGrid}>
          {FILTER_CONFIGS.map((filter, index) => {
            const isOpen = activePicker === filter.id;
            const rowNumber = Math.floor(index / 2);
            // Elevated zIndex for the active row
            const zIndex = isOpen ? 1000 : 20 - rowNumber * 5;
            const isCustom = filter.value !== "All";

            return (
              <View key={filter.id} style={[styles.filterCol, { zIndex }]}>
                <Text style={styles.filterLabel}>{filter.label}</Text>
                <TouchableOpacity
                  style={[
                    styles.filterInputBox,
                    isCustom && styles.filterInputBoxActive,
                    isOpen && styles.filterInputBoxOpen,
                  ]}
                  onPress={() => setActivePicker(isOpen ? null : filter.id)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.filterInputText,
                      isCustom && styles.filterInputTextActive,
                    ]}
                    numberOfLines={1}
                  >
                    {filter.value}
                  </Text>
                  <Ionicons
                    name={isOpen ? "chevron-up" : "chevron-down"}
                    size={14}
                    color={isCustom || isOpen ? "#635BFF" : "#6B7280"}
                  />
                </TouchableOpacity>

                {/* Dropdown Menu directly below the filter box (Clean border, no shadow) */}
                {isOpen && (
                  <View style={styles.dropdownContainer}>
                    <ScrollView
                      nestedScrollEnabled={true}
                      style={{ maxHeight: 180 }}
                      showsVerticalScrollIndicator={true}
                    >
                      {filter.options.map((opt, optIdx) => {
                        const isSelected = opt === filter.value;
                        return (
                          <TouchableOpacity
                            key={opt}
                            style={[
                              styles.dropdownOptionItem,
                              isSelected && styles.dropdownOptionItemActive,
                              optIdx === filter.options.length - 1 && { borderBottomWidth: 0 },
                            ]}
                            onPress={() => filter.onChange(opt)}
                            activeOpacity={0.7}
                          >
                            <Text
                              style={[
                                styles.dropdownOptionText,
                                isSelected && styles.dropdownOptionTextActive,
                              ]}
                              numberOfLines={1}
                            >
                              {opt}
                            </Text>
                            {isSelected && (
                              <Ionicons name="checkmark" size={14} color="#635BFF" />
                            )}
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Native DateTimePicker */}
        {showNativeDatePicker && (
          <DateTimePicker
            value={pickerDate}
            mode="date"
            onValueChange={(_event, date) => {
              setShowNativeDatePicker(false);
              if (date) {
                setPickerDate(date);
                const formatted = `${String(date.getDate()).padStart(2, "0")} Oct ${date.getFullYear()}`;
                setSelectedDate(formatted);
              }
            }}
            onDismiss={() => setShowNativeDatePicker(false)}
          />
        )}
      </View>

      {/* 2. Top Metric KPI Cards (4 Cards in 2x2 Grid) */}
      <View style={styles.kpiGrid}>
        {/* Card 1: Total Accounted Revenue */}
        <TouchableOpacity
          style={[styles.kpiCard, { backgroundColor: "#F0FDF4", borderColor: "#DCFCE7" }]}
          onPress={() => setShowRevenueModal(true)}
          activeOpacity={0.85}
        >
          <View>
            <View style={styles.kpiTopRow}>
              <View style={[styles.kpiIconWrap, { backgroundColor: "#DCFCE7" }]}>
                <Text style={{ fontSize: 13, fontWeight: "800", color: "#16A34A" }}>€</Text>
              </View>
              <Text style={styles.kpiTitle} numberOfLines={1}>Total Accounted Revenue</Text>
            </View>
            <Text style={styles.kpiValue}>€ 2,502.00</Text>
          </View>
          <Text style={styles.kpiSub}>Entries recorded with printed receipt</Text>
        </TouchableOpacity>

        {/* Card 2: Average Receipt */}
        <TouchableOpacity
          style={[styles.kpiCard, { backgroundColor: "#FAF5FF", borderColor: "#F3E8FF" }]}
          onPress={() => setShowAverageModal(true)}
          activeOpacity={0.85}
        >
          <View>
            <View style={styles.kpiTopRow}>
              <View style={[styles.kpiIconWrap, { backgroundColor: "#EDE9FE" }]}>
                <Ionicons name="trending-up" size={14} color="#7C3AED" />
              </View>
              <Text style={styles.kpiTitle} numberOfLines={1}>Average Receipt</Text>
            </View>
            <Text style={styles.kpiValue}>€ 278.00</Text>
          </View>
          <Text style={styles.kpiSub}>Click for detailed analysis</Text>
        </TouchableOpacity>

        {/* Card 3: Unique Customers */}
        <View style={[styles.kpiCard, { backgroundColor: "#FEFCE8", borderColor: "#FEF08A" }]}>
          <View>
            <View style={styles.kpiTopRow}>
              <View style={[styles.kpiIconWrap, { backgroundColor: "#FEF08A" }]}>
                <Ionicons name="people" size={14} color="#D97706" />
              </View>
              <Text style={styles.kpiTitle} numberOfLines={1}>Unique Customers</Text>
            </View>
            <Text style={styles.kpiValue}>3</Text>
          </View>
          <Text style={styles.kpiSub}>In the selected period</Text>
        </View>

        {/* Card 4: Services & Products */}
        <View style={[styles.kpiCard, { backgroundColor: "#FFF1F2", borderColor: "#FFE4E6" }]}>
          <View style={styles.kpiTopRow}>
            <View style={[styles.kpiIconWrap, { backgroundColor: "#FFE4E6" }]}>
              <Ionicons name="receipt-outline" size={14} color="#E11D48" />
            </View>
            <Text style={styles.kpiTitle} numberOfLines={1}>Services & Products</Text>
          </View>

          <View style={styles.spWrap}>
            <View style={styles.spRow}>
              <Text style={styles.spLabel}>Services</Text>
              <Text style={styles.spValue}>9 - € 2502.00</Text>
            </View>
            <View style={styles.spTrack}>
              <View style={[styles.spFill, { width: "95%", backgroundColor: "#10B981" }]} />
            </View>

            <View style={[styles.spRow, { marginTop: 6 }]}>
              <Text style={styles.spLabel}>Products</Text>
              <Text style={styles.spValue}>3 - € 37.50</Text>
            </View>
            <View style={styles.spTrack}>
              <View style={[styles.spFill, { width: "25%", backgroundColor: "#94A3B8" }]} />
            </View>
          </View>
        </View>
      </View>

      {/* 3. Charts: Last 7 Days Trends (Last 12 Months) */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Last 7 Days Trends</Text>
          <Text style={styles.cardSubtitle}>Last 12 Months</Text>
        </View>

        <View style={styles.chartContainer}>
          {/* Y Axis Labels */}
          <View style={styles.chartYAxis}>
            <Text style={styles.axisLabel}>€ 3.5k</Text>
            <Text style={styles.axisLabel}>€ 3k</Text>
            <Text style={styles.axisLabel}>€ 2.5k</Text>
            <Text style={styles.axisLabel}>€ 2k</Text>
            <Text style={styles.axisLabel}>€ 1.5k</Text>
          </View>

          {/* Connected Curved Line Chart Canvas */}
          <View
            style={styles.chartCanvasArea}
            onLayout={(e: LayoutChangeEvent) => {
              const w = e.nativeEvent.layout.width;
              if (w > 50 && w !== trendAreaWidth) {
                setTrendAreaWidth(w);
              }
            }}
          >
            {/* Horizontal Grid lines */}
            <View style={[styles.chartGridLine, { top: 0 }]} />
            <View style={[styles.chartGridLine, { top: 30 }]} />
            <View style={[styles.chartGridLine, { top: 60 }]} />
            <View style={[styles.chartGridLine, { top: 90 }]} />
            <View style={[styles.chartGridLine, { top: 120 }]} />

            {/* Soft Area Fill below curve */}
            <View style={styles.areaFillContainer}>
              {chartPoints.map((pt) => {
                const colWidth = usableWidth / MONTHS_TREND_DATA.length;
                return (
                  <View
                    key={`fill-${pt.month}`}
                    style={[
                      styles.areaFillColumn,
                      {
                        left: pt.x - colWidth / 2,
                        width: colWidth,
                        height: chartHeight - pt.y + 4,
                      },
                    ]}
                  />
                );
              })}
            </View>

            {/* Connected Line Segments */}
            {lineSegments.map((seg) => (
              <View
                key={seg.id}
                style={[
                  styles.trendLineSegment,
                  {
                    left: seg.midX - seg.length / 2,
                    top: seg.midY - 1.25,
                    width: seg.length,
                    transform: [{ rotate: `${seg.angle}deg` }],
                  },
                ]}
              />
            ))}

            {/* Points on the curve */}
            {chartPoints.map((pt) => {
              const isPeak = pt.month === "Jul";
              if (isPeak) {
                return (
                  <View
                    key={`dot-${pt.month}`}
                    style={[
                      styles.trendPeakDot,
                      {
                        left: pt.x - 4,
                        top: pt.y - 4,
                      },
                    ]}
                  />
                );
              }
              return (
                <View
                  key={`dot-${pt.month}`}
                  style={[
                    styles.trendPointDot,
                    {
                      left: pt.x - 2.5,
                      top: pt.y - 2.5,
                    },
                  ]}
                />
              );
            })}

            {/* X-Axis Month Labels Aligned Under Each Point */}
            <View style={styles.chartXAxisRow}>
              {chartPoints.map((pt) => (
                <Text
                  key={pt.month}
                  style={[
                    styles.monthAxisLabel,
                    {
                      left: pt.x - 14,
                      width: 28,
                      textAlign: "center",
                    },
                    pt.month === "Jul" && { color: "#10B981", fontWeight: "800" },
                  ]}
                >
                  {pt.month}
                </Text>
              ))}
            </View>
          </View>
        </View>
      </View>

      {/* 4. Employee Performance Bar Chart */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Employee Performance</Text>
          <Text style={styles.cardSubtitle}>Total accounted orders</Text>
        </View>

        <View style={styles.chartContainer}>
          {/* Y Axis scale 0 to 400 */}
          <View style={styles.chartYAxis}>
            <Text style={styles.axisLabel}>400</Text>
            <Text style={styles.axisLabel}>300</Text>
            <Text style={styles.axisLabel}>200</Text>
            <Text style={styles.axisLabel}>100</Text>
            <Text style={styles.axisLabel}>0</Text>
          </View>

          {/* Bar Chart Area */}
          <View style={{ flex: 1, height: 130, position: "relative" }}>
            <View style={[styles.chartGridLine, { top: 0 }]} />
            <View style={[styles.chartGridLine, { top: 32 }]} />
            <View style={[styles.chartGridLine, { top: 65 }]} />
            <View style={[styles.chartGridLine, { top: 97 }]} />
            <View style={[styles.chartGridLine, { top: 130 }]} />

            <View style={styles.empBarsRow}>
              {EMPLOYEE_BARS.map((emp) => {
                const heightPct = (emp.orders / emp.max) * 100;
                return (
                  <View key={emp.name} style={styles.empBarCol}>
                    <View style={styles.empBarTrack}>
                      <View style={[styles.empBarFill, { height: `${heightPct}%` }]} />
                    </View>
                    <Text style={styles.empNameLabel} numberOfLines={1}>{emp.name}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </View>

      {/* 5. Donut Charts: Most Requested Services & Revenue Distribution */}
      {/* 5A. Most Requested Services */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Most Requested Services</Text>
          <Text style={styles.cardSubtitle}>Total bookings split</Text>
        </View>

        <View style={styles.donutBody}>
          {/* Pure React Native Segmented Donut */}
          <View style={styles.donutContainer}>
            {SERVICE_LEGEND.map((s, idx) => (
              <View
                key={idx}
                style={[
                  styles.donutSegment,
                  { borderTopColor: s.color, transform: [{ rotate: s.rotate }] },
                ]}
              />
            ))}
            <View style={styles.donutHole} />
          </View>

          {/* Legend Items */}
          <View style={styles.donutLegendList}>
            {SERVICE_LEGEND.map((s) => (
              <View key={s.name} style={styles.donutLegendItem}>
                <View style={[styles.legendDot, { backgroundColor: s.color }]} />
                <Text style={styles.legendText} numberOfLines={1}>{s.name}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* 5B. Revenue Distribution */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Revenue Distribution</Text>
          <Text style={styles.cardSubtitle}>Split by type</Text>
        </View>

        <View style={styles.donutBody}>
          {/* Pure React Native Segmented Donut with Total in Center */}
          <View style={styles.donutContainer}>
            <View style={[styles.donutSegment, { borderTopColor: "#3B82F6", transform: [{ rotate: "0deg" }] }]} />
            <View style={[styles.donutSegment, { borderTopColor: "#3B82F6", transform: [{ rotate: "90deg" }] }]} />
            <View style={[styles.donutSegment, { borderTopColor: "#3B82F6", transform: [{ rotate: "180deg" }] }]} />
            <View style={[styles.donutSegment, { borderTopColor: "#10B981", transform: [{ rotate: "270deg" }] }]} />
            <View style={styles.donutHole}>
              <Text style={styles.donutCenterSub}>Total</Text>
              <Text style={styles.donutCenterMain}>€ 2.5K</Text>
            </View>
          </View>

          {/* Revenue Legend */}
          <View style={styles.donutLegendList}>
            <View style={styles.donutLegendItem}>
              <View style={[styles.legendDot, { backgroundColor: "#3B82F6" }]} />
              <Text style={styles.legendText}>Services (€ 0)</Text>
            </View>
            <View style={styles.donutLegendItem}>
              <View style={[styles.legendDot, { backgroundColor: "#10B981" }]} />
              <Text style={styles.legendText}>Products (€ 0)</Text>
            </View>
          </View>
        </View>
      </View>

      {/* 6. Bottom Table Card: Cashier Closures, Latest Receipts, Payments */}
      <View style={styles.card}>
        {/* Horizontally Scrollable Subtabs Bar so all tabs have plenty of space without truncation */}
        <View style={styles.subtabsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.subtabsScroll}
          >
            <TouchableOpacity
              style={[styles.subtabBtn, bottomTab === "closures" && styles.subtabBtnActive]}
              onPress={() => setBottomTab("closures")}
              activeOpacity={0.7}
            >
              <Ionicons
                name="receipt-outline"
                size={14}
                color={bottomTab === "closures" ? "#3B82F6" : "#6B7280"}
                style={{ marginRight: 6 }}
              />
              <Text style={[styles.subtabText, bottomTab === "closures" && styles.subtabTextActive]}>
                Cashier Closures
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.subtabBtn, bottomTab === "receipts" && styles.subtabBtnActive]}
              onPress={() => setBottomTab("receipts")}
              activeOpacity={0.7}
            >
              <Ionicons
                name="document-text-outline"
                size={14}
                color={bottomTab === "receipts" ? "#3B82F6" : "#6B7280"}
                style={{ marginRight: 6 }}
              />
              <Text style={[styles.subtabText, bottomTab === "receipts" && styles.subtabTextActive]}>
                Latest Receipts
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.subtabBtn, bottomTab === "payments" && styles.subtabBtnActive]}
              onPress={() => setBottomTab("payments")}
              activeOpacity={0.7}
            >
              <Ionicons
                name="card-outline"
                size={14}
                color={bottomTab === "payments" ? "#3B82F6" : "#6B7280"}
                style={{ marginRight: 6 }}
              />
              <Text style={[styles.subtabText, bottomTab === "payments" && styles.subtabTextActive]}>
                Payments
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Tab 1: Cashier Closures Data Table */}
        {bottomTab === "closures" && (
          <View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ minWidth: 540 }}>
                {/* Table Header Row */}
                <View style={styles.tableHeaderRow}>
                  <Text style={[styles.thText, { width: 110 }]}>Date</Text>
                  <Text style={[styles.thText, { width: 100, textAlign: "left" }]}>Tax Closure</Text>
                  <Text style={[styles.thText, { width: 130, textAlign: "left" }]}>Platform Receipts</Text>
                  <Text style={[styles.thText, { width: 100, textAlign: "left" }]}>Difference</Text>
                  <Text style={[styles.thText, { width: 100, textAlign: "center" }]}>Status</Text>
                </View>

                {/* 5 Rows Matching Web Reference */}
                {CLOSURE_RECORDS.map((row, idx) => {
                  const isRegular = row.status === "Regular";
                  return (
                    <TouchableOpacity
                      key={row.id}
                      style={[
                        styles.tableRow,
                        idx % 2 === 1 && { backgroundColor: "#FAFAFA" },
                      ]}
                      onPress={() => setSelectedClosure(row)}
                      activeOpacity={0.75}
                    >
                      <Text style={[styles.tdText, { width: 110, fontWeight: "400", color: "#374151" }]}>
                        {row.date}
                      </Text>
                      <Text style={[styles.tdText, { width: 100, fontWeight: "700", color: "#111827" }]}>
                        € {row.taxClosure}
                      </Text>
                      <Text style={[styles.tdText, { width: 130, fontWeight: "700", color: "#3B82F6" }]}>
                        € {row.platformReceipts}
                      </Text>
                      <Text
                        style={[
                          styles.tdText,
                          {
                            width: 100,
                            fontWeight: "700",
                            color: row.difference === 0 ? "#111827" : "#EF4444",
                          },
                        ]}
                      >
                        {row.difference === 0 ? "€ 0" : `+ € ${row.difference.toFixed(2)}`}
                      </Text>
                      <View style={{ width: 100, alignItems: "center" }}>
                        <View
                          style={[
                            styles.statusBadge,
                            { backgroundColor: isRegular ? "#DCFCE7" : "#FEE2E2" },
                          ]}
                        >
                          <Text
                            style={[
                              styles.statusBadgeText,
                              { color: isRegular ? "#16A34A" : "#EF4444" },
                            ]}
                          >
                            {row.status}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>

            {/* Pagination Footer */}
            <View style={styles.paginationRow}>
              <Text style={styles.paginationLabel}>Showing 1 to 5 of 5 closures</Text>
              <View style={styles.paginationControls}>
                <TouchableOpacity style={styles.pageArrowBtn} disabled={true}>
                  <Ionicons name="chevron-back" size={11} color="#9CA3AF" />
                  <Text style={[styles.pageArrowText, { color: "#9CA3AF" }]}>Previous</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.pageNumberBtn, styles.pageNumberBtnActive]}>
                  <Text style={styles.pageNumberTextActive}>1</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.pageArrowBtn} disabled={true}>
                  <Text style={[styles.pageArrowText, { color: "#9CA3AF" }]}>Next</Text>
                  <Ionicons name="chevron-forward" size={11} color="#9CA3AF" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Tab 2: Latest Receipts Placeholder */}
        {bottomTab === "receipts" && (
          <View style={styles.placeholderTab}>
            <Ionicons name="receipt-outline" size={32} color="#9CA3AF" />
            <Text style={styles.placeholderTitle}>Latest Fiscal Receipts</Text>
            <Text style={styles.placeholderSub}>Live telemetry receipts registered in this billing cycle.</Text>
          </View>
        )}

        {/* Tab 3: Payments Placeholder */}
        {bottomTab === "payments" && (
          <View style={styles.placeholderTab}>
            <Ionicons name="card-outline" size={32} color="#9CA3AF" />
            <Text style={styles.placeholderTitle}>Platform Payment Logs</Text>
            <Text style={styles.placeholderSub}>Direct merchant and POS settlements.</Text>
          </View>
        )}
      </View>

      {/* Cashier Closure Detail Modal */}
      {selectedClosure && (
        <CustomModal
          visible={!!selectedClosure}
          onClose={() => setSelectedClosure(null)}
          title="Cashier Closure Details"
        >
          <View style={{ gap: 12 }}>
            <View style={styles.modalDetailHeader}>
              <View>
                <Text style={styles.modalDetailTitle}>Chiusura Fiscale RT</Text>
                <Text style={styles.modalDetailSub}>{selectedClosure.date} • Glamour Beauty Roma</Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: selectedClosure.status === "Regular" ? "#DCFCE7" : "#FEE2E2" },
                ]}
              >
                <Text
                  style={[
                    styles.statusBadgeText,
                    { color: selectedClosure.status === "Regular" ? "#16A34A" : "#EF4444" },
                  ]}
                >
                  {selectedClosure.status}
                </Text>
              </View>
            </View>

            <View style={styles.modalDetailBox}>
              <View style={styles.modalRow}>
                <Text style={styles.modalRowLabel}>Fiscal RT Telemetry Total:</Text>
                <Text style={styles.modalRowVal}>€ {selectedClosure.taxClosure.toFixed(2)}</Text>
              </View>
              <View style={styles.modalRow}>
                <Text style={styles.modalRowLabel}>Platform POS Receipts Total:</Text>
                <Text style={[styles.modalRowVal, { color: "#3B82F6" }]}>
                  € {selectedClosure.platformReceipts.toFixed(2)}
                </Text>
              </View>
              <View style={styles.modalRow}>
                <Text style={styles.modalRowLabel}>Reconciliation Variance:</Text>
                <Text
                  style={[
                    styles.modalRowVal,
                    { color: selectedClosure.difference === 0 ? "#10B981" : "#EF4444" },
                  ]}
                >
                  € {selectedClosure.difference.toFixed(2)}
                </Text>
              </View>
            </View>

            <CustomButton
              title="Close"
              onPress={() => setSelectedClosure(null)}
              variant="outline"
            />
          </View>
        </CustomModal>
      )}

      {/* Revenue Breakdown Modal */}
      <CustomModal
        visible={showRevenueModal}
        onClose={() => setShowRevenueModal(false)}
        title="Revenue Breakdown Analysis"
      >
        <View style={{ gap: 12 }}>
          <Text style={{ fontSize: 12, color: "#4B5563" }}>
            Total revenue recorded via RT telemetry receipts for the selected period:
          </Text>
          <View style={styles.modalDetailBox}>
            <View style={styles.modalRow}>
              <Text style={styles.modalRowLabel}>Services Revenue (9):</Text>
              <Text style={styles.modalRowVal}>€ 2,502.00</Text>
            </View>
            <View style={styles.modalRow}>
              <Text style={styles.modalRowLabel}>Retail Products (3):</Text>
              <Text style={styles.modalRowVal}>€ 37.50</Text>
            </View>
            <View style={styles.modalRow}>
              <Text style={styles.modalRowLabel}>Combined Gross Total:</Text>
              <Text style={[styles.modalRowVal, { color: "#16A34A", fontWeight: "800" }]}>€ 2,539.50</Text>
            </View>
          </View>
          <CustomButton title="Done" onPress={() => setShowRevenueModal(false)} variant="primary" />
        </View>
      </CustomModal>

      {/* Average Receipt Modal */}
      <CustomModal
        visible={showAverageModal}
        onClose={() => setShowAverageModal(false)}
        title="Average Ticket Analysis"
      >
        <View style={{ gap: 12 }}>
          <Text style={{ fontSize: 12, color: "#4B5563" }}>
            Average basket ticket size across all salon branches:
          </Text>
          <View style={styles.modalDetailBox}>
            <View style={styles.modalRow}>
              <Text style={styles.modalRowLabel}>Average Ticket:</Text>
              <Text style={[styles.modalRowVal, { color: "#7C3AED", fontWeight: "800" }]}>€ 278.00</Text>
            </View>
            <View style={styles.modalRow}>
              <Text style={styles.modalRowLabel}>Highest Ticket:</Text>
              <Text style={styles.modalRowVal}>€ 560.00</Text>
            </View>
            <View style={styles.modalRow}>
              <Text style={styles.modalRowLabel}>Lowest Ticket:</Text>
              <Text style={styles.modalRowVal}>€ 45.00</Text>
            </View>
          </View>
          <CustomButton title="Done" onPress={() => setShowAverageModal(false)} variant="primary" />
        </View>
      </CustomModal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 14,
    position: "relative",
  },
  dropdownBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 900,
    backgroundColor: "transparent",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  filtersCard: {
    zIndex: 50,
  },
  filtersCardActive: {
    zIndex: 1000,
    elevation: 1, // Standard elevation, no heavy card shadow when opened
  },
  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },
  resetBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEECFF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  resetBtnText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#635BFF",
  },
  filtersGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 10,
  },
  filterCol: {
    width: "48%",
    position: "relative",
  },
  filterLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
  },
  filterInputBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    height: 40,
    paddingHorizontal: 12,
  },
  filterInputBoxActive: {
    borderColor: "#635BFF",
    backgroundColor: "#F8F7FF",
  },
  filterInputBoxOpen: {
    borderColor: "#635BFF",
  },
  filterInputText: {
    fontSize: 13,
    color: "#374151",
    fontWeight: "400",
    flex: 1,
    marginRight: 4,
  },
  filterInputTextActive: {
    color: "#635BFF",
    fontWeight: "600",
  },
  dropdownContainer: {
    position: "absolute",
    top: 66,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    zIndex: 10000,
    overflow: "hidden",
    elevation: 4, // Clean minimal elevation for dropdown popup only
  },
  dropdownOptionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  dropdownOptionItemActive: {
    backgroundColor: "#EEECFF",
  },
  dropdownOptionText: {
    fontSize: 12,
    color: "#374151",
    fontWeight: "500",
    flex: 1,
  },
  dropdownOptionTextActive: {
    color: "#635BFF",
    fontWeight: "700",
  },
  kpiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 10,
    zIndex: 1,
    elevation: 0,
  },
  kpiCard: {
    width: "48%",
    height: 128,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 0,
  },
  kpiTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  kpiIconWrap: {
    width: 24,
    height: 24,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  kpiTitle: {
    fontSize: 10.5,
    fontWeight: "700",
    color: "#374151",
    flex: 1,
  },
  kpiValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 2,
  },
  kpiSub: {
    fontSize: 9,
    color: "#6B7280",
  },
  spWrap: {
    marginTop: 2,
  },
  spRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 3,
  },
  spLabel: {
    fontSize: 9.5,
    color: "#4B5563",
    fontWeight: "600",
  },
  spValue: {
    fontSize: 9.5,
    fontWeight: "700",
    color: "#111827",
  },
  spTrack: {
    height: 4,
    backgroundColor: "#E2E8F0",
    borderRadius: 2,
    overflow: "hidden",
  },
  spFill: {
    height: "100%",
    borderRadius: 2,
  },
  cardHeader: {
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
  },
  cardSubtitle: {
    fontSize: 10.5,
    color: "#6B7280",
    marginTop: 2,
  },
  chartContainer: {
    flexDirection: "row",
    marginTop: 4,
  },
  chartYAxis: {
    width: 42,
    height: 120,
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingBottom: 2,
  },
  axisLabel: {
    fontSize: 9,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  chartCanvasArea: {
    flex: 1,
    height: 145,
    position: "relative",
  },
  chartGridLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "#F1F5F9",
  },
  areaFillContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 120,
    overflow: "hidden",
  },
  areaFillColumn: {
    position: "absolute",
    bottom: 0,
    backgroundColor: "#ECFDF5",
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    opacity: 0.65,
  },
  trendLineSegment: {
    position: "absolute",
    height: 2.5,
    backgroundColor: "#10B981",
    borderRadius: 1.25,
    zIndex: 5,
  },
  trendPointDot: {
    position: "absolute",
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#10B981",
    zIndex: 10,
  },
  trendPeakDot: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#10B981",
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
    zIndex: 15,
  },
  chartXAxisRow: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 126,
    height: 18,
  },
  monthAxisLabel: {
    position: "absolute",
    fontSize: 8,
    color: "#9CA3AF",
    fontWeight: "600",
  },
  empBarsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    height: 130,
  },
  empBarCol: {
    alignItems: "center",
    width: 44,
  },
  empBarTrack: {
    width: 14,
    height: 110,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  empBarFill: {
    width: "100%",
    backgroundColor: "#4F46E5",
    borderRadius: 4,
  },
  empNameLabel: {
    fontSize: 8.5,
    color: "#4B5563",
    fontWeight: "600",
    marginTop: 4,
    textAlign: "center",
  },
  donutBody: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: 6,
  },
  donutContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 14,
    borderColor: "#F3F4F6",
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  donutSegment: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 14,
    borderColor: "transparent",
  },
  donutHole: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  donutCenterSub: {
    fontSize: 8.5,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  donutCenterMain: {
    fontSize: 11,
    fontWeight: "800",
    color: "#111827",
  },
  donutLegendList: {
    gap: 5,
    flex: 1,
    marginLeft: 16,
  },
  donutLegendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  legendText: {
    fontSize: 10.5,
    fontWeight: "600",
    color: "#374151",
  },
  subtabsContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    marginBottom: 12,
    marginHorizontal: -16,
  },
  subtabsScroll: {
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  subtabBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  subtabBtnActive: {
    borderBottomColor: "#3B82F6",
  },
  subtabText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
  },
  subtabTextActive: {
    color: "#3B82F6",
    fontWeight: "700",
  },
  tableHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  thText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#6B7280",
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 11,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  tdText: {
    fontSize: 11,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 9.5,
    fontWeight: "700",
  },
  paginationRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 12,
    marginTop: 6,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  paginationLabel: {
    fontSize: 10.5,
    color: "#6B7280",
    fontWeight: "500",
  },
  paginationControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  pageArrowBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 5,
    backgroundColor: "#F3F4F6",
  },
  pageArrowText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#6B7280",
  },
  pageNumberBtn: {
    width: 22,
    height: 22,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
  },
  pageNumberBtnActive: {
    backgroundColor: "#3B82F6",
  },
  pageNumberTextActive: {
    fontSize: 10.5,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  placeholderTab: {
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#374151",
    marginTop: 8,
  },
  placeholderSub: {
    fontSize: 10,
    color: "#9CA3AF",
    marginTop: 2,
    textAlign: "center",
  },
  modalDetailHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  modalDetailTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#111827",
  },
  modalDetailSub: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 2,
  },
  modalDetailBox: {
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    padding: 12,
    gap: 8,
  },
  modalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalRowLabel: {
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "600",
  },
  modalRowVal: {
    fontSize: 11,
    fontWeight: "700",
    color: "#111827",
  },
});
