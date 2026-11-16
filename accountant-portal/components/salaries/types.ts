/**
 * Salaries domain type definitions.
 */

export interface SalaryHistoryRecord {
  id: string;
  name: string;
  empId: string;
  avatar: string;
  salon: string;
  period: string;
  gross: number;
  net: number;
  status: "Approved" | "Declined" | "Cancelled";
  approvedDate?: string;
  approvedBy?: string;
  paymentDate?: string;
  paymentStatus?: "pending" | "completed";
}

export interface PendingSalaryRecord {
  id: string;
  name: string;
  uploadedBy: string;
  avatar: string;
  salon: string;
  salonLogo: string;
  period: string;
  gross: number;
  net: number;
  status: "Pending" | "Declined";
  uploadedDate: string;
}

export interface SalonItem {
  name: string;
  image: string;
}

export interface ExtractedSalary {
  id: string;
  employeeName: string;
  period: string;
  causale: string;
  netSalary: number;
  deemed: number;
  grossSalary: number;
  trfThisYear: number;
  trfPrevYears: number;
  cf: string;
  confidence: number;
  mapped: boolean;
  vendor: string;
  status: "Review" | "Approved";
  tfrMonthly?: string;
  totalTfrAmount?: string;
  avatar?: string;
}

export interface UploadedFile {
  name: string;
  size: number;
  progress: number;
  status: "uploading" | "completed" | "error";
}
