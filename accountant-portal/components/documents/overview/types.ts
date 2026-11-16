import type { LucideIcon } from "lucide-react";

export interface StatCardItem {
  title: string;
  value: string;
  icon: LucideIcon;
  bgColor: string;
  iconBgColor: string;
  iconColor: string;
}

export type FilterPeriod = "Daily" | "Weekly" | "Monthly";
