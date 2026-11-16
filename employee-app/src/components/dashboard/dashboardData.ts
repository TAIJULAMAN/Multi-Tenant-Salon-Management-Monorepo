// Mock data for the employee Dashboard (Figma "Milestone 4 - Employee" › Dashboard).

export type StatIcon =
  | "wallet-outline"
  | "cash-outline"
  | "accessibility-outline"
  | "people-outline";

export interface DashboardStat {
  id: string;
  title: string;
  value: string;
  change?: string;
  badge?: string;
  iconName: StatIcon;
  iconBg: string;
  /** Vertical gradient (top → bottom) of the card background. */
  gradient: [string, string];
}

// Copy follows the Figma frame 1:32440 (spelling typos in the design — "Appoiments", "Performace" — are corrected).
export const dashboardStats: DashboardStat[] = [
  {
    id: "completed",
    title: "Appointments Completed (Last 30 days)",
    value: "45",
    change: "+10.5% from last month",
    iconName: "wallet-outline",
    iconBg: "#635BFF",
    gradient: ["#EDECFF", "#F9F9FF"],
  },
  {
    id: "booked",
    title: "Appointments Book Now (Last 30 days)",
    value: "52",
    change: "+20% from last month",
    iconName: "cash-outline",
    iconBg: "#16CDC7",
    gradient: ["#E2F9F8", "#F7FDFD"],
  },
  {
    id: "retention",
    title: "Retention Rate",
    value: "68%",
    change: "+20% from last month",
    iconName: "accessibility-outline",
    iconBg: "#F8C30D",
    gradient: ["#FEF7E0", "#FFFDF7"],
  },
  {
    id: "performance",
    title: "Performance",
    value: "133%",
    badge: "Goal Achieved",
    iconName: "people-outline",
    iconBg: "#36C76C",
    gradient: ["#E2F9F8", "#F7FDFD"],
  },
];

// ─── Performance goals ────────────────────────────────────────────────
export const GOAL_TYPES = [
  "Revenue",
  "Number of appointments",
  "Average ticket",
  "Occupancy rate",
  "Client retention",
] as const;
export type GoalType = (typeof GOAL_TYPES)[number];

export const GOAL_PERIODS = [
  "Monthly",
  "Weekly",
  "Custom (start date / end date)",
] as const;
export type GoalPeriod = (typeof GOAL_PERIODS)[number];

export type GoalStatus = "on-track" | "attention" | "at-risk";

export interface PerformanceGoal {
  id: string;
  type: GoalType;
  period: GoalPeriod;
  current: number;
  target: number;
  startDate?: string;
  endDate?: string;
}

export const initialGoals: PerformanceGoal[] = [
  { id: "g1", type: "Revenue", period: "Monthly", current: 1782, target: 2500 },
  {
    id: "g2",
    type: "Number of appointments",
    period: "Monthly",
    current: 12,
    target: 50,
  },
  {
    id: "g3",
    type: "Average ticket",
    period: "Monthly",
    current: 39,
    target: 199,
  },
];

export const goalStatusMeta: Record<
  GoalStatus,
  { label: string; color: string; bg: string; text: string; message: string }
> = {
  "on-track": {
    label: "You're on track!",
    color: "#36C76C",
    bg: "#36C76C",
    text: "#FFFFFF",
    message: "Progress is aligned with the expected pace for this period.",
  },
  attention: {
    label: "Attention",
    color: "#FFD648",
    bg: "#FFD648",
    text: "#FFFFFF",
    message:
      "Progress is slightly below the ideal pace. Consider taking action to boost results.",
  },
  "at-risk": {
    label: "Goal at risk",
    color: "#FF6692",
    bg: "#FF6692",
    text: "#FFFFFF",
    message: "At the current pace, this goal may not be reached on time.",
  },
};

export function getGoalStatus(goal: PerformanceGoal): GoalStatus {
  const ratio = goal.target > 0 ? goal.current / goal.target : 0;
  if (ratio >= 0.6) return "on-track";
  if (ratio >= 0.22) return "attention";
  return "at-risk";
}

const euro = (n: number, decimals = 2) =>
  `${n.toLocaleString("de-DE", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })} €`;

export function formatGoalValue(
  type: GoalType,
  value: number,
  isTarget = false,
): string {
  switch (type) {
    case "Revenue":
      return euro(value);
    case "Average ticket":
      return euro(value, 0);
    case "Occupancy rate":
    case "Client retention":
      return `${value}%`;
    default:
      return isTarget ? `${value}` : `${value}`;
  }
}

// ─── Agenda ───────────────────────────────────────────────────────────
export type StepStatus = "Overdue" | "To Do" | "Ongoing" | "Completed";

export interface BookingStep {
  number: number;
  status: StepStatus;
  time: string;
  service: string;
  staff: string;
}

export type AgendaStatus =
  "Booked" | "Confirmed" | "Arrived" | "Started" | "Completed" | "Cancelled";

export interface AgendaAppointment {
  id: string;
  date: string;
  name: string;
  phone: string;
  time: string;
  status: AgendaStatus;
  avatar: string;
  steps: BookingStep[];
}

const defaultSteps = (first: StepStatus = "Overdue"): BookingStep[] => [
  {
    number: 1,
    status: first,
    time: "12:00-12:05",
    service: "Shampoo",
    staff: "Angelica",
  },
  {
    number: 2,
    status: "To Do",
    time: "12:05-12:10",
    service: "Cut",
    staff: "Angelica",
  },
  {
    number: 3,
    status: "To Do",
    time: "12:10-12:15",
    service: "Blow Dry",
    staff: "Angelica",
  },
];

export const AGENDA_DATES = [
  "Sep 16, 2025",
  "Sep 17, 2025",
  "Sep 18, 2025",
  "Sep 19, 2025",
];

export const agendaAppointments: AgendaAppointment[] = [
  {
    id: "1",
    date: "Sep 16, 2025",
    name: "Maria Rodriguez",
    phone: "+39 345 678 9123",
    time: "12:00 AM - 12:15 AM",
    status: "Booked",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
    steps: defaultSteps("Overdue"),
  },
  {
    id: "2",
    date: "Sep 16, 2025",
    name: "Sophia Rossi",
    phone: "+39 345 678 9124",
    time: "12:15 AM - 12:30 AM",
    status: "Booked",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
    steps: defaultSteps("To Do"),
  },
  {
    id: "3",
    date: "Sep 16, 2025",
    name: "Elena Romano",
    phone: "+39 345 678 9125",
    time: "12:30 AM - 12:45 AM",
    status: "Confirmed",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80",
    steps: defaultSteps("To Do"),
  },
  {
    id: "4",
    date: "Sep 17, 2025",
    name: "Giulia Bianchi",
    phone: "+39 345 678 9126",
    time: "10:00 AM - 10:45 AM",
    status: "Booked",
    avatar:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=100&q=80",
    steps: defaultSteps("To Do"),
  },
  {
    id: "5",
    date: "Sep 18, 2025",
    name: "Valentina Costa",
    phone: "+39 345 678 9127",
    time: "09:30 AM - 10:15 AM",
    status: "Confirmed",
    avatar:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=100&q=80",
    steps: defaultSteps("To Do"),
  },
];

export const agendaStatusColors: Record<
  AgendaStatus,
  { bg: string; text: string }
> = {
  Booked: { bg: "#DDDBFF", text: "#635BFF" },
  Confirmed: { bg: "#ECFDFD", text: "#16CDC7" },
  Arrived: { bg: "#FFF9E5", text: "#E5B300" },
  Started: { bg: "#EFF4FA", text: "#29343D" },
  Completed: { bg: "#EBFAF0", text: "#36C76C" },
  Cancelled: { bg: "#FFE5ED", text: "#FF3E6C" },
};

export const stepStatusColors: Record<
  StepStatus,
  { circle: string; circleText: string; badgeBg: string; badgeText: string }
> = {
  Overdue: {
    circle: "#FFF9E5",
    circleText: "#FFD648",
    badgeBg: "#FFF9E5",
    badgeText: "#FFD648",
  },
  "To Do": {
    circle: "#98A4AE",
    circleText: "#FFFFFF",
    badgeBg: "#EFF4FA",
    badgeText: "#29343D",
  },
  Ongoing: {
    circle: "#635BFF",
    circleText: "#FFFFFF",
    badgeBg: "#F3F3FF",
    badgeText: "#635BFF",
  },
  Completed: {
    circle: "#36C76C",
    circleText: "#FFFFFF",
    badgeBg: "#EBFAF0",
    badgeText: "#36C76C",
  },
};

// ─── Charts ───────────────────────────────────────────────────────────
export const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export type ChartPeriod = "Monthly" | "Weekly" | "Yearly";

export const appointmentsSeries: Record<
  ChartPeriod,
  { labels: string[]; completed: number[]; cancelled: number[] }
> = {
  Monthly: {
    labels: MONTHS,
    completed: [70, 56, 88, 58, 30, 30, 30, 30, 30, 30, 30, 30],
    cancelled: [30, 36, 48, 26, 48, 48, 48, 48, 48, 48, 48, 48],
  },
  Weekly: {
    labels: ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"],
    completed: [14, 18, 12, 20, 16, 22, 19, 17],
    cancelled: [3, 2, 5, 1, 4, 2, 3, 2],
  },
  Yearly: {
    labels: ["2020", "2021", "2022", "2023", "2024", "2025"],
    completed: [320, 410, 480, 530, 590, 640],
    cancelled: [60, 55, 70, 64, 58, 52],
  },
};

export interface TopService {
  id: string;
  name: string;
  appointments: number;
}

export const topServices: Record<
  "Weekly" | "Monthly" | "Yearly",
  TopService[]
> = {
  Weekly: [
    { id: "s1", name: "Cut and Fold", appointments: 25 },
    { id: "s2", name: "Cut and Fold", appointments: 25 },
    { id: "s3", name: "Cut and Fold", appointments: 25 },
  ],
  Monthly: [
    { id: "s1", name: "Cut and Fold", appointments: 98 },
    { id: "s2", name: "Balayage", appointments: 64 },
    { id: "s3", name: "Blow Dry", appointments: 51 },
  ],
  Yearly: [
    { id: "s1", name: "Cut and Fold", appointments: 1120 },
    { id: "s2", name: "Balayage", appointments: 740 },
    { id: "s3", name: "Blow Dry", appointments: 615 },
  ],
};

export interface LoyalCustomer {
  id: string;
  name: string;
  lastVisit: string;
  appointments: number;
  totalSpent: string;
}

export const loyalCustomers: Record<
  "Weekly" | "Monthly" | "Yearly",
  LoyalCustomer[]
> = {
  Weekly: [
    {
      id: "c1",
      name: "Sofa Biachi",
      lastVisit: "November 27, 2024",
      appointments: 25,
      totalSpent: "€ 1,700",
    },
    {
      id: "c2",
      name: "Guy Hawkins",
      lastVisit: "October 04, 2024",
      appointments: 24,
      totalSpent: "€ 1,500",
    },
    {
      id: "c3",
      name: "Cameron Williamson",
      lastVisit: "December 20, 2024",
      appointments: 20,
      totalSpent: "€ 1,200",
    },
  ],
  Monthly: [
    {
      id: "c1",
      name: "Sofa Biachi",
      lastVisit: "November 27, 2024",
      appointments: 25,
      totalSpent: "€ 1,700",
    },
    {
      id: "c2",
      name: "Guy Hawkins",
      lastVisit: "October 04, 2024",
      appointments: 24,
      totalSpent: "€ 1,500",
    },
    {
      id: "c3",
      name: "Cameron Williamson",
      lastVisit: "December 20, 2024",
      appointments: 20,
      totalSpent: "€ 1,200",
    },
  ],
  Yearly: [
    {
      id: "c2",
      name: "Guy Hawkins",
      lastVisit: "October 04, 2024",
      appointments: 61,
      totalSpent: "€ 4,300",
    },
    {
      id: "c1",
      name: "Sofa Biachi",
      lastVisit: "November 27, 2024",
      appointments: 58,
      totalSpent: "€ 3,950",
    },
    {
      id: "c3",
      name: "Cameron Williamson",
      lastVisit: "December 20, 2024",
      appointments: 44,
      totalSpent: "€ 2,800",
    },
  ],
};

// New clients – current year (2025) vs previous year (2024)
export const newClientsSeries = {
  currentLabel: "2025",
  previousLabel: "2024",
  current: [110, 118, 128, 140, 135, 126, 125, 120, 138, 150, 142, 130],
  previous: [270, 255, 200, 185, 180, 120, 100, 102, 100, 95, 90, 85],
};

export interface YearPayment {
  year: string;
  /** Value plotted on the bar chart (Figma y-axis € 1,000 – € 4,000). */
  amount: number;
  total: number;
  monthlyMean: number;
}

export const paymentsPerYear: YearPayment[] = [
  { year: "2018", amount: 1400, total: 7600, monthlyMean: 630 },
  { year: "2019", amount: 1550, total: 8900, monthlyMean: 740 },
  { year: "2020", amount: 1650, total: 9200, monthlyMean: 770 },
  { year: "2021", amount: 1800, total: 10100, monthlyMean: 840 },
  { year: "2022", amount: 1950, total: 10900, monthlyMean: 910 },
  { year: "2023", amount: 1950, total: 11000, monthlyMean: 915 },
  { year: "2024", amount: 2000, total: 11300, monthlyMean: 940 },
  { year: "2025", amount: 2350, total: 12400, monthlyMean: 1050 },
];
