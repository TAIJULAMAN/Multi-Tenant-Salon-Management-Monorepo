export interface MacroCategoryFormData {
  id?: string;
  name: string;
  color: string;
  icon: string;
  nature: string;
  budget: string;
  isHidden: boolean;
}

export interface CategoryFormData {
  id?: string;
  name: string;
  color: string;
  icon: string;
  nature: string;
  macroCategoryId?: string;
  isHidden?: boolean;
}

export interface ExpenseRecord {
  id: string;
  date: string;
  macroCategory: { text: string; colorType: string };
  category: { text: string; colorType: string };
  cost: string;
}

export interface PaymentMethodRecord {
  id: string;
  name: string;
  type: string;
  accountNumber?: string;
  status: "Active" | "Inactive";
}

export interface RecurringPaymentRecord {
  id: string;
  name: string;
  amount: string;
  frequency: "Monthly" | "Weekly" | "Yearly";
  nextDate: string;
  category: string;
  status: "Active" | "Paused";
}

export interface RecurringPayment {
  id: string;
  payee: string;
  category: string;
  macroCategory: string;
  amount: string;
  amountNum: number;
  frequency: "Weekly" | "Bi-weekly" | "Monthly" | "Quarterly" | "Yearly";
  day: string;
  nextDate: string;
  expiration: string;
  status: "Active" | "Paused";
  note?: string;
}


