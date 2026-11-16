/**
 * Income domain type definitions.
 */

export interface CashierClosureRow {
  id: string;
  date: string;
  taxClosure: number;
  platformReceipts: number;
  difference: number;
  status: "Regular" | "Irregular";
}

export interface ReceiptRow {
  id: string;
  dateTime: string;
  client: { name: string; email: string };
  teamMember: { name: string; email: string };
  service: string;
  amount: number;
  paymentMethod?: string;
}

export interface PaymentRow {
  id: string;
  paymentDate: string;
  client: { name: string; email: string };
  teamMember: { name: string; email: string };
  salon: string;
  methods: string[];
  status: "Fully Paid" | "Half Paid" | "Not Paid";
  amount: number;
}
