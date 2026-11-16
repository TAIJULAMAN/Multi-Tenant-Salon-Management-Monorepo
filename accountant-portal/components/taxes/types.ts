/**
 * Taxes domain type definitions.
 */

export type TaxStatus = "Pending" | "Declined";

export interface PendingTax {
  id: string;
  taxType: string;
  salon: string;
  logo?: string;
  period: string;
  amount: string;
  dueDate: string;
  status: TaxStatus;
}

export type TaxHistoryStatus = "Approved" | "Declined" | "Cancelled";

export interface TaxHistoryRecord {
  id: string;
  taxType: string;
  salon: string;
  logo?: string;
  period: string;
  amount: string;
  paidDate: string;
  status: TaxHistoryStatus;
}

export interface TaxObligation {
  month: string;
  total: number;
}

export interface AverageReceipt {
  month: string;
  revenue: number;
  taxes: number;
}
