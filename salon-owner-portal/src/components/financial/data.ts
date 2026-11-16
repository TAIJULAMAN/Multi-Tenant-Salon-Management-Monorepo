import { PaymentRecord, ReceiptRecord, GiftCardRecord } from "./types";

export const MOCK_PAYMENTS: PaymentRecord[] = [
  {
    id: "#001",
    date: "5 Aug 2025, 12:30",
    client: { name: "Maria Rodriguez", email: "maria@beautywellness.com" },
    teamMember: { name: "Emily Watson", email: "emily@beautywellness.com" },
    method: "Cash",
    status: "Fully Paid",
    receiptStatus: "Completed",
  },
  {
    id: "#002",
    date: "5 Aug 2025, 12:30",
    client: { name: "Maria Rodriguez", email: "maria@beautywellness.com" },
    teamMember: { name: "Emily Watson", email: "emily@beautywellness.com" },
    method: "Card Terminal",
    status: "Half Paid",
    receiptStatus: "Half Printed",
  },
  {
    id: "#003",
    date: "5 Aug 2025, 12:30",
    client: { name: "Maria Rodriguez", email: "maria@beautywellness.com" },
    teamMember: { name: "Emily Watson", email: "emily@beautywellness.com" },
    method: "Gift Card",
    status: "Not Paid",
    receiptStatus: "Not Issued",
  },
  {
    id: "#004",
    date: "5 Aug 2025, 12:30",
    client: { name: "Maria Rodriguez", email: "maria@beautywellness.com" },
    teamMember: { name: "Emily Watson", email: "emily@beautywellness.com" },
    method: "Online Payment",
    status: "Fully Paid",
    receiptStatus: "Completed",
  },
  {
    id: "#005",
    date: "5 Aug 2025, 12:30",
    client: { name: "Maria Rodriguez", email: "maria@beautywellness.com" },
    teamMember: { name: "Emily Watson", email: "emily@beautywellness.com" },
    method: "Online Payment",
    status: "Fully Paid",
    receiptStatus: "Completed",
  },
];

export const MOCK_RECEIPTS: ReceiptRecord[] = [
  {
    id: "#001",
    date: "5 Aug 2025, 12:30",
    clientName: "Maria Rodriguez",
    clientEmail: "maria@beautywellness.com",
    amount: 2300,
    method: "Cash, Card Terminal",
    payments: [
      { method: "Cash", amount: 1000 },
      { method: "Card Terminal", amount: 1300 },
    ],
    status: "Issued",
  },
  {
    id: "#002",
    date: "5 Aug 2025, 12:30",
    clientName: "Maria Rodriguez",
    clientEmail: "maria@beautywellness.com",
    amount: 2300,
    method: "Card Terminal",
    payments: [
      { method: "Card Terminal", amount: 2300 },
    ],
    status: "Issued",
  },
  {
    id: "#003",
    date: "5 Aug 2025, 12:30",
    clientName: "Maria Rodriguez",
    clientEmail: "maria@beautywellness.com",
    amount: 2300,
    method: "Gift Card",
    status: "Draft",
  },
  {
    id: "#004",
    date: "5 Aug 2025, 12:30",
    clientName: "Maria Rodriguez",
    clientEmail: "maria@beautywellness.com",
    amount: 2300,
    method: "Online Payment",
    status: "Canceled",
  },
  {
    id: "#005",
    date: "5 Aug 2025, 12:30",
    clientName: "Maria Rodriguez",
    clientEmail: "maria@beautywellness.com",
    amount: 2300,
    method: "Cash, Online Payment",
    payments: [
      { method: "Cash", amount: 1500 },
      { method: "Online Payment", amount: 800 },
    ],
    status: "Issued",
  },
  {
    id: "#006",
    date: "5 Aug 2025, 12:30",
    clientName: "Maria Rodriguez",
    clientEmail: "maria@beautywellness.com",
    amount: 2300,
    method: "Cash",
    status: "Draft",
  },
  {
    id: "#007",
    date: "5 Aug 2025, 12:30",
    clientName: "Maria Rodriguez",
    clientEmail: "maria@beautywellness.com",
    amount: 2300,
    method: "Gift Card",
    status: "Issued",
  },
  {
    id: "#008",
    date: "5 Aug 2025, 12:30",
    clientName: "Maria Rodriguez",
    clientEmail: "maria@beautywellness.com",
    amount: 2300,
    method: "Card Terminal",
    status: "Issued",
  },
  {
    id: "#009",
    date: "5 Aug 2025, 12:30",
    clientName: "Maria Rodriguez",
    clientEmail: "maria@beautywellness.com",
    amount: 2300,
    method: "Card Terminal",
    status: "Issued",
  },
];

export const MOCK_GIFT_CARDS: GiftCardRecord[] = [
  { id: "#0B0", issueDate: "5 Aug 2025", expirationDate: "8 Aug 2025", amount: 170, eligibleServices: "All", usageLimit: 1, status: "Used" },
  { id: "#0B1", issueDate: "5 Aug 2025", expirationDate: "8 Aug 2025", amount: 170, eligibleServices: "All", usageLimit: 1, status: "No-Used", subStatus: "Active" },
  { id: "#0B2", issueDate: "5 Aug 2025", expirationDate: "8 Aug 2025", amount: 170, eligibleServices: "Haircuts", usageLimit: 1, status: "No-Used", subStatus: "Expired" },
  { id: "#0B3", issueDate: "5 Aug 2025", expirationDate: "8 Aug 2025", amount: 170, eligibleServices: "All", usageLimit: 1, status: "Used" },
  { id: "#0B4", issueDate: "5 Aug 2025", expirationDate: "8 Aug 2025", amount: 170, eligibleServices: "All", usageLimit: 1, status: "Used" },
  { id: "#0B5", issueDate: "5 Aug 2025", expirationDate: "8 Aug 2025", amount: 170, eligibleServices: "Coloring", usageLimit: 1, status: "No-Used", subStatus: "Active" },
  { id: "#0B6", issueDate: "5 Aug 2025", expirationDate: "8 Aug 2025", amount: 170, eligibleServices: "All", usageLimit: 1, status: "No-Used", subStatus: "Expired" },
  { id: "#0B7", issueDate: "5 Aug 2025", expirationDate: "8 Aug 2025", amount: 170, eligibleServices: "Treatments", usageLimit: 1, status: "No-Used", subStatus: "Active" },
  { id: "#0B8", issueDate: "5 Aug 2025", expirationDate: "8 Aug 2025", amount: 170, eligibleServices: "All", usageLimit: 1, status: "No-Used", subStatus: "Expired" },
];



// Automations Mock Data & Templates
import { AutomationClient } from "./types";

export const AUTOMATION_CLIENTS: AutomationClient[] = [
  { id: "1", name: "Maria Fernandez", role: "Regular Client", initials: "MF", color: "bg-[#F43F5E]" },
  { id: "2", name: "Vega Button", role: "VIP Client", initials: "VB", color: "bg-[#8B5CF6]" },
  { id: "3", name: "Leo Gregory", role: "New Client", initials: "LG", color: "bg-[#F59E0B]" },
  { id: "4", name: "Mia Fernandez", role: "Regular Client", initials: "MF", color: "bg-[#10B981]" },
  { id: "5", name: "Sophie Martin", role: "VIP Client", initials: "SM", color: "bg-[#635BFF]" },
];

export const WHATSAPP_TEMPLATE = `Hello, [Name] 👋\n\nWe confirm the receipt of your payment for the service provided at our Salon 💈\n\nYour receipt is attached.\n\nThank you for choosing us! We look forward to welcoming you again soon for more moments of care and beauty. 💜\n\n[Salon Name] Team`;

export const EMAIL_TEMPLATE = `Hello, [Name] 👋\n\nWe confirm the receipt of your payment for the service provided at our Salon 💈\n\nYour receipt is attached.\n\nThank you for choosing us! We look forward to welcoming you again soon for more moments of care and beauty. 💜\n\n[Salon Name] Team`;

export const PHONE_TEMPLATE = `Hello, [Name] 👋\n\nWe confirm the receipt of your payment for the service provided at our Salon 💈\n\nYour receipt is delivered.\n\nThank you for choosing us! We look forward to welcoming you again soon for more moments of care and beauty. 💜\n\n[Salon Name] Team`;


// Imported Receipts Mock Data
import { ImportedReceipt } from "./types";

export const MOCK_IMPORTED_RECEIPTS: ImportedReceipt[] = [
  { id: "#001", receipt_number: "7891234567895", date: "02/01/2025", client_ref: "#001", total: "€ 270", vat: "€ 70", discount: "€ 10", payment_method: "Cash" },
  { id: "#001", receipt_number: "7891234567895", date: "02/01/2025", client_ref: "#001", total: "€ 270", vat: "€ 70", discount: "€ 10", payment_method: "Credit Card" },
  { id: "#001", receipt_number: "7891234567895", date: "02/01/2025", client_ref: "#001", total: "€ 270", vat: "€ 70", discount: "€ 10", payment_method: "Online Payment" },
  { id: "#001", receipt_number: "7891234567895", date: "02/01/2025", client_ref: "#001", total: "€ 270", vat: "€ 70", discount: "€ 10", payment_method: "Cash" },
  { id: "#001", receipt_number: "7891234567895", date: "02/01/2025", client_ref: "#001", total: "€ 270", vat: "€ 70", discount: "€ 10", payment_method: "Cash" },
];
