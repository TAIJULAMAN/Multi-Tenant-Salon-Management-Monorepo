export interface RemunerationRecord {
  id: string;
  date: string;
  year: string;
  net: string;
  gross: string;
  contributions: string;
  tfr: string;
  status: "Pending" | "Paid";
}

export interface RemunerationStats {
  lastPayslipNet: string;
  lastPayslipGross: string;
  lastPayslipDate: string;
  averageSalary: string;
  averageSalarySub: string;
  accumulatedTfr: string;
  accumulatedTfrSub: string;
}
