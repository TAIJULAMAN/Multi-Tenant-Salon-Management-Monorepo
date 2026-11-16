/**
 * Payments domain type definitions.
 */

export type PaymentMethod =
  | "Cash"
  | "Card Terminal"
  | "Gift Card"
  | "Online Payment"
  | "Credit Card";

export type PaymentStatus = "Fully Paid" | "Half Paid" | "Not Paid";

export type ReceiptIssueStatus = "Completed" | "Half Printed" | "Not Issued";

export interface PaymentItem {
  id: string;
  paymentDate: string;
  client: { name: string; email: string };
  teamMember: { name: string; email: string };
  salon: string;
  method: "Cash" | "Card Terminal" | "Gift Card" | "Online Payment";
  status: PaymentStatus;
  receiptIssue: ReceiptIssueStatus;
}

export interface ImportedPaymentItem {
  id: string;
  receiptNumber: string;
  date: string;
  clientRef: string;
  total: number;
  vat: number;
  discount: number;
  paymentMethod: "Cash" | "Credit Card" | "Online Payment";
}
