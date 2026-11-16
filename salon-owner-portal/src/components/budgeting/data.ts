import { MacroCategoryFormData } from "./categories/modals/AddMacroCategoryModal";
import { CategoryFormData } from "./categories/modals/AddCategoryModal";

// Categories Mock Data
export const MOCK_MACRO_CATEGORIES: MacroCategoryFormData[] = [
  { id: "1", name: "Internet", color: "#22C55E", icon: "Globe", nature: "Fixed", budget: "100", isHidden: false },
  { id: "2", name: "Products", color: "#635BFF", icon: "Package", nature: "Variable", budget: "500", isHidden: false },
  { id: "3", name: "Taxes", color: "#EF4444", icon: "FileText", nature: "Fixed", budget: "300", isHidden: false },
  { id: "4", name: "Services", color: "#EAB308", icon: "Briefcase", nature: "Variable", budget: "200", isHidden: false },
  { id: "5", name: "Utilities", color: "#1E293B", icon: "Zap", nature: "Fixed", budget: "150", isHidden: false },
  { id: "6", name: "HR", color: "#06B6D4", icon: "Users", nature: "Fixed", budget: "1000", isHidden: false },
  { id: "7", name: "Consumables", color: "#06B6D4", icon: "Box", nature: "Variable", budget: "200", isHidden: false },
];

export const MOCK_CATEGORIES: CategoryFormData[] = [
  { id: "c1", name: "Category 1", color: "#22C55E", icon: "Globe", nature: "Fixed", macroCategoryId: "1" },
  { id: "c2", name: "Category 2", color: "#22C55E", icon: "Globe", nature: "Fixed", macroCategoryId: "1" },
  { id: "c3", name: "Category 3", color: "#22C55E", icon: "Globe", nature: "Fixed", macroCategoryId: "1" },
  { id: "c4", name: "Category 4", color: "#22C55E", icon: "Globe", nature: "Fixed", macroCategoryId: "1" },
  { id: "c5", name: "Category 5", color: "#22C55E", icon: "Globe", nature: "Fixed", macroCategoryId: "1" },
];

// Expenses Mock Data
export const MOCK_EXPENSES = [
  {
    id: "1",
    date: "02/01/2025 17:00",
    macroCategory: { text: "Internet", colorType: "green" },
    category: { text: "Category 1", colorType: "green" },
    cost: "€ 5,535.52",
    supplier: "Supplier Name",
    paymentMethod: { text: "Cash", colorType: "green" },
    note: "Lorem ipsum",
  },
  {
    id: "2",
    date: "02/01/2025 17:00",
    macroCategory: { text: "Products", colorType: "blue" },
    category: { text: "Category 1", colorType: "blue" },
    cost: "€ 5,535.52",
    supplier: "Supplier Name",
    paymentMethod: { text: "Credit Card", colorType: "cyan" },
    note: "Lorem ipsum",
  },
  {
    id: "3",
    date: "02/01/2025 17:00",
    macroCategory: { text: "Taxes", colorType: "red" },
    category: { text: "Category 1", colorType: "red" },
    cost: "€ 5,535.52",
    supplier: "Supplier Name",
    paymentMethod: { text: "Credit Card", colorType: "cyan" },
    note: "Lorem ipsum",
  },
  {
    id: "4",
    date: "02/01/2025 17:00",
    macroCategory: { text: "Services", colorType: "yellow" },
    category: { text: "Category 1", colorType: "yellow" },
    cost: "€ 5,535.52",
    supplier: "Supplier Name",
    paymentMethod: { text: "Online Payment", colorType: "yellow" },
    note: "Lorem ipsum",
  },
  {
    id: "5",
    date: "02/01/2025 17:00",
    macroCategory: { text: "Utilities", colorType: "dark" },
    category: { text: "Category 1", colorType: "default" },
    cost: "€ 5,535.52",
    supplier: "Supplier Name",
    paymentMethod: { text: "Online Payment", colorType: "yellow" },
    note: "Lorem ipsum",
  },
  {
    id: "6",
    date: "02/01/2025 17:00",
    macroCategory: { text: "HR", colorType: "cyan" },
    category: { text: "Category 1", colorType: "cyan" },
    cost: "€ 5,535.52",
    supplier: "Supplier Name",
    paymentMethod: { text: "Cash", colorType: "green" },
    note: "Lorem ipsum",
  },
  {
    id: "7",
    date: "02/01/2025 17:00",
    macroCategory: { text: "Consumables", colorType: "cyan" },
    category: { text: "Category 1", colorType: "cyan" },
    cost: "€ 5,535.52",
    supplier: "Supplier Name",
    paymentMethod: { text: "Cash", colorType: "green" },
    note: "Lorem ipsum",
  },
  {
    id: "8",
    date: "02/01/2025 17:00",
    macroCategory: { text: "Products", colorType: "purple" },
    category: { text: "Category 1", colorType: "purple" },
    cost: "€ 5,535.52",
    supplier: "Supplier Name",
    paymentMethod: { text: "Credit Card", colorType: "cyan" },
    note: "Lorem ipsum",
  },
  {
    id: "9",
    date: "02/01/2025 17:00",
    macroCategory: { text: "Internet", colorType: "green" },
    category: { text: "Category 1", colorType: "green" },
    cost: "€ 5,535.52",
    supplier: "Supplier Name",
    paymentMethod: { text: "Credit Card", colorType: "cyan" },
    note: "Lorem ipsum",
  },
];

// Doughnut Chart Mock Data
export const MOCK_DOUGHNUT_CHART_DATA = {
  labels: [
    "Products",
    "Consumables",
    "Services",
    "HR",
    "Taxes",
    "Internet",
    "Utilities",
  ],
  datasets: [
    {
      data: [25, 20, 15, 10, 10, 10, 10], // Mock percentage distribution
      backgroundColor: [
        "#635BFF", // Products
        "#2CC8D6", // Consumables
        "#F5B800", // Services
        "#00C48C", // HR
        "#D946EF", // Taxes
        "#22C55E", // Internet
        "#1E293B", // Utilities
      ],
      borderWidth: 0,
      hoverOffset: 4,
    },
  ],
};

// Payment Methods Mock Data
export const MOCK_PAYMENT_METHODS = [
  { id: "pm1", name: "Visa Credit Card", accountType: "Credit Card", initialValue: "€ 5,535.52" },
  { id: "pm2", name: "Cash", accountType: "Cash", initialValue: "€ 5,535.52" },
  { id: "pm3", name: "Direct debit", accountType: "Direct debit", initialValue: "€ 5,535.52" },
  { id: "pm4", name: "Bank transfer", accountType: "Bank transfer", initialValue: "€ 5,535.52" },
];

export const MOCK_PAYMENT_METHOD_BALANCE_DATA = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  datasets: [
    {
      label: "Balance",
      data: [3200, 3100, 2400, 2300, 1600, 1400, 1500, 1550, 1400, 1350, 1350, 1300],
      borderColor: "#635BFF",
      backgroundColor: (context: any) => {
        const ctx = context.chart.ctx;
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, "rgba(99, 91, 255, 0.2)");
        gradient.addColorStop(1, "rgba(99, 91, 255, 0)");
        return gradient;
      },
      fill: true,
      tension: 0.4,
      borderWidth: 2,
      pointRadius: 0,
      pointHoverRadius: 4,
    }
  ]
};

// REPORTS MOCK DATA

export const MOCK_REPORTS_SPENDING_TRENDS = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  data: [3200, 3100, 2400, 2300, 1600, 1400, 1500, 1550, 1400, 1350, 1350, 1300]
};

export const MOCK_REPORTS_MACRO_CATEGORIES = {
  labels: ["Products", "Consumables", "Services", "HR", "Taxes", "Internet", "Utilities"],
  data: [20, 15, 15, 10, 10, 15, 15],
  colors: ["#635BFF", "#2CC8D6", "#FBBF24", "#2DD4BF", "#FB7185", "#22C55E", "#1E293B"]
};

export const MOCK_REPORTS_CATEGORIES = {
  labels: ["Category 1", "Category 2", "Category 3", "Category 4", "Category 5", "Category 6"],
  data: [1200, 850, 1500, 950, 200, 200]
};

export const MOCK_REPORTS_SUPPLIERS = [
  { name: "Supplier 1", value: 1600, max: 4000 },
  { name: "Supplier 2", value: 1800, max: 4000 },
  { name: "Supplier 3", value: 1950, max: 4000 },
  { name: "Supplier 4", value: 1950, max: 4000 },
  { name: "Supplier 5", value: 1950, max: 4000 },
  { name: "Supplier 6", value: 2000, max: 4000 },
  { name: "Supplier 7", value: 2400, max: 4000 },
];


// Recurring Payments Mock Data
import { RecurringPayment } from "./types";

export const INITIAL_RECURRING_PAYMENTS: RecurringPayment[] = [
  {
    id: "REC-001",
    payee: "Wella Professional",
    category: "Products",
    macroCategory: "Supplies",
    amount: "€ 670",
    amountNum: 670,
    frequency: "Monthly",
    day: "6th of the month",
    nextDate: "06/02/2025",
    expiration: "Expires 31/12/2025",
    status: "Active",
    note: "Automated monthly hair dye and care supply restock."
  },
  {
    id: "REC-002",
    payee: "Salon Premises Rent",
    category: "Rent & Facilities",
    macroCategory: "Operational",
    amount: "€ 1,200",
    amountNum: 1200,
    frequency: "Monthly",
    day: "1st of the month",
    nextDate: "01/03/2025",
    expiration: "Never (Ongoing)",
    status: "Active",
    note: "Commercial lease automated bank debit."
  },
  {
    id: "REC-003",
    payee: "Enel Energia",
    category: "Utilities",
    macroCategory: "Operational",
    amount: "€ 240",
    amountNum: 240,
    frequency: "Monthly",
    day: "22nd of the month",
    nextDate: "22/02/2025",
    expiration: "Never (Ongoing)",
    status: "Active",
    note: "Electricity and water utility billing."
  },
  {
    id: "REC-004",
    payee: "TIM Fiber Business",
    category: "Internet & Telecom",
    macroCategory: "IT",
    amount: "€ 120",
    amountNum: 120,
    frequency: "Monthly",
    day: "15th of the month",
    nextDate: "15/02/2025",
    expiration: "Never (Ongoing)",
    status: "Active",
    note: "High-speed salon Wi-Fi and POS connection."
  },
  {
    id: "REC-005",
    payee: "EcoClean Service",
    category: "Cleaning & Maintenance",
    macroCategory: "Operational",
    amount: "€ 235",
    amountNum: 235,
    frequency: "Bi-weekly",
    day: "Every other Monday",
    nextDate: "17/02/2025",
    expiration: "Expires 30/06/2025",
    status: "Active",
    note: "Bi-weekly deep cleaning and sanitization."
  },
  {
    id: "REC-006",
    payee: "Harem Software Pro",
    category: "Software Subscription",
    macroCategory: "IT",
    amount: "€ 89",
    amountNum: 89,
    frequency: "Monthly",
    day: "10th of the month",
    nextDate: "10/02/2025",
    expiration: "Never (Ongoing)",
    status: "Paused",
    note: "Paused during testing period."
  }
];
