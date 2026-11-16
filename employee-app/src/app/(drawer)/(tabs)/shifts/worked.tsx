import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "@/components/Header";
import { colors, fonts, radius } from "@/constants/figmaTheme";
import AnchoredMenu, { MenuAnchor, measureAnchor } from "@/components/shifts/AnchoredMenu";
import RecordCard, { RecordList, recordCardStyles } from "@/components/ui/RecordCard";
import AddWorkedShiftModal from "@/components/shifts/AddWorkedShiftModal";
import DateRangeModal, { DateRange } from "@/components/shifts/DateRangeModal";
import {
  Card,
  FilterBox,
  FilterLabel,
  Pill,
  PrimaryButton,
  STAT_GRADIENTS,
  SoftButton,
  StatCard,
  TitleCard,
  figmaStyles,
} from "@/components/shifts/figmaUi";
import {
  INITIAL_WORKED_SHIFTS,
  MONTHS,
  WEEKDAYS,
  WORKED_YEARS,
  WorkedShift,
  formatDuration,
  formatShortDate,
  fromISO,
  makeId,
  toISO,
  toMinutes,
  workedMinutes,
} from "@/components/shifts/shiftsData";

interface DayRow {
  dateISO: string;
  shifts: WorkedShift[];
  timeIn: string;
  timeOut: string;
  minutes: number;
}

const formatHours = (mins: number) => {
  const h = mins / 60;
  return `${Number.isInteger(h) ? h : h.toFixed(1)}h`;
};

/** Figma 1:44865 (empty), 1:44493 (data), 1:44669 (Add Shift modal). */
export default function WorkedShiftsScreen() {
  const [shifts, setShifts] = useState<WorkedShift[]>(INITIAL_WORKED_SHIFTS);
  const [month, setMonth] = useState(11); // December
  const [year, setYear] = useState("2024");
  const [range, setRange] = useState<DateRange | null>(null);

  const monthRef = useRef<View>(null);
  const yearRef = useRef<View>(null);
  const [menu, setMenu] = useState<{ type: "month" | "year"; anchor: MenuAnchor } | null>(null);
  const [isRangeOpen, setIsRangeOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const filtered = shifts.filter((s) => {
    if (range) return s.dateISO >= toISO(range.from) && s.dateISO <= toISO(range.to);
    const d = fromISO(s.dateISO);
    return d.getMonth() === month && String(d.getFullYear()) === year;
  });

  // One card per day
  const byDay: Record<string, WorkedShift[]> = {};
  filtered.forEach((s) => (byDay[s.dateISO] = [...(byDay[s.dateISO] ?? []), s]));
  const rows: DayRow[] = Object.keys(byDay)
    .sort()
    .map((iso) => {
      const list = [...byDay[iso]].sort((a, b) => toMinutes(a.timeIn) - toMinutes(b.timeIn));
      return {
        dateISO: iso,
        shifts: list,
        timeIn: list[0].timeIn,
        timeOut: list.reduce((max, s) => (toMinutes(s.timeOut) > toMinutes(max) ? s.timeOut : max), list[0].timeOut),
        minutes: list.reduce((sum, s) => sum + workedMinutes(s), 0),
      };
    });

  const daysWorked = rows.length;
  const totalMinutes = rows.reduce((sum, r) => sum + r.minutes, 0);
  const periodLabel = range ? `${formatShortDate(range.from)} – ${formatShortDate(range.to)}` : `${MONTHS[month]} ${year}`;

  const handleExport = () => {
    Alert.alert("Export Data", `Your worked shifts for ${periodLabel} are being exported.`);
  };

  const handleAdd = (data: Omit<WorkedShift, "id">) => {
    setShifts((prev) => [...prev, { ...data, id: makeId("w") }]);
    const d = fromISO(data.dateISO);
    setRange(null);
    setMonth(d.getMonth());
    setYear(String(d.getFullYear()));
  };

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <TitleCard
          title="Worked Shifts"
          actions={
            <>
              <SoftButton label="Export Data" onPress={handleExport} style={figmaStyles.flex1} />
              <PrimaryButton label="Add" chevron onPress={() => setIsAddOpen(true)} style={figmaStyles.flex1} />
            </>
          }
        >
          <View style={styles.filtersRow}>
            <View>
              <FilterLabel label="Period" />
              <View style={styles.periodGroup}>
                <FilterBox
                  boxRef={monthRef}
                  label={MONTHS[month]}
                  style={styles.monthBox}
                  onPress={() => measureAnchor(monthRef, (anchor) => setMenu({ type: "month", anchor }))}
                />
                <FilterBox
                  boxRef={yearRef}
                  label={year}
                  onPress={() => measureAnchor(yearRef, (anchor) => setMenu({ type: "year", anchor }))}
                />
              </View>
            </View>
            <View>
              <FilterLabel label="Custom Range" />
              <FilterBox
                label={range ? `${formatShortDate(range.from).slice(0, 6)} – ${formatShortDate(range.to).slice(0, 6)}` : "Select dates"}
                icon="calendar-clear-outline"
                active={!!range}
                style={styles.rangeBox}
                onPress={() => setIsRangeOpen(true)}
              />
            </View>
          </View>
        </TitleCard>

        {rows.length > 0 && (
          <View style={styles.statsGrid}>
            <StatCard
              label="Total Hours"
              value={formatHours(totalMinutes)}
              icon="time-outline"
              color={colors.primary}
              gradient={STAT_GRADIENTS.primary}
            />
            <View style={styles.statsRow}>
              <StatCard
                label="Days Worked"
                value={String(daysWorked)}
                icon="calendar-clear-outline"
                color={colors.teal}
                gradient={STAT_GRADIENTS.teal}
                style={figmaStyles.flex1}
              />
              <StatCard
                label="Avg Hour/Day"
                value={daysWorked ? `${(totalMinutes / 60 / daysWorked).toFixed(1)}h` : "0h"}
                icon="analytics-outline"
                color={colors.green}
                gradient={STAT_GRADIENTS.green}
                style={figmaStyles.flex1}
              />
            </View>
          </View>
        )}

        <Card style={styles.listCard}>
          <Text style={styles.sectionTitle}>Daily Shifts - {periodLabel}</Text>

          {rows.length === 0 ? (
            <View style={styles.emptyBox}>
              <Ionicons name="calendar-clear-outline" size={52} color={colors.textSecondary} />
              <Text style={styles.emptyText}>No shifts recorded</Text>
            </View>
          ) : (
            <>
              <RecordList>
                {rows.map((r) => {
                  const d = fromISO(r.dateISO);
                  return (
                    <RecordCard
                      key={r.dateISO}
                      title={formatShortDate(d)}
                      subtitle={WEEKDAYS[d.getDay()]}
                      trailing={<Text style={figmaStyles.tdStrong}>{formatDuration(r.minutes)}</Text>}
                      fields={[
                        {
                          label: "Shifts",
                          value: (
                            <View style={styles.shiftsCell}>
                              <View style={styles.dot} />
                              <Text style={recordCardStyles.value}>{r.shifts.length}</Text>
                            </View>
                          ),
                        },
                        { label: "Time In", value: r.timeIn },
                        { label: "Time Out", value: r.timeOut },
                        { label: "Hours Worked", value: r.shifts.map((s) => formatDuration(workedMinutes(s))).join(" + ") },
                      ]}
                    />
                  );
                })}
              </RecordList>

              <View style={styles.summaryBar}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Total Days Worked</Text>
                  <Pill solid label={`${daysWorked} Days`} />
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Total Shifts</Text>
                  <Pill solid label={String(filtered.length)} />
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>{range ? "Period Total" : "Monthly Total"}</Text>
                  <Pill solid label={formatHours(totalMinutes)} />
                </View>
              </View>
            </>
          )}
        </Card>
      </ScrollView>

      <AnchoredMenu
        visible={!!menu}
        anchor={menu?.anchor ?? null}
        options={
          menu?.type === "year"
            ? WORKED_YEARS.map((y) => ({ key: y, label: y, selected: y === year }))
            : MONTHS.map((m, i) => ({ key: String(i), label: m, selected: i === month }))
        }
        onClose={() => setMenu(null)}
        onSelect={(key) => {
          if (menu?.type === "year") setYear(key);
          else setMonth(parseInt(key, 10));
          setRange(null);
        }}
      />

      <DateRangeModal visible={isRangeOpen} onClose={() => setIsRangeOpen(false)} title="Custom Range" onApply={setRange} />
      <AddWorkedShiftModal visible={isAddOpen} onClose={() => setIsAddOpen(false)} onSave={handleAdd} />
    </View>
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
  filtersRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: 16,
    rowGap: 12,
  },
  periodGroup: {
    flexDirection: "row",
    gap: 8,
  },
  monthBox: {
    width: 150,
  },
  rangeBox: {
    width: 150,
  },
  statsGrid: {
    gap: 16,
  },
  statsRow: {
    flexDirection: "row",
    gap: 16,
  },
  listCard: {
    padding: 16,
    gap: 16,
  },
  sectionTitle: {
    fontFamily: fonts.semibold,
    fontSize: 18,
    lineHeight: 25,
    color: colors.text,
  },
  emptyBox: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
    gap: 16,
  },
  emptyText: {
    fontFamily: fonts.medium,
    fontSize: 16,
    lineHeight: 22,
    color: colors.text,
  },
  shiftsCell: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  summaryBar: {
    backgroundColor: colors.subtle,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  summaryItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  summaryLabel: {
    fontFamily: fonts.medium,
    fontSize: 16,
    lineHeight: 22,
    color: colors.text,
  },
});
