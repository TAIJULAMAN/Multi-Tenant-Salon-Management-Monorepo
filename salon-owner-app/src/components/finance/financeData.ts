export interface PaymentRecord {
  id: string;
  date: string;
  client: {
    name: string;
    email: string;
    avatar?: string;
    phone?: string;
  };
  teamMember: {
    name: string;
    email: string;
    avatar?: string;
    role?: string;
  };
  amount: string;
  method: "Cash" | "Card Terminal" | "Gift Card" | "Online Payment";
  status: "Fully Paid" | "Half Paid" | "Not Paid";
  receiptStatus: "Completed" | "Half Printed" | "Not Issued";
  subtotal?: string;
  tax?: string;
  items?: {
    name: string;
    category: string;
    price: string;
    quantity: number;
  }[];
  notes?: string;
}

export interface ReceiptRecord {
  id: string;
  receiptNumber: string;
  paymentId: string;
  client: {
    name: string;
    email: string;
    avatar?: string;
  };
  date: string;
  amount: string;
  method: "Cash" | "Card Terminal" | "Gift Card" | "Online Payment";
  status: "Completed" | "Half Printed" | "Not Issued";
  taxId: string;
  itemsCount: number;
}

export interface WebGiftCardRecord {
  id: string;
  issueDate: string;
  expirationDate: string;
  amount: number;
  currency?: string;
  eligibleServices: string;
  usageLimit: number;
  status: "Used" | "No-Used";
  subStatus?: "Active" | "Expired";
  templateId?: number;
  salonName?: string;
  website?: string;
  address?: string;
  receiverName?: string;
  gifterName?: string;
  personalMessage?: string;
  hideAmount?: boolean;
}

export interface FinancialStatCard {
  id: string;
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  iconName: any;
  iconBg: string;
  iconColor: string;
}

export const financialStatCardsData: FinancialStatCard[] = [
  {
    id: "1",
    title: "Total Revenue",
    value: "€ 48,250.00",
    change: "+12.5% vs last month",
    isPositive: true,
    iconName: "trending-up-outline",
    iconBg: "#DCFCE7",
    iconColor: "#16A34A",
  },
  {
    id: "2",
    title: "Avg. Daily Sales",
    value: "€ 1,608.30",
    change: "+4.2% vs last week",
    isPositive: true,
    iconName: "wallet-outline",
    iconBg: "#EEF2FF",
    iconColor: "#635BFF",
  },
  {
    id: "3",
    title: "Total Expenses",
    value: "€ 14,800.00",
    change: "-2.1% vs last month",
    isPositive: false,
    iconName: "pie-chart-outline",
    iconBg: "#FEF3C7",
    iconColor: "#D97706",
  },
  {
    id: "4",
    title: "Net Profit",
    value: "€ 33,450.00",
    change: "+18.4% vs last month",
    isPositive: true,
    iconName: "cash-outline",
    iconBg: "#CCFBF1",
    iconColor: "#0D9488",
  },
];

export const initialPayments: PaymentRecord[] = [
  {
    id: "#000",
    date: "5 Aug 2025, 12:30",
    client: {
      name: "Maria Rodriguez",
      email: "maria@beautywellness.com",
      phone: "+39 345 678 9012",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80",
    },
    teamMember: {
      name: "Maria Rodriguez",
      email: "maria@beautywellness.com",
      role: "Senior Hair Stylist",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80",
    },
    amount: "€ 270.00",
    subtotal: "€ 225.00",
    tax: "€ 45.00",
    method: "Cash",
    status: "Fully Paid",
    receiptStatus: "Completed",
    items: [
      { name: "Balayage Highlights", category: "Coloring", price: "€ 180.00", quantity: 1 },
      { name: "Hydrating Keratin Mask", category: "Treatments", price: "€ 45.00", quantity: 1 },
      { name: "Blow Dry & Finish", category: "Styling", price: "€ 45.00", quantity: 1 },
    ],
  },
  {
    id: "#001",
    date: "5 Aug 2025, 12:30",
    client: {
      name: "Maria Rodriguez",
      email: "maria@beautywellness.com",
      phone: "+39 349 112 3344",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80",
    },
    teamMember: {
      name: "Maria Rodriguez",
      email: "maria@beautywellness.com",
      role: "Artistic Director",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80",
    },
    amount: "€ 145.00",
    subtotal: "€ 120.83",
    tax: "€ 24.17",
    method: "Card Terminal",
    status: "Fully Paid",
    receiptStatus: "Not Issued",
  },
  {
    id: "#002",
    date: "5 Aug 2025, 12:30",
    client: {
      name: "Maria Rodriguez",
      email: "maria@beautywellness.com",
      phone: "+39 333 445 9988",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80",
    },
    teamMember: {
      name: "Maria Rodriguez",
      email: "maria@beautywellness.com",
      role: "Color Specialist",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80",
    },
    amount: "€ 200.00",
    subtotal: "€ 166.67",
    tax: "€ 33.33",
    method: "Gift Card",
    status: "Half Paid",
    receiptStatus: "Half Printed",
  },
  {
    id: "#003",
    date: "5 Aug 2025, 12:30",
    client: {
      name: "Maria Rodriguez",
      email: "maria@beautywellness.com",
      phone: "+39 340 778 1234",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80",
    },
    teamMember: {
      name: "Maria Rodriguez",
      email: "maria@beautywellness.com",
      role: "Senior Hair Stylist",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80",
    },
    amount: "€ 85.00",
    subtotal: "€ 70.83",
    tax: "€ 14.17",
    method: "Online Payment",
    status: "Not Paid",
    receiptStatus: "Not Issued",
  },
  {
    id: "#004",
    date: "5 Aug 2025, 12:30",
    client: {
      name: "Maria Rodriguez",
      email: "maria@beautywellness.com",
      phone: "+39 347 889 0011",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80",
    },
    teamMember: {
      name: "Maria Rodriguez",
      email: "maria@beautywellness.com",
      role: "Artistic Director",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80",
    },
    amount: "€ 310.00",
    subtotal: "€ 258.33",
    tax: "€ 51.67",
    method: "Online Payment",
    status: "Not Paid",
    receiptStatus: "Not Issued",
  },
  {
    id: "#005",
    date: "5 Aug 2025, 12:30",
    client: {
      name: "Maria Rodriguez",
      email: "maria@beautywellness.com",
      phone: "+39 331 445 6677",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80",
    },
    teamMember: {
      name: "Maria Rodriguez",
      email: "maria@beautywellness.com",
      role: "Color Specialist",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80",
    },
    amount: "€ 120.00",
    subtotal: "€ 100.00",
    tax: "€ 20.00",
    method: "Cash",
    status: "Half Paid",
    receiptStatus: "Half Printed",
  },
  {
    id: "#006",
    date: "5 Aug 2025, 12:30",
    client: {
      name: "Maria Rodriguez",
      email: "maria@beautywellness.com",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80",
    },
    teamMember: {
      name: "Maria Rodriguez",
      email: "maria@beautywellness.com",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80",
    },
    amount: "€ 170.00",
    method: "Gift Card",
    status: "Fully Paid",
    receiptStatus: "Completed",
  },
];

export const initialReceipts: ReceiptRecord[] = [
  {
    id: "r1",
    receiptNumber: "REC-2025-001",
    paymentId: "000",
    client: {
      name: "Maria Rodriguez",
      email: "maria@beautywellness.com",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80",
    },
    date: "5 Aug 2025, 12:30",
    amount: "€ 270.00",
    method: "Cash",
    status: "Completed",
    taxId: "IT98234123",
    itemsCount: 3,
  },
  {
    id: "r2",
    receiptNumber: "REC-2025-002",
    paymentId: "001",
    client: {
      name: "Leslie Alexander",
      email: "leslie.a@domain.com",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80",
    },
    date: "5 Aug 2025, 11:15",
    amount: "€ 145.00",
    method: "Card Terminal",
    status: "Not Issued",
    taxId: "IT98234123",
    itemsCount: 2,
  },
  {
    id: "r3",
    receiptNumber: "REC-2025-003",
    paymentId: "002",
    client: {
      name: "Eleanor Pena",
      email: "eleanor.p@style.com",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80",
    },
    date: "5 Aug 2025, 10:00",
    amount: "€ 200.00",
    method: "Gift Card",
    status: "Half Printed",
    taxId: "IT98234123",
    itemsCount: 1,
  },
  {
    id: "r4",
    receiptNumber: "REC-2025-004",
    paymentId: "004",
    client: {
      name: "Jenny Wilson",
      email: "jenny.w@outlook.com",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80",
    },
    date: "4 Aug 2025, 15:30",
    amount: "€ 310.00",
    method: "Card Terminal",
    status: "Completed",
    taxId: "IT98234123",
    itemsCount: 2,
  },
];

export const initialGiftCards: WebGiftCardRecord[] = [
  { id: "#0B0", issueDate: "5 Aug 2025", expirationDate: "8 Aug 2025", amount: 170, eligibleServices: "All", usageLimit: 1, status: "Used" },
  { id: "#0B0", issueDate: "5 Aug 2025", expirationDate: "8 Aug 2025", amount: 170, eligibleServices: "All", usageLimit: 1, status: "No-Used", subStatus: "Active" },
  { id: "#0B0", issueDate: "5 Aug 2025", expirationDate: "8 Aug 2025", amount: 170, eligibleServices: "All", usageLimit: 1, status: "No-Used", subStatus: "Expired" },
  { id: "#0B0", issueDate: "5 Aug 2025", expirationDate: "8 Aug 2025", amount: 170, eligibleServices: "All", usageLimit: 1, status: "Used" },
  { id: "#0B0", issueDate: "5 Aug 2025", expirationDate: "8 Aug 2025", amount: 170, eligibleServices: "All", usageLimit: 1, status: "Used" },
  { id: "#0B0", issueDate: "5 Aug 2025", expirationDate: "8 Aug 2025", amount: 170, eligibleServices: "All", usageLimit: 1, status: "No-Used", subStatus: "Active" },
  { id: "#0B0", issueDate: "5 Aug 2025", expirationDate: "8 Aug 2025", amount: 170, eligibleServices: "All", usageLimit: 1, status: "No-Used", subStatus: "Expired" },
];

export const ALL_AUTOMATION_CLIENTS = [
  { id: "1", name: "Maria Fernandez", role: "Regular Client", initials: "MF", color: "#F43F5E" },
  { id: "2", name: "Vega Button", role: "VIP Client", initials: "VB", color: "#8B5CF6" },
  { id: "3", name: "Leo Gregory", role: "New Client", initials: "LG", color: "#F59E0B" },
  { id: "4", name: "Mia Fernandez", role: "Regular Client", initials: "MF", color: "#10B981" },
  { id: "5", name: "Sophie Martin", role: "VIP Client", initials: "SM", color: "#635BFF" },
];

export const getPaymentMethodStyle = (method: PaymentRecord["method"]) => {
  switch (method) {
    case "Cash":
      return { bg: "#DCFCE7", text: "#16A34A", border: "#BBF7D0", icon: "cash-outline" };
    case "Card Terminal":
      return { bg: "#CCFBF1", text: "#0D9488", border: "#99F6E4", icon: "card-outline" };
    case "Gift Card":
      return { bg: "#EEF2FF", text: "#635BFF", border: "#C7D2FE", icon: "gift-outline" };
    case "Online Payment":
      return { bg: "#FEF3C7", text: "#D97706", border: "#FDE68A", icon: "globe-outline" };
    default:
      return { bg: "#F1F5F9", text: "#64748B", border: "#E2E8F0", icon: "wallet-outline" };
  }
};

export const getPaymentStatusStyle = (status: PaymentRecord["status"]) => {
  switch (status) {
    case "Fully Paid":
      return { bg: "#22C55E", text: "#FFFFFF" };
    case "Half Paid":
      return { bg: "#F59E0B", text: "#FFFFFF" };
    case "Not Paid":
      return { bg: "#EF4444", text: "#FFFFFF" };
    default:
      return { bg: "#64748B", text: "#FFFFFF" };
  }
};

export const getReceiptStatusStyle = (status: PaymentRecord["receiptStatus"]) => {
  switch (status) {
    case "Completed":
      return { border: "#22C55E", text: "#16A34A", bg: "#FFFFFF" };
    case "Half Printed":
      return { border: "#F59E0B", text: "#D97706", bg: "#FFFFFF" };
    case "Not Issued":
      return { border: "#EF4444", text: "#EF4444", bg: "#FFFFFF" };
    default:
      return { border: "#E2E8F0", text: "#64748B", bg: "#FFFFFF" };
  }
};
