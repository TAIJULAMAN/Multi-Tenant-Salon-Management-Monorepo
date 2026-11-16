import React, { useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  useWindowDimensions,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, fonts, radius, shadows } from "@/constants/figmaTheme";
import CalendarPageHeader from "@/components/calendar/CalendarPageHeader";
import CalendarToolbar from "@/components/calendar/CalendarToolbar";
import TeamFilterSheet from "@/components/calendar/TeamFilterSheet";
import RecordCard, { RecordList } from "@/components/ui/RecordCard";
import {
  Anchor,
  FieldLabel,
  FigmaModal,
  OptionPicker,
  PopoverMenu,
  SelectField,
  SquareAvatar,
  ui,
  measureAnchor,
} from "@/components/calendar/ui";
import {
  APPOINTMENT_STATUSES,
  CURRENT_EMPLOYEE_ID,
  WEEKDAYS_LONG,
  WEEKDAYS_SHORT,
  addAppointmentToStore,
  addDays,
  addMonths,
  availableServices,
  buildBookingOrder,
  clientList,
  formatDayLabel,
  formatMonthLabel,
  formatNumericDate,
  formatTimeSlot,
  formatWeekLabel,
  getAppointmentById,
  getMonthMatrix,
  getStaffById,
  isSameDay,
  minutesToTime,
  nextAppointmentCode,
  parseISODate,
  staffList,
  startOfWeek,
  timeToMinutes,
  toISODate,
  todayISO,
  uid,
  updateAppointmentInStore,
} from "@/components/calendar/data";
import { AppStatus, CalAppointment, CalendarViewMode, ServiceItem } from "@/components/calendar/types";

/* -------------------------------------------------------------------------- */
/*                                    Model                                   */
/* -------------------------------------------------------------------------- */

/** One service line of the appointment. Unscheduled lines (Figma 1:23969) have no date/staff/start. */
interface LineItem {
  id: string;
  serviceId: string;
  name: string;
  duration: number;
  priceNum: number;
  staffId: string | null;
  date: string | null; // ISO
  startMin: number | null;
}

interface ClientPick {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
}

const isScheduled = (l: LineItem) => l.date !== null && l.startMin !== null && l.staffId !== null;

const recentlyScheduledClients: (ClientPick & { subtitle: string })[] = [
  { ...pickClient("c1"), subtitle: "+39 345 678 9123" },
  { ...pickClient("c2"), subtitle: "+39 345 678 9123" },
  { ...pickClient("c3"), name: "Virgie Sutton", subtitle: "+39 345 678 9123" },
  {
    id: "st6",
    name: "Lois Gregory",
    email: "lois.gregory@salon.com",
    phone: "Staff",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80",
    subtitle: "Staff",
  },
];

function pickClient(id: string): ClientPick {
  const c = clientList.find((x) => x.id === id) ?? clientList[0];
  return { id: c.id, name: c.name, email: c.email ?? "", phone: c.phone, avatar: c.avatar ?? "" };
}

const PAYMENT_METHODS = [
  { id: "cash", label: "Cash", icon: "cash-outline" as const },
  { id: "gift_card", label: "Gift Card", icon: "ticket-outline" as const },
  { id: "card_terminal", label: "Card Terminal", icon: "card-outline" as const },
  { id: "qr_code", label: "QR Code", icon: "qr-code-outline" as const },
];

const TIP_PERCENTS = [10, 18, 25, 35, 45];
const STEPS = [
  { key: 1 as const, label: "Appointment Details", icon: "calendar-outline" as const },
  { key: 2 as const, label: "Review Appointment", icon: "reader-outline" as const },
  { key: 3 as const, label: "Payment", icon: "logo-usd" as const },
];

// Scheduler geometry (Figma: 4 × 50px rows per hour → 15 min slots).
const SLOT_MIN = 15;
const SLOT_H = 30;
const HOUR_H = SLOT_H * (60 / SLOT_MIN);
const TIME_W = 72;
const COL_W = 124;
const HEADER_H = 84;
const HOURS = Array.from({ length: 24 }, (_, i) => i);

const money = (v: number) => (v % 1 === 0 ? `€ ${v}` : `€ ${v.toFixed(2).replace(".", ",")}`);
const parseNum = (s: string) => parseFloat(s.replace(",", ".").replace(/[^0-9.]/g, ""));

/* -------------------------------------------------------------------------- */
/*                                    Screen                                  */
/* -------------------------------------------------------------------------- */

/**
 * Add Appointment wizard — Figma 1:30565 → 1:23360 (Appointment Details),
 * 1:23564 / 1:26150 / 1:23969 / 1:31043 / 1:24169 / 1:23749 (Review Appointment),
 * 1:24367 / 1:24551 / 1:24773 / 1:25196 / 1:25001 (Payment).
 */
export default function AddAppointmentScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { height: screenH } = useWindowDimensions();
  const params = useLocalSearchParams<{ staffId?: string; date?: string; startTime?: string; editId?: string }>();
  const editing = params.editId ? getAppointmentById(params.editId) : null;

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [code] = useState(() => editing?.code ?? nextAppointmentCode());

  /* ------------------------------- Client ------------------------------- */
  const [client, setClient] = useState<ClientPick | null>(
    editing
      ? {
          id: editing.clientId ?? "c-edit",
          name: editing.clientName,
          email: editing.clientEmail ?? "",
          phone: editing.clientPhone ?? "",
          avatar: editing.clientAvatar ?? "",
        }
      : null
  );
  const [clientSearch, setClientSearch] = useState("");
  const [newClientOpen, setNewClientOpen] = useState(false);
  const [newClient, setNewClient] = useState({ name: "", phone: "", email: "" });

  const clientResults = useMemo(() => {
    const q = clientSearch.trim().toLowerCase();
    if (!q) return recentlyScheduledClients;
    return clientList
      .filter((c) => c.name.toLowerCase().includes(q) || c.phone.replace(/\s/g, "").includes(q.replace(/\s/g, "")))
      .map((c) => ({ ...pickClient(c.id), subtitle: c.phone }));
  }, [clientSearch]);

  /* ------------------------------ Services ------------------------------ */
  const [catalog, setCatalog] = useState<ServiceItem[]>(availableServices);
  const [items, setItems] = useState<LineItem[]>(() => {
    if (!editing) return [];
    const svc = availableServices.find((s) => s.name === editing.service);
    return [
      {
        id: "line-1",
        serviceId: svc?.id ?? "srv-edit",
        name: editing.service,
        duration: Math.max(15, timeToMinutes(editing.endTime) - timeToMinutes(editing.startTime)),
        priceNum: editing.priceNum,
        staffId: editing.staffId,
        date: editing.date,
        startMin: timeToMinutes(editing.startTime),
      },
    ];
  });
  // true → the "Service" card shows the scheduler (1:30565 / 1:31043); false → the services table (1:23360).
  const [scheduling, setScheduling] = useState(!editing);
  const [frequency, setFrequency] = useState(editing?.repeating ? "Weekly" : "Doesn't repeat");
  const [frequencyOpen, setFrequencyOpen] = useState(false);

  const scheduled = items.filter(isScheduled);
  const pending = items.filter((l) => !isScheduled(l));
  const totalPrice = items.reduce((a, l) => a + l.priceNum, 0);
  const totalDuration = items.reduce((a, l) => a + l.duration, 0);
  const firstScheduled = [...scheduled].sort(
    (a, b) => (a.date! + minutesToTime(a.startMin!)).localeCompare(b.date! + minutesToTime(b.startMin!))
  )[0];

  /* ----------------------------- Scheduler ------------------------------ */
  const [viewMode, setViewMode] = useState<CalendarViewMode>("day");
  const [anchorDate, setAnchorDate] = useState<Date>(parseISODate(editing?.date ?? params.date ?? todayISO()));
  const [teamIds, setTeamIds] = useState<string[]>(staffList.map((s) => s.id));
  const [teamAnchor, setTeamAnchor] = useState<Anchor | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [serviceSearch, setServiceSearch] = useState("");
  const [activeChip, setActiveChip] = useState<string | null>(null);
  const [chipMenu, setChipMenu] = useState<{ anchor: Anchor; id: string; kind: "catalog" | "line" } | null>(null);
  const [editService, setEditService] = useState<{ id: string; kind: "catalog" | "line"; name: string; duration: string; price: string } | null>(null);

  const visibleStaff = staffList.filter((s) => teamIds.includes(s.id));
  const initialScrollHour = Math.max(0, Math.floor(timeToMinutes(params.startTime ?? "09:00") / 60) - 1);

  const chips: { id: string; kind: "catalog" | "line"; name: string; duration: number; priceNum: number }[] = (
    pending.length > 0
      ? pending.map((l) => ({ id: l.id, kind: "line" as const, name: l.name, duration: l.duration, priceNum: l.priceNum }))
      : catalog.map((c) => ({ id: c.id, kind: "catalog" as const, name: c.name, duration: c.duration, priceNum: c.priceNum }))
  ).filter((c) => c.name.toLowerCase().includes(serviceSearch.trim().toLowerCase()));

  const dateLabel =
    viewMode === "day" ? formatDayLabel(anchorDate) : viewMode === "week" ? formatWeekLabel(anchorDate) : formatMonthLabel(anchorDate);
  const shift = (dir: 1 | -1) =>
    setAnchorDate((d) => (viewMode === "day" ? addDays(d, dir) : viewMode === "week" ? addDays(d, 7 * dir) : addMonths(d, dir)));

  const placeAt = (staffId: string, date: string, startMin: number) => {
    const chip = chips.find((c) => c.id === activeChip) ?? (chips.length === 1 ? chips[0] : undefined);
    if (!chip) {
      Alert.alert("Select a service", "Tap one of the Available Services, then tap a time slot to schedule it.");
      return;
    }
    if (chip.kind === "line") {
      setItems((prev) => prev.map((l) => (l.id === chip.id ? { ...l, staffId, date, startMin } : l)));
      setActiveChip(null);
    } else {
      setItems((prev) => [
        ...prev,
        {
          id: uid("line"),
          serviceId: chip.id,
          name: chip.name,
          duration: chip.duration,
          priceNum: chip.priceNum,
          staffId,
          date,
          startMin,
        },
      ]);
    }
  };

  const removeLine = (id: string) => setItems((prev) => prev.filter((l) => l.id !== id));

  const confirmRemoveBlock = (line: LineItem) =>
    Alert.alert("Remove service", `Remove ${line.name} from the schedule?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Remove", style: "destructive", onPress: () => removeLine(line.id) },
    ]);

  const saveSchedule = () => {
    if (items.length === 0) {
      Alert.alert("No services scheduled", "Select a service and tap a time slot to schedule it.");
      return;
    }
    setScheduling(false);
    setActiveChip(null);
  };

  /* ------------------------------ Review -------------------------------- */
  const [status, setStatus] = useState<AppStatus>(editing?.status ?? "Booked");
  const [statusOpen, setStatusOpen] = useState(false);
  const [note, setNote] = useState(editing?.notes ?? "");
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteDraft, setNoteDraft] = useState("");
  const [staffPickFor, setStaffPickFor] = useState<string | null>(null);
  const [addServiceOpen, setAddServiceOpen] = useState(false);
  const [addServiceId, setAddServiceId] = useState<string>(availableServices[0].id);
  const [addServiceListOpen, setAddServiceListOpen] = useState(false);
  const reviewMenuRef = useRef<View>(null);
  const paymentMenuRef = useRef<View>(null);
  const [reviewMenuAnchor, setReviewMenuAnchor] = useState<Anchor | null>(null);
  const [paymentMenuAnchor, setPaymentMenuAnchor] = useState<Anchor | null>(null);

  // Request upfront payment (1:23749)
  const [upfrontOpen, setUpfrontOpen] = useState(false);
  const [upfrontAmount, setUpfrontAmount] = useState("");
  const [upfrontMethod, setUpfrontMethod] = useState<string | null>(null);
  const [upfront, setUpfront] = useState<{ amount: number; method: string } | null>(null);

  /* ------------------------------ Payment ------------------------------- */
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);

  // Send a Tip (1:24551 / 1:24773 / 1:25196)
  const [tipOpen, setTipOpen] = useState(false);
  const [tipStaffId, setTipStaffId] = useState<string>(CURRENT_EMPLOYEE_ID);
  const [tipStaffListOpen, setTipStaffListOpen] = useState(false);
  const [tipChoice, setTipChoice] = useState<"none" | "custom" | number>("none");
  const [customTipType, setCustomTipType] = useState<"Percentage" | "Specific value">("Percentage");
  const [customTipTypeOpen, setCustomTipTypeOpen] = useState(false);
  const [customTipValue, setCustomTipValue] = useState("");
  const [tip, setTip] = useState<{ staffId: string; amount: number } | null>(null);

  // Add Cart Discount (1:25001)
  const [discountOpen, setDiscountOpen] = useState(false);
  const [discountType, setDiscountType] = useState<"Percentage" | "Specific value">("Percentage");
  const [discountTypeOpen, setDiscountTypeOpen] = useState(false);
  const [discountValue, setDiscountValue] = useState("");
  const [discount, setDiscount] = useState<{ type: "Percentage" | "Specific value"; value: number } | null>(null);

  const discountFor = (type: "Percentage" | "Specific value", value: number) =>
    type === "Percentage" ? (totalPrice * value) / 100 : Math.min(totalPrice, value);
  const discountAmount = discount ? discountFor(discount.type, discount.value) : 0;
  const draftDiscount = parseNum(discountValue);
  const totalAfterDiscountDraft = Number.isFinite(draftDiscount) ? totalPrice - discountFor(discountType, draftDiscount) : 0;

  const draftCustomTip = parseNum(customTipValue);
  const customTipAmount = Number.isFinite(draftCustomTip)
    ? customTipType === "Percentage"
      ? (totalPrice * draftCustomTip) / 100
      : draftCustomTip
    : 0;
  const tipAmount = tip?.amount ?? 0;
  const orderTotal = Math.max(0, totalPrice - discountAmount + tipAmount);

  /* ------------------------------- Actions ------------------------------ */
  const goNext = () => {
    if (step === 1) {
      if (!client) {
        Alert.alert("Client required", "Select a client, Walk-In or add a new client.");
        return;
      }
      if (items.length === 0) {
        Alert.alert("Service required", "Schedule at least one service.");
        return;
      }
      setScheduling(false);
      setStep(2);
      return;
    }
    // Step 2 scheduler (1:31043) → back to the review table (1:24169)
    setScheduling(false);
  };

  const goToStep = (s: 1 | 2 | 3) => {
    if (s > 1 && (!client || items.length === 0)) {
      Alert.alert("Appointment details", "Select a client and schedule at least one service first.");
      return;
    }
    if (s === 3 && pending.length > 0) {
      Alert.alert("Unscheduled service", "Schedule every service before checkout.");
      return;
    }
    setScheduling(false);
    setStep(s);
  };

  const addServiceFromModal = () => {
    const svc = catalog.find((s) => s.id === addServiceId) ?? catalog[0];
    setItems((prev) => [
      ...prev,
      { id: uid("line"), serviceId: svc.id, name: svc.name, duration: svc.duration, priceNum: svc.priceNum, staffId: null, date: null, startMin: null },
    ]);
    setAddServiceOpen(false);
    setAddServiceListOpen(false);
  };

  const saveUpfront = () => {
    const amount = parseNum(upfrontAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
      Alert.alert("Amount required", "Please enter the upfront amount.");
      return;
    }
    if (!upfrontMethod) {
      Alert.alert("Payment method required", "Please select a payment method.");
      return;
    }
    setUpfront({ amount, method: upfrontMethod });
    setUpfrontOpen(false);
  };

  const saveTip = () => {
    let amount = 0;
    if (tipChoice === "custom") amount = customTipAmount;
    else if (typeof tipChoice === "number") amount = (totalPrice * tipChoice) / 100;
    setTip(amount > 0 ? { staffId: tipStaffId, amount } : null);
    setTipOpen(false);
    setTipStaffListOpen(false);
  };

  const saveDiscount = () => {
    if (!Number.isFinite(draftDiscount) || draftDiscount <= 0) {
      Alert.alert("Amount required", discountType === "Percentage" ? "Please enter a percentage." : "Please enter a value.");
      return;
    }
    setDiscount({ type: discountType, value: draftDiscount });
    setDiscountOpen(false);
  };

  const saveEditService = () => {
    if (!editService) return;
    const name = editService.name.trim();
    const duration = parseInt(editService.duration, 10);
    const price = parseNum(editService.price);
    if (!name || !Number.isFinite(duration) || duration <= 0 || !Number.isFinite(price)) {
      Alert.alert("Invalid service", "Enter a name, a duration in minutes and a price.");
      return;
    }
    if (editService.kind === "catalog") {
      setCatalog((prev) =>
        prev.map((c) =>
          c.id === editService.id ? { ...c, name, duration, durationText: `${duration} min`, price: money(price), priceNum: price } : c
        )
      );
    } else {
      setItems((prev) => prev.map((l) => (l.id === editService.id ? { ...l, name, duration, priceNum: price } : l)));
    }
    setEditService(null);
  };

  const createClient = () => {
    if (!newClient.name.trim()) {
      Alert.alert("Required", "Please enter the client's full name.");
      return;
    }
    setClient({ id: uid("c"), name: newClient.name.trim(), email: newClient.email.trim(), phone: newClient.phone.trim(), avatar: "" });
    setNewClient({ name: "", phone: "", email: "" });
    setNewClientOpen(false);
  };

  const saveAndLeave = () => {
    if (!client || items.length === 0) {
      Alert.alert("Appointment details", "Select a client and schedule at least one service.");
      return;
    }
    if (pending.length > 0 || !firstScheduled) {
      Alert.alert("Unscheduled service", "Use the edit icon to schedule every service before saving.");
      return;
    }
    if (step === 3 && !paymentMethod) {
      Alert.alert("Payment method required", "Please select a payment method.");
      return;
    }
    const start = firstScheduled.startMin!;
    const startTime = minutesToTime(start);
    const endTime = minutesToTime(start + totalDuration);
    const serviceNames = items.map((l) => l.name).join(", ");
    const staffName = getStaffById(firstScheduled.staffId!).name;
    const methodLabel = (id: string) => PAYMENT_METHODS.find((m) => m.id === id)?.label ?? id;
    const extra = [
      upfront ? `Upfront: ${money(upfront.amount)} (${methodLabel(upfront.method)})` : "",
      step === 3 && paymentMethod ? `Paid by ${methodLabel(paymentMethod)}` : "",
    ]
      .filter(Boolean)
      .join(" | ");

    const appointment: CalAppointment = {
      id: editing?.id ?? uid("apt"),
      code,
      staffId: firstScheduled.staffId!,
      clientId: client.id,
      clientName: client.name,
      clientPhone: client.phone,
      clientEmail: client.email,
      clientAvatar: client.avatar,
      service: serviceNames,
      startTime,
      endTime,
      duration: `${totalDuration} min`,
      price: money(orderTotal),
      priceNum: orderTotal,
      status,
      paymentStatus: step === 3 ? "Paid" : upfront ? "Partially Paid" : "Unpaid",
      repeating: frequency !== "Doesn't repeat",
      notes: [note, extra].filter(Boolean).join(" | "),
      date: firstScheduled.date!,
      bookingOrder: buildBookingOrder(startTime, serviceNames, staffName, status),
    };
    if (editing) updateAppointmentInStore(appointment);
    else addAppointmentToStore(appointment);
    if (router.canGoBack()) router.back();
    else router.replace("/(drawer)/(tabs)/calendar" as any);
  };

  const frequencyOptions = (() => {
    const d = firstScheduled?.date ? parseISODate(firstScheduled.date) : anchorDate;
    return [
      "Doesn't repeat",
      "Daily",
      `Weekly on ${WEEKDAYS_LONG[d.getDay()]}`,
      `Monthly on day ${d.getDate()}`,
      "Every weekday (Monday to Friday)",
    ];
  })();

  /* ---------------------------------------------------------------------- */
  /*                               Renderers                                 */
  /* ---------------------------------------------------------------------- */

  const renderStepBar = () => (
    <View style={[ui.card, styles.stepCard]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.stepRow}>
        {STEPS.map((s) => {
          const active = step === s.key;
          return (
            <TouchableOpacity
              key={s.key}
              style={[styles.stepTab, active && styles.stepTabActive]}
              onPress={() => goToStep(s.key)}
              activeOpacity={0.75}
            >
              <View style={[styles.stepIcon, active && styles.stepIconActive]}>
                <Ionicons name={s.icon} size={18} color={active ? colors.white : colors.text} />
              </View>
              <Text style={[styles.stepText, active && styles.stepTextActive]}>{s.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  const renderClientCard = () => (
    <View style={ui.card}>
      <Text style={ui.cardTitle}>Client</Text>
      <View style={[ui.searchBox, { marginTop: 12 }]}>
        <Ionicons name="search-outline" size={18} color={colors.text} />
        <TextInput
          style={ui.searchInput}
          placeholder="Search"
          placeholderTextColor={colors.textMuted}
          value={clientSearch}
          onChangeText={setClientSearch}
        />
      </View>

      <View style={styles.clientActions}>
        <TouchableOpacity
          style={[styles.bigTile, client?.id === "walkin" && styles.tileActive]}
          activeOpacity={0.75}
          onPress={() => setClient({ id: "walkin", name: "Walk-In", email: "-", phone: "-", avatar: "" })}
        >
          <View style={styles.tileIcon}>
            <Ionicons name="walk-outline" size={30} color={colors.primary} />
          </View>
          <Text style={styles.tileLabel}>Walk-In</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bigTile} activeOpacity={0.75} onPress={() => setNewClientOpen(true)}>
          <View style={styles.tileIcon}>
            <Ionicons name="hand-left-outline" size={28} color={colors.primary} />
          </View>
          <Text style={styles.tileLabel}>Add New Client</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subTitle}>{clientSearch.trim() ? "Search Results" : "Recently Scheduled Clients"}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingBottom: 4 }}>
        {clientResults.map((c, idx) => {
          const active = client?.id === c.id && client?.name === c.name;
          return (
            <TouchableOpacity
              key={`${c.id}-${idx}`}
              style={[styles.clientTile, active && styles.tileActive]}
              activeOpacity={0.75}
              onPress={() => setClient({ id: c.id, name: c.name, email: c.email, phone: c.phone, avatar: c.avatar })}
            >
              <SquareAvatar uri={c.avatar} name={c.name} size={64} rounded={32} bg={colors.pinkSoft} />
              <Text style={styles.clientName} numberOfLines={1}>
                {c.name}
              </Text>
              <Text style={styles.clientSub} numberOfLines={1}>
                {c.subtitle}
              </Text>
            </TouchableOpacity>
          );
        })}
        {clientResults.length === 0 && <Text style={styles.muted}>No clients found.</Text>}
      </ScrollView>
    </View>
  );

  /* ----------------------------- Scheduler grid ---------------------------- */

  const renderDayGrid = (height: number) => {
    const iso = toISODate(anchorDate);
    const gridW = TIME_W + visibleStaff.length * COL_W;
    const dayLines = scheduled.filter((l) => l.date === iso);
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator nestedScrollEnabled>
        <View style={{ width: gridW, height }}>
          <View style={[styles.gridHeader, { height: HEADER_H }]}>
            <View style={{ width: TIME_W }} />
            {visibleStaff.map((s) => (
              <View key={s.id} style={[styles.staffHeadCell, { width: COL_W }]}>
                <SquareAvatar uri={s.avatar} name={s.name} size={40} bg={s.bgColor} rounded={10} />
                <Text style={styles.staffHeadName} numberOfLines={1}>
                  {s.name}
                </Text>
              </View>
            ))}
          </View>
          <ScrollView
            nestedScrollEnabled
            showsVerticalScrollIndicator
            contentOffset={{ x: 0, y: initialScrollHour * HOUR_H }}
          >
            <View style={{ height: HOURS.length * HOUR_H }}>
              {HOURS.map((h) => (
                <View key={h} style={[styles.hourRow, { top: h * HOUR_H, height: HOUR_H }]}>
                  <View style={[styles.timeCell, { width: TIME_W }]}>
                    <Text style={styles.timeText}>{formatTimeSlot(h)}</Text>
                  </View>
                  {visibleStaff.map((s) => (
                    <View key={s.id} style={[styles.colCell, { width: COL_W }]}>
                      {[0, 1, 2, 3].map((q) => (
                        <TouchableOpacity
                          key={q}
                          style={[styles.slotCell, { height: SLOT_H }, q === 3 && { borderBottomWidth: 0 }]}
                          activeOpacity={0.5}
                          onPress={() => placeAt(s.id, iso, h * 60 + q * SLOT_MIN)}
                        />
                      ))}
                    </View>
                  ))}
                </View>
              ))}
              {dayLines.map((l) => {
                const col = visibleStaff.findIndex((s) => s.id === l.staffId);
                if (col < 0) return null;
                return (
                  <TouchableOpacity
                    key={l.id}
                    activeOpacity={0.8}
                    onPress={() => confirmRemoveBlock(l)}
                    style={[
                      styles.block,
                      {
                        left: TIME_W + col * COL_W + 4,
                        width: COL_W - 8,
                        top: (l.startMin! / SLOT_MIN) * SLOT_H + 2,
                        height: Math.max(SLOT_H - 4, (l.duration / SLOT_MIN) * SLOT_H - 4),
                      },
                    ]}
                  >
                    <Text style={styles.blockTitle} numberOfLines={1}>
                      {l.name}
                    </Text>
                    <Text style={styles.blockMeta} numberOfLines={1}>
                      {minutesToTime(l.startMin!)} - {minutesToTime(l.startMin! + l.duration)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    );
  };

  const renderWeekGrid = (height: number) => {
    const ws = startOfWeek(anchorDate);
    const days = Array.from({ length: 7 }, (_, i) => addDays(ws, i));
    const staffId = teamIds.includes(CURRENT_EMPLOYEE_ID) ? CURRENT_EMPLOYEE_ID : teamIds[0];
    const gridW = TIME_W + 7 * COL_W;
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator nestedScrollEnabled>
        <View style={{ width: gridW, height }}>
          <View style={[styles.gridHeader, { height: 44 }]}>
            <View style={{ width: TIME_W }} />
            {days.map((d) => (
              <TouchableOpacity
                key={toISODate(d)}
                style={[styles.staffHeadCell, { width: COL_W }]}
                onPress={() => {
                  setAnchorDate(d);
                  setViewMode("day");
                }}
              >
                <Text style={styles.weekHead}>
                  {String(d.getDate()).padStart(2, "0")} {WEEKDAYS_LONG[d.getDay()]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <ScrollView nestedScrollEnabled contentOffset={{ x: 0, y: initialScrollHour * HOUR_H }}>
            <View style={{ height: HOURS.length * HOUR_H }}>
              {HOURS.map((h) => (
                <View key={h} style={[styles.hourRow, { top: h * HOUR_H, height: HOUR_H }]}>
                  <View style={[styles.timeCell, { width: TIME_W }]}>
                    <Text style={styles.timeText}>{formatTimeSlot(h)}</Text>
                  </View>
                  {days.map((d) => (
                    <View key={toISODate(d)} style={[styles.colCell, { width: COL_W }]}>
                      {[0, 1, 2, 3].map((q) => (
                        <TouchableOpacity
                          key={q}
                          style={[styles.slotCell, { height: SLOT_H }, q === 3 && { borderBottomWidth: 0 }]}
                          activeOpacity={0.5}
                          onPress={() => placeAt(staffId, toISODate(d), h * 60 + q * SLOT_MIN)}
                        />
                      ))}
                    </View>
                  ))}
                </View>
              ))}
              {scheduled.map((l) => {
                const col = days.findIndex((d) => toISODate(d) === l.date);
                if (col < 0) return null;
                return (
                  <TouchableOpacity
                    key={l.id}
                    activeOpacity={0.8}
                    onPress={() => confirmRemoveBlock(l)}
                    style={[
                      styles.block,
                      {
                        left: TIME_W + col * COL_W + 4,
                        width: COL_W - 8,
                        top: (l.startMin! / SLOT_MIN) * SLOT_H + 2,
                        height: Math.max(SLOT_H - 4, (l.duration / SLOT_MIN) * SLOT_H - 4),
                      },
                    ]}
                  >
                    <Text style={styles.blockTitle} numberOfLines={1}>
                      {l.name}
                    </Text>
                    <Text style={styles.blockMeta} numberOfLines={1}>
                      {getStaffById(l.staffId!).name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    );
  };

  const renderMonthGrid = () => {
    const matrix = getMonthMatrix(anchorDate);
    const month = anchorDate.getMonth();
    return (
      <ScrollView nestedScrollEnabled>
        <View style={[styles.gridHeader, { height: 40 }]}>
          {WEEKDAYS_SHORT.map((d) => (
            <Text key={d} style={[styles.weekHead, { flex: 1, textAlign: "center" }]}>
              {d}
            </Text>
          ))}
        </View>
        {matrix.map((row, r) => (
          <View key={r} style={{ flexDirection: "row" }}>
            {row.map((d) => {
              const iso = toISODate(d);
              const lines = scheduled.filter((l) => l.date === iso);
              return (
                <TouchableOpacity
                  key={iso}
                  style={styles.monthCell}
                  onPress={() => {
                    setAnchorDate(d);
                    setViewMode("day");
                  }}
                >
                  <Text style={[styles.monthNum, d.getMonth() !== month && { color: colors.textMuted }, isSameDay(d, anchorDate) && { color: colors.primary }]}>
                    {d.getDate()}
                  </Text>
                  {lines.slice(0, 2).map((l) => (
                    <View key={l.id} style={styles.monthLabel}>
                      <Text style={styles.monthLabelText} numberOfLines={1}>
                        {l.name}
                      </Text>
                    </View>
                  ))}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </ScrollView>
    );
  };

  const renderServicesPanel = () => (
    <View style={styles.panel}>
      <View style={styles.panelHead}>
        <Text style={styles.panelTitle}>Available Services</Text>
        <Text style={styles.panelSub}>Drag services to schedule appointments</Text>
      </View>
      <View style={styles.panelBody}>
        <View style={[ui.searchBox, { height: 40 }]}>
          <Ionicons name="search-outline" size={18} color={colors.text} />
          <TextInput
            style={ui.searchInput}
            placeholder="Search"
            placeholderTextColor={colors.textMuted}
            value={serviceSearch}
            onChangeText={setServiceSearch}
          />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingTop: 10 }}>
          {chips.map((c) => {
            const active = activeChip === c.id || (chips.length === 1 && !activeChip);
            return (
              <TouchableOpacity
                key={c.id}
                style={[styles.chip, active && styles.chipActive]}
                activeOpacity={0.8}
                onPress={() => setActiveChip(activeChip === c.id ? null : c.id)}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.chipTitle} numberOfLines={1}>
                    {c.name}
                  </Text>
                  <Text style={styles.chipMeta}>
                    {c.duration} min • {money(c.priceNum)}
                  </Text>
                </View>
                <ChipKebab onOpen={(anchor) => setChipMenu({ anchor, id: c.id, kind: c.kind })} />
              </TouchableOpacity>
            );
          })}
          {chips.length === 0 && <Text style={styles.muted}>No services found.</Text>}
        </ScrollView>
        {chips.length > 0 && (
          <Text style={styles.panelHint}>
            {activeChip || chips.length === 1
              ? `Tap a time slot to place ${chips.find((c) => c.id === activeChip)?.name ?? chips[0].name}.`
              : "Tap a service, then tap a time slot."}
          </Text>
        )}
      </View>
    </View>
  );

  const renderScheduler = (isFull: boolean) => {
    const gridHeight = isFull ? screenH - insets.top - insets.bottom - 330 : 460;
    return (
      <>
        <CalendarToolbar
          selectedStaffIds={teamIds}
          onOpenTeamFilter={setTeamAnchor}
          dateLabel={dateLabel}
          onPrev={() => shift(-1)}
          onNext={() => shift(1)}
          viewMode={viewMode}
          onChangeViewMode={setViewMode}
          onToggleFullscreen={() => setFullscreen(!isFull)}
          fullscreenActive={isFull}
        />
        <View style={{ height: 14 }} />
        {renderServicesPanel()}
        <View style={[styles.gridFrame, { height: viewMode === "month" ? undefined : gridHeight }]}>
          {viewMode === "day" ? renderDayGrid(gridHeight) : viewMode === "week" ? renderWeekGrid(gridHeight) : renderMonthGrid()}
        </View>
      </>
    );
  };

  /* ----------------------------- Services list ----------------------------- */

  // One card per service line (replaces the wide horizontally scrolling table).
  const renderTable = (opts: { editable: boolean }) => (
    <RecordList>
      {items.map((l) => {
        const sched = isScheduled(l);
        const staff = l.staffId ? getStaffById(l.staffId) : null;
        return (
          <RecordCard
            key={l.id}
            title={l.name}
            trailing={<Text style={styles.cardPrice}>{money(l.priceNum)}</Text>}
            fields={[
              { label: "Date", value: sched ? formatNumericDate(l.date!) : "-" },
              { label: "Start Time", value: sched ? minutesToTime(l.startMin!) : "-" },
              { label: "Duration", value: `${l.duration} min` },
              {
                label: "Employee",
                full: true,
                value: staff ? (
                  <TouchableOpacity style={styles.employeePill} activeOpacity={0.75} onPress={() => setStaffPickFor(l.id)}>
                    <SquareAvatar uri={staff.avatar} name={staff.name} size={36} bg={staff.bgColor} rounded={8} />
                    <Text style={styles.employeeName} numberOfLines={1}>
                      {staff.name}
                    </Text>
                    <Ionicons name="chevron-down" size={18} color={colors.text} />
                  </TouchableOpacity>
                ) : (
                  "-"
                ),
              },
            ]}
            footer={
              opts.editable ? (
                <View style={styles.rowActions}>
                  {!sched && (
                    <TouchableOpacity
                      hitSlop={8}
                      onPress={() => {
                        setActiveChip(l.id);
                        if (l.date) setAnchorDate(parseISODate(l.date));
                        setScheduling(true);
                      }}
                    >
                      <Ionicons name="pencil-outline" size={20} color={colors.teal} />
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity hitSlop={8} onPress={() => removeLine(l.id)}>
                    <Ionicons name="trash-outline" size={20} color={colors.pink} />
                  </TouchableOpacity>
                </View>
              ) : undefined
            }
          />
        );
      })}
    </RecordList>
  );

  const renderTableFooter = () => (
    <>
      <View style={styles.tableFooter}>
        <TouchableOpacity
          style={ui.softBtn}
          activeOpacity={0.75}
          onPress={() => {
            setAddServiceId(catalog[0]?.id ?? "");
            setAddServiceOpen(true);
          }}
        >
          <Ionicons name="add" size={18} color={colors.primary} />
          <Text style={ui.softBtnText}>Add Service</Text>
        </TouchableOpacity>
        <View style={styles.totalTime}>
          <Text style={styles.totalTimeLabel}>Total Time</Text>
          <View style={ui.tealPill}>
            <Text style={ui.tealPillText}>{totalDuration} min</Text>
          </View>
        </View>
      </View>
      <View style={styles.totalBox}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>{money(totalPrice)}</Text>
      </View>
    </>
  );

  const renderServiceCard = () => (
    <View style={ui.card}>
      <Text style={[ui.cardTitle, { marginBottom: 14 }]}>Service</Text>
      {scheduling ? (
        <>
          {renderScheduler(false)}
          <View style={styles.saveRow}>
            <TouchableOpacity style={styles.outlineBtn} activeOpacity={0.75} onPress={saveSchedule}>
              <Text style={styles.outlineBtnText}>Save</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          {renderTable({ editable: true })}
          {renderTableFooter()}
        </>
      )}
    </View>
  );

  const renderFrequencyCard = () => (
    <View style={ui.card}>
      <SelectField
        label="Frequency"
        required
        value={frequency === "Doesn't repeat" ? undefined : frequency}
        placeholder="Doesn't repeat"
        onPress={() => setFrequencyOpen(true)}
      />
      <TouchableOpacity onPress={() => setFrequencyOpen(true)} style={{ marginTop: 8, alignSelf: "flex-start" }}>
        <Text style={styles.link}>Set up frequency</Text>
      </TouchableOpacity>
    </View>
  );

  const renderNext = () => (
    <View style={styles.nextRow}>
      <TouchableOpacity style={ui.primaryBtn} activeOpacity={0.85} onPress={goNext}>
        <Text style={ui.primaryBtnText}>Next</Text>
      </TouchableOpacity>
    </View>
  );

  const renderBasicInfo = () => {
    const end = firstScheduled ? firstScheduled.startMin! + totalDuration : 0;
    return (
      <>
        <View style={ui.card}>
          <View style={styles.rowBetween}>
            <Text style={ui.cardTitle}>Basic Informations</Text>
            <Text style={styles.code}>{code}</Text>
          </View>
          <Text style={[styles.smallLabel, { marginTop: 16 }]}>Client</Text>
          <View style={styles.clientRow}>
            <SquareAvatar uri={client?.avatar} name={client?.name ?? "-"} size={52} rounded={8} bg={colors.pinkSoft} />
            <View style={{ flex: 1 }}>
              <Text style={styles.clientRowName} numberOfLines={1}>
                {client?.name ?? "-"}
              </Text>
              <Text style={styles.clientRowEmail} numberOfLines={1}>
                {client?.email || "-"}
              </Text>
            </View>
            <TouchableOpacity
              style={[ui.softBtn, { height: 40 }]}
              activeOpacity={0.75}
              onPress={() => {
                if (!client || client.id === "walkin") {
                  Alert.alert("Walk-In", "Walk-in clients don't have a profile.");
                  return;
                }
                router.push(`/(drawer)/(tabs)/clients/${client.id}` as any);
              }}
            >
              <Text style={ui.softBtnText}>View Profile</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoGrid}>
            <View style={styles.infoCol}>
              <Text style={styles.smallLabel}>Date</Text>
              <Text style={styles.infoValue}>{firstScheduled ? formatNumericDate(firstScheduled.date!) : "-"}</Text>
            </View>
            <View style={styles.infoCol}>
              <Text style={styles.smallLabel}>Time</Text>
              <Text style={styles.infoValue}>
                {firstScheduled ? `${minutesToTime(firstScheduled.startMin!)} - ${minutesToTime(end)}` : "-"}
              </Text>
            </View>
            <View style={styles.infoCol}>
              <Text style={styles.smallLabel}>Status</Text>
              <TouchableOpacity style={styles.statusPill} activeOpacity={0.75} onPress={() => setStatusOpen(true)}>
                <Text style={styles.statusPillText}>{status}</Text>
                <Ionicons name="chevron-down" size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>
            <View style={styles.infoCol}>
              <Text style={styles.smallLabel}>Repeating</Text>
              <TouchableOpacity style={styles.repeatBtn} activeOpacity={0.75} onPress={() => setFrequencyOpen(true)}>
                <Text style={styles.repeatBtnText} numberOfLines={1}>
                  {frequency === "Doesn't repeat" ? "Set as Repeating" : frequency}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={ui.card}>
          <View style={styles.rowBetween}>
            <Text style={ui.cardTitle}>Note</Text>
            <TouchableOpacity
              style={styles.noteEdit}
              activeOpacity={0.75}
              onPress={() => {
                setNoteDraft(note);
                setNoteOpen(true);
              }}
            >
              <Ionicons name="pencil-outline" size={16} color={colors.teal} />
            </TouchableOpacity>
          </View>
          <Text style={styles.noteText}>{note.trim() ? note : "-"}</Text>
        </View>
      </>
    );
  };

  const renderReviewCard = () => (
    <View style={ui.card}>
      <Text style={[ui.cardTitle, { marginBottom: 10 }]}>Review Appointment</Text>
      {renderTable({ editable: true })}
      {renderTableFooter()}
      {upfront && (
        <View style={styles.upfrontRow}>
          <Text style={styles.upfrontText}>
            Upfront payment requested: {money(upfront.amount)} ({PAYMENT_METHODS.find((m) => m.id === upfront.method)?.label})
          </Text>
          <TouchableOpacity hitSlop={8} onPress={() => setUpfront(null)}>
            <Ionicons name="close" size={16} color={colors.pink} />
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.actionBar}>
        <TouchableOpacity style={ui.greyBtn} activeOpacity={0.75} onPress={() => setStep(1)}>
          <Text style={ui.greyBtnText}>Back</Text>
        </TouchableOpacity>
        <View style={styles.actionRight}>
          <View ref={reviewMenuRef} collapsable={false}>
            <TouchableOpacity style={styles.kebab} activeOpacity={0.75} onPress={() => measureAnchor(reviewMenuRef.current, setReviewMenuAnchor)}>
              <Ionicons name="ellipsis-vertical" size={18} color={colors.text} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={ui.softBtn} activeOpacity={0.75} onPress={() => goToStep(3)}>
            <Text style={ui.softBtnText}>Checkout</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[ui.primaryBtn, { height: 40 }]} activeOpacity={0.85} onPress={saveAndLeave}>
            <Text style={[ui.primaryBtnText, { fontSize: 14 }]}>Save and Leave</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderPaymentMethods = (selected: string | null, onSelect: (id: string) => void, compact?: boolean) => (
    <View style={styles.methodGrid}>
      {PAYMENT_METHODS.map((m) => {
        const active = selected === m.id;
        return (
          <TouchableOpacity
            key={m.id}
            style={[styles.methodTile, compact && { paddingVertical: 16 }, active && styles.tileActive]}
            activeOpacity={0.75}
            onPress={() => onSelect(m.id)}
          >
            <View style={styles.tileIcon}>
              <Ionicons name={m.icon} size={28} color={colors.primary} />
            </View>
            <Text style={styles.tileLabel}>{m.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const renderPaymentStep = () => (
    <>
      <View style={ui.card}>
        <Text style={[ui.cardTitle, { marginBottom: 14 }]}>Payment Methods</Text>
        {renderPaymentMethods(paymentMethod, setPaymentMethod)}
      </View>
      <View style={ui.card}>
        <Text style={[ui.cardTitle, { marginBottom: 10 }]}>Services</Text>
        {renderTable({ editable: false })}
        <View style={[styles.totalBox, { flexDirection: "column", alignItems: "stretch", gap: 8, marginTop: 18 }]}>
          <Text style={[ui.cardTitle, { marginBottom: 2 }]}>Order Summary</Text>
          <View style={styles.rowBetween}>
            <Text style={styles.summaryLabel}>Tax</Text>
            <Text style={styles.summaryValue}>0</Text>
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.summaryLabel}>Discount</Text>
            <View style={styles.inlineRow}>
              {discount && (
                <TouchableOpacity hitSlop={8} onPress={() => setDiscount(null)}>
                  <Ionicons name="close" size={14} color={colors.pink} />
                </TouchableOpacity>
              )}
              <Text style={styles.summaryValue}>{discount ? `- ${money(discountAmount)}` : "0"}</Text>
            </View>
          </View>
          {tip && (
            <View style={styles.rowBetween}>
              <Text style={styles.summaryLabel}>Tip ({getStaffById(tip.staffId).name})</Text>
              <View style={styles.inlineRow}>
                <TouchableOpacity hitSlop={8} onPress={() => setTip(null)}>
                  <Ionicons name="close" size={14} color={colors.pink} />
                </TouchableOpacity>
                <Text style={styles.summaryValue}>+ {money(tip.amount)}</Text>
              </View>
            </View>
          )}
          {upfront && (
            <View style={styles.rowBetween}>
              <Text style={styles.summaryLabel}>Paid upfront</Text>
              <Text style={styles.summaryValue}>{money(upfront.amount)}</Text>
            </View>
          )}
          <View style={styles.rowBetween}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{money(orderTotal)}</Text>
          </View>
        </View>
        <View style={styles.actionBar}>
          <TouchableOpacity style={ui.greyBtn} activeOpacity={0.75} onPress={() => setStep(2)}>
            <Text style={ui.greyBtnText}>Back</Text>
          </TouchableOpacity>
          <View style={styles.actionRight}>
            <View ref={paymentMenuRef} collapsable={false}>
              <TouchableOpacity style={styles.kebab} activeOpacity={0.75} onPress={() => measureAnchor(paymentMenuRef.current, setPaymentMenuAnchor)}>
                <Ionicons name="ellipsis-vertical" size={18} color={colors.text} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={[ui.primaryBtn, { height: 40 }]} activeOpacity={0.85} onPress={saveAndLeave}>
              <Text style={[ui.primaryBtnText, { fontSize: 14 }]}>Save and Leave</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );

  const selectedAddService = catalog.find((s) => s.id === addServiceId);
  const tipStaff = getStaffById(tipStaffId);

  return (
    <View style={styles.container}>
      <CalendarPageHeader title={editing ? "Edit Appointment" : "Add Appointment"} />

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {renderStepBar()}

        {step === 1 && (
          <>
            {renderClientCard()}
            {renderServiceCard()}
            {renderFrequencyCard()}
            {renderNext()}
          </>
        )}

        {step === 2 && (
          <>
            {renderBasicInfo()}
            {scheduling ? (
              <>
                {renderServiceCard()}
                {renderFrequencyCard()}
                {renderNext()}
              </>
            ) : (
              renderReviewCard()
            )}
          </>
        )}

        {step === 3 && renderPaymentStep()}
      </ScrollView>

      {/* ----------------------------- Full screen scheduler ----------------------------- */}
      <Modal visible={fullscreen} animationType="slide" onRequestClose={() => setFullscreen(false)}>
        <View style={[styles.fullWrap, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 12 }]}>
          {renderScheduler(true)}
          <View style={styles.saveRow}>
            <TouchableOpacity
              style={styles.outlineBtn}
              activeOpacity={0.75}
              onPress={() => {
                setFullscreen(false);
                saveSchedule();
              }}
            >
              <Text style={styles.outlineBtnText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TeamFilterSheet
          visible={fullscreen && !!teamAnchor}
          anchor={teamAnchor}
          onClose={() => setTeamAnchor(null)}
          selectedIds={teamIds}
          onChange={setTeamIds}
        />
      </Modal>

      <TeamFilterSheet
        visible={!fullscreen && !!teamAnchor}
        anchor={teamAnchor}
        onClose={() => setTeamAnchor(null)}
        selectedIds={teamIds}
        onChange={setTeamIds}
      />

      {/* Service chip menu: Edit / Delete (1:30565) */}
      <PopoverMenu
        anchor={chipMenu?.anchor ?? null}
        onClose={() => setChipMenu(null)}
        align="left"
        width={150}
        items={[
          {
            key: "edit",
            label: "Edit",
            icon: "pencil-outline",
            iconColor: colors.teal,
            onPress: () => {
              if (!chipMenu) return;
              const src =
                chipMenu.kind === "catalog"
                  ? catalog.find((c) => c.id === chipMenu.id)
                  : items.find((l) => l.id === chipMenu.id);
              if (!src) return;
              setEditService({
                id: chipMenu.id,
                kind: chipMenu.kind,
                name: src.name,
                duration: String(src.duration),
                price: String(src.priceNum),
              });
            },
          },
          {
            key: "delete",
            label: "Delete",
            icon: "trash-outline",
            iconColor: colors.pink,
            onPress: () => {
              if (!chipMenu) return;
              if (chipMenu.kind === "catalog") setCatalog((prev) => prev.filter((c) => c.id !== chipMenu.id));
              else removeLine(chipMenu.id);
              if (activeChip === chipMenu.id) setActiveChip(null);
            },
          },
        ]}
      />

      {/* Review ⋮ (1:23564) */}
      <PopoverMenu
        anchor={reviewMenuAnchor}
        onClose={() => setReviewMenuAnchor(null)}
        width={230}
        items={[
          {
            key: "note",
            label: "Add a Note",
            icon: "document-text-outline",
            onPress: () => {
              setNoteDraft(note);
              setNoteOpen(true);
            },
          },
          {
            key: "upfront",
            label: "Request upfront payment",
            icon: "card-outline",
            onPress: () => {
              setUpfrontAmount(upfront ? String(upfront.amount) : "");
              setUpfrontMethod(upfront?.method ?? null);
              setUpfrontOpen(true);
            },
          },
        ]}
      />

      {/* Payment ⋮ (1:24367) */}
      <PopoverMenu
        anchor={paymentMenuAnchor}
        onClose={() => setPaymentMenuAnchor(null)}
        width={190}
        items={[
          {
            key: "tip",
            label: "Add a Tip",
            icon: "wallet-outline",
            onPress: () => {
              setTipStaffId(firstScheduled?.staffId ?? CURRENT_EMPLOYEE_ID);
              setTipOpen(true);
            },
          },
          {
            key: "discount",
            label: "Add a Discount",
            icon: "pricetag-outline",
            onPress: () => {
              setDiscountValue("");
              setDiscountOpen(true);
            },
          },
        ]}
      />

      {/* Add Service (1:26150) */}
      <FigmaModal
        visible={addServiceOpen}
        onClose={() => {
          setAddServiceOpen(false);
          setAddServiceListOpen(false);
        }}
        title="Add Service"
        minBodyHeight={200}
        footer={
          <TouchableOpacity style={ui.smallPrimaryBtn} activeOpacity={0.85} onPress={addServiceFromModal}>
            <Text style={ui.smallPrimaryBtnText}>Save</Text>
          </TouchableOpacity>
        }
      >
        <SelectField
          label="Service"
          required
          value={selectedAddService?.name}
          placeholder="Select service"
          onPress={() => setAddServiceListOpen(!addServiceListOpen)}
        />
        {addServiceListOpen && (
          <View style={styles.inlineList}>
            {catalog.map((s) => (
              <TouchableOpacity
                key={s.id}
                style={[styles.inlineOption, s.id === addServiceId && { backgroundColor: colors.primaryTint }]}
                onPress={() => {
                  setAddServiceId(s.id);
                  setAddServiceListOpen(false);
                }}
              >
                <Text style={[styles.inlineOptionText, s.id === addServiceId && { color: colors.primary }]}>{s.name}</Text>
                <Text style={styles.inlineOptionMeta}>
                  {s.durationText} • {s.price}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </FigmaModal>

      {/* Request upfront payment (1:23749) */}
      <FigmaModal
        visible={upfrontOpen}
        onClose={() => setUpfrontOpen(false)}
        title="Request upfront payment"
        footer={
          <TouchableOpacity style={ui.smallPrimaryBtn} activeOpacity={0.85} onPress={saveUpfront}>
            <Text style={ui.smallPrimaryBtnText}>Save</Text>
          </TouchableOpacity>
        }
      >
        <FieldLabel label="Amount" required />
        <TextInput
          style={ui.input}
          placeholder="Enter amount"
          placeholderTextColor={colors.text}
          keyboardType="decimal-pad"
          value={upfrontAmount}
          onChangeText={setUpfrontAmount}
        />
        <View style={{ height: 18 }} />
        <FieldLabel label="Payment Methods" required />
        {renderPaymentMethods(upfrontMethod, setUpfrontMethod, true)}
      </FigmaModal>

      {/* Send a Tip (1:24551 / 1:24773 / 1:25196) */}
      <FigmaModal
        visible={tipOpen}
        onClose={() => {
          setTipOpen(false);
          setTipStaffListOpen(false);
        }}
        title="Send a Tip"
        footer={
          <>
            {tipChoice === "custom" && customTipType === "Percentage" && (
              <View style={[ui.tealPill, { marginRight: "auto" }]}>
                <Text style={ui.tealPillText}>Total Tip: {money(Math.max(0, customTipAmount))}</Text>
              </View>
            )}
            <TouchableOpacity style={ui.smallPrimaryBtn} activeOpacity={0.85} onPress={saveTip}>
              <Text style={ui.smallPrimaryBtnText}>Save</Text>
            </TouchableOpacity>
          </>
        }
      >
        <SelectField label="Employee" required value={tipStaff.name} onPress={() => setTipStaffListOpen(!tipStaffListOpen)} />
        {tipStaffListOpen && (
          <View style={styles.inlineList}>
            {staffList.map((s) => (
              <TouchableOpacity
                key={s.id}
                style={[styles.inlineOption, styles.inlineRow, s.id === tipStaffId && { backgroundColor: colors.primaryTint }]}
                onPress={() => {
                  setTipStaffId(s.id);
                  setTipStaffListOpen(false);
                }}
              >
                <SquareAvatar uri={s.avatar} name={s.name} size={28} bg={s.bgColor} rounded={6} />
                <Text style={[styles.inlineOptionText, s.id === tipStaffId && { color: colors.primary }]}>{s.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        <View style={{ height: 18 }} />
        <FieldLabel label="Amount" required />
        <View style={styles.tipGrid}>
          <TipTile label="No Tip" active={tipChoice === "none"} onPress={() => setTipChoice("none")} />
          {TIP_PERCENTS.map((p) => (
            <TipTile
              key={p}
              label={`${p}%`}
              sub={money(Math.round(totalPrice * p) / 100)}
              active={tipChoice === p}
              onPress={() => setTipChoice(p)}
            />
          ))}
          <TipTile label="Custom Tip" active={tipChoice === "custom"} onPress={() => setTipChoice("custom")} />
        </View>
        {tipChoice === "custom" && (
          <View style={styles.twoFields}>
            <SelectField
              style={{ flex: 1 }}
              label="Type"
              required
              value={customTipType}
              onPress={() => setCustomTipTypeOpen(true)}
            />
            <View style={{ flex: 1 }}>
              <FieldLabel label={customTipType === "Percentage" ? "Amount (%)" : "Amount €"} required />
              <TextInput
                style={ui.input}
                placeholder={customTipType === "Percentage" ? "Enter percentage" : "Enter value"}
                placeholderTextColor={colors.text}
                keyboardType="decimal-pad"
                value={customTipValue}
                onChangeText={setCustomTipValue}
              />
            </View>
          </View>
        )}
        <OptionPicker
          visible={customTipTypeOpen}
          title="Type"
          options={["Percentage", "Specific value"]}
          value={customTipType}
          onSelect={(v) => setCustomTipType(v as "Percentage" | "Specific value")}
          onClose={() => setCustomTipTypeOpen(false)}
        />
      </FigmaModal>

      {/* Add Cart Discount (1:25001) */}
      <FigmaModal
        visible={discountOpen}
        onClose={() => setDiscountOpen(false)}
        title="Add Cart Discount"
        subtitle="Taxes will be recalculated after the discount has been applied."
        footer={
          <>
            <View style={[ui.tealPill, { marginRight: "auto" }]}>
              <Text style={ui.tealPillText}>Total After Discount: {money(Math.max(0, totalAfterDiscountDraft))}</Text>
            </View>
            <TouchableOpacity style={ui.smallPrimaryBtn} activeOpacity={0.85} onPress={saveDiscount}>
              <Text style={ui.smallPrimaryBtnText}>Add Discount</Text>
            </TouchableOpacity>
          </>
        }
      >
        <View style={[styles.twoFields, { marginTop: 0 }]}>
          <SelectField style={{ flex: 1 }} label="Type" required value={discountType} onPress={() => setDiscountTypeOpen(true)} />
          <View style={{ flex: 1 }}>
            <FieldLabel label={discountType === "Percentage" ? "Amount (%)" : "Amount €"} required />
            <TextInput
              style={ui.input}
              placeholder={discountType === "Percentage" ? "Enter percentage" : "Enter value"}
              placeholderTextColor={colors.text}
              keyboardType="decimal-pad"
              value={discountValue}
              onChangeText={setDiscountValue}
            />
          </View>
        </View>
        <OptionPicker
          visible={discountTypeOpen}
          title="Type"
          options={["Percentage", "Specific value"]}
          value={discountType}
          onSelect={(v) => setDiscountType(v as "Percentage" | "Specific value")}
          onClose={() => setDiscountTypeOpen(false)}
        />
      </FigmaModal>

      {/* Add a Note */}
      <FigmaModal
        visible={noteOpen}
        onClose={() => setNoteOpen(false)}
        title="Add a Note"
        footer={
          <TouchableOpacity
            style={ui.smallPrimaryBtn}
            activeOpacity={0.85}
            onPress={() => {
              setNote(noteDraft.trim());
              setNoteOpen(false);
            }}
          >
            <Text style={ui.smallPrimaryBtnText}>Save</Text>
          </TouchableOpacity>
        }
      >
        <FieldLabel label="Note" />
        <TextInput
          style={[ui.input, { height: 120, paddingTop: 10, textAlignVertical: "top" }]}
          placeholder="Write a note"
          placeholderTextColor={colors.textMuted}
          multiline
          value={noteDraft}
          onChangeText={setNoteDraft}
        />
      </FigmaModal>

      {/* Edit service (chip menu → Edit) */}
      <FigmaModal
        visible={!!editService}
        onClose={() => setEditService(null)}
        title="Edit Service"
        footer={
          <TouchableOpacity style={ui.smallPrimaryBtn} activeOpacity={0.85} onPress={saveEditService}>
            <Text style={ui.smallPrimaryBtnText}>Save</Text>
          </TouchableOpacity>
        }
      >
        <FieldLabel label="Service" required />
        <TextInput
          style={ui.input}
          value={editService?.name ?? ""}
          onChangeText={(t) => setEditService((p) => (p ? { ...p, name: t } : p))}
        />
        <View style={styles.twoFields}>
          <View style={{ flex: 1 }}>
            <FieldLabel label="Duration (min)" required />
            <TextInput
              style={ui.input}
              keyboardType="number-pad"
              value={editService?.duration ?? ""}
              onChangeText={(t) => setEditService((p) => (p ? { ...p, duration: t } : p))}
            />
          </View>
          <View style={{ flex: 1 }}>
            <FieldLabel label="Price €" required />
            <TextInput
              style={ui.input}
              keyboardType="decimal-pad"
              value={editService?.price ?? ""}
              onChangeText={(t) => setEditService((p) => (p ? { ...p, price: t } : p))}
            />
          </View>
        </View>
      </FigmaModal>

      {/* Add New Client */}
      <FigmaModal
        visible={newClientOpen}
        onClose={() => setNewClientOpen(false)}
        title="Add New Client"
        footer={
          <TouchableOpacity style={ui.smallPrimaryBtn} activeOpacity={0.85} onPress={createClient}>
            <Text style={ui.smallPrimaryBtnText}>Save</Text>
          </TouchableOpacity>
        }
      >
        <FieldLabel label="Full Name" required />
        <TextInput
          style={ui.input}
          placeholder="Enter full name"
          placeholderTextColor={colors.textMuted}
          value={newClient.name}
          onChangeText={(t) => setNewClient((p) => ({ ...p, name: t }))}
        />
        <View style={{ height: 14 }} />
        <FieldLabel label="Phone Number" />
        <TextInput
          style={ui.input}
          placeholder="+39 345 678 9123"
          placeholderTextColor={colors.textMuted}
          keyboardType="phone-pad"
          value={newClient.phone}
          onChangeText={(t) => setNewClient((p) => ({ ...p, phone: t }))}
        />
        <View style={{ height: 14 }} />
        <FieldLabel label="Email" />
        <TextInput
          style={ui.input}
          placeholder="client@email.com"
          placeholderTextColor={colors.textMuted}
          keyboardType="email-address"
          autoCapitalize="none"
          value={newClient.email}
          onChangeText={(t) => setNewClient((p) => ({ ...p, email: t }))}
        />
      </FigmaModal>

      <OptionPicker
        visible={statusOpen}
        title="Status"
        options={APPOINTMENT_STATUSES}
        value={status}
        onSelect={(v) => setStatus(v as AppStatus)}
        onClose={() => setStatusOpen(false)}
      />

      <OptionPicker
        visible={frequencyOpen}
        title="Frequency"
        options={frequencyOptions}
        value={frequency}
        onSelect={setFrequency}
        onClose={() => setFrequencyOpen(false)}
      />

      <OptionPicker
        visible={!!staffPickFor}
        title="Employee"
        options={staffList.map((s) => s.name)}
        value={staffPickFor ? getStaffById(items.find((l) => l.id === staffPickFor)?.staffId ?? undefined).name : undefined}
        renderLeft={(name) => {
          const s = staffList.find((x) => x.name === name)!;
          return <SquareAvatar uri={s.avatar} name={s.name} size={28} bg={s.bgColor} rounded={6} />;
        }}
        onSelect={(name) => {
          const s = staffList.find((x) => x.name === name);
          if (s && staffPickFor) setItems((prev) => prev.map((l) => (l.id === staffPickFor ? { ...l, staffId: s.id } : l)));
        }}
        onClose={() => setStaffPickFor(null)}
      />
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*                                 Sub-parts                                  */
/* -------------------------------------------------------------------------- */

function ChipKebab({ onOpen }: { onOpen: (a: Anchor) => void }) {
  const ref = useRef<View>(null);
  return (
    <View ref={ref} collapsable={false}>
      <TouchableOpacity
        hitSlop={10}
        onPress={() =>
          ref.current?.measureInWindow((x, y, width, height) => onOpen({ x, y, width, height }))
        }
      >
        <Ionicons name="ellipsis-vertical" size={16} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
}

function TipTile({ label, sub, active, onPress }: { label: string; sub?: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity style={[styles.tipTile, active && styles.tipTileActive]} activeOpacity={0.75} onPress={onPress}>
      <Text style={[styles.tipLabel, !sub && { fontSize: label.length > 7 ? 15 : 18 }]} numberOfLines={1}>
        {label}
      </Text>
      {sub ? <Text style={styles.tipSub}>{sub}</Text> : null}
    </TouchableOpacity>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   Styles                                   */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  scroll: {
    padding: 16,
    gap: 16,
  },
  muted: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  inlineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  link: {
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.primary,
  },

  // Step bar
  stepCard: {
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  stepRow: {
    gap: 8,
  },
  stepTab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: radius.md,
  },
  stepTabActive: {
    backgroundColor: colors.primarySoft,
  },
  stepIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.subtleAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  stepIconActive: {
    backgroundColor: colors.primary,
  },
  stepText: {
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.text,
  },
  stepTextActive: {
    color: colors.primary,
  },

  // Client
  clientActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  bigTile: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 20,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    gap: 12,
    ...shadows.card,
  },
  tileActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryTint,
  },
  tileIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  tileLabel: {
    fontFamily: fonts.semibold,
    fontSize: 16,
    color: colors.text,
    textAlign: "center",
  },
  subTitle: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.text,
    marginTop: 18,
    marginBottom: 12,
  },
  clientTile: {
    width: 150,
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 10,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    gap: 4,
  },
  clientName: {
    fontFamily: fonts.semibold,
    fontSize: 15,
    color: colors.text,
    marginTop: 8,
  },
  clientSub: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
  },

  // Scheduler
  panel: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    overflow: "hidden",
    marginBottom: 12,
  },
  panelHead: {
    backgroundColor: colors.primaryTint,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  panelTitle: {
    fontFamily: fonts.semibold,
    fontSize: 16,
    color: colors.text,
  },
  panelSub: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  panelBody: {
    padding: 12,
  },
  panelHint: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 8,
  },
  chip: {
    width: 170,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderRadius: radius.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    paddingVertical: 8,
    paddingLeft: 10,
    paddingRight: 8,
    borderWidth: 1,
    borderColor: colors.primarySoft,
  },
  chipActive: {
    borderColor: colors.primary,
  },
  chipTitle: {
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.primary,
  },
  chipMeta: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.primary,
    marginTop: 2,
  },
  gridFrame: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    overflow: "hidden",
    backgroundColor: colors.white,
  },
  gridHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primaryTint,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  staffHeadCell: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
    paddingHorizontal: 4,
  },
  staffHeadName: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.text,
  },
  weekHead: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.text,
  },
  hourRow: {
    position: "absolute",
    left: 0,
    right: 0,
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  timeCell: {
    alignItems: "flex-end",
    paddingRight: 6,
    paddingTop: 8,
  },
  timeText: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
  },
  colCell: {
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
  },
  slotCell: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  block: {
    position: "absolute",
    backgroundColor: colors.primarySoft,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    borderRadius: radius.sm + 2,
    paddingHorizontal: 6,
    justifyContent: "center",
    overflow: "hidden",
  },
  blockTitle: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.primary,
  },
  blockMeta: {
    fontFamily: fonts.regular,
    fontSize: 10,
    color: colors.primary,
  },
  monthCell: {
    flex: 1,
    height: 72,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    padding: 4,
    gap: 2,
  },
  monthNum: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.text,
    textAlign: "right",
  },
  monthLabel: {
    backgroundColor: colors.primarySoft,
    borderLeftWidth: 2,
    borderLeftColor: colors.primary,
    borderRadius: 3,
    paddingHorizontal: 2,
  },
  monthLabelText: {
    fontFamily: fonts.regular,
    fontSize: 9,
    color: colors.primary,
  },
  saveRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 16,
  },
  outlineBtn: {
    height: 36,
    paddingHorizontal: 16,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
  },
  outlineBtnText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.primary,
  },
  fullWrap: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
  },

  // Services list
  cardPrice: {
    fontFamily: fonts.semibold,
    fontSize: 15,
    color: colors.primary,
  },
  employeePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.borderLight,
    borderRadius: radius.md,
    paddingVertical: 6,
    paddingLeft: 6,
    paddingRight: 10,
  },
  employeeName: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.text,
  },
  rowActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 18,
  },
  tableFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
    gap: 12,
  },
  totalTime: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  totalTimeLabel: {
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.text,
  },
  totalBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    paddingHorizontal: 18,
    paddingVertical: 18,
    marginTop: 24,
  },
  totalLabel: {
    fontFamily: fonts.semibold,
    fontSize: 16,
    color: colors.text,
  },
  totalValue: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.text,
  },
  summaryLabel: {
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.text,
  },
  summaryValue: {
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.text,
  },
  nextRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  actionBar: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    rowGap: 10,
    columnGap: 8,
    marginTop: 20,
  },
  actionRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginLeft: "auto",
  },
  kebab: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.subtleAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  upfrontRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 12,
    backgroundColor: colors.primaryTint,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  upfrontText: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.primary,
  },

  // Review info
  code: {
    fontFamily: fonts.semibold,
    fontSize: 18,
    color: colors.text,
  },
  smallLabel: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 6,
  },
  clientRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.subtleAlt,
    borderRadius: radius.md,
    padding: 12,
  },
  clientRowName: {
    fontFamily: fonts.semibold,
    fontSize: 16,
    color: colors.text,
  },
  clientRowEmail: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 16,
    marginTop: 18,
  },
  infoCol: {
    width: "50%",
    paddingRight: 8,
  },
  infoValue: {
    fontFamily: fonts.semibold,
    fontSize: 15,
    color: colors.text,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    backgroundColor: colors.primarySoft,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statusPillText: {
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.primary,
  },
  repeatBtn: {
    alignSelf: "flex-start",
    backgroundColor: colors.subtleAlt,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 8,
    maxWidth: "100%",
  },
  repeatBtnText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.textDark,
  },
  noteEdit: {
    width: 44,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.borderLight,
    alignItems: "center",
    justifyContent: "center",
  },
  noteText: {
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.text,
    marginTop: 18,
  },

  // Payment
  methodGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  methodTile: {
    width: "47%",
    flexGrow: 1,
    alignItems: "center",
    paddingVertical: 22,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    gap: 12,
    ...shadows.card,
  },

  // Modals
  inlineList: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    marginTop: 4,
    overflow: "hidden",
  },
  inlineOption: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  inlineOptionText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.text,
  },
  inlineOptionMeta: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  tipGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  tipTile: {
    width: "31%",
    height: 76,
    borderRadius: radius.md,
    backgroundColor: colors.subtleAlt,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.subtleAlt,
  },
  tipTileActive: {
    backgroundColor: colors.primaryTint,
    borderColor: colors.primary,
  },
  tipLabel: {
    fontFamily: fonts.semibold,
    fontSize: 20,
    color: colors.text,
  },
  tipSub: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  twoFields: {
    flexDirection: "row",
    gap: 12,
    marginTop: 18,
  },
});
