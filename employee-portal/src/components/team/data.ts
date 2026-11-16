import { MemberSchedule, ClosedPeriod } from "./types";

export const initialSchedules: MemberSchedule[] = [
  {
    id: "1",
    name: "Maria Rodriguez",
    hours: "40h",
    avatarBg: "bg-[#FCE7F3]",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria1&backgroundColor=fce7f3",
    shifts: [{ time: "09:00 - 17:00" }, { time: "09:00 - 17:00" }, { time: "10:00 - 19:00" }, { time: "10:00 - 19:00" }, { time: "09:00 - 17:00" }, null, null],
  },
  {
    id: "2",
    name: "Sarah Chen",
    hours: "32h",
    avatarBg: "bg-[#E2E8F0]",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=e2e8f0",
    shifts: [null, { time: "12:00 - 20:00" }, { time: "12:00 - 20:00" }, { time: "12:00 - 20:00" }, { time: "12:00 - 20:00" }, null, null],
  },
  {
    id: "3",
    name: "James Wilson",
    hours: "45h",
    avatarBg: "bg-[#DCFCE7]",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=James&backgroundColor=dcfce7",
    shifts: [{ time: "08:00 - 16:00" }, { time: "08:00 - 16:00" }, { time: "08:00 - 16:00" }, null, { time: "08:00 - 16:00" }, { time: "08:00 - 16:00" }, null],
  },
  {
    id: "4",
    name: "Elena Rossi",
    hours: "24h",
    avatarBg: "bg-[#FEE2E2]",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena&backgroundColor=fee2e2",
    shifts: [null, null, { time: "14:00 - 20:00" }, { time: "14:00 - 20:00" }, { time: "14:00 - 20:00" }, { time: "14:00 - 20:00" }, null],
  },
  {
    id: "5",
    name: "David Kim",
    hours: "40h",
    avatarBg: "bg-[#F3E8FF]",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=David&backgroundColor=f3e8ff",
    shifts: [{ time: "10:00 - 18:00" }, { time: "10:00 - 18:00" }, null, { time: "10:00 - 18:00" }, { time: "10:00 - 18:00" }, { time: "10:00 - 18:00" }, null],
  },
  {
    id: "6",
    name: "Anna Schmidt",
    hours: "36h",
    avatarBg: "bg-[#E0F2FE]",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anna&backgroundColor=e0f2fe",
    shifts: [{ time: "09:00 - 15:00" }, { time: "09:00 - 15:00" }, { time: "09:00 - 15:00" }, { time: "09:00 - 15:00" }, { time: "09:00 - 15:00" }, { time: "09:00 - 15:00" }, null],
  },
  {
    id: "7",
    name: "Michael Chang",
    hours: "20h",
    avatarBg: "bg-[#FEE2E2]",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael&backgroundColor=fee2e2",
    shifts: [null, null, null, null, { time: "16:00 - 21:00" }, { time: "10:00 - 20:00" }, { time: "10:00 - 15:00" }],
  },
  {
    id: "8",
    name: "Sophie Laurent",
    hours: "40h",
    avatarBg: "bg-[#F1F5F9]",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie&backgroundColor=f1f5f9",
    shifts: [{ time: "09:00 - 17:00" }, { time: "09:00 - 17:00" }, { time: "09:00 - 17:00" }, { time: "09:00 - 17:00" }, { time: "09:00 - 17:00" }, null, null],
  },
];

export const initialClosedPeriods: ClosedPeriod[] = [];
