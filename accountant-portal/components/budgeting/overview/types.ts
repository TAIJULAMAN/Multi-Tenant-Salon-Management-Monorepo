/**
 * Budgeting overview domain type definitions.
 */

export interface KPICardData {
  title: string;
  value: string;
  trend: string;
  trendType: "up" | "down" | "neutral";
  subtitle: string;
  colorType: "purple" | "pink" | "teal" | "yellow";
}

export interface UpcomingPaymentData {
  id: string;
  initial: string;
  name: string;
  description: string;
  amount: string;
  date: string;
  avatarBg: string;
}

export interface TransactionData {
  id: string;
  date: string;
  salon: {
    name: string;
    logoUrl?: string;
    avatar: string;
  };
  macroCategory:
    | "Internet"
    | "HR"
    | "Consumables"
    | "Products"
    | "Taxes"
    | "Services"
    | "Utilities";
  category: string;
  cost: string;
  supplier: string;
  paymentMethod: "Cash" | "Credit Card" | "Online" | "Terminal";
}
