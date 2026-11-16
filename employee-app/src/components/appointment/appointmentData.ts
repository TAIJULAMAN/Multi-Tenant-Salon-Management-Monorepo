import { useSyncExternalStore } from "react";
import {
  CURRENT_EMPLOYEE_ID as CALENDAR_EMPLOYEE_ID,
  getAppointmentsStore,
  getStaffById,
} from "@/components/calendar/data";
import type { CalAppointment } from "@/components/calendar/types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type AppointmentStatus =
  | "Booked"
  | "Confirmed"
  | "Arrived"
  | "Started"
  | "No-show"
  | "Completed"
  | "Cancelled";

export type PaymentMethod = "Cash" | "Card Terminal" | "Online Payment" | "Gift Card";

export type RepeatFrequency = "Daily" | "Weekly" | "Monthly" | "Yearly";

export interface RepeatRule {
  frequency: RepeatFrequency;
  every: number;
  days: string[]; // "Sun".."Sat" (weekly only)
  end: "never" | "after" | "date";
  endAfter?: number;
  endDate?: string; // ISO yyyy-mm-dd
}

export interface StaffMember {
  id: string;
  name: string;
  avatar: string;
}

export interface AppointmentClient {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  address: string;
  city: string;
  taxCode: string;
}

export interface AppointmentService {
  id: string;
  name: string;
  price: number;
  duration: number; // minutes
  startTime: string; // HH:mm
  employeeId: string;
}

export interface ActivityItem {
  id: string;
  label: string;
  date: string; // ISO yyyy-mm-dd
  time: string; // HH:mm
}

export interface PaymentPart {
  method: PaymentMethod;
  amount: number;
  pending?: boolean; // online payment still to be received
}

export interface AppointmentPayment {
  receiptNo: string;
  paidAt: string; // ISO yyyy-mm-dd
  parts: PaymentPart[];
  tip: number;
  discount: number;
  giftCardDiscount: number;
  total: number;
}

export interface Appointment {
  id: string;
  code: string;
  client: AppointmentClient;
  date: string; // ISO yyyy-mm-dd
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  status: AppointmentStatus;
  repeating: RepeatRule | null;
  note: string;
  services: AppointmentService[];
  activity: ActivityItem[];
  payment: AppointmentPayment | null;
  cancelReason?: string;
}

export interface GiftCard {
  id: string;
  code: string;
  owner: string;
  amount: number;
  variant: "classic" | "premium";
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const APPOINTMENTS_ROUTE = "/(drawer)/(tabs)/calendar/appointments";
export const appointmentRoute = (id: string, sub?: string) =>
  `/(drawer)/(tabs)/calendar/appointment/${id}${sub ? `/${sub}` : ""}`;

export const STATUS_OPTIONS: AppointmentStatus[] = [
  "Booked",
  "Confirmed",
  "Arrived",
  "Started",
  "No-show",
];

export const CANCEL_REASONS = [
  "No reason provided",
  "Duplicate appointment",
  "Appointment made by mistake",
  "Client not available",
];

export const PAYMENT_METHODS: { id: PaymentMethod; icon: string }[] = [
  { id: "Cash", icon: "cash-outline" },
  { id: "Card Terminal", icon: "card-outline" },
  { id: "Online Payment", icon: "globe-outline" },
  { id: "Gift Card", icon: "ticket-outline" },
];

export const SALON = {
  name: "Bella Vista Salon",
  address: "Via Roma, 123",
  city: "20121 Milan (MI) - Italy",
  vat: "IT12345678901",
  taxCode: "12345678901",
  pec: "amministrazione@pec.salonflow.it",
  recipientCode: "XXXXXXX",
  phone: "+39 02 1234567",
  email: "fatturazione@salonflow.it",
};

export const VAT_RATE = 0.22;

export const LEGAL_NOTES = [
  "Invoice issued pursuant to art. 21 of Presidential Decree 26 October 1972, n. 633 and subsequent amendments.",
  "VAT paid by the purchaser pursuant to art. 17, paragraph 6, of Presidential Decree 26 October 1972, n. 633.",
  "Digitally signed electronic document pursuant to Legislative Decree 82/2005.",
  "Replacement storage of documents pursuant to the Ministerial Decree of 17 June 2014.",
  "Competent court: Milan. Applicable law: Italian.",
  "Company subject to the management and coordination of [Holding Company].",
];

export const RECEIPT_FOOTER = [
  "SalonFlow Srl - Via Roma, 123 - 20121 Milan (MI) - VAT number: IT12345678901",
  "Share Capital: € 10,000.00 iv - REA MI-1234567 - SDI Code: XXXXXXX",
  "www.salonflow.it - info@salonflow.it - Tel: +39 02 1234567",
];

const avatar = (photo: string) =>
  `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=120&q=80`;

// The logged-in employee is always the first staff member.
export const STAFF: StaffMember[] = [
  { id: "e1", name: "Maria Rodriguez", avatar: avatar("photo-1534528741775-53994a69daeb") },
  { id: "e2", name: "Angelica Bell", avatar: avatar("photo-1494790108377-be9c29b29330") },
  { id: "e3", name: "Marco Rossi", avatar: avatar("photo-1500648767791-00dcc994a43e") },
  { id: "e4", name: "Luca Bianchi", avatar: avatar("photo-1507003211169-0a1dd7228f2d") },
  { id: "e5", name: "Sara Verdi", avatar: avatar("photo-1544005313-94ddf0286df2") },
  { id: "e6", name: "Giorgia Neri", avatar: avatar("photo-1531123897727-8f129e1688ce") },
];
export const CURRENT_EMPLOYEE = STAFF[0];

export const getStaff = (id: string) => STAFF.find((s) => s.id === id) ?? STAFF[0];

export const AVAILABLE_SERVICES: { name: string; price: number; duration: number }[] = [
  { name: "Haircut", price: 170, duration: 15 },
  { name: "Makeup", price: 170, duration: 45 },
  { name: "Hair coloring", price: 120, duration: 60 },
  { name: "Beard trim", price: 35, duration: 20 },
  { name: "Blow Dry & Style", price: 65, duration: 30 },
  { name: "Manicure", price: 45, duration: 25 },
];

export const GIFT_CARDS: GiftCard[] = [
  { id: "gc1", code: "#001", owner: "Maria Fernandez", amount: 20, variant: "classic" },
  { id: "gc2", code: "#002", owner: "Maria Fernandez", amount: 50, variant: "premium" },
];

const LOREM =
  "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book";

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const clients: AppointmentClient[] = [
  {
    id: "1",
    name: "Maria Fernandez",
    email: "maria@gmail.com",
    phone: "+39 342 998 8776",
    avatar: avatar("photo-1494790108377-be9c29b29330"),
    address: "Via Esempio, 456",
    city: "10100 Turin (TO) - Italy",
    taxCode: "98765432109",
  },
  {
    id: "2",
    name: "Sophia Rossi",
    email: "sophia.rossi@example.com",
    phone: "+39 345 678 9124",
    avatar: avatar("photo-1517841905240-472988babdf9"),
    address: "Corso Buenos Aires, 12",
    city: "20124 Milan (MI) - Italy",
    taxCode: "RSSSPH90A41F205X",
  },
  {
    id: "3",
    name: "Elena Romano",
    email: "elena.romano@example.com",
    phone: "+39 345 678 9125",
    avatar: avatar("photo-1438761681033-6461ffad8d80"),
    address: "Via Garibaldi, 8",
    city: "10122 Turin (TO) - Italy",
    taxCode: "RMNLNE88C55L219K",
  },
  {
    id: "4",
    name: "Giulia Bianchi",
    email: "giulia.b@example.com",
    phone: "+39 345 678 9126",
    avatar: avatar("photo-1544005313-94ddf0286df2"),
    address: "Via Dante, 21",
    city: "20121 Milan (MI) - Italy",
    taxCode: "BNCGLI92D62F205Y",
  },
  {
    id: "5",
    name: "Luca Conti",
    email: "luca.conti@example.com",
    phone: "+39 347 112 3344",
    avatar: avatar("photo-1506794778202-cad84cf45f1d"),
    address: "Via Torino, 77",
    city: "20123 Milan (MI) - Italy",
    taxCode: "CNTLCU85E10F205Z",
  },
];

const baseActivity = (date: string, labels: string[]): ActivityItem[] =>
  labels.map((label, i) => ({ id: `a${i}`, label, date, time: "07:00" }));

const svc = (
  id: string,
  name: string,
  price: number,
  duration: number,
  startTime: string,
  employeeId = "e1"
): AppointmentService => ({ id, name, price, duration, startTime, employeeId });

const seed: Appointment[] = [
  {
    id: "1",
    code: "#000",
    client: clients[0],
    date: "2025-08-02",
    startTime: "11:00",
    endTime: "11:15",
    status: "Booked",
    repeating: null,
    note: LOREM,
    services: [svc("s1", "Haircut", 170, 15, "11:00")],
    activity: baseActivity("2025-08-02", [
      "Appointement Created",
      "Appointment Confirmed",
      "Appointment Started",
    ]),
    payment: null,
  },
  {
    id: "2",
    code: "#001",
    client: clients[1],
    date: "2025-08-02",
    startTime: "12:00",
    endTime: "13:00",
    status: "Confirmed",
    repeating: null,
    note: "Prefers a lighter shade than last time.",
    services: [
      svc("s1", "Haircut", 170, 15, "12:00"),
      svc("s2", "Makeup", 170, 45, "12:15"),
    ],
    activity: baseActivity("2025-08-01", ["Appointement Created", "Appointment Confirmed"]),
    payment: null,
  },
  {
    id: "3",
    code: "#002",
    client: clients[2],
    date: "2025-08-03",
    startTime: "09:30",
    endTime: "10:30",
    status: "Arrived",
    repeating: { frequency: "Weekly", every: 1, days: ["Mon"], end: "after", endAfter: 3 },
    note: "",
    services: [svc("s1", "Hair coloring", 120, 60, "09:30")],
    activity: baseActivity("2025-08-03", ["Appointement Created", "Appointment Confirmed"]),
    payment: null,
  },
  {
    id: "4",
    code: "#003",
    client: clients[3],
    date: "2025-08-03",
    startTime: "15:00",
    endTime: "15:30",
    status: "Started",
    repeating: null,
    note: LOREM,
    services: [svc("s1", "Blow Dry & Style", 65, 30, "15:00")],
    activity: baseActivity("2025-08-03", [
      "Appointement Created",
      "Appointment Confirmed",
      "Appointment Started",
    ]),
    payment: null,
  },
  {
    id: "5",
    code: "#004",
    client: clients[4],
    date: "2025-08-04",
    startTime: "10:00",
    endTime: "10:20",
    status: "Completed",
    repeating: null,
    note: "",
    services: [svc("s1", "Beard trim", 35, 20, "10:00")],
    activity: [
      ...baseActivity("2025-08-04", [
        "Appointement Created",
        "Appointment Confirmed",
        "Appointment Started",
        "Receipt Printed",
      ]),
      { id: "a9", label: "Paid", date: "2025-08-04", time: "10:25" },
    ],
    payment: {
      receiptNo: "2025-000123",
      paidAt: "2025-08-04",
      parts: [{ method: "Card Terminal", amount: 35 }],
      tip: 0,
      discount: 0,
      giftCardDiscount: 0,
      total: 35,
    },
  },
  {
    id: "6",
    code: "#005",
    client: clients[0],
    date: "2025-08-05",
    startTime: "14:00",
    endTime: "14:40",
    status: "Booked",
    repeating: null,
    note: "",
    services: [
      svc("s1", "Haircut", 170, 15, "14:00"),
      svc("s2", "Manicure", 45, 25, "14:15"),
    ],
    activity: baseActivity("2025-08-01", ["Appointement Created"]),
    payment: null,
  },
  {
    id: "7",
    code: "#006",
    client: clients[1],
    date: "2025-08-06",
    startTime: "16:30",
    endTime: "17:15",
    status: "No-show",
    repeating: null,
    note: "Client did not answer the reminder call.",
    services: [svc("s1", "Makeup", 170, 45, "16:30")],
    activity: baseActivity("2025-08-02", ["Appointement Created", "Appointment Confirmed"]),
    payment: null,
  },
  {
    id: "8",
    code: "#007",
    client: clients[2],
    date: "2025-08-07",
    startTime: "11:30",
    endTime: "12:00",
    status: "Confirmed",
    repeating: null,
    note: "",
    services: [svc("s1", "Blow Dry & Style", 65, 30, "11:30")],
    activity: baseActivity("2025-08-05", ["Appointement Created", "Appointment Confirmed"]),
    payment: null,
  },
];

export const mockAppointments = seed;

// ---------------------------------------------------------------------------
// Tiny in-memory store so every sub-screen sees the same (edited) appointment
// ---------------------------------------------------------------------------

const store: Record<string, Appointment> = Object.fromEntries(seed.map((a) => [a.id, a]));
const listeners = new Set<() => void>();

// Calendar blocks and list rows use the calendar store's ids ("apt-1"…); the first time one
// is opened here, build a detail record from it so the screen shows that appointment.
function fromCalendar(cal: CalAppointment): Appointment {
  const staff = getStaffById(cal.staffId);
  const [durationMin] = cal.duration.split(" ");
  return {
    id: cal.id,
    code: cal.code,
    client: {
      id: cal.clientId ?? cal.id,
      name: cal.clientName,
      email: cal.clientEmail ?? "",
      phone: cal.clientPhone ?? "",
      avatar: cal.clientAvatar ?? "",
      address: "",
      city: "",
      taxCode: "",
    },
    date: cal.date,
    startTime: cal.startTime,
    endTime: cal.endTime,
    status: cal.status === "Canceled" ? "Cancelled" : cal.status,
    repeating: cal.repeating
      ? { frequency: "Weekly", every: 1, days: [], end: "never" }
      : null,
    note: cal.notes ?? "",
    services: [
      {
        id: `${cal.id}-s1`,
        name: cal.service,
        price: cal.priceNum,
        duration: parseInt(durationMin, 10) || 30,
        startTime: cal.startTime,
        employeeId: staff.id === CALENDAR_EMPLOYEE_ID ? CURRENT_EMPLOYEE.id : staff.id,
      },
    ],
    activity: [{ id: `${cal.id}-a1`, label: "Appointement Created", date: cal.date, time: cal.startTime }],
    payment: null,
  };
}

export function resolveAppointmentId(id?: string | string[]): string {
  const raw = Array.isArray(id) ? id[0] : id;
  if (!raw) return seed[0].id;
  if (store[raw]) return raw;
  const cal = getAppointmentsStore().find((a) => a.id === raw);
  if (cal) {
    store[raw] = fromCalendar(cal);
    return raw;
  }
  return seed[0].id;
}

export function getAppointment(id?: string | string[]): Appointment {
  return store[resolveAppointmentId(id)];
}

export function listAppointments(): Appointment[] {
  return Object.values(store);
}

export function updateAppointment(
  id: string | string[] | undefined,
  updater: (appt: Appointment) => Appointment
) {
  const key = resolveAppointmentId(id);
  store[key] = updater(store[key]);
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useAppointment(id?: string | string[]): Appointment {
  const key = resolveAppointmentId(id);
  return useSyncExternalStore(
    subscribe,
    () => store[key],
    () => store[key]
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const pad = (n: number) => String(n).padStart(2, "0");

export const parseISO = (iso: string) => {
  const [y, m, d] = iso.split("-").map((p) => parseInt(p, 10));
  return new Date(y, m - 1, d);
};

export const toISO = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

/** 02/08/2025 */
export const formatDate = (iso: string) => {
  const d = parseISO(iso);
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
};

/** 02 Aug 2025 */
export const formatLongDate = (iso: string) => {
  const d = parseISO(iso);
  return `${pad(d.getDate())} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
};

export const formatEuro = (value: number) =>
  `€ ${Number.isInteger(value) ? value : value.toFixed(2)}`;

export const formatEuroFixed = (value: number) => `€ ${value.toFixed(2)}`;

export const toMinutes = (time: string) => {
  const [h, m] = time.split(":").map((p) => parseInt(p, 10));
  return h * 60 + m;
};

export const fromMinutes = (mins: number) => `${pad(Math.floor(mins / 60) % 24)}:${pad(mins % 60)}`;

export const servicesTotal = (services: AppointmentService[]) =>
  services.reduce((acc, s) => acc + s.price, 0);

export const servicesDuration = (services: AppointmentService[]) =>
  services.reduce((acc, s) => acc + s.duration, 0);

export const nowStamp = () => {
  const d = new Date();
  return { date: toISO(d), time: `${pad(d.getHours())}:${pad(d.getMinutes())}` };
};

export const addActivity = (appt: Appointment, label: string): ActivityItem[] => {
  const { date, time } = nowStamp();
  return [...appt.activity, { id: `a${Date.now()}${appt.activity.length}`, label, date, time }];
};

const FULL_DAYS: Record<string, string> = {
  Sun: "Sunday",
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
};

/** "Every Monday", "Every 2 weeks on Mon, Wed", "Every day"… (Figma preview badge) */
export const repeatSummary = (rule: RepeatRule) => {
  const unit = { Daily: "day", Weekly: "week", Monthly: "month", Yearly: "year" }[rule.frequency];
  if (rule.frequency === "Weekly" && rule.days.length > 0) {
    if (rule.every === 1) {
      return rule.days.length === 1
        ? `Every ${FULL_DAYS[rule.days[0]]}`
        : `Every ${rule.days.join(", ")}`;
    }
    return `Every ${rule.every} weeks on ${rule.days.join(", ")}`;
  }
  return rule.every === 1 ? `Every ${unit}` : `Every ${rule.every} ${unit}s`;
};

/** "Mon" for an ISO date */
export const weekdayOf = (iso: string) => WEEK_DAYS[parseISO(iso).getDay()];
