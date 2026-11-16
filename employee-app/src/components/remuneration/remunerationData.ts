// Mock data for the employee's own remuneration (payslips).

export type PayslipStatus = "Pending" | "Paid";

export interface Payslip {
  id: string;
  /** ISO date YYYY-MM-DD of the payment */
  dateISO: string;
  /** Display date as in the design, e.g. "November 29, 2024" */
  date: string;
  /** Reference month, e.g. "November 2024" */
  month: string;
  net: number;
  gross: number;
  contributions: number;
  tfr: number;
  socialSecurity: number;
  taxes: number;
  status: PayslipStatus;
}

export const EMPLOYER = {
  name: "Harem Salon Milano",
  address: "Via Roma, 123 · 20121 Milan (MI) · P.IVA IT12345678901",
};

export const EMPLOYEE_IBAN = "IT60 X054 ******** 123";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const make = (id: string, y: number, m: number, d: number, status: PayslipStatus = "Paid", shortMonth = false): Payslip => {
  const monthName = MONTH_NAMES[m - 1];
  const displayMonth = shortMonth ? monthName.slice(0, 3) : monthName;
  return {
    id,
    dateISO: `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
    date: `${displayMonth} ${d}, ${y}`,
    month: `${monthName} ${y}`,
    net: 1700,
    gross: 2200,
    contributions: 0,
    tfr: 0,
    socialSecurity: 202,
    taxes: 298,
    status,
  };
};

export const PAYSLIPS: Payslip[] = [
  make("p-2024-11", 2024, 11, 29, "Pending"),
  make("p-2024-10", 2024, 10, 30),
  make("p-2024-09", 2024, 9, 29),
  make("p-2024-08", 2024, 8, 30),
  make("p-2024-07", 2024, 7, 29),
  make("p-2024-06", 2024, 6, 30, "Paid", true),
  make("p-2024-05", 2024, 5, 29),
  make("p-2024-04", 2024, 4, 30),
  make("p-2024-03", 2024, 3, 29),
  make("p-2024-02", 2024, 2, 28),
  make("p-2023-12", 2023, 12, 29),
  make("p-2023-11", 2023, 11, 30),
  make("p-2023-10", 2023, 10, 30),
  make("p-2023-09", 2023, 9, 29),
  make("p-2023-08", 2023, 8, 30),
  make("p-2023-07", 2023, 7, 28),
];

export const ALL_YEARS = "All Years";
export const YEAR_FILTERS = [ALL_YEARS, "2025", "2024", "2023"];

export const REMUNERATION_STATS = {
  lastPayslip: "€ 1,700",
  lastPayslipGross: "Gross: €4,500.00",
  lastPayslipDate: "November 29, 2024",
  averageSalary: "€ 2,200",
  averageSalarySub: "Last 12 months",
  accumulatedTfr: "€ 5,500",
};

export const formatEuro = (n: number) =>
  `€ ${n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;

export const formatEuroExact = (n: number) =>
  `€ ${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
