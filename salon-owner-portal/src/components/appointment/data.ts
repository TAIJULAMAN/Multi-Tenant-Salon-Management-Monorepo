export type Status =
  | "Booked"
  | "Confirmed"
  | "Arrived"
  | "Started"
  | "Completed"
  | "Canceled";

export type Appointment = {
  id: string;
  clientName: string;
  clientAvatar?: string;
  clientPhone: string;
  service: string;
  scheduledDate: string;
  price: string;
  status: Status;
};

export const allAppointments: Appointment[] = [
  {
    id: "001",
    clientName: "Shah Aman",
    clientAvatar: "/avatar/icon1.png",
    clientPhone: "+39 345 678 9123",
    service: "Haircut",
    scheduledDate: "5 Aug 2025 (12:00 AM - 12:15 AM)",
    price: "€ 170",
    status: "Booked",
  },
  {
    id: "002",
    clientName: "John Doe",
    clientAvatar: "/avatar/icon2.png",
    clientPhone: "+1 234 567 8901",
    service: "Haircut",
    scheduledDate: "5 Aug 2025 (12:00 AM - 12:15 AM)",
    price: "€ 170",
    status: "Started",
  },
  {
    id: "003",
    clientName: "Elena Rossi",
    clientAvatar: "/avatar/icon3.png",
    clientPhone: "+39 123 456 7890",
    service: "Haircut",
    scheduledDate: "5 Aug 2025 (12:00 AM - 12:15 AM)",
    price: "€ 170",
    status: "Canceled",
  },
  {
    id: "004",
    clientName: "Alex Smith",
    clientAvatar: "/avatar/icon1.png",
    clientPhone: "+44 7700 900077",
    service: "Haircut",
    scheduledDate: "5 Aug 2025 (12:00 AM - 12:15 AM)",
    price: "€ 170",
    status: "Confirmed",
  },
  {
    id: "005",
    clientName: "Sophie Chen",
    clientAvatar: "/avatar/icon2.png",
    clientPhone: "+86 138 0013 8000",
    service: "Haircut",
    scheduledDate: "5 Aug 2025 (12:00 AM - 12:15 AM)",
    price: "€ 170",
    status: "Arrived",
  },
  {
    id: "006",
    clientName: "Saeed",
    clientAvatar: "/avatar/icon3.png",
    clientPhone: "+971 50 123 4567",
    service: "Haircut",
    scheduledDate: "5 Aug 2025 (12:00 AM - 12:15 AM)",
    price: "€ 170",
    status: "Completed",
  },
  {
    id: "007",
    clientName: "Hasan",
    clientAvatar: "/avatar/icon1.png",
    clientPhone: "+20 10 9876 5432",
    service: "Haircut",
    scheduledDate: "5 Aug 2025 (12:00 AM - 12:15 AM)",
    price: "€ 170",
    status: "Arrived",
  },
  {
    id: "008",
    clientName: "Aisha",
    clientAvatar: "/avatar/icon2.png",
    clientPhone: "+92 300 1234567",
    service: "Haircut",
    scheduledDate: "5 Aug 2025 (12:00 AM - 12:15 AM)",
    price: "€ 170",
    status: "Arrived",
  },
  {
    id: "009",
    clientName: "Fatima",
    clientAvatar: "/avatar/icon3.png",
    clientPhone: "+971 55 987 6543",
    service: "Haircut",
    scheduledDate: "5 Aug 2025 (12:00 AM - 12:15 AM)",
    price: "€ 170",
    status: "Canceled",
  },
  {
    id: "010",
    clientName: "Ali",
    clientAvatar: "/avatar/icon1.png",
    clientPhone: "+92 333 9876543",
    service: "Haircut",
    scheduledDate: "5 Aug 2025 (12:00 AM - 12:15 AM)",
    price: "€ 170",
    status: "Booked",
  },
];

export const statusStyles: Record<Status, string> = {
  Booked: "bg-[#DDDBFF] text-[#635BFF]",
  Confirmed: "bg-[#ECFDFD] text-[#16CDC7]",
  Arrived: "bg-[#FFF9E5] text-[#FFD648]",
  Started: "bg-[#F6F7F9] text-[#0A2540]",
  Completed: "bg-[#EBFAF0] text-[#36C76C]",
  Canceled: "bg-[#FFE5ED] text-[#FF6692]",
};

export const recentMembers = [
  {
    name: "Shah Aman",
    phone: "+39 345 678 9123",
    clientAvatar: "/avatar/icon1.png",
  },
  {
    name: "John Doe",
    phone: "+1 234 567 8901",
    clientAvatar: "/avatar/icon2.png",
  },
  {
    name: "Elena Rossi",
    phone: "+39 123 456 7890",
    clientAvatar: "/avatar/icon3.png",
  },
  {
    name: "Alex Smith",
    phone: "+44 7700 900077",
    clientAvatar: "/avatar/icon1.png",
  },
  {
    name: "Sophie Chen",
    phone: "+86 138 0013 8000",
    clientAvatar: "/avatar/icon2.png",
  },
];

export const statusFilters: (Status | "All")[] = [
  "All",
  "Booked",
  "Confirmed",
  "Arrived",
  "Started",
  "Completed",
  "Canceled",
];

export const LANGUAGES = ["English (US)", "Spanish", "French"];

export const COUNTRIES = ["United States", "United Kingdom", "Canada"];

export const DATE_FORMATS = ["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"];

export const TIME_FORMATS = ["12h", "24h"];

export const TIMEZONES = ["EST", "PST", "CST", "MST", "GMT"];

export const DURATIONS = ["15", "30", "45", "60"];

export const WEEKDAYS = ["Saturday", "Sunday", "Monday"];

export const MOCK_IMPORTED_APPOINTMENTS = [
  {
    id: "#001",
    startAt: "20/05/2025 10:15",
    endAt: "20/05/2025 12:25",
    clientRef: "#037",
    serviceRef: "#501",
    staffRef: "#031",
    status: "Booked",
    note: "Lorem ipsum...",
  },
  {
    id: "#002",
    startAt: "20/05/2025 12:15",
    endAt: "20/05/2025 13:25",
    clientRef: "#022",
    serviceRef: "#501",
    staffRef: "#032",
    status: "Started",
    note: "Lorem ipsum...",
  },
  {
    id: "#003",
    startAt: "20/05/2025 12:15",
    endAt: "20/05/2025 13:25",
    clientRef: "#037",
    serviceRef: "#501",
    staffRef: "#031",
    status: "Cancelled",
    note: "Lorem ipsum...",
  },
  {
    id: "#004",
    startAt: "20/05/2025 12:15",
    endAt: "20/05/2025 13:25",
    clientRef: "#022",
    serviceRef: "#501",
    staffRef: "#032",
    status: "Confirmed",
    note: "Lorem ipsum...",
  },
  {
    id: "#005",
    startAt: "20/05/2025 12:15",
    endAt: "20/05/2025 13:25",
    clientRef: "#037",
    serviceRef: "#501",
    staffRef: "#031",
    status: "Arrived",
    note: "Lorem ipsum...",
  },
  {
    id: "#006",
    startAt: "20/05/2025 12:15",
    endAt: "20/05/2025 13:25",
    clientRef: "#022",
    serviceRef: "#501",
    staffRef: "#032",
    status: "Completed",
    note: "Lorem ipsum...",
  },
  {
    id: "#007",
    startAt: "20/05/2025 12:15",
    endAt: "20/05/2025 13:25",
    clientRef: "#037",
    serviceRef: "#501",
    staffRef: "#031",
    status: "Arrived",
    note: "Lorem ipsum...",
  },
  {
    id: "#008",
    startAt: "20/05/2025 12:45",
    endAt: "20/05/2025 13:55",
    clientRef: "#022",
    serviceRef: "#501",
    staffRef: "#032",
    status: "Arrived",
    note: "Lorem ipsum...",
  },
  {
    id: "#009",
    startAt: "20/05/2025 13:15",
    endAt: "20/05/2025 15:25",
    clientRef: "#037",
    serviceRef: "#501",
    staffRef: "#031",
    status: "Cancelled",
    note: "Lorem ipsum...",
  },
];

import { Client } from "@/@types/salon-owner/Client.type";
import { ServiceRow } from "@/@types/salon-owner/service.type";
import {
  ReviewServiceRow,
  TipOption,
  ModalClient,
  ModalService,
  ClientNoteItem,
} from "./types";
import { AppStatus } from "@/@types/salon-owner/CalAppointment.type";

export const RECENT_CLIENTS: Client[] = [
  {
    id: "c1",
    name: "Maria Fernandez",
    phone: "+39 345 678 9123",
    avatar: "/avatar/icon1.png",
  },
  {
    id: "c2",
    name: "Virgie Sutton",
    phone: "+39 345 678 9123",
    avatar: "/avatar/icon2.png",
  },
  {
    id: "c3",
    name: "Virgie Sutton",
    phone: "+39 345 678 9123",
    avatar: "/avatar/icon3.png",
  },
  {
    id: "c4",
    name: "Lois Gregory",
    phone: "Staff",
    avatar: "/avatar/icon1.png",
    isStaff: true,
  },
];

export const PAYMENT_SERVICES: ServiceRow[] = [
  {
    id: "sr1",
    name: "Haircut",
    date: "02/08/2025",
    price: "170",
    startTime: "11:00",
    duration: "15 min",
    employee: "Maria Rodriguez",
    employeeAvatar: "/images/avator.png",
  },
  {
    id: "sr2",
    name: "Makeup",
    date: "02/08/2025",
    price: "170",
    startTime: "11:15",
    duration: "45 min",
    employee: "Maria Rodriguez",
    employeeAvatar: "/images/avator.png",
  },
];

export const INITIAL_REVIEW_SERVICES: ReviewServiceRow[] = [
  {
    id: "sr1",
    name: "Haircut",
    date: "02/08/2025",
    price: 170,
    startTime: "11:00",
    duration: "15 min",
    employee: "Maria Rodriguez",
    employeeAvatar: "/avatar/icon1.png",
  },
];

export const TIP_OPTIONS: TipOption[] = [
  { label: "No Tip", pct: 0, amount: null },
  { label: "10%", pct: 10, amount: "€ 13,20" },
  { label: "18%", pct: 18, amount: "€ 23,76" },
  { label: "25%", pct: 25, amount: "€ 33" },
  { label: "35%", pct: 35, amount: "€ 46,20" },
  { label: "45%", pct: 45, amount: "€ 59,40" },
  { label: "Custom Tip", pct: -1, amount: null },
];

export const EMPLOYEE_OPTIONS = ["Maria Rodriguez", "John Smith", "Sarah Lee"];
export const DISCOUNT_TYPES = ["Percentage", "Fixed Amount"];
export const SLOT_DURATION_OPTIONS = [5, 10, 15, 30, 60, 90];

export const PAYMENT_METHOD_OPTIONS = [
  { key: "cash", label: "Cash" },
  { key: "gift", label: "Gift Card" },
  { key: "card", label: "Card Terminal" },
  { key: "online", label: "Online Payment" },
];

export const UPFRONT_PAYMENT_METHODS = [
  { key: "cash", label: "Cash" },
  { key: "giftcard", label: "Gift Card" },
  { key: "card", label: "Card Terminal" },
  { key: "online", label: "Online Payment" },
];

export const DUMMY_CLIENTS: ModalClient[] = [
  {
    id: "1",
    name: "Sofia Rossi",
    email: "sofia@beauty.com",
    phone: "+39 345 678 9123",
    photo: "",
    notes: "Promised 10% discount on next haircut. Check before payment.",
    giftCards: 1,
    giftCardDetails: {
      dateOfIssue: "02/09/2025",
      dateOfExpiration: "06/20/2026",
      amount: "€ 50",
      usageLimit: "1",
      eligibleServices: ["Haircut", "Blowdry"],
      receiverName: "Sofia Rossi",
      gifterName: "Marco Rossi",
      personalMessage: "Happy birthday my love!",
    },
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael@beauty.com",
    phone: "+39 345 678 9124",
    photo: "",
    notes: "",
    giftCards: 0,
    giftCardDetails: null,
  },
];

export const DUMMY_SERVICES: ModalService[] = [
  { id: "s1", name: "Haircut", duration: "30m", price: "€ 30" },
  { id: "s2", name: "Blowdry", duration: "30m", price: "€ 25" },
  { id: "s3", name: "Coloring", duration: "90m", price: "€ 80" },
  { id: "s4", name: "Haircut & Blowdry", duration: "60m", price: "€ 50" },
  { id: "s5", name: "Highlights", duration: "100m", price: "€ 120" },
];

export const modalStatusOptions: AppStatus[] = ["Booked", "Confirmed"];

export const MOCK_RECEIPTS = [
  "Receipt #1024 - € 50",
  "Receipt #1025 - € 30",
  "Receipt #1026 - € 120",
];

export const INITIAL_CLIENT_NOTES_MAP: Record<string, ClientNoteItem[]> = {
  "1": [
    {
      id: "n1",
      text: "Promised 10% discount on next haircut. Check before payment.",
      date: "15 Aug 2025, 10:30 AM",
      author: "Maria Rodriguez",
    },
    {
      id: "n2",
      text: "Prefers organic shampoo and low heat during blowdry.",
      date: "02 Jul 2025, 02:15 PM",
      author: "Hasan Siam",
    },
    {
      id: "n3",
      text: "Allergic to certain ammonia hair dyes. Always use gentle dye.",
      date: "14 May 2025, 11:00 AM",
      author: "Staff",
    },
  ],
};
