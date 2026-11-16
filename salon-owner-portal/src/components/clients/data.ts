import { Repeat, Heart, Coins } from "lucide-react";

export type AllergyColor = "red" | "green" | "blue" | "yellow" | "purple" | "pink" | "orange";

export interface ClientData {
  id: string;
  name: string;
  email: string;
  telephone: string;
  lastAppointment: string;
  allergy: {
    name: string;
    color: AllergyColor;
  };
  createdAt: string;
  avatarUrl: string;
  avatarBg: string;
}

const generateMockClients = (): ClientData[] => {
  const clients: ClientData[] = [];
  const colors: AllergyColor[] = ["yellow", "purple", "pink"];
  const bgs = ["bg-[#FCE7F3]", "bg-[#E2E8F0]", "bg-[#CCFBF1]", "bg-[#FEE2E2]", "bg-[#E0E7FF]"];

  for (let i = 1; i <= 25; i++) {
    clients.push({
      id: `client_${i}`,
      name: "Maria Rodriguez",
      email: "maria@beautywellness.com",
      telephone: "+39 345 678 9123",
      lastAppointment: "02/09/2025",
      allergy: {
        name: "Fragrances Allergie",
        color: colors[i % 3] as AllergyColor
      },
      createdAt: "08/08/2024",
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=Maria${i}&backgroundColor=transparent`,
      avatarBg: bgs[i % 5]
    });
  }
  return clients;
};

export const dummyClientsData = generateMockClients();

import { ImportedClient } from "./types";

export const MOCK_IMPORTED_CLIENTS: ImportedClient[] = [
  { id: "#001", firstName: "Maria", lastName: "Rodriguez", phone: "+39 345 678 9123", email: "email@email.com", consent: "yes", birthDate: "02/01/1990", status: "pending" },
  { id: "#002", firstName: "Maria", lastName: "Rodriguez", phone: "+39 345 678 9123", email: "email@email.com", consent: "no", birthDate: "02/01/1990", status: "pending" },
  { id: "#003", firstName: "Maria", lastName: "Rodriguez", phone: "+39 345 678 9123", email: "email@email.com", consent: "yes", birthDate: "02/01/1990", status: "pending" },
  { id: "#004", firstName: "Maria", lastName: "Rodriguez", phone: "+39 345 678 9123", email: "email@email.com", consent: "no", birthDate: "02/01/1990", status: "pending" },
  { id: "#005", firstName: "Maria", lastName: "Rodriguez", phone: "+39 345 678 9123", email: "email@email.com", consent: "no", birthDate: "02/01/1990", status: "pending" },
  { id: "#006", firstName: "Maria", lastName: "Rodriguez", phone: "+39 345 678 9123", email: "email@email.com", consent: "yes", birthDate: "02/01/1990", status: "pending" },
  { id: "#007", firstName: "Maria", lastName: "Rodriguez", phone: "+39 345 678 9123", email: "email@email.com", consent: "no", birthDate: "02/01/1990", status: "pending" },
  { id: "#008", firstName: "Maria", lastName: "Rodriguez", phone: "+39 345 678 9123", email: "email@email.com", consent: "yes", birthDate: "02/01/1990", status: "pending" },
  { id: "#009", firstName: "Maria", lastName: "Rodriguez", phone: "+39 345 678 9123", email: "email@email.com", consent: "no", birthDate: "02/01/1990", status: "pending" },
];

import {
  ClientAppointmentItem,
  ClientReceiptItem,
  ClientGiftCardItem,
  ClientNoteItem,
  ClientMediaItem,
} from "./types";

export const MOCK_CLIENT_APPOINTMENTS: ClientAppointmentItem[] = [
  {
    id: "#APT-001",
    service: "Hair Cut & Styling",
    category: "Hair",
    date: "14/02/2025",
    time: "10:30 AM",
    staff: "Sofia Loren",
    staffAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia",
    price: "€ 65.00",
    status: "Completed",
  },
  {
    id: "#APT-002",
    service: "Balayage Treatment",
    category: "Color",
    date: "28/01/2025",
    time: "02:00 PM",
    staff: "Marco Rossi",
    staffAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marco",
    price: "€ 140.00",
    status: "Completed",
  },
  {
    id: "#APT-003",
    service: "Deep Moisture Mask",
    category: "Care",
    date: "10/01/2025",
    time: "11:15 AM",
    staff: "Elena Bianchi",
    staffAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
    price: "€ 45.00",
    status: "Completed",
  },
  {
    id: "#APT-004",
    service: "Full Restyle & Blowout",
    category: "Hair",
    date: "25/02/2025",
    time: "03:30 PM",
    staff: "Sofia Loren",
    staffAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia",
    price: "€ 85.00",
    status: "Pending",
  },
];

export const MOCK_CLIENT_RECEIPTS: ClientReceiptItem[] = [
  {
    id: "rec-1",
    receiptNumber: "REC-2025-0089",
    date: "14/02/2025 11:45",
    operator: "Sofia Loren",
    total: "€ 65.00",
    paymentMethod: "Credit Card",
    status: "Paid",
  },
  {
    id: "rec-2",
    receiptNumber: "REC-2025-0045",
    date: "28/01/2025 15:30",
    operator: "Marco Rossi",
    total: "€ 140.00",
    paymentMethod: "Credit Card",
    status: "Paid",
  },
  {
    id: "rec-3",
    receiptNumber: "REC-2025-0012",
    date: "10/01/2025 12:00",
    operator: "Elena Bianchi",
    total: "€ 45.00",
    paymentMethod: "Cash",
    status: "Paid",
  },
];

export const MOCK_CLIENT_GIFT_CARDS: ClientGiftCardItem[] = [
  {
    id: "gc-1",
    code: "GIFT-7890-WINTER",
    amount: "€ 100.00",
    remainingAmount: "€ 45.00",
    expirationDate: "31/12/2025",
    status: "Active",
  },
  {
    id: "gc-2",
    code: "GIFT-1123-BIRTHDAY",
    amount: "€ 50.00",
    remainingAmount: "€ 0.00",
    expirationDate: "15/01/2025",
    status: "Exhausted",
  },
];

export const MOCK_CLIENT_NOTES: ClientNoteItem[] = [
  {
    id: "note-1",
    title: "Prefers Ammonia-Free Color",
    content: "Client has sensitive scalp. Always use organic/ammonia-free hair dye lines (Wella Illumina or Koleston Innosense).",
    date: "14/02/2025",
    author: "Sofia Loren",
  },
  {
    id: "note-2",
    title: "Tea & Coffee Preference",
    content: "Prefers green tea with lemon, no sugar.",
    date: "28/01/2025",
    author: "Marco Rossi",
  },
];

export const MOCK_CLIENT_MEDIA: ClientMediaItem[] = [
  {
    id: "med-1",
    fileName: "before_balayage_jan25.jpg",
    date: "28/01/2025",
    size: "2.4 MB",
    url: "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "med-2",
    fileName: "after_balayage_jan25.jpg",
    date: "28/01/2025",
    size: "3.1 MB",
    url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=400&auto=format&fit=crop",
  },
];


// Type definitions for client details demo data
export interface ClientNote {
  id: string;
  title: string;
  description: string;
  attachmentsCount?: number;
  attachmentName?: string;
  date?: string;
}

export interface ClientCommunicationLog {
  id: number;
  channel: string;
  title: string;
  employee: string;
  date: string;
  time: string;
  status: string;
  source: string;
}

export interface ClientMediaFile {
  id: number;
  type: "Photo" | "Video";
  fileName: string;
  date: string;
  url: string;
  thumbnail?: string;
}

export interface ClientTimelineAppointment {
  dateLine1: string;
  dateLine2: string;
  title: string;
  status: string;
  statusColor: string;
  details: string;
  price: string;
  priceStatus: string;
}

export interface PreferredStaffMember {
  id: number;
  name: string;
  role: string;
  image: string;
  bgColor: string;
  alt: string;
}

export interface FrequentClientService {
  id: number;
  name: string;
}

export interface ClientAuditLogEntry {
  date: string;
  field: string;
  prev: string;
  new: string;
  user: string;
  action: string;
  actionColor: string;
}

export interface ClientServiceModalItem {
  title: string;
  staff: string;
  time: string;
  price: string;
}

export interface EmployeeBreakdownSummary {
  id: number;
  name: string;
  totalEarned: string;
  avatarUrl: string;
}

export interface ClientFinancialReceiptRow {
  id: string;
  member: string;
  service: string;
  date: string;
  price: string;
  payment: string;
  status: string;
}

export interface ClientDetailGiftCardItem {
  id: number;
  code: string;
  amount: string;
  image: string;
  isUsed: boolean;
}

export interface ClientChartDataSet {
  labels: string[];
  data: number[];
  total: string;
  change: string;
  trend: "up" | "down";
}

// Filter and dropdown options
export const DEFAULT_CLIENT_TAGS: string[] = [
  "VIP",
  "New Client",
  "Frequent Canceler",
];

export const CHART_FILTER_OPTIONS: string[] = [
  "Last 7 days",
  "Last 14 days",
  "Last Month",
];

export const MEDIA_DATE_OPTIONS: string[] = [
  "Last 7 Days",
  "Last 14 Days",
  "Last Month",
  "Last Year",
];

export const APPOINTMENT_DATE_OPTIONS: string[] = [
  "Last 7 days",
  "Last 14 days",
  "Last Month",
  "Last 3 Months",
  "Custom Range",
];

export const APPOINTMENT_STATUS_OPTIONS: string[] = [
  "All",
  "Booked",
  "Confirmed",
  "Arrived",
  "Started",
  "Completed",
  "Canceled",
  "No-show",
];

export const MEDIA_TYPE_OPTIONS: string[] = ["All type", "Photo", "Video"];

// Chart datasets
export const MOCK_CLIENT_CHART_DATA: Record<string, ClientChartDataSet> = {
  "Last 7 days": {
    labels: ["Sep 1", "Sep 2", "Sep 3", "Sep 4", "Sep 5", "Sep 6", "Sep 7"],
    data: [150, 250, 410, 300, 550, 350, 600],
    total: "€ 1,358",
    change: "+12%",
    trend: "up",
  },
  "Last 14 days": {
    labels: [
      "Aug 25",
      "Aug 27",
      "Aug 29",
      "Aug 31",
      "Sep 2",
      "Sep 4",
      "Sep 6",
    ],
    data: [200, 350, 300, 450, 400, 500, 750],
    total: "€ 2,450",
    change: "+18%",
    trend: "up",
  },
  "Last Month": {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    data: [1200, 1500, 1400, 1800],
    total: "€ 5,100",
    change: "+25%",
    trend: "up",
  },
};

export const getClientSpendingChartData = (
  filter: string,
): ClientChartDataSet => {
  return MOCK_CLIENT_CHART_DATA[filter] || MOCK_CLIENT_CHART_DATA["Last Month"];
};

// Notes
export const initialClientNotes: ClientNote[] = [
  {
    id: "1",
    title: "Client Consultation & Preferences",
    description:
      "Prefers organic ammonia-free hair dye. Sensitive scalp condition noted on temple areas.",
    attachmentsCount: 1,
    attachmentName: "scalp_consultation.pdf",
    date: "Aug 10, 2025",
  },
  {
    id: "2",
    title: "Allergy & Skin Test Record",
    description:
      "Patch test conducted for L'Oreal Inoa shade 6.1. No adverse reaction observed after 48h.",
    attachmentsCount: 1,
    attachmentName: "patch_test_results.pdf",
    date: "Aug 05, 2025",
  },
  {
    id: "3",
    title: "Styling & Finish Preferences",
    description:
      "Requested soft layered blowout with Dyson Supersonic. Avoid heavy silicon oils.",
    attachmentsCount: 0,
    date: "Jul 28, 2025",
  },
  {
    id: "4",
    title: "Product Recommendations",
    description:
      "Recommended Kerastase Nutritive shampoo and mask for home care routine.",
    attachmentsCount: 1,
    attachmentName: "recommended_products.pdf",
    date: "Jul 15, 2025",
  },
];

// Communication logs
export const mockCommunicationLogs: ClientCommunicationLog[] = [
  {
    id: 1,
    channel: "WhatsApp",
    title: "New appointment scheduled for tomorrow at 3 PM",
    employee: "Employee Name",
    date: "07/08/2025",
    time: "11:44",
    status: "Delivered",
    source: "Staff Member",
  },
  {
    id: 2,
    channel: "Email",
    title: "New appointment scheduled for tomorrow at 3 PM",
    employee: "System",
    date: "07/08/2025",
    time: "11:44",
    status: "Delivered",
    source: "System",
  },
  {
    id: 3,
    channel: "SMS",
    title: "New appointment scheduled for tomorrow at 3 PM",
    employee: "System",
    date: "07/08/2025",
    time: "11:44",
    status: "Sent",
    source: "System",
  },
  {
    id: 4,
    channel: "WhatsApp",
    title: "New appointment scheduled for tomorrow at 3 PM",
    employee: "Employee Name",
    date: "07/08/2025",
    time: "11:44",
    status: "Read",
    source: "Staff Member",
  },
  {
    id: 5,
    channel: "WhatsApp",
    title: "New appointment scheduled for tomorrow at 3 PM",
    employee: "Employee Name",
    date: "07/08/2025",
    time: "11:44",
    status: "Failed",
    source: "Staff Member",
  },
  {
    id: 6,
    channel: "Email",
    title: "New appointment scheduled for tomorrow at 3 PM",
    employee: "Employee Name",
    date: "07/08/2025",
    time: "11:44",
    status: "Failed",
    source: "Staff Member",
  },
  {
    id: 7,
    channel: "Email",
    title: "New appointment scheduled for tomorrow at 3 PM",
    employee: "Employee Name",
    date: "07/08/2025",
    time: "11:44",
    status: "Failed",
    source: "Staff Member",
  },
];

// Media gallery
export const mockMedia: ClientMediaFile[] = [
  {
    id: 1,
    type: "Photo",
    fileName: "Haircut_Front.jpeg",
    date: "08/09/2025 5:06 PM",
    url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
  },
  {
    id: 2,
    type: "Video",
    fileName: "Coloring_Process.mp4",
    date: "08/09/2025 5:15 PM",
    url: "https://www.w3schools.com/html/mov_bbb.mp4",
    thumbnail:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
  },
  {
    id: 3,
    type: "Photo",
    fileName: "Haircut_Back.jpeg",
    date: "08/09/2025 5:30 PM",
    url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
  },
];

// Appointments list
export const mockAppointments: ClientTimelineAppointment[] = [
  {
    dateLine1: "1 AUG",
    dateLine2: "2025",
    title: "Haircut",
    status: "Booked",
    statusColor: "text-[#635BFF] bg-[#EEF2FF]",
    details: "17:00 • 15 min • Sophia Ventura - Angelica Last",
    price: "€ 170",
    priceStatus: "Expected",
  },
  {
    dateLine1: "1 AUG",
    dateLine2: "2025",
    title: "Hair Color",
    status: "Confirmed",
    statusColor: "text-[#14B8A6] bg-[#CCFBF1]",
    details: "17:00 • 15 min • Sophia Ventura - Angelica Last",
    price: "€ 170",
    priceStatus: "Expected",
  },
  {
    dateLine1: "1 AUG",
    dateLine2: "2025",
    title: "Blow Dry",
    status: "Arrived",
    statusColor: "text-[#EAB308] bg-[#FEFCE8]",
    details: "17:00 • 15 min • Sophia Ventura - Angelica Last",
    price: "€ 170",
    priceStatus: "Expected",
  },
  {
    dateLine1: "1 AUG",
    dateLine2: "2025",
    title: "Blow Dry",
    status: "Started",
    statusColor: "text-[#0EA5E9] bg-[#E0F2FE]",
    details: "17:00 • 15 min • Sophia Ventura - Angelica Last",
    price: "€ 170",
    priceStatus: "Expected",
  },
  {
    dateLine1: "1 AUG",
    dateLine2: "2025",
    title: "Blow Dry",
    status: "Completed",
    statusColor: "text-[#10B981] bg-[#DCFCE7]",
    details: "17:00 • 15 min • Sophia Ventura - Angelica Last",
    price: "€ 170",
    priceStatus: "Paid",
  },
  {
    dateLine1: "1 AUG",
    dateLine2: "2025",
    title: "Blow Dry",
    status: "Canceled",
    statusColor: "text-[#F43F5E] bg-[#FFE4E6]",
    details: "17:00 • 15 min • Sophia Ventura - Angelica Last",
    price: "€ 170",
    priceStatus: "Expected",
  },
  {
    dateLine1: "1 AUG",
    dateLine2: "2025",
    title: "Blow Dry",
    status: "No-show",
    statusColor: "text-[#F43F5E] bg-white border border-[#F43F5E]",
    details: "17:00 • 15 min • Sophia Ventura - Angelica Last",
    price: "€ 170",
    priceStatus: "Expected",
  },
];

// Preferred staff
export const mockPreferredStaff: PreferredStaffMember[] = [
  {
    id: 1,
    name: "Lola Ortega",
    role: "Staff",
    image: "/avatar/icon1.png",
    bgColor: "bg-[#FFE4E6]",
    alt: "Lola",
  },
  {
    id: 2,
    name: "Virgie Sutton",
    role: "Staff",
    image: "/avatar/icon2.png",
    bgColor: "bg-[#F1F5F9]",
    alt: "Virgie",
  },
  {
    id: 3,
    name: "Lois Gregory",
    role: "Staff",
    image: "/avatar/icon3.png",
    bgColor: "bg-[#CCFBF1]",
    alt: "Lois",
  },
];

// Frequent services
export const mockFrequentServices: FrequentClientService[] = [
  { id: 1, name: "Haircuts" },
  { id: 2, name: "Coloring" },
  { id: 3, name: "Treatments" },
];

// Audit logs
export const mockAuditLogs: ClientAuditLogEntry[] = [
  {
    date: "5 Aug 2023, 09:44 AM",
    field: "Phone",
    prev: "+39 455 330 212",
    new: "+39 556 909 212",
    user: "Virgie Sutton",
    action: "Update",
    actionColor: "text-[#10B981] bg-[#DCFCE7]",
  },
  {
    date: "5 Aug 2023, 09:44 AM",
    field: "Address",
    prev: "Independance Street 54/r",
    new: "Independance Street 54/r",
    user: "Virgie Sutton",
    action: "Update",
    actionColor: "text-[#10B981] bg-[#DCFCE7]",
  },
  {
    date: "5 Aug 2023, 09:44 AM",
    field: "Email",
    prev: "anna@bellavista.com",
    new: "anna@gmail.com",
    user: "Lola Ortega",
    action: "Update",
    actionColor: "text-[#10B981] bg-[#DCFCE7]",
  },
  {
    date: "5 Aug 2023, 09:44 AM",
    field: "Email",
    prev: "anna@gmail.com",
    new: "anna@bellavista.com",
    user: "Lola Ortega",
    action: "Update",
    actionColor: "text-[#10B981] bg-[#DCFCE7]",
  },
  {
    date: "5 Aug 2023, 09:44 AM",
    field: "Profile Creation",
    prev: "-",
    new: "-",
    user: "Lola Gregory",
    action: "Created",
    actionColor: "text-[#635BFF] bg-[#EEF2FF]",
  },
];

// Appointment modal services list
export const mockAppointmentServices: ClientServiceModalItem[] = [
  {
    title: "Shampoo",
    staff: "Angelica",
    time: "12:00-12:05",
    price: "€ 170",
  },
  {
    title: "Haircut",
    staff: "Angelica",
    time: "12:05-12:50",
    price: "€ 170",
  },
  {
    title: "Blow Dry",
    staff: "Angelica",
    time: "12:50-13:05",
    price: "€ 170",
  },
];

// Employee breakdown
export const mockEmployeeBreakdown: EmployeeBreakdownSummary[] = [
  1, 2, 3, 4, 5, 6, 7, 8,
].map((item) => ({
  id: item,
  name: "Barney",
  totalEarned: "€ 1,700",
  avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=Staff${item}`,
}));

// Financial receipts
export const mockFinancialReceipts: ClientFinancialReceiptRow[] = [
  {
    id: "#0025",
    member: "Maria Rodriguez",
    service: "Haircut",
    date: "8 Aug 2025, 08:00 AM - 10:15 AM",
    price: "€ 170",
    payment: "Cash",
    status: "Pending",
  },
  {
    id: "#0026",
    member: "Maria Rodriguez",
    service: "Haircut",
    date: "8 Aug 2025, 12:00 PM - 02:15 PM",
    price: "€ 170",
    payment: "Cash",
    status: "Returned",
  },
  {
    id: "#0027",
    member: "Maria Rodriguez",
    service: "Haircut",
    date: "8 Aug 2025, 18:30 PM - 20:15 PM",
    price: "€ 170",
    payment: "On Card",
    status: "Returned",
  },
  {
    id: "#0028",
    member: "Maria Rodriguez",
    service: "Haircut",
    date: "8 Aug 2025, 08:00 AM - 10:15 AM",
    price: "€ 170",
    payment: "Credit Card",
    status: "Paid",
  },
  {
    id: "#0029",
    member: "Maria Rodriguez",
    service: "Haircut",
    date: "8 Aug 2025, 12:00 PM - 02:15 PM",
    price: "€ 170",
    payment: "Credit Card",
    status: "Pending",
  },
];

// Gift cards
export const mockClientGiftCards: ClientDetailGiftCardItem[] = [
  {
    id: 1,
    code: "#002",
    amount: "€ 200",
    image: "/cards/c1.png",
    isUsed: true,
  },
  {
    id: 2,
    code: "#002",
    amount: "€ 200",
    image: "/cards/c3.png",
    isUsed: false,
  },
  {
    id: 3,
    code: "#002",
    amount: "€ 200",
    image: "/cards/c3.png",
    isUsed: false,
  },
];
