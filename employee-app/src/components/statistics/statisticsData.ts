// Mock statistics for the logged-in employee (single stylist)

export const MONTHS = [
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

export const MONTHS_SHORT = MONTHS.map((m) => m.slice(0, 3));

/** Month labels exactly as rendered in the Figma month picker (1:35342) */
export const PICKER_MONTHS = MONTHS.map((m) => (m === "October" ? "October" : m));

export const YEARS = ["2020", "2021", "2022", "2023", "2024", "2025"];

export const GRANULARITY_OPTIONS = ["Monthly", "Quarterly", "Yearly"];

// Real options from Figma 1:35342
export const METRICS_PERIOD_OPTIONS = ["Select Month", "Select Year"] as const;
export const OPERATION_PERIOD_OPTIONS = ["Last Month", "Last Year", "Custom Range"] as const;

export const CHART_COLORS = {
  threshold: "#16CDC7",
  above: "#FF6692",
  aboveLine: "#36C76C",
  belowLine: "#FF6692",
  thresholdLine: "#EBE9FF",
  grid: "#F1F4F8",
  axis: "#98A4AE",
};

/** Deterministic pseudo-variation so each period shows different mock numbers */
function variation(month: number, year: number): number {
  const seed = Math.sin((month + 1) * 12.9898 + year * 78.233) * 43758.5453;
  return seed - Math.floor(seed); // 0..1
}

export interface PeriodSummary {
  monthlyTurnover: number;
  targetThreshold: number;
  performance: number; // percentage
}

export function getPeriodSummary(month: number, year: number): PeriodSummary {
  // Figma reference values for December 2024
  if (month === 11 && year === 2024) {
    return { monthlyTurnover: 8500, targetThreshold: 6400, performance: 133 };
  }
  const v = variation(month, year);
  const targetThreshold = 6400;
  const monthlyTurnover = Math.round((5200 + v * 4200) / 50) * 50;
  return {
    monthlyTurnover,
    targetThreshold,
    performance: Math.round((monthlyTurnover / targetThreshold) * 100),
  };
}

export interface DailyProductionPoint {
  label: string; // month short label
  period: string; // tooltip title e.g. "April, 2025"
  totalProduction: number;
  threshold: number;
  aboveThreshold: number;
}

/** 12 months of production data – shown 6 at a time with chevron pagination */
export const DAILY_PRODUCTION: DailyProductionPoint[] = [
  { label: "Jan", period: "January, 2025", totalProduction: 2150, threshold: 400, aboveThreshold: 1750 },
  { label: "Feb", period: "February, 2025", totalProduction: 2400, threshold: 1250, aboveThreshold: 650 },
  { label: "Mar", period: "March, 2025", totalProduction: 1900, threshold: 300, aboveThreshold: 1450 },
  { label: "Apr", period: "April, 2025", totalProduction: 1700, threshold: 1700, aboveThreshold: 1700 },
  { label: "May", period: "May, 2025", totalProduction: 2050, threshold: 900, aboveThreshold: 1200 },
  { label: "Jun", period: "June, 2025", totalProduction: 2300, threshold: 1100, aboveThreshold: 1500 },
  { label: "Jul", period: "July, 2025", totalProduction: 2650, threshold: 1600, aboveThreshold: 850 },
  { label: "Aug", period: "August, 2025", totalProduction: 2200, threshold: 700, aboveThreshold: 1300 },
  { label: "Sep", period: "September, 2025", totalProduction: 1850, threshold: 500, aboveThreshold: 1600 },
  { label: "Oct", period: "October, 2025", totalProduction: 2500, threshold: 1400, aboveThreshold: 900 },
  { label: "Nov", period: "November, 2025", totalProduction: 2100, threshold: 1000, aboveThreshold: 1100 },
  { label: "Dec", period: "December, 2025", totalProduction: 2750, threshold: 1750, aboveThreshold: 1000 },
];

export const DAILY_PRODUCTION_SUMMARY = {
  status: "Above Threshold",
  total: 12500,
  threshold: 9000,
  thresholdCalculation: "Turnover x 0.2 = € 2,500",
  monthlySalary: 4500,
};

export const Y_AXIS_LABELS = ["€ 3k", "€ 2,5k", "€ 2k", "€ 1,5k", "€ 1k"];

export interface TrendPoint {
  year: string;
  date: string; // tooltip title
  value: number; // € amount (1000..3000 domain)
}

/** Yearly production trend – smooth line split around the threshold (shape traced from Figma 1:34992) */
export const PRODUCTION_TRENDS: TrendPoint[] = [
  { year: "2019", date: "August 24, 2019", value: 2440 },
  { year: "2020", date: "August 24, 2020", value: 2400 },
  { year: "2021", date: "August 24, 2021", value: 2260 },
  { year: "2022", date: "August 24, 2022", value: 2080 },
  { year: "2023", date: "August 24, 2023", value: 1700 },
  { year: "2024", date: "August 24, 2024", value: 2300 },
  { year: "2025", date: "August 24, 2025", value: 2860 },
];

/** Line values at the left / right plot edges (the Figma line runs past the first / last year) */
export const TREND_EDGES = { start: 2330, end: 2750 };

export const TREND_THRESHOLD = 2200;
export const TREND_DOMAIN = { min: 1000, max: 3000 };

export interface MetricRow {
  label: string;
  value: string;
}

export function getPerformanceMetrics(): MetricRow[] {
  return [
    { label: "Target Threshold", value: "€ 1,700" },
    { label: "Monthly Salary", value: "€ 3,200" },
    { label: "Threshold Calculation (20%)", value: "€ 1,700" },
  ];
}

export function getOperationStats(period: string): { rows: MetricRow[]; performanceStatus: string } {
  if (period === "Last Year") {
    return {
      rows: [
        { label: "Completed Appointments", value: "412" },
        { label: "Revenue Appointment", value: "€ 219.40" },
        { label: "Working Days", value: "214" },
      ],
      performanceStatus: "€ 31,480.00",
    };
  }
  return {
    rows: [
      { label: "Completed Appointments", value: "38" },
      { label: "Revenue Appointment", value: "€ 223.68" },
      { label: "Working Days", value: "3" },
    ],
    performanceStatus: "€ 2,833.33",
  };
}

export function formatEuro(value: number): string {
  return `€ ${value.toLocaleString("en-US")}`;
}

export function formatK(value: number): string {
  return `€ ${(value / 1000).toFixed(1).replace(".", ",").replace(",0", "")}k`;
}
