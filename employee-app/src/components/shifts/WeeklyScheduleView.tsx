import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, radius } from "@/constants/figmaTheme";
import TablePagination from "@/components/remuneration/TablePagination";
import { Card, figmaStyles } from "./figmaUi";
import { ScheduleEntry, ScheduleMap, addDays, formatDayHeader, formatWeekRange, toISO } from "./shiftsData";

interface WeeklyScheduleViewProps {
  weekStart: Date;
  schedule: ScheduleMap;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  /** Tap on a chip – the ref anchors the Edit Shift / Delete Shift menu. */
  onEntryPress: (date: Date, entry: ScheduleEntry, ref: View | null) => void;
  /** Tap on an empty cell of a day without entries – opens the Edit shift modal to add one. */
  onEmptyDayPress: (date: Date) => void;
}

const COL_WIDTH = 128;

const CHIP_COLORS: Record<ScheduleEntry["kind"], { bg: string; text: string }> = {
  shift: { bg: colors.primarySoft, text: colors.primary },
  time_off: { bg: colors.pinkSoft, text: colors.pink },
  blocked: { bg: colors.yellowSoft, text: colors.textSecondary },
  closed: { bg: colors.borderLight, text: colors.textMuted },
};

const chipText = (e: ScheduleEntry) => {
  const time = e.start && e.end ? `${e.start} - ${e.end}` : "";
  if (e.kind === "shift") return time;
  const label = e.label ?? (e.kind === "time_off" ? "Time Off" : e.kind === "blocked" ? "Blocked Time" : "Business Closed");
  return time ? `${label} ${time}` : label;
};

function ShiftChip({ entry, onPress }: { entry: ScheduleEntry; onPress: (ref: View | null) => void }) {
  const ref = useRef<View>(null);
  const c = CHIP_COLORS[entry.kind];
  return (
    <TouchableOpacity
      ref={ref}
      style={[styles.chip, { backgroundColor: c.bg }]}
      onPress={() => onPress(ref.current)}
      activeOpacity={0.8}
    >
      <Text style={[styles.chipText, { color: c.text }]} numberOfLines={1}>
        {chipText(entry)}
      </Text>
    </TouchableOpacity>
  );
}

/** Figma 1:42980 – week navigator + day-column table with shift chips + pagination. */
export default function WeeklyScheduleView({
  weekStart,
  schedule,
  onPrevWeek,
  onNextWeek,
  onEntryPress,
  onEmptyDayPress,
}: WeeklyScheduleViewProps) {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const columns = days.map((d) => schedule[toISO(d)] ?? []);
  const rowCount = Math.max(1, ...columns.map((c) => c.length));
  const pageCount = Math.max(1, Math.ceil(rowCount / perPage));
  const safePage = Math.min(page, pageCount);
  const rowIndexes = Array.from({ length: rowCount }, (_, i) => i).slice((safePage - 1) * perPage, safePage * perPage);

  const changeWeek = (fn: () => void) => {
    setPage(1);
    fn();
  };

  return (
    <Card style={styles.card}>
      {/* event nav */}
      <View style={styles.weekNav}>
        <TouchableOpacity style={styles.weekNavArrow} onPress={() => changeWeek(onPrevWeek)} accessibilityLabel="Previous week">
          <Ionicons name="chevron-back" size={18} color={colors.primary} />
        </TouchableOpacity>
        <View style={styles.weekNavLabel}>
          <Text style={styles.weekNavText}>{formatWeekRange(weekStart)}</Text>
        </View>
        <TouchableOpacity style={styles.weekNavArrow} onPress={() => changeWeek(onNextWeek)} accessibilityLabel="Next week">
          <Ionicons name="chevron-forward" size={18} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={figmaStyles.tableBox}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} bounces={false}>
          <View>
            <View style={[styles.row, figmaStyles.th]}>
              {days.map((d, i) => (
                <View key={toISO(d)} style={[styles.headCell, i > 0 && styles.cellDivider]}>
                  <Text style={figmaStyles.thText}>{formatDayHeader(d)}</Text>
                </View>
              ))}
            </View>
            {rowIndexes.map((r) => (
              <View key={r} style={[styles.row, styles.bodyRow, r % 2 === 1 && figmaStyles.rowAlt]}>
                {days.map((d, i) => {
                  const entry = columns[i][r];
                  const isEmptyDay = columns[i].length === 0;
                  return (
                    <View key={toISO(d)} style={[styles.cell, i > 0 && styles.cellDivider]}>
                      {entry ? (
                        <ShiftChip entry={entry} onPress={(ref) => onEntryPress(d, entry, ref)} />
                      ) : isEmptyDay && r === 0 ? (
                        <TouchableOpacity
                          style={styles.addCell}
                          onPress={() => onEmptyDayPress(d)}
                          activeOpacity={0.7}
                          accessibilityLabel={`Add shift on ${formatDayHeader(d)}`}
                        >
                          <Ionicons name="add" size={18} color={colors.textMuted} />
                        </TouchableOpacity>
                      ) : null}
                    </View>
                  );
                })}
              </View>
            ))}
          </View>
        </ScrollView>

        <View style={styles.footerDivider} />
        <TablePagination
          total={rowCount}
          page={safePage}
          perPage={perPage}
          onPageChange={setPage}
          onPerPageChange={(n) => {
            setPerPage(n);
            setPage(1);
          }}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    gap: 16,
  },
  weekNav: {
    flexDirection: "row",
    alignSelf: "flex-start",
    height: 44,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    overflow: "hidden",
  },
  weekNavArrow: {
    width: 46,
    alignItems: "center",
    justifyContent: "center",
  },
  weekNavLabel: {
    justifyContent: "center",
    paddingHorizontal: 16,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.border,
  },
  weekNavText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.primary,
  },
  row: {
    flexDirection: "row",
  },
  bodyRow: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  headCell: {
    width: COL_WIDTH,
    height: 64,
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  cell: {
    width: COL_WIDTH,
    height: 64,
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  cellDivider: {
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
  },
  chip: {
    alignSelf: "flex-start",
    maxWidth: COL_WIDTH - 24,
    height: 36,
    justifyContent: "center",
    paddingHorizontal: 12,
    borderRadius: radius.md,
  },
  chipText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 18,
  },
  addCell: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  footerDivider: {
    height: 1,
    backgroundColor: colors.border,
  },
});
