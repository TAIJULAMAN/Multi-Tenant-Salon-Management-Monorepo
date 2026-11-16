export interface TaxKPICardData {
  id: string;
  title: string;
  value: string;
  subtext: string;
  icon: string;
  bgColor: string;
  iconBg: string;
  iconColor: string;
}

export const TAXES_KPI_CONFIG: TaxKPICardData[] = [
  {
    id: "awaitingApproval",
    title: "Awaiting Approval",
    value: "5",
    subtext: "Avg. 2.1 days waiting",
    icon: "time",
    bgColor: "#FFFBEB",
    iconBg: "#EAB308",
    iconColor: "#FFFFFF",
  },
  {
    id: "dueSoon",
    title: "Due Soon",
    value: "3",
    subtext: "Next 14 days",
    icon: "calendar",
    bgColor: "#FDF2F8",
    iconBg: "#EC4899",
    iconColor: "#FFFFFF",
  },
  {
    id: "totalPaid",
    title: "Total Paid This Year",
    value: "€ 48,200",
    subtext: "15 payments",
    icon: "cash",
    bgColor: "#F0FDFA",
    iconBg: "#14B8A6",
    iconColor: "#FFFFFF",
  },
  {
    id: "avgApprovalTime",
    title: "Avg Approval Time",
    value: "1.8 days",
    subtext: "-0.3 days from last quarter",
    icon: "checkmark-circle",
    bgColor: "#EEECFF",
    iconBg: "#635BFF",
    iconColor: "#FFFFFF",
  },
];

export interface TaxObligationItem {
  month: string;
  total: number;
}

export interface AverageReceiptItem {
  month: string;
  revenue: number;
  taxes: number;
}

export const TAX_MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const generateTaxObligations = (baseValue: number): TaxObligationItem[] => [
  { month: "Jan", total: baseValue * 0.8 },
  { month: "Feb", total: baseValue * 1.1 },
  { month: "Mar", total: baseValue * 1.3 },
  { month: "Apr", total: baseValue * 2.1 },
  { month: "May", total: baseValue * 1.5 },
  { month: "Jun", total: baseValue * 1.2 },
  { month: "Jul", total: baseValue * 1.3 },
  { month: "Aug", total: baseValue * 1.8 },
  { month: "Sep", total: baseValue * 2.2 },
  { month: "Oct", total: baseValue * 1.9 },
  { month: "Nov", total: baseValue * 1.4 },
  { month: "Dec", total: baseValue * 2.0 },
];

const generateAverageReceipts = (revBase: number, taxBase: number): AverageReceiptItem[] => [
  { month: "Jan", revenue: revBase * 1.0, taxes: taxBase * 1.0 },
  { month: "Feb", revenue: revBase * 1.1, taxes: taxBase * 1.1 },
  { month: "Mar", revenue: revBase * 1.2, taxes: taxBase * 1.2 },
  { month: "Apr", revenue: revBase * 0.9, taxes: taxBase * 0.8 },
  { month: "May", revenue: revBase * 1.25, taxes: taxBase * 1.4 },
  { month: "Jun", revenue: revBase * 1.1, taxes: taxBase * 1.1 },
  { month: "Jul", revenue: revBase * 1.3, taxes: taxBase * 1.5 },
  { month: "Aug", revenue: revBase * 1.2, taxes: taxBase * 1.3 },
  { month: "Sep", revenue: revBase * 1.4, taxes: taxBase * 1.6 },
  { month: "Oct", revenue: revBase * 1.3, taxes: taxBase * 1.4 },
  { month: "Nov", revenue: revBase * 1.5, taxes: taxBase * 1.7 },
  { month: "Dec", revenue: revBase * 1.6, taxes: taxBase * 1.8 },
];

export const TAX_OBLIGATIONS_DATA_BY_YEAR: Record<string, TaxObligationItem[]> = {
  "2024": generateTaxObligations(1200),
  "2025": generateTaxObligations(1500),
  "2026": generateTaxObligations(1800),
};

export const AVERAGE_RECEIPT_TREND_DATA_BY_YEAR: Record<string, AverageReceiptItem[]> = {
  "2024": generateAverageReceipts(10000, 2000),
  "2025": generateAverageReceipts(12000, 2500),
  "2026": generateAverageReceipts(14000, 2800),
};

export const TAX_OBLIGATIONS_Y_MAX = 3500;
export const TAX_OBLIGATIONS_Y_TICKS = [3500, 3000, 2500, 2000, 1500, 1000];

export const AVERAGE_RECEIPT_Y_MAX = 20000;
export const AVERAGE_RECEIPT_Y_TICKS = [20000, 16000, 12000, 8000, 4000, 0];

export type TaxStatus = "Pending" | "Declined";

export interface PendingTaxItem {
  id: string;
  taxType: string;
  salon: string;
  period: string;
  amount: string;
  dueDate: string;
  status: TaxStatus;
}

export const INITIAL_PENDING_TAXES: PendingTaxItem[] = [
  {
    id: "1",
    taxType: "VAT",
    salon: "Glamour Beauty",
    period: "December 2024",
    amount: "€ 4,200.00",
    dueDate: "Dec 01, 2024",
    status: "Declined",
  },
  {
    id: "2",
    taxType: "Income Tax",
    salon: "Chic Hair & Beauty",
    period: "December 2024",
    amount: "€ 4,200.00",
    dueDate: "Dec 01, 2024",
    status: "Pending",
  },
  {
    id: "3",
    taxType: "Corporate Tax",
    salon: "Urban Elegance",
    period: "November 2024",
    amount: "€ 8,500.00",
    dueDate: "Nov 05, 2024",
    status: "Declined",
  },
  {
    id: "4",
    taxType: "VAT",
    salon: "Luxe Lounge",
    period: "November 2024",
    amount: "€ 3,100.00",
    dueDate: "Nov 10, 2024",
    status: "Pending",
  },
  {
    id: "5",
    taxType: "Sales Tax",
    salon: "Radiant Salon",
    period: "October 2024",
    amount: "€ 1,250.00",
    dueDate: "Oct 12, 2024",
    status: "Pending",
  },
  {
    id: "6",
    taxType: "Income Tax",
    salon: "Style Studio",
    period: "October 2024",
    amount: "€ 5,400.00",
    dueDate: "Oct 15, 2024",
    status: "Pending",
  },
  {
    id: "7",
    taxType: "VAT",
    salon: "Glamour Beauty",
    period: "September 2024",
    amount: "€ 4,100.00",
    dueDate: "Sep 01, 2024",
    status: "Declined",
  },
  {
    id: "8",
    taxType: "Corporate Tax",
    salon: "Chic Hair & Beauty",
    period: "September 2024",
    amount: "€ 7,200.00",
    dueDate: "Sep 05, 2024",
    status: "Declined",
  },
  {
    id: "9",
    taxType: "Sales Tax",
    salon: "Urban Elegance",
    period: "August 2024",
    amount: "€ 1,450.00",
    dueDate: "Aug 12, 2024",
    status: "Pending",
  },
  {
    id: "10",
    taxType: "Income Tax",
    salon: "Luxe Lounge",
    period: "August 2024",
    amount: "€ 4,800.00",
    dueDate: "Aug 20, 2024",
    status: "Declined",
  },
];

export type TaxHistoryStatus = "Approved" | "Declined" | "Cancelled";

export interface TaxHistoryItem {
  id: string;
  taxType: string;
  salon: string;
  period: string;
  amount: string;
  paidDate: string;
  status: TaxHistoryStatus;
}

export const INITIAL_TAX_HISTORY: TaxHistoryItem[] = [
  {
    id: "1",
    taxType: "VAT",
    salon: "Glamour Beauty",
    period: "December 2024",
    amount: "€ 4,200.00",
    paidDate: "Dec 01, 2024",
    status: "Approved",
  },
  {
    id: "2",
    taxType: "Income Tax",
    salon: "Chic Hair & Beauty",
    period: "December 2024",
    amount: "€ 4,200.00",
    paidDate: "Dec 01, 2024",
    status: "Approved",
  },
  {
    id: "3",
    taxType: "Corporate Tax",
    salon: "Urban Elegance",
    period: "November 2024",
    amount: "€ 8,500.00",
    paidDate: "Nov 05, 2024",
    status: "Declined",
  },
  {
    id: "4",
    taxType: "VAT",
    salon: "Luxe Lounge",
    period: "November 2024",
    amount: "€ 3,100.00",
    paidDate: "Nov 10, 2024",
    status: "Approved",
  },
  {
    id: "5",
    taxType: "Sales Tax",
    salon: "Radiant Salon",
    period: "October 2024",
    amount: "€ 1,250.00",
    paidDate: "Oct 12, 2024",
    status: "Cancelled",
  },
  {
    id: "6",
    taxType: "Income Tax",
    salon: "Style Studio",
    period: "October 2024",
    amount: "€ 5,400.00",
    paidDate: "Oct 15, 2024",
    status: "Approved",
  },
  {
    id: "7",
    taxType: "VAT",
    salon: "Glamour Beauty",
    period: "September 2024",
    amount: "€ 4,100.00",
    paidDate: "Sep 01, 2024",
    status: "Approved",
  },
  {
    id: "8",
    taxType: "Corporate Tax",
    salon: "Chic Hair & Beauty",
    period: "September 2024",
    amount: "€ 7,200.00",
    paidDate: "Sep 05, 2024",
    status: "Declined",
  },
  {
    id: "9",
    taxType: "Sales Tax",
    salon: "Urban Elegance",
    period: "August 2024",
    amount: "€ 1,450.00",
    paidDate: "Aug 12, 2024",
    status: "Approved",
  },
  {
    id: "10",
    taxType: "Income Tax",
    salon: "Luxe Lounge",
    period: "August 2024",
    amount: "€ 4,800.00",
    paidDate: "Aug 20, 2024",
    status: "Approved",
  },
];
