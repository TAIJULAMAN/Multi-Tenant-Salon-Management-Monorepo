import { useSyncExternalStore } from "react";
import { colors } from "@/constants/figmaTheme";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type AllergyColor = "yellow" | "purple" | "pink";
export type Severity = "Mild" | "Moderate" | "Severe";
export type Registration = "Imported" | "Manual";

export interface Allergy {
  id: string;
  name: string;
  severity: Severity;
  note: string;
  color: AllergyColor;
}

export interface Client {
  id: string;
  clientCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string;
  gender: string;
  birthDate: string; // MM/DD/YYYY
  emergencyContact: string;
  address: string;
  city: string;
  province: string;
  cap: string;
  location: string;
  createdAt: string; // DD/MM/YYYY
  createdAtLabel: string;
  lastAppointment: string; // DD/MM/YYYY
  lastAppointmentDaysAgo: number;
  registration: Registration;
  totalSales: number;
  tags: string[];
  allergies: Allergy[];
}

export type AppointmentStatus =
  | "Booked"
  | "Confirmed"
  | "Arrived"
  | "Started"
  | "Completed"
  | "Canceled"
  | "No-show";

export type BookingStepStatus = "Overdue" | "To Do" | "In Progress" | "Done";

export interface BookingStep {
  order: number;
  status: BookingStepStatus;
  time: string;
  service: string;
  staff: string;
}

export interface ClientAppointment {
  id: string;
  day: string;
  month: string;
  year: string;
  title: string;
  status: AppointmentStatus;
  time: string;
  duration: string;
  staff: string;
  price: number;
  paymentState: "Expected" | "Paid";
  daysAgo: number;
  services: { name: string; price: number; paymentState: "Expected" | "Paid" }[];
  bookingOrder?: BookingStep[];
}

export interface ClientNote {
  id: string;
  title: string;
  description: string;
  attachments: { name: string; size: string }[];
}

export interface MediaItem {
  id: string;
  fileName: string;
  type: "Photo" | "Video";
  uploadedAt: string;
  uri: string;
  daysAgo: number;
}

export type Channel = "Email" | "SMS" | "WhatsApp";
export type MessageStatus = "Delivered" | "Sent" | "Read" | "Failed";

export interface CommunicationEntry {
  id: string;
  channel: Channel;
  message: string;
  sender: string | null; // null => System
  senderRole?: string;
  date: string;
  time: string;
  status: MessageStatus;
  daysAgo: number;
  replies?: { author: string; ago: string; text: string; fromClient: boolean }[];
  contentTitle?: string;
  contentBody?: string;
}

export interface Receipt {
  id: string;
  teamMember: string;
  avatar: string;
  service: string;
  scheduledDate: string;
  price: number;
  paymentMethod: "Cash" | "Credit Card" | "Gift Card";
  status: "Paid" | "Pending" | "Refunded";
}

export interface EditHistoryEntry {
  id: string;
  dateTime: string;
  field: string;
  previousValue: string;
  newValue: string;
  editedBy: string;
  action: "Update" | "Creation";
}

export type GiftCardTemplate = 1 | 2;
export type GiftCardLogo = "none" | "main" | "alternative" | "minimal";

export interface GiftCard {
  id: string;
  code: string;
  clientId?: string;
  quantity: number;
  amount: number;
  currency: string;
  hideAmount: boolean;
  template: GiftCardTemplate;
  logo: GiftCardLogo;
  salonName: string;
  website: string;
  address: string;
  issueDate: string;
  expirationDate: string;
  usageLimit: string;
  eligibleServices: string[];
  receiverName: string;
  gifterName: string;
  message: string;
  used: boolean;
  expired: boolean;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const CLIENT_SINCE_OPTIONS = ["All Years", "2025", "2024", "2023"];
export const REGISTRATION_OPTIONS = ["All", "Imported", "Manual"];
export const LAST_APPOINTMENT_OPTIONS = [
  "Last 7 days",
  "Last 14 days",
  "Last Month",
  "Last 3 Months",
  "All Time",
];
export const DATE_RANGE_OPTIONS = [
  "Last 7 days",
  "Last 14 days",
  "Last Month",
  "Last 3 Months",
  "Custom Range",
];
export const APPOINTMENT_STATUS_OPTIONS = [
  "All",
  "Booked",
  "Confirmed",
  "Arrived",
  "Started",
  "Completed",
  "Canceled",
  "No-show",
];
export const GENDER_OPTIONS = ["Female", "Male", "Other"];
export const SEVERITY_OPTIONS: Severity[] = ["Mild", "Moderate", "Severe"];
export const SERVICE_OPTIONS = ["Haircut", "Hair Color", "Blow Dry", "Treatments", "Manicure"];

export const COVER_IMAGE =
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600&auto=format&fit=crop";

/** Darker yellow used for text on yellow-soft labels (Figma "Arrived", "Pending", "No-Used"). */
export const YELLOW_TEXT = "#F8C208";
export const GREEN_SOFT = "#EAFAF0";

export const ALLERGY_COLORS: Record<AllergyColor, string> = {
  yellow: colors.yellow,
  purple: colors.primary,
  pink: colors.pink,
};

export const COLOR_BY_SEVERITY: Record<Severity, AllergyColor> = {
  Mild: "purple",
  Moderate: "yellow",
  Severe: "pink",
};

/** Medical alert colors (Figma 1:39485): tinted card, colored border, solid label. */
export const SEVERITY_STYLES: Record<Severity, { bg: string; border: string; solid: string }> = {
  Mild: { bg: colors.primaryTint, border: colors.primary, solid: colors.primary },
  Moderate: { bg: colors.yellowSoft, border: colors.yellow, solid: colors.yellow },
  Severe: { bg: colors.pinkSoft, border: colors.pink, solid: colors.pink },
};

/** Label style: `outline` = white bg with colored border (Figma "Advance labels" outline variant). */
export interface LabelStyle {
  bg: string;
  text: string;
  outline?: boolean;
}

export const CLIENT_TAG_STYLES: Record<string, LabelStyle> = {
  VIP: { bg: colors.teal, text: colors.white },
  "New Client": { bg: GREEN_SOFT, text: colors.green },
  "Frequent Canceler": { bg: colors.white, text: colors.pink, outline: true },
};

export const APPOINTMENT_STATUS_STYLES: Record<AppointmentStatus, LabelStyle> = {
  Booked: { bg: colors.primarySoft, text: colors.primary },
  Confirmed: { bg: colors.tealSoft, text: colors.teal },
  Arrived: { bg: colors.yellowSoft, text: YELLOW_TEXT },
  Started: { bg: colors.white, text: colors.teal, outline: true },
  Completed: { bg: GREEN_SOFT, text: colors.green },
  Canceled: { bg: colors.pinkSoft, text: colors.pink },
  "No-show": { bg: colors.white, text: colors.pink, outline: true },
};

export const BOOKING_STEP_STYLES: Record<
  BookingStepStatus,
  { circle: string; circleText: string; bg: string; text: string }
> = {
  Overdue: { circle: colors.yellowSoft, circleText: YELLOW_TEXT, bg: colors.yellowSoft, text: YELLOW_TEXT },
  "To Do": { circle: colors.textMuted, circleText: colors.white, bg: colors.borderLight, text: colors.textDark },
  "In Progress": { circle: colors.primarySoft, circleText: colors.primary, bg: colors.primarySoft, text: colors.primary },
  Done: { circle: GREEN_SOFT, circleText: colors.green, bg: GREEN_SOFT, text: colors.green },
};

const AVATARS = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=200&q=80",
];

export const STAFF_AVATARS = AVATARS;

const LOREM =
  "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.";

// ---------------------------------------------------------------------------
// Mock clients
// ---------------------------------------------------------------------------

const SEED: {
  first: string;
  last: string;
  color: AllergyColor;
  created: string;
  last7: number;
  reg: Registration;
  sales: number;
}[] = [
  { first: "Maria", last: "Rodriguez", color: "yellow", created: "08/08/2024", last7: 2, reg: "Manual", sales: 23850 },
  { first: "Sofia", last: "Bianchi", color: "purple", created: "12/03/2025", last7: 5, reg: "Imported", sales: 1240 },
  { first: "Marco", last: "Rossi", color: "purple", created: "21/11/2023", last7: 1, reg: "Manual", sales: 860 },
  { first: "Giulia", last: "Conti", color: "yellow", created: "02/06/2024", last7: 3, reg: "Imported", sales: 150 },
  { first: "Anna", last: "Ferrari", color: "pink", created: "15/01/2025", last7: 6, reg: "Manual", sales: 3100 },
  { first: "Luca", last: "Fontana", color: "yellow", created: "30/09/2023", last7: 3, reg: "Manual", sales: 190 },
  { first: "Chiara", last: "Moretti", color: "pink", created: "10/10/2024", last7: 4, reg: "Imported", sales: 540 },
  { first: "Elena", last: "Ricci", color: "yellow", created: "05/02/2025", last7: 6, reg: "Manual", sales: 75 },
  { first: "Paolo", last: "Greco", color: "pink", created: "18/07/2023", last7: 7, reg: "Imported", sales: 2600 },
  { first: "Laura", last: "Colombo", color: "purple", created: "22/04/2024", last7: 1, reg: "Manual", sales: 120 },
];

const INITIAL_CLIENTS: Client[] = SEED.map((s, i) => ({
  id: String(i + 1),
  clientCode: String(100000 + i * 137).padStart(6, "0"),
  firstName: s.first,
  lastName: s.last,
  email: `${s.first.toLowerCase()}@beautywellness.com`,
  phone: "+39 345 678 9123",
  avatar: AVATARS[i % AVATARS.length],
  gender: ["Paolo", "Luca", "Marco"].includes(s.first) ? "Male" : "Female",
  birthDate: "11/07/1992",
  emergencyContact: "Marco Rossi (+39 335 345 678)",
  address: "Independence Street 567",
  city: "Bologna",
  province: "Bologna (BO)",
  cap: "40126",
  location: "Bologna, Italy",
  createdAt: s.created,
  createdAtLabel: formatLongDate(s.created),
  lastAppointment: "02/09/2025",
  lastAppointmentDaysAgo: s.last7,
  registration: s.reg,
  totalSales: s.sales,
  tags: ["VIP", "New Client", "Frequent Canceler"],
  // Figma 1:39485 lists Mild / Moderate / Severe; the seed color decides which one comes first (client list badge).
  allergies: severitiesFor(s.color).map((severity, n) => ({
    id: `a${i}-${n + 1}`,
    name: "Fragrances Allergie",
    severity,
    note: LOREM,
    color: COLOR_BY_SEVERITY[severity],
  })),
}));

function severitiesFor(color: AllergyColor): Severity[] {
  const first: Severity = color === "yellow" ? "Moderate" : color === "pink" ? "Severe" : "Mild";
  return [first, ...SEVERITY_OPTIONS.filter((sv) => sv !== first)];
}

function formatLongDate(ddmmyyyy: string) {
  const [d, m, y] = ddmmyyyy.split("/");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[parseInt(m, 10) - 1] ?? "Jan"} ${parseInt(d, 10)}, ${y}`;
}

export function getAge(birthDate: string) {
  const [m, d, y] = birthDate.split("/").map((v) => parseInt(v, 10));
  if (!y) return "-";
  const now = new Date();
  let age = now.getFullYear() - y;
  if (now.getMonth() + 1 < m || (now.getMonth() + 1 === m && now.getDate() < d)) age -= 1;
  return `${age} years old`;
}

export function formatBirthDate(birthDate: string) {
  const [m, d, y] = birthDate.split("/").map((v) => parseInt(v, 10));
  if (!y) return birthDate;
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  return `${months[m - 1] ?? ""} ${d}, ${y}`;
}

export function fullName(c: Pick<Client, "firstName" | "lastName">) {
  return `${c.firstName} ${c.lastName}`.trim();
}

// ---------------------------------------------------------------------------
// Tiny external stores (mock persistence during the session)
// ---------------------------------------------------------------------------

function createStore<T extends { id: string }>(initial: T[]) {
  let items = initial;
  const listeners = new Set<() => void>();
  const emit = () => listeners.forEach((l) => l());
  return {
    getAll: () => items,
    getById: (id?: string) => items.find((i) => i.id === id),
    add: (item: T) => {
      items = [item, ...items];
      emit();
    },
    update: (id: string, patch: Partial<T>) => {
      items = items.map((i) => (i.id === id ? { ...i, ...patch } : i));
      emit();
    },
    remove: (ids: string[]) => {
      items = items.filter((i) => !ids.includes(i.id));
      emit();
    },
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}

export const clientsStore = createStore<Client>(INITIAL_CLIENTS);

export function useClients() {
  return useSyncExternalStore(clientsStore.subscribe, clientsStore.getAll, clientsStore.getAll);
}

/** Returns the client for the id, falling back to the first client so any id renders. */
export function useClient(id?: string) {
  const clients = useClients();
  return clients.find((c) => c.id === id) ?? clients[0] ?? INITIAL_CLIENTS[0];
}

export function createEmptyClient(): Client {
  const id = `c${Date.now()}`;
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const created = `${dd}/${mm}/${today.getFullYear()}`;
  return {
    id,
    clientCode: String(Math.floor(100000 + Math.random() * 899999)),
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)],
    gender: "Female",
    birthDate: "",
    emergencyContact: "",
    address: "",
    city: "",
    province: "",
    cap: "",
    location: "Bologna, Italy",
    createdAt: created,
    createdAtLabel: formatLongDate(created),
    lastAppointment: "-",
    lastAppointmentDaysAgo: 0,
    registration: "Manual",
    totalSales: 0,
    tags: [],
    allergies: [],
  };
}

// ---------------------------------------------------------------------------
// Detail mocks
// ---------------------------------------------------------------------------

/** Stat tiles (Figma "Cards"): solid icon square + vertical tinted gradient. */
export interface StatTile {
  label: string;
  value: string;
  icon: "wallet-outline" | "calendar-outline" | "ban-outline" | "remove-circle-outline" | "card-outline" | "cash-outline";
  color: string;
  gradient: [string, string];
}

export const OVERVIEW_STATS: StatTile[] = [
  { label: "Total Sales", value: "€ 23,850", icon: "wallet-outline", color: colors.primary, gradient: ["#EDECFF", "#F9F9FF"] },
  { label: "Appointments", value: "18", icon: "calendar-outline", color: colors.teal, gradient: ["#E2F9F8", "#F7FDFD"] },
  { label: "Canceled", value: "1", icon: "ban-outline", color: colors.pink, gradient: ["#FFEAF0", "#FFF9FB"] },
  { label: "No-Show", value: "0", icon: "remove-circle-outline", color: "#F8C30D", gradient: ["#FEF7E0", "#FFFDF7"] },
];

export const ANALYTICS_STATS: StatTile[] = [
  { label: "Total Money Spent", value: "€ 4,358", icon: "card-outline", color: colors.primary, gradient: ["#EDECFF", "#F9F9FF"] },
  { label: "Average Spend Per Visit", value: "€ 258", icon: "cash-outline", color: colors.teal, gradient: ["#E2F9F8", "#F7FDFD"] },
];

export type WaiverKind = "toggle" | "unsigned" | "signed";

export interface Waiver {
  id: string;
  name: string;
  kind: WaiverKind;
  enabled?: boolean;
}

/** Figma 1:35745 "Waivers". */
export const WAIVERS: Waiver[] = [
  { id: "w1", name: "Marketing consent", kind: "toggle", enabled: true },
  { id: "w2", name: "Social media posting", kind: "unsigned" },
  { id: "w3", name: "Social Media", kind: "signed" },
];

export const PREFERRED_STAFF = [
  { id: "p1", name: "Lola Ortega", role: "Staff", avatar: AVATARS[3] },
  { id: "p2", name: "Virgie Sutton", role: "Staff", avatar: AVATARS[4] },
  { id: "p3", name: "Lois Gregory", role: "Staff", avatar: AVATARS[6] },
];

export const FREQUENT_SERVICES = ["Haircuts", "Coloring", "Treatments"];

export const PREFERRED_TIMES = [
  { day: "Monday", time: "09:46 AM" },
  { day: "Tuesday", time: "10:00 AM" },
  { day: "Thursday", time: "12:00 AM" },
  { day: "Friday", time: "09:30 AM" },
  { day: "Saturday", time: "09:30 AM" },
];

export const EDIT_HISTORY: EditHistoryEntry[] = [
  { id: "h1", dateTime: "5 Aug 2025 09:45 AM", field: "Phone", previousValue: "+39 336 789 012", newValue: "+39 336 789 012", editedBy: "Virgie Sutton", action: "Update" },
  { id: "h2", dateTime: "5 Aug 2025 09:45 AM", field: "Address", previousValue: "Independence Street 567", newValue: "Independence Street 567", editedBy: "Virgie Sutton", action: "Update" },
  { id: "h3", dateTime: "5 Aug 2025 09:45 AM", field: "Email", previousValue: "anna@bellavista.com", newValue: "anna@gmail.com", editedBy: "Lola Ortega", action: "Update" },
  { id: "h4", dateTime: "5 Aug 2025 09:45 AM", field: "Email", previousValue: "anna@gmail.com", newValue: "anna@bellavista.com", editedBy: "Lola Ortega", action: "Update" },
  { id: "h5", dateTime: "5 Aug 2025 09:45 AM", field: "Profile Created", previousValue: "-", newValue: "-", editedBy: "Lois Gregory", action: "Creation" },
  { id: "h6", dateTime: "2 Aug 2025 11:20 AM", field: "City", previousValue: "Modena", newValue: "Bologna", editedBy: "Lola Ortega", action: "Update" },
  { id: "h7", dateTime: "1 Aug 2025 04:10 PM", field: "Gender", previousValue: "-", newValue: "Female", editedBy: "Virgie Sutton", action: "Update" },
  { id: "h8", dateTime: "28 Jul 2025 10:05 AM", field: "CAP", previousValue: "41121", newValue: "40126", editedBy: "Lois Gregory", action: "Update" },
  { id: "h9", dateTime: "25 Jul 2025 03:30 PM", field: "Province", previousValue: "Modena (MO)", newValue: "Bologna (BO)", editedBy: "Virgie Sutton", action: "Update" },
  { id: "h10", dateTime: "20 Jul 2025 09:00 AM", field: "Date of birth", previousValue: "-", newValue: "November 7, 1992", editedBy: "Lola Ortega", action: "Update" },
];

const DEFAULT_SERVICES: ClientAppointment["services"] = [
  { name: "Haircuts", price: 170, paymentState: "Expected" },
  { name: "Coloring", price: 170, paymentState: "Expected" },
  { name: "Treatments", price: 170, paymentState: "Expected" },
];

const STAFF_LINE = "Sophia Ventura - Angelica Last";

export const CLIENT_APPOINTMENTS: ClientAppointment[] = [
  {
    id: "1", day: "1", month: "AUG", year: "2025", title: "Haircut", status: "Booked",
    time: "17:00", duration: "15 min", staff: STAFF_LINE, price: 170, paymentState: "Expected", daysAgo: 1,
    services: DEFAULT_SERVICES,
    bookingOrder: [
      { order: 1, status: "Overdue", time: "12:00-12:05", service: "Shampoo", staff: "Angelica" },
      { order: 2, status: "To Do", time: "12:05-12:10", service: "Haircut", staff: "Angelica" },
      { order: 3, status: "To Do", time: "12:10-12:15", service: "Blow Dry", staff: "Sophia" },
    ],
  },
  { id: "2", day: "1", month: "AUG", year: "2025", title: "Hair Color", status: "Confirmed", time: "17:00", duration: "15 min", staff: STAFF_LINE, price: 170, paymentState: "Expected", daysAgo: 3, services: DEFAULT_SERVICES },
  { id: "3", day: "1", month: "AUG", year: "2025", title: "Blow Dry", status: "Arrived", time: "17:00", duration: "15 min", staff: STAFF_LINE, price: 170, paymentState: "Expected", daysAgo: 5, services: DEFAULT_SERVICES },
  { id: "4", day: "1", month: "AUG", year: "2025", title: "Blow Dry", status: "Started", time: "17:00", duration: "15 min", staff: STAFF_LINE, price: 170, paymentState: "Expected", daysAgo: 4, services: DEFAULT_SERVICES },
  { id: "5", day: "1", month: "AUG", year: "2025", title: "Blow Dry", status: "Completed", time: "17:00", duration: "15 min", staff: STAFF_LINE, price: 170, paymentState: "Paid", daysAgo: 5, services: DEFAULT_SERVICES.map((s) => ({ ...s, paymentState: "Paid" as const })) },
  { id: "6", day: "1", month: "AUG", year: "2025", title: "Blow Dry", status: "Canceled", time: "17:00", duration: "15 min", staff: STAFF_LINE, price: 170, paymentState: "Expected", daysAgo: 6, services: DEFAULT_SERVICES },
  { id: "7", day: "1", month: "AUG", year: "2025", title: "Blow Dry", status: "No-show", time: "17:00", duration: "15 min", staff: STAFF_LINE, price: 170, paymentState: "Expected", daysAgo: 6, services: DEFAULT_SERVICES },
];

export const EMPLOYEE_BREAKDOWN = [
  { id: "e1", name: "Barney", amount: "€ 1,700", avatar: AVATARS[2] },
  { id: "e2", name: "Lola Ortega", amount: "€ 1,250", avatar: AVATARS[3] },
  { id: "e3", name: "Virgie Sutton", amount: "€ 980", avatar: AVATARS[4] },
  { id: "e4", name: "Lois Gregory", amount: "€ 640", avatar: AVATARS[6] },
  { id: "e5", name: "Sophia Ventura", amount: "€ 420", avatar: AVATARS[1] },
  { id: "e6", name: "Angelica Last", amount: "€ 210", avatar: AVATARS[9] },
];

export const SERVICE_BREAKDOWN = [
  { name: "Haircuts", amount: "€ 1,700" },
  { name: "Coloring", amount: "€ 1,700" },
  { name: "Treatments", amount: "€ 1,700" },
];

export const MONEY_SPENT_SERIES: Record<string, { labels: string[]; values: number[]; total: string; delta: string; deltaLabel: string }> = {
  "Last 7 days": {
    labels: ["Sep 1", "Sep 2", "Sep 3", "Sep 4", "Sep 5", "Sep 6", "Sep 7"],
    values: [800, 1900, 1200, 1600, 900, 2200, 1358],
    total: "€ 1,358",
    delta: "+9%",
    deltaLabel: "last week",
  },
  "Last 14 days": {
    labels: ["Aug 25", "Aug 27", "Aug 29", "Aug 31", "Sep 2", "Sep 4", "Sep 7"],
    values: [1200, 900, 1500, 1800, 1100, 2000, 1700],
    total: "€ 2,640",
    delta: "+6%",
    deltaLabel: "last 2 weeks",
  },
  "Last Month": {
    labels: ["Wk 1", "Wk 2", "Wk 3", "Wk 4"],
    values: [1500, 2100, 1300, 2400],
    total: "€ 4,358",
    delta: "+12%",
    deltaLabel: "last month",
  },
  "Last 3 Months": {
    labels: ["Jul", "Aug", "Sep"],
    values: [1400, 2300, 1900],
    total: "€ 9,120",
    delta: "-3%",
    deltaLabel: "last quarter",
  },
  "Custom Range": {
    labels: ["Sep 1", "Sep 2", "Sep 3", "Sep 4", "Sep 5", "Sep 6", "Sep 7"],
    values: [800, 1900, 1200, 1600, 900, 2200, 1358],
    total: "€ 1,358",
    delta: "+9%",
    deltaLabel: "last week",
  },
};

export const RECEIPTS: Receipt[] = [
  { id: "#001", teamMember: "Maria Rodriguez", avatar: AVATARS[0], service: "Haircut", scheduledDate: "5 Aug 2025 (12:00 AM - 12:15 AM)", price: 170, paymentMethod: "Cash", status: "Pending" },
  { id: "#002", teamMember: "Maria Rodriguez", avatar: AVATARS[4], service: "Haircut", scheduledDate: "5 Aug 2025 (12:00 AM - 12:15 AM)", price: 170, paymentMethod: "Cash", status: "Refunded" },
  { id: "#003", teamMember: "Maria Rodriguez", avatar: AVATARS[7], service: "Haircut", scheduledDate: "5 Aug 2025 (12:00 AM - 12:15 AM)", price: 170, paymentMethod: "Gift Card", status: "Refunded" },
  { id: "#004", teamMember: "Maria Rodriguez", avatar: AVATARS[1], service: "Haircut", scheduledDate: "5 Aug 2025 (12:00 AM - 12:15 AM)", price: 170, paymentMethod: "Credit Card", status: "Paid" },
  { id: "#005", teamMember: "Maria Rodriguez", avatar: AVATARS[0], service: "Haircut", scheduledDate: "5 Aug 2025 (12:00 AM - 12:15 AM)", price: 170, paymentMethod: "Credit Card", status: "Pending" },
  { id: "#006", teamMember: "Maria Rodriguez", avatar: AVATARS[2], service: "Haircut", scheduledDate: "5 Aug 2025 (12:00 AM - 12:15 AM)", price: 170, paymentMethod: "Cash", status: "Paid" },
  { id: "#007", teamMember: "Maria Rodriguez", avatar: AVATARS[3], service: "Haircut", scheduledDate: "5 Aug 2025 (12:00 AM - 12:15 AM)", price: 170, paymentMethod: "Credit Card", status: "Paid" },
  { id: "#008", teamMember: "Maria Rodriguez", avatar: AVATARS[5], service: "Haircut", scheduledDate: "5 Aug 2025 (12:00 AM - 12:15 AM)", price: 170, paymentMethod: "Gift Card", status: "Paid" },
  { id: "#009", teamMember: "Maria Rodriguez", avatar: AVATARS[6], service: "Haircut", scheduledDate: "5 Aug 2025 (12:00 AM - 12:15 AM)", price: 170, paymentMethod: "Cash", status: "Paid" },
  { id: "#010", teamMember: "Maria Rodriguez", avatar: AVATARS[9], service: "Haircut", scheduledDate: "5 Aug 2025 (12:00 AM - 12:15 AM)", price: 170, paymentMethod: "Credit Card", status: "Refunded" },
];

/** Figma 1:38171 receipts table: payment method = outline label, status = soft label. */
export const PAYMENT_METHOD_STYLES: Record<Receipt["paymentMethod"], LabelStyle> = {
  Cash: { bg: colors.white, text: colors.teal, outline: true },
  "Credit Card": { bg: colors.white, text: colors.primary, outline: true },
  "Gift Card": { bg: colors.white, text: colors.textDark, outline: true },
};

export const RECEIPT_STATUS_STYLES: Record<Receipt["status"], LabelStyle> = {
  Paid: { bg: GREEN_SOFT, text: colors.green },
  Pending: { bg: colors.yellowSoft, text: YELLOW_TEXT },
  Refunded: { bg: colors.pinkSoft, text: colors.pink },
};

export const INITIAL_NOTES: ClientNote[] = [1, 2, 3, 4].map((n) => ({
  id: `n${n}`,
  title: n === 1 ? "Prefers cool-toned color" : n === 2 ? "Sensitive scalp" : n === 3 ? "Birthday promo" : "Style reference",
  description: LOREM,
  attachments: [{ name: "originalname.pdf", size: "4.2 MB" }],
}));

export const INITIAL_MEDIA: MediaItem[] = [
  {
    id: "m1",
    fileName: "FileName.jpeg",
    type: "Photo",
    uploadedAt: "Uploaded at 08/08/2025 5:06 PM",
    uri: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=900&q=80",
    daysAgo: 2,
  },
  {
    id: "m2",
    fileName: "FileName.mp4",
    type: "Video",
    uploadedAt: "Uploaded at 08/08/2025 5:06 PM",
    uri: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=80",
    daysAgo: 4,
  },
  {
    id: "m3",
    fileName: "Before-After.jpeg",
    type: "Photo",
    uploadedAt: "Uploaded at 01/08/2025 11:20 AM",
    uri: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=900&q=80",
    daysAgo: 12,
  },
];

export const LAST_CONTACTED = "02/09/2025 (via WhatsApp, by Maria)";

export const COMMUNICATION_LOG: CommunicationEntry[] = [
  {
    id: "l1", channel: "WhatsApp", message: "New appointment scheduled for tomorrow at 3 PM",
    sender: "Employee Name", senderRole: "Receptionist", date: "02/09/2025", time: "11:44",
    status: "Delivered", daysAgo: 1,
    replies: [
      { author: "Maria, 2 hours ago", ago: "2 hours ago", text: "If I don’t like something, I’ll stay away from it.", fromClient: false },
      { author: "Maria, 2 hours ago", ago: "2 hours ago", text: "I want more detailed information.", fromClient: true },
    ],
  },
  {
    id: "l2", channel: "Email", message: "New appointment scheduled for tomorrow at 3 PM",
    sender: null, date: "07/08/2025", time: "11:44", status: "Delivered", daysAgo: 25,
    contentTitle: "Title", contentBody: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
  },
  {
    id: "l3", channel: "SMS", message: "New appointment scheduled for tomorrow at 3 PM",
    sender: null, date: "07/08/2025", time: "11:44", status: "Sent", daysAgo: 25,
    contentTitle: "Title", contentBody: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
  },
  {
    id: "l4", channel: "WhatsApp", message: "New appointment scheduled for tomorrow at 3 PM",
    sender: "Employee Name", senderRole: "Receptionist", date: "07/08/2025", time: "11:44",
    status: "Read", daysAgo: 25,
    replies: [{ author: "Maria, 2 hours ago", ago: "2 hours ago", text: "Perfect, see you tomorrow!", fromClient: true }],
  },
  {
    id: "l5", channel: "WhatsApp", message: "New appointment scheduled for tomorrow at 3 PM",
    sender: "Employee Name", senderRole: "Receptionist", date: "07/08/2025", time: "11:44",
    status: "Failed", daysAgo: 25,
    replies: [],
  },
  {
    id: "l6", channel: "Email", message: "New appointment scheduled for tomorrow at 3 PM",
    sender: "Employee Name", senderRole: "Receptionist", date: "07/08/2025", time: "11:44",
    status: "Failed", daysAgo: 60,
    contentTitle: "Title", contentBody: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
  },
  {
    id: "l7", channel: "Email", message: "New appointment scheduled for tomorrow at 3 PM",
    sender: "Employee Name", senderRole: "Receptionist", date: "07/08/2025", time: "11:44",
    status: "Failed", daysAgo: 60,
    contentTitle: "Title", contentBody: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
  },
];

export const MESSAGE_STATUS_STYLES: Record<MessageStatus, LabelStyle> = {
  Delivered: { bg: colors.primarySoft, text: colors.primary },
  Sent: { bg: colors.tealSoft, text: colors.teal },
  Read: { bg: GREEN_SOFT, text: colors.green },
  Failed: { bg: colors.pinkSoft, text: colors.pink },
};

export type SenderType = "Staff Member" | "System";

export const SENDER_TYPE_STYLES: Record<SenderType, LabelStyle> = {
  "Staff Member": { bg: colors.white, text: colors.primary, outline: true },
  System: { bg: colors.white, text: colors.teal, outline: true },
};

export const MESSAGE_STATUS_OPTIONS = ["All Status", "Delivered", "Sent", "Read", "Failed"];
export const LOG_RANGE_OPTIONS = ["All Time", "Last 7 days", "Last 14 days", "Last Month", "Last 3 Months"];

/** Gift card labels (Figma 1:38171 / 1:41750). */
export const GIFT_LABELS: Record<"Used" | "No-Used" | "Active" | "Expired" | "Hidden", LabelStyle> = {
  Used: { bg: GREEN_SOFT, text: colors.green },
  "No-Used": { bg: colors.yellowSoft, text: YELLOW_TEXT },
  Active: { bg: colors.white, text: colors.green, outline: true },
  Expired: { bg: colors.white, text: colors.pink, outline: true },
  Hidden: { bg: colors.white, text: colors.pink, outline: true },
};

// ---------------------------------------------------------------------------
// Gift cards
// ---------------------------------------------------------------------------

const DEFAULT_GIFT: Omit<GiftCard, "id" | "code" | "template" | "used" | "expired"> = {
  quantity: 1,
  amount: 200,
  currency: "€",
  hideAmount: false,
  logo: "main",
  salonName: "CDJ HAREM ACCONCIATURE",
  website: "www.degradejoellemassafra.it",
  address: "Via Redipuglia 44/A - MASSAFRA (TA)",
  issueDate: "02/09/2025",
  expirationDate: "02/20/2025",
  usageLimit: "1",
  eligibleServices: ["Haircut", "Hair Color", "Blow Dry", "Treatments"],
  receiverName: "Receiver Name",
  gifterName: "Gifter Name",
  message:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
};

export const giftCardsStore = createStore<GiftCard>([
  { ...DEFAULT_GIFT, id: "g1", code: "#001", template: 1, used: true, expired: false },
  { ...DEFAULT_GIFT, id: "g2", code: "#002", template: 2, used: false, expired: false },
  { ...DEFAULT_GIFT, id: "g3", code: "#003", template: 2, used: false, expired: false },
]);

export function useGiftCards() {
  return useSyncExternalStore(giftCardsStore.subscribe, giftCardsStore.getAll, giftCardsStore.getAll);
}

export function createGiftCardDraft(): GiftCard {
  return {
    ...DEFAULT_GIFT,
    id: `g${Date.now()}`,
    code: `#${String(Math.floor(Math.random() * 900) + 100)}`,
    template: 1,
    receiverName: "",
    gifterName: "",
    message: "",
    used: false,
    expired: false,
  };
}

// ---------------------------------------------------------------------------
// Import mock
// ---------------------------------------------------------------------------

export interface ImportRow {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  marketingConsent: "yes" | "no";
  birthDate: string;
}

export const IMPORT_ROWS: ImportRow[] = Array.from({ length: 10 }).map((_, i) => ({
  id: `#${String(i + 1).padStart(3, "0")}`,
  firstName: ["Maria", "Giorgia", "Francesca", "Alessia", "Martina", "Sara", "Valentina", "Federica", "Silvia", "Irene"][i],
  lastName: ["Rodriguez", "Lombardi", "Galli", "Costa", "Mancini", "Rizzo", "Marino", "Bruno", "Gallo", "De Luca"][i],
  phone: "+39 345 678 9123",
  email: "email@email.com",
  marketingConsent: i % 2 === 0 ? "yes" : "no",
  birthDate: "02/01/1990",
}));
