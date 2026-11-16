import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  ContractItem,
  MOCK_CONTRACTS,
} from "@/data/documentsData";
import CustomModal from "@/components/ui/CustomModal";
import CustomInput from "@/components/ui/CustomInput";
import CustomButton from "@/components/ui/CustomButton";

export default function ContractsTab() {
  const router = useRouter();
  const [contracts, setContracts] = useState<ContractItem[]>(MOCK_CONTRACTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>("All");

  // Modify Contract Modal State
  const [isModifyOpen, setIsModifyOpen] = useState(false);
  const [modifyingContract, setModifyingContract] = useState<ContractItem | null>(null);
  const [modifyType, setModifyType] = useState<ContractItem["type"]>("Full Time");
  const [modifyEndDate, setModifyEndDate] = useState("");
  const [modifySalary, setModifySalary] = useState("");

  // Terminate Contract Modal State
  const [isTerminateOpen, setIsTerminateOpen] = useState(false);
  const [terminatingContract, setTerminatingContract] = useState<ContractItem | null>(null);

  const filterOptions = ["All", "Full Time", "Part Time", "Vat collaboration", "Stage"];

  const filteredContracts = contracts.filter((c) => {
    const matchesSearch =
      c.employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.salon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.employee.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType =
      selectedTypeFilter === "All" || c.type === selectedTypeFilter;
    return matchesSearch && matchesType;
  });

  const activeCount = contracts.filter((c) => c.status === "Active").length;
  const expiringCount = contracts.filter((c) => c.status === "Pending").length;
  const expiredCount = contracts.filter((c) => c.status === "Inactive").length;

  const handleDownload = (contract: ContractItem) => {
    Alert.alert(
      "Download Contract",
      `Generating official PDF for ${contract.employee.name} (${contract.salon.name})...`
    );
  };

  const handleOpenModify = (contract: ContractItem) => {
    setModifyingContract(contract);
    setModifyType(contract.type);
    setModifyEndDate(contract.endDate);
    setModifySalary(contract.salary || "");
    setIsModifyOpen(true);
  };

  const handleOpenTerminate = (contract: ContractItem) => {
    setTerminatingContract(contract);
    setIsTerminateOpen(true);
  };

  const handleModifySubmit = () => {
    if (!modifyingContract) return;

    setContracts((prev) =>
      prev.map((c) =>
        c.id === modifyingContract.id
          ? {
              ...c,
              type: modifyType,
              endDate: modifyEndDate || c.endDate,
              salary: modifySalary || c.salary,
            }
          : c
      )
    );

    setIsModifyOpen(false);
    setModifyingContract(null);
    Alert.alert("Contract Updated", "Changes saved successfully.");
  };

  const handleTerminateSubmit = () => {
    if (!terminatingContract) return;

    setContracts((prev) =>
      prev.map((c) =>
        c.id === terminatingContract.id ? { ...c, status: "Inactive" } : c
      )
    );

    setIsTerminateOpen(false);
    setTerminatingContract(null);
    Alert.alert("Contract Terminated", "Contract status changed to Inactive.");
  };

  const getTypeStyle = (type: ContractItem["type"]) => {
    switch (type) {
      case "Full Time":
        return { border: "#22C55E", text: "#16A34A", bg: "#F0FDF4" };
      case "Part Time":
        return { border: "#8B5CF6", text: "#7C3AED", bg: "#F5F3FF" };
      case "Vat collaboration":
        return { border: "#3B82F6", text: "#2563EB", bg: "#EFF6FF" };
      case "Stage":
        return { border: "#F59E0B", text: "#D97706", bg: "#FFFBEB" };
      default:
        return { border: "#9CA3AF", text: "#4B5563", bg: "#F3F4F6" };
    }
  };

  const getStatusStyle = (status: ContractItem["status"]) => {
    switch (status) {
      case "Active":
        return { text: "#16A34A", bg: "#DCFCE7" };
      case "Pending":
        return { text: "#D97706", bg: "#FEF3C7" };
      case "Inactive":
        return { text: "#6B7280", bg: "#F3F4F6" };
    }
  };

  return (
    <View style={styles.container}>
      {/* Metrics Row */}
      <View style={styles.metricsRow}>
        <View style={[styles.metricCard, { backgroundColor: "#F0FDF4" }]}>
          <View style={styles.metricIconRow}>
            <View style={[styles.metricIconWrap, { backgroundColor: "#22C55E" }]}>
              <Ionicons name="people" size={14} color="#FFFFFF" />
            </View>
            <Text style={styles.metricVal}>{activeCount}</Text>
          </View>
          <Text style={styles.metricTitle}>Active Staff</Text>
        </View>

        <View style={[styles.metricCard, { backgroundColor: "#FFFBEB" }]}>
          <View style={styles.metricIconRow}>
            <View style={[styles.metricIconWrap, { backgroundColor: "#F59E0B" }]}>
              <Ionicons name="time" size={14} color="#FFFFFF" />
            </View>
            <Text style={styles.metricVal}>{expiringCount}</Text>
          </View>
          <Text style={styles.metricTitle}>Expiring Soon</Text>
        </View>

        <View style={[styles.metricCard, { backgroundColor: "#F8FAFC" }]}>
          <View style={styles.metricIconRow}>
            <View style={[styles.metricIconWrap, { backgroundColor: "#64748B" }]}>
              <Ionicons name="archive" size={14} color="#FFFFFF" />
            </View>
            <Text style={styles.metricVal}>{expiredCount}</Text>
          </View>
          <Text style={styles.metricTitle}>Inactive / Ended</Text>
        </View>
      </View>

      {/* Action Bar: Search & New Contract */}
      <View style={styles.actionBar}>
        <View style={styles.searchWrap}>
          <Ionicons name="search-outline" size={18} color="#9CA3AF" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search employee, role, or salon..."
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

        <TouchableOpacity
          style={styles.newContractBtn}
          onPress={() => router.push("/(drawer)/(tabs)/documents/new-contract")}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={18} color="#FFFFFF" />
          <Text style={styles.newContractBtnText}>New</Text>
        </TouchableOpacity>
      </View>

      {/* Contract Type Filter Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterBarContent}
      >
        {filterOptions.map((opt) => (
          <TouchableOpacity
            key={opt}
            style={[
              styles.filterPill,
              selectedTypeFilter === opt && styles.filterPillActive,
            ]}
            onPress={() => setSelectedTypeFilter(opt)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.filterPillText,
                selectedTypeFilter === opt && styles.filterPillTextActive,
              ]}
            >
              {opt}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Contracts List */}
      <View style={styles.contractsList}>
        {filteredContracts.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="document-text-outline" size={44} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>No contracts found</Text>
            <Text style={styles.emptySub}>Try adjusting your search or filters.</Text>
          </View>
        ) : (
          filteredContracts.map((contract) => {
            const typeSty = getTypeStyle(contract.type);
            const statusSty = getStatusStyle(contract.status);

            return (
              <View key={contract.id} style={styles.contractCard}>
                {/* Card Header: Employee & Salon */}
                <View style={styles.contractCardTop}>
                  <View style={styles.employeeInfoWrap}>
                    <View style={styles.employeeAvatar}>
                      <Text style={{ fontSize: 20 }}>{contract.employee.avatarEmoji}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.employeeName}>{contract.employee.name}</Text>
                      <Text style={styles.employeeRole}>{contract.employee.role}</Text>
                    </View>
                  </View>

                  <View style={[styles.statusBadge, { backgroundColor: statusSty.bg }]}>
                    <Text style={[styles.statusBadgeText, { color: statusSty.text }]}>
                      {contract.status}
                    </Text>
                  </View>
                </View>

                {/* Salon & Contract Type Row */}
                <View style={styles.contractDetailsRow}>
                  <View style={styles.salonTagBox}>
                    <Ionicons name="business-outline" size={13} color="#6B7280" style={{ marginRight: 4 }} />
                    <Text style={styles.salonTagName}>{contract.salon.name}</Text>
                  </View>

                  <View
                    style={[
                      styles.typeBadge,
                      { borderColor: typeSty.border, backgroundColor: typeSty.bg },
                    ]}
                  >
                    <Text style={[styles.typeBadgeText, { color: typeSty.text }]}>
                      {contract.type}
                    </Text>
                  </View>
                </View>

                {/* Italian Labour Tags: CCNL & Weekly Hours */}
                {(contract.ccnlLevel || contract.weeklyHours) && (
                  <View style={styles.ccnlRow}>
                    {contract.ccnlLevel && (
                      <View style={styles.ccnlTag}>
                        <Ionicons name="briefcase-outline" size={11} color="#635BFF" style={{ marginRight: 3 }} />
                        <Text style={styles.ccnlText}>{contract.ccnlLevel}</Text>
                      </View>
                    )}
                    {contract.weeklyHours && (
                      <View style={styles.hoursTag}>
                        <Ionicons name="time-outline" size={11} color="#4B5563" style={{ marginRight: 3 }} />
                        <Text style={styles.hoursText}>{contract.weeklyHours}</Text>
                      </View>
                    )}
                  </View>
                )}

                {/* Dates & Salary Row */}
                <View style={styles.datesRow}>
                  <View style={styles.dateCol}>
                    <Text style={styles.dateLabel}>Start Date</Text>
                    <Text style={styles.dateVal}>{contract.startDate}</Text>
                  </View>
                  <View style={styles.dateCol}>
                    <Text style={styles.dateLabel}>End Date</Text>
                    <Text style={styles.dateVal}>{contract.endDate}</Text>
                  </View>
                  {contract.salary && (
                    <View style={styles.dateCol}>
                      <Text style={styles.dateLabel}>Remuneration</Text>
                      <Text style={[styles.dateVal, { color: "#635BFF", fontWeight: "700" }]}>
                        {contract.salary}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Card Actions Footer: Modify & Terminate buttons */}
                <View style={styles.contractCardFooter}>
                  <TouchableOpacity
                    style={styles.modifyBtn}
                    onPress={() => handleOpenModify(contract)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="create-outline" size={14} color="#635BFF" style={{ marginRight: 4 }} />
                    <Text style={styles.modifyBtnText}>Modify</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.terminateBtn}
                    onPress={() => handleOpenTerminate(contract)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="close-circle-outline" size={14} color="#EF4444" style={{ marginRight: 4 }} />
                    <Text style={styles.terminateBtnText}>Terminate</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.downloadBtn}
                    onPress={() => handleDownload(contract)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="download-outline" size={14} color="#10B981" style={{ marginRight: 4 }} />
                    <Text style={styles.downloadBtnText}>Download</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </View>

      {/* ================= MODALS ================= */}

      {/* 1. Modify Contract Modal */}
      <CustomModal
        visible={isModifyOpen}
        onClose={() => setIsModifyOpen(false)}
        title={`Modify Contract - ${modifyingContract?.employee.name}`}
      >
        <View style={{ paddingTop: 4 }}>
          <Text style={styles.inputLabel}>Contract Type</Text>
          <View style={styles.modalPillsRow}>
            {(["Full Time", "Part Time", "Vat collaboration", "Stage"] as const).map((t) => (
              <TouchableOpacity
                key={t}
                style={[styles.modalPill, modifyType === t && styles.modalPillActive]}
                onPress={() => setModifyType(t)}
                activeOpacity={0.7}
              >
                <Text style={[styles.modalPillText, modifyType === t && styles.modalPillTextActive]}>
                  {t}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <CustomInput
            label="End Date"
            value={modifyEndDate}
            onChangeText={setModifyEndDate}
            placeholder="e.g. 31 Dec 2027"
          />

          <CustomInput
            label="Salary / Commission Terms"
            value={modifySalary}
            onChangeText={setModifySalary}
            placeholder="e.g. €2,500 / month"
          />

          <View style={styles.modalBtnsRow}>
            <CustomButton
              title="Cancel"
              onPress={() => setIsModifyOpen(false)}
              variant="outline"
              style={{ flex: 1 }}
            />
            <CustomButton
              title="Save Changes"
              onPress={handleModifySubmit}
              variant="primary"
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </CustomModal>

      {/* 2. Terminate Contract Modal */}
      <CustomModal
        visible={isTerminateOpen}
        onClose={() => setIsTerminateOpen(false)}
        title="Terminate Contract"
      >
        <View style={{ paddingTop: 4, gap: 12 }}>
          <View style={styles.terminateWarningBox}>
            <Ionicons name="warning-outline" size={24} color="#EF4444" />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.terminateWarningTitle}>Confirm Employment Termination</Text>
              <Text style={styles.terminateWarningDesc}>
                Are you sure you want to terminate the contract for{" "}
                <Text style={{ fontWeight: "700" }}>{terminatingContract?.employee.name}</Text>? This will notify HR and mark the contract as Inactive.
              </Text>
            </View>
          </View>

          <View style={styles.modalBtnsRow}>
            <CustomButton
              title="Cancel"
              onPress={() => setIsTerminateOpen(false)}
              variant="outline"
              style={{ flex: 1 }}
            />
            <CustomButton
              title="Terminate"
              onPress={handleTerminateSubmit}
              variant="danger"
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </CustomModal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 14,
    paddingBottom: 28,
  },
  metricsRow: {
    flexDirection: "row",
    gap: 8,
  },
  metricCard: {
    flex: 1,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.04)",
  },
  metricIconRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  metricIconWrap: {
    width: 26,
    height: 26,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  metricVal: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
  },
  metricTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#374151",
  },
  actionBar: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  searchWrap: {
    flex: 1,
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
  newContractBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#635BFF",
    paddingHorizontal: 12,
    height: 42,
    borderRadius: 12,
    justifyContent: "center",
  },
  newContractBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  filterBarContent: {
    gap: 6,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  filterPillActive: {
    backgroundColor: "#635BFF",
    borderColor: "#635BFF",
  },
  filterPillText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#4B5563",
  },
  filterPillTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  contractsList: {
    gap: 10,
  },
  contractCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  contractCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  employeeInfoWrap: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  employeeAvatar: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  employeeName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
  },
  employeeRole: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: "700",
  },
  contractDetailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  salonTagBox: {
    flexDirection: "row",
    alignItems: "center",
  },
  salonTagName: {
    fontSize: 11,
    color: "#4B5563",
    fontWeight: "600",
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: "700",
  },
  ccnlRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 8,
  },
  ccnlTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEECFF",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  ccnlText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#635BFF",
  },
  hoursTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  hoursText: {
    fontSize: 10,
    color: "#4B5563",
    fontWeight: "500",
  },
  datesRow: {
    flexDirection: "row",
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    gap: 12,
  },
  dateCol: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 9,
    color: "#6B7280",
    textTransform: "uppercase",
    fontWeight: "600",
  },
  dateVal: {
    fontSize: 11,
    fontWeight: "700",
    color: "#111827",
    marginTop: 2,
  },
  contractCardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  modifyBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEECFF",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  modifyBtnText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#635BFF",
  },
  terminateBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  terminateBtnText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#EF4444",
  },
  downloadBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  downloadBtnText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#10B981",
  },
  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 30,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    marginTop: 10,
  },
  emptySub: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 4,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 4,
  },
  modalPillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 8,
  },
  modalPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
  },
  modalPillActive: {
    backgroundColor: "#EEECFF",
  },
  modalPillText: {
    fontSize: 11,
    color: "#4B5563",
  },
  modalPillTextActive: {
    color: "#635BFF",
    fontWeight: "700",
  },
  modalBtnsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },
  terminateWarningBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#FEE2E2",
  },
  terminateWarningTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#DC2626",
  },
  terminateWarningDesc: {
    fontSize: 11,
    color: "#7F1D1D",
    marginTop: 2,
    lineHeight: 16,
  },
});
