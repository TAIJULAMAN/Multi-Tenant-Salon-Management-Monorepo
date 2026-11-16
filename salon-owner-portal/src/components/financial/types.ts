export type PaymentMethod = "Cash" | "Card Terminal" | "Gift Card" | "Online Payment";
export type PaymentStatus = "Fully Paid" | "Half Paid" | "Not Paid";
export type ReceiptStatus = "Completed" | "Half Printed" | "Not Issued";

export type PaymentTab = "Cash Payment" | "Card Payments" | "Online Payments";
export type PersonalizeType = "whatsapp" | "email" | "phone" | null;

export interface AutomationClient {
  id: string;
  name: string;
  role: string;
  initials: string;
  color: string;
}

export interface ImportedReceipt {
  id: string;
  receipt_number: string;
  date: string;
  client_ref: string;
  total: string;
  vat: string;
  discount: string;
  payment_method: string;
}



export interface PaymentRecord {
  id: string;
  date: string;
  client: { name: string; email: string };
  teamMember: { name: string; email: string };
  method: PaymentMethod;
  status: PaymentStatus;
  receiptStatus: ReceiptStatus;
}

export type ReceiptState = "Issued" | "Draft" | "Canceled";

export interface ReceiptItem {
  method: string;
  amount: number;
}

export interface ReceiptRecord {
  id: string;
  date: string;
  clientName: string;
  clientEmail: string;
  amount: number;
  method: string;
  payments?: ReceiptItem[];
  status: ReceiptState;
}

export type GiftCardUsageStatus = "Used" | "No-Used";
export type GiftCardSubStatus = "Active" | "Expired";

export interface GiftCardRecord {
  id: string;
  issueDate: string;
  expirationDate: string;
  amount: number;
  eligibleServices: string;
  usageLimit: number;
  status: GiftCardUsageStatus;
  subStatus?: GiftCardSubStatus;
}

