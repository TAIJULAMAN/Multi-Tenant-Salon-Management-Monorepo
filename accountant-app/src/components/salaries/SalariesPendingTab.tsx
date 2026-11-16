import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Share,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  PendingSalaryItem,
  INITIAL_PENDING_SALARIES,
} from "@/data/salariesData";
import CustomModal from "@/components/ui/CustomModal";

export default function SalariesPendingTab() {
  const [salaries, setSalaries] = useState<PendingSalaryItem[]>(INITIAL_PENDING_SALARIES);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Pending" | "Declined">("All");
  const [salonFilter, setSalonFilter] = useState("All");

  const [selectedItem, setSelectedItem] = useState<PendingSalaryItem | null>(null);

  const salonOptions = [
    "All",
    "Glamour Beauty Roma",
    "Style Studio Milano",
    "Chic Hair & Beauty",
  ];

  const filteredSalaries = salaries.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.salon.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.period.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || s.status === statusFilter;
    const matchesSalon = salonFilter === "All" || s.salon === salonFilter;
    return matchesSearch && matchesStatus && matchesSalon;
  });

  const handleOpenDetails = (item: PendingSalaryItem) => {
    setSelectedItem(item);
  };

  const handleEdit = (item: PendingSalaryItem) => {
    Alert.alert(
      "Edit Salary",
      `Editing salary for ${item.name} (${item.period}). Edit mode will be configured.`
    );
  };

  const handleDelete = (item: PendingSalaryItem) => {
    Alert.alert(
      "Delete Salary Record",
      `Are you sure you want to delete the salary record for ${item.name} (${item.period})?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setSalaries((prev) => prev.filter((s) => s.id !== item.id));
            if (selectedItem?.id === item.id) {
              setSelectedItem(null);
            }
          },
        },
      ]
    );
  };

  const handleDownloadPdf = (item: PendingSalaryItem) => {
    Alert.alert(
      "Download PDF",
      `Official payslip PDF for ${item.name} (${item.period}) has been generated and saved.`
    );
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={18} color="#9CA3AF" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search employee, salon, or period..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={16} color="#9CA3AF" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Status Filter */}
      <View style={styles.statusChipsRow}>
        {(["All", "Pending", "Declined"] as const).map((s) => (
          <TouchableOpacity
            key={s}
            style={[
              styles.statusChip,
              statusFilter === s && styles.statusChipActive,
            ]}
            onPress={() => setStatusFilter(s)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.statusChipText,
                statusFilter === s && styles.statusChipTextActive,
              ]}
            >
              {s}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Salon Filter Scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.salonPillsContent}
      >
        {salonOptions.map((salon) => (
          <TouchableOpacity
            key={salon}
            style={[
              styles.salonPill,
              salonFilter === salon && styles.salonPillActive,
            ]}
            onPress={() => setSalonFilter(salon)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.salonPillText,
                salonFilter === salon && styles.salonPillTextActive,
              ]}
            >
              {salon}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Pending / Declined Salary Cards */}
      <View style={styles.salariesList}>
        {filteredSalaries.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="checkmark-circle-outline" size={48} color="#10B981" />
            <Text style={styles.emptyTitle}>No Pending Salaries</Text>
            <Text style={styles.emptySub}>
              All payroll records are approved or none match your filter.
            </Text>
          </View>
        ) : (
          filteredSalaries.map((item) => {
            return (
              <View key={item.id} style={styles.salaryCard}>
                {/* Card Top */}
                <View style={styles.salaryCardTop}>
                  <View style={styles.avatarBox}>
                    <Text style={{ fontSize: 20 }}>{item.avatarEmoji}</Text>
                  </View>
                  <View style={{ flex: 1, marginHorizontal: 10 }}>
                    <Text style={styles.staffName} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={styles.staffMeta} numberOfLines={1}>
                      {item.salon}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.statusBadge,
                      item.status === "Pending"
                        ? styles.statusBadgePending
                        : styles.statusBadgeDeclined,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusBadgeText,
                        item.status === "Pending"
                          ? styles.statusTextPending
                          : styles.statusTextDeclined,
                      ]}
                    >
                      {item.status}
                    </Text>
                  </View>
                </View>

                {/* Financial Figures & Period Row */}
                <View style={styles.figuresRow}>
                  <View>
                    <Text style={styles.figLabel}>Period</Text>
                    <Text style={styles.periodVal}>{item.period}</Text>
                  </View>
                  <View style={{ alignItems: "center" }}>
                    <Text style={styles.figLabel}>Gross Amount</Text>
                    <Text style={styles.grossVal}>€{item.gross.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={styles.figLabel}>Net Amount</Text>
                    <Text style={styles.netVal}>€{item.net.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>
                  </View>
                </View>

                {/* Actions Footer */}
                <View style={styles.cardFooter}>
                  <TouchableOpacity
                    style={styles.detailsBtn}
                    onPress={() => handleOpenDetails(item)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="eye-outline" size={15} color="#635BFF" style={{ marginRight: 6 }} />
                    <Text style={styles.detailsBtnText}>View Details</Text>
                  </TouchableOpacity>

                  <View style={styles.quickActionsGroup}>
                    <TouchableOpacity
                      style={styles.quickActionBtn}
                      onPress={() => handleEdit(item)}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="pencil-outline" size={15} color="#4B5563" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.quickActionBtn, { backgroundColor: "#FEF2F2" }]}
                      onPress={() => handleDelete(item)}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="trash-outline" size={15} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })
        )}
      </View>

      {/* ================= SALARY DETAILS MODAL ================= */}
      {selectedItem && (
        <CustomModal
          visible={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          title="Salary Details"
        >
          <View style={styles.modalBody}>
            {/* Top Employee Card */}
            <View style={styles.modalCardBox}>
              <View style={styles.modalEmployeeRow}>
                <View style={styles.modalAvatarBox}>
                  <Text style={{ fontSize: 24 }}>{selectedItem.avatarEmoji}</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.modalEmployeeName}>{selectedItem.name}</Text>
                  <Text style={styles.modalSalonName}>{selectedItem.salon}</Text>
                </View>
              </View>

              <View style={styles.modalPeriodBox}>
                <Text style={styles.modalSectionLabel}>Period</Text>
                <Text style={styles.modalPeriodValue}>{selectedItem.period}</Text>
              </View>

              <View style={styles.modalAmountsRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.modalSectionLabel}>Gross Amount</Text>
                  <View style={styles.grossBadge}>
                    <Text style={styles.grossBadgeText}>
                      € {selectedItem.gross.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Text>
                  </View>
                </View>

                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.modalSectionLabel}>Net Amount</Text>
                  <View style={styles.netBadge}>
                    <Text style={styles.netBadgeText}>
                      € {selectedItem.net.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Decline Reason Banner (Matching Screenshot 1) */}
            {(selectedItem.status === "Declined" || selectedItem.reason) && (
              <View style={styles.declineBanner}>
                <Ionicons name="alert-circle-outline" size={20} color="#EF4444" style={{ marginRight: 8, marginTop: 1 }} />
                <Text style={styles.declineBannerText}>
                  <Text style={{ fontWeight: "700" }}>Decline Reason — </Text>
                  {selectedItem.reason || "Incorrect gross amount calculation. Please verify the overtime hours."}
                </Text>
              </View>
            )}

            {/* Modal Actions Footer */}
            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={styles.editResubmitBtn}
                onPress={() => handleEdit(selectedItem)}
                activeOpacity={0.8}
              >
                <Text style={styles.editResubmitBtnText}>Edit & Resubmit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.downloadPdfBtn}
                onPress={() => handleDownloadPdf(selectedItem)}
                activeOpacity={0.8}
              >
                <Text style={styles.downloadPdfBtnText}>Download PDF</Text>
              </TouchableOpacity>
            </View>
          </View>
        </CustomModal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    paddingBottom: 28,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 42,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: "#111827",
  },
  statusChipsRow: {
    flexDirection: "row",
    gap: 8,
  },
  statusChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  statusChipActive: {
    backgroundColor: "#635BFF",
    borderColor: "#635BFF",
  },
  statusChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4B5563",
  },
  statusChipTextActive: {
    color: "#FFFFFF",
  },
  salonPillsContent: {
    gap: 8,
  },
  salonPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  salonPillActive: {
    backgroundColor: "#EEECFF",
    borderColor: "#635BFF",
  },
  salonPillText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4B5563",
  },
  salonPillTextActive: {
    color: "#635BFF",
    fontWeight: "700",
  },
  salariesList: {
    gap: 12,
  },
  salaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
    position: "relative",
  },
  salaryCardTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  staffName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
  staffMeta: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  topRightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusBadgePending: {
    backgroundColor: "#FEF3C7",
  },
  statusBadgeDeclined: {
    backgroundColor: "#FEE2E2",
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  statusTextPending: {
    color: "#D97706",
  },
  statusTextDeclined: {
    color: "#DC2626",
  },
  figuresRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  figLabel: {
    fontSize: 10,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  periodVal: {
    fontSize: 12,
    fontWeight: "700",
    color: "#111827",
    marginTop: 2,
  },
  grossVal: {
    fontSize: 13,
    fontWeight: "700",
    color: "#4B5563",
    marginTop: 2,
  },
  netVal: {
    fontSize: 14,
    fontWeight: "800",
    color: "#10B981",
    marginTop: 2,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 10,
  },
  detailsBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEECFF",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  detailsBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#635BFF",
  },
  quickActionsGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  quickActionBtn: {
    padding: 7,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
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
    color: "#9CA3AF",
    marginTop: 2,
  },
  modalBody: {
    gap: 14,
    paddingTop: 2,
  },
  modalCardBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  modalEmployeeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  modalAvatarBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  modalEmployeeName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  modalSalonName: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },
  modalPeriodBox: {
    marginBottom: 16,
  },
  modalSectionLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 4,
  },
  modalPeriodValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
  modalAmountsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  grossBadge: {
    backgroundColor: "#EEECFF",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  grossBadgeText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#635BFF",
  },
  netBadge: {
    backgroundColor: "#ECFDF5",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  netBadgeText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#10B981",
  },
  declineBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FEF2F2",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FECACA",
    padding: 12,
  },
  declineBannerText: {
    flex: 1,
    fontSize: 12,
    color: "#EF4444",
    lineHeight: 18,
  },
  modalButtonsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
  editResubmitBtn: {
    flex: 1,
    backgroundColor: "#EEECFF",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  editResubmitBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#635BFF",
  },
  downloadPdfBtn: {
    flex: 1,
    backgroundColor: "#4F46E5",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  downloadPdfBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
