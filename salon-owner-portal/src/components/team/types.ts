export interface MemberData {
  id: string;
  name: string;
  email: string;
  role: "Manager" | "Staff" | "Accountant";
  status: "Active" | "Pending" | "Inactive";
  employmentStatus: string;
  contractType: "Full Time" | "Part Time" | "Stage" | "Vat collaboration";
  lastActive: string;
  avatarUrl: string;
  avatarBg: string;
}

export interface ShiftRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  startTime: string;
  endTime: string;
  role: string;
}

export interface SalaryRecord {
  id: string;
  name: string;
  uploader: string;
  avatarBg: string;
  avatarUrl: string;
  role: string;
  netAmount: string;
  month?: string;
  date: string;
  status: "pending" | "paid" | "Approved";
  grossSalary?: string;
  netSalary?: string;
  trfMonthly?: string;
  cumulativeTrf?: string;
  iban?: string;
}

export interface MemberServiceItem {
  id: number;
  name: string;
  duration: string;
  price: string;
  active: boolean;
}

export interface Shift {
  time: string;
}

export interface MemberSchedule {
  id: string;
  name: string;
  hours: string;
  avatarBg: string;
  avatarUrl: string;
  shifts: (Shift | null)[];
}

export interface ClosedPeriod {
  id: string;
  startDate: string;
  endDate: string;
  reason: string;
}

export interface OverriddenSlot {
  memberId: string;
  dateString: string;
}



export interface WorkedShiftRecord {
  id: string;
  name: string;
  uploader: string;
  avatarBg: string;
  avatarUrl: string;
  role: string;
  hours: string;
  daysWorked: number;
  avgHours: string;
}

export interface DailyShiftRecord {
  id: number;
  date: string;
  day: string;
  shifts: number;
  timeIn: string;
  timeOut: string;
  hours: string;
  total: string;
}
