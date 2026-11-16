import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Header from "@/components/Header";
import Avatar from "@/components/Avatar";
import StatCards from "@/components/home/StatCards";
import DailySummaryCard from "@/components/home/DailySummaryCard";
import OnlinePaymentCard from "@/components/home/OnlinePaymentCard";
import ClientsGrowthChart from "@/components/home/ClientsGrowthChart";
import AppointmentsChart from "@/components/home/AppointmentsChart";
import {
  RevenueTrendChart,
  PeakHoursHeatmap,
  RevenueSplitChart,
} from "@/components/home/HomeCharts";

// Agenda Mock Data
const initialAgendaAppointments = [
  {
    id: "1",
    name: "Maria Rodriguez",
    phone: "+39 345 678 9123",
    service: "Full Balayage & Cut",
    status: "Booked",
    time: "12:00 AM - 12:15 AM",
    staff: "Angelica",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
  },
  {
    id: "2",
    name: "Sophia Rossi",
    phone: "+39 345 678 9124",
    service: "Full Balayage & Cut",
    status: "Confirmed",
    time: "12:15 AM - 12:30 AM",
    staff: "Angelica",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
  },
  {
    id: "3",
    name: "Elena Romano",
    phone: "+39 345 678 9125",
    service: "Full Balayage & Cut",
    status: "Arrived",
    time: "12:30 AM - 12:45 AM",
    staff: "Marco",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80",
  },
  {
    id: "4",
    name: "Giulia Bianchi",
    phone: "+39 345 678 9126",
    service: "Full Balayage & Cut",
    status: "Started",
    time: "12:45 AM - 01:00 PM",
    staff: "Mada",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&q=80",
  },
  {
    id: "5",
    name: "Valentina Costa",
    phone: "+39 345 678 9127",
    service: "Full Balayage & Cut",
    status: "Completed",
    time: "01:00 PM - 01:15 PM",
    staff: "Angelica",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=100&q=80",
  },
  {
    id: "6",
    name: "Francesca Ricci",
    phone: "+39 345 678 9128",
    service: "Full Balayage & Cut",
    status: "Cancelled",
    time: "01:15 PM - 01:30 PM",
    staff: "Marco",
    avatar: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=100&q=80",
  },
];

interface StepItem {
  number: number;
  status: "To-do" | "Ongoing" | "Completed" | "Cancelled";
  time: string;
  service: string;
  staff: string;
}

export default function HomeScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [appointments, setAppointments] = useState(initialAgendaAppointments);
  const [selectedApptFilter, setSelectedApptFilter] = useState("All");
  const [expandedApptId, setExpandedApptId] = useState<string | null>("1");

  // Date selection state
  const [selectedDate, setSelectedDate] = useState("Sep 16, 2025");
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [dateDropdownPos, setDateDropdownPos] = useState<{ top: number; right: number }>({
    top: 100,
    right: 16,
  });
  const dateBtnRef = useRef<any>(null);
  const availableDates = ["Sep 16, 2025", "Sep 17, 2025", "Sep 18, 2025", "Sep 19, 2025"];

  const handleOpenDateDropdown = () => {
    if (dateBtnRef.current?.measureInWindow) {
      dateBtnRef.current.measureInWindow(
        (x: number, y: number, width: number, height: number) => {
          const screenWidth = Dimensions.get("window").width;
          const rightOffset = Math.max(16, screenWidth - (x + width));
          const topOffset = y > 0 ? y + height + 10 : 120;
          setDateDropdownPos({ top: topOffset, right: rightOffset });
          setIsDateDropdownOpen(true);
        }
      );
    } else {
      setIsDateDropdownOpen(true);
    }
  };

  // Edit Appointment Modal State
  const [editingAppointment, setEditingAppointment] = useState<any | null>(null);
  const [editStatus, setEditStatus] = useState("Booked");
  const [editTime, setEditTime] = useState("");
  const [editService, setEditService] = useState("");
  const [editStaff, setEditStaff] = useState("");

  const apptFilters = [
    "All",
    "Booked",
    "Confirmed",
    "Arrived",
    "Started",
    "Completed",
    "Cancelled",
  ];

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 800);
  }, []);

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "Booked":
        return { bg: "#EEF2FF", text: "#635BFF" };
      case "Confirmed":
        return { bg: "#D1FAE5", text: "#10B981" };
      case "Arrived":
        return { bg: "#FEF3C7", text: "#D97706" };
      case "Started":
        return { bg: "#F1F5F9", text: "#1E293B" };
      case "Completed":
        return { bg: "#ECFDF5", text: "#059669" };
      case "Cancelled":
        return { bg: "#FFE4E6", text: "#FF4C6A" };
      default:
        return { bg: "#F3F4F6", text: "#4B5563" };
    }
  };

  const getFilterColors = (filter: string) => {
    switch (filter) {
      case "Booked":
        return { bg: "#635BFF", text: "#FFFFFF" };
      case "Confirmed":
        return { bg: "#10B981", text: "#FFFFFF" };
      case "Arrived":
        return { bg: "#F59E0B", text: "#FFFFFF" };
      case "Started":
        return { bg: "#1E293B", text: "#FFFFFF" };
      case "Completed":
        return { bg: "#059669", text: "#FFFFFF" };
      case "Cancelled":
        return { bg: "#EF4444", text: "#FFFFFF" };
      default:
        return { bg: "#635BFF", text: "#FFFFFF" };
    }
  };

  const getStepData = (apptStatus: string): StepItem[] => {
    switch (apptStatus) {
      case "Completed":
        return [
          { number: 1, status: "Completed", time: "12:00-12:05", service: "Shampoo", staff: "Angelica" },
          { number: 2, status: "Completed", time: "12:05-12:12", service: "Balayage Cut", staff: "Angelica" },
          { number: 3, status: "Completed", time: "12:12-12:15", service: "Blow Dry", staff: "Angelica" },
        ];
      case "Cancelled":
        return [
          { number: 1, status: "Cancelled", time: "12:00-12:05", service: "Shampoo", staff: "Angelica" },
          { number: 2, status: "Cancelled", time: "12:05-12:12", service: "Balayage Cut", staff: "Angelica" },
          { number: 3, status: "Cancelled", time: "12:12-12:15", service: "Blow Dry", staff: "Angelica" },
        ];
      case "Started":
        return [
          { number: 1, status: "Completed", time: "12:00-12:05", service: "Shampoo", staff: "Angelica" },
          { number: 2, status: "Ongoing", time: "12:05-12:12", service: "Balayage Cut", staff: "Angelica" },
          { number: 3, status: "To-do", time: "12:12-12:15", service: "Blow Dry", staff: "Angelica" },
        ];
      default:
        return [
          { number: 1, status: "To-do", time: "12:00-12:05", service: "Shampoo", staff: "Angelica" },
          { number: 2, status: "To-do", time: "12:05-12:12", service: "Balayage Cut", staff: "Angelica" },
          { number: 3, status: "To-do", time: "12:12-12:15", service: "Blow Dry", staff: "Angelica" },
        ];
    }
  };

  const toggleApptExpand = (id: string) => {
    setExpandedApptId((prev) => (prev === id ? null : id));
  };

  // Open Edit Modal
  const handleOpenEdit = (item: any) => {
    setEditingAppointment(item);
    setEditStatus(item.status);
    setEditTime(item.time);
    setEditService(item.service);
    setEditStaff(item.staff || "Angelica");
  };

  // Save Edit
  const handleSaveEdit = () => {
    if (!editingAppointment) return;
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === editingAppointment.id
          ? {
              ...a,
              status: editStatus,
              time: editTime,
              service: editService,
              staff: editStaff,
            }
          : a
      )
    );
    setEditingAppointment(null);
    Alert.alert("Updated", "Appointment details updated successfully.");
  };

  // Print Receipt handler
  const handlePrintReceipt = (item: any) => {
    Alert.alert(
      "Fiscal Receipt",
      `Print receipt for ${item.name} (${item.service})?`,
      [
        {
          text: "Preview / Share",
          onPress: () => router.push(`/finance/${item.id}/receipt` as any),
        },
        {
          text: "Print Thermal",
          onPress: () => Alert.alert("Print Job Started", `Printing 80mm fiscal ticket for ${item.name}...`),
        },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  const renderExpandedContent = (item: any) => {
    const steps = getStepData(item.status);

    return (
      <View style={styles.expandedWrapper}>
        <Text style={styles.expandedTitle}>Booking Order</Text>

        <View style={styles.timelineContainer}>
          <View style={styles.timelineLine} />

          <View style={styles.stepsRow}>
            {steps.map((step) => {
              const isCompleted = step.status === "Completed";
              const isCancelled = step.status === "Cancelled";
              const isOngoing = step.status === "Ongoing";

              let badgeBg = "#FEF3C7";
              let badgeText = "#D97706";
              let circleBg = "#FEF3C7";

              if (isCompleted) {
                badgeBg = "#ECFDF5";
                badgeText = "#10B981";
                circleBg = "#ECFDF5";
              } else if (isCancelled) {
                badgeBg = "#FFE4E6";
                badgeText = "#EF4444";
                circleBg = "#FFE4E6";
              } else if (isOngoing) {
                badgeBg = "#EEF2FF";
                badgeText = "#635BFF";
                circleBg = "#EEF2FF";
              }

              return (
                <View key={step.number} style={styles.stepItem}>
                  <View style={[styles.stepCircle, { backgroundColor: circleBg }]}>
                    <Text style={[styles.stepNumber, { color: badgeText }]}>
                      {step.number}
                    </Text>
                  </View>

                  <View style={[styles.stepBadge, { backgroundColor: badgeBg }]}>
                    <Text style={[styles.stepBadgeText, { color: badgeText }]}>
                      {step.status}
                    </Text>
                  </View>

                  <Text style={styles.stepTime}>{step.time}</Text>
                  <Text style={styles.stepService} numberOfLines={1}>
                    {step.service}
                  </Text>
                  <Text style={styles.stepStaff} numberOfLines={1}>
                    {step.staff}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Print Receipt Button matching web dashboard */}
        <View style={styles.printReceiptWrapper}>
          <TouchableOpacity
            style={styles.printReceiptBtn}
            onPress={() => handlePrintReceipt(item)}
            activeOpacity={0.8}
          >
            <Ionicons name="print-outline" size={16} color="#635BFF" />
            <Text style={styles.printReceiptText}>Print Receipt</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const filteredAppointments = appointments.filter((apt) => {
    if (selectedApptFilter === "All") return true;
    return apt.status === selectedApptFilter;
  });

  return (
    <View style={styles.container}>
      <Header />

      {/* Dashboard Header Actions Bar (Fixed like Team) */}
      <View style={styles.actionBar}>
        <View style={styles.titleWrapper}>
          <Text style={styles.dashboardTitle}>Dashboard</Text>
          <Text style={styles.dashboardSubtitle} numberOfLines={1}>
            Overview & updates
          </Text>
        </View>

        <View style={styles.actionButtonsRow}>
          <TouchableOpacity
            style={styles.refreshIconBtn}
            onPress={onRefresh}
            activeOpacity={0.7}
          >
            <Ionicons name="refresh-outline" size={17} color="#64748B" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.viewAllBtn}
            onPress={() => router.push("/appointments")}
            activeOpacity={0.85}
          >
            <Ionicons name="eye-outline" size={15} color="#FFFFFF" />
            <Text style={styles.viewAllBtnText}>Appointments</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#635BFF"]} />
        }
      >
        {/* 1. StatCards (Monthly Sales, Appointments, Clients, Team Members) */}
        <StatCards />

        {/* 2. Grid 1: Daily Summary & Cash Register */}
        <DailySummaryCard />

        {/* 3. Grid 1: Clients Growth Chart ("New Clients" - Last 12 Months) */}
        <ClientsGrowthChart />

        {/* 4. Grid 2: Revenue Trend Chart */}
        <RevenueTrendChart />

        {/* 5. Grid 2: Online Payment Management */}
        <OnlinePaymentCard />

        {/* 6. Grid 3: Appointments Bar Chart (Completed vs Cancelled) */}
        <AppointmentsChart />

        {/* 7. Grid 3: Agenda - Appointments Section */}
        <View style={styles.agendaCard}>
          <View style={styles.agendaHeader}>
            <View style={styles.agendaTitleWrapper}>
              <Text style={styles.agendaTitle}>Agenda - Appointments</Text>
              <Text style={styles.agendaSubtitle}>Real-time salon bookings</Text>
            </View>

            <View style={styles.agendaHeaderRight}>
              {/* Date Dropdown Trigger Button */}
              <TouchableOpacity
                ref={dateBtnRef}
                style={styles.datePickerChip}
                onPress={handleOpenDateDropdown}
                activeOpacity={0.7}
              >
                <Ionicons name="calendar-outline" size={14} color="#635BFF" />
                <Text style={styles.datePickerChipText}>{selectedDate}</Text>
                <Ionicons name="chevron-down" size={12} color="#64748B" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Status Filters */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            {apptFilters.map((filter) => {
              const isActive = selectedApptFilter === filter;
              const filterColors = getFilterColors(filter);
              return (
                <TouchableOpacity
                  key={filter}
                  style={[
                    styles.filterChip,
                    isActive && {
                      backgroundColor: filterColors.bg,
                      borderColor: filterColors.bg,
                    },
                  ]}
                  onPress={() => setSelectedApptFilter(filter)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.filterText,
                      isActive && { color: filterColors.text },
                    ]}
                  >
                    {filter}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Appointments List */}
          <View style={styles.appointmentsList}>
            {filteredAppointments.map((item) => {
              const badge = getStatusBadgeStyle(item.status);
              const isExpanded = expandedApptId === item.id;
              return (
                <View key={item.id} style={styles.appointmentItemCard}>
                  {/* Main Row: Avatar + Name + Badge + Phone/Service */}
                  <TouchableOpacity
                    style={styles.appointmentMainRow}
                    onPress={() => toggleApptExpand(item.id)}
                    activeOpacity={0.7}
                  >
                    <Avatar name={item.name} uri={item.avatar} size={42} />

                    <View style={styles.appointmentInfo}>
                      <View style={styles.nameBadgeRow}>
                        <Text style={styles.clientName} numberOfLines={1}>
                          {item.name}
                        </Text>
                        <View style={[styles.badge, { backgroundColor: badge.bg }]}>
                          <Text style={[styles.badgeText, { color: badge.text }]}>
                            {item.status}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.phoneServiceRow}>
                        <Text style={styles.phoneText} numberOfLines={1}>
                          {item.phone}
                        </Text>
                        <Text style={styles.metaDot}>•</Text>
                        <Text style={styles.serviceText} numberOfLines={1}>
                          {item.service}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>

                  {/* Meta & Actions Row: Time Slot on left, Edit & Expand on right */}
                  <View style={styles.appointmentMetaRow}>
                    <View style={styles.timeSlotPill}>
                      <Ionicons name="time-outline" size={12} color="#635BFF" style={{ marginRight: 4 }} />
                      <Text style={styles.timeSlotText}>{item.time}</Text>
                    </View>

                    <View style={styles.itemActionsGroup}>
                      <TouchableOpacity
                        style={styles.editPencilBtn}
                        onPress={() => handleOpenEdit(item)}
                        activeOpacity={0.7}
                      >
                        <Ionicons name="pencil" size={13} color="#0284C7" />
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.expandChevronBtn}
                        onPress={() => toggleApptExpand(item.id)}
                        activeOpacity={0.7}
                      >
                        <Ionicons
                          name={isExpanded ? "chevron-up" : "chevron-down"}
                          size={16}
                          color="#64748B"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Expanded 3-Step Timeline */}
                  {isExpanded && renderExpandedContent(item)}
                </View>
              );
            })}
          </View>

          <TouchableOpacity
            style={styles.agendaViewAllLink}
            onPress={() => router.push("/appointments")}
            activeOpacity={0.7}
          >
            <Text style={styles.agendaViewAllText}>View All Appointments</Text>
            <Ionicons name="arrow-forward" size={14} color="#635BFF" />
          </TouchableOpacity>
        </View>

        {/* 8. Supplementary Analytics: Peak Hours Heatmap */}
        <PeakHoursHeatmap />

        {/* 9. Supplementary Analytics: Revenue Split by Category */}
        <RevenueSplitChart />
      </ScrollView>

      {/* ======================================================== */}
      {/* DATE PICKER DROPDOWN MODAL ANCHORED BELOW BUTTON         */}
      {/* ======================================================== */}
      <Modal
        visible={isDateDropdownOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsDateDropdownOpen(false)}
      >
        <TouchableOpacity
          style={styles.dropdownModalOverlay}
          activeOpacity={1}
          onPress={() => setIsDateDropdownOpen(false)}
        >
          <View
            style={[
              styles.smallDateModalCard,
              { top: dateDropdownPos.top, right: dateDropdownPos.right },
            ]}
            onStartShouldSetResponder={() => true}
          >
            {/* Header with Title and Close Button */}
            <View style={styles.dropdownHeaderRow}>
              <Text style={styles.dropdownHeaderTitle}>Select Agenda Date</Text>
              <TouchableOpacity
                style={styles.dropdownCloseBtn}
                onPress={() => setIsDateDropdownOpen(false)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="close" size={16} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Date Options with generous padding and space */}
            <View style={styles.smallDateModalOptions}>
              {availableDates.map((d) => {
                const isSelected = selectedDate === d;
                return (
                  <TouchableOpacity
                    key={d}
                    style={[
                      styles.smallDateOptionItem,
                      isSelected && styles.smallDateOptionItemActive,
                    ]}
                    onPress={() => {
                      setSelectedDate(d);
                      setIsDateDropdownOpen(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name="calendar-outline"
                      size={16}
                      color={isSelected ? "#635BFF" : "#64748B"}
                      style={{ marginRight: 10 }}
                    />
                    <Text
                      style={[
                        styles.smallDateOptionText,
                        isSelected && styles.smallDateOptionTextActive,
                      ]}
                      numberOfLines={1}
                    >
                      {d}
                    </Text>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={17} color="#635BFF" style={{ marginLeft: 8 }} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ======================================================== */}
      {/* EDIT APPOINTMENT MODAL                                   */}
      {/* ======================================================== */}
      <Modal
        visible={!!editingAppointment}
        transparent
        animationType="fade"
        onRequestClose={() => setEditingAppointment(null)}
      >
        <TouchableWithoutFeedback onPress={() => setEditingAppointment(null)}>
          <View style={styles.modalOverlayCenter}>
            <TouchableWithoutFeedback>
              <View style={styles.editApptCard}>
                <View style={styles.datePickerHeader}>
                  <View>
                    <Text style={styles.datePickerTitle}>Edit Appointment</Text>
                    <Text style={styles.agendaSubtitle}>
                      {editingAppointment?.name}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => setEditingAppointment(null)}>
                    <Ionicons name="close" size={20} color="#64748B" />
                  </TouchableOpacity>
                </View>

                {/* Status Selector */}
                <Text style={styles.editSectionLabel}>Status</Text>
                <View style={styles.editStatusRow}>
                  {["Booked", "Confirmed", "Arrived", "Started", "Completed", "Cancelled"].map((st) => {
                    const isSel = editStatus === st;
                    return (
                      <TouchableOpacity
                        key={st}
                        style={[
                          styles.editStatusChip,
                          isSel && styles.editStatusChipActive,
                        ]}
                        onPress={() => setEditStatus(st)}
                      >
                        <Text
                          style={[
                            styles.editStatusText,
                            isSel && styles.editStatusTextActive,
                          ]}
                        >
                          {st}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Service */}
                <Text style={styles.editSectionLabel}>Service</Text>
                <TextInput
                  style={styles.editInput}
                  value={editService}
                  onChangeText={setEditService}
                  placeholder="Service name"
                />

                {/* Time */}
                <Text style={styles.editSectionLabel}>Time Slot</Text>
                <TextInput
                  style={styles.editInput}
                  value={editTime}
                  onChangeText={setEditTime}
                  placeholder="e.g. 12:00 AM - 12:15 AM"
                />

                {/* Staff */}
                <Text style={styles.editSectionLabel}>Staff Member</Text>
                <TextInput
                  style={styles.editInput}
                  value={editStaff}
                  onChangeText={setEditStaff}
                  placeholder="Team Member"
                />

                {/* Actions */}
                <View style={styles.editModalBtns}>
                  <TouchableOpacity
                    style={styles.cancelEditBtn}
                    onPress={() => setEditingAppointment(null)}
                  >
                    <Text style={styles.cancelEditText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.saveEditBtn}
                    onPress={handleSaveEdit}
                  >
                    <Text style={styles.saveEditText}>Save Changes</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 40,
  },
  actionBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  titleWrapper: {
    flex: 1,
  },
  dashboardTitle: {
    fontSize: 18,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  dashboardSubtitle: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
    marginTop: 1,
  },
  actionButtonsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  refreshIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  viewAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#635BFF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    shadowColor: "#635BFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  viewAllBtnText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },

  // Agenda Card
  agendaCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
    marginHorizontal: 16,
    marginTop: 6,
    marginBottom: 20,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  agendaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    gap: 10,
  },
  agendaTitleWrapper: {
    flex: 1,
  },
  agendaTitle: {
    fontSize: 16,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  agendaSubtitle: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
    marginTop: 2,
  },
  agendaHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  datePickerChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: "#F8FAFC",
  },
  datePickerChipText: {
    fontSize: 11,
    fontFamily: "Manrope_600SemiBold",
    color: "#1E293B",
  },
  filterScroll: {
    gap: 8,
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  filterText: {
    fontSize: 11,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  appointmentsList: {
    gap: 10,
  },
  appointmentItemCard: {
    borderWidth: 1,
    borderColor: "#F1F5F9",
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },
  appointmentMainRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    paddingBottom: 8,
    gap: 10,
  },
  appointmentInfo: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  nameBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  clientName: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
    flex: 1,
  },
  phoneServiceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  phoneText: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
  },
  metaDot: {
    fontSize: 10,
    color: "#CBD5E1",
  },
  serviceText: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
    flex: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: "Manrope_700Bold",
  },
  appointmentMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingBottom: 10,
    paddingTop: 0,
  },
  timeSlotPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  timeSlotText: {
    fontSize: 11,
    fontFamily: "Manrope_600SemiBold",
    color: "#635BFF",
  },
  itemActionsGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  editPencilBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  expandChevronBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
  },
  expandedWrapper: {
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    padding: 14,
    backgroundColor: "#F8FAFC",
  },
  expandedTitle: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
    textAlign: "center",
    marginBottom: 12,
  },
  timelineContainer: {
    position: "relative",
    paddingVertical: 6,
  },
  timelineLine: {
    position: "absolute",
    top: 20,
    left: "15%",
    right: "15%",
    height: 2,
    backgroundColor: "#CBD5E1",
  },
  stepsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  stepItem: {
    alignItems: "center",
    width: "30%",
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
    marginBottom: 6,
  },
  stepNumber: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
  },
  stepBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 4,
  },
  stepBadgeText: {
    fontSize: 9,
    fontFamily: "Manrope_700Bold",
  },
  stepTime: {
    fontSize: 9,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
  },
  stepService: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
    marginTop: 2,
    textAlign: "center",
  },
  stepStaff: {
    fontSize: 9,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
  },
  printReceiptWrapper: {
    alignItems: "center",
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  printReceiptBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#DDDBFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  printReceiptText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  agendaViewAllLink: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  agendaViewAllText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },

  // Dropdown Modal Anchored Below Button
  dropdownModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.25)",
  },
  smallDateModalCard: {
    position: "absolute",
    width: 220,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 14,
    elevation: 10,
  },
  dropdownHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 10,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    paddingHorizontal: 4,
  },
  dropdownHeaderTitle: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  dropdownCloseBtn: {
    padding: 2,
  },
  smallDateModalOptions: {
    gap: 6,
  },
  smallDateOptionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#F8FAFC",
  },
  smallDateOptionItemActive: {
    backgroundColor: "#EEF2FF",
    borderWidth: 1,
    borderColor: "#C7D2FE",
  },
  smallDateOptionText: {
    flex: 1,
    fontSize: 12,
    fontFamily: "Manrope_600SemiBold",
    color: "#334155",
  },
  smallDateOptionTextActive: {
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },

  // Modals
  modalOverlayCenter: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  datePickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  datePickerTitle: {
    fontSize: 15,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },

  // Edit Appt Card
  editApptCard: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
  },
  editSectionLabel: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#475569",
    marginTop: 8,
    marginBottom: 6,
  },
  editStatusRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 8,
  },
  editStatusChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
  },
  editStatusChipActive: {
    backgroundColor: "#EEF2FF",
    borderColor: "#635BFF",
  },
  editStatusText: {
    fontSize: 11,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  editStatusTextActive: {
    color: "#635BFF",
    fontFamily: "Manrope_700Bold",
  },
  editInput: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
    fontSize: 13,
    fontFamily: "Manrope_500Medium",
    color: "#1E293B",
    backgroundColor: "#F8FAFC",
    marginBottom: 6,
  },
  editModalBtns: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
  cancelEditBtn: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
  },
  cancelEditText: {
    fontSize: 13,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  saveEditBtn: {
    flex: 1.5,
    height: 42,
    borderRadius: 10,
    backgroundColor: "#635BFF",
    alignItems: "center",
    justifyContent: "center",
  },
  saveEditText: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },
});
