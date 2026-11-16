export interface WorkedShift {
  id: string;
  date: string;
  dayOfWeek: string;
  shiftsCount: number;
  timeIn: string;
  timeOut: string;
  hoursWorked: string;
  dailyTotal: string;
  month: string;
  year: string;
  rawDate: string; // YYYY-MM-DD
}

export interface WorkedShiftsStats {
  totalHours: number;
  scheduledShifts: number;
  shiftsCompleted: number;
}

export interface WorkedShiftsFilterState {
  selectedMonth: string;
  selectedYear: string;
  customRange: string;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
}
