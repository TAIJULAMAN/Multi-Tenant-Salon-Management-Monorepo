import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Header from "@/components/Header";
import CalendarSubHeader from "@/components/calendar/CalendarSubHeader";
import CalendarToolbar from "@/components/calendar/CalendarToolbar";
import CalendarOptionsMenu from "@/components/calendar/CalendarOptionsMenu";
import TeamFilterSheet from "@/components/calendar/TeamFilterSheet";
import SearchMemberModal from "@/components/calendar/SearchMemberModal";
import DeleteAppointmentModal from "@/components/calendar/DeleteAppointmentModal";
import RecordCard, { RecordList } from "@/components/ui/RecordCard";
import { Anchor, Pagination, PopoverMenu, SquareAvatar, StatusBadge, ui } from "@/components/calendar/ui";
import { AppStatus, CalAppointment, CalendarViewMode } from "@/components/calendar/types";
import {
  APPOINTMENT_STATUSES,
  CURRENT_EMPLOYEE_ID,
  addDays,
  addMonths,
  appointmentRoute,
  bookingStepTheme,
  deleteAppointmentFromStore,
  formatDayLabel,
  formatMonthLabel,
  formatScheduledDate,
  formatWeekLabel,
  staffList,
  startOfWeek,
  timeToMinutes,
  toISODate,
  todayISO,
  useAppointmentsStore,
} from "@/components/calendar/data";
import { colors, fonts, radius } from "@/constants/figmaTheme";

type StatusFilter = "All" | AppStatus;
const STATUS_FILTERS: StatusFilter[] = ["All", ...APPOINTMENT_STATUSES];

/** Appointments Table View — Figma "Team Members" frames 1:22124 (row menu), 1:22817 (Booking Order), 1:22453 (Search a Member). */
export default function AppointmentsListScreen() {
  const [appointments] = useAppointmentsStore();

  const [menuAnchor, setMenuAnchor] = useState<Anchor | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [search, setSearch] = useState("");
  const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>(staffList.map((s) => s.id));
  const [teamAnchor, setTeamAnchor] = useState<Anchor | null>(null);
  const [memberSearchOpen, setMemberSearchOpen] = useState(false);
  const [period, setPeriod] = useState<CalendarViewMode>("day");
  const [anchorDate, setAnchorDate] = useState(new Date());
  const [expanded, setExpanded] = useState<string[]>([]);
  const [pageSize, setPageSize] = useState(5);
  const [page, setPage] = useState(0);
  const [rowMenu, setRowMenu] = useState<{ appt: CalAppointment; anchor: Anchor } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CalAppointment | null>(null);

  const inPeriod = (iso: string) => {
    if (period === "day") return iso === toISODate(anchorDate);
    if (period === "week") {
      const s = startOfWeek(anchorDate);
      return iso >= toISODate(s) && iso <= toISODate(addDays(s, 6));
    }
    return iso.startsWith(toISODate(anchorDate).slice(0, 7));
  };

  const q = search.trim().toLowerCase();
  const filtered = appointments
    .filter((a) => selectedStaffIds.includes(a.staffId) && inPeriod(a.date))
    .filter((a) => statusFilter === "All" || a.status === statusFilter)
    .filter(
      (a) =>
        !q ||
        a.clientName.toLowerCase().includes(q) ||
        a.service.toLowerCase().includes(q) ||
        a.code.toLowerCase().includes(q) ||
        (a.clientPhone ?? "").replace(/\s/g, "").includes(q.replace(/\s/g, ""))
    )
    .sort((a, b) => (a.date === b.date ? timeToMinutes(a.startTime) - timeToMinutes(b.startTime) : a.date < b.date ? -1 : 1));

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pageCount - 1);
  const pageItems = filtered.slice(safePage * pageSize, safePage * pageSize + pageSize);

  const dateLabel =
    period === "day" ? formatDayLabel(anchorDate) : period === "week" ? formatWeekLabel(anchorDate) : formatMonthLabel(anchorDate);

  const shift = (dir: 1 | -1) => {
    setPage(0);
    if (period === "day") setAnchorDate((d) => addDays(d, dir));
    else if (period === "week") setAnchorDate((d) => addDays(d, 7 * dir));
    else setAnchorDate((d) => addMonths(d, dir));
  };

  const toggleExpand = (id: string) =>
    setExpanded((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <View style={styles.container}>
      <Header />
      <CalendarSubHeader
        active="list"
        onOpenMenu={setMenuAnchor}
        onAddAppointment={() =>
          router.push({
            pathname: "/(drawer)/(tabs)/calendar/add" as any,
            params: { staffId: CURRENT_EMPLOYEE_ID, date: todayISO(), startTime: "09:00" },
          })
        }
      >
        <View>
          <Text style={styles.filterLabel}>Status</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statusRow}>
            {STATUS_FILTERS.map((s) => {
              const active = statusFilter === s;
              return (
                <TouchableOpacity
                  key={s}
                  style={[styles.statusChip, active && styles.statusChipActive]}
                  onPress={() => {
                    setStatusFilter(s);
                    setPage(0);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.statusChipText, active && styles.statusChipTextActive]}>{s}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
        <View style={ui.searchBox}>
          <Ionicons name="search-outline" size={18} color={colors.text} />
          <TextInput
            style={ui.searchInput}
            placeholder="Search"
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={(t) => {
              setSearch(t);
              setPage(0);
            }}
          />
        </View>
      </CalendarSubHeader>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={ui.card}>
          <CalendarToolbar
            selectedStaffIds={selectedStaffIds}
            onOpenTeamFilter={setTeamAnchor}
            onOpenSearch={() => setMemberSearchOpen(true)}
            dateLabel={dateLabel}
            onPrev={() => shift(-1)}
            onNext={() => shift(1)}
            viewMode={period}
            onChangeViewMode={(m) => {
              setPeriod(m);
              setPage(0);
            }}
          />

          {/* One card per appointment (replaces the wide horizontally scrolling table). */}
          <RecordList style={styles.list}>
            {pageItems.map((a) => {
              const open = expanded.includes(a.id);
              return (
                <RecordCard
                  key={a.id}
                  onPress={() => toggleExpand(a.id)}
                  leading={<SquareAvatar uri={a.clientAvatar} name={a.clientName} size={44} rounded={10} bg={colors.pinkSoft} />}
                  title={a.clientName}
                  subtitle={
                    <Text style={styles.subtitle} numberOfLines={1}>
                      <Text style={styles.idText}>{a.code}</Text>
                      {a.clientPhone ? ` · ${a.clientPhone}` : ""}
                    </Text>
                  }
                  trailing={<StatusBadge status={a.status} />}
                  fields={[
                    { label: "Service", value: a.service },
                    { label: "Price", value: a.price },
                    { label: "Scheduled Date", value: formatScheduledDate(a), full: true },
                  ]}
                  footer={
                    <View style={styles.actions}>
                      <RowKebab onOpen={(anchor) => setRowMenu({ appt: a, anchor })} />
                      <TouchableOpacity hitSlop={8} onPress={() => toggleExpand(a.id)}>
                        <Ionicons name={open ? "chevron-up" : "chevron-down"} size={20} color={colors.primary} />
                      </TouchableOpacity>
                    </View>
                  }
                >
                  {open && <BookingOrder appt={a} />}
                </RecordCard>
              );
            })}

            {pageItems.length === 0 && (
              <View style={styles.empty}>
                <Ionicons name="calendar-clear-outline" size={26} color={colors.textMuted} />
                <Text style={styles.emptyText}>No appointments for this period.</Text>
              </View>
            )}
          </RecordList>

          <Pagination
            page={safePage}
            pageSize={pageSize}
            total={filtered.length}
            onPage={setPage}
            onPageSize={setPageSize}
          />
        </View>
      </ScrollView>

      <PopoverMenu
        anchor={rowMenu?.anchor ?? null}
        onClose={() => setRowMenu(null)}
        width={170}
        items={[
          {
            key: "view",
            label: "View Details",
            icon: "eye",
            iconColor: colors.primary,
            onPress: () => rowMenu && router.push(appointmentRoute(rowMenu.appt.id) as any),
          },
          {
            key: "edit",
            label: "Edit",
            icon: "pencil-outline",
            iconColor: colors.teal,
            onPress: () =>
              rowMenu &&
              router.push({ pathname: "/(drawer)/(tabs)/calendar/add" as any, params: { editId: rowMenu.appt.id } }),
          },
          {
            key: "delete",
            label: "Delete",
            icon: "trash-outline",
            iconColor: colors.pink,
            onPress: () => rowMenu && setDeleteTarget(rowMenu.appt),
          },
        ]}
      />

      <CalendarOptionsMenu visible={!!menuAnchor} anchor={menuAnchor} onClose={() => setMenuAnchor(null)} />
      <TeamFilterSheet
        visible={!!teamAnchor}
        anchor={teamAnchor}
        onClose={() => setTeamAnchor(null)}
        selectedIds={selectedStaffIds}
        onChange={(ids) => {
          setSelectedStaffIds(ids);
          setPage(0);
        }}
      />
      <SearchMemberModal
        visible={memberSearchOpen}
        onClose={() => setMemberSearchOpen(false)}
        onSelect={(m) => {
          setSelectedStaffIds([m.id]);
          setPage(0);
        }}
      />
      <DeleteAppointmentModal
        visible={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        appointmentTitle={deleteTarget ? `${deleteTarget.service} · ${deleteTarget.clientName}` : undefined}
        onConfirm={() => {
          if (deleteTarget) deleteAppointmentFromStore(deleteTarget.id);
          setDeleteTarget(null);
        }}
      />
    </View>
  );
}

function RowKebab({ onOpen }: { onOpen: (a: Anchor) => void }) {
  const ref = useRef<View>(null);
  return (
    <View ref={ref} collapsable={false}>
      <TouchableOpacity
        hitSlop={8}
        onPress={() => ref.current?.measureInWindow((x, y, width, height) => onOpen({ x, y, width, height }))}
      >
        <Ionicons name="ellipsis-vertical" size={20} color={colors.text} />
      </TouchableOpacity>
    </View>
  );
}

/** Expanded card: "Booking Order" stepper + "Print Receipt" for started / completed appointments (1:22817). */
function BookingOrder({ appt }: { appt: CalAppointment }) {
  const steps = appt.bookingOrder ?? [];
  const showReceipt = appt.status === "Started" || appt.status === "Completed";
  return (
    <View style={styles.booking}>
      <Text style={styles.bookingTitle}>Booking Order</Text>
      <View style={styles.stepsRow}>
        {steps.map((st, i) => {
          const t = bookingStepTheme[st.status];
          return (
            <View key={st.id} style={styles.step}>
              <View style={styles.stepTop}>
                <View style={[styles.connector, i === 0 && { backgroundColor: "transparent" }]} />
                <View style={[styles.circle, { backgroundColor: t.circle }]}>
                  {st.status === "Completed" ? (
                    <Ionicons name="checkmark" size={16} color={t.circleText} />
                  ) : st.status === "Cancelled" ? (
                    <Ionicons name="close" size={16} color={t.circleText} />
                  ) : (
                    <Text style={[styles.circleText, { color: t.circleText }]}>{st.order}</Text>
                  )}
                </View>
                <View style={[styles.connector, i === steps.length - 1 && { backgroundColor: "transparent" }]} />
              </View>
              <View style={[styles.stepBadge, { backgroundColor: t.bg }]}>
                <Text style={[styles.stepBadgeText, { color: t.text }]}>{st.status}</Text>
              </View>
              <Text style={styles.stepTime}>{st.time}</Text>
              <Text style={styles.stepService} numberOfLines={1}>
                {st.service}
              </Text>
              <Text style={styles.stepStaff} numberOfLines={1}>
                {st.staffName}
              </Text>
            </View>
          );
        })}
      </View>
      {showReceipt && (
        <TouchableOpacity
          style={[ui.softBtn, { height: 36, alignSelf: "center", marginTop: 14 }]}
          activeOpacity={0.75}
          onPress={() => router.push(`${appointmentRoute(appt.id)}/receipt` as any)}
        >
          <Text style={[ui.softBtnText, { fontSize: 13 }]}>Print Receipt</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  filterLabel: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 8,
  },
  statusRow: {
    gap: 8,
  },
  statusChip: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
  },
  statusChipActive: {
    borderColor: colors.primary,
  },
  statusChipText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textDark,
  },
  statusChipTextActive: {
    color: colors.primary,
  },
  list: {
    marginTop: 16,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
  },
  idText: {
    fontFamily: fonts.medium,
    color: colors.primary,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 18,
  },
  booking: {
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: 14,
    alignItems: "center",
  },
  bookingTitle: {
    fontFamily: fonts.medium,
    fontSize: 16,
    color: colors.text,
    marginBottom: 14,
  },
  stepsRow: {
    flexDirection: "row",
    alignSelf: "stretch",
    justifyContent: "center",
  },
  step: {
    flex: 1,
    maxWidth: 96,
    alignItems: "center",
  },
  stepTop: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "stretch",
  },
  connector: {
    flex: 1,
    height: 1,
    backgroundColor: colors.textMuted,
  },
  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  circleText: {
    fontFamily: fonts.medium,
    fontSize: 13,
  },
  stepBadge: {
    marginTop: 8,
    borderRadius: radius.sm + 2,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  stepBadgeText: {
    fontFamily: fonts.regular,
    fontSize: 12,
  },
  stepTime: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 10,
  },
  stepService: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    color: colors.text,
    marginTop: 2,
  },
  stepStaff: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  empty: {
    alignItems: "center",
    paddingVertical: 36,
    gap: 8,
  },
  emptyText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
  },
});
