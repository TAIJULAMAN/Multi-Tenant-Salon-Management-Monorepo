import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Pressable,
  useWindowDimensions,
  GestureResponderEvent,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CalAppointment } from "./types";
import { staffList, statusTheme } from "./data";
import Avatar from "@/components/Avatar";

interface Props {
  appointments: CalAppointment[];
  onViewDetails: (appt: CalAppointment) => void;
  onEditAppointment: (appt: CalAppointment) => void;
  onDeleteAppointment: (appt: CalAppointment) => void;
}

export default function AppointmentTableView({
  appointments,
  onViewDetails,
  onEditAppointment,
  onDeleteAppointment,
}: Props) {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activePeriod, setActivePeriod] = useState<"Month" | "Week" | "Day">("Day");
  const [currentDateIndex, setCurrentDateIndex] = useState(0);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  // Active 3-dot dropdown popover row and its position
  const [menuAnchorAppt, setMenuAnchorAppt] = useState<CalAppointment | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; right: number }>({
    top: 100,
    right: 20,
  });

  // Staff selector dropdown
  const [staffDropdownOpen, setStaffDropdownOpen] = useState(false);
  const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([]);

  const dateLabels = [
    "Tuesday Aug 05",
    "Wednesday Aug 06",
    "Thursday Aug 07",
    "Friday Aug 08",
  ];

  const currentDateLabel = dateLabels[currentDateIndex] || "Tuesday Aug 05";

  // Filtered Appointments
  const filtered = useMemo(() => {
    return appointments.filter((appt) => {
      const matchSearch =
        searchQuery.trim() === "" ||
        appt.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appt.service.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStaff =
        selectedStaffIds.length === 0 || selectedStaffIds.includes(appt.staffId);
      return matchSearch && matchStaff;
    });
  }, [appointments, searchQuery, selectedStaffIds]);

  const toggleStaffSelection = (id: string) => {
    if (selectedStaffIds.includes(id)) {
      setSelectedStaffIds(selectedStaffIds.filter((sid) => sid !== id));
    } else {
      setSelectedStaffIds([...selectedStaffIds, id]);
    }
  };

  const handleCardMenuPress = (
    event: GestureResponderEvent,
    item: CalAppointment
  ) => {
    const target = event.currentTarget as any;
    if (target?.measureInWindow) {
      target.measureInWindow(
        (x: number, y: number, width: number, height: number) => {
          const isNearBottom = y + height + 150 > windowHeight - 40;
          const top = isNearBottom ? Math.max(20, y - 145) : y + height + 4;
          const right = Math.max(16, windowWidth - (x + width));
          setMenuPosition({ top, right });
          setMenuAnchorAppt(item);
        }
      );
    } else {
      const { pageY, pageX } = event.nativeEvent;
      const isNearBottom = pageY + 150 > windowHeight - 40;
      const top = isNearBottom ? Math.max(20, pageY - 145) : pageY + 12;
      const right = Math.max(16, windowWidth - pageX);
      setMenuPosition({ top, right });
      setMenuAnchorAppt(item);
    }
  };

  return (
    <View style={styles.container}>
      {/* 1. Top Toolbar */}
      <View style={styles.toolbarCard}>
        <View style={styles.toolbarLeft}>
          {/* Multi-select staff filter */}
          <TouchableOpacity
            style={styles.staffFilterBtn}
            onPress={() => setStaffDropdownOpen(!staffDropdownOpen)}
          >
            <Ionicons name="people-outline" size={14} color="#635BFF" />
            <Text style={styles.staffFilterText}>
              {selectedStaffIds.length === 0
                ? "All Staff"
                : `${selectedStaffIds.length} Selected`}
            </Text>
            <Ionicons
              name={staffDropdownOpen ? "chevron-up" : "chevron-down"}
              size={12}
              color="#6B7280"
            />
          </TouchableOpacity>

          {/* Search Button / Search Box */}
          <TouchableOpacity
            style={[styles.searchBtn, searchOpen && styles.searchBtnActive]}
            onPress={() => setSearchOpen(!searchOpen)}
          >
            <Ionicons
              name="search-outline"
              size={15}
              color={searchOpen ? "#635BFF" : "#526B7A"}
            />
          </TouchableOpacity>
        </View>

        {/* Date Navigator */}
        <View style={styles.dateNavigator}>
          <TouchableOpacity
            style={styles.navArrowBtn}
            onPress={() =>
              setCurrentDateIndex((prev) =>
                prev > 0 ? prev - 1 : dateLabels.length - 1
              )
            }
          >
            <Ionicons name="chevron-back" size={14} color="#635BFF" />
          </TouchableOpacity>

          <Text style={styles.dateNavigatorText}>{currentDateLabel}</Text>

          <TouchableOpacity
            style={styles.navArrowBtn}
            onPress={() =>
              setCurrentDateIndex((prev) =>
                prev < dateLabels.length - 1 ? prev + 1 : 0
              )
            }
          >
            <Ionicons name="chevron-forward" size={14} color="#635BFF" />
          </TouchableOpacity>
        </View>

        {/* Period Selector: Month | Week | Day */}
        <View style={styles.periodGroup}>
          {(["Month", "Week", "Day"] as const).map((period) => {
            const isActive = activePeriod === period;
            return (
              <TouchableOpacity
                key={period}
                style={[
                  styles.periodBtn,
                  isActive && styles.periodBtnActive,
                ]}
                onPress={() => setActivePeriod(period)}
              >
                <Text
                  style={[
                    styles.periodBtnText,
                    isActive && styles.periodBtnTextActive,
                  ]}
                >
                  {period}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Expanded Search Bar */}
      {searchOpen && (
        <View style={styles.searchBarRow}>
          <Ionicons name="search" size={15} color="#9CA3AF" />
          <TextInput
            style={styles.searchBarInput}
            placeholder="Search by client or service..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={16} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Staff Filter Dropdown Menu */}
      {staffDropdownOpen && (
        <View style={styles.staffDropdownMenu}>
          <TouchableOpacity
            style={styles.staffOptionRow}
            onPress={() => {
              setSelectedStaffIds([]);
              setStaffDropdownOpen(false);
            }}
          >
            <Text
              style={[
                styles.staffOptionText,
                selectedStaffIds.length === 0 && styles.staffOptionTextActive,
              ]}
            >
              All Team Members
            </Text>
            {selectedStaffIds.length === 0 && (
              <Ionicons name="checkmark" size={15} color="#635BFF" />
            )}
          </TouchableOpacity>
          {staffList.map((st) => {
            const isChecked = selectedStaffIds.includes(st.id);
            return (
              <TouchableOpacity
                key={st.id}
                style={styles.staffOptionRow}
                onPress={() => toggleStaffSelection(st.id)}
              >
                <Avatar name={st.name} uri={st.avatar} size={22} />
                <Text
                  style={[
                    styles.staffOptionText,
                    isChecked && styles.staffOptionTextActive,
                  ]}
                >
                  {st.name} ({st.role})
                </Text>
                {isChecked && (
                  <Ionicons name="checkmark" size={15} color="#635BFF" />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* 2. Card-based Vertical List (NO HORIZONTAL SCROLLING REQUIRED) */}
      <ScrollView
        style={styles.cardsScrollView}
        contentContainerStyle={styles.cardsScrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filtered.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={40} color="#D1D5DB" />
            <Text style={styles.emptyText}>No appointments found</Text>
          </View>
        ) : (
          filtered.map((item, idx) => {
            const theme = statusTheme[item.status] || statusTheme.Booked;
            const isExpanded = expandedRowId === item.id;
            const idFormatted = String(idx + 1).padStart(3, "0");
            const staff =
              staffList.find((s) => s.id === item.staffId) || staffList[0];

            return (
              <View key={item.id} style={styles.appointmentCard}>
                {/* Card Top: ID Badge, Status Pill, and 3-Dot Action Button */}
                <View style={styles.cardHeaderRow}>
                  <View style={styles.cardBadgesLeft}>
                    <View style={styles.idBadge}>
                      <Text style={styles.idBadgeText}>#{idFormatted}</Text>
                    </View>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: theme.badgeBg },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusBadgeText,
                          { color: theme.badgeText },
                        ]}
                      >
                        {item.status}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.cardMenuBtn}
                    onPress={(e) => handleCardMenuPress(e, item)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons
                      name="ellipsis-vertical"
                      size={16}
                      color="#6B7280"
                    />
                  </TouchableOpacity>
                </View>

                {/* Card Middle: Client Info + Price (Click to view full details screen) */}
                <TouchableOpacity
                  style={styles.clientSectionRow}
                  activeOpacity={0.7}
                  onPress={() => onViewDetails(item)}
                >
                  <Avatar
                    name={item.clientName}
                    uri={item.clientAvatar}
                    size={42}
                  />
                  <View style={styles.clientInfoCol}>
                    <Text style={styles.clientNameText} numberOfLines={1}>
                      {item.clientName}
                    </Text>
                    <Text style={styles.clientPhoneText} numberOfLines={1}>
                      {item.clientPhone}
                    </Text>
                  </View>
                  <View style={styles.priceCol}>
                    <Text style={styles.priceText}>{item.price}</Text>
                    <Text style={styles.paymentStatusText}>
                      {item.paymentStatus || "Unpaid"}
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Card Meta Details Chips */}
                <View style={styles.metaChipsRow}>
                  <View style={styles.metaChip}>
                    <Ionicons name="cut-outline" size={13} color="#635BFF" />
                    <Text style={styles.metaChipText} numberOfLines={1}>
                      {item.service}
                    </Text>
                  </View>

                  <View style={styles.metaChip}>
                    <Ionicons name="time-outline" size={13} color="#635BFF" />
                    <Text style={styles.metaChipText} numberOfLines={1}>
                      {item.startTime} - {item.endTime}
                    </Text>
                  </View>

                  <View style={styles.metaChip}>
                    <Ionicons name="person-outline" size={13} color="#635BFF" />
                    <Text style={styles.metaChipText} numberOfLines={1}>
                      {staff.name.split(" ")[0]}
                    </Text>
                  </View>
                </View>

                {/* Expand Accordion Trigger: Booking Order */}
                <TouchableOpacity
                  style={styles.bookingOrderToggleBar}
                  onPress={() => setExpandedRowId(isExpanded ? null : item.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.bookingOrderToggleLeft}>
                    <Ionicons
                      name="git-commit-outline"
                      size={15}
                      color="#635BFF"
                    />
                    <Text style={styles.bookingOrderToggleTitle}>
                      Booking Order Timeline
                    </Text>
                  </View>

                  <View style={styles.bookingOrderToggleRight}>
                    <Text style={styles.bookingOrderToggleHint}>
                      {isExpanded ? "Hide" : "View"}
                    </Text>
                    <Ionicons
                      name={isExpanded ? "chevron-up" : "chevron-down"}
                      size={14}
                      color="#635BFF"
                    />
                  </View>
                </TouchableOpacity>

                {/* Expanded Accordion: Booking Order Stepper */}
                {isExpanded && (
                  <View style={styles.expandedAccordionCard}>
                    <View style={styles.stepperContainer}>
                      <View style={styles.stepperIconsRow}>
                        <View
                          style={[
                            styles.stepperCircle,
                            styles.stepperCircleDone,
                          ]}
                        >
                          <Text style={styles.stepperCircleNum}>1</Text>
                        </View>
                        <View style={styles.stepperConnector} />
                        <View
                          style={[
                            styles.stepperCircle,
                            item.status === "Started" ||
                            item.status === "Completed"
                              ? styles.stepperCircleDone
                              : styles.stepperCircleTodo,
                          ]}
                        >
                          <Text style={styles.stepperCircleNum}>2</Text>
                        </View>
                        <View style={styles.stepperConnector} />
                        <View
                          style={[
                            styles.stepperCircle,
                            item.status === "Completed"
                              ? styles.stepperCircleDone
                              : styles.stepperCircleTodo,
                          ]}
                        >
                          <Text style={styles.stepperCircleNum}>3</Text>
                        </View>
                      </View>

                      {/* Stepper Details */}
                      <View style={styles.stepperLabelsRow}>
                        <View style={styles.stepperStepCol}>
                          <View style={styles.stepBadgePill}>
                            <Text style={styles.stepBadgePillText}>To Do</Text>
                          </View>
                          <Text style={styles.stepTimeText}>
                            {item.startTime}
                          </Text>
                          <Text style={styles.stepNameText}>Shampoo</Text>
                          <Text style={styles.stepStaffText}>Angelica</Text>
                        </View>

                        <View style={styles.stepperStepCol}>
                          <View style={styles.stepBadgePill}>
                            <Text style={styles.stepBadgePillText}>To Do</Text>
                          </View>
                          <Text style={styles.stepTimeText}>
                            {item.startTime.slice(0, 3)}30
                          </Text>
                          <Text style={styles.stepNameText}>{item.service}</Text>
                          <Text style={styles.stepStaffText}>
                            {staff.name.split(" ")[0]}
                          </Text>
                        </View>

                        <View style={styles.stepperStepCol}>
                          <View style={styles.stepBadgePill}>
                            <Text style={styles.stepBadgePillText}>To Do</Text>
                          </View>
                          <Text style={styles.stepTimeText}>
                            {item.endTime}
                          </Text>
                          <Text style={styles.stepNameText}>Finishing</Text>
                          <Text style={styles.stepStaffText}>Angelica</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                )}
              </View>
            );
          })
        )}

        {/* 3. Pagination Footer */}
        <View style={styles.paginationRow}>
          <Text style={styles.paginationInfoText}>
            Showing <Text style={{ fontFamily: "Manrope_700Bold" }}>1</Text> to{" "}
            <Text style={{ fontFamily: "Manrope_700Bold" }}>
              {filtered.length}
            </Text>{" "}
            of{" "}
            <Text style={{ fontFamily: "Manrope_700Bold" }}>
              {filtered.length}
            </Text>{" "}
            items
          </Text>

          <View style={styles.paginationBtns}>
            <TouchableOpacity style={styles.pageArrowBtn}>
              <Ionicons name="chevron-back" size={13} color="#6B7280" />
              <Text style={styles.pageArrowBtnText}>Prev</Text>
            </TouchableOpacity>

            <View style={styles.pageNumActive}>
              <Text style={styles.pageNumActiveText}>1</Text>
            </View>

            <TouchableOpacity style={styles.pageArrowBtn}>
              <Text style={styles.pageArrowBtnText}>Next</Text>
              <Ionicons name="chevron-forward" size={13} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* 3-Dot Row Action Popover Menu (Positioned directly below the button) */}
      <Modal
        visible={menuAnchorAppt !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuAnchorAppt(null)}
      >
        <Pressable
          style={styles.popoverOverlay}
          onPress={() => setMenuAnchorAppt(null)}
        >
          <View
            style={[
              styles.popoverMenuCard,
              { top: menuPosition.top, right: menuPosition.right },
            ]}
          >
            <TouchableOpacity
              style={styles.popoverMenuItem}
              onPress={() => {
                const item = menuAnchorAppt;
                setMenuAnchorAppt(null);
                if (item) onViewDetails(item);
              }}
            >
              <Ionicons name="eye-outline" size={16} color="#635BFF" />
              <Text style={styles.popoverMenuText}>View Details</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.popoverMenuItem}
              onPress={() => {
                const item = menuAnchorAppt;
                setMenuAnchorAppt(null);
                if (item) onEditAppointment(item);
              }}
            >
              <Ionicons name="pencil-outline" size={16} color="#526B7A" />
              <Text style={styles.popoverMenuText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.popoverMenuItem, { borderBottomWidth: 0 }]}
              onPress={() => {
                const item = menuAnchorAppt;
                setMenuAnchorAppt(null);
                if (item) onDeleteAppointment(item);
              }}
            >
              <Ionicons name="trash-outline" size={16} color="#FF6692" />
              <Text
                style={[styles.popoverMenuText, { color: "#FF6692" }]}
              >
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6FA",
  },
  toolbarCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EFF4FA",
    gap: 8,
  },
  toolbarLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  staffFilterBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E6EB",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    gap: 5,
  },
  staffFilterText: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 11.5,
    color: "#29343D",
  },
  searchBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E6EB",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  searchBtnActive: {
    borderColor: "#635BFF",
    backgroundColor: "#F3F0FF",
  },
  dateNavigator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E6EB",
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  navArrowBtn: {
    padding: 5,
  },
  dateNavigatorText: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 12,
    color: "#635BFF",
    paddingHorizontal: 6,
  },
  periodGroup: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E6EB",
    borderRadius: 8,
    overflow: "hidden",
  },
  periodBtn: {
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  periodBtnActive: {
    backgroundColor: "#DDDBFF",
  },
  periodBtnText: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 11.5,
    color: "#526B7A",
  },
  periodBtnTextActive: {
    color: "#635BFF",
    fontFamily: "Manrope_700Bold",
  },
  searchBarRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#EFF4FA",
    gap: 8,
  },
  searchBarInput: {
    flex: 1,
    fontFamily: "Manrope_500Medium",
    fontSize: 13,
    color: "#1F2937",
    padding: 0,
  },
  staffDropdownMenu: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E6EB",
    gap: 8,
  },
  staffOptionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 4,
  },
  staffOptionText: {
    flex: 1,
    fontFamily: "Manrope_500Medium",
    fontSize: 12,
    color: "#4B5563",
  },
  staffOptionTextActive: {
    color: "#635BFF",
    fontFamily: "Manrope_700Bold",
  },
  cardsScrollView: {
    flex: 1,
  },
  cardsScrollContent: {
    padding: 14,
    paddingBottom: 40,
    gap: 12,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
  },
  emptyText: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 13.5,
    color: "#9CA3AF",
    marginTop: 8,
  },
  appointmentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E0E6EB",
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  cardBadgesLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  idBadge: {
    backgroundColor: "#F3F0FF",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  idBadgeText: {
    fontFamily: "Manrope_700Bold",
    fontSize: 11,
    color: "#635BFF",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 11,
  },
  cardMenuBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F9FAFB",
  },
  clientSectionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
  },
  clientInfoCol: {
    flex: 1,
  },
  clientNameText: {
    fontFamily: "Manrope_700Bold",
    fontSize: 14,
    color: "#1F2937",
  },
  clientPhoneText: {
    fontFamily: "Manrope_500Medium",
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  priceCol: {
    alignItems: "flex-end",
  },
  priceText: {
    fontFamily: "Manrope_700Bold",
    fontSize: 14.5,
    color: "#1F2937",
  },
  paymentStatusText: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 11,
    color: "#10B981",
    marginTop: 2,
  },
  metaChipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 10,
  },
  metaChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F8F9FD",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  metaChipText: {
    fontFamily: "Manrope_500Medium",
    fontSize: 11,
    color: "#4B5563",
  },
  bookingOrderToggleBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#EFF2F7",
  },
  bookingOrderToggleLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  bookingOrderToggleTitle: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 11.5,
    color: "#29343D",
  },
  bookingOrderToggleRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  bookingOrderToggleHint: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 11,
    color: "#635BFF",
  },
  expandedAccordionCard: {
    marginTop: 10,
    backgroundColor: "#FAFAFA",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#EFF2F7",
  },
  stepperContainer: {
    gap: 10,
  },
  stepperIconsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  stepperCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  stepperCircleDone: {
    backgroundColor: "#1F2937",
  },
  stepperCircleTodo: {
    backgroundColor: "#E5E7EB",
  },
  stepperCircleNum: {
    fontFamily: "Manrope_700Bold",
    fontSize: 11,
    color: "#FFFFFF",
  },
  stepperConnector: {
    flex: 1,
    height: 2,
    backgroundColor: "#E5E7EB",
  },
  stepperLabelsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  stepperStepCol: {
    alignItems: "center",
    width: "30%",
  },
  stepBadgePill: {
    backgroundColor: "#EFF4FA",
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 2,
    marginBottom: 4,
  },
  stepBadgePillText: {
    fontFamily: "Manrope_700Bold",
    fontSize: 9.5,
    color: "#635BFF",
  },
  stepTimeText: {
    fontFamily: "Manrope_500Medium",
    fontSize: 10.5,
    color: "#9CA3AF",
  },
  stepNameText: {
    fontFamily: "Manrope_700Bold",
    fontSize: 11.5,
    color: "#1F2937",
    marginTop: 2,
    textAlign: "center",
  },
  stepStaffText: {
    fontFamily: "Manrope_500Medium",
    fontSize: 10.5,
    color: "#6B7280",
    marginTop: 1,
  },
  paginationRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#EFF4FA",
    marginTop: 8,
  },
  paginationInfoText: {
    fontFamily: "Manrope_500Medium",
    fontSize: 12,
    color: "#6B7280",
  },
  paginationBtns: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  pageArrowBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E0E6EB",
    backgroundColor: "#FFFFFF",
  },
  pageArrowBtnText: {
    fontFamily: "Manrope_500Medium",
    fontSize: 11,
    color: "#6B7280",
  },
  pageNumActive: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: "#635BFF",
    alignItems: "center",
    justifyContent: "center",
  },
  pageNumActiveText: {
    fontFamily: "Manrope_700Bold",
    fontSize: 11.5,
    color: "#FFFFFF",
  },
  popoverOverlay: {
    flex: 1,
    backgroundColor: "transparent",
  },
  popoverMenuCard: {
    position: "absolute",
    width: 155,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingVertical: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 1,
    borderColor: "#EFF2F7",
  },
  popoverMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  popoverMenuText: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 12,
    color: "#29343D",
  },
});
