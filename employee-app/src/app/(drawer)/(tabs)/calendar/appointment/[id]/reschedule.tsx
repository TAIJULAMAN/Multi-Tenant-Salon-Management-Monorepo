import React, { useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, fonts, radius, shadows, typography } from "@/constants/figmaTheme";
import AppointmentHeader from "@/components/appointment/AppointmentHeader";
import { DropdownMenu } from "@/components/appointment/PopoverMenu";
import { SquareAvatar } from "@/components/appointment/ServiceCard";
import { queueToast } from "@/components/appointment/StatusToast";
import {
  AppointmentService,
  STAFF,
  WEEK_DAYS,
  addActivity,
  formatDate,
  fromMinutes,
  listAppointments,
  parseISO,
  toISO,
  toMinutes,
  updateAppointment,
  useAppointment,
} from "@/components/appointment/appointmentData";

type View3 = "Month" | "Week" | "Day";
interface Placement {
  date: string;
  employeeId: string;
  start: number; // minutes
}

const SLOT = 15;
const ROW_H = 40;
const COL_W = 150;
const TIME_W = 72;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const FULL_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const ROWS = Array.from({ length: (24 * 60) / SLOT }, (_, i) => i * SLOT);

const addDays = (iso: string, n: number) => {
  const d = parseISO(iso);
  d.setDate(d.getDate() + n);
  return toISO(d);
};
const startOfWeek = (iso: string) => addDays(iso, -parseISO(iso).getDay());
const hourLabel = (mins: number) => {
  const h = Math.floor(mins / 60);
  return `${h % 12 === 0 ? 12 : h % 12}:00 ${h < 12 ? "AM" : "PM"}`;
};
const dayLabel = (iso: string) => {
  const d = parseISO(iso);
  return `${FULL_WEEK[d.getDay()]} ${MONTHS[d.getMonth()]} ${String(d.getDate()).padStart(2, "0")}`;
};

/**
 * Figma 1:31483 – Reschedule Appointment: team calendar with an "Available Services" panel.
 * Desktop drag & drop becomes: tap a service in the panel, then tap a free slot in the grid.
 */
export default function RescheduleScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const appt = useAppointment(id);

  const initialPlacements = useMemo(
    () =>
      Object.fromEntries(
        appt.services.map((s) => [s.id, { date: appt.date, employeeId: s.employeeId, start: toMinutes(s.startTime) }])
      ) as Record<string, Placement>,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const [placements, setPlacements] = useState<Record<string, Placement>>(initialPlacements);
  const [selected, setSelected] = useState<string | null>(appt.services[0]?.id ?? null);
  const [day, setDay] = useState(appt.date);
  const [mode, setMode] = useState<View3>("Day");
  const [team, setTeam] = useState<string>("all");
  const [isFull, setIsFull] = useState(false);
  const gridScroll = useRef<ScrollView>(null);

  const columns = team === "all" ? STAFF : STAFF.filter((s) => s.id === team);
  const weekEmployee = team === "all" ? appt.services[0]?.employeeId ?? STAFF[0].id : team;
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(day), i));

  // Other bookings, per employee & day, that a service cannot overlap.
  const busy = useMemo(() => {
    const list: { date: string; employeeId: string; from: number; to: number; label: string }[] = [];
    listAppointments()
      .filter((a) => a.id !== appt.id && a.status !== "Cancelled")
      .forEach((a) =>
        a.services.forEach((s) =>
          list.push({
            date: a.date,
            employeeId: s.employeeId,
            from: toMinutes(s.startTime),
            to: toMinutes(s.startTime) + s.duration,
            label: a.client.name,
          })
        )
      );
    return list;
  }, [appt.id]);

  const serviceById = (sid: string) => appt.services.find((s) => s.id === sid)!;
  const conflicts = (sid: string, p: Placement) => {
    const dur = serviceById(sid).duration;
    const overlap = (from: number, to: number) => p.start < to && p.start + dur > from;
    if (p.start + dur > 24 * 60) return true;
    if (busy.some((b) => b.date === p.date && b.employeeId === p.employeeId && overlap(b.from, b.to))) return true;
    return Object.entries(placements).some(
      ([other, q]) =>
        other !== sid && q.date === p.date && q.employeeId === p.employeeId && overlap(q.start, q.start + serviceById(other).duration)
    );
  };

  const place = (date: string, employeeId: string, start: number) => {
    if (!selected) return;
    const p = { date, employeeId, start };
    if (conflicts(selected, p)) return;
    setPlacements((prev) => ({ ...prev, [selected]: p }));
  };

  const dates = Object.values(placements).map((p) => p.date);
  const sameDay = dates.every((d) => d === dates[0]);
  const isUnchanged = JSON.stringify(placements) === JSON.stringify(initialPlacements);
  const canSave = sameDay && !isUnchanged;

  const save = () => {
    const date = dates[0];
    updateAppointment(appt.id, (a) => {
      const services: AppointmentService[] = a.services.map((s) => ({
        ...s,
        employeeId: placements[s.id].employeeId,
        startTime: fromMinutes(placements[s.id].start),
      }));
      const starts = services.map((s) => toMinutes(s.startTime));
      const ends = services.map((s) => toMinutes(s.startTime) + s.duration);
      return {
        ...a,
        date,
        services,
        startTime: fromMinutes(Math.min(...starts)),
        endTime: fromMinutes(Math.max(...ends)),
        activity: addActivity(a, "Appointment Rescheduled"),
      };
    });
    const first = Math.min(...Object.values(placements).map((p) => p.start));
    queueToast({ type: "success", title: "Appointment rescheduled", message: `${formatDate(date)} at ${fromMinutes(first)}` });
    router.back();
  };

  const shift = (dir: 1 | -1) => {
    if (mode === "Day") setDay((d) => addDays(d, dir));
    else if (mode === "Week") setDay((d) => addDays(d, 7 * dir));
    else {
      const d = parseISO(day);
      d.setMonth(d.getMonth() + dir, 1);
      setDay(toISO(d));
    }
  };

  const navLabel =
    mode === "Day"
      ? dayLabel(day)
      : mode === "Week"
        ? `${MONTHS[parseISO(weekDays[0]).getMonth()]} ${parseISO(weekDays[0]).getDate()} - ${MONTHS[parseISO(weekDays[6]).getMonth()]} ${parseISO(weekDays[6]).getDate()}`
        : `${MONTHS[parseISO(day).getMonth()]} ${parseISO(day).getFullYear()}`;

  // ---- grid rendering --------------------------------------------------------
  const renderColumn = (key: string, date: string, employeeId: string) => {
    const mine = Object.entries(placements).filter(([, p]) => p.date === date && p.employeeId === employeeId);
    const others = busy.filter((b) => b.date === date && b.employeeId === employeeId);
    return (
      <View key={key} style={styles.column}>
        {ROWS.map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.cell, t % 60 === 45 && styles.cellHourEnd]}
            onPress={() => place(date, employeeId, t)}
            activeOpacity={0.6}
          />
        ))}
        {others.map((b, i) => (
          <View
            key={`b${i}`}
            pointerEvents="none"
            style={[styles.block, styles.busyBlock, { top: (b.from / SLOT) * ROW_H, height: ((b.to - b.from) / SLOT) * ROW_H - 2 }]}
          >
            <Text style={styles.busyText} numberOfLines={1}>
              {b.label}
            </Text>
          </View>
        ))}
        {mine.map(([sid, p]) => {
          const s = serviceById(sid);
          return (
            <TouchableOpacity
              key={sid}
              activeOpacity={0.8}
              onPress={() => setSelected(sid)}
              style={[
                styles.block,
                styles.serviceBlock,
                selected === sid && styles.serviceBlockActive,
                { top: (p.start / SLOT) * ROW_H, height: Math.max(ROW_H, (s.duration / SLOT) * ROW_H) - 2 },
              ]}
            >
              <Text style={styles.chipName} numberOfLines={1}>
                {s.name}
              </Text>
              <Text style={styles.chipSub} numberOfLines={1}>
                {fromMinutes(p.start)} · {s.duration} min
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const headerCols =
    mode === "Day"
      ? columns.map((s) => ({ key: s.id, date: day, employeeId: s.id, title: s.name, avatar: s.avatar as string | undefined }))
      : weekDays.map((d) => ({
          key: d,
          date: d,
          employeeId: weekEmployee,
          title: `${WEEK_DAYS[parseISO(d).getDay()]} ${parseISO(d).getDate()}`,
          avatar: undefined,
        }));

  const firstStart = Math.min(...Object.values(placements).map((p) => p.start));

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 16) }]}>
      <AppointmentHeader
        title="Reschedule Appointment"
        right={
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => router.push("/(drawer)/(tabs)/calendar/add" as any)}
            activeOpacity={0.85}
            accessibilityLabel="Add Appointment"
          >
            <Ionicons name="add" size={18} color={colors.white} />
            <Text style={styles.addBtnText}>Add Appointment</Text>
          </TouchableOpacity>
        }
      />

      <View style={styles.card}>
        {/* Toolbar */}
        <View style={styles.toolbar}>
          <DropdownMenu
            items={[
              { label: "All Team", selected: team === "all", onPress: () => setTeam("all") },
              ...STAFF.map((s) => ({ label: s.name, selected: team === s.id, onPress: () => setTeam(s.id) })),
            ]}
            renderTrigger={(open) => (
              <TouchableOpacity style={styles.teamBtn} onPress={open} activeOpacity={0.7}>
                <View style={styles.teamIcon}>
                  <Ionicons name="people-outline" size={14} color={colors.primary} />
                </View>
                <Text style={styles.teamText} numberOfLines={1}>
                  {team === "all" ? "All Team" : STAFF.find((s) => s.id === team)?.name}
                </Text>
                <Ionicons name="chevron-down" size={16} color={colors.text} />
              </TouchableOpacity>
            )}
          />
          <View style={styles.segment}>
            {(["Month", "Week", "Day"] as View3[]).map((m) => (
              <TouchableOpacity
                key={m}
                style={[styles.segmentBtn, mode === m && styles.segmentBtnActive]}
                onPress={() => setMode(m)}
                activeOpacity={0.7}
              >
                <Text style={[styles.segmentText, mode === m && { color: colors.text }]}>{m}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            style={styles.fullBtn}
            onPress={() => setIsFull((v) => !v)}
            accessibilityLabel={isFull ? "Exit full screen" : "Full screen"}
          >
            <Ionicons name={isFull ? "contract-outline" : "scan-outline"} size={20} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.dateNav}>
          <TouchableOpacity style={styles.navBtn} onPress={() => shift(-1)} accessibilityLabel="Previous">
            <Ionicons name="chevron-back" size={18} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.navText}>{navLabel}</Text>
          <TouchableOpacity style={styles.navBtn} onPress={() => shift(1)} accessibilityLabel="Next">
            <Ionicons name="chevron-forward" size={18} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Available Services */}
        {!isFull && (
          <View style={styles.servicesPanel}>
            <Text style={styles.panelTitle}>Available Services</Text>
            <Text style={styles.panelSub}>Tap a service, then a free slot to schedule appointments</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingTop: 12 }}>
              {appt.services.map((s) => (
                <TouchableOpacity
                  key={s.id}
                  style={[styles.chip, selected === s.id && styles.chipActive]}
                  onPress={() => setSelected(s.id)}
                  activeOpacity={0.8}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.chipName}>{s.name}</Text>
                    <Text style={styles.chipSub}>{s.duration} min</Text>
                  </View>
                  <TouchableOpacity
                    hitSlop={8}
                    onPress={() => setPlacements((prev) => ({ ...prev, [s.id]: initialPlacements[s.id] }))}
                    accessibilityLabel={`Reset ${s.name}`}
                  >
                    <Ionicons name="close" size={14} color={colors.primary} />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Calendar */}
        {mode === "Month" ? (
          <MonthGrid
            day={day}
            marked={dates}
            onPick={(iso) => {
              setDay(iso);
              setMode("Day");
            }}
          />
        ) : (
          <View style={styles.gridFrame}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View>
                <View style={styles.gridHeader}>
                  <View style={{ width: TIME_W }} />
                  {headerCols.map((c) => (
                    <View key={c.key} style={styles.headCell}>
                      {c.avatar ? <SquareAvatar uri={c.avatar} size={40} /> : null}
                      <Text style={styles.headText} numberOfLines={1}>
                        {c.title}
                      </Text>
                    </View>
                  ))}
                </View>
                <ScrollView
                  ref={gridScroll}
                  nestedScrollEnabled
                  showsVerticalScrollIndicator
                  contentOffset={{ x: 0, y: Math.max(0, (firstStart / SLOT - 2) * ROW_H) }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <View style={{ width: TIME_W }}>
                      {ROWS.map((t) => (
                        <View key={t} style={[styles.timeCell, t % 60 === 45 && styles.cellHourEnd]}>
                          {t % 60 === 0 ? <Text style={styles.timeText}>{hourLabel(t)}</Text> : null}
                        </View>
                      ))}
                    </View>
                    {headerCols.map((c) => renderColumn(c.key, c.date, c.employeeId))}
                  </View>
                </ScrollView>
              </View>
            </ScrollView>
          </View>
        )}

        {!sameDay && <Text style={styles.warning}>All services must be on the same day.</Text>}

        <View style={[styles.saveRow, { paddingBottom: Math.max(insets.bottom - 8, 0) }]}>
          <TouchableOpacity
            style={[styles.saveBtn, !canSave && styles.saveBtnDisabled]}
            disabled={!canSave}
            onPress={save}
            activeOpacity={0.85}
          >
            <Text style={[styles.saveBtnText, !canSave && { color: colors.textMuted }]}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function MonthGrid({ day, marked, onPick }: { day: string; marked: string[]; onPick: (iso: string) => void }) {
  const d = parseISO(day);
  const first = new Date(d.getFullYear(), d.getMonth(), 1);
  const daysInMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  const cells: (string | null)[] = [
    ...Array.from({ length: first.getDay() }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => toISO(new Date(d.getFullYear(), d.getMonth(), i + 1))),
  ];
  while (cells.length % 7) cells.push(null);
  return (
    <View style={[styles.gridFrame, { padding: 8 }]}>
      <View style={styles.monthRow}>
        {WEEK_DAYS.map((w) => (
          <Text key={w} style={styles.monthHead}>
            {w}
          </Text>
        ))}
      </View>
      <View style={styles.monthWrap}>
        {cells.map((iso, i) => (
          <TouchableOpacity
            key={iso ?? `e${i}`}
            disabled={!iso}
            style={[styles.monthCell, iso === day && styles.monthCellActive]}
            onPress={() => iso && onPick(iso)}
          >
            {iso ? (
              <>
                <Text style={[styles.monthNum, iso === day && { color: colors.primary }]}>{parseISO(iso).getDate()}</Text>
                {marked.includes(iso) && <View style={styles.monthDot} />}
              </>
            ) : null}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    height: 40,
    paddingHorizontal: 12,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
  },
  addBtnText: {
    ...typography.button,
    fontSize: 13,
    color: colors.white,
  },
  card: {
    flex: 1,
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: colors.card,
    borderRadius: radius.card,
    padding: 16,
    gap: 12,
    ...shadows.card,
  },
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  teamBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    height: 44,
    maxWidth: 150,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
  },
  teamIcon: {
    width: 24,
    height: 24,
    borderRadius: radius.sm,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  teamText: {
    flexShrink: 1,
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.text,
  },
  segment: {
    flex: 1,
    flexDirection: "row",
    height: 44,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    overflow: "hidden",
  },
  segmentBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  segmentBtnActive: {
    backgroundColor: colors.primarySoft,
  },
  segmentText: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
  },
  fullBtn: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.borderLight,
    alignItems: "center",
    justifyContent: "center",
  },
  dateNav: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    height: 44,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
  },
  navBtn: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  navText: {
    minWidth: 150,
    textAlign: "center",
    paddingHorizontal: 12,
    fontSize: 14,
    lineHeight: 42,
    fontFamily: fonts.regular,
    color: colors.primary,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.border,
  },
  servicesPanel: {
    backgroundColor: colors.primaryTint,
    borderRadius: radius.card,
    padding: 12,
  },
  panelTitle: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: fonts.medium,
    color: colors.text,
  },
  panelSub: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
  chip: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    minWidth: 150,
    paddingVertical: 6,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  chipActive: {
    borderWidth: 1,
    borderLeftWidth: 3,
    borderColor: colors.primary,
  },
  chipName: {
    fontSize: 14,
    lineHeight: 19,
    fontFamily: fonts.regular,
    color: colors.primary,
  },
  chipSub: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.regular,
    color: colors.primary,
  },
  gridFrame: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    overflow: "hidden",
  },
  gridHeader: {
    flexDirection: "row",
    backgroundColor: colors.primaryTint,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headCell: {
    width: COL_W,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
  },
  headText: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.text,
  },
  timeCell: {
    height: ROW_H,
    alignItems: "flex-end",
    paddingRight: 6,
    paddingTop: 4,
  },
  timeText: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
  column: {
    width: COL_W,
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
  },
  cell: {
    height: ROW_H,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  cellHourEnd: {
    borderBottomColor: "#C9D3DB",
  },
  block: {
    position: "absolute",
    left: 3,
    right: 3,
    borderRadius: radius.md,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  busyBlock: {
    backgroundColor: colors.subtleAlt,
  },
  busyText: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
  serviceBlock: {
    backgroundColor: colors.primarySoft,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  serviceBlockActive: {
    borderWidth: 1,
    borderLeftWidth: 3,
    borderColor: colors.primary,
  },
  warning: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.pink,
  },
  saveRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  saveBtn: {
    height: 36,
    paddingHorizontal: 16,
    justifyContent: "center",
    borderRadius: radius.md,
    backgroundColor: colors.primary,
  },
  saveBtnDisabled: {
    backgroundColor: colors.subtleAlt,
  },
  saveBtnText: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.white,
  },
  monthRow: {
    flexDirection: "row",
  },
  monthHead: {
    flex: 1,
    textAlign: "center",
    paddingVertical: 8,
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.textMuted,
  },
  monthWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  monthCell: {
    width: `${100 / 7}%`,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.md,
  },
  monthCellActive: {
    backgroundColor: colors.primarySoft,
  },
  monthNum: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.text,
  },
  monthDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginTop: 4,
  },
});
