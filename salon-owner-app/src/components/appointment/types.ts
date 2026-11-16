export type AppStatus =
  | "Booked"
  | "Confirmed"
  | "Arrived"
  | "Started"
  | "Completed"
  | "Canceled";

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  color: string;
  bgColor: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  duration: number; // in minutes
  durationText: string;
  price: string;
  priceNum: number;
}

export interface ClientItem {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatar?: string;
  notes?: string;
}

export interface CalAppointment {
  id: string;
  staffId: string;
  clientName: string;
  clientAvatar?: string;
  clientPhone?: string;
  clientEmail?: string;
  service: string;
  startTime: string; // e.g. "09:00"
  endTime: string; // e.g. "10:15"
  duration: string; // e.g. "75 min"
  price: string; // e.g. "€ 170"
  status: AppStatus;
  paymentStatus?: "Paid" | "Partially Paid" | "Unpaid";
  notes?: string;
  date: string; // "YYYY-MM-DD" e.g. "2026-02-13"
}
