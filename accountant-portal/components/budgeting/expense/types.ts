/**
 * Expense domain type definitions.
 */

export type MacroCategoryType =
  | "Internet"
  | "HR"
  | "Consumables"
  | "Products"
  | "Taxes"
  | "Services"
  | "Utilities";

export type PaymentMethodType =
  | "Cash"
  | "Credit Card"
  | "Online Payment"
  | "Terminal";

export interface NewExpenseInput {
  cost: number;
  paymentMethod: string;
  date: string;
  macroCategory: string;
  category: string;
  warranty: string;
  location: string;
  payee: string;
  note: string;
  hasAttachment: boolean;
  attachmentName?: string;
}

export interface ExpenseTransaction {
  id: string;
  date: string;
  salon: {
    name: string;
    avatar: string;
  };
  macroCategory: MacroCategoryType;
  category: string;
  cost: number; // Storing as number for filter operations/math
  supplier: string;
  paymentMethod: PaymentMethodType;
  note?: string;
  hasAttachment?: boolean;
  attachmentName?: string;
}
