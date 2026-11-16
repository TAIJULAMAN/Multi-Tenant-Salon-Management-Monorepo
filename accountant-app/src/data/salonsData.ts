export interface SalonInfo {
  id: string;
  name: string;
  badge: "SRL" | "SPA" | "SRLS" | "SNC" | "SAS" | "Ind." | string;
  ownerName: string;
  city: string;
  email: string;
  plan: "Premium" | "Enterprise" | "Basic";
  planPrice: string;
  paymentStatus: "In order" | "Late";
  nextRenewal: string;
  referral: string;
  avatarUrl?: string;
}

export interface SentInvitation {
  id: string;
  salonName: string;
  email: string;
  date: string;
  status: "Pending" | "Accepted" | "Rejected" | "Expired";
  plan: string;
  planDetails: string;
  share: string;
  lastShare: string;
}

export interface ReceivedInvitation {
  id: string;
  salonName: string;
  senderName: string;
  senderEmail?: string;
  message: string;
  sentDate: string;
}

export interface RevenueCardData {
  title: string;
  amount: number;
  description: string;
  type: "success" | "primary" | "danger" | "warning";
}

export interface BreakdownData {
  id: string;
  salonName: string;
  email: string;
  plan: string;
  planDetails: string;
  share: string;
  lastPayment: string;
  lastPaymentDate: string;
  nextRenewal: string;
  nextRenewalDate: string;
  lifetime: string;
}

export interface TransactionData {
  id: string;
  date: string;
  salonName: string;
  email: string;
  grossAmount: string;
  share: string;
  lifetime: string;
  status: "Expected" | "Paid";
  note: string;
}

export interface PayoutData {
  id: string;
  requestDate: string;
  amount: string;
  invoiceNo: string;
  status: "Paid" | "Pending";
  paymentDate: string;
  note: string;
}

export interface BankSettingsData {
  iban: string;
  bankHolder: string;
  vatNumber: string;
  address: string;
}

// Initial Mock Data
export const INITIAL_SALONS_DATA: SalonInfo[] = [
  {
    id: "1",
    name: "Beauty Wellness Center",
    badge: "SRL",
    ownerName: "Roberto Marini",
    city: "Bologna",
    email: "roberto@beautywellness.com",
    plan: "Premium",
    planPrice: "Annual • €2,000.00 / yr",
    paymentStatus: "In order",
    nextRenewal: "Dec 01, 2026",
    referral: "30%",
  },
  {
    id: "2",
    name: "Bella Vista Salon",
    badge: "SRL",
    ownerName: "Maria Rodriguez",
    city: "Milano",
    email: "maria@bellavista.com",
    plan: "Premium",
    planPrice: "Annual • €2,000.00 / yr",
    paymentStatus: "In order",
    nextRenewal: "Dec 01, 2026",
    referral: "30%",
  },
  {
    id: "3",
    name: "Elite Beauty Group S.p.A.",
    badge: "SPA",
    ownerName: "Dr. Marco Rossi",
    city: "Milano",
    email: "marco.rossi@elitebeauty.com",
    plan: "Enterprise",
    planPrice: "Annual • €3,000.00 / yr",
    paymentStatus: "In order",
    nextRenewal: "Dec 01, 2026",
    referral: "30%",
  },
  {
    id: "4",
    name: "Glamour Lounge SRLS",
    badge: "SRLS",
    ownerName: "Anna Bianchi",
    city: "Torino",
    email: "anna@glamourlounge.com",
    plan: "Premium",
    planPrice: "Annual • €2,000.00 / yr",
    paymentStatus: "Late",
    nextRenewal: "Dec 01, 2026",
    referral: "30%",
  },
  {
    id: "5",
    name: "Hair Art Studio",
    badge: "Ind.",
    ownerName: "Francesca Neri",
    city: "Roma",
    email: "francesca@hairartstudio.com",
    plan: "Basic",
    planPrice: "Annual • €1,000.00 / yr",
    paymentStatus: "Late",
    nextRenewal: "Dec 01, 2026",
    referral: "30%",
  },
  {
    id: "6",
    name: "Luxury Nails & Spa",
    badge: "SRL",
    ownerName: "Chiara Ferrari",
    city: "Napoli",
    email: "chiara@luxurynails.com",
    plan: "Premium",
    planPrice: "Annual • €2,000.00 / yr",
    paymentStatus: "In order",
    nextRenewal: "Jan 15, 2027",
    referral: "15%",
  },
  {
    id: "7",
    name: "Studio Estetica 2000",
    badge: "SNC",
    ownerName: "Giuseppe Romano",
    city: "Firenze",
    email: "giuseppe@estetica2000.it",
    plan: "Basic",
    planPrice: "Annual • €1,000.00 / yr",
    paymentStatus: "In order",
    nextRenewal: "Feb 20, 2027",
    referral: "20%",
  },
  {
    id: "8",
    name: "Barberia Centrale",
    badge: "Ind.",
    ownerName: "Luigi Costa",
    city: "Venezia",
    email: "luigi@barberiacentrale.it",
    plan: "Basic",
    planPrice: "Annual • €1,000.00 / yr",
    paymentStatus: "Late",
    nextRenewal: "Oct 10, 2026",
    referral: "10%",
  },
  {
    id: "9",
    name: "Urban Oasis Spa",
    badge: "SRL",
    ownerName: "Elena Moretti",
    city: "Genova",
    email: "elena@urbanoasis.com",
    plan: "Enterprise",
    planPrice: "Annual • €3,000.00 / yr",
    paymentStatus: "In order",
    nextRenewal: "Mar 05, 2027",
    referral: "20%",
  },
  {
    id: "10",
    name: "Capelli Perfetti",
    badge: "SAS",
    ownerName: "Antonio Russo",
    city: "Palermo",
    email: "antonio@capelliperfetti.it",
    plan: "Premium",
    planPrice: "Annual • €2,000.00 / yr",
    paymentStatus: "In order",
    nextRenewal: "Apr 12, 2027",
    referral: "15%",
  },
];

export const INITIAL_SENT_INVITATIONS: SentInvitation[] = [
  {
    id: "inv_1",
    salonName: "Beauty Wellness Center",
    email: "roberto@beautywellness.com",
    date: "Dec 01, 2026",
    status: "Accepted",
    plan: "Premium",
    planDetails: "Annual • €2,000.00 /yr",
    share: "€ 600",
    lastShare: "Last: € 600",
  },
  {
    id: "inv_2",
    salonName: "Bella Vista Salon",
    email: "maria@bellavista.com",
    date: "Dec 01, 2026",
    status: "Accepted",
    plan: "Premium",
    planDetails: "Annual • €2,000.00 /yr",
    share: "€ 600",
    lastShare: "Last: € 600",
  },
  {
    id: "inv_3",
    salonName: "Elite Beauty Group S.p.A.",
    email: "marco.rossi@elitebeauty.com",
    date: "Dec 01, 2026",
    status: "Accepted",
    plan: "Enterprise",
    planDetails: "Annual • €3,000.00 /yr",
    share: "€ 900",
    lastShare: "Last: € 900",
  },
  {
    id: "inv_4",
    salonName: "Glamour Lounge SRLS",
    email: "anna@glamourlounge.com",
    date: "Dec 01, 2026",
    status: "Pending",
    plan: "Premium",
    planDetails: "Annual • €2,000.00 /yr",
    share: "€ 600",
    lastShare: "-",
  },
  {
    id: "inv_5",
    salonName: "Hair Art Studio",
    email: "francesca@hairartstudio.com",
    date: "Dec 01, 2026",
    status: "Rejected",
    plan: "Basic",
    planDetails: "Annual • €1,000.00 /yr",
    share: "-",
    lastShare: "-",
  },
  {
    id: "inv_6",
    salonName: "Moda & Stile Milano",
    email: "info@modastile.it",
    date: "Nov 15, 2026",
    status: "Expired",
    plan: "Basic",
    planDetails: "Annual • €1,000.00 /yr",
    share: "-",
    lastShare: "-",
  },
];

export const INITIAL_RECEIVED_INVITATIONS: ReceivedInvitation[] = [
  {
    id: "rec_1",
    salonName: "Elegance Spa Roma",
    senderName: "Sarah Johnson",
    senderEmail: "sarah.j@elegancespa.it",
    message: "We would love to have you manage our accounting and monthly tax compliance.",
    sentDate: "Aug 14, 2026",
  },
  {
    id: "rec_2",
    salonName: "Urban Hair Studio Milano",
    senderName: "Mike Davis",
    senderEmail: "mike@urbanhairstudio.com",
    message: "Looking for a reliable tax advisor for our new franchise branch.",
    sentDate: "Aug 12, 2026",
  },
  {
    id: "rec_3",
    salonName: "Barbershop Deluxe Napoli",
    senderName: "Gennaro Esposito",
    senderEmail: "gennaro@barbershopdeluxe.it",
    message: "Need assistance with payroll processing and annual financial statements.",
    sentDate: "Aug 10, 2026",
  },
];

export const REVENUE_CARDS_DATA: RevenueCardData[] = [
  {
    title: "This Month",
    amount: 600,
    description: "Accrued referrals",
    type: "success",
  },
  {
    title: "Next 30 Days",
    amount: 1500,
    description: "Waiting for renewals",
    type: "primary",
  },
  {
    title: "Total Lifetime",
    amount: 5400,
    description: "All referrals accrued",
    type: "danger",
  },
  {
    title: "Withdrawable Balance",
    amount: 1500,
    description: "Available for payout",
    type: "warning",
  },
];

export const BREAKDOWN_DATA: BreakdownData[] = [
  {
    id: "1",
    salonName: "Beauty Wellness Center",
    email: "roberto@beautywellness.com",
    plan: "Premium",
    planDetails: "Annual • €2,000.00 /yr",
    share: "€ 600 (30%)",
    lastPayment: "€ 600",
    lastPaymentDate: "Dec 01, 2026",
    nextRenewal: "€ 600",
    nextRenewalDate: "Dec 01, 2027",
    lifetime: "€ 1,800",
  },
  {
    id: "2",
    salonName: "Bella Vista Salon",
    email: "maria@bellavista.com",
    plan: "Premium",
    planDetails: "Annual • €2,000.00 /yr",
    share: "€ 600 (30%)",
    lastPayment: "€ 600",
    lastPaymentDate: "Dec 01, 2026",
    nextRenewal: "€ 600",
    nextRenewalDate: "Dec 01, 2027",
    lifetime: "€ 1,800",
  },
  {
    id: "3",
    salonName: "Elite Beauty Group S.p.A.",
    email: "marco.rossi@elitebeauty.com",
    plan: "Enterprise",
    planDetails: "Annual • €3,000.00 /yr",
    share: "€ 900 (30%)",
    lastPayment: "€ 900",
    lastPaymentDate: "Jan 10, 2027",
    nextRenewal: "€ 900",
    nextRenewalDate: "Jan 10, 2028",
    lifetime: "€ 1,800",
  },
];

export const TRANSACTIONS_DATA: TransactionData[] = [
  {
    id: "tx_1",
    date: "Aug 15, 2026",
    salonName: "Beauty Wellness Center",
    email: "roberto@beautywellness.com",
    grossAmount: "€ 2,000.00",
    share: "€ 600.00",
    lifetime: "€ 1,800.00",
    status: "Paid",
    note: "INV-2026-08-001",
  },
  {
    id: "tx_2",
    date: "Aug 10, 2026",
    salonName: "Bella Vista Salon",
    email: "maria@bellavista.com",
    grossAmount: "€ 2,000.00",
    share: "€ 600.00",
    lifetime: "€ 1,800.00",
    status: "Paid",
    note: "INV-2026-08-002",
  },
  {
    id: "tx_3",
    date: "Sep 01, 2026",
    salonName: "Elite Beauty Group S.p.A.",
    email: "marco.rossi@elitebeauty.com",
    grossAmount: "€ 3,000.00",
    share: "€ 900.00",
    lifetime: "€ 2,700.00",
    status: "Expected",
    note: "Annual renewal upcoming",
  },
];

export const INITIAL_PAYOUTS_DATA: PayoutData[] = [
  {
    id: "pay_1",
    requestDate: "15 Aug 2026, 10:30",
    amount: "€ 850.00",
    invoiceNo: "PAYOUT-2026-08-001",
    status: "Paid",
    paymentDate: "18 Aug 2026, 14:00",
    note: "Processed via SEPA",
  },
  {
    id: "pay_2",
    requestDate: "01 Jul 2026, 09:15",
    amount: "€ 1,200.00",
    invoiceNo: "PAYOUT-2026-07-004",
    status: "Paid",
    paymentDate: "04 Jul 2026, 11:20",
    note: "Regular monthly referral settlement",
  },
  {
    id: "pay_3",
    requestDate: "12 Aug 2026, 16:45",
    amount: "€ 650.00",
    invoiceNo: "PAYOUT-2026-08-002",
    status: "Pending",
    paymentDate: "Est. 20 Aug 2026",
    note: "Under compliance review",
  },
];

export const INITIAL_BANK_SETTINGS: BankSettingsData = {
  iban: "IT60X0542811101000000123456",
  bankHolder: "Mario Accountant S.r.l.",
  vatNumber: "IT12345678901",
  address: "Via Roma 123, 20100 Milano",
};
