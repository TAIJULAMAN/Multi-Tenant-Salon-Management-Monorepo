/**
 * Dashboard domain type definitions.
 */

export interface CardData {
  title: string;
  value: string;
  subtext: string;
  change: string | null;
  iconType: "salaries" | "taxes" | "deadlines" | "warnings";
  bgClass: string;
  iconBgClass: string;
}

export interface Activity {
  id: string;
  title: string;
  salon: string;
  reason: string;
  priority: "High" | "Medium" | "Low";
  date: string;
  avatarImg: string;
}

export interface Salon {
  id: string;
  name: string;
  pendingSalaries: number;
  pendingTaxes: number;
  status: "Over Budget" | "On Track";
  iconBg: string;
  iconColor: string;
}

export interface BudgetExpenseItem {
  budget: number;
  expense: number;
}
