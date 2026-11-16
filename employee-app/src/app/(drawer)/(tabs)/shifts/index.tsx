import React, { useRef, useState } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import Header from "@/components/Header";
import TabRootInset from "@/components/ui/TabRootInset";
import { colors } from "@/constants/figmaTheme";
import WeeklyScheduleView from "@/components/shifts/WeeklyScheduleView";
import AnchoredMenu, { MenuAnchor, MenuOption, measureAnchor } from "@/components/shifts/AnchoredMenu";
import AddTimeOffModal from "@/components/shifts/AddTimeOffModal";
import AddBlockedTimeModal, { BlockedTimeData } from "@/components/shifts/AddBlockedTimeModal";
import AddClosedPeriodModal, { ClosedPeriodData } from "@/components/shifts/AddClosedPeriodModal";
import EditShiftModal, { ShiftSegment } from "@/components/shifts/EditShiftModal";
import { PrimaryButton, SoftButton, TitleCard, figmaStyles } from "@/components/shifts/figmaUi";
import {
  DEFAULT_WEEK_START,
  INITIAL_SCHEDULE,
  ScheduleEntry,
  ScheduleMap,
  TimeOffRequest,
  addDays,
  daysBetween,
  formatDayHeader,
  formatWeekRange,
  makeId,
  parseMDY,
  startOfWeek,
  toISO,
} from "@/components/shifts/shiftsData";

const ADD_OPTIONS: MenuOption[] = [
  { key: "time_off", label: "Add Time Off" },
  { key: "blocked", label: "Add Blocked Time" },
  { key: "closed", label: "Business Closed Period" },
];

const SHIFT_OPTIONS: MenuOption[] = [
  { key: "edit", label: "Edit Shift", icon: "create-outline", iconColor: colors.teal },
  { key: "delete", label: "Delete Shift", icon: "trash-outline", iconColor: colors.pink },
];

const DELETE_LABEL: Record<ScheduleEntry["kind"], string> = {
  shift: "Delete Shift",
  time_off: "Delete Time Off",
  blocked: "Delete Blocked Time",
  closed: "Delete Closed Period",
};

/** Adds `entry` (with a fresh id) to every day in [start, end] (max 366 days). */
const addToRange = (map: ScheduleMap, start: Date, end: Date, entry: Omit<ScheduleEntry, "id">) => {
  const next = { ...map };
  const count = Math.min(daysBetween(start, end), 366);
  for (let i = 0; i < count; i++) {
    const iso = toISO(addDays(start, i));
    const existing = next[iso] ?? [];
    // Full-day time off / closures replace the working shifts of that day
    const keep = entry.start ? existing : existing.filter((e) => e.kind !== "shift");
    next[iso] = [...keep, { ...entry, id: makeId(entry.kind) }];
  }
  return next;
};

/** Figma 1:42980 (Scheduled Shifts) + 1:43220 (Edit shift) + Add Time Off frames. */
export default function ScheduledShiftsScreen() {
  const [weekStart, setWeekStart] = useState<Date>(DEFAULT_WEEK_START);
  const [schedule, setSchedule] = useState<ScheduleMap>(INITIAL_SCHEDULE);

  const addBtnRef = useRef<View>(null);
  const [addMenuAnchor, setAddMenuAnchor] = useState<MenuAnchor | null>(null);
  const [entryMenu, setEntryMenu] = useState<{ anchor: MenuAnchor; date: Date; entry: ScheduleEntry } | null>(null);

  const [isTimeOffOpen, setIsTimeOffOpen] = useState(false);
  const [isBlockedOpen, setIsBlockedOpen] = useState(false);
  const [isClosedOpen, setIsClosedOpen] = useState(false);
  const [editingDay, setEditingDay] = useState<Date | null>(null);

  const handleExport = () => {
    Alert.alert("Export Data", `Your scheduled shifts for ${formatWeekRange(weekStart)} are being exported.`);
  };

  const handleAddSelect = (key: string) => {
    if (key === "time_off") setIsTimeOffOpen(true);
    else if (key === "blocked") setIsBlockedOpen(true);
    else if (key === "closed") setIsClosedOpen(true);
  };

  const deleteEntry = (date: Date, entry: ScheduleEntry) => {
    const iso = toISO(date);
    setSchedule((prev) => ({ ...prev, [iso]: (prev[iso] ?? []).filter((e) => e.id !== entry.id) }));
  };

  const handleEntryMenuSelect = (key: string) => {
    if (!entryMenu) return;
    const { date, entry } = entryMenu;
    if (key === "edit") {
      setEditingDay(date);
    } else if (key === "delete") {
      const what = entry.kind === "shift" ? `the ${entry.start} - ${entry.end} shift` : "this entry";
      Alert.alert(DELETE_LABEL[entry.kind], `Are you sure you want to delete ${what} on ${formatDayHeader(date)}?`, [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => deleteEntry(date, entry) },
      ]);
    }
  };

  const handleSaveDay = (segments: ShiftSegment[]) => {
    if (!editingDay) return;
    const iso = toISO(editingDay);
    setSchedule((prev) => {
      const others = (prev[iso] ?? []).filter((e) => e.kind !== "shift");
      const shifts: ScheduleEntry[] = segments.map((s) => ({ id: makeId("shift"), kind: "shift", start: s.start, end: s.end }));
      return { ...prev, [iso]: [...shifts, ...others] };
    });
  };

  const handleSaveTimeOff = (req: TimeOffRequest) => {
    const start = parseMDY(req.startDate);
    const end = parseMDY(req.endDate) ?? start;
    if (!start || !end) return;
    setSchedule((prev) => addToRange(prev, start, end, { kind: "time_off", label: req.type, start: req.startTime, end: req.endTime }));
    setWeekStart(startOfWeek(start));
  };

  const handleSaveBlocked = (data: BlockedTimeData) => {
    const date = parseMDY(data.date);
    if (!date) return;
    setSchedule((prev) => addToRange(prev, date, date, { kind: "blocked", label: data.title, start: data.startTime, end: data.endTime }));
    setWeekStart(startOfWeek(date));
  };

  const handleSaveClosed = (data: ClosedPeriodData) => {
    const start = parseMDY(data.startDate);
    const end = parseMDY(data.endDate);
    if (!start || !end) return;
    setSchedule((prev) => addToRange(prev, start, end, { kind: "closed", label: data.reason }));
    setWeekStart(startOfWeek(start));
  };

  const editingSegments: ShiftSegment[] = editingDay
    ? (schedule[toISO(editingDay)] ?? [])
        .filter((e) => e.kind === "shift" && e.start && e.end)
        .map((e) => ({ id: e.id, start: e.start!, end: e.end! }))
    : [];

  return (
    <TabRootInset>
      <View style={styles.container}>
        <Header />

        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <TitleCard
            title="Scheduled Shifts"
            actions={
              <>
                <SoftButton label="Export Data" onPress={handleExport} style={figmaStyles.flex1} />
                <PrimaryButton
                  label="Add"
                  chevron
                  btnRef={addBtnRef}
                  onPress={() => measureAnchor(addBtnRef, setAddMenuAnchor)}
                  style={figmaStyles.flex1}
                />
              </>
            }
          />

          <WeeklyScheduleView
            weekStart={weekStart}
            schedule={schedule}
            onPrevWeek={() => setWeekStart((w) => addDays(w, -7))}
            onNextWeek={() => setWeekStart((w) => addDays(w, 7))}
            onEntryPress={(date, entry, node) => measureAnchor({ current: node }, (anchor) => setEntryMenu({ anchor, date, entry }))}
            onEmptyDayPress={(date) => setEditingDay(date)}
          />
        </ScrollView>

        <AnchoredMenu
          visible={!!addMenuAnchor}
          anchor={addMenuAnchor}
          options={ADD_OPTIONS}
          onClose={() => setAddMenuAnchor(null)}
          onSelect={handleAddSelect}
          width={200}
          align="right"
        />

        <AnchoredMenu
          visible={!!entryMenu}
          anchor={entryMenu?.anchor ?? null}
          options={
            entryMenu?.entry.kind === "shift"
              ? SHIFT_OPTIONS
              : [{ key: "delete", label: DELETE_LABEL[entryMenu?.entry.kind ?? "time_off"], icon: "trash-outline", iconColor: colors.pink }]
          }
          onClose={() => setEntryMenu(null)}
          onSelect={handleEntryMenuSelect}
          width={entryMenu?.entry.kind === "shift" ? 150 : 200}
        />

        <AddTimeOffModal
          visible={isTimeOffOpen}
          onClose={() => setIsTimeOffOpen(false)}
          onSave={handleSaveTimeOff}
          schedule={schedule}
        />
        <AddBlockedTimeModal visible={isBlockedOpen} onClose={() => setIsBlockedOpen(false)} onSave={handleSaveBlocked} />
        <AddClosedPeriodModal visible={isClosedOpen} onClose={() => setIsClosedOpen(false)} onSave={handleSaveClosed} />

        {editingDay && (
          <EditShiftModal
            key={toISO(editingDay)}
            visible
            onClose={() => setEditingDay(null)}
            dayLabel={formatDayHeader(editingDay)}
            initialSegments={editingSegments}
            onSave={handleSaveDay}
          />
        )}
      </View>
    </TabRootInset>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
});
