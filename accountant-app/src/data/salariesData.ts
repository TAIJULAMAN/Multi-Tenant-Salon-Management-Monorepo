import React from "react";

export interface SalariesKPICardData {
  id: string;
  title: string;
  value: string;
  subtext: string;
  change: string;
  icon: string;
  bgColor: string;
  iconBg: string;
}

export const SALARIES_KPI_CONFIG: SalariesKPICardData[] = [
  {
    id: "awaitingApproval",
    title: "Awaiting Approval",
    value: "12",
    subtext: "Avg. 3.5 days waiting",
    change: "+2 from last week",
    icon: "time",
    bgColor: "#FFFBEB",
    iconBg: "#F8C209",
  },
  {
    id: "recentlyDeclined",
    title: "Recently Declined",
    value: "3",
    subtext: "Last 30 days",
    change: "-1 from last month",
    icon: "alert-circle",
    bgColor: "#FDF2F8",
    iconBg: "#FF6692",
  },
  {
    id: "processedThisMonth",
    title: "Processed This Month",
    value: "€127,450",
    subtext: "43 salaries",
    change: "+€12,300 from last month",
    icon: "cash",
    bgColor: "#F0FDFA",
    iconBg: "#16CDC7",
  },
  {
    id: "avgProcessingTime",
    title: "Avg Processing Time",
    value: "2.3 Days",
    subtext: "-0.5 days from last month",
    change: "Down from 2.8 days",
    icon: "checkmark-circle",
    bgColor: "#EEECFF",
    iconBg: "#635BFF",
  },
];

export const SALARY_PAYROLL_MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// Exact web dashboard Monthly Salary Expenditures dataset
export const SALARY_EXPENDITURES_BY_YEAR: Record<string, number[]> = {
  "2024": [2500, 4000, 3300, 2700, 3000, 3200, 3800, 3300, 3100, 4200, 5100, 5900],
  "2025": [3000, 4800, 3900, 3100, 3500, 3800, 4500, 3900, 3700, 5000, 6000, 7000],
  "2026": [3600, 5700, 4700, 3700, 4200, 4600, 5400, 4700, 4400, 6000, 7200, 8400],
};

export const MONTHLY_EXPENDITURES_BY_YEAR: Record<string, { month: string; amount: number }[]> = {
  "2026": [
    { month: "Jan", amount: 3600 },
    { month: "Feb", amount: 5700 },
    { month: "Mar", amount: 4700 },
    { month: "Apr", amount: 3700 },
    { month: "May", amount: 4200 },
    { month: "Jun", amount: 4600 },
    { month: "Jul", amount: 5400 },
    { month: "Aug", amount: 4700 },
    { month: "Sep", amount: 4400 },
    { month: "Oct", amount: 6000 },
    { month: "Nov", amount: 7200 },
    { month: "Dec", amount: 8400 },
  ],
  "2025": [
    { month: "Jan", amount: 3000 },
    { month: "Feb", amount: 4800 },
    { month: "Mar", amount: 3900 },
    { month: "Apr", amount: 3100 },
    { month: "May", amount: 3500 },
    { month: "Jun", amount: 3800 },
    { month: "Jul", amount: 4500 },
    { month: "Aug", amount: 3900 },
    { month: "Sep", amount: 3700 },
    { month: "Oct", amount: 5000 },
    { month: "Nov", amount: 6000 },
    { month: "Dec", amount: 7000 },
  ],
  "2024": [
    { month: "Jan", amount: 2500 },
    { month: "Feb", amount: 4000 },
    { month: "Mar", amount: 3300 },
    { month: "Apr", amount: 2700 },
    { month: "May", amount: 3000 },
    { month: "Jun", amount: 3200 },
    { month: "Jul", amount: 3800 },
    { month: "Aug", amount: 3300 },
    { month: "Sep", amount: 3100 },
    { month: "Oct", amount: 4200 },
    { month: "Nov", amount: 5100 },
    { month: "Dec", amount: 5900 },
  ],
};

export const EXPENDITURES_Y_MAX = 14000;
export const EXPENDITURES_Y_TICKS = [14000, 10500, 7000, 3500, 0];

export const SALARY_DISTRIBUTION_BRACKETS = [
  "€1 - 1.5K",
  "€1.5 - 2K",
  "€2 - 2.5K",
  "€2.5 - 3K",
  "€3K +",
];

export const SALARY_DISTRIBUTION_COUNTS_BY_YEAR: Record<string, number[]> = {
  "2024": [12, 9, 8, 5, 1],
  "2025": [10, 7, 12, 8, 2],
  "2026": [8, 6, 13, 11, 4],
};

export const DISTRIBUTION_Y_MAX = 16;
export const DISTRIBUTION_Y_TICKS = [16, 12, 8, 4, 0];

export interface SalaryDistributionItem {
  label: string;
  bracket?: string;
  count: number;
  percentage: number;
  color: string;
}

export const SALARY_DISTRIBUTION_BY_YEAR: Record<string, SalaryDistributionItem[]> = {
  "2026": [
    { label: "€1 - 1.5K", bracket: "€1 - 1.5K", count: 8, percentage: 19, color: "#16CDC7" },
    { label: "€1.5 - 2K", bracket: "€1.5 - 2K", count: 6, percentage: 15, color: "#635BFF" },
    { label: "€2 - 2.5K", bracket: "€2 - 2.5K", count: 13, percentage: 31, color: "#F8C209" },
    { label: "€2.5 - 3K", bracket: "€2.5 - 3K", count: 11, percentage: 26, color: "#FF6692" },
    { label: "€3K +", bracket: "€3K +", count: 4, percentage: 9, color: "#0CA678" },
  ],
  "2025": [
    { label: "€1 - 1.5K", bracket: "€1 - 1.5K", count: 10, percentage: 25, color: "#16CDC7" },
    { label: "€1.5 - 2K", bracket: "€1.5 - 2K", count: 7, percentage: 18, color: "#635BFF" },
    { label: "€2 - 2.5K", bracket: "€2 - 2.5K", count: 12, percentage: 30, color: "#F8C209" },
    { label: "€2.5 - 3K", bracket: "€2.5 - 3K", count: 8, percentage: 20, color: "#FF6692" },
    { label: "€3K +", bracket: "€3K +", count: 2, percentage: 7, color: "#0CA678" },
  ],
  "2024": [
    { label: "€1 - 1.5K", bracket: "€1 - 1.5K", count: 12, percentage: 34, color: "#16CDC7" },
    { label: "€1.5 - 2K", bracket: "€1.5 - 2K", count: 9, percentage: 26, color: "#635BFF" },
    { label: "€2 - 2.5K", bracket: "€2 - 2.5K", count: 8, percentage: 23, color: "#F8C209" },
    { label: "€2.5 - 3K", bracket: "€2.5 - 3K", count: 5, percentage: 14, color: "#FF6692" },
    { label: "€3K +", bracket: "€3K +", count: 1, percentage: 3, color: "#0CA678" },
  ],
};

export interface DeclinedSalaryItem {
  id: string;
  name: string;
  empId: string;
  avatarEmoji: string;
  salon: string;
  period: string;
  gross: number;
  net: number;
  reason: string;
  declinedDate: string;
  time?: string;
}

export const RECENTLY_DECLINED_SALARIES: DeclinedSalaryItem[] = [
  {
    id: "ds1",
    name: "Marco Rossi",
    empId: "EMP001",
    avatarEmoji: "👨‍💼",
    salon: "Glamour Beauty Roma",
    period: "August 2026",
    gross: 3800,
    net: 2850,
    reason: "Incorrect bonus calculation",
    declinedDate: "Aug 15, 2026",
    time: "2 hours ago",
  },
  {
    id: "ds2",
    name: "Giulia Bianchi",
    empId: "EMP002",
    avatarEmoji: "👩‍💼",
    salon: "Style Studio Milano",
    period: "August 2026",
    gross: 3200,
    net: 2400,
    reason: "Overtime hours not approved",
    declinedDate: "Aug 14, 2026",
    time: "Yesterday",
  },
  {
    id: "ds3",
    name: "Alessandro Romano",
    empId: "EMP003",
    avatarEmoji: "👨",
    salon: "Chic Hair Napoli",
    period: "July 2026",
    gross: 4100,
    net: 3100,
    reason: "Missing tax deduction form",
    declinedDate: "Aug 10, 2026",
    time: "3 days ago",
  },
];

export interface PendingSalaryItem {
  id: string;
  name: string;
  uploadedBy: string;
  avatarEmoji: string;
  salon: string;
  period: string;
  gross: number;
  net: number;
  status: "Pending" | "Declined";
  uploadedDate: string;
  reason?: string;
}

export const INITIAL_PENDING_SALARIES: PendingSalaryItem[] = [
  {
    id: "ps1",
    name: "Maria Rodriguez",
    uploadedBy: "Lisa Owner",
    avatarEmoji: "👩‍💼",
    salon: "Glamour Beauty Roma",
    period: "December 2026",
    gross: 4200,
    net: 3200,
    status: "Pending",
    uploadedDate: "Dec 01, 2026",
  },
  {
    id: "ps2",
    name: "Marco Rossi",
    uploadedBy: "Lisa Owner",
    avatarEmoji: "👨‍💼",
    salon: "Style Studio Milano",
    period: "December 2026",
    gross: 3900,
    net: 2950,
    status: "Pending",
    uploadedDate: "Dec 01, 2026",
  },
  {
    id: "ps3",
    name: "Elena Romano",
    uploadedBy: "Maria Rossi",
    avatarEmoji: "👩",
    salon: "Style Studio Milano",
    period: "December 2026",
    gross: 3600,
    net: 2700,
    status: "Declined",
    uploadedDate: "Dec 01, 2026",
    reason: "Incorrect gross amount calculation. Please verify the overtime hours.",
  },
  {
    id: "ps4",
    name: "Sofia Conti",
    uploadedBy: "Maria Rossi",
    avatarEmoji: "👩‍🦱",
    salon: "Chic Hair & Beauty",
    period: "December 2026",
    gross: 4200,
    net: 3200,
    status: "Pending",
    uploadedDate: "Dec 01, 2026",
  },
  {
    id: "ps5",
    name: "Luca Moretti",
    uploadedBy: "Maria Rossi",
    avatarEmoji: "👨",
    salon: "Chic Hair & Beauty",
    period: "December 2026",
    gross: 4100,
    net: 3100,
    status: "Pending",
    uploadedDate: "Dec 01, 2026",
  },
  {
    id: "ps6",
    name: "Chiara Ferrari",
    uploadedBy: "Maria Rossi",
    avatarEmoji: "👩‍🦰",
    salon: "Style Studio Milano",
    period: "December 2026",
    gross: 3800,
    net: 2850,
    status: "Pending",
    uploadedDate: "Dec 01, 2026",
  },
  {
    id: "ps7",
    name: "Jane Smith",
    uploadedBy: "Alice Johnson",
    avatarEmoji: "👱‍♀️",
    salon: "Glamour Beauty Roma",
    period: "December 2026",
    gross: 4400,
    net: 3350,
    status: "Pending",
    uploadedDate: "Dec 02, 2026",
  },
];

export interface SalaryHistoryItem {
  id: string;
  name: string;
  empId: string;
  avatarEmoji: string;
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

export const INITIAL_SALARY_HISTORY: SalaryHistoryItem[] = [
  {
    id: "1",
    name: "Maria Rodriguez",
    empId: "EMP005",
    avatarEmoji: "👩‍💼",
    salon: "Glamour Beauty",
    period: "December 2024",
    gross: 4200,
    net: 3200,
    status: "Declined",
  },
  {
    id: "2",
    name: "Maria Rodriguez",
    empId: "EMP006",
    avatarEmoji: "👩‍⚕️",
    salon: "Style Studio",
    period: "December 2024",
    gross: 4200,
    net: 3200,
    status: "Declined",
  },
  {
    id: "3",
    name: "Maria Rodriguez",
    empId: "EMP007",
    avatarEmoji: "👩",
    salon: "Style Studio",
    period: "December 2024",
    gross: 4200,
    net: 3200,
    status: "Declined",
  },
  {
    id: "4",
    name: "Maria Rodriguez",
    empId: "EMP008",
    avatarEmoji: "👩‍🦰",
    salon: "Chic Hair & Beauty",
    period: "December 2024",
    gross: 4200,
    net: 3200,
    status: "Approved",
    approvedDate: "Dec 01, 2024",
    approvedBy: "Lisa Owner",
    paymentDate: "Dec 01, 2024",
    paymentStatus: "pending",
  },
  {
    id: "5",
    name: "Maria Rodriguez",
    empId: "EMP009",
    avatarEmoji: "👩‍🦱",
    salon: "Chic Hair & Beauty",
    period: "December 2024",
    gross: 4200,
    net: 3200,
    status: "Approved",
    approvedDate: "Dec 01, 2024",
    approvedBy: "Lisa Owner",
    paymentDate: "Dec 01, 2024",
    paymentStatus: "completed",
  },
  {
    id: "6",
    name: "Jane Doe",
    empId: "EMP010",
    avatarEmoji: "👱‍♀️",
    salon: "Glamour Beauty",
    period: "December 2024",
    gross: 3800,
    net: 2900,
    status: "Approved",
    approvedDate: "Dec 02, 2024",
    approvedBy: "Lisa Owner",
    paymentDate: "Dec 02, 2024",
    paymentStatus: "completed",
  },
  {
    id: "7",
    name: "John Smith",
    empId: "EMP011",
    avatarEmoji: "👨",
    salon: "Style Studio",
    period: "December 2024",
    gross: 4500,
    net: 3400,
    status: "Cancelled",
  },
  {
    id: "8",
    name: "Alice Johnson",
    empId: "EMP012",
    avatarEmoji: "👩‍💻",
    salon: "Chic Hair & Beauty",
    period: "December 2024",
    gross: 4100,
    net: 3150,
    status: "Approved",
    approvedDate: "Dec 03, 2024",
    approvedBy: "Lisa Owner",
    paymentDate: "Dec 04, 2024",
    paymentStatus: "pending",
  },
  {
    id: "9",
    name: "Bob Williams",
    empId: "EMP013",
    avatarEmoji: "👨‍🦰",
    salon: "Glamour Beauty",
    period: "December 2024",
    gross: 3900,
    net: 3000,
    status: "Declined",
  },
  {
    id: "10",
    name: "Emma Davis",
    empId: "EMP014",
    avatarEmoji: "👩‍🎨",
    salon: "Style Studio",
    period: "December 2024",
    gross: 4800,
    net: 3600,
    status: "Approved",
    approvedDate: "Dec 05, 2024",
    approvedBy: "Lisa Owner",
    paymentDate: "Dec 05, 2024",
    paymentStatus: "completed",
  },
];

export interface ExtractedSalaryPacket {
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
  confidenceLevel?: "Low" | "Medium" | "High";
  mapped: boolean;
  vendor: string;
  status: "Review" | "Approved";
  avatarEmoji: string;
  pagesCount?: number;
  tfrMonthly?: number;
  totalTfrAmount?: string;
  cfConfidence?: number;
  periodConfidence?: number;
  grossConfidence?: number;
  deemedConfidence?: number;
  netConfidence?: number;
  tfrMonthlyConfidence?: number;
  tfrThisYearConfidence?: number;
  tfrPrevYearsConfidence?: number;
}

export const MOCK_EXTRACTED_SALARIES: ExtractedSalaryPacket[] = [
  {
    id: "ext1",
    employeeName: "Angelica Spalluto",
    period: "08/2026",
    causale: "Stipendio Agosto 2026",
    netSalary: 622.03,
    deemed: 190.24,
    grossSalary: 812.27,
    trfThisYear: 921.38,
    trfPrevYears: 15227.0,
    cf: "SPLLCA88M58F839V",
    confidence: 76,
    confidenceLevel: "Medium",
    mapped: true,
    vendor: "OSRA/Wolters Kluwer",
    status: "Review",
    avatarEmoji: "👩",
    pagesCount: 9,
    tfrMonthly: 62.48,
    totalTfrAmount: "31/12/2024",
    cfConfidence: 76,
    periodConfidence: 83,
    grossConfidence: 76,
    deemedConfidence: 83,
    netConfidence: 99,
    tfrMonthlyConfidence: 71,
    tfrThisYearConfidence: 71,
    tfrPrevYearsConfidence: 72,
  },
  {
    id: "ext2",
    employeeName: "Angelica Bianchi",
    period: "07/2025",
    causale: "Stipendio Luglio 2025",
    netSalary: 780.0,
    deemed: 141.33,
    grossSalary: 921.38,
    trfThisYear: 921.38,
    trfPrevYears: 14116.0,
    cf: "SLNLC87W6W88WJ",
    confidence: 71,
    confidenceLevel: "Medium",
    mapped: false,
    vendor: "OSRA/Wolters Kluwer",
    status: "Review",
    avatarEmoji: "👱‍♀️",
    pagesCount: 9,
    tfrMonthly: 70.87,
    totalTfrAmount: "31/12/2024",
    cfConfidence: 71,
    periodConfidence: 85,
    grossConfidence: 78,
    deemedConfidence: 80,
    netConfidence: 98,
    tfrMonthlyConfidence: 71,
    tfrThisYearConfidence: 71,
    tfrPrevYearsConfidence: 70,
  },
  {
    id: "ext3",
    employeeName: "Davide Ricci",
    period: "08/2026",
    causale: "Stipendio Agosto 2026",
    netSalary: 1950.0,
    deemed: 280.0,
    grossSalary: 2540.0,
    trfThisYear: 211.66,
    trfPrevYears: 4200.0,
    cf: "RCCDVD88A12H501K",
    confidence: 88,
    confidenceLevel: "High",
    mapped: true,
    vendor: "Zucchetti Paghe",
    status: "Approved",
    avatarEmoji: "👨",
    pagesCount: 9,
    tfrMonthly: 195.38,
    totalTfrAmount: "31/12/2024",
    cfConfidence: 90,
    periodConfidence: 92,
    grossConfidence: 88,
    deemedConfidence: 86,
    netConfidence: 99,
    tfrMonthlyConfidence: 85,
    tfrThisYearConfidence: 88,
    tfrPrevYearsConfidence: 87,
  },
  {
    id: "ext4",
    employeeName: "Federica Galli",
    period: "08/2026",
    causale: "Stipendio Agosto 2026",
    netSalary: 1620.0,
    deemed: 195.5,
    grossSalary: 2100.0,
    trfThisYear: 175.0,
    trfPrevYears: 2150.0,
    cf: "GLLFDR95T60F205W",
    confidence: 92,
    confidenceLevel: "High",
    mapped: true,
    vendor: "TeamSystem HR",
    status: "Review",
    avatarEmoji: "👩‍🦰",
    pagesCount: 9,
    tfrMonthly: 161.53,
    totalTfrAmount: "31/12/2024",
    cfConfidence: 94,
    periodConfidence: 96,
    grossConfidence: 92,
    deemedConfidence: 90,
    netConfidence: 99,
    tfrMonthlyConfidence: 89,
    tfrThisYearConfidence: 91,
    tfrPrevYearsConfidence: 93,
  },
  {
    id: "ext5",
    employeeName: "Marco Rossi",
    period: "08/2026",
    causale: "Stipendio Agosto 2026",
    netSalary: 1850.0,
    deemed: 230.0,
    grossSalary: 2400.0,
    trfThisYear: 200.0,
    trfPrevYears: 3800.0,
    cf: "RSSMRC85M15F205X",
    confidence: 95,
    confidenceLevel: "High",
    mapped: true,
    vendor: "Zucchetti Paghe",
    status: "Approved",
    avatarEmoji: "👨‍💼",
    pagesCount: 9,
    tfrMonthly: 184.61,
    totalTfrAmount: "31/12/2024",
    cfConfidence: 97,
    periodConfidence: 98,
    grossConfidence: 95,
    deemedConfidence: 94,
    netConfidence: 100,
    tfrMonthlyConfidence: 93,
    tfrThisYearConfidence: 95,
    tfrPrevYearsConfidence: 96,
  },
];

export interface UploadedPdfFileInfo {
  uri?: string;
  name: string;
  size: string;
}

let activeUploadedPdf: UploadedPdfFileInfo | null = {
  name: "cedolini_agosto_2026.pdf",
  size: "2.4 MB",
};

export function setUploadedPdf(file: UploadedPdfFileInfo | null) {
  activeUploadedPdf = file;
}

export function getUploadedPdf(): UploadedPdfFileInfo | null {
  return activeUploadedPdf;
}

type SalaryListener = (packets: ExtractedSalaryPacket[]) => void;
const salaryListeners: Set<SalaryListener> = new Set();

export function subscribeToSalaryPackets(listener: SalaryListener): () => void {
  salaryListeners.add(listener);
  return () => {
    salaryListeners.delete(listener);
  };
}

export function getMockSalaryPacket(id: string): ExtractedSalaryPacket | undefined {
  return MOCK_EXTRACTED_SALARIES.find((p) => p.id === id);
}

export function updateMockSalaryPacket(packet: ExtractedSalaryPacket) {
  const idx = MOCK_EXTRACTED_SALARIES.findIndex((p) => p.id === packet.id);
  if (idx !== -1) {
    MOCK_EXTRACTED_SALARIES[idx] = { ...packet };
  } else {
    MOCK_EXTRACTED_SALARIES.push({ ...packet });
  }
  salaryListeners.forEach((fn) => fn([...MOCK_EXTRACTED_SALARIES]));
}
