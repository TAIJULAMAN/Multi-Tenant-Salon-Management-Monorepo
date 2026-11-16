import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  RefreshControl,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Header from "@/components/Header";
import Avatar from "@/components/Avatar";
import TeamStatCards from "@/components/team/TeamStatCards";
import {
  initialTeamMembers,
  initialPendingSalaries,
  initialApprovedSalaries,
  initialSalaryHistoryGroups,
  initialScheduledShiftsData,
  initialWorkedShiftsData,
  initialMatrixScheduledShifts,
  initialDashboardWorkedShifts,
  MemberData,
  SalaryRecord,
  SalaryMonthGroup,
  ScheduledShiftRecord,
  WorkedShiftRecord,
  MatrixScheduledShift,
  DashboardWorkedShift,
} from "@/components/team/teamData";
import { teamStore } from "@/components/team/CreateTeam/teamStore";
import ScheduledShiftsView from "@/components/team/ScheduledShiftsView";

// Modals
import AddOptionsDropdownModal, { ScheduledAddOption } from "@/components/team/modals/AddOptionsDropdownModal";
import AddTimeOffModal from "@/components/team/modals/AddTimeOffModal";
import AddBlockedTimeModal from "@/components/team/modals/AddBlockedTimeModal";
import AddClosedPeriodModal from "@/components/team/modals/AddClosedPeriodModal";
import AddWorkedShiftModal from "@/components/team/modals/AddWorkedShiftModal";
import EditShiftModal from "@/components/team/modals/EditShiftModal";
import EditWorkedShiftModal from "@/components/team/modals/EditWorkedShiftModal";
import DeleteConfirmModal from "@/components/team/modals/DeleteConfirmModal";
import ViewWorkedShiftModal from "@/components/team/modals/ViewWorkedShiftModal";
import ViewPayslipModal from "@/components/team/modals/ViewPayslipModal";

type SectionTab = "Members" | "Salaries" | "Scheduled Shifts" | "Worked Shifts";

export default function TeamScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SectionTab>("Members");
  const [refreshing, setRefreshing] = useState(false);

  // Members data state from store
  const [members, setMembers] = useState<MemberData[]>(initialTeamMembers);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");
  const [selectedContract, setSelectedContract] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Salaries state
  const [salariesSubTab, setSalariesSubTab] = useState<"Pending Approval" | "Payment History">("Pending Approval");
  const [pendingSalaries, setPendingSalaries] = useState<SalaryRecord[]>(initialPendingSalaries);
  const [approvedSalaries, setApprovedSalaries] = useState<SalaryRecord[]>(initialApprovedSalaries);
  const [salaryHistoryGroups, setSalaryHistoryGroups] = useState<SalaryMonthGroup[]>(initialSalaryHistoryGroups);
  const [expandedSalaryIds, setExpandedSalaryIds] = useState<string[]>(["1", "h1"]);
  const [salarySearch, setSalarySearch] = useState("");

  // Shifts state
  const [scheduledShifts, setScheduledShifts] = useState<ScheduledShiftRecord[]>(initialScheduledShiftsData);
  const [workedShifts, setWorkedShifts] = useState<WorkedShiftRecord[]>(initialWorkedShiftsData);

  // Modals state
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [isTimeOffOpen, setIsTimeOffOpen] = useState(false);
  const [isBlockedTimeOpen, setIsBlockedTimeOpen] = useState(false);
  const [isClosedPeriodOpen, setIsClosedPeriodOpen] = useState(false);
  const [isAddWorkedShiftOpen, setIsAddWorkedShiftOpen] = useState(false);

  // Edit / Delete / View item modals
  const [editingScheduledShift, setEditingScheduledShift] = useState<ScheduledShiftRecord | null>(null);
  const [editingWorkedShift, setEditingWorkedShift] = useState<WorkedShiftRecord | null>(null);
  const [deletingItem, setDeletingItem] = useState<{ type: "scheduled" | "worked"; id: string; name: string } | null>(null);
  const [viewingWorkedShift, setViewingWorkedShift] = useState<WorkedShiftRecord | null>(null);
  const [viewingPayslip, setViewingPayslip] = useState<SalaryRecord | null>(null);

  // Scheduled Shifts Matrix state (matching Image 1)
  const [matrixShifts, setMatrixShifts] = useState<MatrixScheduledShift[]>(initialMatrixScheduledShifts);
  const [editingMatrixShift, setEditingMatrixShift] = useState<{
    member: MatrixScheduledShift;
    dayKey: "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat";
    currentVal?: string | null;
  } | null>(null);

  // Worked Shifts state (matching Image 2)
  const [workedList, setWorkedList] = useState<DashboardWorkedShift[]>(initialDashboardWorkedShifts);
  const [workedSearchQuery, setWorkedSearchQuery] = useState<string>("");
  const [workedPage, setWorkedPage] = useState<number>(1);
  const [addMenuAnchor, setAddMenuAnchor] = useState<{ top: number; right: number } | null>(null);



  useEffect(() => {
    const unsubscribe = teamStore.subscribe(() => {
      const storeMembers = teamStore.getMembers();
      setMembers((prev) =>
        prev.map((m) => {
          const found = storeMembers.find((sm) => sm.id === m.id);
          return found ? { ...m, ...found } : m;
        })
      );
    });
    return unsubscribe;
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 600);
  }, []);

  const roles = ["All", "Manager", "Staff", "Accountant"];
  const contracts = ["All", "Full Time", "Part Time", "Stage", "Vat collaboration"];

  const handleExportMembers = () => {
    Alert.alert("Export Data", "Exporting team members list (CSV/PDF)...");
  };

  // Handlers for Add menu options (Matching Scheduled Shifts Dashboard dropdown)
  const handleSelectAddOption = (option: ScheduledAddOption) => {
    setIsAddMenuOpen(false);
    if (option === "shift") setIsAddWorkedShiftOpen(true);
    else if (option === "time_off") setIsTimeOffOpen(true);
    else if (option === "blocked_time") setIsBlockedTimeOpen(true);
    else if (option === "closed_period") setIsClosedPeriodOpen(true);
  };

  // Salary actions
  const toggleSalaryRow = (id: string) => {
    if (expandedSalaryIds.includes(id)) {
      setExpandedSalaryIds(expandedSalaryIds.filter((item) => item !== id));
    } else {
      setExpandedSalaryIds([...expandedSalaryIds, id]);
    }
  };

  const handleApproveSalary = (id: string) => {
    const record = pendingSalaries.find((s) => s.id === id);
    if (record) {
      setPendingSalaries((prev) => prev.filter((s) => s.id !== id));
      setApprovedSalaries((prev) => [...prev, { ...record, status: "Approved" }]);
      Alert.alert("Approved", `Salary for ${record.name} is now approved and ready for payment.`);
    }
  };

  const handleRejectSalary = (id: string) => {
    const record = pendingSalaries.find((s) => s.id === id);
    if (record) {
      setPendingSalaries((prev) => prev.filter((s) => s.id !== id));
      Alert.alert("Rejected", `Salary review for ${record.name} rejected.`);
    }
  };

  const handleApproveAll = () => {
    if (pendingSalaries.length === 0) return;
    Alert.alert(
      "Approval All",
      `Approve all ${pendingSalaries.length} pending salaries and move them to Ready for Payment?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Approve All",
          onPress: () => {
            const approvedList = pendingSalaries.map((s) => ({
              ...s,
              status: "Approved" as const,
            }));
            setApprovedSalaries((prev) => [...prev, ...approvedList]);
            setPendingSalaries([]);
            Alert.alert("Success", `All ${approvedList.length} salaries have been approved.`);
          },
        },
      ]
    );
  };

  const handleReapproveAll = () => {
    Alert.alert(
      "Reapproval All",
      `Send re-approval notification for all ${pendingSalaries.length} pending salaries?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: () => {
            Alert.alert("Reapproval Requested", "All records have been notified for re-review.");
          },
        },
      ]
    );
  };

  const handlePayNow = (record: SalaryRecord) => {
    Alert.alert(
      "Revolut Payment",
      `Process net payout of ${record.netAmount} to ${record.name} via Revolut?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Pay Now",
          onPress: () => {
            setApprovedSalaries((prev) => prev.filter((s) => s.id !== record.id));
            setSalaryHistoryGroups((prev) =>
              prev.map((g) => {
                if (g.month === "December 2024") {
                  return {
                    ...g,
                    paymentsCount: g.paymentsCount + 1,
                    records: [{ ...record, status: "paid", month: "December 2024" }, ...g.records],
                  };
                }
                return g;
              })
            );
            Alert.alert("Payment Successful", `Transfer of ${record.netAmount} to ${record.name} was completed.`);
          },
        },
      ]
    );
  };

  const handleMarkAsPaid = (record: SalaryRecord) => {
    setApprovedSalaries((prev) => prev.filter((s) => s.id !== record.id));
    setSalaryHistoryGroups((prev) =>
      prev.map((g) => {
        if (g.month === "December 2024") {
          return {
            ...g,
            paymentsCount: g.paymentsCount + 1,
            records: [{ ...record, status: "paid", month: "December 2024" }, ...g.records],
          };
        }
        return g;
      })
    );
    Alert.alert("Marked as Paid", `Salary for ${record.name} has been archived in Payment History.`);
  };

  // Delete handlers
  const handleConfirmDelete = () => {
    if (!deletingItem) return;
    if (deletingItem.type === "scheduled") {
      setScheduledShifts(scheduledShifts.filter((s) => s.id !== deletingItem.id));
      Alert.alert("Deleted", "Scheduled shift deleted.");
    } else if (deletingItem.type === "worked") {
      setWorkedShifts(workedShifts.filter((w) => w.id !== deletingItem.id));
      Alert.alert("Deleted", "Worked shift log deleted.");
    }
    setDeletingItem(null);
  };

  // Status badges
  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case "Manager":
        return { bg: "#E0F7FA", text: "#00838F", border: "#B2EBF2" };
      case "Staff":
        return { bg: "#FFF9C4", text: "#F57F17", border: "#FFF59D" };
      case "Accountant":
        return { bg: "#F3E8FF", text: "#7E22CE", border: "#E9D5FF" };
      default:
        return { bg: "#F1F5F9", text: "#475569", border: "#E2E8F0" };
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "Active":
        return { bg: "#DCFCE7", text: "#15803D", dot: "#22C55E" };
      case "Pending":
      case "pending":
        return { bg: "#FEF9C3", text: "#A16207", dot: "#EAB308" };
      case "Inactive":
        return { bg: "#FEE2E2", text: "#B91C1C", dot: "#EF4444" };
      case "Approved":
        return { bg: "#DCFCE7", text: "#16A34A", dot: "#22C55E" };
      default:
        return { bg: "#F1F5F9", text: "#64748B", dot: "#94A3B8" };
    }
  };

  // Filtered members
  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === "All" || member.role === selectedRole;
    const matchesContract = selectedContract === "All" || member.contractType === selectedContract;
    const matchesStatus = selectedStatus === "All" || member.status === selectedStatus;
    return matchesSearch && matchesRole && matchesContract && matchesStatus;
  });

  const pendingTotalFormatted = `€ ${(pendingSalaries.length * 3200).toLocaleString("en-US", {
    minimumFractionDigits: 2,
  })}`;
  const approvedTotalFormatted = `€ ${(approvedSalaries.length * 3200).toLocaleString("en-US", {
    minimumFractionDigits: 2,
  })}`;
  const historyTotalPayments = salaryHistoryGroups.reduce((acc, g) => acc + g.records.length, 0);

  const handleExportScheduled = () => {
    Alert.alert("Export Data", "Exporting weekly scheduled shifts report (CSV/PDF)...");
  };

  const handleExportWorked = () => {
    Alert.alert("Export Data", "Exporting worked shifts report for December (CSV)...");
  };

  const handleOpenMemberWorkedShifts = (item: DashboardWorkedShift) => {
    router.push({
      pathname: "/(drawer)/(tabs)/team/workedShift/[id]",
      params: {
        id: item.id,
        name: item.name,
        role: item.role,
        avatarUrl: item.avatarUrl,
        hours: item.hours,
        daysWorked: item.daysWorked.toString(),
        avgHoursDay: "7.9h",
        uploader: item.uploader,
      },
    } as any);
  };


  // Filter & Pagination for Worked Shifts (5 per page)
  const filteredWorked = workedList.filter(
    (w) =>
      w.name.toLowerCase().includes(workedSearchQuery.toLowerCase()) ||
      w.role.toLowerCase().includes(workedSearchQuery.toLowerCase()) ||
      w.uploader.toLowerCase().includes(workedSearchQuery.toLowerCase())
  );
  const workedStart = (workedPage - 1) * 5;
  const currentWorkedPageMembers = filteredWorked.slice(workedStart, workedStart + 5);


  return (
    <View style={styles.container}>
      <Header />

      {/* TOP HUB HEADER (Flat edge-to-edge as before) */}
      <View style={styles.topHubHeader}>
        <View style={styles.hubHeaderContainer}>
          <View style={styles.hubTitleRow}>
            <View style={styles.hubTitleCol}>
              <Text style={styles.hubTitle} numberOfLines={1}>Team</Text>
              <Text style={styles.hubSubtitle} numberOfLines={1}>Staff, scheduling & payroll</Text>
            </View>
          </View>
        </View>

        {/* 4 Navigation Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsScroll}
          contentContainerStyle={styles.tabsContainer}
        >
          {(
            ["Members", "Salaries", "Scheduled Shifts", "Worked Shifts"] as SectionTab[]
          ).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.tabButton, isActive && styles.tabButtonActive]}
                onPress={() => setActiveTab(tab)}
                activeOpacity={0.7}
              >
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                  {tab}
                </Text>
                {isActive && <View style={styles.activeTabIndicator} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.contentScrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* ========================================================================= */}
        {/* TAB 1: MEMBERS */}
        {/* ========================================================================= */}
        {activeTab === "Members" && (
          <View style={styles.sectionWrapper}>
            {/* Members Action Bar (Matching Dashboard: Import Members, Export Data, Add Employee) */}
            <View style={styles.membersActionBar}>
              <TouchableOpacity
                style={styles.membersImportBtn}
                onPress={() => router.push("/(drawer)/(tabs)/team/import" as any)}
                activeOpacity={0.8}
              >
                <Ionicons name="cloud-upload-outline" size={14} color="#635BFF" />
                <Text style={styles.membersImportBtnText} numberOfLines={1}>Import</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.membersExportBtn}
                onPress={handleExportMembers}
                activeOpacity={0.8}
              >
                <Ionicons name="download-outline" size={14} color="#635BFF" />
                <Text style={styles.membersExportBtnText} numberOfLines={1}>Export</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.membersAddEmployeeBtn}
                onPress={() => router.push("/(drawer)/(tabs)/team/add" as any)}
                activeOpacity={0.85}
              >
                <Ionicons name="person-add" size={14} color="#FFFFFF" />
                <Text style={styles.membersAddEmployeeBtnText} numberOfLines={1}>Add Employee</Text>
              </TouchableOpacity>
            </View>

            <TeamStatCards membersCount={members.length} />

            <View style={styles.searchBarContainer}>
              <Ionicons name="search" size={18} color="#94A3B8" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search member by name or email..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#94A3B8"
              />
              {searchQuery ? (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <Ionicons name="close-circle" size={18} color="#94A3B8" />
                </TouchableOpacity>
              ) : null}
            </View>

            {/* Filter Chips */}
            <View style={styles.filterGroup}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
                {roles.map((role) => (
                  <TouchableOpacity
                    key={role}
                    style={[styles.chip, selectedRole === role && styles.chipActive]}
                    onPress={() => setSelectedRole(role)}
                  >
                    <Text style={[styles.chipText, selectedRole === role && styles.chipTextActive]}>
                      {role}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Members List */}
            <View style={styles.cardsList}>
              {filteredMembers.map((member) => {
                const roleBadge = getRoleBadgeStyle(member.role);
                const statusBadge = getStatusBadgeStyle(member.status);

                return (
                  <TouchableOpacity
                    key={member.id}
                    style={styles.memberCard}
                    onPress={() => router.push(`/(drawer)/(tabs)/team/details/${member.id}` as any)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.cardHeader}>
                      <Avatar name={member.name} uri={member.avatarUrl} size={48} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.memberName}>{member.name}</Text>
                        <Text style={styles.memberEmail}>{member.email}</Text>
                      </View>

                      <TouchableOpacity
                        style={styles.viewMemberEyeBtn}
                        onPress={() => router.push(`/(drawer)/(tabs)/team/details/${member.id}` as any)}
                        activeOpacity={0.7}
                      >
                        <Ionicons name="eye-outline" size={18} color="#635BFF" />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.badgesRow}>
                      <View style={[styles.roleBadge, { backgroundColor: roleBadge.bg, borderColor: roleBadge.border }]}>
                        <Text style={[styles.roleBadgeText, { color: roleBadge.text }]}>{member.role}</Text>
                      </View>
                      <View style={[styles.statusBadge, { backgroundColor: statusBadge.bg }]}>
                        <View style={[styles.statusDot, { backgroundColor: statusBadge.dot }]} />
                        <Text style={[styles.statusBadgeText, { color: statusBadge.text }]}>{member.status}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: SALARIES (Exact Parity with Web Dashboard Screenshots 2 & 3) */}
        {/* ========================================================================= */}
        {activeTab === "Salaries" && (
          <View style={styles.sectionWrapper}>
            {/* Sub Tabs */}
            <View style={styles.salarySubTabsRow}>
              <TouchableOpacity
                style={[styles.salarySubTab, salariesSubTab === "Pending Approval" && styles.salarySubTabActive]}
                onPress={() => setSalariesSubTab("Pending Approval")}
              >
                <Text style={[styles.salarySubTabText, salariesSubTab === "Pending Approval" && styles.salarySubTabTextActive]}>
                  Pending Approval ({pendingSalaries.length})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.salarySubTab, salariesSubTab === "Payment History" && styles.salarySubTabActive]}
                onPress={() => setSalariesSubTab("Payment History")}
              >
                <Text style={[styles.salarySubTabText, salariesSubTab === "Payment History" && styles.salarySubTabTextActive]}>
                  Payment History ({historyTotalPayments})
                </Text>
              </TouchableOpacity>
            </View>

            {/* TAB 2.1: PENDING APPROVAL (Contains both Pending Review + Approved and Ready for Payment) */}
            {salariesSubTab === "Pending Approval" && (
              <View style={{ gap: 16 }}>
                {/* SECTION 1: PENDING REVIEW */}
                <View style={styles.salarySectionCard}>
                  <View style={styles.salarySectionHeader}>
                    <Text style={styles.salarySectionTitle}>Pending Review</Text>

                    <View style={styles.pendingReviewControlsRow}>
                      <View style={styles.salarySearchInputBox}>
                        <Ionicons name="search" size={15} color="#94A3B8" />
                        <TextInput
                          style={styles.salarySearchInput}
                          placeholder="Search..."
                          placeholderTextColor="#94A3B8"
                          value={salarySearch}
                          onChangeText={setSalarySearch}
                        />
                      </View>

                      <View style={styles.bulkButtonsRow}>
                        <TouchableOpacity
                          style={styles.reapprovalBtn}
                          onPress={handleReapproveAll}
                          activeOpacity={0.8}
                        >
                          <Text style={styles.reapprovalBtnText}>
                            Reapproval All ({pendingSalaries.length})
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.approvalAllBtn}
                          onPress={handleApproveAll}
                          activeOpacity={0.8}
                        >
                          <Text style={styles.approvalAllBtnText}>
                            Approval All ({pendingSalaries.length})
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>

                  {/* List of Pending Review records */}
                  <View style={styles.salaryListContainer}>
                    {pendingSalaries
                      .filter((s) =>
                        s.name.toLowerCase().includes(salarySearch.toLowerCase())
                      )
                      .map((salary) => {
                        const isExpanded = expandedSalaryIds.includes(salary.id);
                        return (
                          <View key={salary.id} style={styles.salaryRecordItem}>
                            <View style={styles.salaryCardHeader}>
                              <Avatar name={salary.name} uri={salary.avatarUrl} size={38} />
                              <View style={{ flex: 1, marginLeft: 10 }}>
                                <Text style={styles.salaryCardName}>{salary.name}</Text>
                                <Text style={styles.salaryCardUploader}>
                                  Uploaded by: {salary.uploader}
                                </Text>
                              </View>
                              <View style={styles.salaryCardRolePill}>
                                <Text style={styles.salaryCardRoleText}>{salary.role}</Text>
                              </View>
                            </View>

                            {/* Amount & Status Row */}
                            <View style={styles.salaryCardAmountRow}>
                              <View>
                                <Text style={styles.salaryCardAmount}>{salary.netAmount}</Text>
                                <Text style={styles.salaryCardMetaText}>
                                  {salary.month} · {salary.date}
                                </Text>
                              </View>
                              <View style={styles.statusBadgeReview}>
                                <Text style={styles.statusTextReview}>Under Review</Text>
                              </View>
                            </View>

                            {/* Actions Row */}
                            <View style={styles.salaryCardActionsRow}>
                              <TouchableOpacity
                                style={styles.expandChevronBtn}
                                onPress={() => toggleSalaryRow(salary.id)}
                                activeOpacity={0.7}
                              >
                                <Ionicons
                                  name={isExpanded ? "chevron-up" : "chevron-down"}
                                  size={15}
                                  color="#635BFF"
                                />
                                <Text style={styles.expandChevronText}>
                                  {isExpanded ? "Hide" : "Details"}
                                </Text>
                              </TouchableOpacity>

                              <View style={styles.actionButtonsFlexRow}>
                                <TouchableOpacity
                                  style={styles.approveCardBtn}
                                  onPress={() => handleApproveSalary(salary.id)}
                                  activeOpacity={0.8}
                                >
                                  <Ionicons name="checkmark" size={14} color="#0D9488" />
                                  <Text style={styles.approveCardBtnText}>Approve</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                  style={styles.rejectCardBtn}
                                  onPress={() => handleRejectSalary(salary.id)}
                                  activeOpacity={0.8}
                                >
                                  <Ionicons name="close" size={14} color="#F43F5E" />
                                  <Text style={styles.rejectCardBtnText}>Reject</Text>
                                </TouchableOpacity>
                              </View>
                            </View>

                            {/* Expanded Breakdown Drawer */}
                            {isExpanded && (
                              <View style={styles.salaryExpandedBox}>
                                <View style={styles.breakdownGrid}>
                                  <View style={styles.breakdownItem}>
                                    <Text style={styles.breakdownLabel}>GROSS SALARY</Text>
                                    <Text style={styles.breakdownVal}>{salary.grossSalary}</Text>
                                  </View>
                                  <View style={styles.breakdownItem}>
                                    <Text style={styles.breakdownLabel}>NET SALARY</Text>
                                    <Text style={styles.breakdownVal}>{salary.netSalary}</Text>
                                  </View>
                                  <View style={styles.breakdownItem}>
                                    <Text style={styles.breakdownLabel}>TRF (MONTHLY)</Text>
                                    <Text style={styles.breakdownVal}>{salary.trfMonthly}</Text>
                                  </View>
                                  <View style={styles.breakdownItem}>
                                    <Text style={styles.breakdownLabel}>CUMULATIVE TRF</Text>
                                    <Text style={styles.breakdownVal}>{salary.cumulativeTrf}</Text>
                                  </View>
                                  <View style={[styles.breakdownItem, { width: "100%" }]}>
                                    <Text style={styles.breakdownLabel}>IBAN</Text>
                                    <Text style={styles.breakdownValMono}>{salary.iban}</Text>
                                  </View>
                                </View>

                                <TouchableOpacity style={styles.viewPayslipPillBtn}
                                    onPress={() => setViewingPayslip(salary)}
                                    activeOpacity={0.8}
                                  >
                                    <Ionicons name="eye-outline" size={14} color="#635BFF" />
                                    <Text style={styles.viewPayslipPillBtnText}>View Payslip</Text>
                                  </TouchableOpacity>
                              </View>
                            )}
                          </View>
                        );
                      })}

                    {pendingSalaries.length === 0 && (
                      <View style={styles.emptyContainer}>
                        <Ionicons name="checkmark-circle-outline" size={36} color="#10B981" />
                        <Text style={styles.emptyTitle}>All caught up!</Text>
                        <Text style={styles.emptyDesc}>
                          There are no pending salaries awaiting your review.
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Section Total Banner */}
                  <View style={styles.salarySectionFooter}>
                    <Text style={styles.sectionFooterTotalLabel}>Total Amount</Text>
                    <View style={styles.purplePillBadge}>
                      <Text style={styles.purplePillBadgeText}>{pendingTotalFormatted}</Text>
                    </View>
                  </View>
                </View>

                {/* SECTION 2: APPROVED AND READY FOR PAYMENT */}
                <View style={styles.salarySectionCard}>
                  <View style={styles.salarySectionHeader}>
                    <Text style={styles.salarySectionTitle}>
                      Approved and Ready for Payment
                    </Text>
                  </View>

                  <View style={styles.salaryListContainer}>
                    {approvedSalaries.map((salary) => {
                      const isExpanded = expandedSalaryIds.includes(salary.id);
                      return (
                        <View key={salary.id} style={styles.salaryRecordItem}>
                          <View style={styles.salaryCardHeader}>
                            <Avatar name={salary.name} uri={salary.avatarUrl} size={38} />
                            <View style={{ flex: 1, marginLeft: 10 }}>
                              <Text style={styles.salaryCardName}>{salary.name}</Text>
                              <Text style={styles.salaryCardUploader}>
                                Uploaded by: {salary.uploader}
                              </Text>
                            </View>
                            <View style={styles.salaryCardRolePill}>
                              <Text style={styles.salaryCardRoleText}>{salary.role}</Text>
                            </View>
                          </View>

                          {/* Amount & Status Row */}
                          <View style={styles.salaryCardAmountRow}>
                            <View>
                              <Text style={styles.salaryCardAmount}>{salary.netAmount}</Text>
                              <Text style={styles.salaryCardMetaText}>{salary.date}</Text>
                            </View>
                            <View style={styles.statusBadgeApproved}>
                              <Text style={styles.statusTextApproved}>Approved</Text>
                            </View>
                          </View>

                          {/* Actions Row */}
                          <View style={styles.salaryCardActionsRow}>
                            <TouchableOpacity
                              style={styles.expandChevronBtn}
                              onPress={() => toggleSalaryRow(salary.id)}
                              activeOpacity={0.7}
                            >
                              <Ionicons
                                name={isExpanded ? "chevron-up" : "chevron-down"}
                                size={15}
                                color="#635BFF"
                              />
                              <Text style={styles.expandChevronText}>
                                {isExpanded ? "Hide" : "Details"}
                              </Text>
                            </TouchableOpacity>

                            <View style={styles.actionButtonsFlexRow}>
                              <TouchableOpacity
                                style={styles.payNowBtn}
                                onPress={() => handlePayNow(salary)}
                                activeOpacity={0.8}
                              >
                                <Ionicons name="flash-outline" size={13} color="#FFFFFF" />
                                <Text style={styles.payNowBtnText}>Pay Now</Text>
                              </TouchableOpacity>

                              <TouchableOpacity
                                style={styles.markAsPaidBtn}
                                onPress={() => handleMarkAsPaid(salary)}
                                activeOpacity={0.8}
                              >
                                <Ionicons name="checkmark-done-outline" size={14} color="#FFFFFF" />
                                <Text style={styles.markAsPaidBtnText}>Mark as Paid</Text>
                              </TouchableOpacity>
                            </View>
                          </View>

                          {/* Expanded Breakdown Drawer */}
                          {isExpanded && (
                            <View style={styles.salaryExpandedBox}>
                              <View style={styles.breakdownGrid}>
                                <View style={styles.breakdownItem}>
                                  <Text style={styles.breakdownLabel}>GROSS SALARY</Text>
                                  <Text style={styles.breakdownVal}>{salary.grossSalary}</Text>
                                </View>
                                <View style={styles.breakdownItem}>
                                  <Text style={styles.breakdownLabel}>NET SALARY</Text>
                                  <Text style={styles.breakdownVal}>{salary.netSalary}</Text>
                                </View>
                                <View style={styles.breakdownItem}>
                                  <Text style={styles.breakdownLabel}>TRF (MONTHLY)</Text>
                                  <Text style={styles.breakdownVal}>{salary.trfMonthly}</Text>
                                </View>
                                <View style={styles.breakdownItem}>
                                  <Text style={styles.breakdownLabel}>CUMULATIVE TRF</Text>
                                  <Text style={styles.breakdownVal}>{salary.cumulativeTrf}</Text>
                                </View>
                                <View style={[styles.breakdownItem, { width: "100%" }]}>
                                  <Text style={styles.breakdownLabel}>IBAN</Text>
                                  <Text style={styles.breakdownValMono}>{salary.iban}</Text>
                                </View>
                              </View>

                              <TouchableOpacity style={styles.viewPayslipPillBtn}
                                  onPress={() => setViewingPayslip(salary)}
                                  activeOpacity={0.8}
                                >
                                  <Ionicons name="eye-outline" size={14} color="#635BFF" />
                                  <Text style={styles.viewPayslipPillBtnText}>View Payslip</Text>
                                </TouchableOpacity>
                              </View>
                            )}
                          </View>
                      );
                    })}

                    {approvedSalaries.length === 0 && (
                      <View style={styles.emptyContainer}>
                        <Ionicons name="file-tray-outline" size={36} color="#94A3B8" />
                        <Text style={styles.emptyTitle}>No Approved Items</Text>
                        <Text style={styles.emptyDesc}>
                          Approve salaries in the Pending Review section to make them ready for payment.
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Section Total Banner */}
                  <View style={styles.salarySectionFooter}>
                    <Text style={styles.sectionFooterTotalLabel}>Total Amount</Text>
                    <View style={styles.purplePillBadge}>
                      <Text style={styles.purplePillBadgeText}>{approvedTotalFormatted}</Text>
                    </View>
                  </View>
                </View>
              </View>
            )}

            {/* TAB 2.2: PAYMENT HISTORY GROUPED BY MONTH (Matching Image 3) */}
            {salariesSubTab === "Payment History" && (
              <View style={{ gap: 18 }}>
                {salaryHistoryGroups.map((monthGroup) => (
                  <View key={monthGroup.month} style={styles.salarySectionCard}>
                    {/* Month Group Header */}
                    <View style={styles.monthHeaderRow}>
                      <Text style={styles.monthTitleText}>{monthGroup.month}</Text>
                      <View style={{ alignItems: "flex-end" }}>
                        <Text style={styles.monthTotalAmountText}>{monthGroup.totalAmount}</Text>
                        <Text style={styles.monthPaymentsCountText}>
                          {monthGroup.paymentsCount} Payments
                        </Text>
                      </View>
                    </View>

                    {/* Month Payments List */}
                    <View style={styles.salaryListContainer}>
                      {monthGroup.records.map((salary) => {
                        const uid = `${monthGroup.month}-${salary.id}`;
                        const isExpanded = expandedSalaryIds.includes(uid);
                        return (
                          <View key={uid} style={styles.salaryRecordItem}>
                            <View style={styles.salaryCardHeader}>
                              <Avatar name={salary.name} uri={salary.avatarUrl} size={38} />
                              <View style={{ flex: 1, marginLeft: 10 }}>
                                <Text style={styles.salaryCardName}>{salary.name}</Text>
                                <Text style={styles.salaryCardUploader}>
                                  Uploaded by: {salary.uploader}
                                </Text>
                              </View>
                              <View style={styles.salaryCardRolePill}>
                                <Text style={styles.salaryCardRoleText}>{salary.role}</Text>
                              </View>
                            </View>

                            {/* Amount & Status Row */}
                            <View style={styles.salaryCardAmountRow}>
                              <View>
                                <Text style={styles.salaryCardAmount}>{salary.netAmount}</Text>
                                <Text style={styles.salaryCardMetaText}>
                                  {salary.month || monthGroup.month} · {salary.date}
                                </Text>
                              </View>
                              <View style={styles.statusBadgeApproved}>
                                <Text style={styles.statusTextApproved}>Paid</Text>
                              </View>
                            </View>

                            {/* Actions Row */}
                            <View style={styles.salaryCardActionsRow}>
                              <TouchableOpacity
                                style={styles.expandChevronBtn}
                                onPress={() => toggleSalaryRow(uid)}
                                activeOpacity={0.7}
                              >
                                <Ionicons
                                  name={isExpanded ? "chevron-up" : "chevron-down"}
                                  size={15}
                                  color="#635BFF"
                                />
                                <Text style={styles.expandChevronText}>
                                  {isExpanded ? "Hide" : "Details"}
                                </Text>
                              </TouchableOpacity>

                              <TouchableOpacity
                                style={styles.viewPayslipHistoryBtn}
                                onPress={() => setViewingPayslip(salary)}
                                activeOpacity={0.8}
                              >
                                <Ionicons name="eye-outline" size={14} color="#635BFF" />
                                <Text style={styles.viewPayslipHistoryBtnText}>View Payslip</Text>
                              </TouchableOpacity>
                            </View>

                            {/* Expanded Drawer */}
                            {isExpanded && (
                              <View style={styles.salaryExpandedBox}>
                                <View style={styles.breakdownGrid}>
                                  <View style={styles.breakdownItem}>
                                    <Text style={styles.breakdownLabel}>GROSS SALARY</Text>
                                    <Text style={styles.breakdownVal}>{salary.grossSalary}</Text>
                                  </View>
                                  <View style={styles.breakdownItem}>
                                    <Text style={styles.breakdownLabel}>NET SALARY</Text>
                                    <Text style={styles.breakdownVal}>{salary.netSalary}</Text>
                                  </View>
                                  <View style={styles.breakdownItem}>
                                    <Text style={styles.breakdownLabel}>TRF (MONTHLY)</Text>
                                    <Text style={styles.breakdownVal}>{salary.trfMonthly}</Text>
                                  </View>
                                  <View style={styles.breakdownItem}>
                                    <Text style={styles.breakdownLabel}>CUMULATIVE TRF</Text>
                                    <Text style={styles.breakdownVal}>{salary.cumulativeTrf}</Text>
                                  </View>
                                  <View style={[styles.breakdownItem, { width: "100%" }]}>
                                    <Text style={styles.breakdownLabel}>IBAN</Text>
                                    <Text style={styles.breakdownValMono}>{salary.iban}</Text>
                                  </View>
                                </View>

                                <TouchableOpacity style={styles.viewPayslipPillBtn}
                                    onPress={() => setViewingPayslip(salary)}
                                    activeOpacity={0.8}
                                  >
                                    <Ionicons name="eye-outline" size={14} color="#635BFF" />
                                    <Text style={styles.viewPayslipPillBtnText}>View Payslip</Text>
                                  </TouchableOpacity>
                              </View>
                            )}
                          </View>
                        );
                      })}
                    </View>

                    {/* Month Summary Footer */}
                    <View style={styles.monthFooterRow}>
                      <View style={styles.monthFooterItem}>
                        <Text style={styles.monthFooterLabel}>Month Total</Text>
                        <View style={styles.purplePillBadge}>
                          <Text style={styles.purplePillBadgeText}>{monthGroup.totalAmount}</Text>
                        </View>
                      </View>

                      <View style={styles.monthFooterItem}>
                        <Text style={styles.monthFooterLabel}>Average Salary</Text>
                        <View style={styles.purplePillBadge}>
                          <Text style={styles.purplePillBadgeText}>{monthGroup.averageSalary}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: SCHEDULED SHIFTS (Mobile Cards - Day & Staff Schedules) */}
        {/* ========================================================================= */}
        {activeTab === "Scheduled Shifts" && (
          <View style={styles.sectionWrapper}>
            <ScheduledShiftsView
              matrixShifts={matrixShifts}
              onExport={handleExportScheduled}
              onAdd={(pos) => {
                if (pos) setAddMenuAnchor(pos);
                setIsAddMenuOpen(true);
              }}
              onEditShift={(member, dayKey, currentVal) => {
                setEditingMatrixShift({ member, dayKey, currentVal });
              }}
            />
          </View>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: WORKED SHIFTS (Matching Dashboard Image 2) */}
        {/* ========================================================================= */}
        {activeTab === "Worked Shifts" && (
          <View style={styles.sectionWrapper}>
            <View style={styles.dashboardSectionCard}>
              {/* Header */}
              <View style={styles.workedHeaderRow}>
                <Text style={styles.dashboardCardTitle}>Worked Shifts</Text>

                <View style={styles.workedHeaderControls}>
                  <View style={styles.workedSearchBox}>
                    <Ionicons name="search" size={14} color="#94A3B8" />
                    <TextInput
                      style={styles.workedSearchInput}
                      placeholder="Search members..."
                      placeholderTextColor="#94A3B8"
                      value={workedSearchQuery}
                      onChangeText={(t) => {
                        setWorkedSearchQuery(t);
                        setWorkedPage(1);
                      }}
                    />
                  </View>

                  <TouchableOpacity
                    style={styles.exportOutlineBtn}
                    onPress={handleExportWorked}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="download-outline" size={14} color="#635BFF" />
                    <Text style={styles.exportOutlineBtnText}>Export Data</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Members List */}
              <View style={styles.workedListContainer}>
                {/* Mobile Section Subheader */}
                <View style={styles.workedSectionSubHeader}>
                  <View style={styles.workedSectionSubHeaderLeft}>
                    <View style={styles.workedIconSubBadge}>
                      <Ionicons name="people" size={13} color="#635BFF" />
                    </View>
                    <Text style={styles.workedSectionSubHeaderTitle}>Staff Monthly Log</Text>
                  </View>
                  <View style={styles.workedCountPill}>
                    <Text style={styles.workedCountPillText}>{filteredWorked.length} Staff</Text>
                  </View>
                </View>

                {/* Rows */}
                {currentWorkedPageMembers.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.workedMemberRow}
                    onPress={() => handleOpenMemberWorkedShifts(item)}
                    activeOpacity={0.75}
                  >
                    {/* Left: Avatar & Name & Role */}
                    <View style={styles.workedMemberLeft}>
                      <Avatar name={item.name} uri={item.avatarUrl} size={38} />
                      <View style={{ marginLeft: 10, flex: 1 }}>
                        <Text style={styles.matrixMemberName} numberOfLines={1}>
                          {item.name}
                        </Text>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 3 }}>
                          <View style={styles.roleStaffPill}>
                            <Text style={styles.roleStaffPillText}>{item.role}</Text>
                          </View>
                          <Text style={styles.workedMemberHoursBadge}>{item.hours}</Text>
                        </View>
                      </View>
                    </View>

                    {/* Right: View Action Button Only */}
                    <View style={styles.workedRowActions}>
                      <TouchableOpacity
                        style={styles.viewDetailsActionBtn}
                        onPress={() => handleOpenMemberWorkedShifts(item)}
                        activeOpacity={0.8}
                      >
                        <Ionicons name="eye-outline" size={13} color="#635BFF" />
                        <Text style={styles.viewDetailsActionText}>View</Text>
                        <Ionicons name="chevron-forward" size={12} color="#635BFF" />
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Table Footer / Pagination */}
              <View style={styles.tablePaginationFooter}>
                <Text style={styles.paginationShowingText}>
                  Showing {filteredWorked.length === 0 ? 0 : workedStart + 1} to {Math.min(workedStart + 5, filteredWorked.length)} of {filteredWorked.length} members
                </Text>

                <View style={styles.paginationButtonsRow}>
                  <TouchableOpacity
                    style={[styles.pageNavBtn, workedPage === 1 && styles.pageNavBtnDisabled]}
                    onPress={() => setWorkedPage(1)}
                    disabled={workedPage === 1}
                  >
                    <Text style={[styles.pageNavBtnText, workedPage === 1 && styles.pageNavBtnTextDisabled]}>
                      ‹ Previous
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.pageNumBtn, workedPage === 1 && styles.pageNumBtnActive]}
                    onPress={() => setWorkedPage(1)}
                  >
                    <Text style={[styles.pageNumText, workedPage === 1 && styles.pageNumTextActive]}>
                      1
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.pageNumBtn, workedPage === 2 && styles.pageNumBtnActive]}
                    onPress={() => setWorkedPage(2)}
                  >
                    <Text style={[styles.pageNumText, workedPage === 2 && styles.pageNumTextActive]}>
                      2
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.pageNavBtn, workedPage === 2 && styles.pageNavBtnDisabled]}
                    onPress={() => setWorkedPage(2)}
                    disabled={workedPage === 2}
                  >
                    <Text style={[styles.pageNavBtnText, workedPage === 2 && styles.pageNavBtnTextDisabled]}>
                      Next ›
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Bottom Summary Card (Matching Dashboard Image 2) */}
            <View style={styles.workedSummaryCard}>
              <View style={styles.workedSummaryItem}>
                <Text style={styles.workedSummaryLabel}>Total Company Hours</Text>
                <View style={styles.purpleBadgePill}>
                  <Text style={styles.purpleBadgePillText}>160h</Text>
                </View>
              </View>

              <View style={styles.workedSummaryItem}>
                <Text style={styles.workedSummaryLabel}>Average Hours per Employee</Text>
                <View style={styles.purpleBadgePill}>
                  <Text style={styles.purpleBadgePillText}>160h</Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* ALL MODALS */}
      {/* ========================================================================= */}
      {/* Add Options Dropdown (matching Image 1) */}
      <AddOptionsDropdownModal
        visible={isAddMenuOpen}
        onClose={() => setIsAddMenuOpen(false)}
        onSelectOption={handleSelectAddOption}
        top={addMenuAnchor?.top ?? 240}
        right={addMenuAnchor?.right ?? 16}
      />

      {/* Add Time Off Modal */}
      <AddTimeOffModal
        visible={isTimeOffOpen}
        onClose={() => setIsTimeOffOpen(false)}
      />

      {/* Add Blocked Time Modal */}
      <AddBlockedTimeModal
        visible={isBlockedTimeOpen}
        onClose={() => setIsBlockedTimeOpen(false)}
      />

      {/* Business Closed Period Modal */}
      <AddClosedPeriodModal
        visible={isClosedPeriodOpen}
        onClose={() => setIsClosedPeriodOpen(false)}
      />

      {/* Add Worked Shift Modal */}
      <AddWorkedShiftModal
        visible={isAddWorkedShiftOpen}
        onClose={() => setIsAddWorkedShiftOpen(false)}
        onSave={(data) => {
          setWorkedShifts([
            {
              id: `work_${Date.now()}`,
              name: data.member,
              role: "Staff",
              date: data.date,
              totalHours: "9h 00m",
              daysWorked: 1,
              avgDay: "9.0h",
              clockIn: data.timeIn,
              clockOut: data.timeOut,
              breakDuration: "30 min",
              overtime: "0.0h",
              avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80",
            },
            ...workedShifts,
          ]);
        }}
      />

      {/* Edit Scheduled Shift Modal */}
      <EditShiftModal
        visible={!!editingScheduledShift || !!editingMatrixShift}
        onClose={() => {
          setEditingScheduledShift(null);
          setEditingMatrixShift(null);
        }}
        initialTime={editingMatrixShift?.currentVal || editingScheduledShift?.time || "09:00 - 17:00"}
        memberName={editingMatrixShift?.member.name || editingScheduledShift?.name}
        onSave={(startTime, endTime) => {
          if (editingMatrixShift) {
            const timeStr = `${startTime} - ${endTime}`;
            setMatrixShifts((prev) =>
              prev.map((m) =>
                m.id === editingMatrixShift.member.id
                  ? {
                      ...m,
                      shifts: {
                        ...m.shifts,
                        [editingMatrixShift.dayKey]: timeStr,
                      },
                    }
                  : m
              )
            );
            setEditingMatrixShift(null);
          }
          if (editingScheduledShift) {
            setScheduledShifts(
              scheduledShifts.map((s) =>
                s.id === editingScheduledShift.id ? { ...s, time: `${startTime} - ${endTime}` } : s
              )
            );
            setEditingScheduledShift(null);
          }
        }}
      />

      {/* Edit Worked Shift Modal */}
      <EditWorkedShiftModal
        visible={!!editingWorkedShift}
        onClose={() => setEditingWorkedShift(null)}
        initialData={
          editingWorkedShift
            ? {
                memberName: editingWorkedShift.name,
                date: editingWorkedShift.date,
                clockIn: editingWorkedShift.clockIn,
                clockOut: editingWorkedShift.clockOut,
              }
            : undefined
        }
        onSave={(date, clockIn, clockOut) => {
          if (editingWorkedShift) {
            setWorkedShifts(
              workedShifts.map((w) =>
                w.id === editingWorkedShift.id ? { ...w, date, clockIn, clockOut } : w
              )
            );
            setWorkedList((prev) =>
              prev.map((w) =>
                w.id === editingWorkedShift.id || w.name === editingWorkedShift.name
                  ? { ...w, clockIn, clockOut, avgHoursDay: date }
                  : w
              )
            );
            setEditingWorkedShift(null);
          }
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        visible={!!deletingItem}
        onClose={() => setDeletingItem(null)}
        title={deletingItem?.type === "scheduled" ? "Delete Scheduled Shift" : "Delete Worked Shift"}
        message={`Are you sure you want to delete this shift for ${deletingItem?.name}? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
      />

      {/* View Worked Shift Details Modal */}
      <ViewWorkedShiftModal
        visible={!!viewingWorkedShift}
        onClose={() => setViewingWorkedShift(null)}
        shiftData={viewingWorkedShift}
        onEdit={() => {
          const item = viewingWorkedShift;
          setViewingWorkedShift(null);
          setEditingWorkedShift(item);
        }}
      />

      {/* View Payslip Modal (matching Image 1 & 2) */}
      <ViewPayslipModal
        visible={!!viewingPayslip}
        onClose={() => setViewingPayslip(null)}
        record={viewingPayslip}
      />


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  // Members Action Bar (Matching Dashboard)
  membersActionBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 14,
  },
  membersImportBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#635BFF",
    paddingVertical: 9,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  membersImportBtnText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  membersExportBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    backgroundColor: "#EEF2FF",
    paddingVertical: 9,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  membersExportBtnText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  membersAddEmployeeBtn: {
    flex: 1.3,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    backgroundColor: "#635BFF",
    paddingVertical: 9,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  membersAddEmployeeBtnText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },
  topHubHeader: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    paddingTop: 10,
  },
  hubHeaderContainer: {
    paddingHorizontal: 16,
    paddingBottom: 6,
  },
  hubTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  hubTitleCol: {
    flex: 1,
  },
  hubTitle: {
    fontSize: 18,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  hubSubtitle: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    marginTop: 1,
  },
  tabsScroll: {
    backgroundColor: "#FFFFFF",
  },
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 16,
  },
  tabButton: {
    paddingVertical: 10,
    position: "relative",
  },
  tabButtonActive: {},
  tabText: {
    fontSize: 13,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  tabTextActive: {
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  activeTabIndicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 2.5,
    backgroundColor: "#635BFF",
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  contentScrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionWrapper: {
    gap: 14,
  },
  subHeaderBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  subBannerTitle: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  subBannerSub: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    marginTop: 2,
  },
  addShiftBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  addShiftBtnText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Manrope_500Medium",
    color: "#1E293B",
    paddingVertical: 0,
  },
  filterGroup: {
    marginBottom: 4,
  },
  filterRow: {
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  chipActive: {
    backgroundColor: "#635BFF",
    borderColor: "#635BFF",
  },
  chipText: {
    fontSize: 12,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  chipTextActive: {
    color: "#FFFFFF",
    fontFamily: "Manrope_700Bold",
  },
  cardsList: {
    gap: 12,
  },
  memberCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  memberName: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  memberEmail: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    marginTop: 2,
  },
  viewMemberEyeBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E0E7FF",
  },
  moreButton: {
    padding: 4,
  },
  badgesRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  roleBadgeText: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusBadgeText: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
  },

  // Salaries Tab Styles matching Image 2 & 3
  salarySubTabsRow: {
    flexDirection: "row",
    backgroundColor: "#E2E8F0",
    borderRadius: 10,
    padding: 3,
  },
  salarySubTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 8,
  },
  salarySubTabActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  salarySubTabText: {
    fontSize: 12,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  salarySubTabTextActive: {
    color: "#635BFF",
    fontFamily: "Manrope_700Bold",
  },

  // Salaries Section Cards
  salarySectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  salarySectionHeader: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    gap: 10,
  },
  salarySectionTitle: {
    fontSize: 15,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  pendingReviewControlsRow: {
    gap: 10,
  },
  salarySearchInputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 36,
  },
  salarySearchInput: {
    flex: 1,
    marginLeft: 6,
    fontSize: 13,
    fontFamily: "Manrope_500Medium",
    color: "#1E293B",
    paddingVertical: 0,
  },
  bulkButtonsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  reapprovalBtn: {
    flex: 1,
    backgroundColor: "#FCE7F3",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  reapprovalBtnText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#F43F5E",
  },
  approvalAllBtn: {
    flex: 1,
    backgroundColor: "#14B8A6",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  approvalAllBtnText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },

  // Salary Items
  salaryListContainer: {
    padding: 12,
    gap: 10,
  },
  salaryRecordItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 12,
    gap: 8,
  },
  salaryCardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  salaryCardName: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  salaryCardUploader: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
    marginTop: 2,
  },
  salaryCardRolePill: {
    backgroundColor: "#FEF9C3",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  salaryCardRoleText: {
    fontSize: 10,
    fontFamily: "Manrope_700Bold",
    color: "#CA8A04",
  },
  salaryCardAmountRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 8,
    paddingBottom: 4,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  salaryCardAmount: {
    fontSize: 15,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  salaryCardMetaText: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    marginTop: 2,
  },
  statusBadgeReview: {
    backgroundColor: "#FEF9C3",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(202, 138, 4, 0.2)",
  },
  statusTextReview: {
    fontSize: 10,
    fontFamily: "Manrope_700Bold",
    color: "#CA8A04",
  },
  statusBadgeApproved: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(22, 163, 74, 0.2)",
  },
  statusTextApproved: {
    fontSize: 10,
    fontFamily: "Manrope_700Bold",
    color: "#16A34A",
  },
  salaryCardActionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F8FAFC",
  },
  expandChevronBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: "#EEF2FF",
  },
  expandChevronText: {
    fontSize: 11,
    fontFamily: "Manrope_600SemiBold",
    color: "#635BFF",
  },
  actionButtonsFlexRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  approveCardBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    backgroundColor: "#CCFBF1",
    paddingVertical: 7,
    borderRadius: 8,
  },
  approveCardBtnText: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#0D9488",
  },
  rejectCardBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    backgroundColor: "#FCE7F3",
    paddingVertical: 7,
    borderRadius: 8,
  },
  rejectCardBtnText: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#F43F5E",
  },
  payNowBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    backgroundColor: "#14B8A6",
    paddingVertical: 8,
    borderRadius: 8,
  },
  payNowBtnText: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },
  markAsPaidBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    backgroundColor: "#635BFF",
    paddingVertical: 8,
    borderRadius: 8,
  },
  markAsPaidBtnText: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },
  viewPayslipHistoryBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    backgroundColor: "#EEF2FF",
    borderWidth: 1,
    borderColor: "#E0E7FF",
    paddingVertical: 7,
    borderRadius: 8,
  },
  viewPayslipHistoryBtnText: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  viewPayslipPillBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#EEF2FF",
    borderWidth: 1,
    borderColor: "#E0E7FF",
    paddingVertical: 8,
    borderRadius: 8,
    width: "100%",
    marginTop: 10,
  },
  viewPayslipPillBtnText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  salaryExpandedBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    padding: 12,
    marginTop: 4,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  breakdownGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  breakdownItem: {
    width: "47%",
  },
  breakdownLabel: {
    fontSize: 10,
    fontFamily: "Manrope_700Bold",
    color: "#94A3B8",
    textTransform: "uppercase",
  },
  breakdownVal: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
    marginTop: 2,
  },
  breakdownValMono: {
    fontSize: 12,
    fontFamily: "Manrope_600SemiBold",
    color: "#1E293B",
    marginTop: 2,
  },
  salarySectionFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  sectionFooterTotalLabel: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  purplePillBadge: {
    backgroundColor: "#635BFF",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  purplePillBadgeText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },

  // Month Groups for Payment History
  monthHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  monthTitleText: {
    fontSize: 15,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  monthTotalAmountText: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  monthPaymentsCountText: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
    marginTop: 1,
  },
  monthFooterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    gap: 8,
  },
  monthFooterItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  monthFooterLabel: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  emptyContainer: {
    paddingVertical: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#475569",
    marginTop: 8,
  },
  emptyDesc: {
    fontSize: 12,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
    marginTop: 2,
    textAlign: "center",
    paddingHorizontal: 20,
  },

  // Shift cards
  shiftCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 14,
    gap: 12,
  },
  shiftHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  shiftName: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  shiftDays: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    marginTop: 2,
  },
  shiftTimeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  shiftTimeText: {
    fontSize: 11,
    fontFamily: "Manrope_600SemiBold",
    color: "#635BFF",
  },
  shiftActionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  editShiftBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F1F5F9",
    paddingVertical: 7,
    borderRadius: 6,
    gap: 4,
  },
  editShiftBtnText: {
    fontSize: 12,
    fontFamily: "Manrope_600SemiBold",
    color: "#475569",
  },
  deleteShiftBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 6,
    gap: 4,
  },
  deleteShiftBtnText: {
    fontSize: 12,
    fontFamily: "Manrope_600SemiBold",
    color: "#EF4444",
  },

  // Worked cards
  workedCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 14,
    gap: 12,
  },
  workedTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  workedName: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  workedRole: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    marginTop: 2,
  },
  workedHoursBadge: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  workedHoursText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#16A34A",
  },
  workedMetricsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    padding: 10,
    borderRadius: 8,
  },
  workedCol: {
    alignItems: "center",
  },
  workedColLabel: {
    fontSize: 10,
    fontFamily: "Manrope_600SemiBold",
    color: "#94A3B8",
  },
  workedColVal: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
    marginTop: 2,
  },
  workedActionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  viewDetailsBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EEF2FF",
    paddingVertical: 8,
    borderRadius: 6,
    gap: 4,
  },
  viewDetailsBtnText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  editWorkedBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 4,
  },
  editWorkedBtnText: {
    fontSize: 12,
    fontFamily: "Manrope_600SemiBold",
    color: "#475569",
  },
  deleteWorkedBtn: {
    width: 34,
    height: 34,
    borderRadius: 6,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
  },

  // Action Sheet
  modalOverlayCenter: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  actionSheet: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  actionSheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  actionSheetTitle: {
    fontSize: 15,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  actionSheetRole: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    marginTop: 2,
  },
  actionSheetDivider: {
    height: 1,
    backgroundColor: "#F1F5F9",
  },
  actionSheetItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  actionSheetItemText: {
    fontSize: 13,
    fontFamily: "Manrope_600SemiBold",
    color: "#1E293B",
  },

  // Dashboard Section Cards & Tables (Matching Images 1 & 2)
  dashboardSectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
    overflow: "hidden",
  },
  cardHeaderRowSpace: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 4,
  },
  dashboardCardTitle: {
    fontSize: 16,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  cardHeaderActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  exportOutlineBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#EEF2FF",
    borderWidth: 1,
    borderColor: "#E0E7FF",
    paddingHorizontal: 12,
    height: 36,
    borderRadius: 8,
  },
  exportOutlineBtnText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  primaryAddBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#635BFF",
    paddingHorizontal: 14,
    height: 36,
    borderRadius: 8,
  },
  primaryAddBtnText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },

  // Week Navigator Pill
  weekNavPill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginVertical: 14,
    backgroundColor: "#FFFFFF",
  },
  weekNavPillText: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
    marginHorizontal: 10,
  },

  // Matrix Table
  matrixTableHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#E2E8F0",
    paddingVertical: 10,
  },
  matrixHeaderCol: {
    fontSize: 12,
    fontFamily: "Manrope_600SemiBold",
    color: "#475569",
    textAlign: "center",
  },
  matrixTableRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#F1F5F9",
    paddingVertical: 12,
  },
  matrixMemberCol: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 8,
  },
  matrixMemberName: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  matrixMemberHours: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
    marginTop: 2,
  },
  matrixMemberUploader: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
    marginTop: 2,
  },
  closedPillBox: {
    width: "88%",
    paddingVertical: 6,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#CBD5E1",
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  closedPillText: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
  },
  shiftTimePillBox: {
    width: "92%",
    paddingVertical: 6,
    backgroundColor: "#EEF2FF",
    borderWidth: 1,
    borderColor: "#E0E7FF",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  shiftTimePillText: {
    fontSize: 10.5,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },

  // Pagination Footer
  tablePaginationFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 10,
    paddingTop: 14,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  paginationShowingText: {
    fontSize: 12,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
  },
  paginationButtonsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  pageNavBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
  },
  pageNavBtnDisabled: {
    opacity: 0.5,
    backgroundColor: "#F8FAFC",
  },
  pageNavBtnText: {
    fontSize: 12,
    fontFamily: "Manrope_600SemiBold",
    color: "#475569",
  },
  pageNavBtnTextDisabled: {
    color: "#94A3B8",
  },
  pageNumBtn: {
    width: 32,
    height: 32,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  pageNumBtnActive: {
    backgroundColor: "#635BFF",
    borderColor: "#635BFF",
  },
  pageNumText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#475569",
  },
  pageNumTextActive: {
    color: "#FFFFFF",
  },

  // Worked Shifts specific
  workedHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 12,
  },
  workedHeaderControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  workedSearchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 36,
    width: 160,
    gap: 6,
  },
  workedSearchInput: {
    flex: 1,
    fontSize: 12,
    fontFamily: "Manrope_500Medium",
    color: "#1E293B",
    padding: 0,
  },
  roleStaffPill: {
    backgroundColor: "#FEF9C3",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  roleStaffPillText: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#CA8A04",
  },
  tableCellText: {
    fontSize: 12.5,
    fontFamily: "Manrope_500Medium",
    color: "#1E293B",
  },
  tableCellTextBold: {
    fontSize: 12.5,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  eyeActionBtn: {
    width: 32,
    height: 32,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
  },

  // Summary Card Bottom
  workedSummaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 12,
  },
  workedSummaryItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  workedSummaryLabel: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  purpleBadgePill: {
    backgroundColor: "#635BFF",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 14,
  },
  purpleBadgePillText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },

  workedListContainer: {
    marginTop: 8,
  },
  workedSectionSubHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  workedSectionSubHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  workedIconSubBadge: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  workedSectionSubHeaderTitle: {
    fontSize: 12.5,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  workedCountPill: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  workedCountPillText: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  workedMemberRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  workedMemberLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  workedMemberHoursBadge: {
    fontSize: 11,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  viewDetailsActionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#EEF2FF",
    borderWidth: 1,
    borderColor: "#E0E7FF",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  viewDetailsActionText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  workedRowActions: {
    flexDirection: "row",
    alignItems: "center",
  },
});
