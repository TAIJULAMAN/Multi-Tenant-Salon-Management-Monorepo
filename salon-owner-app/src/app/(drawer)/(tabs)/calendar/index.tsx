import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Header from "@/components/Header";
import Avatar from "@/components/Avatar";
import {
  CalAppointment,
  StaffMember,
} from "@/components/appointment/types";
import {
  staffList,
  START_HOUR,
  END_HOUR,
  HOUR_HEIGHT,
  COLUMN_WIDTH,
  TIME_COLUMN_WIDTH,
  formatTimeSlot,
  timeToMinutes,
  useAppointmentsStore,
  deleteAppointmentFromStore,
  addAppointmentToStore,
} from "@/components/appointment/data";
import DraggableAppointmentBlock from "@/components/appointment/DraggableAppointmentBlock";
import AppointmentSubHeader from "@/components/appointment/AppointmentSubHeader";
import AppointmentMenuModal from "@/components/appointment/AppointmentMenuModal";
import AppointmentSettingsModal from "@/components/appointment/AppointmentSettingsModal";
import ImportAppointmentsModal from "@/components/appointment/ImportAppointmentsModal";
import AppointmentTableView from "@/components/appointment/AppointmentTableView";
import DeleteAppointmentModal from "@/components/appointment/DeleteAppointmentModal";

const days = [
  { dayName: "Mon", date: "09", fullDate: "2026-02-09" },
  { dayName: "Tue", date: "10", fullDate: "2026-02-10" },
  { dayName: "Wed", date: "11", fullDate: "2026-02-11" },
  { dayName: "Thu", date: "12", fullDate: "2026-02-12" },
  { dayName: "Fri", date: "13", fullDate: "2026-02-13", active: true },
  { dayName: "Sat", date: "14", fullDate: "2026-02-14" },
  { dayName: "Sun", date: "15", fullDate: "2026-02-15" },
];

const hoursList = Array.from(
  { length: END_HOUR - START_HOUR + 1 },
  (_, i) => START_HOUR + i
);

export default function AppointmentScreen() {
  const [currentMonth, setCurrentMonth] = useState("February 2026");
  const [activeMainView, setActiveMainView] = useState<"calendar" | "table">(
    "calendar"
  );
  const [selectedDay, setSelectedDay] = useState("13");
  const [selectedStaffFilter, setSelectedStaffFilter] = useState<string | null>(
    null
  );

  // Reactive appointments store
  const [appointments, setAppointments] = useAppointmentsStore();

  // Delete Confirmation Modal State
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteTargetAppt, setDeleteTargetAppt] = useState<CalAppointment | null>(
    null
  );

  // 3-Dot Menu & Functional Modals State
  const [menuModalVisible, setMenuModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [settingsInitialTab, setSettingsInitialTab] = useState<
    "general" | "notifications"
  >("general");
  const [importModalVisible, setImportModalVisible] = useState(false);

  // Drag state for live feedback & ghost highlight
  const [dragFeedback, setDragFeedback] = useState<{
    isDragging: boolean;
    apptId: string;
    targetStaff: StaffMember;
    snappedStart: string;
    snappedEnd: string;
  } | null>(null);

  const visibleStaff = useMemo(() => {
    if (!selectedStaffFilter) return staffList;
    return staffList.filter((s) => s.id === selectedStaffFilter);
  }, [selectedStaffFilter]);

  const activeDateObj = days.find((d) => d.date === selectedDay) || days[4];

  // Appointments for the active day and filters
  const dayAppointments = useMemo(() => {
    return appointments.filter((appt) => {
      const matchDay = appt.date === activeDateObj.fullDate;
      const matchStaff =
        selectedStaffFilter === null || appt.staffId === selectedStaffFilter;
      return matchDay && matchStaff;
    });
  }, [appointments, activeDateObj, selectedStaffFilter]);

  // Click on empty cell to navigate to dedicated Add Appointment flow
  const handleCellPress = (staffId: string, hour: number, isHalfHour: boolean) => {
    const startStr = `${String(hour).padStart(2, "0")}:${
      isHalfHour ? "30" : "00"
    }`;
    router.push({
      pathname: "/calendar/add",
      params: {
        staffId,
        startTime: startStr,
        date: activeDateObj.fullDate,
      },
    });
  };

  // Open dedicated Add Appointment screen
  const handleOpenCreateScreen = () => {
    router.push({
      pathname: "/calendar/add",
      params: {
        staffId: visibleStaff[0]?.id || staffList[0].id,
        startTime: "09:00",
        date: activeDateObj.fullDate,
      },
    });
  };

  // Open dedicated edit screen
  const handleOpenEditScreen = (appt: CalAppointment) => {
    router.push({
      pathname: "/calendar/form",
      params: {
        mode: "edit",
        id: appt.id,
      },
    });
  };

  // Open dedicated view details screen
  const handleOpenDetailsModal = (appt: CalAppointment) => {
    router.push({
      pathname: "/calendar/details",
      params: { id: appt.id },
    });
  };

  // Prompt delete modal
  const handlePromptDelete = (appt: CalAppointment) => {
    setDeleteTargetAppt(appt);
    setDeleteModalVisible(true);
  };

  // Confirm delete
  const handleConfirmDelete = () => {
    if (deleteTargetAppt) {
      deleteAppointmentFromStore(deleteTargetAppt.id);
      setDeleteTargetAppt(null);
    }
  };

  // Drag handlers
  const handleDragStart = (appt: CalAppointment) => {
    const staff = staffList.find((s) => s.id === appt.staffId) || staffList[0];
    setDragFeedback({
      isDragging: true,
      apptId: appt.id,
      targetStaff: staff,
      snappedStart: appt.startTime,
      snappedEnd: appt.endTime,
    });
  };

  const handleDragUpdate = (
    appt: CalAppointment,
    hoverStaff: StaffMember,
    snappedStart: string,
    snappedEnd: string
  ) => {
    setDragFeedback({
      isDragging: true,
      apptId: appt.id,
      targetStaff: hoverStaff,
      snappedStart,
      snappedEnd,
    });
  };

  const handleDragEnd = (
    appt: CalAppointment,
    newStaff: StaffMember,
    newStart: string,
    newEnd: string
  ) => {
    setAppointments((prev) =>
      prev.map((a) => {
        if (a.id === appt.id) {
          return {
            ...a,
            staffId: newStaff.id,
            startTime: newStart,
            endTime: newEnd,
          };
        }
        return a;
      })
    );
    setDragFeedback(null);
  };

  // 3-Dot Menu Actions
  const handleOpenSettingsTab = (
    tab: "general" | "notifications"
  ) => {
    setSettingsInitialTab(tab);
    setSettingsModalVisible(true);
  };

  const handleOpenImport = () => {
    setImportModalVisible(true);
  };

  const handleImportSuccess = (imported: CalAppointment[]) => {
    imported.forEach((item) => addAppointmentToStore(item));
  };

  const handleExportData = () => {
    Alert.alert(
      "Export Appointments",
      `Export ${appointments.length} appointments to CSV format?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Export & Share",
          onPress: () => {
            Alert.alert(
              "Export Complete",
              "Appointments CSV exported successfully."
            );
          },
        },
      ]
    );
  };

  const totalGridHeight = hoursList.length * HOUR_HEIGHT;
  const totalGridWidth = TIME_COLUMN_WIDTH + visibleStaff.length * COLUMN_WIDTH;

  return (
    <View style={styles.container}>
      {/* 1. Main App Header */}
      <Header />

      {/* 2. Sub-Header below main header */}
      <AppointmentSubHeader
        onOpenMenu={() => setMenuModalVisible(true)}
        onAddAppointment={handleOpenCreateScreen}
      />

      {/* 3. Controls Row: Month navigation on left, ICON-ONLY View Changing toggle on right */}
      <View style={styles.controlsRow}>
        <View style={styles.monthSelector}>
          <TouchableOpacity style={styles.arrowBtn}>
            <Ionicons name="chevron-back" size={17} color="#4B5563" />
          </TouchableOpacity>
          <Text style={styles.monthText}>{currentMonth}</Text>
          <TouchableOpacity style={styles.arrowBtn}>
            <Ionicons name="chevron-forward" size={17} color="#4B5563" />
          </TouchableOpacity>
        </View>

        {/* View Changing Tab (ICON ONLY) */}
        <View style={styles.viewModeToggle}>
          <TouchableOpacity
            style={[
              styles.viewToggleIconBtn,
              activeMainView === "calendar" && styles.viewToggleIconBtnActive,
            ]}
            onPress={() => setActiveMainView("calendar")}
            activeOpacity={0.7}
          >
            <Ionicons
              name="calendar-outline"
              size={17}
              color={activeMainView === "calendar" ? "#FFFFFF" : "#6B7280"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.viewToggleIconBtn,
              activeMainView === "table" && styles.viewToggleIconBtnActive,
            ]}
            onPress={() => setActiveMainView("table")}
            activeOpacity={0.7}
          >
            <Ionicons
              name="list-outline"
              size={18}
              color={activeMainView === "table" ? "#FFFFFF" : "#6B7280"}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* 4. Conditional View Content */}
      {activeMainView === "table" ? (
        <AppointmentTableView
          appointments={appointments}
          onViewDetails={handleOpenDetailsModal}
          onEditAppointment={handleOpenEditScreen}
          onDeleteAppointment={handlePromptDelete}
        />
      ) : (
        /* Calendar View */
        <View style={{ flex: 1 }}>
          {/* Date Slider */}
          <View style={styles.dateSliderContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.dateSlider}
            >
              {days.map((item) => {
                const isActive = selectedDay === item.date;
                return (
                  <TouchableOpacity
                    key={item.date}
                    style={[styles.dateCard, isActive && styles.dateCardActive]}
                    onPress={() => setSelectedDay(item.date)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.dayNameText,
                        isActive && styles.dayNameTextActive,
                      ]}
                    >
                      {item.dayName}
                    </Text>
                    <Text
                      style={[
                        styles.dateNumberText,
                        isActive && styles.dateNumberTextActive,
                      ]}
                    >
                      {item.date}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Staff Filter Bar */}
          <View style={styles.filterBar}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterSlider}
            >
              <TouchableOpacity
                style={[
                  styles.staffPill,
                  selectedStaffFilter === null && styles.staffPillActive,
                ]}
                onPress={() => setSelectedStaffFilter(null)}
              >
                <Ionicons
                  name="people-outline"
                  size={14}
                  color={selectedStaffFilter === null ? "#FFFFFF" : "#6B7280"}
                />
                <Text
                  style={[
                    styles.staffPillText,
                    selectedStaffFilter === null && styles.staffPillTextActive,
                  ]}
                >
                  All Team ({staffList.length})
                </Text>
              </TouchableOpacity>

              {staffList.map((s) => {
                const isActive = selectedStaffFilter === s.id;
                return (
                  <TouchableOpacity
                    key={s.id}
                    style={[
                      styles.staffPill,
                      isActive && styles.staffPillActive,
                    ]}
                    onPress={() =>
                      setSelectedStaffFilter(isActive ? null : s.id)
                    }
                  >
                    <Avatar name={s.name} uri={s.avatar} size={18} />
                    <Text
                      style={[
                        styles.staffPillText,
                        isActive && styles.staffPillTextActive,
                      ]}
                    >
                      {s.name.split(" ")[0]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Grid View */}
          <View style={styles.gridWrapper}>
            <ScrollView
              style={styles.gridVerticalScroll}
              scrollEnabled={!dragFeedback?.isDragging}
              showsVerticalScrollIndicator={false}
            >
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ minWidth: totalGridWidth }}
              >
                <View style={{ width: totalGridWidth }}>
                  {/* Sticky Header: Staff Avatars */}
                  <View style={styles.stickyHeader}>
                    <View style={styles.timeHeaderCell}>
                      <Ionicons
                        name="time-outline"
                        size={13}
                        color="#635BFF"
                      />
                      <Text style={styles.timeHeaderLabel}>Time</Text>
                    </View>

                    {visibleStaff.map((staff) => (
                      <View
                        key={staff.id}
                        style={[
                          styles.staffHeaderCell,
                          { width: COLUMN_WIDTH },
                        ]}
                      >
                        <Avatar
                          name={staff.name}
                          uri={staff.avatar}
                          size={32}
                        />
                        <View style={{ marginLeft: 7, flex: 1 }}>
                          <Text
                            style={styles.staffHeaderName}
                            numberOfLines={1}
                          >
                            {staff.name.split(" ")[0]}
                          </Text>
                          <Text
                            style={styles.staffHeaderRole}
                            numberOfLines={1}
                          >
                            {staff.role}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>

                  {/* Grid Body */}
                  <View
                    style={[styles.gridBody, { height: totalGridHeight }]}
                  >
                    {/* Left Time Column */}
                    <View style={styles.timeAxisColumn}>
                      {hoursList.map((hour) => (
                        <View
                          key={`time-${hour}`}
                          style={[
                            styles.timeAxisCell,
                            { height: HOUR_HEIGHT },
                          ]}
                        >
                          <Text style={styles.timeAxisText}>
                            {formatTimeSlot(hour)}
                          </Text>
                        </View>
                      ))}
                    </View>

                    {/* Horizontal Grid Lines */}
                    {hoursList.map((hour, idx) => (
                      <React.Fragment key={`lines-${hour}`}>
                        <View
                          style={[
                            styles.gridLineHour,
                            {
                              top: idx * HOUR_HEIGHT,
                              left: TIME_COLUMN_WIDTH,
                              right: 0,
                            },
                          ]}
                        />
                        <View
                          style={[
                            styles.gridLineHalfHour,
                            {
                              top: idx * HOUR_HEIGHT + HOUR_HEIGHT / 2,
                              left: TIME_COLUMN_WIDTH,
                              right: 0,
                            },
                          ]}
                        />
                      </React.Fragment>
                    ))}

                    {/* Staff Columns */}
                    {visibleStaff.map((staff, colIdx) => {
                      const colLeft =
                        TIME_COLUMN_WIDTH + colIdx * COLUMN_WIDTH;
                      const isGhostTarget =
                        dragFeedback?.isDragging &&
                        dragFeedback.targetStaff.id === staff.id;

                      const ghostTop = isGhostTarget
                        ? ((timeToMinutes(dragFeedback.snappedStart) -
                            START_HOUR * 60) /
                            60) *
                          HOUR_HEIGHT
                        : 0;
                      const ghostHeight = isGhostTarget
                        ? Math.max(
                            42,
                            ((timeToMinutes(dragFeedback.snappedEnd) -
                              timeToMinutes(dragFeedback.snappedStart)) /
                              60) *
                              HOUR_HEIGHT
                          )
                        : 0;

                      return (
                        <View
                          key={`col-${staff.id}`}
                          style={[
                            styles.staffColumn,
                            {
                              left: colLeft,
                              width: COLUMN_WIDTH,
                              height: totalGridHeight,
                            },
                          ]}
                        >
                          <View style={styles.columnBorder} />

                          {/* Interactive Clickable Half-Hour Slots */}
                          {hoursList.map((hour) => (
                            <React.Fragment key={`slot-${staff.id}-${hour}`}>
                              <TouchableOpacity
                                style={[
                                  styles.slotClickable,
                                  {
                                    top: (hour - START_HOUR) * HOUR_HEIGHT,
                                    height: HOUR_HEIGHT / 2,
                                  },
                                ]}
                                activeOpacity={0.5}
                                onPress={() =>
                                  handleCellPress(staff.id, hour, false)
                                }
                              />
                              <TouchableOpacity
                                style={[
                                  styles.slotClickable,
                                  {
                                    top:
                                      (hour - START_HOUR) * HOUR_HEIGHT +
                                      HOUR_HEIGHT / 2,
                                    height: HOUR_HEIGHT / 2,
                                  },
                                ]}
                                activeOpacity={0.5}
                                onPress={() =>
                                  handleCellPress(staff.id, hour, true)
                                }
                              />
                            </React.Fragment>
                          ))}

                          {/* Drop Ghost */}
                          {isGhostTarget && (
                            <View
                              style={[
                                styles.dropGhostBlock,
                                {
                                  top: ghostTop,
                                  height: ghostHeight - 4,
                                },
                              ]}
                            >
                              <Text
                                style={styles.dropGhostText}
                                numberOfLines={1}
                              >
                                Drop ({dragFeedback.snappedStart} -{" "}
                                {dragFeedback.snappedEnd})
                              </Text>
                            </View>
                          )}
                        </View>
                      );
                    })}

                    {/* Appointments Layer */}
                    <View
                      style={styles.appointmentsLayer}
                      pointerEvents="box-none"
                    >
                      {dayAppointments.map((appt) => {
                        const colIdx = visibleStaff.findIndex(
                          (s) => s.id === appt.staffId
                        );
                        if (colIdx === -1) return null;
                        const staff = visibleStaff[colIdx];
                        const baseLeft =
                          TIME_COLUMN_WIDTH + colIdx * COLUMN_WIDTH + 4;

                        return (
                          <DraggableAppointmentBlock
                            key={appt.id}
                            appointment={appt}
                            staff={staff}
                            columnIndex={colIdx}
                            baseLeft={baseLeft}
                            colWidth={COLUMN_WIDTH}
                            hourHeight={HOUR_HEIGHT}
                            staffList={visibleStaff}
                            onPress={(a) => handleOpenDetailsModal(a)}
                            onDragStart={handleDragStart}
                            onDragUpdate={handleDragUpdate}
                            onDragEnd={handleDragEnd}
                          />
                        );
                      })}
                    </View>
                  </View>
                </View>
              </ScrollView>
            </ScrollView>
          </View>

          {/* Drag Feedback Floating Overlay */}
          {dragFeedback && dragFeedback.isDragging && (
            <View style={styles.floatingBannerOverlay} pointerEvents="none">
              <View style={styles.dragFeedbackBanner}>
                <Ionicons name="move" size={14} color="#FFFFFF" />
                <Text style={styles.dragFeedbackText}>
                  Assign to{" "}
                  <Text style={{ fontFamily: "Manrope_700Bold" }}>
                    {dragFeedback.targetStaff.name}
                  </Text>{" "}
                  • {dragFeedback.snappedStart} - {dragFeedback.snappedEnd}
                </Text>
              </View>
            </View>
          )}
        </View>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteAppointmentModal
        visible={deleteModalVisible}
        appointmentTitle={deleteTargetAppt?.clientName}
        onClose={() => setDeleteModalVisible(false)}
        onConfirm={handleConfirmDelete}
      />

      {/* 3-Dot Dropdown Menu Modal */}
      <AppointmentMenuModal
        visible={menuModalVisible}
        onClose={() => setMenuModalVisible(false)}
        onOpenSettings={handleOpenSettingsTab}
        onOpenImport={handleOpenImport}
        onExportData={handleExportData}
      />

      {/* Settings Screen Modal */}
      <AppointmentSettingsModal
        visible={settingsModalVisible}
        initialTab={settingsInitialTab}
        onClose={() => setSettingsModalVisible(false)}
      />

      {/* Import Appointments Modal */}
      <ImportAppointmentsModal
        visible={importModalVisible}
        onClose={() => setImportModalVisible(false)}
        onImportSuccess={handleImportSuccess}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  controlsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  monthSelector: {
    flexDirection: "row",
    alignItems: "center",
  },
  arrowBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  monthText: {
    fontFamily: "Manrope_700Bold",
    fontSize: 14,
    color: "#1F2937",
    marginHorizontal: 8,
  },
  viewModeToggle: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 3,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 3,
  },
  viewToggleIconBtn: {
    width: 32,
    height: 30,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  viewToggleIconBtnActive: {
    backgroundColor: "#635BFF",
  },
  dateSliderContainer: {
    paddingLeft: 16,
    paddingBottom: 10,
  },
  dateSlider: {
    paddingRight: 16,
    gap: 8,
  },
  dateCard: {
    width: 48,
    height: 64,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  dateCardActive: {
    backgroundColor: "#635BFF",
    borderColor: "#635BFF",
  },
  dayNameText: {
    fontFamily: "Manrope_500Medium",
    fontSize: 10,
    color: "#9CA3AF",
    textTransform: "uppercase",
    marginBottom: 3,
  },
  dayNameTextActive: {
    color: "#E0E7FF",
  },
  dateNumberText: {
    fontFamily: "Manrope_700Bold",
    fontSize: 15,
    color: "#1F2937",
  },
  dateNumberTextActive: {
    color: "#FFFFFF",
  },
  filterBar: {
    paddingLeft: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  filterSlider: {
    paddingRight: 16,
    gap: 8,
    alignItems: "center",
  },
  staffPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 6,
  },
  staffPillActive: {
    backgroundColor: "#635BFF",
    borderColor: "#635BFF",
  },
  staffPillText: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 11,
    color: "#4B5563",
  },
  staffPillTextActive: {
    color: "#FFFFFF",
  },
  floatingBannerOverlay: {
    position: "absolute",
    bottom: 84,
    left: 20,
    right: 20,
    alignItems: "center",
    zIndex: 99999,
  },
  dragFeedbackBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4F46E5",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 24,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  dragFeedbackText: {
    fontFamily: "Manrope_500Medium",
    fontSize: 12.5,
    color: "#FFFFFF",
  },
  gridWrapper: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  gridVerticalScroll: {
    flex: 1,
  },
  stickyHeader: {
    flexDirection: "row",
    height: 52,
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  timeHeaderCell: {
    width: TIME_COLUMN_WIDTH,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  timeHeaderLabel: {
    fontFamily: "Manrope_700Bold",
    fontSize: 9.5,
    color: "#635BFF",
    textTransform: "uppercase",
  },
  staffHeaderCell: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    borderLeftWidth: 1,
    borderLeftColor: "#E5E7EB",
  },
  staffHeaderName: {
    fontFamily: "Manrope_700Bold",
    fontSize: 12,
    color: "#1F2937",
  },
  staffHeaderRole: {
    fontFamily: "Manrope_500Medium",
    fontSize: 9.5,
    color: "#9CA3AF",
  },
  gridBody: {
    position: "relative",
    backgroundColor: "#FFFFFF",
  },
  timeAxisColumn: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: TIME_COLUMN_WIDTH,
    backgroundColor: "#F9FAFB",
    borderRightWidth: 1,
    borderRightColor: "#E5E7EB",
  },
  timeAxisCell: {
    alignItems: "center",
    paddingTop: 4,
  },
  timeAxisText: {
    fontFamily: "Manrope_500Medium",
    fontSize: 9,
    color: "#9CA3AF",
  },
  gridLineHour: {
    position: "absolute",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  gridLineHalfHour: {
    position: "absolute",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    borderStyle: "dashed",
  },
  staffColumn: {
    position: "absolute",
    top: 0,
    bottom: 0,
    zIndex: 1,
  },
  columnBorder: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: "#E5E7EB",
  },
  slotClickable: {
    position: "absolute",
    left: 1,
    right: 1,
    backgroundColor: "rgba(0,0,0,0.001)",
    zIndex: 1,
  },
  dropGhostBlock: {
    position: "absolute",
    left: 4,
    right: 4,
    borderWidth: 2,
    borderColor: "#635BFF",
    borderStyle: "dashed",
    borderRadius: 8,
    backgroundColor: "rgba(99, 91, 255, 0.12)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 5,
    paddingHorizontal: 4,
  },
  dropGhostText: {
    fontFamily: "Manrope_700Bold",
    fontSize: 9.5,
    color: "#635BFF",
    textAlign: "center",
  },
  appointmentsLayer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
});
