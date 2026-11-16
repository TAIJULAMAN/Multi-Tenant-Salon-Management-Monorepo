export interface DashboardKPICardData {
  title: string;
  value: string;
  subtext: string;
  change: string | null;
  icon: string;
  bgColor: string;
  iconBg: string;
  iconColor: string;
}

export const KPI_DATA_BY_SALON: Record<string, DashboardKPICardData[]> = {
  "All Salons": [
    {
      title: "Salaries Pending Approval",
      value: "12",
      subtext: "3 overdue",
      change: "+18.5% from last month",
      icon: "cash",
      bgColor: "#FFFBEB",
      iconBg: "#FAB005",
      iconColor: "#FFFFFF",
    },
    {
      title: "Taxes Pending Approval",
      value: "5",
      subtext: "1 overdue",
      change: "-10% from last month",
      icon: "document-text",
      bgColor: "#E6FCF5",
      iconBg: "#0CA678",
      iconColor: "#FFFFFF",
    },
    {
      title: "Upcoming Deadlines",
      value: "8",
      subtext: "Next 14 days",
      change: null,
      icon: "time",
      bgColor: "#F3F0FF",
      iconBg: "#5C7CFA",
      iconColor: "#FFFFFF",
    },
    {
      title: "Budget Warnings",
      value: "3",
      subtext: "Salons over budget",
      change: "+50% from last month",
      icon: "alert-circle",
      bgColor: "#FFF0F6",
      iconBg: "#F06595",
      iconColor: "#FFFFFF",
    },
  ],
  "Glamour Beauty": [
    {
      title: "Salaries Pending Approval",
      value: "5",
      subtext: "2 overdue",
      change: "+8.5% from last month",
      icon: "cash",
      bgColor: "#FFFBEB",
      iconBg: "#FAB005",
      iconColor: "#FFFFFF",
    },
    {
      title: "Taxes Pending Approval",
      value: "2",
      subtext: "1 overdue",
      change: "-5% from last month",
      icon: "document-text",
      bgColor: "#E6FCF5",
      iconBg: "#0CA678",
      iconColor: "#FFFFFF",
    },
    {
      title: "Upcoming Deadlines",
      value: "3",
      subtext: "Next 14 days",
      change: null,
      icon: "time",
      bgColor: "#F3F0FF",
      iconBg: "#5C7CFA",
      iconColor: "#FFFFFF",
    },
    {
      title: "Budget Warnings",
      value: "1",
      subtext: "Salon over budget",
      change: "+15% from last month",
      icon: "alert-circle",
      bgColor: "#FFF0F6",
      iconBg: "#F06595",
      iconColor: "#FFFFFF",
    },
  ],
  "Glamour Beauty Roma": [
    {
      title: "Salaries Pending Approval",
      value: "5",
      subtext: "2 overdue",
      change: "+8.5% from last month",
      icon: "cash",
      bgColor: "#FFFBEB",
      iconBg: "#FAB005",
      iconColor: "#FFFFFF",
    },
    {
      title: "Taxes Pending Approval",
      value: "2",
      subtext: "1 overdue",
      change: "-5% from last month",
      icon: "document-text",
      bgColor: "#E6FCF5",
      iconBg: "#0CA678",
      iconColor: "#FFFFFF",
    },
    {
      title: "Upcoming Deadlines",
      value: "3",
      subtext: "Next 14 days",
      change: null,
      icon: "time",
      bgColor: "#F3F0FF",
      iconBg: "#5C7CFA",
      iconColor: "#FFFFFF",
    },
    {
      title: "Budget Warnings",
      value: "1",
      subtext: "Salon over budget",
      change: "+15% from last month",
      icon: "alert-circle",
      bgColor: "#FFF0F6",
      iconBg: "#F06595",
      iconColor: "#FFFFFF",
    },
  ],
  "Style Studio": [
    {
      title: "Salaries Pending Approval",
      value: "4",
      subtext: "1 overdue",
      change: "+12.0% from last month",
      icon: "cash",
      bgColor: "#FFFBEB",
      iconBg: "#FAB005",
      iconColor: "#FFFFFF",
    },
    {
      title: "Taxes Pending Approval",
      value: "2",
      subtext: "0 overdue",
      change: "-15% from last month",
      icon: "document-text",
      bgColor: "#E6FCF5",
      iconBg: "#0CA678",
      iconColor: "#FFFFFF",
    },
    {
      title: "Upcoming Deadlines",
      value: "3",
      subtext: "Next 14 days",
      change: null,
      icon: "time",
      bgColor: "#F3F0FF",
      iconBg: "#5C7CFA",
      iconColor: "#FFFFFF",
    },
    {
      title: "Budget Warnings",
      value: "1",
      subtext: "Salon on track",
      change: "-5% from last month",
      icon: "alert-circle",
      bgColor: "#FFF0F6",
      iconBg: "#F06595",
      iconColor: "#FFFFFF",
    },
  ],
  "Style Studio Milano": [
    {
      title: "Salaries Pending Approval",
      value: "4",
      subtext: "1 overdue",
      change: "+12.0% from last month",
      icon: "cash",
      bgColor: "#FFFBEB",
      iconBg: "#FAB005",
      iconColor: "#FFFFFF",
    },
    {
      title: "Taxes Pending Approval",
      value: "2",
      subtext: "0 overdue",
      change: "-15% from last month",
      icon: "document-text",
      bgColor: "#E6FCF5",
      iconBg: "#0CA678",
      iconColor: "#FFFFFF",
    },
    {
      title: "Upcoming Deadlines",
      value: "3",
      subtext: "Next 14 days",
      change: null,
      icon: "time",
      bgColor: "#F3F0FF",
      iconBg: "#5C7CFA",
      iconColor: "#FFFFFF",
    },
    {
      title: "Budget Warnings",
      value: "1",
      subtext: "Salon on track",
      change: "-5% from last month",
      icon: "alert-circle",
      bgColor: "#FFF0F6",
      iconBg: "#F06595",
      iconColor: "#FFFFFF",
    },
  ],
  "Chic Hair & Beauty": [
    {
      title: "Salaries Pending Approval",
      value: "3",
      subtext: "0 overdue",
      change: "+2.5% from last month",
      icon: "cash",
      bgColor: "#FFFBEB",
      iconBg: "#FAB005",
      iconColor: "#FFFFFF",
    },
    {
      title: "Taxes Pending Approval",
      value: "1",
      subtext: "0 overdue",
      change: "-2% from last month",
      icon: "document-text",
      bgColor: "#E6FCF5",
      iconBg: "#0CA678",
      iconColor: "#FFFFFF",
    },
    {
      title: "Upcoming Deadlines",
      value: "2",
      subtext: "Next 14 days",
      change: null,
      icon: "time",
      bgColor: "#F3F0FF",
      iconBg: "#5C7CFA",
      iconColor: "#FFFFFF",
    },
    {
      title: "Budget Warnings",
      value: "1",
      subtext: "Salon on track",
      change: "0% from last month",
      icon: "alert-circle",
      bgColor: "#FFF0F6",
      iconBg: "#F06595",
      iconColor: "#FFFFFF",
    },
  ],
};

export interface DashboardActivity {
  id: string;
  title: string;
  salon: string;
  reason: string;
  priority: "High" | "Medium" | "Low";
  date: string;
  avatarEmoji: string;
}

export const DASHBOARD_ACTIVITIES: DashboardActivity[] = [
  {
    id: "act1",
    title: "Salary declined for Jane Doe",
    salon: "Glamour Beauty",
    reason: "Reason: Incorrect gross amount calculation",
    priority: "High",
    date: "Oct 28, 10:01 AM",
    avatarEmoji: "👩",
  },
  {
    id: "act2",
    title: "Tax document approved",
    salon: "Style Studio",
    reason: "VAT Q3 2025 has been approved by owner",
    priority: "Low",
    date: "Oct 28, 10:01 AM",
    avatarEmoji: "🏢",
  },
  {
    id: "act3",
    title: "Budget exceeded",
    salon: "Glamour Beauty",
    reason: "Monthly budget exceeded by 15%",
    priority: "Medium",
    date: "Oct 28, 10:01 AM",
    avatarEmoji: "⚠️",
  },
];

export interface DashboardSalonOverviewItem {
  id: string;
  name: string;
  pendingSalaries: number;
  pendingTaxes: number;
  status: "Over Budget" | "On Track";
  iconBg: string;
  iconColor: string;
}

export const DASHBOARD_SALONS: DashboardSalonOverviewItem[] = [
  {
    id: "1",
    name: "Glamour Beauty",
    pendingSalaries: 5,
    pendingTaxes: 2,
    status: "Over Budget",
    iconBg: "#FFE8EC",
    iconColor: "#FF4B72",
  },
  {
    id: "2",
    name: "Style Studio",
    pendingSalaries: 5,
    pendingTaxes: 2,
    status: "On Track",
    iconBg: "#E2F9F0",
    iconColor: "#20C997",
  },
  {
    id: "3",
    name: "Chic Hair & Beauty",
    pendingSalaries: 5,
    pendingTaxes: 2,
    status: "On Track",
    iconBg: "#E2F9F0",
    iconColor: "#20C997",
  },
  {
    id: "4",
    name: "Glamour Beauty",
    pendingSalaries: 5,
    pendingTaxes: 2,
    status: "Over Budget",
    iconBg: "#FFE8EC",
    iconColor: "#FF4B72",
  },
];

export const PAYROLL_MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export const PAYROLL_BASE_BY_SALON: Record<string, number[]> = {
  "Glamour Beauty": [
    8000, 10000, 11000, 9500, 6000, 14000, 18000, 20000, 17000, 19000, 22000,
    18000,
  ],
  "Glamour Beauty Roma": [
    8000, 10000, 11000, 9500, 6000, 14000, 18000, 20000, 17000, 19000, 22000,
    18000,
  ],
  "Style Studio": [
    12000, 14000, 15000, 13000, 9000, 16000, 19000, 21000, 18000, 20000, 23000,
    19000,
  ],
  "Style Studio Milano": [
    12000, 14000, 15000, 13000, 9000, 16000, 19000, 21000, 18000, 20000, 23000,
    19000,
  ],
  "Chic Hair & Beauty": [
    7000, 9000, 8500, 9500, 7500, 11000, 13000, 15000, 14000, 16000, 17000,
    15000,
  ],
  "All Salons": [
    15000, 18000, 20000, 17500, 12000, 23000, 29000, 31000, 27000, 32000,
    35000, 30000,
  ],
};

export interface ExpenseBudgetItem {
  category: string;
  budget: number;
  expense: number;
}

export const EXPENSE_CATEGORIES = [
  "Salaries",
  "Taxes",
  "Supplies",
  "Marketing",
  "Utilities",
];

export const EXPENSE_BUDGET_BY_SALON: Record<string, ExpenseBudgetItem[]> = {
  "Glamour Beauty": [
    { category: "Salaries", budget: 15000, expense: 19000 },
    { category: "Taxes", budget: 10000, expense: 12000 },
    { category: "Supplies", budget: 5000, expense: 7000 },
    { category: "Marketing", budget: 4000, expense: 3000 },
    { category: "Utilities", budget: 3000, expense: 4500 },
  ],
  "Glamour Beauty Roma": [
    { category: "Salaries", budget: 15000, expense: 19000 },
    { category: "Taxes", budget: 10000, expense: 12000 },
    { category: "Supplies", budget: 5000, expense: 7000 },
    { category: "Marketing", budget: 4000, expense: 3000 },
    { category: "Utilities", budget: 3000, expense: 4500 },
  ],
  "Style Studio": [
    { category: "Salaries", budget: 18000, expense: 16000 },
    { category: "Taxes", budget: 12000, expense: 11000 },
    { category: "Supplies", budget: 8000, expense: 7500 },
    { category: "Marketing", budget: 6000, expense: 4000 },
    { category: "Utilities", budget: 4000, expense: 3500 },
  ],
  "Style Studio Milano": [
    { category: "Salaries", budget: 18000, expense: 16000 },
    { category: "Taxes", budget: 12000, expense: 11000 },
    { category: "Supplies", budget: 8000, expense: 7500 },
    { category: "Marketing", budget: 6000, expense: 4000 },
    { category: "Utilities", budget: 4000, expense: 3500 },
  ],
  "Chic Hair & Beauty": [
    { category: "Salaries", budget: 12000, expense: 11000 },
    { category: "Taxes", budget: 8000, expense: 7000 },
    { category: "Supplies", budget: 6000, expense: 5000 },
    { category: "Marketing", budget: 3000, expense: 2000 },
    { category: "Utilities", budget: 2000, expense: 1800 },
  ],
  "All Salons": [
    { category: "Salaries", budget: 35000, expense: 8000 },
    { category: "Taxes", budget: 26000, expense: 15000 },
    { category: "Supplies", budget: 48000, expense: 24000 },
    { category: "Marketing", budget: 28000, expense: 3000 },
    { category: "Utilities", budget: 8000, expense: 25000 },
  ],
};
