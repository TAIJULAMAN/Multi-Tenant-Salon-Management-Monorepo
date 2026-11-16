import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomBottomSheet from "@/components/ui/CustomBottomSheet";

interface Payslip {
  id: string;
  date: string;
  net: string;
  gross: string;
  tfr: string;
  contributions: string;
}

const INITIAL_PAYSLIPS: Payslip[] = [
  { id: "1", date: "November 29, 2024", net: "€ 1,700", gross: "€ 2,200", tfr: "€ 0", contributions: "€ 0" },
  { id: "2", date: "October 30, 2024", net: "€ 1,700", gross: "€ 2,200", tfr: "€ 0", contributions: "€ 0" },
  { id: "3", date: "September 29, 2024", net: "€ 1,700", gross: "€ 2,200", tfr: "€ 0", contributions: "€ 0" },
  { id: "4", date: "August 30, 2024", net: "€ 1,700", gross: "€ 2,200", tfr: "€ 0", contributions: "€ 0" },
  { id: "5", date: "July 29, 2024", net: "€ 1,700", gross: "€ 2,200", tfr: "€ 0", contributions: "€ 0" },
];

const FILTER_YEAR_OPTIONS = [
  "This Year (2025)",
  "Last Year (2024)",
  "2023",
  "2022",
  "2021",
  "All Time",
];

export default function RemunerationTab() {
  const [selectedYear, setSelectedYear] = useState("2025");
  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null);
  const [selectedFilterYear, setSelectedFilterYear] = useState("Last Year (2024)");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; right: number }>({
    top: 100,
    right: 16,
  });
  const filterBtnRef = useRef<any>(null);

  const handleOpenFilterMenu = () => {
    if (filterBtnRef.current?.measureInWindow) {
      filterBtnRef.current.measureInWindow(
        (x: number, y: number, width: number, height: number) => {
          const screenWidth = Dimensions.get("window").width;
          const rightOffset = Math.max(16, screenWidth - (x + width));
          setDropdownPosition({ top: y + height + 6, right: rightOffset });
          setIsFilterModalOpen(true);
        }
      );
    } else {
      setIsFilterModalOpen(true);
    }
  };

  const yearlyStats = [
    { year: "2020", height: 35, amount: "€ 1,200" },
    { year: "2021", height: 42, amount: "€ 1,400" },
    { year: "2022", height: 50, amount: "€ 1,800" },
    { year: "2023", height: 52, amount: "€ 1,900" },
    { year: "2024", height: 55, amount: "€ 2,000" },
    { year: "2025", height: 75, amount: "€ 2,400" },
  ];

  return (
    <View style={styles.container}>
      {/* 3 Metric Cards matching Web Dashboard */}
      <View style={styles.metricsRow}>
        {/* Last Payslip */}
        <View style={[styles.metricCard, { backgroundColor: "#EEF2FF", borderColor: "#C7D2FE" }]}>
          <View style={styles.metricHeader}>
            <View style={[styles.metricIconBox, { backgroundColor: "#635BFF" }]}>
              <Ionicons name="cash-outline" size={16} color="#FFFFFF" />
            </View>
            <Text style={styles.metricLabel}>Last Payslip</Text>
          </View>
          <Text style={styles.metricValue}>€ 1,700</Text>
          <Text style={styles.metricSub}>Gross: € 2,200 • Paid Nov 29</Text>
        </View>

        {/* Average Salary */}
        <View style={[styles.metricCard, { backgroundColor: "#ECFDF5", borderColor: "#A7F3D0" }]}>
          <View style={styles.metricHeader}>
            <View style={[styles.metricIconBox, { backgroundColor: "#10B981" }]}>
              <Ionicons name="trending-up-outline" size={16} color="#FFFFFF" />
            </View>
            <Text style={styles.metricLabel}>Average Salary</Text>
          </View>
          <Text style={styles.metricValue}>€ 2,200</Text>
          <Text style={styles.metricSub}>Calculated on 12 months</Text>
        </View>

        {/* Accumulated TFR */}
        <View style={[styles.metricCard, { backgroundColor: "#FFFBEB", borderColor: "#FDE68A" }]}>
          <View style={styles.metricHeader}>
            <View style={[styles.metricIconBox, { backgroundColor: "#F59E0B" }]}>
              <Ionicons name="briefcase-outline" size={16} color="#FFFFFF" />
            </View>
            <Text style={styles.metricLabel}>Accumulated TFR</Text>
          </View>
          <Text style={styles.metricValue}>€ 4,800</Text>
          <Text style={styles.metricSub}>Updated Nov 2024</Text>
        </View>
      </View>

      {/* Salary History Chart Card */}
      <View style={styles.card}>
        <View style={styles.chartHeader}>
          <View>
            <Text style={styles.cardTitle}>Salary History (Last 5 Years)</Text>
            <Text style={styles.chartSubtitle}>Annual gross remuneration overview</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={styles.legendDot} />
            <Text style={styles.legendText}>Gross Total</Text>
          </View>
        </View>

        {/* Bar Chart Visual */}
        <View style={styles.chartArea}>
          {yearlyStats.map((item) => {
            const isSelected = item.year === selectedYear;
            return (
              <TouchableOpacity
                key={item.year}
                style={styles.barCol}
                onPress={() => setSelectedYear(item.year)}
                activeOpacity={0.7}
              >
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      { height: `${item.height}%` },
                      isSelected && styles.barFillActive,
                    ]}
                  />
                </View>
                <Text
                  style={[
                    styles.barYearText,
                    isSelected && styles.barYearTextActive,
                  ]}
                >
                  {item.year}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Payslip List Section */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Payslip List</Text>
          <TouchableOpacity
            ref={filterBtnRef}
            style={styles.filterBtn}
            onPress={handleOpenFilterMenu}
            activeOpacity={0.7}
          >
            <Text style={styles.filterBtnText}>{selectedFilterYear}</Text>
            <Ionicons name="chevron-down" size={14} color="#64748B" />
          </TouchableOpacity>
        </View>

        {INITIAL_PAYSLIPS.map((payslip) => (
          <View key={payslip.id} style={styles.payslipItem}>
            <View style={styles.payslipLeft}>
              <View style={styles.fileIconBox}>
                <Ionicons name="document-text" size={18} color="#635BFF" />
              </View>
              <View>
                <Text style={styles.payslipDate}>{payslip.date}</Text>
                <Text style={styles.payslipMeta}>
                  Net: <Text style={styles.payslipMetaBold}>{payslip.net}</Text> • Gross:{" "}
                  {payslip.gross}
                </Text>
                <Text style={styles.payslipMetaSub}>
                  TFR: {payslip.tfr} • Contributions: {payslip.contributions}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.moreBtn}
              onPress={() => setSelectedPayslip(payslip)}
              activeOpacity={0.7}
            >
              <Ionicons name="ellipsis-vertical" size={16} color="#64748B" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Payslip Actions Sheet using CustomBottomSheet */}
      <CustomBottomSheet
        visible={!!selectedPayslip}
        onClose={() => setSelectedPayslip(null)}
        title={`Payslip • ${selectedPayslip?.date}`}
      >
        <View style={styles.sheetActionsContainer}>
          <TouchableOpacity
            style={styles.sheetActionItem}
            onPress={() => {
              Alert.alert("View Payslip", `Opening payslip details for ${selectedPayslip?.date}`);
              setSelectedPayslip(null);
            }}
            activeOpacity={0.7}
          >
            <View style={[styles.sheetActionIconBox, { backgroundColor: "#EEF2FF" }]}>
              <Ionicons name="eye-outline" size={18} color="#635BFF" />
            </View>
            <Text style={styles.sheetActionText}>View Details</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.sheetActionItem}
            onPress={() => {
              Alert.alert("Download", `Downloading PDF for ${selectedPayslip?.date}`);
              setSelectedPayslip(null);
            }}
            activeOpacity={0.7}
          >
            <View style={[styles.sheetActionIconBox, { backgroundColor: "#ECFEFF" }]}>
              <Ionicons name="download-outline" size={18} color="#06B6D4" />
            </View>
            <Text style={styles.sheetActionText}>Download PDF</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.sheetActionItem}
            onPress={() => {
              Alert.alert("Edit", `Edit payslip info for ${selectedPayslip?.date}`);
              setSelectedPayslip(null);
            }}
            activeOpacity={0.7}
          >
            <View style={[styles.sheetActionIconBox, { backgroundColor: "#FEF3C7" }]}>
              <Ionicons name="create-outline" size={18} color="#F59E0B" />
            </View>
            <Text style={styles.sheetActionText}>Edit Payslip</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.sheetActionItem, { borderBottomWidth: 0 }]}
            onPress={() => {
              Alert.alert("Delete", `Delete payslip record for ${selectedPayslip?.date}?`, [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: () => setSelectedPayslip(null) },
              ]);
            }}
            activeOpacity={0.7}
          >
            <View style={[styles.sheetActionIconBox, { backgroundColor: "#FEF2F2" }]}>
              <Ionicons name="trash-outline" size={18} color="#EF4444" />
            </View>
            <Text style={[styles.sheetActionText, { color: "#EF4444" }]}>Delete Payslip</Text>
          </TouchableOpacity>
        </View>
      </CustomBottomSheet>

      {/* Filter by Year Small Option Modal Anchored Below Button */}
      <Modal
        visible={isFilterModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsFilterModalOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsFilterModalOpen(false)}
        >
          <View
            style={[
              styles.smallModalCard,
              { top: dropdownPosition.top, right: dropdownPosition.right },
            ]}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.smallModalOptions}>
              {FILTER_YEAR_OPTIONS.map((option) => {
                const isSelected = selectedFilterYear === option;
                return (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.smallModalOptionItem,
                      isSelected && styles.smallModalOptionItemActive,
                    ]}
                    onPress={() => {
                      setSelectedFilterYear(option);
                      setIsFilterModalOpen(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.smallModalOptionText,
                        isSelected && styles.smallModalOptionTextActive,
                      ]}
                      numberOfLines={1}
                    >
                      {option}
                    </Text>
                    {isSelected && (
                      <Ionicons name="checkmark" size={16} color="#635BFF" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  metricsRow: {
    gap: 10,
    marginBottom: 16,
  },
  metricCard: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  metricHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  metricIconBox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  metricLabel: {
    fontSize: 12,
    fontFamily: "Manrope_600SemiBold",
    color: "#475569",
  },
  metricValue: {
    fontSize: 22,
    fontFamily: "Manrope_800ExtraBold",
    color: "#0F172A",
    marginBottom: 2,
  },
  metricSub: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  cardTitle: {
    fontSize: 15,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  chartSubtitle: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    marginTop: 2,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#635BFF",
  },
  legendText: {
    fontSize: 11,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  chartArea: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 140,
    paddingTop: 10,
    paddingHorizontal: 8,
  },
  barCol: {
    alignItems: "center",
    flex: 1,
    height: "100%",
    justifyContent: "flex-end",
  },
  barTrack: {
    width: 22,
    height: 100,
    backgroundColor: "#F1F5F9",
    borderRadius: 6,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  barFill: {
    width: "100%",
    backgroundColor: "#94A3B8",
    borderRadius: 6,
  },
  barFillActive: {
    backgroundColor: "#3B46F1",
  },
  barYearText: {
    fontSize: 10,
    fontFamily: "Manrope_600SemiBold",
    color: "#94A3B8",
    marginTop: 6,
  },
  barYearTextActive: {
    color: "#3B46F1",
    fontFamily: "Manrope_700Bold",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  filterBtnText: {
    fontSize: 12,
    fontFamily: "Manrope_600SemiBold",
    color: "#475569",
  },
  payslipItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  payslipLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  fileIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  payslipDate: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
    marginBottom: 2,
  },
  payslipMeta: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
  },
  payslipMetaBold: {
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  payslipMetaSub: {
    fontSize: 10,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
    marginTop: 1,
  },
  moreBtn: {
    padding: 6,
  },
  sheetActionsContainer: {
    paddingBottom: 8,
  },
  sheetActionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    gap: 12,
  },
  sheetActionIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  sheetActionText: {
    fontSize: 14,
    fontFamily: "Manrope_600SemiBold",
    color: "#1E293B",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  smallModalCard: {
    position: "absolute",
    width: 175,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 8,
  },
  smallModalOptions: {
    gap: 2,
  },
  smallModalOptionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  smallModalOptionItemActive: {
    backgroundColor: "#EEF2FF",
  },
  smallModalOptionText: {
    fontSize: 12,
    fontFamily: "Manrope_600SemiBold",
    color: "#334155",
  },
  smallModalOptionTextActive: {
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
});
