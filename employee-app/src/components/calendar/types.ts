export type AppStatus =
  | "Booked"
  | "Confirmed"
  | "Arrived"
  | "Started"
  | "Completed"
  | "Canceled";

export type PaymentStatus = "Paid" | "Partially Paid" | "Unpaid";

export type CalendarViewMode = "day" | "week" | "month";

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  phone: string;
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

/** One step of the "Booking Order" timeline shown when a list row is expanded. */
export interface BookingStep {
  id: string;
  order: number;
  time: string; // e.g. "12:00-12:05"
  service: string;
  staffName: string;
  status: "Completed" | "Doing" | "To Do" | "Overdue" | "Cancelled";
}

export interface CalAppointment {
  id: string;
  code: string; // display id, e.g. "#001"
  staffId: string;
  clientId?: string;
  clientName: string;
  clientAvatar?: string;
  clientPhone?: string;
  clientEmail?: string;
  service: string;
  startTime: string; // 24h "HH:mm", e.g. "09:00"
  endTime: string; // 24h "HH:mm", e.g. "10:15"
  duration: string; // e.g. "75 min"
  price: string; // e.g. "€ 170"
  priceNum: number;
  status: AppStatus;
  paymentStatus?: PaymentStatus;
  repeating?: boolean;
  notes?: string;
  date: string; // "YYYY-MM-DD"
  bookingOrder?: BookingStep[];
}
