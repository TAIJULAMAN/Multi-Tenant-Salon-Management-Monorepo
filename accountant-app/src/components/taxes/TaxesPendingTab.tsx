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
  PendingTaxItem,
  INITIAL_PENDING_TAXES,
  TaxStatus,
} from "@/data/taxesData";

export default function TaxesPendingTab() {
  const [taxes] = useState<PendingTaxItem[]>(INITIAL_PENDING_TAXES);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | TaxStatus>("All");
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

  const statusOptions: ("All" | TaxStatus)[] = ["All", "Pending", "Declined"];

  const filteredTaxes = taxes.filter((t) => {
    const matchesSearch =
      t.salon.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.taxType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.period.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.amount.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.dueDate.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        if (statusDropdownOpen) setStatusDropdownOpen(false);
      }}
    >
      <View style={styles.container}>
        {/* ─────────────────────────────────────────────────────────────
            Header Controls Card
           ───────────────────────────────────────────────────────────── */}
        <View style={styles.headerCard}>
          <View style={styles.headerTitleRow}>
            <View style={styles.titleWithBadge}>
              <Text style={styles.headerTitle}>Pending & Declined Taxes</Text>
              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>{filteredTaxes.length}</Text>
              </View>
            </View>
          </View>

          {/* Search Bar and Status Selector Row */}
          <View style={styles.controlsRow}>
            {/* Search Input */}
            <View style={styles.searchBar}>
              <Ionicons
                name="search-outline"
                size={16}
                color="#94A3B8"
                style={{ marginRight: 6 }}
              />
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

            {/* Status Filter Button & Anchored Dropdown */}
            <View style={styles.dropdownAnchorWrap}>
              <TouchableOpacity
                style={styles.statusFilterBtn}
                onPress={() => setStatusDropdownOpen(!statusDropdownOpen)}
                activeOpacity={0.7}
              >
                <Text style={styles.statusFilterBtnText}>{statusFilter}</Text>
                <Ionicons
                  name={statusDropdownOpen ? "chevron-up" : "chevron-down"}
                  size={13}
                  color="#64748B"
                />
              </TouchableOpacity>

              {/* Anchored Popover Menu directly below button */}
              {statusDropdownOpen && (
                <View style={styles.popoverMenu}>
                  {statusOptions.map((opt) => (
                    <TouchableOpacity
                      key={opt}
                      style={[
                        styles.popoverItem,
                        statusFilter === opt && styles.popoverItemActive,
                      ]}
                      onPress={() => {
                        setStatusFilter(opt);
                        setStatusDropdownOpen(false);
                      }}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.popoverItemText,
                          statusFilter === opt && styles.popoverItemTextActive,
                        ]}
                      >
                        {opt}
                      </Text>
                      {statusFilter === opt && (
                        <Ionicons name="checkmark" size={14} color="#635BFF" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>
        </View>

        {/* ─────────────────────────────────────────────────────────────
            List of Tax Cards with all Table fields
           ───────────────────────────────────────────────────────────── */}
        <View style={styles.taxesList}>
          {filteredTaxes.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons name="receipt-outline" size={44} color="#94A3B8" />
              <Text style={styles.emptyTitle}>No records found</Text>
              <Text style={styles.emptySub}>
                No pending or declined taxes match your filters.
              </Text>
            </View>
          ) : (
            filteredTaxes.map((tax) => {
              const isDeclined = tax.status === "Declined";

              return (
                <View key={tax.id} style={styles.taxCard}>
                  {/* Card Header: Tax Type (bold) + Status Badge */}
                  <View style={styles.cardHeaderRow}>
                    <Text style={styles.taxTypeTitle}>{tax.taxType}</Text>

                    <View
                      style={[
                        styles.statusPill,
                        isDeclined ? styles.statusPillDeclined : styles.statusPillPending,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusPillText,
                          isDeclined ? styles.statusTextDeclined : styles.statusTextPending,
                        ]}
                      >
                        {tax.status}
                      </Text>
                    </View>
                  </View>

                  {/* Salon & Period Row */}
                  <View style={styles.salonPeriodRow}>
                    {/* Salon */}
                    <View style={styles.salonMetaCol}>
                      <Text style={styles.fieldLabel}>Salon</Text>
                      <View style={styles.salonInfoWrap}>
                        <View style={styles.salonAvatarBox}>
                          <Ionicons name="business" size={14} color="#FFFFFF" />
                        </View>
                        <Text style={styles.salonName} numberOfLines={1}>
                          {tax.salon}
                        </Text>
                      </View>
                    </View>

                    {/* Period */}
                    <View style={styles.periodMetaCol}>
                      <Text style={styles.fieldLabel}>Period</Text>
                      <Text style={styles.periodText}>{tax.period}</Text>
                    </View>
                  </View>

                  {/* Financial & Due Date Row */}
                  <View style={styles.financialRow}>
                    {/* Amount */}
                    <View style={styles.amountCol}>
                      <Text style={styles.fieldLabel}>Amount</Text>
                      <View style={styles.amountPill}>
                        <Text style={styles.amountPillText}>{tax.amount}</Text>
                      </View>
                    </View>

                    {/* Due Date */}
                    <View style={styles.dueDateCol}>
                      <Text style={styles.fieldLabel}>Due Date</Text>
                      <Text style={styles.dueDateText}>{tax.dueDate}</Text>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    paddingBottom: 28,
  },
  headerCard: {
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
    gap: 12,
    zIndex: 100,
  },
  headerTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleWithBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
  },
  countBadge: {
    backgroundColor: "#EEECFF",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  countBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#635BFF",
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 38,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: "#1E293B",
    padding: 0,
  },
  dropdownAnchorWrap: {
    position: "relative",
    zIndex: 999,
  },
  statusFilterBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 38,
    minWidth: 100,
    justifyContent: "space-between",
  },
  statusFilterBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#334155",
  },
  popoverMenu: {
    position: "absolute",
    top: 42,
    left: 0,
    right: 0,
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
    zIndex: 9999,
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
  taxesList: {
    gap: 12,
  },
  taxCard: {
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
    gap: 12,
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
    paddingBottom: 10,
  },
  taxTypeTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E293B",
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusPillDeclined: {
    backgroundColor: "#FEF2F2",
  },
  statusPillPending: {
    backgroundColor: "#FFFBEB",
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: "700",
  },
  statusTextDeclined: {
    color: "#F87171",
  },
  statusTextPending: {
    color: "#F59E0B",
  },
  salonPeriodRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  salonMetaCol: {
    flex: 1,
    paddingRight: 8,
  },
  periodMetaCol: {
    alignItems: "flex-end",
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#94A3B8",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  salonInfoWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  salonAvatarBox: {
    width: 26,
    height: 26,
    borderRadius: 7,
    backgroundColor: "#635BFF",
    alignItems: "center",
    justifyContent: "center",
  },
  salonName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
    flexShrink: 1,
  },
  periodText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#64748B",
  },
  financialRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  amountCol: {
    alignItems: "flex-start",
  },
  amountPill: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  amountPillText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#635BFF",
    letterSpacing: 0.2,
  },
  dueDateCol: {
    alignItems: "flex-end",
  },
  dueDateText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
  },
  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E293B",
    marginTop: 8,
  },
  emptySub: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
    textAlign: "center",
  },
});
