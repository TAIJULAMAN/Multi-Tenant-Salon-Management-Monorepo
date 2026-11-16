import { MemberData } from "./types";

export const initialMembers: MemberData[] = [
  { id: "1", name: "Maria Rodriguez", email: "maria@beautywellness.com", role: "Manager", status: "Active", employmentStatus: "Currently Hired", contractType: "Full Time", lastActive: "1h ago", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria1&backgroundColor=fce7f3", avatarBg: "bg-[#FCE7F3]" },
  { id: "2", name: "Sarah Connor", email: "sarah@beautywellness.com", role: "Staff", status: "Pending", employmentStatus: "Currently Hired", contractType: "Part Time", lastActive: "2h ago", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah2&backgroundColor=e2e8f0", avatarBg: "bg-[#E2E8F0]" },
  { id: "3", name: "John Smith", email: "john@beautywellness.com", role: "Staff", status: "Active", employmentStatus: "Currently Hired", contractType: "Full Time", lastActive: "3h ago", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=John3&backgroundColor=ccfbf1", avatarBg: "bg-[#CCFBF1]" },
  { id: "4", name: "Emma Watson", email: "emma@beautywellness.com", role: "Accountant", status: "Active", employmentStatus: "Currently Hired", contractType: "Stage", lastActive: "1d ago", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma4&backgroundColor=fee2e2", avatarBg: "bg-[#FEE2E2]" },
  { id: "5", name: "Oliver Twist", email: "oliver@beautywellness.com", role: "Staff", status: "Active", employmentStatus: "Currently Hired", contractType: "Vat collaboration", lastActive: "5m ago", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver5&backgroundColor=fce7f3", avatarBg: "bg-[#FCE7F3]" },
  { id: "6", name: "Isabella Ross", email: "isabella@beautywellness.com", role: "Manager", status: "Active", employmentStatus: "Currently Hired", contractType: "Full Time", lastActive: "10m ago", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Isabella6&backgroundColor=ccfbf1", avatarBg: "bg-[#CCFBF1]" },
  { id: "7", name: "William Hunt", email: "william@beautywellness.com", role: "Staff", status: "Pending", employmentStatus: "Currently Hired", contractType: "Part Time", lastActive: "1h ago", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=William7&backgroundColor=fee2e2", avatarBg: "bg-[#FEE2E2]" },
  { id: "8", name: "Sophia Loren", email: "sophia@beautywellness.com", role: "Staff", status: "Inactive", employmentStatus: "Out of Team: 02/02/2025", contractType: "Full Time", lastActive: "1w ago", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia8&backgroundColor=e2e8f0", avatarBg: "bg-[#E2E8F0]" },
  { id: "9", name: "Lucas Black", email: "lucas@beautywellness.com", role: "Accountant", status: "Inactive", employmentStatus: "Out of Team: 02/02/2025", contractType: "Full Time", lastActive: "2w ago", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas9&backgroundColor=e2e8f0", avatarBg: "bg-[#E2E8F0]" },
  { id: "10", name: "Mia Wong", email: "mia@beautywellness.com", role: "Staff", status: "Active", employmentStatus: "Currently Hired", contractType: "Part Time", lastActive: "30m ago", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mia10&backgroundColor=ccfbf1", avatarBg: "bg-[#CCFBF1]" },
];


import { SalaryRecord } from "./types";

const mockDetails = {
  grossSalary: "€ 3,200.00",
  netSalary: "€ 2,600.00",
  trfMonthly: "€ 600.00",
  cumulativeTrf: "€ 3,800.00",
  iban: "IT60 X054 ******** 123",
};

export const initialPendingSalaries: SalaryRecord[] = [
  {
    id: "1",
    name: "Maria Rodriguez",
    uploader: "Mario Rossi",
    avatarBg: "bg-[#FCE7F3]",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria1&backgroundColor=fce7f3",
    role: "Staff",
    netAmount: "€ 3,200.00",
    month: "December 2024",
    date: "Dec 01, 2024",
    status: "pending",
    ...mockDetails,
  },
  {
    id: "2",
    name: "Maria Rodriguez",
    uploader: "Mario Rossi",
    avatarBg: "bg-[#E0E7FF]",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria2&backgroundColor=e0e7ff",
    role: "Staff",
    netAmount: "€ 3,200.00",
    month: "December 2024",
    date: "Dec 01, 2024",
    status: "pending",
    ...mockDetails,
  },
  {
    id: "3",
    name: "Maria Rodriguez",
    uploader: "Mario Rossi",
    avatarBg: "bg-[#DCFCE7]",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria3&backgroundColor=dcfce7",
    role: "Staff",
    netAmount: "€ 3,200.00",
    month: "December 2024",
    date: "Dec 01, 2024",
    status: "pending",
    ...mockDetails,
  },
  {
    id: "4",
    name: "Maria Rodriguez",
    uploader: "Mario Rossi",
    avatarBg: "bg-[#FEE2E2]",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria4&backgroundColor=fee2e2",
    role: "Staff",
    netAmount: "€ 3,200.00",
    month: "December 2024",
    date: "Dec 01, 2024",
    status: "pending",
    ...mockDetails,
  },
  {
    id: "5",
    name: "Maria Rodriguez",
    uploader: "Mario Rossi",
    avatarBg: "bg-[#FEF9C3]",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria5&backgroundColor=fef9c3",
    role: "Staff",
    netAmount: "€ 3,200.00",
    month: "December 2024",
    date: "Dec 01, 2024",
    status: "pending",
    ...mockDetails,
  },
];

export const initialApprovedSalaries: SalaryRecord[] = [
  {
    id: "6",
    name: "Maria Rodriguez",
    uploader: "Mario Rossi",
    avatarBg: "bg-[#FCE7F3]",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria6&backgroundColor=fce7f3",
    role: "Staff",
    netAmount: "€ 3,200.00",
    date: "Dec 01, 2024",
    status: "Approved",
    ...mockDetails,
  },
];

export const mockHistoryData: SalaryRecord[] = [
  {
    id: "h1",
    name: "Maria Rodriguez",
    uploader: "Mario Rossi",
    avatarBg: "bg-[#FCE7F3]",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria1&backgroundColor=fce7f3",
    role: "Staff",
    netAmount: "€ 3,200.00",
    month: "December 2024",
    date: "Dec 01, 2024",
    status: "pending",
    ...mockDetails,
  },
  {
    id: "h2",
    name: "Maria Rodriguez",
    uploader: "Mario Rossi",
    avatarBg: "bg-[#E0E7FF]",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria2&backgroundColor=e0e7ff",
    role: "Staff",
    netAmount: "€ 3,200.00",
    month: "December 2024",
    date: "Dec 01, 2024",
    status: "pending",
    ...mockDetails,
  },
  {
    id: "h3",
    name: "Maria Rodriguez",
    uploader: "Mario Rossi",
    avatarBg: "bg-[#DCFCE7]",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria3&backgroundColor=dcfce7",
    role: "Staff",
    netAmount: "€ 3,200.00",
    month: "December 2024",
    date: "Dec 01, 2024",
    status: "pending",
    ...mockDetails,
  },
  {
    id: "h4",
    name: "Maria Rodriguez",
    uploader: "Mario Rossi",
    avatarBg: "bg-[#FEE2E2]",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria4&backgroundColor=fee2e2",
    role: "Staff",
    netAmount: "€ 3,200.00",
    month: "December 2024",
    date: "Dec 01, 2024",
    status: "pending",
    ...mockDetails,
  },
  {
    id: "h5",
    name: "Maria Rodriguez",
    uploader: "Mario Rossi",
    avatarBg: "bg-[#FEF9C3]",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria5&backgroundColor=fef9c3",
    role: "Staff",
    netAmount: "€ 3,200.00",
    month: "December 2024",
    date: "Dec 01, 2024",
    status: "pending",
    ...mockDetails,
  },
];

import { MemberServiceItem } from "./types";

export const INITIAL_MEMBER_SERVICES: MemberServiceItem[] = [
  { id: 1, name: "Hair Color", duration: "15 min", price: "€ 170", active: true },
  { id: 2, name: "Hair Color", duration: "30 min", price: "€ 170", active: false },
  { id: 3, name: "Hair Color", duration: "15 min", price: "€ 170", active: false },
  { id: 4, name: "Hair Color", duration: "15 min", price: "€ 170", active: true },
  { id: 5, name: "Hair Color", duration: "30 min", price: "€ 170", active: false },
  { id: 6, name: "Hair Color", duration: "15 min", price: "€ 170", active: false },
];

import { MemberSchedule, ClosedPeriod } from "./types";

export const initialSchedules: MemberSchedule[] = [
  {
    id: "1",
    name: "Maria Rodriguez",
    hours: "40h",
    avatarBg: "bg-[#FCE7F3]",
    avatarUrl:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria1&backgroundColor=fce7f3",
    shifts: [
      { time: "09:00 - 17:00" },
      { time: "09:00 - 17:00" },
      { time: "10:00 - 19:00" },
      { time: "10:00 - 19:00" },
      { time: "09:00 - 17:00" },
      null,
      null,
    ],
  },
  {
    id: "2",
    name: "Sarah Chen",
    hours: "32h",
    avatarBg: "bg-[#E2E8F0]",
    avatarUrl:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=e2e8f0",
    shifts: [
      null,
      { time: "12:00 - 20:00" },
      { time: "12:00 - 20:00" },
      { time: "12:00 - 20:00" },
      { time: "12:00 - 20:00" },
      null,
      null,
    ],
  },
  {
    id: "3",
    name: "James Wilson",
    hours: "45h",
    avatarBg: "bg-[#DCFCE7]",
    avatarUrl:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=James&backgroundColor=dcfce7",
    shifts: [
      { time: "08:00 - 16:00" },
      { time: "08:00 - 16:00" },
      { time: "08:00 - 16:00" },
      null,
      { time: "08:00 - 16:00" },
      { time: "08:00 - 16:00" },
      null,
    ],
  },
  {
    id: "4",
    name: "Elena Rossi",
    hours: "24h",
    avatarBg: "bg-[#FEE2E2]",
    avatarUrl:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena&backgroundColor=fee2e2",
    shifts: [
      null,
      null,
      { time: "14:00 - 20:00" },
      { time: "14:00 - 20:00" },
      { time: "14:00 - 20:00" },
      { time: "14:00 - 20:00" },
      null,
    ],
  },
  {
    id: "5",
    name: "David Kim",
    hours: "40h",
    avatarBg: "bg-[#F3E8FF]",
    avatarUrl:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=David&backgroundColor=f3e8ff",
    shifts: [
      { time: "10:00 - 18:00" },
      { time: "10:00 - 18:00" },
      null,
      { time: "10:00 - 18:00" },
      { time: "10:00 - 18:00" },
      { time: "10:00 - 18:00" },
      null,
    ],
  },
  {
    id: "6",
    name: "Anna Schmidt",
    hours: "36h",
    avatarBg: "bg-[#E0F2FE]",
    avatarUrl:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=Anna&backgroundColor=e0f2fe",
    shifts: [
      { time: "09:00 - 15:00" },
      { time: "09:00 - 15:00" },
      { time: "09:00 - 15:00" },
      { time: "09:00 - 15:00" },
      { time: "09:00 - 15:00" },
      { time: "09:00 - 15:00" },
      null,
    ],
  },
  {
    id: "7",
    name: "Michael Chang",
    hours: "20h",
    avatarBg: "bg-[#FEE2E2]",
    avatarUrl:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael&backgroundColor=fee2e2",
    shifts: [
      null,
      null,
      null,
      null,
      { time: "16:00 - 21:00" },
      { time: "10:00 - 20:00" },
      { time: "10:00 - 15:00" },
    ],
  },
  {
    id: "8",
    name: "Sophie Laurent",
    hours: "40h",
    avatarBg: "bg-[#F1F5F9]",
    avatarUrl:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie&backgroundColor=f1f5f9",
    shifts: [
      { time: "09:00 - 17:00" },
      { time: "09:00 - 17:00" },
      { time: "09:00 - 17:00" },
      { time: "09:00 - 17:00" },
      { time: "09:00 - 17:00" },
      null,
      null,
    ],
  },
];

export const initialClosedPeriods: ClosedPeriod[] = [
  {
    id: "1",
    startDate: "2024-08-14",
    endDate: "2024-08-15",
    reason: "Team Retreat",
  },
];



import { WorkedShiftRecord, DailyShiftRecord } from "./types";

export const initialWorkedShiftRecords: WorkedShiftRecord[] = Array.from({ length: 10 }).map((_, index) => ({
  id: String(index + 1),
  name: "Maria Rodriguez",
  uploader: "Mario Rossi",
  avatarBg: ["bg-[#FCE7F3]", "bg-[#E2E8F0]", "bg-[#DCFCE7]", "bg-[#FEE2E2]", "bg-[#F3E8FF]"][index % 5],
  avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=Maria${index + 1}&backgroundColor=${["fce7f3", "e2e8f0", "dcfce7", "fee2e2", "f3e8ff"][index % 5]}`,
  role: "Staff",
  hours: "160h",
  daysWorked: 21,
  avgHours: "Dec 01, 2024",
}));

export const initialDailyShifts: DailyShiftRecord[] = [
  { id: 1, date: "Dec 01, 2024", day: "Sunday", shifts: 1, timeIn: "09:00", timeOut: "18:00", hours: "8h", total: "8h" },
  { id: 2, date: "Dec 01, 2024", day: "Monday", shifts: 1, timeIn: "09:00", timeOut: "18:00", hours: "8h", total: "8h" },
  { id: 3, date: "Dec 01, 2024", day: "Tuesday", shifts: 1, timeIn: "09:00", timeOut: "18:00", hours: "8h", total: "8h" },
];
