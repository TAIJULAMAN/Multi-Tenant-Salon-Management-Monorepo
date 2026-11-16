// ─── 1. OVERVIEW DATA ────────────────────────────────────────────────────────

export interface FinancesKPICardData {
  id: string;
  title: string;
  value: string;
  trend: string;
  trendType: "up" | "down" | "neutral";
  subtitle: string;
  icon: string;
  bgColor: string;
  iconBg: string;
  iconColor: string;
}

export const FINANCES_OVERVIEW_KPIS: FinancesKPICardData[] = [
  {
    id: "totalExpenses",
    title: "Total Monthly Expenses",
    value: "€ 23,850",
    trend: "+12.5%",
    trendType: "up",
    subtitle: "from last month",
    icon: "cash",
    bgColor: "#EEECFF",
    iconBg: "#635BFF",
    iconColor: "#FFFFFF",
  },
  {
    id: "highestExpense",
    title: "Highest Monthly Expense",
    value: "€ 5,535.52",
    trend: "Products - HR",
    trendType: "neutral",
    subtitle: "Glamour Beauty Roma",
    icon: "trending-up",
    bgColor: "#FFF0F6",
    iconBg: "#F06595",
    iconColor: "#FFFFFF",
  },
  {
    id: "totalTxCount",
    title: "Total Transactions",
    value: "23",
    trend: "+10.5%",
    trendType: "up",
    subtitle: "from last month",
    icon: "swap-horizontal",
    bgColor: "#F0FDFA",
    iconBg: "#14B8A6",
    iconColor: "#FFFFFF",
  },
  {
    id: "avgDailySpending",
    title: "Average Daily Spending",
    value: "€ 435",
    trend: "-10%",
    trendType: "down",
    subtitle: "from last month",
    icon: "calendar",
    bgColor: "#FFFBEB",
    iconBg: "#F59E0B",
    iconColor: "#FFFFFF",
  },
];

export interface CategoryExpenseBreakdown {
  category: string;
  amount: number;
  color: string;
  percentage: number;
}

export const MONTHLY_CATEGORY_EXPENSES: CategoryExpenseBreakdown[] = [
  { category: "Products", amount: 8450, color: "#635BFF", percentage: 35 },
  { category: "HR Payroll", amount: 6200, color: "#8B5CF6", percentage: 26 },
  { category: "Services", amount: 4100, color: "#EC4899", percentage: 17 },
  { category: "Taxes F24", amount: 2550, color: "#F59E0B", percentage: 11 },
  { category: "Consumables", amount: 1000, color: "#10B981", percentage: 4 },
  { category: "Utilities", amount: 1000, color: "#06B6D4", percentage: 4 },
  { category: "Internet", amount: 550, color: "#64748B", percentage: 3 },
];

export const MACRO_CATEGORIES_EXPENSES = [
  { category: "Products", amount: 8450, color: "#635BFF" },
  { category: "HR", amount: 6200, color: "#8B5CF6" },
  { category: "Services", amount: 4100, color: "#EC4899" },
  { category: "Taxes", amount: 2550, color: "#F59E0B" },
  { category: "Consumables", amount: 1000, color: "#10B981" },
  { category: "Utilities", amount: 1000, color: "#06B6D4" },
];

export const DAILY_SPENDING_TRENDS = [
  { day: "Mon", amount: 2400 },
  { day: "Tue", amount: 3100 },
  { day: "Wed", amount: 6400 },
  { day: "Thu", amount: 1800 },
  { day: "Fri", amount: 4200 },
  { day: "Sat", amount: 5300 },
  { day: "Sun", amount: 900 },
];

export const SALON_EXPENSES_BREAKDOWN = [
  { salonName: "Glamour Beauty", amount: 4200 },
  { salonName: "Style Studio", amount: 3100 },
  { salonName: "Chic Hair", amount: 2800 },
];

export const PAYMENT_METHODS_DISTRIBUTION = [
  { method: "Card Terminal", amount: 320000, color: "#8B5CF6" },
  { method: "Cash", amount: 145000, color: "#22C55E" },
  { method: "Online Payment", amount: 98000, color: "#3B82F6" },
  { method: "Gift Card", amount: 34468, color: "#F59E0B" },
];

export const CATEGORIES_EXPENSES_BAR = [
  { category: "Cat 1", amount: 1200 },
  { category: "Cat 2", amount: 950 },
  { category: "Cat 3", amount: 600 },
  { category: "Cat 4", amount: 400 },
];

export const SUPPLIER_EXPENSES_DATA = [
  { supplier: "L'Oréal", amount: 1850 },
  { supplier: "Wella", amount: 1400 },
  { supplier: "Enel", amount: 1120 },
  { supplier: "TIM", amount: 550 },
  { supplier: "Sanitary", amount: 450 },
];

export interface LatestFinanceTx {
  id: string;
  salon: string;
  date: string;
  cost: string;
  supplier: string;
  macroCategory: string;
  category: string;
  paymentMethod: string;
  avatarEmoji: string;
}

export const LATEST_FINANCE_TRANSACTIONS: LatestFinanceTx[] = [
  {
    id: "tx-1",
    salon: "Glamour Beauty Roma",
    date: "02/01/2025 17:00",
    cost: "€ 180.50",
    supplier: "TIM Business",
    macroCategory: "Internet",
    category: "Category 1",
    paymentMethod: "Cash",
    avatarEmoji: "👩",
  },
  {
    id: "tx-2",
    salon: "Style Studio Milano",
    date: "02/01/2025 17:00",
    cost: "€ 5,535.52",
    supplier: "L'Oréal Professionnel",
    macroCategory: "Products",
    category: "Category 1",
    paymentMethod: "Credit Card",
    avatarEmoji: "👩‍🦰",
  },
  {
    id: "tx-3",
    salon: "Chic Hair & Beauty",
    date: "10/02/2025 10:15",
    cost: "€ 4,800.00",
    supplier: "Studio Commercialista",
    macroCategory: "HR",
    category: "Category 2",
    paymentMethod: "Card Terminal",
    avatarEmoji: "🧑",
  },
  {
    id: "tx-4",
    salon: "Chic Hair & Beauty",
    date: "10/02/2025 15:45",
    cost: "€ 640.20",
    supplier: "Sanitary Beauty",
    macroCategory: "Consumables",
    category: "Category 3",
    paymentMethod: "Cash",
    avatarEmoji: "👩",
  },
];

export interface UpcomingPayableItem {
  id: string;
  name: string;
  description: string;
  amount: string;
  dueDate: string;
  avatarEmoji: string;
  category: string;
}

export const UPCOMING_PAYABLES: UpcomingPayableItem[] = [
  {
    id: "up1",
    name: "L'Oréal Professionnel Italia",
    description: "Quarterly Hair Care Supplies Batch",
    amount: "€ 3,450.00",
    dueDate: "Due in 2 days",
    avatarEmoji: "🧴",
    category: "Products",
  },
  {
    id: "up2",
    name: "Enel Energia S.p.A.",
    description: "Commercial Electricity Supply Roma",
    amount: "€ 1,120.75",
    dueDate: "Due in 5 days",
    avatarEmoji: "⚡",
    category: "Utilities",
  },
  {
    id: "up3",
    name: "Studio Commercialista & Partners",
    description: "Payroll Filing & Fiscal Compliance Q3",
    amount: "€ 4,800.00",
    dueDate: "Due in 1 week",
    avatarEmoji: "💼",
    category: "HR",
  },
];

// ─── 2. INCOME & REVENUE DATA ────────────────────────────────────────────────

export interface EmployeeIncomeItem {
  id: string;
  name: string;
  revenue: number;
  servicesCount: number;
  avatarEmoji: string;
}

export const TOP_EMPLOYEES_INCOME: EmployeeIncomeItem[] = [
  { id: "staff-1", name: "Maria Rodriguez", revenue: 5800, servicesCount: 78, avatarEmoji: "👩‍🦰" },
  { id: "staff-2", name: "Sofia Bianchi", revenue: 4950, servicesCount: 62, avatarEmoji: "👩" },
  { id: "staff-3", name: "Lucia Moretti", revenue: 4200, servicesCount: 65, avatarEmoji: "👱‍♀️" },
  { id: "staff-4", name: "Elena Romano", revenue: 3600, servicesCount: 52, avatarEmoji: "👩‍💼" },
  { id: "staff-5", name: "Clara Santi", revenue: 2900, servicesCount: 41, avatarEmoji: "👧" },
];

// ─── 3. EXPENSE DATA ─────────────────────────────────────────────────────────

export interface ExpenseItem {
  id: string;
  date: string;
  salon: string;
  macroCategory: "Internet" | "HR" | "Consumables" | "Products" | "Taxes" | "Services" | "Utilities";
  category: string;
  cost: number;
  supplier: string;
  paymentMethod: "Cash" | "Credit Card" | "Online Payment" | "Card Terminal";
  note?: string;
  hasAttachment: boolean;
  attachmentName?: string;
  avatarEmoji: string;
}

export const INITIAL_EXPENSES: ExpenseItem[] = [
  {
    id: "exp-1",
    date: "02/01/2025 17:00",
    salon: "Glamour Beauty",
    macroCategory: "Internet",
    category: "Category 1",
    cost: 180.50,
    supplier: "Supplier Name",
    paymentMethod: "Cash",
    note: "High-speed optical fiber and POS failover sim",
    hasAttachment: true,
    attachmentName: "internet_invoice.pdf",
    avatarEmoji: "👩",
  },
  {
    id: "exp-2",
    date: "02/01/2025 17:00",
    salon: "Style Studio",
    macroCategory: "Products",
    category: "Category 1",
    cost: 5535.52,
    supplier: "L'Oréal Professionnel",
    paymentMethod: "Credit Card",
    note: "Professional salon cosmetics and shampoos batch",
    hasAttachment: true,
    attachmentName: "cosmetics_invoice.pdf",
    avatarEmoji: "👩‍🦰",
  },
  {
    id: "exp-3",
    date: "15/01/2025 14:30",
    salon: "Style Studio",
    macroCategory: "Taxes",
    category: "Category 2",
    cost: 1420.00,
    supplier: "Studio Commercialista",
    paymentMethod: "Credit Card",
    note: "Municipal waste tax (TARI) quarterly payment",
    hasAttachment: false,
    avatarEmoji: "👱‍♀️",
  },
  {
    id: "exp-4",
    date: "15/01/2025 11:20",
    salon: "Style Studio",
    macroCategory: "Services",
    category: "Category 1",
    cost: 850.00,
    supplier: "Supplier Name",
    paymentMethod: "Online Payment",
    note: "HVAC and styling station monthly maintenance",
    hasAttachment: true,
    attachmentName: "maintenance_service.pdf",
    avatarEmoji: "👩‍💼",
  },
  {
    id: "exp-5",
    date: "28/01/2025 16:00",
    salon: "Glamour Beauty",
    macroCategory: "Utilities",
    category: "Category 3",
    cost: 1120.75,
    supplier: "Enel Energia",
    paymentMethod: "Online Payment",
    note: "Commercial energy supply and electricity bill",
    hasAttachment: true,
    attachmentName: "energy_bill.pdf",
    avatarEmoji: "👧",
  },
  {
    id: "exp-6",
    date: "10/02/2025 10:15",
    salon: "Chic Hair & Beauty",
    macroCategory: "HR",
    category: "Category 2",
    cost: 4800.00,
    supplier: "Studio Commercialista",
    paymentMethod: "Card Terminal",
    note: "Staff payroll calculation and social security filing",
    hasAttachment: true,
    attachmentName: "hr_advisory.pdf",
    avatarEmoji: "🧑",
  },
  {
    id: "exp-7",
    date: "10/02/2025 15:45",
    salon: "Chic Hair & Beauty",
    macroCategory: "Consumables",
    category: "Category 3",
    cost: 640.20,
    supplier: "Supplier Name",
    paymentMethod: "Cash",
    note: "Disposable capes, neck strips and foil packs",
    hasAttachment: true,
    attachmentName: "consumables_receipt.pdf",
    avatarEmoji: "👩",
  },
  {
    id: "exp-8",
    date: "18/02/2025 13:00",
    salon: "Glamour Beauty",
    macroCategory: "Products",
    category: "Category 2",
    cost: 2350.00,
    supplier: "L'Oréal Professionnel",
    paymentMethod: "Card Terminal",
    note: "Hair color tubes, bleach powders and developers",
    hasAttachment: false,
    avatarEmoji: "👱‍♀️",
  },
  {
    id: "exp-9",
    date: "18/02/2025 17:30",
    salon: "Style Studio",
    macroCategory: "Utilities",
    category: "Category 1",
    cost: 730.40,
    supplier: "Enel Energia",
    paymentMethod: "Cash",
    note: "Water supply and municipal heating maintenance",
    hasAttachment: true,
    attachmentName: "water_utility.pdf",
    avatarEmoji: "👩‍🦰",
  },
  {
    id: "exp-10",
    date: "28/01/2025 09:30",
    salon: "Chic Hair & Beauty",
    macroCategory: "Services",
    category: "Category 3",
    cost: 450.00,
    supplier: "Supplier Name",
    paymentMethod: "Online Payment",
    note: "Digital marketing campaign and local SEO services",
    hasAttachment: true,
    attachmentName: "marketing_service.pdf",
    avatarEmoji: "👩‍💼",
  },
];

// ─── 4. PAYMENTS DATA ────────────────────────────────────────────────────────

export interface PaymentSaleItem {
  id: string;
  paymentDate: string;
  clientName: string;
  clientEmail: string;
  teamMember: string;
  teamMemberEmail: string;
  salon: string;
  method: "Cash" | "Card Terminal" | "Gift Card" | "Online Payment";
  status: "Fully Paid" | "Half Paid" | "Not Paid";
  receiptIssue: "Completed" | "Half Printed" | "Not Issued";
  amount: number;
  service: string;
  duration?: string;
  startTime?: string;
  paidCash?: number;
  balance?: number;
  activityTimeline?: {
    time: string;
    text: string;
    sub: string;
    type: "refund" | "created" | "issued";
  }[];
  refundDetails?: {
    id: string;
    title: string;
    date: string;
    accidentalCharge: number;
    refundAmount: number;
    method: string;
    by: string;
    reason: string;
  };
}

export const INITIAL_PAYMENTS_DATA: PaymentSaleItem[] = [
  {
    id: "#000",
    paymentDate: "5 Aug 2025, 12:30",
    clientName: "Maria Rodriguez",
    clientEmail: "maria@beautywellness.com",
    teamMember: "Maria Rodriguez",
    teamMemberEmail: "maria@beautywellness.com",
    salon: "Glamour Beauty",
    method: "Cash",
    status: "Fully Paid",
    receiptIssue: "Completed",
    amount: 170.0,
    service: "Haircut",
    duration: "15 min",
    startTime: "12:00",
    paidCash: 10.0,
    balance: 160.0,
    activityTimeline: [
      {
        time: "TODAY, 14:34",
        text: "€ 10 refunded by cash",
        sub: "Completed by Maria Rodriguez",
        type: "refund",
      },
      {
        time: "TODAY, 14:34",
        text: "Sale #1 created",
        sub: "Completed by Maria Rodriguez",
        type: "created",
      },
    ],
    refundDetails: {
      id: "ref-1",
      title: "Refund #1",
      date: "5 Aug 2025, 12:30",
      accidentalCharge: 170.0,
      refundAmount: 10.0,
      method: "Cash",
      by: "Maria Rodriguez",
      reason: "Accidental Charge",
    },
  },
  {
    id: "#001",
    paymentDate: "5 Aug 2025, 12:30",
    clientName: "Maria Rodriguez",
    clientEmail: "maria@beautywellness.com",
    teamMember: "Maria Rodriguez",
    teamMemberEmail: "maria@beautywellness.com",
    salon: "Style Studio",
    method: "Card Terminal",
    status: "Fully Paid",
    receiptIssue: "Not Issued",
    amount: 170.0,
    service: "Haircut",
    duration: "15 min",
    startTime: "12:00",
    paidCash: 170.0,
    balance: 0.0,
  },
  {
    id: "#002",
    paymentDate: "5 Aug 2025, 12:30",
    clientName: "Maria Rodriguez",
    clientEmail: "maria@beautywellness.com",
    teamMember: "Maria Rodriguez",
    teamMemberEmail: "maria@beautywellness.com",
    salon: "Style Studio",
    method: "Gift Card",
    status: "Half Paid",
    receiptIssue: "Half Printed",
    amount: 170.0,
    service: "Haircut",
    duration: "15 min",
    startTime: "12:00",
    paidCash: 85.0,
    balance: 85.0,
  },
  {
    id: "#003",
    paymentDate: "5 Aug 2025, 12:30",
    clientName: "Maria Rodriguez",
    clientEmail: "maria@beautywellness.com",
    teamMember: "Maria Rodriguez",
    teamMemberEmail: "maria@beautywellness.com",
    salon: "Style Studio",
    method: "Online Payment",
    status: "Not Paid",
    receiptIssue: "Not Issued",
    amount: 170.0,
    service: "Haircut",
    duration: "15 min",
    startTime: "12:00",
    paidCash: 0.0,
    balance: 170.0,
  },
  {
    id: "#004",
    paymentDate: "5 Aug 2025, 12:30",
    clientName: "Maria Rodriguez",
    clientEmail: "maria@beautywellness.com",
    teamMember: "Maria Rodriguez",
    teamMemberEmail: "maria@beautywellness.com",
    salon: "Glamour Beauty",
    method: "Online Payment",
    status: "Not Paid",
    receiptIssue: "Not Issued",
    amount: 170.0,
    service: "Haircut",
    duration: "15 min",
    startTime: "12:00",
    paidCash: 0.0,
    balance: 170.0,
  },
  {
    id: "#005",
    paymentDate: "4 Aug 2025, 16:15",
    clientName: "Sofia Bianchi",
    clientEmail: "sofia.b@gmail.com",
    teamMember: "Lucia Moretti",
    teamMemberEmail: "lucia@beautywellness.com",
    salon: "Glamour Beauty",
    method: "Cash",
    status: "Fully Paid",
    receiptIssue: "Completed",
    amount: 120.0,
    service: "Balayage Deluxe",
  },
  {
    id: "#006",
    paymentDate: "4 Aug 2025, 14:00",
    clientName: "Elena Rossi",
    clientEmail: "elena.r@live.com",
    teamMember: "Maria Rodriguez",
    teamMemberEmail: "maria@beautywellness.com",
    salon: "Style Studio",
    method: "Card Terminal",
    status: "Fully Paid",
    receiptIssue: "Completed",
    amount: 85.0,
    service: "Styling & Cut",
  },
  {
    id: "#007",
    paymentDate: "3 Aug 2025, 11:30",
    clientName: "Giulia Verdi",
    clientEmail: "giulia.v@yahoo.com",
    teamMember: "Elena Romano",
    teamMemberEmail: "elena@beautywellness.com",
    salon: "Glamour Beauty",
    method: "Online Payment",
    status: "Fully Paid",
    receiptIssue: "Completed",
    amount: 210.0,
    service: "Color & Treatment",
  },
  {
    id: "#008",
    paymentDate: "2 Aug 2025, 17:45",
    clientName: "Chiara Neri",
    clientEmail: "chiara.n@outlook.com",
    teamMember: "Clara Santi",
    teamMemberEmail: "clara@beautywellness.com",
    salon: "Style Studio",
    method: "Cash",
    status: "Half Paid",
    receiptIssue: "Half Printed",
    amount: 65.0,
    service: "Blowdry & Spa",
  },
];

// ─── 5. RECEIPTS DATA ────────────────────────────────────────────────────────

export interface ElectronicReceiptItem {
  id: string;
  code: string;
  date: string;
  clientName: string;
  clientEmail: string;
  salon: string;
  amount: number;
  vatAmount: number;
  netAmount: number;
  method: "Cash" | "Card Terminal" | "Gift Card" | "Online Payment";
  status: "Issued" | "Draft" | "Canceled";
}

export interface ReceiptsSummaryKPIData {
  total: string;
  media: string;
  receiptsCount: string;
  uniqueCustomers: string;
}

export const RECEIPTS_SUMMARY_KPIS: ReceiptsSummaryKPIData = {
  total: "€ 947",
  media: "€ 118.38",
  receiptsCount: "9",
  uniqueCustomers: "1",
};

export const INITIAL_RECEIPTS_DATA: ElectronicReceiptItem[] = [
  {
    id: "rec-1",
    code: "#000",
    date: "5 Aug 2025, 12:30",
    clientName: "Maria Rodriguez",
    clientEmail: "maria@beautywellness.com",
    salon: "Glamour Beauty",
    amount: 2300.0,
    vatAmount: 414.75,
    netAmount: 1885.25,
    method: "Cash",
    status: "Issued",
  },
  {
    id: "rec-2",
    code: "#000",
    date: "5 Aug 2025, 12:30",
    clientName: "Maria Rodriguez",
    clientEmail: "maria@beautywellness.com",
    salon: "Glamour Beauty",
    amount: 2300.0,
    vatAmount: 414.75,
    netAmount: 1885.25,
    method: "Cash",
    status: "Issued",
  },
  {
    id: "rec-3",
    code: "#000",
    date: "5 Aug 2025, 12:30",
    clientName: "Maria Rodriguez",
    clientEmail: "maria@beautywellness.com",
    salon: "Glamour Beauty",
    amount: 2300.0,
    vatAmount: 414.75,
    netAmount: 1885.25,
    method: "Cash",
    status: "Issued",
  },
  {
    id: "rec-4",
    code: "#000",
    date: "5 Aug 2025, 12:30",
    clientName: "Maria Rodriguez",
    clientEmail: "maria@beautywellness.com",
    salon: "Glamour Beauty",
    amount: 2300.0,
    vatAmount: 414.75,
    netAmount: 1885.25,
    method: "Cash",
    status: "Issued",
  },
  {
    id: "rec-5",
    code: "#000",
    date: "5 Aug 2025, 12:30",
    clientName: "Maria Rodriguez",
    clientEmail: "maria@beautywellness.com",
    salon: "Glamour Beauty",
    amount: 2300.0,
    vatAmount: 414.75,
    netAmount: 1885.25,
    method: "Cash",
    status: "Issued",
  },
];
