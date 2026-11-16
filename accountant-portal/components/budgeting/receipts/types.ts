/**
 * Receipts domain type definitions.
 */

export type ReceiptStatus = "Issued" | "Draft" | "Canceled";

export interface ReceiptItem {
  id: string;
  date: string;
  client: { name: string; email: string };
  salon: string;
  amount: number;
  method: string[];
  status: ReceiptStatus;
}
