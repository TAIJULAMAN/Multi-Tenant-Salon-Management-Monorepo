import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  SalaryHistoryItem,
  INITIAL_SALARY_HISTORY,
} from "@/data/salariesData";
import ExportModal from "@/components/modal/ExportModal";

export default function SalariesHistoryTab() {
  const [history] = useState<SalaryHistoryItem[]>(INITIAL_SALARY_HISTORY);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

  const statusOptions = ["All", "Approved", "Declined", "Cancelled"];

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.salon.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.period.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.empId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: SalaryHistoryItem["status"]) => {
    switch (status) {
      case "Approved":
        return { bg: "#ECFDF5", text: "#10B981" };
      case "Declined":
        return { bg: "#FEF2F2", text: "#F87171" };
      case "Cancelled":
        return { bg: "#F1F5F9", text: "#64748B" };
    }
  };

  return (
    <View style={styles.container}>
      {/* ─────────────────────────────────────────────────────────────
          1. Header Card with Search, Filter Dropdown & Export Data
         ───────────────────────────────────────────────────────────── */}
      <View style={[styles.topControlCard, { zIndex: 100 }]}>
        <View style={styles.topTitleRow}>
          <Text style={styles.sectionTitle}>Salary History</Text>
          <Text style={styles.recordCountText}>
            {filteredHistory.length} record{filteredHistory.length === 1 ? "" : "s"}
          </Text>
        </View>

        {/* Search Input */}
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={17} color="#94A3B8" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={16} color="#94A3B8" />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Filter Dropdown & Export Button Actions Row */}
        <View style={styles.filterActionsRow}>
          <View style={styles.statusDropdownContainer}>
            <TouchableOpacity
              style={[
                styles.statusDropdownBtn,
                statusDropdownOpen && styles.statusDropdownBtnActive,
              ]}
              onPress={() => setStatusDropdownOpen(!statusDropdownOpen)}
              activeOpacity={0.7}
            >
              <Text style={styles.statusDropdownVal}>{statusFilter}</Text>
              <Ionicons
                name={statusDropdownOpen ? "chevron-up" : "chevron-down"}
                size={14}
                color="#64748B"
              />
            </TouchableOpacity>

            {/* Dropdown Menu positioned directly below the button */}
            {statusDropdownOpen && (
              <View style={styles.inlineDropdownMenu}>
                {statusOptions.map((opt) => {
                  const isSelected = statusFilter === opt;
                  return (
                    <TouchableOpacity
                      key={opt}
                      style={[
                        styles.dropdownMenuItem,
                        isSelected && styles.dropdownMenuItemActive,
                      ]}
                      onPress={() => {
                        setStatusFilter(opt);
                        setStatusDropdownOpen(false);
                      }}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.dropdownMenuItemText,
                          isSelected && styles.dropdownMenuItemTextActive,
                        ]}
                      >
                        {opt}
                      </Text>
                      {isSelected && (
                        <Ionicons name="checkmark" size={16} color="#635BFF" />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>

          <TouchableOpacity
            style={styles.exportButton}
            onPress={() => {
              setStatusDropdownOpen(false);
              setIsExportOpen(true);
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="download-outline" size={14} color="#635BFF" />
            <Text style={styles.exportButtonText}>Export Data</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ─────────────────────────────────────────────────────────────
          2. Salary History Cards (All Row Data Matching Web Table)
         ───────────────────────────────────────────────────────────── */}
      <View style={styles.historyList}>
        {filteredHistory.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="documents-outline" size={44} color="#94A3B8" />
            <Text style={styles.emptyTitle}>No salary history found</Text>
            <Text style={styles.emptySub}>No payroll records match your filter criteria.</Text>
          </View>
        ) : (
          filteredHistory.map((item) => {
            const statusSty = getStatusBadge(item.status);

            return (
              <View key={item.id} style={styles.historyCard}>
                {/* 1. Header: Avatar, Name, EMP ID & Status Badge */}
                <View style={styles.cardHeader}>
                  <View style={styles.headerLeft}>
                    <View style={styles.avatarBox}>
                      <Text style={{ fontSize: 20 }}>{item.avatarEmoji}</Text>
                    </View>
                    <View style={{ flex: 1, marginHorizontal: 8 }}>
                      <Text style={styles.staffName} numberOfLines={1}>
                        {item.name}
                      </Text>
                      <Text style={styles.empIdBadge}>{item.empId}</Text>
                    </View>
                  </View>

                  <View style={[styles.statusBadge, { backgroundColor: statusSty.bg }]}>
                    <Text style={[styles.statusBadgeText, { color: statusSty.text }]}>
                      {item.status}
                    </Text>
                  </View>
                </View>

                {/* 2. Salon & Filing Period */}
                <View style={styles.salonPeriodRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.rowItemLabel}>Salon</Text>
                    <Text style={styles.rowItemValue} numberOfLines={1}>
                      {item.salon}
                    </Text>
                  </View>
                  <View style={{ flex: 1, alignItems: "flex-end" }}>
                    <Text style={styles.rowItemLabel}>Period</Text>
                    <Text style={styles.rowItemValue} numberOfLines={1}>
                      {item.period}
                    </Text>
                  </View>
                </View>

                {/* 3. Financial Pills: Gross & Net Amount */}
                <View style={styles.cardDataGrid}>
                  {/* Gross Pill */}
                  <View style={styles.gridDataItem}>
                    <Text style={styles.gridDataLabel}>Gross</Text>
                    <View style={styles.grossPill}>
                      <Text style={styles.grossPillText}>
                        € {item.gross.toLocaleString("en-IE", { minimumFractionDigits: 2 })}
                      </Text>
                    </View>
                  </View>

                  {/* Net Amount Pill */}
                  <View style={[styles.gridDataItem, { alignItems: "flex-end" }]}>
                    <Text style={styles.gridDataLabel}>Net Amount</Text>
                    <View style={styles.netPill}>
                      <Text style={styles.netPillText}>
                        € {item.net.toLocaleString("en-IE", { minimumFractionDigits: 2 })}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* 4. Approval & Payment Details */}
                <View style={styles.metaDetailsRow}>
                  {/* Approved */}
                  <View style={styles.metaDetailCol}>
                    <Text style={styles.metaDetailLabel}>Approved</Text>
                    {item.approvedDate ? (
                      <View>
                        <Text style={styles.metaDetailPrimary}>{item.approvedDate}</Text>
                        <Text style={styles.metaDetailSecondary}>by {item.approvedBy}</Text>
                      </View>
                    ) : (
                      <Text style={styles.dashText}>-</Text>
                    )}
                  </View>

                  {/* Payment */}
                  <View style={[styles.metaDetailCol, { alignItems: "flex-end" }]}>
                    <Text style={styles.metaDetailLabel}>Payment</Text>
                    {item.paymentDate ? (
                      <View style={styles.paymentInfoWrap}>
                        <Ionicons
                          name={
                            item.paymentStatus === "completed"
                              ? "checkmark-circle"
                              : "time-outline"
                          }
                          size={15}
                          color={item.paymentStatus === "completed" ? "#10B981" : "#F87171"}
                          style={{ marginRight: 4 }}
                        />
                        <Text style={styles.metaDetailPrimary}>{item.paymentDate}</Text>
                      </View>
                    ) : (
                      <Text style={styles.dashText}>-</Text>
                    )}
                  </View>
                </View>
              </View>
            );
          })
        )}
      </View>

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        title="Salary History"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    paddingBottom: 28,
  },
  topControlCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 3,
    gap: 12,
    position: "relative",
  },
  topTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1E293B",
  },
  recordCountText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: "#1E293B",
  },
  filterActionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    position: "relative",
    zIndex: 50,
  },
  statusDropdownContainer: {
    flex: 1,
    position: "relative",
  },
  statusDropdownBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  statusDropdownBtnActive: {
    borderColor: "#635BFF",
  },
  statusDropdownVal: {
    fontSize: 12,
    fontWeight: "600",
    color: "#334155",
  },
  inlineDropdownMenu: {
    position: "absolute",
    top: 42,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingVertical: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 10,
    zIndex: 999,
  },
  dropdownMenuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  dropdownMenuItemActive: {
    backgroundColor: "#F4F3FF",
  },
  dropdownMenuItemText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#334155",
  },
  dropdownMenuItemTextActive: {
    color: "#635BFF",
    fontWeight: "700",
  },
  exportButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "#635BFF",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "transparent",
  },
  exportButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#635BFF",
  },
  historyList: {
    gap: 12,
    zIndex: 1,
  },
  historyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
    gap: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 8,
  },
  avatarBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  staffName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E293B",
  },
  empIdBadge: {
    fontSize: 11,
    fontWeight: "700",
    color: "#94A3B8",
    marginTop: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  salonPeriodRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 2,
  },
  rowItemLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#94A3B8",
    textTransform: "uppercase",
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  rowItemValue: {
    fontSize: 12,
    fontWeight: "500",
    color: "#475569",
  },
  cardDataGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  gridDataItem: {
    flex: 1,
  },
  gridDataLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#94A3B8",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  grossPill: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  grossPillText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#5C7CFA",
  },
  netPill: {
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-end",
  },
  netPillText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#10B981",
  },
  metaDetailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingTop: 10,
    paddingHorizontal: 2,
  },
  metaDetailCol: {
    flex: 1,
  },
  metaDetailLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#94A3B8",
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  metaDetailPrimary: {
    fontSize: 12,
    fontWeight: "600",
    color: "#334155",
  },
  metaDetailSecondary: {
    fontSize: 10,
    fontWeight: "500",
    color: "#94A3B8",
    marginTop: 1,
  },
  paymentInfoWrap: {
    flexDirection: "row",
    alignItems: "center",
  },
  dashText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#94A3B8",
  },
  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#374151",
    marginTop: 8,
  },
  emptySub: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 2,
  },
});
