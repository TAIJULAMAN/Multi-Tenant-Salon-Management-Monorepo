// Comprehensive Mock Data for Accountant App flows

export interface Salon {
  id: string;
  name: string;
  location: string;
  logo: string;
  totalRevenue: string;
  totalExpenses: string;
  pendingApprovals: number;
}

export const SALONS_DATA: Salon[] = [
  {
    id: "salon_1",
    name: "Elite Salon Roma",
    location: "Via del Corso 124, Rome",
    logo: "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=256&auto=format&fit=crop",
    totalRevenue: "€28,450.00",
    totalExpenses: "€11,200.00",
    pendingApprovals: 6,
  },
  {
    id: "salon_2",
    name: "Luxe Beauty Milano",
    location: "Via Montenapoleone 8, Milan",
    logo: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=256&auto=format&fit=crop",
    totalRevenue: "€42,100.00",
    totalExpenses: "€16,850.00",
    pendingApprovals: 4,
  },
  {
    id: "salon_3",
    name: "Glamour Studio Napoli",
    location: "Corso Umberto I 45, Naples",
    logo: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=256&auto=format&fit=crop",
    totalRevenue: "€19,750.00",
    totalExpenses: "€8,400.00",
    pendingApprovals: 2,
  },
];

// Dashboard Metrics
export const DASHBOARD_KPIS = [
  {
    id: "balance",
    title: "Total Balance",
    amount: "€124,500.00",
    change: "+14.2%",
    isPositive: true,
    subtitle: "Across all 3 salons",
    icon: "wallet-outline",
    color: "#635BFF",
    bgColor: "#EEECFF",
  },
  {
    id: "pending_approvals",
    title: "Pending Approvals",
    amount: "12 Items",
    change: "6 Urgent",
    isPositive: false,
    subtitle: "Salaries & Invoices",
    icon: "time-outline",
    color: "#F59E0B",
    bgColor: "#FFFBEB",
  },
  {
    id: "monthly_revenue",
    title: "Monthly Revenue",
    amount: "€90,300.00",
    change: "+8.7%",
    isPositive: true,
    subtitle: "August 2026",
    icon: "trending-up-outline",
    color: "#10B981",
    bgColor: "#ECFDF5",
  },
  {
    id: "tax_due",
    title: "Tax & Compliance",
    amount: "€18,450.00",
    change: "Due in 11d",
    isPositive: false,
    subtitle: "VAT Q2 & INPS",
    icon: "calculator-outline",
    color: "#EF4444",
    bgColor: "#FEF2F2",
  },
];

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  salon: string;
  category: "Salary" | "Invoice" | "Tax" | "Expense" | "Document";
  amount?: string;
  timestamp: string;
  status: "Pending" | "Approved" | "Rejected";
  staffName?: string;
}

export const RECENT_ACTIVITIES: ActivityItem[] = [
  {
    id: "act_1",
    title: "Senior Stylist Commission Payout",
    description: "July performance commission for Marco Rossi",
    salon: "Elite Salon Roma",
    category: "Salary",
    amount: "€1,450.00",
    timestamp: "10 mins ago",
    status: "Pending",
    staffName: "Marco Rossi",
  },
  {
    id: "act_2",
    title: "L'Oréal Pro Hair Color Supplies",
    description: "Invoice #INV-2026-894 for Salon Inventory",
    salon: "Luxe Beauty Milano",
    category: "Invoice",
    amount: "€820.00",
    timestamp: "1 hour ago",
    status: "Pending",
  },
  {
    id: "act_3",
    title: "Q2 VAT Declaration Filing",
    description: "Filing approved and submitted to Revenue Agency",
    salon: "Elite Salon Roma",
    category: "Tax",
    amount: "€6,240.00",
    timestamp: "Yesterday, 04:30 PM",
    status: "Approved",
  },
  {
    id: "act_4",
    title: "Emergency Plumbing Repair",
    description: "Wash station pipe replacement",
    salon: "Glamour Studio Napoli",
    category: "Expense",
    amount: "€350.00",
    timestamp: "Yesterday, 11:15 AM",
    status: "Approved",
  },
  {
    id: "act_5",
    title: "Staff Overtime Bonus",
    description: "Weekend bridal package overtime claims",
    salon: "Luxe Beauty Milano",
    category: "Salary",
    amount: "€580.00",
    timestamp: "12 Aug 2026",
    status: "Rejected",
    staffName: "Chiara Ferrari",
  },
];

// Salaries Data
export interface EmployeeSalary {
  id: string;
  name: string;
  role: string;
  salon: string;
  avatar: string;
  month: string;
  baseSalary: number;
  commission: number;
  bonus: number;
  deductions: number;
  netPay: number;
  status: "Approved" | "Pending" | "Paid" | "Rejected";
  iban: string;
  payslipUrl?: string;
}

export const SALARIES_DATA: EmployeeSalary[] = [
  {
    id: "sal_1",
    name: "Marco Rossi",
    role: "Senior Hair Stylist",
    salon: "Elite Salon Roma",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop",
    month: "August 2026",
    baseSalary: 2200,
    commission: 650,
    bonus: 150,
    deductions: 420,
    netPay: 2580,
    status: "Pending",
    iban: "IT60 X054 2811 1010 0000 0123 456",
  },
  {
    id: "sal_2",
    name: "Giulia Bianchi",
    role: "Color Specialist",
    salon: "Elite Salon Roma",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&auto=format&fit=crop",
    month: "August 2026",
    baseSalary: 2100,
    commission: 520,
    bonus: 100,
    deductions: 390,
    netPay: 2330,
    status: "Approved",
    iban: "IT60 X054 2811 1010 0000 0789 123",
  },
  {
    id: "sal_3",
    name: "Alessandro Conti",
    role: "Salon Manager",
    salon: "Luxe Beauty Milano",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256&auto=format&fit=crop",
    month: "August 2026",
    baseSalary: 3200,
    commission: 800,
    bonus: 300,
    deductions: 680,
    netPay: 3620,
    status: "Paid",
    iban: "IT60 X054 2811 1010 0000 0456 789",
  },
  {
    id: "sal_4",
    name: "Chiara Ferrari",
    role: "Nail Artist & Esthetician",
    salon: "Luxe Beauty Milano",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop",
    month: "August 2026",
    baseSalary: 1850,
    commission: 380,
    bonus: 0,
    deductions: 320,
    netPay: 1910,
    status: "Pending",
    iban: "IT60 X054 2811 1010 0000 0987 654",
  },
  {
    id: "sal_5",
    name: "Federico Romano",
    role: "Barber Specialist",
    salon: "Glamour Studio Napoli",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=256&auto=format&fit=crop",
    month: "August 2026",
    baseSalary: 1950,
    commission: 410,
    bonus: 80,
    deductions: 350,
    netPay: 2090,
    status: "Paid",
    iban: "IT60 X054 2811 1010 0000 0654 321",
  },
  {
    id: "sal_6",
    name: "Elena De Luca",
    role: "Front Desk Receptionist",
    salon: "Elite Salon Roma",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&auto=format&fit=crop",
    month: "August 2026",
    baseSalary: 1650,
    commission: 120,
    bonus: 50,
    deductions: 280,
    netPay: 1540,
    status: "Approved",
    iban: "IT60 X054 2811 1010 0000 0321 987",
  },
];

// Taxes Data
export interface TaxItem {
  id: string;
  name: string;
  type: "VAT" | "Corporate Tax (IRES)" | "Regional Tax (IRAP)" | "INPS Pension" | "Withholding Tax";
  period: string;
  salon: string;
  amount: string;
  dueDate: string;
  daysRemaining: number;
  status: "Paid" | "Pending" | "Overdue";
  formName: string;
  receiptNumber?: string;
}

export const TAXES_DATA: TaxItem[] = [
  {
    id: "tax_1",
    name: "Quarterly VAT Return (F24)",
    type: "VAT",
    period: "Q2 2026",
    salon: "Elite Salon Roma",
    amount: "€8,450.00",
    dueDate: "25 Aug 2026",
    daysRemaining: 11,
    status: "Pending",
    formName: "Modello F24 Tributi",
  },
  {
    id: "tax_2",
    name: "INPS Staff Social Contributions",
    type: "INPS Pension",
    period: "July 2026",
    salon: "Luxe Beauty Milano",
    amount: "€5,120.00",
    dueDate: "16 Aug 2026",
    daysRemaining: 2,
    status: "Pending",
    formName: "Uniemens 07/2026",
  },
  {
    id: "tax_3",
    name: "IRAP Regional Business Tax",
    type: "Regional Tax (IRAP)",
    period: "Q1 2026",
    salon: "Elite Salon Roma",
    amount: "€3,280.00",
    dueDate: "30 Jun 2026",
    daysRemaining: 0,
    status: "Paid",
    formName: "Ricevuta F24 #99214",
    receiptNumber: "F24-ROMA-2026-99214",
  },
  {
    id: "tax_4",
    name: "Corporate Income Tax (IRES Advance)",
    type: "Corporate Tax (IRES)",
    period: "FY 2026 - 1st Acconto",
    salon: "Luxe Beauty Milano",
    amount: "€14,200.00",
    dueDate: "30 Jun 2026",
    daysRemaining: 0,
    status: "Paid",
    formName: "Quietanza F24",
    receiptNumber: "IRES-MIL-2026-11802",
  },
  {
    id: "tax_5",
    name: "Municipal Waste Tax (TARI)",
    type: "Withholding Tax",
    period: "Annual 2026",
    salon: "Glamour Studio Napoli",
    amount: "€1,650.00",
    dueDate: "30 Sep 2026",
    daysRemaining: 47,
    status: "Pending",
    formName: "Avviso Pagamento TARI",
  },
];

// Documents Data
export interface DocumentItem {
  id: string;
  title: string;
  category: "Contracts" | "Employee Notices" | "Owner Documents" | "Tax Forms" | "Invoices";
  salon: string;
  uploadedBy: string;
  date: string;
  size: string;
  status: "Verified" | "Pending Review" | "Expired";
  downloadUrl: string;
}

export const DOCUMENTS_DATA: DocumentItem[] = [
  {
    id: "doc_1",
    title: "Employment Contract - Marco Rossi.pdf",
    category: "Contracts",
    salon: "Elite Salon Roma",
    uploadedBy: "HR Department",
    date: "14 Jan 2026",
    size: "2.4 MB",
    status: "Verified",
    downloadUrl: "https://example.com/contracts/1",
  },
  {
    id: "doc_2",
    title: "Workplace Health & Safety Certification.pdf",
    category: "Owner Documents",
    salon: "Luxe Beauty Milano",
    uploadedBy: "Elena Moretti (Owner)",
    date: "02 Mar 2026",
    size: "5.1 MB",
    status: "Verified",
    downloadUrl: "https://example.com/legal/2",
  },
  {
    id: "doc_3",
    title: "Summer Vacation Schedule & Staff Notices.pdf",
    category: "Employee Notices",
    salon: "Elite Salon Roma",
    uploadedBy: "Salon Manager",
    date: "28 Jul 2026",
    size: "1.1 MB",
    status: "Verified",
    downloadUrl: "https://example.com/notices/3",
  },
  {
    id: "doc_4",
    title: "Commercial Lease Renewal 2026-2032.pdf",
    category: "Contracts",
    salon: "Glamour Studio Napoli",
    uploadedBy: "Legal Advisor",
    date: "15 Jun 2026",
    size: "8.6 MB",
    status: "Pending Review",
    downloadUrl: "https://example.com/lease/4",
  },
  {
    id: "doc_5",
    title: "FY2025 Annual Financial Balance Sheet.pdf",
    category: "Owner Documents",
    salon: "Elite Salon Roma",
    uploadedBy: "Darlene Robertson (CPA)",
    date: "10 Apr 2026",
    size: "4.2 MB",
    status: "Verified",
    downloadUrl: "https://example.com/financials/5",
  },
  {
    id: "doc_6",
    title: "Q2 2026 Tax Return Electronic Filing Stamp.pdf",
    category: "Tax Forms",
    salon: "Luxe Beauty Milano",
    uploadedBy: "Revenue Agency PEC",
    date: "01 Aug 2026",
    size: "890 KB",
    status: "Verified",
    downloadUrl: "https://example.com/taxes/6",
  },
];

// Finances & Budgeting Data
export interface TransactionItem {
  id: string;
  title: string;
  category: string;
  salon: string;
  type: "income" | "expense";
  amount: number;
  date: string;
  paymentMethod: "Bank Transfer" | "Credit Card" | "Cash / POS" | "Direct Debit";
  status: "Completed" | "Pending" | "Reconciled";
  receiptAvailable: boolean;
}

export const FINANCES_TRANSACTIONS: TransactionItem[] = [
  {
    id: "tx_1",
    title: "Hair Styling & Treatment Client Revenue",
    category: "Service Sales",
    salon: "Elite Salon Roma",
    type: "income",
    amount: 3450.0,
    date: "Today, 04:30 PM",
    paymentMethod: "Cash / POS",
    status: "Completed",
    receiptAvailable: true,
  },
  {
    id: "tx_2",
    title: "Dyson Supersonic Professional Dryers (x3)",
    category: "Equipment",
    salon: "Luxe Beauty Milano",
    type: "expense",
    amount: 1199.0,
    date: "Today, 01:15 PM",
    paymentMethod: "Credit Card",
    status: "Completed",
    receiptAvailable: true,
  },
  {
    id: "tx_3",
    title: "Kerastase & Davines Shampoo Inventory",
    category: "Supplies",
    salon: "Elite Salon Roma",
    type: "expense",
    amount: 840.0,
    date: "Yesterday",
    paymentMethod: "Bank Transfer",
    status: "Reconciled",
    receiptAvailable: true,
  },
  {
    id: "tx_4",
    title: "Bridal Package Premium Booking",
    category: "Service Sales",
    salon: "Luxe Beauty Milano",
    type: "income",
    amount: 1800.0,
    date: "12 Aug 2026",
    paymentMethod: "Bank Transfer",
    status: "Completed",
    receiptAvailable: true,
  },
  {
    id: "tx_5",
    title: "Commercial Studio Monthly Rent",
    category: "Rent & Facilities",
    salon: "Elite Salon Roma",
    type: "expense",
    amount: 2800.0,
    date: "01 Aug 2026",
    paymentMethod: "Direct Debit",
    status: "Reconciled",
    receiptAvailable: true,
  },
  {
    id: "tx_6",
    title: "Instagram & TikTok Local Ads Campaign",
    category: "Marketing",
    salon: "Luxe Beauty Milano",
    type: "expense",
    amount: 450.0,
    date: "05 Aug 2026",
    paymentMethod: "Credit Card",
    status: "Completed",
    receiptAvailable: true,
  },
];

// Notifications Data
export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: "Approvals" | "Compliance & Tax" | "System";
  timestamp: string;
  isRead: boolean;
  actionRoute?: string;
  actionText?: string;
  priority: "high" | "medium" | "low";
}

export const NOTIFICATIONS_DATA: NotificationItem[] = [
  {
    id: "notif_1",
    title: "Salary Approval Required",
    message: "6 staff payslips are pending your accountant approval for August payroll.",
    category: "Approvals",
    timestamp: "10 mins ago",
    isRead: false,
    actionRoute: "/(drawer)/(tabs)/salaries",
    actionText: "Review Salaries",
    priority: "high",
  },
  {
    id: "notif_2",
    title: "Tax Deadline Approaching",
    message: "Q2 VAT Return F24 due on 25 Aug 2026 (11 days left). Estimated due: €8,450.",
    category: "Compliance & Tax",
    timestamp: "2 hours ago",
    isRead: false,
    actionRoute: "/(drawer)/(tabs)/taxes",
    actionText: "View Tax Filing",
    priority: "high",
  },
  {
    id: "notif_3",
    title: "New Inventory Receipt Uploaded",
    message: "Luxe Beauty Milano uploaded a receipt for €820.00 from L'Oréal Pro.",
    category: "Approvals",
    timestamp: "Yesterday",
    isRead: true,
    actionRoute: "/(drawer)/(tabs)/finances",
    actionText: "Check Receipt",
    priority: "medium",
  },
  {
    id: "notif_4",
    title: "Security: New Device Login",
    message: "Your accountant account was accessed from a new device in Rome, Italy.",
    category: "System",
    timestamp: "2 days ago",
    isRead: true,
    priority: "low",
  },
  {
    id: "notif_5",
    title: "Contract Renewal Signed",
    message: "Employment contract for Marco Rossi has been signed and archived.",
    category: "Approvals",
    timestamp: "3 days ago",
    isRead: true,
    actionRoute: "/(drawer)/(tabs)/documents",
    actionText: "Open Document",
    priority: "low",
  },
];
