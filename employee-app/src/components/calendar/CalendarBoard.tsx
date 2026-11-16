import React, { useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Modal,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, fonts, radius, shadows } from "@/constants/figmaTheme";
import { Anchor, SquareAvatar } from "./ui";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import CalendarToolbar from "./CalendarToolbar";
import TeamFilterSheet from "./TeamFilterSheet";
import SearchMemberModal from "./SearchMemberModal";
import AppointmentPreviewSheet from "./AppointmentPreviewSheet";
import DraggableAppointmentBlock from "./DraggableAppointmentBlock";
import { CalAppointment, CalendarViewMode, StaffMember } from "./types";
import {
  CURRENT_EMPLOYEE_ID,
  END_HOUR,
  HOUR_HEIGHT,
  INITIAL_SCROLL_HOUR,
  START_HOUR,
  TIME_COLUMN_WIDTH,
  COLUMN_WIDTH,
  WEEKDAYS_LONG,
  WEEKDAYS_SHORT,
  addDays,
  addMonths,
  appointmentRoute,
  formatDayLabel,
  formatMonthLabel,
  formatTimeSlot,
  formatWeekLabel,
  getMonthMatrix,
  isSameDay,
  staffList,
  startOfWeek,
  statusTheme,
  timeToMinutes,
  to12h,
  toISODate,
  useAppointmentsStore,
} from "./data";

interface Props {
  initialStaffIds?: string[];
  initialViewMode?: CalendarViewMode;
  /** Shows the magnifier next to the team dropdown that opens "Search a Member". */
  showMemberSearch?: boolean;
}

const hoursList = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => START_HOUR + i);
const WEEK_COL_MIN = 128;
const MONTH_CELL_HEIGHT = 112;
const MONTH_MAX_LABELS = 3;

export default function CalendarBoard({
  initialStaffIds = [CURRENT_EMPLOYEE_ID],
  initialViewMode = "day",
  showMemberSearch = false,
}: Props) {
  const { width: screenWidth } = useWindowDimensions();
  const [appointments, setAppointments] = useAppointmentsStore();

  const [viewMode, setViewMode] = useState<CalendarViewMode>(initialViewMode);
  const [anchorDate, setAnchorDate] = useState<Date>(new Date());
  const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>(initialStaffIds);
  const [teamAnchor, setTeamAnchor] = useState<Anchor | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const insets = useSafeAreaInsets();
  const [memberSearchOpen, setMemberSearchOpen] = useState(false);
  const [previewAppt, setPreviewAppt] = useState<CalAppointment | null>(null);
  const [boardHeight, setBoardHeight] = useState(0);
  const gridScrollRef = useRef<ScrollView>(null);
  const scrollToInitialHour = () =>
    gridScrollRef.current?.scrollTo({ y: (INITIAL_SCROLL_HOUR - START_HOUR) * HOUR_HEIGHT, animated: false });
  const [dragInfo, setDragInfo] = useState<{ staff: StaffMember; start: string; end: string } | null>(null);

  const visibleStaff = useMemo(
    () => staffList.filter((s) => selectedStaffIds.includes(s.id)),
    [selectedStaffIds]
  );

  const staffAppointments = useMemo(
    () => appointments.filter((a) => selectedStaffIds.includes(a.staffId)),
    [appointments, selectedStaffIds]
  );

  const anchorISO = toISODate(anchorDate);
  const today = new Date();

  // ------------------------------------------------------------------ Navigation
  const dateLabel =
    viewMode === "day"
      ? formatDayLabel(anchorDate)
      : viewMode === "week"
      ? formatWeekLabel(anchorDate)
      : formatMonthLabel(anchorDate);

  const handlePrev = () => {
    if (viewMode === "day") setAnchorDate((d) => addDays(d, -1));
    else if (viewMode === "week") setAnchorDate((d) => addDays(d, -7));
    else setAnchorDate((d) => addMonths(d, -1));
  };

  const handleNext = () => {
    if (viewMode === "day") setAnchorDate((d) => addDays(d, 1));
    else if (viewMode === "week") setAnchorDate((d) => addDays(d, 7));
    else setAnchorDate((d) => addMonths(d, 1));
  };

  const openDay = (d: Date) => {
    setAnchorDate(d);
    setViewMode("day");
  };

  const openDetails = (appt: CalAppointment) => {
    router.push(appointmentRoute(appt.id) as any);
  };

  const openAdd = (staffId: string, date: string, hour: number, half: boolean) => {
    router.push({
      pathname: "/(drawer)/(tabs)/calendar/add" as any,
      params: { staffId, date, startTime: `${String(hour).padStart(2, "0")}:${half ? "30" : "00"}` },
    });
  };

  // ------------------------------------------------------------------ Drag handlers
  const handleDragEnd = (appt: CalAppointment, newStaff: StaffMember, newStart: string, newEnd: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === appt.id ? { ...a, staffId: newStaff.id, startTime: newStart, endTime: newEnd } : a))
    );
    setDragInfo(null);
  };

  // ------------------------------------------------------------------ Day view
  const renderDayView = () => {
    const available = screenWidth - TIME_COLUMN_WIDTH;
    const colWidth =
      visibleStaff.length <= 2 ? Math.max(COLUMN_WIDTH, available / Math.max(1, visibleStaff.length)) : COLUMN_WIDTH;
    const gridWidth = TIME_COLUMN_WIDTH + visibleStaff.length * colWidth;
    const gridHeight = hoursList.length * HOUR_HEIGHT;
    const dayAppts = staffAppointments.filter((a) => a.date === anchorISO);

    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEnabled={!dragInfo}
        contentContainerStyle={{ minWidth: gridWidth }}
      >
        <View style={{ width: gridWidth, height: boardHeight }}>
          {/* Team member headers */}
          <View style={styles.stickyHeader}>
            <View style={[styles.timeHeaderCell, { width: TIME_COLUMN_WIDTH }]} />
            {visibleStaff.map((s) => (
              <View key={s.id} style={[styles.staffHeaderCell, { width: colWidth }]}>
                <SquareAvatar uri={s.avatar} name={s.name} size={40} bg={s.bgColor} rounded={10} />
                <Text style={styles.staffHeaderName} numberOfLines={1}>
                  {s.name}
                </Text>
              </View>
            ))}
          </View>

          <ScrollView
            style={{ flex: 1 }}
            scrollEnabled={!dragInfo}
            showsVerticalScrollIndicator={false}
            ref={gridScrollRef}
            onLayout={scrollToInitialHour}
          >
            <View style={[styles.gridBody, { height: gridHeight }]}>
              <View style={[styles.timeAxisColumn, { width: TIME_COLUMN_WIDTH }]}>
                {hoursList.map((hour) => (
                  <View key={hour} style={[styles.timeAxisCell, { height: HOUR_HEIGHT }]}>
                    <Text style={styles.timeAxisText}>{formatTimeSlot(hour)}</Text>
                  </View>
                ))}
              </View>

              {hoursList.map((hour, idx) => (
                <React.Fragment key={`line-${hour}`}>
                  <View style={[styles.gridLineHour, { top: idx * HOUR_HEIGHT, left: TIME_COLUMN_WIDTH, right: 0 }]} />
                  <View
                    style={[
                      styles.gridLineHalf,
                      { top: idx * HOUR_HEIGHT + HOUR_HEIGHT / 2, left: TIME_COLUMN_WIDTH, right: 0 },
                    ]}
                  />
                </React.Fragment>
              ))}

              {visibleStaff.map((s, colIdx) => (
                <View
                  key={`col-${s.id}`}
                  style={[
                    styles.staffColumn,
                    { left: TIME_COLUMN_WIDTH + colIdx * colWidth, width: colWidth, height: gridHeight },
                  ]}
                >
                  <View style={styles.columnBorder} />
                  {hoursList.map((hour) => (
                    <React.Fragment key={`slot-${s.id}-${hour}`}>
                      <TouchableOpacity
                        style={[styles.slot, { top: (hour - START_HOUR) * HOUR_HEIGHT, height: HOUR_HEIGHT / 2 }]}
                        activeOpacity={0.5}
                        onPress={() => openAdd(s.id, anchorISO, hour, false)}
                      />
                      <TouchableOpacity
                        style={[
                          styles.slot,
                          { top: (hour - START_HOUR) * HOUR_HEIGHT + HOUR_HEIGHT / 2, height: HOUR_HEIGHT / 2 },
                        ]}
                        activeOpacity={0.5}
                        onPress={() => openAdd(s.id, anchorISO, hour, true)}
                      />
                    </React.Fragment>
                  ))}
                </View>
              ))}

              <View style={styles.appointmentsLayer} pointerEvents="box-none">
                {dayAppts.map((appt) => {
                  const colIdx = visibleStaff.findIndex((s) => s.id === appt.staffId);
                  if (colIdx === -1) return null;
                  return (
                    <DraggableAppointmentBlock
                      key={appt.id}
                      appointment={appt}
                      staff={visibleStaff[colIdx]}
                      columnIndex={colIdx}
                      baseLeft={TIME_COLUMN_WIDTH + colIdx * colWidth + 4}
                      colWidth={colWidth}
                      hourHeight={HOUR_HEIGHT}
                      staffList={visibleStaff}
                      onPress={setPreviewAppt}
                      onDragStart={(a) =>
                        setDragInfo({ staff: visibleStaff[colIdx], start: a.startTime, end: a.endTime })
                      }
                      onDragUpdate={(_a, staff, start, end) => setDragInfo({ staff, start, end })}
                      onDragEnd={handleDragEnd}
                    />
                  );
                })}
              </View>

            </View>
          </ScrollView>
        </View>
      </ScrollView>
    );
  };

  // ------------------------------------------------------------------ Week view
  const renderWeekView = () => {
    const weekStart = startOfWeek(anchorDate);
    const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    const colWidth = Math.max(WEEK_COL_MIN, (screenWidth - TIME_COLUMN_WIDTH) / 7);
    const gridWidth = TIME_COLUMN_WIDTH + 7 * colWidth;
    const gridHeight = hoursList.length * HOUR_HEIGHT;
    const defaultStaffId = selectedStaffIds.includes(CURRENT_EMPLOYEE_ID) ? CURRENT_EMPLOYEE_ID : selectedStaffIds[0];

    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ minWidth: gridWidth }}>
        <View style={{ width: gridWidth, height: boardHeight }}>
          <View style={[styles.stickyHeader, styles.weekHeaderRow]}>
            <View style={[styles.timeHeaderCell, { width: TIME_COLUMN_WIDTH }]} />
            {days.map((d) => {
              const isToday = isSameDay(d, today);
              return (
                <TouchableOpacity
                  key={toISODate(d)}
                  style={[styles.weekHeaderCell, { width: colWidth }]}
                  onPress={() => openDay(d)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.weekHeaderDay, isToday && { color: colors.primary }]} numberOfLines={1}>
                    {String(d.getDate()).padStart(2, "0")} {WEEKDAYS_LONG[d.getDay()]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <ScrollView
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            ref={gridScrollRef}
            onLayout={scrollToInitialHour}
          >
            <View style={[styles.gridBody, { height: gridHeight }]}>
              <View style={[styles.timeAxisColumn, { width: TIME_COLUMN_WIDTH }]}>
                {hoursList.map((hour) => (
                  <View key={hour} style={[styles.timeAxisCell, { height: HOUR_HEIGHT }]}>
                    <Text style={styles.timeAxisText}>{formatTimeSlot(hour)}</Text>
                  </View>
                ))}
              </View>

              {/* Figma week grid: hour line + three 15-minute lines per hour */}
              {hoursList.map((hour, idx) =>
                [0, 1, 2, 3].map((q) => (
                  <View
                    key={`wline-${hour}-${q}`}
                    style={[
                      styles.gridLineHour,
                      { top: idx * HOUR_HEIGHT + (q * HOUR_HEIGHT) / 4, left: TIME_COLUMN_WIDTH, right: 0 },
                    ]}
                  />
                ))
              )}

              {days.map((d, colIdx) => {
                const iso = toISODate(d);
                const dayAppts = staffAppointments.filter((a) => a.date === iso);
                return (
                  <View
                    key={`wcol-${iso}`}
                    style={[
                      styles.staffColumn,
                      { left: TIME_COLUMN_WIDTH + colIdx * colWidth, width: colWidth, height: gridHeight },
                    ]}
                  >
                    <View style={styles.columnBorder} />
                    {hoursList.map((hour) => (
                      <TouchableOpacity
                        key={`wslot-${iso}-${hour}`}
                        style={[styles.slot, { top: (hour - START_HOUR) * HOUR_HEIGHT, height: HOUR_HEIGHT }]}
                        activeOpacity={0.5}
                        onPress={() => openAdd(defaultStaffId, iso, hour, false)}
                      />
                    ))}
                    {dayAppts.map((appt) => {
                      const theme = statusTheme[appt.status];
                      const top = ((timeToMinutes(appt.startTime) - START_HOUR * 60) / 60) * HOUR_HEIGHT;
                      const height = Math.max(
                        HOUR_HEIGHT / 4,
                        ((timeToMinutes(appt.endTime) - timeToMinutes(appt.startTime)) / 60) * HOUR_HEIGHT
                      );
                      return (
                        <Pressable
                          key={appt.id}
                          style={[
                            styles.weekBlock,
                            { top: top + 1, height: height - 2, backgroundColor: theme.bg, borderLeftColor: theme.border },
                          ]}
                          onPress={() => setPreviewAppt(appt)}
                        >
                          <Text style={[styles.weekBlockTitle, { color: theme.text }]} numberOfLines={1}>
                            {appt.service} ({appt.clientName}) - {to12h(appt.startTime)} - {to12h(appt.endTime)}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    );
  };

  // ------------------------------------------------------------------ Month view
  const renderMonthView = () => {
    const matrix = getMonthMatrix(anchorDate);
    const month = anchorDate.getMonth();
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.monthHeaderRow}>
          {WEEKDAYS_SHORT.map((d) => (
            <Text key={d} style={styles.monthHeaderText}>
              {d}
            </Text>
          ))}
        </View>
        {matrix.map((row, rIdx) => (
          <View key={`row-${rIdx}`} style={styles.monthRow}>
            {row.map((d) => {
              const iso = toISODate(d);
              const inMonth = d.getMonth() === month;
              const isToday = isSameDay(d, today);
              const dayAppts = staffAppointments
                .filter((a) => a.date === iso)
                .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
              return (
                <TouchableOpacity
                  key={iso}
                  style={styles.monthCell}
                  activeOpacity={0.7}
                  onPress={() => openDay(d)}
                >
                  {isToday && <View style={styles.monthTodayBg} pointerEvents="none" />}
                  <Text style={[styles.monthDateText, !inMonth && styles.monthDateOut]}>{d.getDate()}</Text>
                  {dayAppts.slice(0, MONTH_MAX_LABELS).map((appt) => {
                    const theme = statusTheme[appt.status];
                    return (
                      <Pressable
                        key={appt.id}
                        style={[styles.monthLabel, { backgroundColor: theme.bg, borderLeftColor: theme.border }]}
                        onPress={() => setPreviewAppt(appt)}
                      >
                        <Text style={[styles.monthLabelText, { color: theme.text }]} numberOfLines={1}>
                          {appt.service} ({appt.clientName}) - {to12h(appt.startTime)}
                        </Text>
                      </Pressable>
                    );
                  })}
                  {dayAppts.length > MONTH_MAX_LABELS && (
                    <Text style={styles.monthMore}>+{dayAppts.length - MONTH_MAX_LABELS} more</Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </ScrollView>
    );
  };

  const renderBoard = (isFull: boolean) => (
    <View style={[styles.card, isFull && styles.cardFull]}>
      <CalendarToolbar
        selectedStaffIds={selectedStaffIds}
        onOpenTeamFilter={setTeamAnchor}
        onOpenSearch={showMemberSearch ? () => setMemberSearchOpen(true) : undefined}
        dateLabel={dateLabel}
        onPrev={handlePrev}
        onNext={handleNext}
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
        onToggleFullscreen={() => setFullscreen(!isFull)}
        fullscreenActive={isFull}
      />

      <View style={styles.boardBody} onLayout={(e) => setBoardHeight(e.nativeEvent.layout.height)}>
        {viewMode === "day" ? renderDayView() : viewMode === "week" ? renderWeekView() : renderMonthView()}
      </View>

      {dragInfo && (
        <View style={styles.dragBannerWrap} pointerEvents="none">
          <View style={styles.dragBanner}>
            <Ionicons name="move" size={14} color={colors.white} />
            <Text style={styles.dragBannerText}>
              <Text style={{ fontFamily: fonts.bold }}>{dragInfo.staff.name}</Text> • {dragInfo.start} - {dragInfo.end}
            </Text>
          </View>
        </View>
      )}
    </View>
  );

  const overlays = (
    <>
      <TeamFilterSheet
        visible={!!teamAnchor}
        anchor={teamAnchor}
        onClose={() => setTeamAnchor(null)}
        selectedIds={selectedStaffIds}
        onChange={setSelectedStaffIds}
      />
      <SearchMemberModal
        visible={memberSearchOpen}
        onClose={() => setMemberSearchOpen(false)}
        onSelect={(m) => setSelectedStaffIds([m.id])}
      />
      <AppointmentPreviewSheet appointment={previewAppt} onClose={() => setPreviewAppt(null)} onViewDetails={openDetails} />
    </>
  );

  return (
    <View style={styles.container}>
      {!fullscreen && renderBoard(false)}
      {!fullscreen && overlays}

      {/* Full screen calendar (Figma 1:16704) */}
      <Modal visible={fullscreen} animationType="fade" onRequestClose={() => setFullscreen(false)}>
        <View style={[styles.fullWrap, { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 8 }]}>
          {renderBoard(true)}
        </View>
        {fullscreen && overlays}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.canvas,
    padding: 16,
    paddingTop: 12,
  },
  card: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.card,
    padding: 14,
    gap: 14,
    ...shadows.card,
  },
  cardFull: {
    shadowOpacity: 0,
    elevation: 0,
  },
  fullWrap: {
    flex: 1,
    backgroundColor: colors.canvas,
    paddingHorizontal: 12,
  },
  boardBody: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  stickyHeader: {
    flexDirection: "row",
    height: 88,
    alignItems: "center",
    backgroundColor: colors.primaryTint,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  timeHeaderCell: {
    height: "100%",
  },
  staffHeaderCell: {
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: 6,
    height: "100%",
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
  },
  staffHeaderName: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.text,
  },
  weekHeaderCell: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
    paddingHorizontal: 4,
  },
  weekHeaderDay: {
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.text,
  },
  gridBody: {
    position: "relative",
    backgroundColor: colors.white,
  },
  timeAxisColumn: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: colors.white,
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  timeAxisCell: {
    alignItems: "center",
    paddingTop: 4,
  },
  timeAxisText: {
    fontFamily: fonts.regular,
    fontSize: 11.5,
    color: colors.textMuted,
  },
  gridLineHour: {
    position: "absolute",
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  gridLineHalf: {
    position: "absolute",
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    borderStyle: "dashed",
  },
  staffColumn: {
    position: "absolute",
    top: 0,
    zIndex: 1,
  },
  columnBorder: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: colors.border,
  },
  slot: {
    position: "absolute",
    left: 1,
    right: 1,
    backgroundColor: "rgba(0,0,0,0.001)",
  },
  appointmentsLayer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  weekBlock: {
    position: "absolute",
    left: 2,
    right: 4,
    borderRadius: 4,
    borderLeftWidth: 2,
    paddingHorizontal: 6,
    paddingVertical: 4,
    overflow: "hidden",
    zIndex: 5,
  },
  weekBlockTitle: {
    fontFamily: fonts.regular,
    fontSize: 13,
  },
  monthHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    backgroundColor: colors.subtleAlt,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  monthHeaderText: {
    flex: 1,
    textAlign: "center",
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textSecondary,
  },
  monthRow: {
    flexDirection: "row",
  },
  monthCell: {
    flex: 1,
    height: MONTH_CELL_HEIGHT,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    paddingTop: 4,
    gap: 3,
    backgroundColor: colors.white,
  },
  monthDateText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    textAlign: "right",
    paddingRight: 5,
  },
  monthDateOut: {
    color: "#CBD0D6",
  },
  monthTodayBg: {
    position: "absolute",
    top: 2,
    left: 2,
    right: 2,
    bottom: 2,
    borderRadius: 4,
    backgroundColor: colors.borderLight,
  },
  weekHeaderRow: {
    height: 44,
    backgroundColor: colors.white,
  },
  monthLabel: {
    borderRadius: 4,
    borderLeftWidth: 2,
    paddingHorizontal: 4,
    paddingVertical: 3,
  },
  monthLabelText: {
    fontFamily: fonts.regular,
    fontSize: 10,
  },
  monthMore: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 9,
    color: colors.primary,
    paddingLeft: 2,
  },
  dragBannerWrap: {
    position: "absolute",
    bottom: 24,
    left: 20,
    right: 20,
    alignItems: "center",
    zIndex: 999,
  },
  dragBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 24,
    gap: 8,
    elevation: 10,
  },
  dragBannerText: {
    fontFamily: "Manrope_500Medium",
    fontSize: 12.5,
    color: colors.white,
  },
});
