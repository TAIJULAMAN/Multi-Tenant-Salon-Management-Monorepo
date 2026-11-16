export interface RecordShift {
  id: string;
  date: string;
  dayOfWeek: string;
  scheduleType: string;
  shiftsCount: number;
  timeIn: string;
  timeOut: string;
  breakDuration?: string;
  hoursWorked: string;
  dailyTotal: string;
  month: string;
  year: string;
  rawDate: string; // YYYY-MM-DD
  status: "Approved" | "Pending" | "Recorded";
  notes?: string;
}

export interface RecordShiftsStats {
  totalHours: string;
  daysRecorded: number;
  avgHoursPerDay: string;
  pendingApprovals: number;
}
