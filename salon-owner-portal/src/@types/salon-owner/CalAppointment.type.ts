export type AppStatus =
  | "Booked"
  | "Confirmed"
  | "Arrived"
  | "Started"
  | "Completed"
  | "Canceled";

export interface CalAppointment {
  id: string;
  clientName: string;
  clientPhone?: string;
  clientEmail?: string;
  service: string;
  date: Date;
  startTime: string;
  endTime: string;
  price: string;
  duration: string;
  status: AppStatus;
  employeeName: string;
  employeeId: string;
  groupId?: string;
  splitIndex?: number;
  totalSplits?: number;
  totalStartTime?: string;
  totalEndTime?: string;
  paymentStatus?: "Paid" | "Partially Paid" | "Unpaid";
}
