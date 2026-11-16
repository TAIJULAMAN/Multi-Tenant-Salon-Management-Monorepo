import { useState, useEffect } from "react";
import { AppStatus, CalAppointment, ClientItem, ServiceItem, StaffMember } from "./types";

export const staffList: StaffMember[] = [
  {
    id: "st1",
    name: "Shah Aman",
    role: "Master Stylist",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80",
    color: "#635BFF",
    bgColor: "#F3F0FF",
  },
  {
    id: "st2",
    name: "Hasan Siam",
    role: "Color Specialist",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80",
    color: "#0D9488",
    bgColor: "#E6FFFE",
  },
  {
    id: "st3",
    name: "Hridoy Khan",
    role: "Barber & Stylist",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
    color: "#D97706",
    bgColor: "#FFFBEA",
  },
  {
    id: "st4",
    name: "Courtney Henry",
    role: "Senior Esthetician",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
    color: "#16A34A",
    bgColor: "#EDFBF3",
  },
  {
    id: "st5",
    name: "Robert Fox",
    role: "Facial & Spa",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
    color: "#E11D48",
    bgColor: "#FFF0F3",
  },
  {
    id: "st6",
    name: "Maria Rodriguez",
    role: "Senior Stylist",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80",
    color: "#635BFF",
    bgColor: "#EEF2FF",
  },
];

export const availableServices: ServiceItem[] = [
  { id: "s1", name: "Haircut", duration: 30, durationText: "30 min", price: "€ 30", priceNum: 30 },
  { id: "s2", name: "Haircut & Blowdry", duration: 60, durationText: "60 min", price: "€ 50", priceNum: 50 },
  { id: "s3", name: "Anti-Aging Firming Facial", duration: 75, durationText: "75 min", price: "€ 170", priceNum: 170 },
  { id: "s4", name: "Signature Glow Facial", duration: 45, durationText: "45 min", price: "€ 120", priceNum: 120 },
  { id: "s5", name: "Blowdry & Styling", duration: 30, durationText: "30 min", price: "€ 25", priceNum: 25 },
  { id: "s6", name: "Hair Coloring", duration: 90, durationText: "90 min", price: "€ 80", priceNum: 80 },
  { id: "s7", name: "Full Highlights", duration: 105, durationText: "105 min", price: "€ 120", priceNum: 120 },
  { id: "s8", name: "Beard Trim & Grooming", duration: 45, durationText: "45 min", price: "€ 35", priceNum: 35 },
];

export const clientList: ClientItem[] = [
  {
    id: "c1",
    name: "Sofia Rossi",
    phone: "+39 345 678 9123",
    email: "sofia@beauty.com",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
    notes: "Promised 10% discount on next haircut. Prefers no heat styling.",
  },
  {
    id: "c2",
    name: "Maria Rodriguez",
    phone: "+34 612 345 678",
    email: "maria@fashion.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
    notes: "Regular client. Prefers organic coloring products.",
  },
  {
    id: "c3",
    name: "Marco Bellini",
    phone: "+39 333 456 7890",
    email: "marco.b@gmail.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
    notes: "Beard trim every 2 weeks.",
  },
  {
    id: "c4",
    name: "Elena Vasquez",
    phone: "+34 655 789 012",
    email: "elena.v@outlook.com",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80",
  },
  {
    id: "c5",
    name: "Luca Ferrara",
    phone: "+39 347 890 1234",
    email: "luca.f@yahoo.it",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
  },
];

export const initialAppointments: CalAppointment[] = [
  {
    id: "apt-1",
    staffId: "st1",
    clientName: "Sofia Rossi",
    clientPhone: "+39 345 678 9123",
    clientAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
    service: "Haircut & Blowdry",
    startTime: "09:00",
    endTime: "10:00",
    duration: "60 min",
    price: "€ 50",
    status: "Confirmed",
    paymentStatus: "Paid",
    notes: "Client requested organic shampoo. Light layering on sides.",
    date: "2026-02-13",
  },
  {
    id: "apt-2",
    staffId: "st1",
    clientName: "Elena Vasquez",
    clientPhone: "+34 655 789 012",
    clientAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80",
    service: "Hair Coloring",
    startTime: "10:30",
    endTime: "12:00",
    duration: "90 min",
    price: "€ 80",
    status: "Started",
    paymentStatus: "Paid",
    notes: "Balayage touch-up with ash blonde toner.",
    date: "2026-02-13",
  },
  {
    id: "apt-3",
    staffId: "st2",
    clientName: "Maria Rodriguez",
    clientPhone: "+34 612 345 678",
    clientAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
    service: "Full Highlights",
    startTime: "09:30",
    endTime: "11:15",
    duration: "105 min",
    price: "€ 120",
    status: "Confirmed",
    paymentStatus: "Unpaid",
    notes: "Use low-ammonia bleach formula. Skin test done last week.",
    date: "2026-02-13",
  },
  {
    id: "apt-4",
    staffId: "st3",
    clientName: "Marco Bellini",
    clientPhone: "+39 333 456 7890",
    clientAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
    service: "Beard Trim & Grooming",
    startTime: "11:00",
    endTime: "11:45",
    duration: "45 min",
    price: "€ 35",
    status: "Booked",
    paymentStatus: "Unpaid",
    notes: "Hot towel treatment included.",
    date: "2026-02-13",
  },
  {
    id: "apt-5",
    staffId: "st4",
    clientName: "Sofia Rossi",
    clientPhone: "+39 345 678 9123",
    clientAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
    service: "Signature Glow Facial",
    startTime: "13:00",
    endTime: "13:45",
    duration: "45 min",
    price: "€ 120",
    status: "Confirmed",
    paymentStatus: "Paid",
    notes: "Sensitive skin — hypoallergenic products only.",
    date: "2026-02-13",
  },
  {
    id: "apt-6",
    staffId: "st5",
    clientName: "Luca Ferrara",
    clientPhone: "+39 347 890 1234",
    clientAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
    service: "Anti-Aging Firming Facial",
    startTime: "14:00",
    endTime: "15:15",
    duration: "75 min",
    price: "€ 170",
    status: "Booked",
    paymentStatus: "Unpaid",
    notes: "First time facial treatment.",
    date: "2026-02-13",
  },
  {
    id: "apt-7",
    staffId: "st2",
    clientName: "Elena Vasquez",
    clientPhone: "+34 655 789 012",
    clientAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80",
    service: "Haircut & Blowdry",
    startTime: "15:00",
    endTime: "16:00",
    duration: "60 min",
    price: "€ 50",
    status: "Completed",
    paymentStatus: "Paid",
    notes: "",
    date: "2026-02-13",
  },
  {
    id: "apt-8",
    staffId: "st1",
    clientName: "Marco Bellini",
    clientPhone: "+39 333 456 7890",
    clientAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
    service: "Blowdry & Styling",
    startTime: "16:30",
    endTime: "17:00",
    duration: "30 min",
    price: "€ 25",
    status: "Arrived",
    paymentStatus: "Paid",
    notes: "Prep for evening event.",
    date: "2026-02-13",
  },
];

// Global in-memory state for appointments
let globalAppointments: CalAppointment[] = [...initialAppointments];
let appointmentListeners: Array<(appointments: CalAppointment[]) => void> = [];

export function useAppointmentsStore(): [
  CalAppointment[],
  React.Dispatch<React.SetStateAction<CalAppointment[]>>
] {
  const [appointments, setAppointmentsState] = useState<CalAppointment[]>(globalAppointments);

  useEffect(() => {
    const listener = (newAppointments: CalAppointment[]) => {
      setAppointmentsState(newAppointments);
    };
    appointmentListeners.push(listener);
    return () => {
      appointmentListeners = appointmentListeners.filter((l) => l !== listener);
    };
  }, []);

  const setAppointments: React.Dispatch<React.SetStateAction<CalAppointment[]>> = (
    action
  ) => {
    if (typeof action === "function") {
      globalAppointments = action(globalAppointments);
    } else {
      globalAppointments = action;
    }
    setAppointmentsState(globalAppointments);
    appointmentListeners.forEach((l) => l(globalAppointments));
  };

  return [appointments, setAppointments];
}

export function updateAppointmentInStore(updated: CalAppointment) {
  globalAppointments = globalAppointments.map((a) => (a.id === updated.id ? updated : a));
  appointmentListeners.forEach((l) => l(globalAppointments));
}

export function addAppointmentToStore(newAppt: CalAppointment) {
  globalAppointments = [newAppt, ...globalAppointments];
  appointmentListeners.forEach((l) => l(globalAppointments));
}

export function deleteAppointmentFromStore(id: string) {
  globalAppointments = globalAppointments.filter((a) => a.id !== id);
  appointmentListeners.forEach((l) => l(globalAppointments));
}

// Layout & Time Constants
export const START_HOUR = 8;
export const END_HOUR = 20;
export const HOUR_HEIGHT = 80;
export const COLUMN_WIDTH = 130;
export const TIME_COLUMN_WIDTH = 60;

// Status Theming for Cards & Badges
export const statusTheme: Record<
  AppStatus,
  { bg: string; border: string; text: string; badgeBg: string; badgeText: string }
> = {
  Booked: {
    bg: "#EFF6FF",
    border: "#3B82F6",
    text: "#1D4ED8",
    badgeBg: "#DBEAFE",
    badgeText: "#1E40AF",
  },
  Confirmed: {
    bg: "#ECFDF5",
    border: "#10B981",
    text: "#047857",
    badgeBg: "#D1FAE5",
    badgeText: "#065F46",
  },
  Arrived: {
    bg: "#F5F3FF",
    border: "#8B5CF6",
    text: "#6D28D9",
    badgeBg: "#EDE9FE",
    badgeText: "#5B21B6",
  },
  Started: {
    bg: "#FFFBEB",
    border: "#F59E0B",
    text: "#B45309",
    badgeBg: "#FEF3C7",
    badgeText: "#92400E",
  },
  Completed: {
    bg: "#F0FDF4",
    border: "#22C55E",
    text: "#15803D",
    badgeBg: "#DCFCE7",
    badgeText: "#166534",
  },
  Canceled: {
    bg: "#FEF2F2",
    border: "#EF4444",
    text: "#B91C1C",
    badgeBg: "#FEE2E2",
    badgeText: "#991B1B",
  },
};

// Time conversion helpers
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
  const hours = Math.floor(totalMin / 60);
  const minutes = totalMin % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function formatTimeSlot(hour: number): string {
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:00 ${ampm}`;
}

export function getAppointmentsStore(): CalAppointment[] {
  return globalAppointments;
}
