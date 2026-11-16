export interface Service {
  id: string;
  name: string;
  duration: string;
  price?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  avatar: string;
}

export interface ScheduledAppointment {
  id: string;
  staffId: string;
  serviceId: string;
  serviceName: string;
  duration: number;
  price?: string;
  startSlot: number;
  date: string; // YYYY-MM-DD
  dayIndex?: number;
}

export type CalendarView = "Month" | "Week" | "Day";

export const SERVICES: Service[] = [
  { id: "s1", name: "Haircut", duration: "40 min", price: "€ 170" },
  { id: "s2", name: "Makeup", duration: "40 min", price: "€ 170" },
  { id: "s3", name: "Beard Trim", duration: "30 min", price: "€ 90" },
  { id: "s4", name: "Hair Coloring", duration: "60 min", price: "€ 220" },
];

export const STAFF: StaffMember[] = [
  { id: "1", name: "Shah Aman", avatar: "/avatar/icon1.png" },
  { id: "2", name: "Hasan Saon", avatar: "/avatar/icon2.png" },
  { id: "3", name: "Hridoy Khan", avatar: "/avatar/icon3.png" },
];

export interface Slot {
  label: string;
  isHour: boolean;
}

export function buildSlots(): Slot[] {
  const out: Slot[] = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 15) {
      const isHour = m === 0;
      const period = h < 12 ? "AM" : "PM";
      const display = h === 0 ? 12 : h <= 12 ? h : h - 12;
      out.push({ label: isHour ? `${display}:00 ${period}` : "", isHour });
    }
  }
  return out;
}

export function formatDateKey(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatSlotTime(slotIdx: number): string {
  const totalMin = slotIdx * 15;
  const h = Math.floor(totalMin / 60) % 24;
  const m = totalMin % 60;
  const period = h < 12 ? "AM" : "PM";
  const displayH = h === 0 ? 12 : h <= 12 ? h : h - 12;
  const displayM = m === 0 ? "00" : String(m).padStart(2, "0");
  return `${displayH}:${displayM} ${period}`;
}

export function getSlotEndTime(startSlot: number, durationSlots: number): string {
  return formatSlotTime(startSlot + durationSlots);
}

export const INITIAL_APPOINTMENTS: ScheduledAppointment[] = [
  {
    id: "appt-1",
    staffId: "1",
    serviceId: "s1",
    serviceName: "Haircut",
    duration: 3,
    price: "€ 170",
    startSlot: 40, // 10:00 AM
    date: "2025-09-02",
  },
  {
    id: "appt-2",
    staffId: "2",
    serviceId: "s2",
    serviceName: "Makeup",
    duration: 4,
    price: "€ 170",
    startSlot: 46, // 11:30 AM
    date: "2025-09-02",
  },
  {
    id: "appt-3",
    staffId: "3",
    serviceId: "s1",
    serviceName: "Haircut",
    duration: 3,
    price: "€ 170",
    startSlot: 56, // 2:00 PM
    date: "2025-09-02",
  },
];

export const SLOTS = buildSlots();
export const ROW_H = 40;
export const TIME_W = 80;
export const MIN_COL = 110;
export const BUSINESS_START_SLOT = 36; // 9:00 AM
