import { useSyncExternalStore } from "react";
import {
  AppStatus,
  BookingStep,
  CalAppointment,
  ClientItem,
  ServiceItem,
  StaffMember,
} from "./types";

/* -------------------------------------------------------------------------- */
/*                                   Team                                     */
/* -------------------------------------------------------------------------- */

/** The logged-in employee. The calendar tab shows this member's schedule by default. */
export const CURRENT_EMPLOYEE_ID = "st-me";

export const staffList: StaffMember[] = [
  {
    id: CURRENT_EMPLOYEE_ID,
    name: "Maria Rodriguez",
    role: "Senior Stylist",
    phone: "+39 345 678 9123",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80",
    color: "#635BFF",
    bgColor: "#EEF2FF",
  },
  {
    id: "st2",
    name: "Angelica Moretti",
    role: "Hair Washer",
    phone: "+39 333 124 5567",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
    color: "#0D9488",
    bgColor: "#E6FFFE",
  },
  {
    id: "st3",
    name: "Hasan Siam",
    role: "Color Specialist",
    phone: "+39 347 890 1234",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80",
    color: "#D97706",
    bgColor: "#FFFBEA",
  },
  {
    id: "st4",
    name: "Courtney Henry",
    role: "Senior Esthetician",
    phone: "+39 340 222 7788",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
    color: "#16A34A",
    bgColor: "#EDFBF3",
  },
  {
    id: "st5",
    name: "Robert Fox",
    role: "Barber & Stylist",
    phone: "+39 348 654 3210",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
    color: "#E11D48",
    bgColor: "#FFF0F3",
  },
  {
    id: "st6",
    name: "Lois Gregory",
    role: "Makeup Artist",
    phone: "+39 331 908 7766",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
    color: "#7C3AED",
    bgColor: "#F5F3FF",
  },
];

export const currentEmployee = staffList[0];

export function getStaffById(id?: string): StaffMember {
  return staffList.find((s) => s.id === id) || currentEmployee;
}

/* -------------------------------------------------------------------------- */
/*                              Services & Clients                            */
/* -------------------------------------------------------------------------- */

export const availableServices: ServiceItem[] = [
  { id: "srv-1", name: "Haircut", duration: 40, durationText: "40 min", price: "€ 170", priceNum: 170 },
  { id: "srv-2", name: "Makeup", duration: 40, durationText: "40 min", price: "€ 170", priceNum: 170 },
  { id: "srv-3", name: "Haircut & Blowdry", duration: 60, durationText: "60 min", price: "€ 50", priceNum: 50 },
  { id: "srv-4", name: "Hair Coloring", duration: 90, durationText: "90 min", price: "€ 80", priceNum: 80 },
  { id: "srv-5", name: "Blowdry & Styling", duration: 30, durationText: "30 min", price: "€ 25", priceNum: 25 },
  { id: "srv-6", name: "Full Highlights", duration: 105, durationText: "105 min", price: "€ 120", priceNum: 120 },
  { id: "srv-7", name: "Signature Glow Facial", duration: 45, durationText: "45 min", price: "€ 120", priceNum: 120 },
  { id: "srv-8", name: "Beard Trim", duration: 30, durationText: "30 min", price: "€ 35", priceNum: 35 },
];

export const clientList: ClientItem[] = [
  {
    id: "c1",
    name: "Maria Fernandez",
    phone: "+39 345 678 9123",
    email: "maria@gmail.com",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80",
    notes: "Prefers organic coloring products.",
  },
  {
    id: "c2",
    name: "Virgie Sutton",
    phone: "+39 345 678 9123",
    email: "virgie.s@gmail.com",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
  },
  {
    id: "c3",
    name: "Sofia Rossi",
    phone: "+39 345 678 9123",
    email: "sofia@beauty.com",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
    notes: "Promised 10% discount on next haircut. Prefers no heat styling.",
  },
  {
    id: "c4",
    name: "Marco Bellini",
    phone: "+39 333 456 7890",
    email: "marco.b@gmail.com",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
    notes: "Beard trim every 2 weeks.",
  },
  {
    id: "c5",
    name: "Elena Vasquez",
    phone: "+34 655 789 012",
    email: "elena.v@outlook.com",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80",
  },
  {
    id: "c6",
    name: "Luca Ferrara",
    phone: "+39 347 890 1234",
    email: "luca.f@yahoo.it",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
  },
];

/* -------------------------------------------------------------------------- */
/*                                Date helpers                                */
/* -------------------------------------------------------------------------- */

const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_LONG = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
export const WEEKDAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const WEEKDAYS_LONG = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const pad = (n: number) => String(n).padStart(2, "0");

/** Local "YYYY-MM-DD" for a Date. */
export function toISODate(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Parses "YYYY-MM-DD" as a local date (no timezone shift). */
export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split("-").map((p) => parseInt(p, 10));
  return new Date(y, (m || 1) - 1, d || 1);
}

export function addDays(d: Date, days: number): Date {
  const next = new Date(d);
  next.setDate(next.getDate() + days);
  return next;
}

export function addMonths(d: Date, months: number): Date {
  return new Date(d.getFullYear(), d.getMonth() + months, 1);
}

/** Sunday-based week start (matches the Figma week / month grids). */
export function startOfWeek(d: Date): Date {
  return addDays(new Date(d.getFullYear(), d.getMonth(), d.getDate()), -d.getDay());
}

export function isSameDay(a: Date, b: Date): boolean {
  return toISODate(a) === toISODate(b);
}

export function todayISO(): string {
  return toISODate(new Date());
}

/** "Tuesday Aug 05" */
export function formatDayLabel(d: Date): string {
  return `${WEEKDAYS_LONG[d.getDay()]} ${MONTHS_SHORT[d.getMonth()]} ${pad(d.getDate())}`;
}

/** "September 01 – September 07" */
export function formatWeekLabel(d: Date): string {
  const s = startOfWeek(d);
  const e = addDays(s, 6);
  return `${MONTHS_LONG[s.getMonth()]} ${pad(s.getDate())} – ${MONTHS_LONG[e.getMonth()]} ${pad(e.getDate())}`;
}

/** "October" (year appended outside the current year) */
export function formatMonthLabel(d: Date): string {
  // Figma 1:21876 shows just "October"; add the year only outside the current year.
  return d.getFullYear() === new Date().getFullYear() ? MONTHS_LONG[d.getMonth()] : `${MONTHS_LONG[d.getMonth()]} ${d.getFullYear()}`;
}

/** "5 Aug 2025" */
export function formatShortDate(iso: string): string {
  const d = parseISODate(iso);
  return `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`;
}

/** "02/08/2025" (DD/MM/YYYY like the Figma) */
export function formatNumericDate(iso: string): string {
  const d = parseISODate(iso);
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

/** Builds the 6x7 month matrix (Sunday first) that contains `d`. */
export function getMonthMatrix(d: Date): Date[][] {
  const first = new Date(d.getFullYear(), d.getMonth(), 1);
  const start = startOfWeek(first);
  const rows: Date[][] = [];
  for (let r = 0; r < 6; r++) {
    const row: Date[] = [];
    for (let c = 0; c < 7; c++) row.push(addDays(start, r * 7 + c));
    rows.push(row);
  }
  return rows;
}

/* -------------------------------------------------------------------------- */
/*                                Time helpers                                */
/* -------------------------------------------------------------------------- */

export function timeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const isPM = /pm/i.test(timeStr);
  const isAM = /am/i.test(timeStr);
  const clean = timeStr.replace(/[a-zA-Z]/g, "").trim();
  const parts = clean.split(":");
  let hours = parseInt(parts[0], 10) || 0;
  const minutes = parseInt(parts[1], 10) || 0;
  if (isPM && hours < 12) hours += 12;
  if (isAM && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

export function minutesToTime(totalMin: number): string {
  const clamped = Math.max(0, Math.min(24 * 60 - 1, totalMin));
  const hours = Math.floor(clamped / 60);
  const minutes = clamped % 60;
  return `${pad(hours)}:${pad(minutes)}`;
}

/** "13:05" -> "1:05 PM" */
export function to12h(time24: string): string {
  const total = timeToMinutes(time24);
  const h = Math.floor(total / 60);
  const m = total % 60;
  const ampm = h >= 12 ? "PM" : "AM";
  const displayHour = h % 12 === 0 ? 12 : h % 12;
  return `${displayHour}:${pad(m)} ${ampm}`;
}

export function formatTimeSlot(hour: number): string {
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:00 ${ampm}`;
}

/** "5 Aug 2025 (12:00 AM - 12:15 AM)" */
export function formatScheduledDate(appt: CalAppointment): string {
  return `${formatShortDate(appt.date)} (${to12h(appt.startTime)} - ${to12h(appt.endTime)})`;
}

/* -------------------------------------------------------------------------- */
/*                          Layout & status theming                           */
/* -------------------------------------------------------------------------- */

export const START_HOUR = 0;
export const END_HOUR = 23;
export const HOUR_HEIGHT = 80;
export const COLUMN_WIDTH = 150;
export const TIME_COLUMN_WIDTH = 64;
/** Hour the day/week grids scroll to on open. */
export const INITIAL_SCROLL_HOUR = 8;

export const APPOINTMENT_STATUSES: AppStatus[] = [
  "Booked",
  "Confirmed",
  "Arrived",
  "Started",
  "Completed",
  "Canceled",
];

export const statusTheme: Record<
  AppStatus,
  { bg: string; border: string; text: string; badgeBg: string; badgeText: string }
> = {
  // Figma status colours (calendar labels + table badges).
  Booked: { bg: "#DDDBFF", border: "#635BFF", text: "#635BFF", badgeBg: "#DDDBFF", badgeText: "#635BFF" },
  Confirmed: { bg: "#ECFDFD", border: "#16CDC7", text: "#16CDC7", badgeBg: "#ECFDFD", badgeText: "#16CDC7" },
  Arrived: { bg: "#FFF9E5", border: "#FFD648", text: "#FFD648", badgeBg: "#FFF9E5", badgeText: "#FFD648" },
  Started: { bg: "#F6F7F9", border: "#98A4AE", text: "#0A2540", badgeBg: "#F6F7F9", badgeText: "#0A2540" },
  Completed: { bg: "#EAFAF0", border: "#36C76C", text: "#36C76C", badgeBg: "#EAFAF0", badgeText: "#36C76C" },
  Canceled: { bg: "#FFE5ED", border: "#FF6692", text: "#FF6692", badgeBg: "#FFE5ED", badgeText: "#FF6692" },
};

/** Booking Order step colours (Figma table expanded rows). `circle` = step number dot. */
export const bookingStepTheme: Record<BookingStep["status"], { bg: string; text: string; circle: string; circleText: string }> = {
  Completed: { bg: "#EAFAF0", text: "#36C76C", circle: "#36C76C", circleText: "#FFFFFF" },
  Doing: { bg: "#DDDBFF", text: "#635BFF", circle: "#DDDBFF", circleText: "#635BFF" },
  "To Do": { bg: "#EFF4FA", text: "#29343D", circle: "#8D98A2", circleText: "#FFFFFF" },
  Overdue: { bg: "#FFF9E5", text: "#FFD648", circle: "#FFF9E5", circleText: "#FFD648" },
  Cancelled: { bg: "#FFE5ED", text: "#FF6692", circle: "#FF6692", circleText: "#FFFFFF" },
};

/* -------------------------------------------------------------------------- */
/*                              Mock appointments                             */
/* -------------------------------------------------------------------------- */

interface Seed {
  dayOffset: number;
  staffId: string;
  clientId: string;
  serviceId: string;
  start: string;
  status: AppStatus;
  paymentStatus: CalAppointment["paymentStatus"];
  notes?: string;
  repeating?: boolean;
}

// Offsets are relative to "today" so the calendar always has data around the current date.
const seeds: Seed[] = [
  { dayOffset: 0, staffId: CURRENT_EMPLOYEE_ID, clientId: "c1", serviceId: "srv-1", start: "09:00", status: "Confirmed", paymentStatus: "Paid", notes: "Light layering on sides." },
  { dayOffset: 0, staffId: CURRENT_EMPLOYEE_ID, clientId: "c3", serviceId: "srv-4", start: "10:30", status: "Started", paymentStatus: "Partially Paid", notes: "Balayage touch-up with ash blonde toner." },
  { dayOffset: 0, staffId: CURRENT_EMPLOYEE_ID, clientId: "c5", serviceId: "srv-5", start: "13:00", status: "Booked", paymentStatus: "Unpaid" },
  { dayOffset: 0, staffId: CURRENT_EMPLOYEE_ID, clientId: "c4", serviceId: "srv-3", start: "15:00", status: "Arrived", paymentStatus: "Unpaid", repeating: true },
  { dayOffset: 0, staffId: "st2", clientId: "c2", serviceId: "srv-2", start: "09:30", status: "Confirmed", paymentStatus: "Paid" },
  { dayOffset: 0, staffId: "st3", clientId: "c6", serviceId: "srv-6", start: "11:00", status: "Booked", paymentStatus: "Unpaid" },
  { dayOffset: 0, staffId: "st4", clientId: "c1", serviceId: "srv-7", start: "14:00", status: "Completed", paymentStatus: "Paid" },
  { dayOffset: 0, staffId: "st5", clientId: "c4", serviceId: "srv-8", start: "16:30", status: "Confirmed", paymentStatus: "Unpaid" },
  { dayOffset: 1, staffId: CURRENT_EMPLOYEE_ID, clientId: "c2", serviceId: "srv-2", start: "10:00", status: "Booked", paymentStatus: "Unpaid" },
  { dayOffset: 1, staffId: CURRENT_EMPLOYEE_ID, clientId: "c6", serviceId: "srv-1", start: "14:15", status: "Confirmed", paymentStatus: "Paid" },
  { dayOffset: 1, staffId: "st2", clientId: "c3", serviceId: "srv-5", start: "11:00", status: "Booked", paymentStatus: "Unpaid" },
  { dayOffset: 2, staffId: CURRENT_EMPLOYEE_ID, clientId: "c4", serviceId: "srv-6", start: "09:00", status: "Booked", paymentStatus: "Unpaid" },
  { dayOffset: 2, staffId: "st3", clientId: "c5", serviceId: "srv-4", start: "12:00", status: "Confirmed", paymentStatus: "Paid" },
  { dayOffset: 3, staffId: CURRENT_EMPLOYEE_ID, clientId: "c1", serviceId: "srv-3", start: "11:30", status: "Confirmed", paymentStatus: "Paid", repeating: true },
  { dayOffset: 4, staffId: CURRENT_EMPLOYEE_ID, clientId: "c5", serviceId: "srv-7", start: "16:00", status: "Booked", paymentStatus: "Unpaid" },
  { dayOffset: 6, staffId: CURRENT_EMPLOYEE_ID, clientId: "c3", serviceId: "srv-1", start: "10:00", status: "Booked", paymentStatus: "Unpaid" },
  { dayOffset: 9, staffId: CURRENT_EMPLOYEE_ID, clientId: "c2", serviceId: "srv-4", start: "13:30", status: "Booked", paymentStatus: "Unpaid" },
  { dayOffset: 12, staffId: CURRENT_EMPLOYEE_ID, clientId: "c6", serviceId: "srv-8", start: "09:30", status: "Booked", paymentStatus: "Unpaid" },
  { dayOffset: -1, staffId: CURRENT_EMPLOYEE_ID, clientId: "c4", serviceId: "srv-1", start: "10:00", status: "Completed", paymentStatus: "Paid" },
  { dayOffset: -1, staffId: CURRENT_EMPLOYEE_ID, clientId: "c2", serviceId: "srv-5", start: "15:30", status: "Canceled", paymentStatus: "Unpaid", notes: "Client cancelled by phone." },
  { dayOffset: -2, staffId: CURRENT_EMPLOYEE_ID, clientId: "c5", serviceId: "srv-3", start: "12:00", status: "Completed", paymentStatus: "Paid" },
  { dayOffset: -3, staffId: "st2", clientId: "c1", serviceId: "srv-2", start: "09:00", status: "Completed", paymentStatus: "Paid" },
  { dayOffset: -5, staffId: CURRENT_EMPLOYEE_ID, clientId: "c3", serviceId: "srv-6", start: "11:00", status: "Completed", paymentStatus: "Paid" },
  { dayOffset: -8, staffId: CURRENT_EMPLOYEE_ID, clientId: "c6", serviceId: "srv-1", start: "14:00", status: "Canceled", paymentStatus: "Unpaid" },
];

export function buildBookingOrder(start: string, service: string, staffName: string, status: AppStatus): BookingStep[] {
  const s = timeToMinutes(start);
  const stepStatus = (idx: number): BookingStep["status"] => {
    if (status === "Completed") return "Completed";
    if (status === "Canceled") return "Cancelled";
    if (status === "Started") return idx === 0 ? "Doing" : "To Do";
    if (status === "Arrived") return idx === 0 ? "Overdue" : "To Do";
    return "To Do";
  };

  return [
    { id: "b1", order: 1, time: `${minutesToTime(s)}-${minutesToTime(s + 5)}`, service: "Shampoo", staffName: "Angelica", status: stepStatus(0) },
    { id: "b2", order: 2, time: `${minutesToTime(s + 5)}-${minutesToTime(s + 35)}`, service, staffName: staffName.split(" ")[0], status: stepStatus(1) },
    { id: "b3", order: 3, time: `${minutesToTime(s + 35)}-${minutesToTime(s + 40)}`, service: "Styling", staffName: "Angelica", status: stepStatus(2) },
  ];
}

function buildInitialAppointments(): CalAppointment[] {
  const today = new Date();
  return seeds.map((seed, idx) => {
    const client = clientList.find((c) => c.id === seed.clientId) || clientList[0];
    const service = availableServices.find((s) => s.id === seed.serviceId) || availableServices[0];
    const staff = getStaffById(seed.staffId);
    const startMin = timeToMinutes(seed.start);
    return {
      id: `apt-${idx + 1}`,
      code: `#${String(idx + 1).padStart(3, "0")}`,
      staffId: seed.staffId,
      clientId: client.id,
      clientName: client.name,
      clientAvatar: client.avatar,
      clientPhone: client.phone,
      clientEmail: client.email,
      service: service.name,
      startTime: seed.start,
      endTime: minutesToTime(startMin + service.duration),
      duration: service.durationText,
      price: service.price,
      priceNum: service.priceNum,
      status: seed.status,
      paymentStatus: seed.paymentStatus,
      repeating: seed.repeating ?? false,
      notes: seed.notes ?? "",
      date: toISODate(addDays(today, seed.dayOffset)),
      bookingOrder: buildBookingOrder(seed.start, service.name, staff.name, seed.status),
    };
  });
}

export const initialAppointments: CalAppointment[] = buildInitialAppointments();

/* -------------------------------------------------------------------------- */
/*                        Global in-memory reactive store                     */
/* -------------------------------------------------------------------------- */

let globalAppointments: CalAppointment[] = [...initialAppointments];
let appointmentListeners: (() => void)[] = [];

function emit() {
  appointmentListeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  appointmentListeners.push(listener);
  return () => {
    appointmentListeners = appointmentListeners.filter((l) => l !== listener);
  };
}

/** Reactive hook over the shared in-memory appointment store. */
export function useAppointmentsStore(): [
  CalAppointment[],
  (action: CalAppointment[] | ((prev: CalAppointment[]) => CalAppointment[])) => void,
] {
  const appointments = useSyncExternalStore(subscribe, getAppointmentsStore, getAppointmentsStore);

  const setAppointments = (
    action: CalAppointment[] | ((prev: CalAppointment[]) => CalAppointment[])
  ) => {
    globalAppointments = typeof action === "function" ? action(globalAppointments) : action;
    emit();
  };

  return [appointments, setAppointments];
}

let idCounter = 0;
/** Unique id generator for mock records (keeps Date.now() out of component bodies). */
export function uid(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${Date.now().toString(36)}-${idCounter}`;
}

export function getAppointmentsStore(): CalAppointment[] {
  return globalAppointments;
}

/** Always returns an appointment (falls back to the first mock) so detail screens render for any id. */
export function getAppointmentById(id?: string | null): CalAppointment {
  return (
    globalAppointments.find((a) => a.id === id) ||
    initialAppointments.find((a) => a.id === id) ||
    globalAppointments[0] ||
    initialAppointments[0]
  );
}

export function updateAppointmentInStore(updated: CalAppointment) {
  globalAppointments = globalAppointments.map((a) => (a.id === updated.id ? updated : a));
  emit();
}

export function addAppointmentToStore(newAppt: CalAppointment) {
  globalAppointments = [newAppt, ...globalAppointments];
  emit();
}

export function deleteAppointmentFromStore(id: string) {
  globalAppointments = globalAppointments.filter((a) => a.id !== id);
  emit();
}

export function nextAppointmentCode(): string {
  return `#${String(globalAppointments.length + 1).padStart(3, "0")}`;
}

/** Route helper for the view-appointment screen (built by another feature). */
export function appointmentRoute(id: string): string {
  return `/(drawer)/(tabs)/calendar/appointment/${id}`;
}
